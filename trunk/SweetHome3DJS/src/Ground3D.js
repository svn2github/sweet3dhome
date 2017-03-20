/*
 * Ground3D.js
 *
 * Sweet Home 3D, Copyright (c) 2017 Emmanuel PUYBARET / eTeks <info@eteks.com>
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

// Requires scene3d.js
//          Object3DBranch.js
//          TextureManager.js


/**
 * Creates a 3D ground for the given <code>home</code>.
 * @param {Home} home
 * @param {number} originX
 * @param {number} originY
 * @param {number} width
 * @param {number} depth
 * @param {boolean} waitTextureLoadingEnd
 * @constructor
 * @extends Object3DBranch
 * @author Emmanuel Puybaret
 */
function Ground3D(home, originX, originY, width, depth, waitTextureLoadingEnd) {
  Object3DBranch.call(this);
  this.setUserData(home);      
  this.originX = originX;
  this.originY = originY;
  this.width = width;
  this.depth = depth;

  var groundAppearance = new Appearance3D();
  var groundShape = new Shape3D();
  groundShape.setAppearance(groundAppearance);

  this.addChild(groundShape);
  this.update(waitTextureLoadingEnd);
}
Ground3D.prototype = Object.create(Object3DBranch.prototype);
Ground3D.prototype.constructor = Ground3D;

/**
 * Updates ground coloring and texture attributes from home ground color and texture.
 * @param {boolean} [waitTextureLoadingEnd]
 */
Ground3D.prototype.update = function(waitTextureLoadingEnd) {
  if (waitTextureLoadingEnd === undefined) {
    waitTextureLoadingEnd = false;
  }
  var home = this.getUserData();
  var groundShape = this.getChild(0);
  var currentGeometriesCount = groundShape.getGeometries().length;
  var groundAppearance = groundShape.getAppearance();
  var groundTexture = home.getEnvironment().getGroundTexture();
  if (groundTexture === null) {
    var groundColor = home.getEnvironment().getGroundColor();
    this.updateAppearanceMaterial(groundAppearance, groundColor, groundColor, 0);
    groundAppearance.setTextureImage(null);
  } else {
    this.updateAppearanceMaterial(groundAppearance, Object3DBranch.DEFAULT_COLOR, Object3DBranch.DEFAULT_COLOR, 0);
    this.updateTextureTransform(groundAppearance, groundTexture, true);
    TextureManager.getInstance().loadTexture(groundTexture.getImage(), waitTextureLoadingEnd, {
        textureUpdated: function(texture) {
          groundAppearance.setTextureImage(texture);
        },
        textureError: function(error) {
          return this.textureUpdated(TextureManager.getInstance().getErrorImage());
        },
        progression: function(part, info, percentage) {
        }
      });
  }
  
  var areaRemovedFromGround = new Area();
  var mapGet = function(level) { 
      for (var i = 0; i < this.length; i++) { 
        if (this[i].level === level) { 
          return this[i].area; 
        } 
      } 
      return null; 
    }; 
  var mapPut = function(level, area) { 
      this.push({level: level, area: area}); 
    }; 
  var undergroundAreas = [];
  undergroundAreas.put = mapPut;
  undergroundAreas.get = mapGet;
  var roomAreas = [];
  roomAreas.put = mapPut;
  roomAreas.get = mapGet;
  var rooms = home.getRooms();
  for (var i = 0; i < rooms.length; i++) {
    var room = rooms[i];
    var roomLevel = room.getLevel();
    if ((roomLevel === null || roomLevel.isViewable()) 
        && room.isFloorVisible()) {
      var roomPoints = room.getPoints();
      if (roomPoints.length > 2) {
        var roomArea = null;
        if (roomLevel === null 
            || (roomLevel.getElevation() <= 0 
                && roomLevel.isViewableAndVisible())) {
          roomArea = new Area(this.getShape(roomPoints));
          areaRemovedFromGround.add(roomArea);
          this.updateUndergroundAreas(roomAreas, room.getLevel(), roomPoints, roomArea);
        }
        this.updateUndergroundAreas(undergroundAreas, room.getLevel(), roomPoints, roomArea);
      }
    }
  }
  var furniture = home.getFurniture();
  for (var i = 0; i < furniture.length; i++) {
    var piece = furniture[i];
    if (piece.getGroundElevation() < 0 
        && (piece.getLevel() === null || piece.getLevel().isViewable())) {
      if (piece.getStaircaseCutOutShape() === null) {
        this.updateUndergroundAreas(undergroundAreas, piece.getLevel(), piece.getPoints(), null);
      } else {
        this.updateUndergroundAreas(undergroundAreas, piece.getLevel(), null, ModelManager.getInstance().getAreaOnFloor(piece));
      }
    }
  }
  var wallAreas = []; 
  wallAreas.put = mapPut;
  wallAreas.get = mapGet;
  var walls = home.getWalls();
  for (var i = 0; i < walls.length; i++) {
    var wall = walls[i];
    if (wall.getLevel() === null || wall.getLevel().isViewable()) {
      this.updateUndergroundAreas(wallAreas, wall.getLevel(), wall.getPoints(), null);
    }
  }
  for (var i = 0; i < wallAreas.length; i++) {
    var wallAreaEntry = wallAreas[i];
    var areaPoints = this.getGroundAreaPoints(wallAreaEntry.area);
    for (var j = 0; j < areaPoints.length; j++) {
      var points = areaPoints[j];
      if (!new Room(points).isClockwise()) {
        this.updateUndergroundAreas(undergroundAreas, wallAreaEntry.level, points, null);
      }
    }
  }

  var undergroundSideAreas = [];
  undergroundSideAreas.put = mapPut;
  undergroundSideAreas.get = mapGet;
  var upperLevelAreas = [];
  upperLevelAreas.put = mapPut;
  upperLevelAreas.get = mapGet;
  var levelComparator = function (entry1, entry2) {
      return -(entry1.level.getElevation() - entry2.level.getElevation());
    };
  undergroundAreas.sort(levelComparator);
  for (var i = 0; i < undergroundAreas.length; i++) {
    var undergroundAreaEntry = undergroundAreas[i];
    var level = undergroundAreaEntry.level;
    var area = undergroundAreaEntry.area;
    var areaAtStart = area.clone();
    undergroundSideAreas.put(level, area.clone());
    upperLevelAreas.put(level, new Area());
    for (var j = 0; j < undergroundAreas.length; j++) {
      var otherUndergroundAreaEntry = undergroundAreas[j];
      if (otherUndergroundAreaEntry.level.getElevation() < level.getElevation()) {
        var areaPoints = this.getGroundAreaPoints(otherUndergroundAreaEntry.area);
        for (var k = 0; k < areaPoints.length; k++) {
          var points = areaPoints[k];
          if (!new Room(points).isClockwise()) {
            var pointsArea = new Area(this.getShape(points));
            area.subtract(pointsArea);
            undergroundSideAreas.get(level).add(pointsArea);
          }
        }
      }
    }
    var areaPoints = this.getGroundAreaPoints(area);
    for (var j = 0; j < areaPoints.length; j++) {
      var points = areaPoints[j];
      if (new Room(points).isClockwise()) {
        var coveredHole = new Area(this.getShape(points));
        coveredHole.exclusiveOr(areaAtStart);
        coveredHole.subtract(areaAtStart);
        upperLevelAreas.get(level).add(coveredHole);
      } else {
        areaRemovedFromGround.add(new Area(this.getShape(points)));
      }
    }
  }
  for (var i = 0; i < undergroundAreas.length; i++) {
    var undergroundAreaEntry = undergroundAreas[i];
    var level = undergroundAreaEntry.level;
    var area = undergroundAreaEntry.area;
    var roomArea = roomAreas.get(level);
    if (roomArea !== null) {
      area.subtract(roomArea);
    }
  }
  
  var groundArea = new Area(this.getShape(
      [[this.originX, this.originY], 
       [this.originX, this.originY + this.depth], 
       [this.originX + this.width, this.originY + this.depth], 
       [this.originX + this.width, this.originY]]));
  var removedAreaBounds = areaRemovedFromGround.getBounds2D();
  if (!groundArea.getBounds2D().equals(removedAreaBounds)) {
    var outsideGroundArea = groundArea;
    if (areaRemovedFromGround.isEmpty()) {
      removedAreaBounds = new Rectangle2D.Float(Math.max(-5000.0, this.originX), Math.max(-5000.0, this.originY), 0, 0);
      removedAreaBounds.add(Math.min(5000.0, this.originX + this.width), 
          Math.min(5000.0, this.originY + this.depth));
    } else {
      removedAreaBounds.add(Math.max(removedAreaBounds.getMinX() - 5000.0, this.originX), 
          Math.max(removedAreaBounds.getMinY() - 5000.0, this.originY));
      removedAreaBounds.add(Math.min(removedAreaBounds.getMaxX() + 5000.0, this.originX + this.width), 
          Math.min(removedAreaBounds.getMaxY() + 5000.0, this.originY + this.depth));
    }
    groundArea = new Area(removedAreaBounds);
    outsideGroundArea.subtract(groundArea);
    this.addAreaGeometry(groundShape, groundTexture, outsideGroundArea, 0);
  }
  groundArea.subtract(areaRemovedFromGround);  
  // Remove level at elevation 0 if it exists as put should do
  for (var i = 0; i < undergroundAreas.length; i++) { 
    if (undergroundAreas[i].level.getElevation() === 0) { 
      undergroundAreas.splice(i, 1); 
      break;
    } 
  } 
  undergroundAreas.put(new Level("Ground", 0, 0, 0), groundArea);
  undergroundAreas.sort(levelComparator); // Sort undergroundAreas only when needed
  var previousLevelElevation = 0;
  for (var index = 0; index < undergroundAreas.length; index++) {
    var undergroundAreaEntry = undergroundAreas[index];
    var level = undergroundAreaEntry.level;
    var elevation = level.getElevation();
    this.addAreaGeometry(groundShape, groundTexture, undergroundAreaEntry.area, elevation);
    if (previousLevelElevation - elevation > 0) {
      var areaPoints = this.getGroundAreaPoints(undergroundSideAreas.get(level));
      for (var i = 0; i < areaPoints.length; i++) {
        var points = areaPoints[i];
        this.addAreaSidesGeometry(groundShape, groundTexture, points, elevation, previousLevelElevation - elevation);
      }
      this.addAreaGeometry(groundShape, groundTexture, upperLevelAreas.get(level), previousLevelElevation);
    }
    previousLevelElevation = elevation;
  }
  
  for (var i = currentGeometriesCount - 1; i >= 0; i--) {
    groundShape.removeGeometry(i);
  }
}

/**
 * Returns the list of points that defines the given area.
 * @param {Area} area
 * @return {Array}
 * @private
 */
Ground3D.prototype.getGroundAreaPoints = function(area) {
  var areaPoints = [];
  var areaPartPoints = [];
  var previousRoomPoint = null;
  for (var it = area.getPathIterator(null, 1); !it.isDone(); it.next()) {
    var roomPoint = [0, 0];
    if (it.currentSegment(roomPoint) === PathIterator.SEG_CLOSE) {
      if (areaPartPoints[0][0] === previousRoomPoint[0] 
          && areaPartPoints[0][1] === previousRoomPoint[1]) {
        areaPartPoints.splice(areaPartPoints.length - 1, 1);
      }
      if (areaPartPoints.length > 2) {
        areaPoints.push(areaPartPoints.slice(0));
      }
      areaPartPoints.length = 0;
      previousRoomPoint = null;
    } else {
      if (previousRoomPoint === null 
          || roomPoint[0] !== previousRoomPoint[0] 
          || roomPoint[1] !== previousRoomPoint[1]) {
        areaPartPoints.push(roomPoint);
      }
      previousRoomPoint = roomPoint;
    }
  }
  return areaPoints;
}

/**
 * Adds the given area to the underground areas for level below zero.
 * @param {Object} undergroundAreas
 * @param {Level} level
 * @param {Array} points
 * @param {Area} area
 * @private
 */
Ground3D.prototype.updateUndergroundAreas = function(undergroundAreas, level, points, area) {
  if (level !== null && level.getElevation() < 0) {
    var itemsArea = undergroundAreas.get(level);
    if (itemsArea === null) {
      itemsArea = new Area();
      undergroundAreas.put(level, itemsArea);
    }
    itemsArea.add(area !== null 
        ? area 
        : new Area(this.getShape(points)));
  }
}

/**
 * Adds to ground shape the geometry matching the given area.
 * @param {Shape3D} groundShape
 * @param {HomeTexture} groundTexture
 * @param {Area} area
 * @param {number} elevation
 * @private
 */
Ground3D.prototype.addAreaGeometry = function(groundShape, groundTexture, area, elevation) {
  var areaPoints = this.getAreaPoints(area, 1, false);
  if (areaPoints.length != 0) {
    var vertexCount = 0;
    var stripCounts = new Array(areaPoints.length);
    for (var i = 0; i < stripCounts.length; i++) {
      stripCounts[i] = areaPoints[i].length;
      vertexCount += stripCounts[i];
    }
    var geometryCoords = new Array(vertexCount);
    var geometryTextureCoords = groundTexture !== null 
        ? new Array(vertexCount) 
        : null;
        
    var j = 0;
    for (var index = 0; index < areaPoints.length; index++) {
      var areaPartPoints = areaPoints[index];
      for (var i = 0; i < areaPartPoints.length; i++, j++) {
        var point = areaPartPoints[i];
        geometryCoords[j] = vec3.fromValues(point[0], elevation, point[1]);
        if (groundTexture !== null) {
          geometryTextureCoords[j] = vec2.fromValues(point[0] - this.originX, this.originY - point[1]);
        }
      }
    }
      
    var geometryInfo = new GeometryInfo(GeometryInfo.POLYGON_ARRAY);
    geometryInfo.setCoordinates(geometryCoords);
    if (groundTexture !== null) {
      geometryInfo.setTextureCoordinates(geometryTextureCoords);
    }
    geometryInfo.setStripCounts(stripCounts);
    geometryInfo.setCreaseAngle(0);
    geometryInfo.setGeneratedNormals(true);
    groundShape.addGeometry(geometryInfo.getIndexedGeometryArray());
  }
}
  
/**
 * Adds to ground shape the geometry matching the given area sides.
 * @param {Shape3D} groundShape
 * @param {HomeTexture} groundTexture
 * @param {Array} areaPoints
 * @param {number} elevation
 * @param {number} sideHeight
 * @private
 */
Ground3D.prototype.addAreaSidesGeometry = function(groundShape, groundTexture, areaPoints, elevation, sideHeight) {
  var geometryCoords = new Array(areaPoints.length * 4);
  var geometryTextureCoords = groundTexture !== null 
      ? new Array(geometryCoords.length) 
      : null;
  for (var i = 0, j = 0; i < areaPoints.length; i++) {
    var point = areaPoints[i];
    var nextPoint = areaPoints[i < areaPoints.length - 1 ? i + 1 : 0];
    geometryCoords[j++] = vec3.fromValues(point[0], elevation, point[1]);
    geometryCoords[j++] = vec3.fromValues(point[0], elevation + sideHeight, point[1]);
    geometryCoords[j++] = vec3.fromValues(nextPoint[0], elevation + sideHeight, nextPoint[1]);
    geometryCoords[j++] = vec3.fromValues(nextPoint[0], elevation, nextPoint[1]);
    if (groundTexture !== null) {
      var distance = Point2D.distance(point[0], point[1], nextPoint[0], nextPoint[1]);
      geometryTextureCoords[j - 4] = vec2.fromValues(point[0], elevation);
      geometryTextureCoords[j - 3] = vec2.fromValues(point[0], elevation + sideHeight);
      geometryTextureCoords[j - 2] = vec2.fromValues(point[0] - distance, elevation + sideHeight);
      geometryTextureCoords[j - 1] = vec2.fromValues(point[0] - distance, elevation);
    }
  }
  
  var geometryInfo = new GeometryInfo(GeometryInfo.QUAD_ARRAY);
  geometryInfo.setCoordinates(geometryCoords);
  if (groundTexture !== null) {
    geometryInfo.setTextureCoordinates(geometryTextureCoords);
  }
  geometryInfo.setCreaseAngle(0);
  geometryInfo.setGeneratedNormals(true);
  groundShape.addGeometry(geometryInfo.getIndexedGeometryArray());
}
