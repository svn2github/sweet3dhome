/*
 * HomeRecorder.js
 *
 * Sweet Home 3D, Copyright (c) 2015 Emmanuel PUYBARET / eTeks <info@eteks.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

// Requires jszip.min.js
//          URLContent.js
//          big.js
//          BackgroundImage.js
//          HomeObject.js
//          Camera.js
//          Home.js
//          HomeEnvironment.js
//          HomeFurnitureGroup.js
//          HomeMaterial.js
//          HomePieceOfFurniture.js
//          HomeTexture.js
//          Level.js
//          ObserverCamera.js
//          TextStyle.js          

/**
 * Creates a home recorder able to read homes from URLs.
 * @constructor
 * @author Emmanuel Puybaret
 */
function HomeRecorder() {
}

HomeRecorder.READING_HOME = "Reading home";
HomeRecorder.PARSING_HOME = "Parsing home";

/**
 * Reads a home instance from its <code>url</code>.
 * @param url  URL of the read home
 * @param {zipReady, zipError, progression} observer  The callbacks used to follow the reading of the home 
 */
HomeRecorder.prototype.readHome = function(url, observer) {
  observer.progression(HomeRecorder.READING_HOME, url, 0);
  var recorder = this;
  ZIPTools.getZIP(url,
      {
        zipReady: function(zip) {
          try {
            var homeXmlEntry = zip.file("Home.xml");
            if (homeXmlEntry !== null) {
              recorder.parseHomeXMLEntry(zip.file("Home.xml"), zip, url, observer);
            } else {
              this.zipError("No Home.xml entry in " + url);
            }
          } catch (ex) {
            this.zipError(ex);
          }
        },
        zipError: function(error) {
          if (observer.homeError !== undefined) {
            observer.homeError(error);
          }
        },
        progression: function(part, info, percentage) {
          if (observer.progression !== undefined) {
            observer.progression(HomeRecorder.READING_HOME, url, percentage);
          }
        }
      });
}

/**
 * Parses the content of the given entry to create the home object it contains. 
 * @private
 */
HomeRecorder.prototype.parseHomeXMLEntry = function(homeXmlEntry, zip, zipUrl, observer) {
  var xmlContent = homeXmlEntry.asText();
  observer.progression(HomeRecorder.READING_HOME, homeXmlEntry.name, 1);
  
  observer.progression(HomeRecorder.PARSING_HOME, homeXmlEntry.name, 0);
  var document = new DOMParser().parseFromString(xmlContent, "text/xml");
  
  var home = this.getHomeObject(document.documentElement, zipUrl, {}); 
  
  observer.progression(HomeRecorder.PARSING_HOME, homeXmlEntry.name, 1);
  observer.homeLoaded(home);
}

/**
 * Returns the home object matching the given element.
 * @param {Element} element
 * @param {string} zipUrl
 * @param {levelsMap: Object.<string, Level>} params
 * @return {Object}
 * @protected
 * @ignore
 */
HomeRecorder.prototype.getHomeObject = function(element, zipUrl, params) {
  switch (element.tagName) {
    case "home" :
      return this.getHome(element, zipUrl, params);
    case "furnitureGroup" :
    case "pieceOfFurniture" : 
    case "doorOrWindow" :
    case "light" :
      return this.getPieceOfFurniture(element, zipUrl, params);
    default :
      return null;
  }
}

/**
 * Returns the home matching the given element.
 * @param {Element} pieceElement
 * @param {string} zipUrl
 * @return {Home}
 * @private
 */
HomeRecorder.prototype.getHome = function(homeElement, zipUrl, params) {
  var wallHeight = parseFloat(homeElement.getAttribute("wallHeight"));
  if (isNaN(wallHeight)) {
    wallHeight = undefined;
  } 
  var home = new Home(wallHeight);
  home.setVersion(parseInt(homeElement.getAttribute("version")));
  home.setName(homeElement.getAttribute("name"));
  this.parseProperties(homeElement, home);
  // Parse environment
  var environment = this.getHomeEnvironment(homeElement.getElementsByTagName("environment") [0], zipUrl);
  var homeEnvironment = home.getEnvironment();
  homeEnvironment.setObserverCameraElevationAdjusted(environment.isObserverCameraElevationAdjusted());
  homeEnvironment.setGroundColor(environment.getGroundColor());
  homeEnvironment.setGroundTexture(environment.getGroundTexture());
  homeEnvironment.setSkyColor(environment.getSkyColor());
  homeEnvironment.setSkyTexture(environment.getSkyTexture());
  homeEnvironment.setLightColor(environment.getLightColor());
  homeEnvironment.setWallsAlpha(environment.getWallsAlpha());
  homeEnvironment.setDrawingMode(environment.getDrawingMode());
  homeEnvironment.setSubpartSizeUnderLight(environment.getSubpartSizeUnderLight());
  homeEnvironment.setAllLevelsVisible(environment.isAllLevelsVisible());
  homeEnvironment.setPhotoHeight(environment.getPhotoHeight());
  homeEnvironment.setPhotoAspectRatio(environment.getPhotoAspectRatio());
  homeEnvironment.setVideoWidth(environment.getVideoWidth());
  homeEnvironment.setVideoAspectRatio(environment.getVideoAspectRatio());
  homeEnvironment.setVideoQuality(environment.getVideoQuality());
  homeEnvironment.setVideoFrameRate(environment.getVideoFrameRate());
  homeEnvironment.setVideoCameraPath(environment.getVideoCameraPath());
  
  // Parse cameras
  var storedCameras = [];
  for (var i = 0; i < homeElement.childNodes.length; i++) {
    var element = homeElement.childNodes [i];
    if (element.tagName == "camera" 
        || element.tagName == "observerCamera") {
      var camera = this.getCamera(element, zipUrl);
      if (element.getAttribute("attribute") == "observerCamera") {
        home.getObserverCamera().setCamera(camera);
      } else if (element.getAttribute("attribute") == "topCamera") {
        home.getTopCamera().setCamera(camera);
      } else {
        storedCameras.push(camera);
      }
    } else if (element.tagName == "level") {
      break;
    }
  }
  home.setStoredCameras(storedCameras);
  home.setCamera(homeElement.getAttribute("camera") == "observerCamera"
     ? home.getObserverCamera()
     : home.getTopCamera());
  // Parse levels
  var levelsMap = this.getLevels(homeElement.getElementsByTagName("level"), zipUrl);
  for (var key in levelsMap) {
    home.addLevel(levelsMap [key]);
  }
  params.levelsMap = levelsMap;

  // Parse furniture
  for (var i = 0; i < homeElement.childNodes.length; i++) {
    var element = homeElement.childNodes [i];
    var object = this.getHomeObject(element, zipUrl, params);
    if (object instanceof HomePieceOfFurniture) {
      home.setSelectedLevel(object.getLevel());
      home.addPieceOfFurniture(object);
    }
  }
  home.setSelectedLevel(homeElement.hasAttribute("selectedLevel") 
      ? levelsMap [homeElement.getAttribute("selectedLevel")]
      : null);
  if (homeElement.hasAttribute("structure")) {
    home.structure = this.getContent(homeElement, "structure", zipUrl);
  }
  return home;
}

/**
 * Returns a home environment matching the given element.
 * @param {Element} environmentElement
 * @param {string} zipUrl
 * @returns {HomeEnvironment}
 * @private
 */
HomeRecorder.prototype.getHomeEnvironment = function(environmentElement, zipUrl) {
  var groundColor = environmentElement.hasAttribute("groundColor")
      ? parseInt("0x" + environmentElement.getAttribute("groundColor"))
      : null;
  var skyColor = environmentElement.hasAttribute("skyColor")
      ? parseInt("0x" + environmentElement.getAttribute("skyColor"))
      : null;
  var lightColor = parseInt("0x" + environmentElement.getAttribute("lightColor"));
  var wallsAlpha = environmentElement.hasAttribute("wallsAlpha")
      ? parseFloat(environmentElement.getAttribute("wallsAlpha"))
      : 0;
  var allLevelsVisible = "true" == environmentElement.getAttribute("allLevelsVisible");
  var observerCameraElevationAdjusted = "false" != environmentElement.getAttribute("observerCameraElevationAdjusted");
  var textureElements = environmentElement.getElementsByTagName("texture");
  var groundTexture = null;
  var skyTexture = null;
  for (var i = 0; i < textureElements.length; i++) {
    var textureElement = textureElements [i];
    var texture = this.getTexture(textureElement, zipUrl);
    if (textureElement.getAttribute("attribute") == "skyTexture") {
      skyTexture = texture;
    } else if (textureElement.getAttribute("attribute") == "groundTexture") {
      groundTexture = texture;
    } 
  }
  var cameraPath = [];
  for (var i = 0; i < environmentElement.childNodes.length; i++) {
    var element = environmentElement.childNodes [i];
    if (element.tagName == "camera" 
        || element.tagName == "observerCamera") {
      var camera = this.getCamera(element, zipUrl);
      if (element.getAttribute("attribute") == "cameraPath") {
        cameraPath.push(camera);
      }
    }
  }
  var environment = new HomeEnvironment(groundColor, groundTexture, skyColor, skyTexture, lightColor, wallsAlpha);
  environment.setAllLevelsVisible(allLevelsVisible);
  environment.setObserverCameraElevationAdjusted(observerCameraElevationAdjusted);
  environment.setVideoCameraPath(cameraPath);
  return environment;
}

/**
 * Returns a camera matching the given element.
 * @param {Element} cameraElement
 * @param {String} zipUrl
 * @returns {Camera}
 * @private
 */
HomeRecorder.prototype.getCamera = function(cameraElement, zipUrl) {
  var name = cameraElement.getAttribute("name");
  var lensString = cameraElement.getAttribute("lens");
  var x   = parseFloat(cameraElement.getAttribute("x"));
  var y   = parseFloat(cameraElement.getAttribute("y"));
  var z   = parseFloat(cameraElement.getAttribute("z"));
  var yaw = parseFloat(cameraElement.getAttribute("yaw"));
  var pitch       = parseFloat(cameraElement.getAttribute("pitch"));
  var fieldOfView = parseFloat(cameraElement.getAttribute("fieldOfView"));
  var time        = cameraElement.getAttribute("time");
  var fixedSize   = "true" == cameraElement.getAttribute("fixedSize"); 
  var lens;
  if (lensString == "NORMAL") {
    lens = Camera.Lens.NORMAL;
  } else if (lensString == "FISHEYE") {
    lens = Camera.Lens.FISHEYE;
  } else if (lensString == "SPHERICAL") {
    lens = Camera.Lens.SPHERICAL;
  } else {
    lens = Camera.Lens.PINHOLE;
  } 
  var camera;
  if (cameraElement.tagName == "observerCamera") {
    camera = new ObserverCamera(x, y, z, yaw, pitch, fieldOfView, time, lens);
    camera.setFixedSize(fixedSize);
  } else {
    camera = new Camera(x, y, z, yaw, pitch, fieldOfView, time, lens);
  }
  this.parseProperties(cameraElement, camera);
  camera.setName(name);
  return camera;
}

/**
 * Returns a map of levels matching the given elements.
 * @param {Element[]} levelElements
 * @param {string}    zipUrl
 * @returns {Object.<string, Level>}
 * @private
 */
HomeRecorder.prototype.getLevels = function(levelElements, zipUrl) {
  var levelsMap = {};
  for (var i = 0; i < levelElements.length; i++) {
    var levelElement = levelElements [i];
    var id = levelElement.getAttribute("id");
    var name = levelElement.getAttribute("name");
    var elevation      = parseFloat(levelElement.getAttribute("elevation"));
    var floorThickness = parseFloat(levelElement.getAttribute("floorThickness"));
    var height         = parseFloat(levelElement.getAttribute("height"));
    var elevationIndex = parseInt(levelElement.getAttribute("elevationIndex"));
    var visible        = "false" != levelElement.getAttribute("visible");
    var viewable       = "false" != levelElement.getAttribute("viewable");
    var level = new Level(name, elevation, floorThickness, height);
    this.parseProperties(levelElement, level);
    level.setElevationIndex(elevationIndex);
    level.setVisible(visible);
    level.setViewable(viewable);
    levelsMap [id] = level;
  }
  return levelsMap;
}

/**
 * Returns a piece of furniture or a group matching the given element.
 * @param {Element} pieceElement
 * @param {string} zipUrl
 * @param {levelsMap: {Object.<string, Level>} params parameters with levels map
 * @return {HomePieceOfFurniture}
 * @private
 */
HomeRecorder.prototype.getPieceOfFurniture = function(pieceElement, zipUrl, params) {
  var levelsMap = params.levelsMap;
  var level = pieceElement.hasAttribute("level")  
      ? levelsMap [pieceElement.getAttribute("level")] 
      : null;
  var name  = pieceElement.getAttribute("name");
  var catalogId = pieceElement.hasAttribute("catalogId") 
      ? pieceElement.getAttribute("catalogId")
      : null;
  var creator = pieceElement.hasAttribute("creator") 
      ? pieceElement.getAttribute("creator")
      : null;
  var model = this.getContent(pieceElement, "model", zipUrl);
  var icon  = this.getContent(pieceElement, "icon", zipUrl);
  var planIcon = this.getContent(pieceElement, "planIcon", zipUrl);
  var x = parseFloat(pieceElement.getAttribute("x"));
  var y = parseFloat(pieceElement.getAttribute("y"));
  var elevation = pieceElement.hasAttribute("elevation")
      ? parseFloat(pieceElement.getAttribute("elevation"))
      : 0;
  var angle = pieceElement.hasAttribute("angle")
      ? parseFloat(pieceElement.getAttribute("angle"))
      : 0;
  var width  = parseFloat(pieceElement.getAttribute("width"));
  var depth  = parseFloat(pieceElement.getAttribute("depth"));
  var height = parseFloat(pieceElement.getAttribute("height"));
  var backFaceShown = "true" == pieceElement.getAttribute("backFaceShown");
  var modelMirrored = "true" == pieceElement.getAttribute("modelMirrored");
  var visible = "false" != pieceElement.getAttribute("visible");
  var color = pieceElement.hasAttribute("color")
      ? parseInt("0x" + pieceElement.getAttribute("color"))
      : null;
  var shininess = pieceElement.hasAttribute("shininess") 
      ? parseFloat(pieceElement.getAttribute("shininess")) 
      : null;
  var modelRotation;
  if (pieceElement.hasAttribute("modelRotation")) {
    var values = pieceElement.getAttribute("modelRotation").split(/\s+/);
    modelRotation = [[parseFloat(values [0]), parseFloat(values [1]), parseFloat(values [2])], 
                     [parseFloat(values [3]), parseFloat(values [4]), parseFloat(values [5])], 
                     [parseFloat(values [6]), parseFloat(values [7]), parseFloat(values [8])]];
  } else {
    modelRotation = null;
  }
  var description = pieceElement.hasAttribute("description") 
      ? pieceElement.getAttribute("description")
      : null;
  var information = pieceElement.hasAttribute("information") 
      ? pieceElement.getAttribute("information")
      : null;
  var movable = "false" != pieceElement.getAttribute("movable");
  var doorOrWindow = "true" == pieceElement.getAttribute("doorOrWindow") || pieceElement.tagName == "doorOrWindow";
  var resizable  = "false" !=  pieceElement.getAttribute("resizable");
  var deformable = "false" != pieceElement.getAttribute("deformable");
  var texturable = "false" != pieceElement.getAttribute("texturable");
  var price = pieceElement.hasAttribute("price") 
      ? new Big(pieceElement.getAttribute("price"))
      : null;
  var valueAddedTaxPercentage = pieceElement.hasAttribute("valueAddedTaxPercentage") 
      ? new Big(pieceElement.getAttribute("valueAddedTaxPercentage"))
      : null;
  var currency = pieceElement.hasAttribute("currency") 
      ? pieceElement.getAttribute("currency")
      : null;
  var staircaseCutOutShape = pieceElement.hasAttribute("staircaseCutOutShape") 
      ? pieceElement.getAttribute("staircaseCutOutShape")
      : null;
  var dropOnTopElevation = pieceElement.hasAttribute("dropOnTopElevation")
      ? parseFloat(pieceElement.getAttribute("dropOnTopElevation"))
      : 1;
      
  var furniture = [];
  var texture = null;
  var modelMaterials = null;
  for (var i = 0; i < pieceElement.childNodes.length; i++) {
    var element = pieceElement.childNodes [i];
    if (element.tagName == "texture") {
      texture = this.getTexture(element, zipUrl);
    } else if (element.tagName == "material") {
      if (modelMaterials === null) {
        modelMaterials = [];
      }
      modelMaterials.push(this.getMaterial(element, zipUrl));
    } else {
      var homeObject = this.getHomeObject(element, zipUrl, params);
      if (homeObject instanceof HomePieceOfFurniture) {
        furniture.push(homeObject);
      }
    }
  }
  var piece;
  if (pieceElement.tagName == "furnitureGroup") {
    piece = new HomeFurnitureGroup(furniture, angle, modelMirrored, name);
    if (price != null) {
      piece.setPrice(price);
    }
    piece.setMovable(movable);
  } else {
    piece = new HomePieceOfFurniture(new CatalogPieceOfFurniture(catalogId, name, description, information, null, null, null, 
        icon, planIcon, model, width, depth, height, elevation, dropOnTopElevation, 
        movable, doorOrWindow, color, staircaseCutOutShape, modelRotation, backFaceShown, 
        creator, resizable, deformable, texturable, 
        price, valueAddedTaxPercentage, currency, false));
    piece.setX(x);
    piece.setY(y);
    piece.setAngle(angle);
    if (piece.isResizable()) {
      piece.setModelMirrored(modelMirrored);
    }
    if (piece.isTexturable()) {
      piece.setTexture(texture);
      piece.setModelMaterials(modelMaterials);
      piece.setShininess(shininess);
    }
  }
  this.parseProperties(pieceElement, piece);
  piece.setVisible(visible);
  piece.setLevel(level);
  return piece;
}

/**
 * Parses the property children of the given element.
 * @param {Element} element
 * @param {HomeObject|Home} homeObject
 * @private
 */
HomeRecorder.prototype.parseProperties = function(element, homeObject) {
  for (var i = 0; i < element.childNodes.length; i++) {
    var childElement = element.childNodes [i];
    if (childElement.tagName == "property") {
      homeObject.setProperty(childElement.getAttribute("name"), childElement.getAttribute("value"));
    }
  }
}
  
/**
 * Returns a material matching the given element. 
 * @param {Element} materialElement
 * @param {string} zipUrl
 * @return {HomeMaterial}
 * @private
 */
HomeRecorder.prototype.getMaterial = function(materialElement, zipUrl) {
  var name = materialElement.getAttribute("name");
  var color = materialElement.hasAttribute("color")
      ? parseInt("0x" + materialElement.getAttribute("color"))
      : null
  var shininess = materialElement.hasAttribute("shininess") 
      ? parseFloat(materialElement.getAttribute("shininess")) 
      : null;
  var key = materialElement.hasAttribute("key")
      ? materialElement.getAttribute("key")
      : null
  var texture;
  var textureElements = materialElement.getElementsByTagName("texture");
  if (textureElements.length !== 0) {
    texture = this.getTexture(textureElements [0], zipUrl);
  } else {
    texture = null;
  }
  return new HomeMaterial(name, key, color, texture, shininess);
}

/**
 * Returns a texture matching the given element.
 * @param {Element} textureElement
 * @param {string} zipUrl
 * @return {HomeTexture}
 * @private
*/
HomeRecorder.prototype.getTexture = function(textureElement, zipUrl) {
  var name = textureElement.getAttribute("name");
  var catalogId = textureElement.getAttribute("catalogId");
  var width  = parseFloat(textureElement.getAttribute("width"));
  var height = parseFloat(textureElement.getAttribute("height"));
  var angle  = textureElement.hasAttribute("angle")
      ? parseFloat(textureElement.getAttribute("angle"))
      : 0;
  var leftToRightOriented = "false" != textureElement.getAttribute("leftToRightOriented");
  var image  = this.getContent(textureElement, "image", zipUrl);
  return new HomeTexture(new CatalogTexture(catalogId, name, image, width, height, null), angle, leftToRightOriented);
}

/**
 * Returns the content in the attribute of the given element.
 * @param {Element} element
 * @param {string}  entryAttribute
 * @param {string} zipUrl
 * @return {URLContent}
 * @private
 */
HomeRecorder.prototype.getContent = function(element, entryAttribute, zipUrl) {
  if (element.hasAttribute(entryAttribute)) {
    var entry = element.getAttribute(entryAttribute);
    if (entry.match(/\w+:\/\/\w+/)) {
      return new URLContent(entry);
    } else {
      return new URLContent("jar:" + zipUrl + "!/" + entry);
    }
  } else {
    return null;
  }
}
