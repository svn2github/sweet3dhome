/*
 * HomeController3D.js
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

// Requires UserPreferences.js
//          Home.js
//          HomeObject.js
//          HomePieceOfFurniture.js

/**
 * Creates the controller of home 3D view.
 * @param {Home} home the home edited by this controller and its view
 * @param {UserPreferences} preferences user preferences
 * @param [viewFactory]
 * @param [contentManager]
 * @param [undoSupport]
 * @constructor
 * @author Emmanuel Puybaret
 */
function HomeController3D(home, preferences, viewFactory, contentManager, undoSupport) {
  this.home = home;
  this.preferences = preferences;
  this.viewFactory = viewFactory;
  this.contentManager = contentManager;
  this.undoSupport = undoSupport;
  this.home3DView = null;
  // Initialize states
  this.topCameraState = new TopCameraState(home, preferences);
  this.observerCameraState = new ObserverCameraState(home, preferences);
  // Set default state 
  this.cameraState = null;
  this.setCameraState(home.getCamera() === home.getTopCamera() 
      ? this.topCameraState
      : this.observerCameraState);
  this.addModelListeners(home);
}

/**
 * Add listeners to model to update camera position accordingly.
 * @private
 */
HomeController3D.prototype.addModelListeners = function(home) {
  var controller3D = this;
  home.addPropertyChangeListener("CAMERA", 
      function(ev) {
        controller3D.setCameraState(home.getCamera() == home.getTopCamera() 
            ? controller3D.topCameraState
            : controller3D.observerCameraState);
      });
  // Add listeners to adjust observer camera elevation when the elevation of the selected level  
  // or the level selection change
  var levelElevationChangeListener = function(ev) {
      if ("ELEVATION" == ev.getPropertyName()
          && home.getEnvironment().isObserverCameraElevationAdjusted()) {
        home.getObserverCamera().setZ(Math.max(controller3D.getObserverCameraMinimumElevation(home), 
            home.getObserverCamera().getZ() + ev.getNewValue() - ev.getOldValue()));
      }
    };
  var selectedLevel = home.getSelectedLevel();
  if (selectedLevel !== null) {
    selectedLevel.addPropertyChangeListener(levelElevationChangeListener);
  }
  home.addPropertyChangeListener("SELECTED_LEVEL", 
      function(ev) {
        var oldSelectedLevel = ev.getOldValue();
        var selectedLevel = home.getSelectedLevel();
        if (home.getEnvironment().isObserverCameraElevationAdjusted()) {
          home.getObserverCamera().setZ(Math.max(controller3D.getObserverCameraMinimumElevation(home), 
              home.getObserverCamera().getZ() 
              + (selectedLevel === null ? 0 : selectedLevel.getElevation()) 
              - (oldSelectedLevel === null ? 0 : oldSelectedLevel.getElevation())));
        }
        if (oldSelectedLevel !== null) {
          oldSelectedLevel.removePropertyChangeListener(levelElevationChangeListener);
        }
        if (selectedLevel !== null) {
          selectedLevel.addPropertyChangeListener(levelElevationChangeListener);
        }
      });     
  // Add a listener to home to update visible levels according to selected level
  var selectedLevelListener = function(ev) {
      var levels = home.getLevels();
      var selectedLevel = home.getSelectedLevel();
      var visible = true;
      for (var i = 0; i < levels.length; i++) {
        levels [i].setVisible(visible);
        if (levels [i] === selectedLevel
            && !home.getEnvironment().isAllLevelsVisible()) {
          visible = false;
        }
      }
    };
  home.addPropertyChangeListener("SELECTED_LEVEL", selectedLevelListener);     
  home.getEnvironment().addPropertyChangeListener("ALL_LEVELS_VISIBLE", selectedLevelListener);
}

/**
 * @private  
 */
HomeController3D.prototype.getObserverCameraMinimumElevation = function(home) {
  var levels = home.getLevels();
  var minimumElevation = levels.length === 0  ? 10  : 10 + levels [0].getElevation();
  return minimumElevation;
}

/**
 * Returns the view associated with this controller.
 * @private
 */
HomeController3D.prototype.getView = function() {
  // Create view lazily only once it's needed
  if (this.home3DView == null) {
    this.home3DView = this.viewFactory.createView3D(this.home, this.preferences, this);
  }
  return this.home3DView;
}

/**
 * Changes home camera for the top camera in {@link Home}.
 */
HomeController3D.prototype.viewFromTop = function() {
  this.home.setCamera(this.home.getTopCamera());
}

/**
 * Changes home camera for the observer camera in {@link Home}.
 */
HomeController3D.prototype.viewFromObserver = function() {
  this.home.setCamera(this.home.getObserverCamera());
}

/**
 * Stores a clone of the current camera in home under the given <code>name</code>.
 * @param {string} name
 */
HomeController3D.prototype.storeCamera = function(name) {
  var camera = this.home.getCamera().clone();
  camera.setName(name);
  var homeStoredCameras = this.home.getStoredCameras();
  var storedCameras = [];
  storedCameras.push.apply(storedCameras, homeStoredCameras);
  // Don't keep two cameras with the same name or the same location
  for (var i = storedCameras.length; i >= 0; i--) {
    var storedCamera = storedCameras [i];
    if (name == storedCamera.getName()
        || (camera.getX() == storedCamera.getX()
            && camera.getY() == storedCamera.getY()
            && camera.getZ() == storedCamera.getZ()
            && camera.getPitch() == storedCamera.getPitch()
            && camera.getYaw() == storedCamera.getYaw()
            && camera.getFieldOfView() == storedCamera.getFieldOfView()
            && camera.getTime() == storedCamera.getTime()
            && camera.getLens() == storedCamera.getLens())) {
      storedCameras.splice(i, 1);
    }
  }
  storedCameras.splice(0, 0, camera);
  // Ensure home stored cameras don't contain more cameras than allowed
  while (storedCameras.length > this.preferences.getStoredCamerasMaxCount()) {
    storedCameras.splice(storedCameras.length - 1);
  }
  this.home.setStoredCameras(storedCameras);
}

/**
 * Switches to observer or top camera and move camera to the values as the current camera.
 * @param {Camera} camera
 */
HomeController3D.prototype.goToCamera = function(camera) {
  if (camera instanceof ObserverCamera) {
    this.viewFromObserver();
  } else {
    this.viewFromTop();
  }
  this.cameraState.goToCamera(camera);
  // Reorder cameras
  var storedCameras = this.home.getStoredCameras().slice(0);
  storedCameras.splice(storedCameras.indexOf(camera), 1);
  storedCameras.splice(0, 0, camera);
  this.home.setStoredCameras(storedCameras);
}

/**
 * Deletes the given list of cameras from the ones stored in home.
 * @param {Camera []} cameras
 */
HomeController3D.prototype.deleteCameras = function(cameras) {
  var homeStoredCameras = this.home.getStoredCameras();
  // Build a list of cameras that will contain only the cameras not in the camera list in parameter
  var storedCameras = [];
  for (var i = 0; i < homeStoredCameras.length; i++) {
    var camera = homeStoredCameras [i];
    if (cameras.indexOf(camera) === -1) {
      storedCameras.push(camera);
    }
  }
  this.home.setStoredCameras(storedCameras);
}

/**
 * Makes all levels visible.
 */
HomeController3D.prototype.displayAllLevels = function() {
  this.home.getEnvironment().setAllLevelsVisible(true);
}

/**
 * Makes the selected level and below visible.
 */
HomeController3D.prototype.displaySelectedLevel = function() {
  this.home.getEnvironment().setAllLevelsVisible(false);
}

/**
 * Controls the edition of 3D attributes. 
 */
HomeController3D.prototype.modifyAttributes = function() {
  // TODO Implement Home3DAttributesController
  // new Home3DAttributesController(this.home, this.preferences, 
  //     this.viewFactory, this.contentManager, this.undoSupport).displayView(getView());    
}

/**
 * Changes current state of controller.
 * @param {CameraControllerState} state
 * @protected
 * @ignore
 */
HomeController3D.prototype.setCameraState = function(state) {
  if (this.cameraState !== null) {
    this.cameraState.exit();
  }
  this.cameraState = state;
  this.cameraState.enter();
}

/**
 * Moves home camera of <code>delta</code>.
 * @param {number} delta  the value in cm that the camera should move forward 
 *                        (with a negative delta) or backward (with a positive delta)
 */
HomeController3D.prototype.moveCamera = function(delta) {
  this.cameraState.moveCamera(delta);
}

/**
 * Moves home camera sideways of <code>delta</code>.
 * @param {number} delta  the value in cm that the camera should move left 
 *                        (with a negative delta) or right (with a positive delta)
 */
HomeController3D.prototype.moveCameraSideways = function(delta) {
  this.cameraState.moveCameraSideways(delta);
}

/**
 * Elevates home camera of <code>delta</code>. 
 * @param {number} delta  the value in cm that the camera should move down 
 *                        (with a negative delta) or up (with a positive delta)
 */
HomeController3D.prototype.elevateCamera = function(delta) {
  this.cameraState.elevateCamera(delta);
}

/**
 * Rotates home camera yaw angle of <code>delta</code> radians.
 * @param {number} delta  the value in rad that the camera should turn around yaw axis
 */
HomeController3D.prototype.rotateCameraYaw = function(delta) {
  this.cameraState.rotateCameraYaw(delta);
}

/**
 * Rotates home camera pitch angle of <code>delta</code> radians.
 * @param {number} delta  the value in rad that the camera should turn around pitch axis
 */
HomeController3D.prototype.rotateCameraPitch = function(delta) {
  this.cameraState.rotateCameraPitch(delta);
}

/**
 * Returns the observer camera state.
 * @protected
 * @ignore
 */
HomeController3D.prototype.getObserverCameraState = function() {
  return this.observerCameraState;
}

/**
 * Returns the top camera state.
 * @protected
 * @ignore
 */
HomeController3D.prototype.getTopCameraState = function() {
  return this.topCameraState;
}


/**
 * Controller state classes super class.
 * @constructor
 * @protected
 * @ignore
 */
function CameraControllerState() {
}

/**
 * @protected
 * @ignore
 */
CameraControllerState.prototype.enter = function() {
}

/**
 * @protected
 * @ignore
 */
CameraControllerState.prototype.exit = function() {
}

/**
 * @protected
 * @ignore
 */
CameraControllerState.prototype.moveCamera = function(delta) {
}

/**
 * @protected
 * @ignore
 */
CameraControllerState.prototype.moveCameraSideways = function(delta) {
}

/**
 * @protected
 * @ignore
 */
CameraControllerState.prototype.elevateCamera = function(delta) {     
}

/**
 * @protected
 * @ignore
 */
CameraControllerState.prototype.rotateCameraYaw = function(delta) {
}

/**
 * @protected
 * @ignore
 */
CameraControllerState.prototype.rotateCameraPitch = function(delta) {
}

/**
 * @protected
 * @ignore
 */
CameraControllerState.prototype.goToCamera = function(camera) {
}


// CameraControllerState subclasses

/**
 * Top camera controller state.
 * @constructor 
 * @extends CameraControllerState
 * @private
 */
function TopCameraState(home, preferences) {
  CameraControllerState.call(this);
  this.home = home;
  this.topCamera = null;
  this.aerialViewBoundsLowerPoint = null;
  this.aerialViewBoundsUpperPoint = null;
  this.minDistanceToAerialViewCenter = 0.;
  this.maxDistanceToAerialViewCenter = 0.;
  this.aerialViewCenteredOnSelectionEnabled = preferences.isAerialViewCenteredOnSelectionEnabled();
  var topCameraState = this;
  preferences.addPropertyChangeListener("AERIAL_VIEW_CENTERED_ON_SELECTION_ENABLED",
      function(ev) {
          topCameraState.setAerialViewCenteredOnSelectionEnabled(preferences.isAerialViewCenteredOnSelectionEnabled())
        });

  var objectChangeListener = function(ev) {
      topCameraState.updateCameraFromHomeBounds(false);
    };
  this.objectChangeListener = objectChangeListener;
  this.levelsListener = function(ev) {
      if (ev.getType() === CollectionEvent.Type.ADD) {
        ev.getItem().addPropertyChangeListener(objectChangeListener);
      } else if (ev.getType() === CollectionEvent.Type.DELETE) {
        ev.getItem().removePropertyChangeListener(objectChangeListener);
      } 
      topCameraState.updateCameraFromHomeBounds(false);
    };
  this.wallsListener = function(ev) {
    if (ev.getType() === CollectionEvent.Type.ADD) {
        ev.getItem().addPropertyChangeListener(objectChangeListener);
      } else if (ev.getType() === CollectionEvent.Type.DELETE) {
        ev.getItem().removePropertyChangeListener(objectChangeListener);
      } 
      topCameraState.updateCameraFromHomeBounds(false);
    };
  this.furnitureListener = function(ev) {
      if (ev.getType() === CollectionEvent.Type.ADD) {
        ev.getItem().addPropertyChangeListener(objectChangeListener);
        topCameraState.updateCameraFromHomeBounds(topCameraState.home.getFurniture().length === 1
            && topCameraState.home.getWalls().length === 0
            && topCameraState.home.getRooms().length === 0);
      } else if (ev.getType() === CollectionEvent.Type.DELETE) {
        ev.getItem().removePropertyChangeListener(objectChangeListener);
        topCameraState.updateCameraFromHomeBounds(false);
      } 
    };
  this.roomsListener = function(ev) {
      if (ev.getType() === CollectionEvent.Type.ADD) {
        ev.getItem().addPropertyChangeListener(objectChangeListener);
      } else if (ev.getType() === CollectionEvent.Type.DELETE) {
        ev.getItem().removePropertyChangeListener(objectChangeListener);
      } 
      topCameraState.updateCameraFromHomeBounds(false);
    };
  this.labelsListener = function(ev) {
      if (ev.getType() === CollectionEvent.Type.ADD) {
        ev.getItem().addPropertyChangeListener(objectChangeListener);
      } else if (ev.getType() === CollectionEvent.Type.DELETE) {
        ev.getItem().removePropertyChangeListener(objectChangeListener);
      } 
      topCameraState.updateCameraFromHomeBounds(false);
    };
  this.selectionListener = function(ev) {
      topCameraState.updateCameraFromHomeBounds(false);
    };
}
TopCameraState.prototype = Object.create(CameraControllerState.prototype);
TopCameraState.prototype.constructor = TopCameraState;

TopCameraState.MIN_WIDTH  = 100;
TopCameraState.MIN_DEPTH  = TopCameraState.MIN_WIDTH;
TopCameraState.MIN_HEIGHT = 20;

TopCameraState.prototype.enter = function() {
  this.topCamera = this.home.getCamera();
  this.updateCameraFromHomeBounds(false);
  var levels = this.home.getLevels();
  for (var i = 0; i < levels.length; i++) {
    levels [i].addPropertyChangeListener(this.objectChangeListener);
  }
  this.home.addLevelsListener(this.levelsListener);
  var walls = this.home.getWalls();
  for (var i = 0; i < walls.length; i++) {
    walls [i].addPropertyChangeListener(this.objectChangeListener);
  }
  this.home.addWallsListener(this.wallsListener);
  var furniture = this.home.getFurniture();
  for (var i = 0; i < furniture.length; i++) {
    furniture [i].addPropertyChangeListener(this.objectChangeListener);
  }
  this.home.addFurnitureListener(this.furnitureListener);
  var rooms = this.home.getRooms();
  for (var i = 0; i < rooms.length; i++) {
    rooms [i].addPropertyChangeListener(this.objectChangeListener);
  }
  this.home.addRoomsListener(this.roomsListener);
  var labels = this.home.getLabels();
  for (var i = 0; i < labels.length; i++) {
    labels [i].addPropertyChangeListener(this.objectChangeListener);
  }
  this.home.addLabelsListener(this.labelsListener);
  this.home.addSelectionListener(this.selectionListener);
}

/**
 * Sets whether aerial view should be centered on selection or not.
 */
TopCameraState.prototype.setAerialViewCenteredOnSelectionEnabled = function(aerialViewCenteredOnSelectionEnabled) {
  this.aerialViewCenteredOnSelectionEnabled = aerialViewCenteredOnSelectionEnabled;
  this.updateCameraFromHomeBounds(false);
}

/**
 * Updates camera location from home bounds.
 * @private
 */
TopCameraState.prototype.updateCameraFromHomeBounds = function(firstPieceOfFurnitureAddedToEmptyHome) {
  if (this.aerialViewBoundsLowerPoint === null) {
    this.updateAerialViewBoundsFromHomeBounds(this.aerialViewCenteredOnSelectionEnabled);
  }
  var distanceToCenter = this.getCameraToAerialViewCenterDistance();
  this.updateAerialViewBoundsFromHomeBounds(this.aerialViewCenteredOnSelectionEnabled);
  this.updateCameraIntervalToAerialViewCenter();
  this.placeCameraAt(distanceToCenter, firstPieceOfFurnitureAddedToEmptyHome);
}

/**
 * Returns the distance between the current camera location and home bounds center.
 * @private
 */
TopCameraState.prototype.getCameraToAerialViewCenterDistance = function() {
  return Math.sqrt(Math.pow((this.aerialViewBoundsLowerPoint [0] + this.aerialViewBoundsUpperPoint [0]) / 2 - this.topCamera.getX(), 2) 
      + Math.pow((this.aerialViewBoundsLowerPoint [1] + this.aerialViewBoundsUpperPoint [1]) / 2 - this.topCamera.getY(), 2) 
      + Math.pow((this.aerialViewBoundsLowerPoint [2] + this.aerialViewBoundsUpperPoint [2]) / 2 - this.topCamera.getZ(), 2));
}

/**
 * Sets the bounds that includes walls, furniture and rooms, or only selected items 
 * if <code>centerOnSelection</code> is <code>true</code>.
 * @private
 */
TopCameraState.prototype.updateAerialViewBoundsFromHomeBounds = function(centerOnSelection) {
  this.aerialViewBoundsLowerPoint = 
  this.aerialViewBoundsUpperPoint = null;
  var selectedItems = [];
  if (centerOnSelection) { 
    var items = this.home.getSelectedItems();
    for (var i = 0; i < items.length; i++) {
      var item = items [i];
      if (typeof(item.getLevel) === "function" 
          && this.isItemAtVisibleLevel(item)
          && (!(item instanceof HomePieceOfFurniture)
              || item.isVisible())
          && (typeof Label === "undefined"
              || !(item instanceof Label)
              || item.getPitch() !== null)) {
        selectedItems.push(item);
      }
    }
  }
  var selectionEmpty = selectedItems.length === 0 || !centerOnSelection;

  // Compute plan bounds to include rooms, walls and furniture
  var containsVisibleWalls = false;
  var walls = selectionEmpty
      ? this.home.getWalls()
      : Home.getWallsSubList(selectedItems);
  for (var i = 0; i < walls.length; i++) {
    var wall = walls [i];
    if (this.isItemAtVisibleLevel(wall)) {
      containsVisibleWalls = true;
      
      var wallElevation = wall.getLevel() !== null 
          ? wall.getLevel().getElevation() 
          : 0;
      var minZ = selectionEmpty
          ? 0
          : wallElevation;
      
      var height = wall.getHeight();
      var maxZ;
      if (height !== null) {
        maxZ = wallElevation + height;
      } else {
        maxZ = wallElevation + this.home.getWallHeight();
      }
      var heightAtEnd = wall.getHeightAtEnd();
      if (heightAtEnd !== null) {
        maxZ = Math.max(maxZ, wallElevation + heightAtEnd);
      }
      var points = wall.getPoints();
      for (var j = 0; j < points.length; j++) {
        var point = points [j];
        this.updateAerialViewBounds(point [0], point [1], minZ, maxZ);
      }
    }
  }

  var furniture = selectionEmpty 
      ? this.home.getFurniture()
      : Home.getFurnitureSubList(selectedItems);
  for (var i = 0; i < furniture.length; i++) {
    var piece = furniture [i];
    if (piece.isVisible() && this.isItemAtVisibleLevel(piece)) {
      var minZ;
      var maxZ;
      if (selectionEmpty) {
        minZ = Math.max(0, piece.getGroundElevation());
        maxZ = Math.max(0, piece.getGroundElevation() + piece.getHeight());
      } else {
        minZ = piece.getGroundElevation();
        maxZ = piece.getGroundElevation() + piece.getHeight();
      }
      var points = piece.getPoints();
      for (var j = 0; j < points.length; j++) {
        var point = points [j];
        this.updateAerialViewBounds(point [0], point [1], minZ, maxZ);
      }
    }
  }
  
  var rooms = selectionEmpty 
      ? this.home.getRooms()
      : Home.getRoomsSubList(selectedItems);
  for (var i = 0; i < rooms.length; i++) {
    var room = rooms [i];
    if (this.isItemAtVisibleLevel(room)) {
      var minZ = 0;
      var maxZ = MIN_HEIGHT;
      var roomLevel = room.getLevel();
      if (roomLevel !== null) {
        minZ = roomLevel.getElevation() - roomLevel.getFloorThickness();
        maxZ = roomLevel.getElevation();
        if (selectionEmpty) {
          minZ = Math.max(0, minZ);
          maxZ = Math.max(MIN_HEIGHT, roomLevel.getElevation());
        }
      }
      var points = room.getPoints();
      for (var j = 0; j < points.length; j++) {
        var point = points [j];
        this.updateAerialViewBounds(point [0], point [1], minZ, maxZ);
      }
    }
  }
  
  var labels = selectionEmpty
      ? this.home.getLabels()
      : Home.getLabelsSubList(selectedItems);
  for (var i = 0; i < labels.length; i++) {
    var label = labels [i];
    if (label.getPitch() !== null && this.isItemAtVisibleLevel(label)) {
      var minZ;
      var maxZ;
      if (selectionEmpty) {
        minZ = Math.max(0, label.getGroundElevation());
        maxZ = Math.max(MIN_HEIGHT, label.getGroundElevation());
      } else {
        minZ = 
        maxZ = label.getGroundElevation();
      }
      var points = label.getPoints();
      for (var j = 0; j < points.length; j++) {
        var point = points [j];
        this.updateAerialViewBounds(point [0], point [1], minZ, maxZ);
      }
    }
  }
  
  if (this.aerialViewBoundsLowerPoint === null) {
    this.aerialViewBoundsLowerPoint = [0, 0, 0];
    this.aerialViewBoundsUpperPoint = [TopCameraState.MIN_WIDTH, TopCameraState.MIN_DEPTH, TopCameraState.MIN_HEIGHT];
  } else if (containsVisibleWalls && selectionEmpty) {
    // If home contains walls, ensure bounds are always minimum 1 meter wide centered in middle of 3D view
    if (MIN_WIDTH > this.aerialViewBoundsUpperPoint [0] - this.aerialViewBoundsLowerPoint [0]) {
      this.aerialViewBoundsLowerPoint [0] = (this.aerialViewBoundsLowerPoint [0] + this.aerialViewBoundsUpperPoint [0]) / 2 - MIN_WIDTH / 2;
      this.aerialViewBoundsUpperPoint [0] = this.aerialViewBoundsLowerPoint [0] + MIN_WIDTH;
    }
    if (MIN_DEPTH > this.aerialViewBoundsUpperPoint [1] - this.aerialViewBoundsLowerPoint [1]) {
      this.aerialViewBoundsLowerPoint [1] = (this.aerialViewBoundsLowerPoint [1] + this.aerialViewBoundsUpperPoint [1]) / 2 - MIN_DEPTH / 2;
      this.aerialViewBoundsUpperPoint [1] = this.aerialViewBoundsLowerPoint [1] + MIN_DEPTH;
    }
    if (MIN_HEIGHT > this.aerialViewBoundsUpperPoint [2] - this.aerialViewBoundsLowerPoint [2]) {
      this.aerialViewBoundsLowerPoint [2] = (this.aerialViewBoundsLowerPoint [2] + this.aerialViewBoundsUpperPoint [2]) / 2 - MIN_HEIGHT / 2;
      this.aerialViewBoundsUpperPoint [2] = this.aerialViewBoundsLowerPoint [2] + MIN_HEIGHT;
    }
  }
}

/**
 * Adds the point at the given coordinates to aerial view bounds.
 * @private
 */
TopCameraState.prototype.updateAerialViewBounds = function(x, y, minZ, maxZ) {
  if (this.aerialViewBoundsLowerPoint === null) {
    this.aerialViewBoundsLowerPoint = [x, y, minZ];
    this.aerialViewBoundsUpperPoint = [x, y, maxZ];
  } else {
    this.aerialViewBoundsLowerPoint [0] = Math.min(this.aerialViewBoundsLowerPoint [0], x); 
    this.aerialViewBoundsUpperPoint [0] = Math.max(this.aerialViewBoundsUpperPoint [0], x);
    this.aerialViewBoundsLowerPoint [1] = Math.min(this.aerialViewBoundsLowerPoint [1], y); 
    this.aerialViewBoundsUpperPoint [1] = Math.max(this.aerialViewBoundsUpperPoint [1], y);
    this.aerialViewBoundsLowerPoint [2] = Math.min(this.aerialViewBoundsLowerPoint [2], minZ); 
    this.aerialViewBoundsUpperPoint [2] = Math.max(this.aerialViewBoundsUpperPoint [2], maxZ);
  }
}

/**
 * Returns <code>true</code> if the given <code>item</code> is at a visible level.
 * @private
 */
TopCameraState.prototype.isItemAtVisibleLevel = function(item) {
  return item.getLevel() === null || item.getLevel().isViewableAndVisible();
}

/**
 * Updates the minimum and maximum distances of the camera to the center of the aerial view.
 * @private
 */
TopCameraState.prototype.updateCameraIntervalToAerialViewCenter = function() {  
  var homeBoundsWidth = this.aerialViewBoundsUpperPoint [0] - this.aerialViewBoundsLowerPoint [0];
  var homeBoundsDepth = this.aerialViewBoundsUpperPoint [1] - this.aerialViewBoundsLowerPoint [1];
  var homeBoundsHeight = this.aerialViewBoundsUpperPoint [2] - this.aerialViewBoundsLowerPoint [2];
  var halfDiagonal = Math.sqrt(homeBoundsWidth * homeBoundsWidth 
      + homeBoundsDepth * homeBoundsDepth 
      + homeBoundsHeight * homeBoundsHeight) / 2;
  this.minDistanceToAerialViewCenter = halfDiagonal * 1.05;
  this.maxDistanceToAerialViewCenter = Math.max(5 * this.minDistanceToAerialViewCenter, 2500);
}
   
TopCameraState.prototype.moveCamera = function(delta) {
  // Use a 5 times bigger delta for top camera move
  delta *= 5;
  var newDistanceToCenter = this.getCameraToAerialViewCenterDistance() - delta;
  this.placeCameraAt(newDistanceToCenter, false);
}

TopCameraState.prototype.placeCameraAt = function(distanceToCenter, firstPieceOfFurnitureAddedToEmptyHome) {
  // Check camera is always outside the sphere centered in home center and with a radius equal to minimum distance   
  distanceToCenter = Math.max(distanceToCenter, this.minDistanceToAerialViewCenter);
  // Check camera isn't too far
  distanceToCenter = Math.min(distanceToCenter, this.maxDistanceToAerialViewCenter);
  if (firstPieceOfFurnitureAddedToEmptyHome) {
    // Get closer to the first piece of furniture added to an empty home when that is small
    distanceToCenter = Math.min(distanceToCenter, 3 * this.minDistanceToAerialViewCenter);
  }
  var distanceToCenterAtGroundLevel = distanceToCenter * Math.cos(this.topCamera.getPitch());
  this.topCamera.setX((this.aerialViewBoundsLowerPoint [0] + this.aerialViewBoundsUpperPoint [0]) / 2 
      + (Math.sin(this.topCamera.getYaw()) * distanceToCenterAtGroundLevel));
  this.topCamera.setY((this.aerialViewBoundsLowerPoint [1] + this.aerialViewBoundsUpperPoint [1]) / 2 
      - (Math.cos(this.topCamera.getYaw()) * distanceToCenterAtGroundLevel));
  this.topCamera.setZ((this.aerialViewBoundsLowerPoint [2] + this.aerialViewBoundsUpperPoint [2]) / 2 
      + Math.sin(this.topCamera.getPitch()) * distanceToCenter);
}

TopCameraState.prototype.rotateCameraYaw = function(delta) {
  var newYaw = this.topCamera.getYaw() + delta;
  var distanceToCenterAtGroundLevel = this.getCameraToAerialViewCenterDistance() * Math.cos(this.topCamera.getPitch());
  // Change camera yaw and location so user turns around home
  this.topCamera.setYaw(newYaw); 
  this.topCamera.setX((this.aerialViewBoundsLowerPoint [0] + this.aerialViewBoundsUpperPoint [0]) / 2 
      + Math.sin(newYaw) * distanceToCenterAtGroundLevel);
  this.topCamera.setY((this.aerialViewBoundsLowerPoint [1] + this.aerialViewBoundsUpperPoint [1]) / 2 
      - Math.cos(newYaw) * distanceToCenterAtGroundLevel);
}

TopCameraState.prototype.rotateCameraPitch = function(delta) {
  var newPitch = this.topCamera.getPitch() + delta;
  // Check new pitch is between 0 and PI / 2  
  newPitch = Math.max(newPitch, 0.);
  newPitch = Math.min(newPitch, Math.PI / 2);
  // Compute new z to keep the same distance to view center
  var distanceToCenter = this.getCameraToAerialViewCenterDistance();
  var distanceToCenterAtGroundLevel = distanceToCenter * Math.cos(newPitch);
  // Change camera pitch 
  this.topCamera.setPitch(newPitch); 
  this.topCamera.setX((this.aerialViewBoundsLowerPoint [0] + this.aerialViewBoundsUpperPoint [0]) / 2 
      + Math.sin(this.topCamera.getYaw()) * distanceToCenterAtGroundLevel);
  this.topCamera.setY((this.aerialViewBoundsLowerPoint [1] + this.aerialViewBoundsUpperPoint [1]) / 2 
      - Math.cos(this.topCamera.getYaw()) * distanceToCenterAtGroundLevel);
  this.topCamera.setZ((this.aerialViewBoundsLowerPoint [2] + this.aerialViewBoundsUpperPoint [2]) / 2 
      + distanceToCenter * Math.sin(newPitch));
}

TopCameraState.prototype.goToCamera = function(camera) {
  this.topCamera.setCamera(camera);
  this.topCamera.setTime(camera.getTime());
  this.topCamera.setLens(camera.getLens());
  this.updateCameraFromHomeBounds(false);
}

TopCameraState.prototype.exit = function() {
  this.topCamera = null;
  var walls = this.home.getWalls();
  for (var i = 0; i < walls.length; i++) {
    walls [i].removePropertyChangeListener(this.objectChangeListener);
  }
  this.home.removeWallsListener(this.wallsListener);
  var furniture = this.home.getFurniture();
  for (var i = 0; i < furniture.length; i++) {
    furniture [i].removePropertyChangeListener(this.objectChangeListener);
  }
  this.home.removeFurnitureListener(this.furnitureListener);
  var rooms = this.home.getRooms();
  for (var i = 0; i < rooms.length; i++) {
    rooms [i].removePropertyChangeListener(this.objectChangeListener);
  }
  this.home.removeRoomsListener(this.roomsListener);
  var labels = this.home.getLabels();
  for (var i = 0; i < labels.length; i++) {
    labels [i].removePropertyChangeListener(this.objectChangeListener);
  }
  this.home.removeLabelsListener(this.labelsListener);
  var levels = this.home.getLevels();
  for (var i = 0; i < levels.length; i++) {
    levels [i].removePropertyChangeListener(this.objectChangeListener);
  }
  this.home.removeLevelsListener(this.levelsListener);
  this.home.removeSelectionListener(this.selectionListener);
}


/**
 * Observer camera controller state. 
 * @constructor
 * @extends CameraControllerState
 * @private
 */
function ObserverCameraState(home, preferences) {
  CameraControllerState.call(this);
  this.home = home;
  this.preferences = preferences;
  this.observerCamera = null;
  var observerCameraState = this;
  this.levelElevationChangeListener = function(ev) {
      if ("ELEVATION" == ev.getPropertyName()) {
        observerCameraState.updateCameraMinimumElevation();
      }
    };
  this.levelsListener = function(ev) {
      if (ev.getType() === CollectionEvent.Type.ADD) {
        ev.getItem().addPropertyChangeListener(levelElevationChangeListener);
      } else if (ev.getType() === CollectionEvent.Type.DELETE) {
        ev.getItem().removePropertyChangeListener(levelElevationChangeListener);
      } 
      observerCameraState.updateCameraMinimumElevation();
    };
}
ObserverCameraState.prototype = Object.create(CameraControllerState.prototype);
ObserverCameraState.prototype.constructor = ObserverCameraState;
    
ObserverCameraState.prototype.enter = function() {
  this.observerCamera = this.home.getCamera();
  var levels = this.home.getLevels();
  for (var i = 0; i < levels.length; i++) {
    var level = levels [i];
    level.addPropertyChangeListener(this.levelElevationChangeListener);
  }
  this.home.addLevelsListener(this.levelsListener);
  // Select observer camera for user feedback
  this.home.setSelectedItems([this.observerCamera]);
}

ObserverCameraState.prototype.moveCamera = function(delta) {
  this.observerCamera.setX(this.observerCamera.getX() - Math.sin(this.observerCamera.getYaw()) * delta);
  this.observerCamera.setY(this.observerCamera.getY() + Math.cos(this.observerCamera.getYaw()) * delta);
  // Select observer camera for user feedback
  this.home.setSelectedItems([this.observerCamera]);
}

ObserverCameraState.prototype.moveCameraSideways = function(delta) {
  this.observerCamera.setX(this.observerCamera.getX() - Math.cos(this.observerCamera.getYaw()) * delta);
  this.observerCamera.setY(this.observerCamera.getY() - Math.sin(this.observerCamera.getYaw()) * delta);
  // Select observer camera for user feedback
  this.home.setSelectedItems([this.observerCamera]);
}

ObserverCameraState.prototype.elevateCamera = function(delta) {
  var newElevation = this.observerCamera.getZ() + delta; 
  newElevation = Math.min(Math.max(newElevation, this.getMinimumElevation()), this.preferences.getLengthUnit().getMaximumElevation());
  this.observerCamera.setZ(newElevation);
  // Select observer camera for user feedback
  this.home.setSelectedItems([this.observerCamera]);
}

ObserverCameraState.prototype.updateCameraMinimumElevation = function() {
  observerCamera.setZ(Math.max(observerCamera.getZ(), this.getMinimumElevation()));
}

ObserverCameraState.prototype.getMinimumElevation = function() {
  var levels = this.home.getLevels();
  if (levels.length > 0) {
    return 10 + levels [0].getElevation();
  } else {
    return 10;
  }
}

ObserverCameraState.prototype.rotateCameraYaw = function(delta) {
  this.observerCamera.setYaw(this.observerCamera.getYaw() + delta); 
  // Select observer camera for user feedback
  this.home.setSelectedItems([this.observerCamera]);
}

ObserverCameraState.prototype.rotateCameraPitch = function(delta) {
  var newPitch = this.observerCamera.getPitch() + delta; 
  // Check new angle is between -90 deg and 90 deg  
  newPitch = Math.max(newPitch, -Math.PI / 2);
  newPitch = Math.min(newPitch, Math.PI / 2);
  this.observerCamera.setPitch(newPitch); 
  // Select observer camera for user feedback
  this.home.setSelectedItems([this.observerCamera]);
}

ObserverCameraState.prototype.goToCamera = function(camera) {
  this.observerCamera.setCamera(camera);
  this.observerCamera.setTime(camera.getTime());
  this.observerCamera.setLens(camera.getLens());
}

ObserverCameraState.prototype.exit = function() {
  // Remove observer camera from selection
  var selectedItems = this.home.getSelectedItems();
  var index = selectedItems.indexOf(this.observerCamera);
  if (index !== -1) {
    selectedItems = selectedItems.slice(0);
    selectedItems.splice(index, 1);
    this.home.setSelectedItems(selectedItems);
  }
  var levels = this.home.getLevels();
  for (var i = 0; i < levels.length; i++) {
    levels [i].removePropertyChangeListener(this.levelElevationChangeListener);
  }
  this.home.removeLevelsListener(this.levelsListener);
  this.observerCamera = null;
}
