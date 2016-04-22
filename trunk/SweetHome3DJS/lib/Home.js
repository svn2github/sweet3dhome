/*
 * Home.js
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA02111-1307USA
 */

// Requires core.js
//          HomeEnvironment.js
//          HomePieceOfFurniture.js
//          Camera.js
//          Level.js

/**
 * Creates a home. First parameter can be missing, a wall height, an array of pieces or an other home.
 * @param {number} [wallHeight] default height for home walls
 * @constructor   
 * @author Emmanuel Puybaret
 */
function Home(wallHeight) {
  var furniture = [];
  if (wallHeight === undefined) {
    wallHeight = 250;
  } else if (typeof wallHeight === "object") {
    if (wallHeight instanceof Home) {
      var home = wallHeight;
      this.wallHeight = home.getWallHeight();
      Home.copyHomeData(home, this);
      Home.initListenersSupport(this);
      this.addModelListeners();
      return;
    }
    furniture = wallHeight;
  }
  this.furniture = furniture.slice(0);
  this.selectedItems = [];
  this.allLevelsSelection = false;
  this.levels = [];
  this.selectedLevel = null;
  this.walls = [];
  this.rooms = [];
  this.polylines = [];
  this.dimensionLines = [];
  this.labels = [];
  this.camera = null;
  this.name = null;
  this.wallHeight = wallHeight;
  this.modified = false;
  this.recovered = false;
  this.repaired = false;
  this.backgroundImage = null;
  // Create a default observer camera (use a 63° field of view equivalent to a 35mm lens for a 24x36 film)
  this.observerCamera = new ObserverCamera(50, 50, 170, 
      7 * Math.PI / 4, Math.PI / 16, Math.PI * 63 / 180);
  // Create a default top camera that matches default point of view 
  this.topCamera = new Camera(50, 1050, 1010, 
      Math.PI, Math.PI / 4, Math.PI * 63 / 180);
  this.storedCameras = [];
  this.environment = new HomeEnvironment();
  this.print = null;
  this.furnitureDescendingSorted = false;
  this.properties = {};
  this.version = Home.CURRENT_VERSION;
  this.basePlanLocked = false;
  this.compass = null; // Lazy initialization
  this.furnitureSortedProperty = false;
  this.furnitureVisibleProperties = ["NAME", "WIDTH", "DEPTH", "HEIGHT", "VISIBLE"];
  Home.initListenersSupport(this);
  this.addModelListeners();
}

/**
 * The current version of this home. Each time the field list is changed
 * in <code>Home</code> class or in one of the classes that it uses,
 * this number is increased.
 */
Home.CURRENT_VERSION = 5200;

/**
 * @private
 */
Home.LEVEL_ELEVATION_COMPARATOR = function(level1, level2) {
  var elevationComparison = level2.getElevation() - level1.getElevation();
  if (elevationComparison !== 0) {
    return elevationComparison;
  } else {
    return level1.getElevationIndex() - level2.getElevationIndex();
  }
}

/**
 * @private
 */
Home.initListenersSupport = function(home) {
  home.furnitureChangeSupport = new CollectionChangeSupport(home);
  home.selectionListeners = [];
  home.levelsChangeSupport = new CollectionChangeSupport(home);
  home.wallsChangeSupport = new CollectionChangeSupport(home);
  home.roomsChangeSupport = new CollectionChangeSupport(home);
  home.polylinesChangeSupport = new CollectionChangeSupport(home);
  home.dimensionLinesChangeSupport = new CollectionChangeSupport(home);
  home.labelsChangeSupport = new CollectionChangeSupport(home);
  home.propertyChangeSupport = new PropertyChangeSupport(home);
}

/**
 * Adds listeners to model.
 * @private
 */
Home.prototype.addModelListeners = function() {
  var levels = this.levels;
  // Add listeners to levels to maintain its elevation order
  var levelElevationChangeListener = function(ev) {
      if ("ELEVATION" == ev.getPropertyName()
          || "ELEVATION_INDEX" == ev.getPropertyName()) {
        levels = levels.slice(0);
        levels.sort(Home.LEVEL_ELEVATION_COMPARATOR);
      }
    };
  for (var i = 0; i < this.levels.length; i++) {
    this.levels [i].addPropertyChangeListener(levelElevationChangeListener);
  }
  this.addLevelsListener(
      function(ev) {
        switch (ev.getType()) {
          case CollectionEvent.Type.ADD :
            ev.getItem().addPropertyChangeListener(levelElevationChangeListener);
            break;
          case CollectionEvent.Type.DELETE :
            ev.getItem().removePropertyChangeListener(levelElevationChangeListener);
            break;
        }
      });
}

/**
 * Returns all the pieces of the given <code>furnitureGroup</code>.  
 * @private
 */
Home.prototype.getGroupFurniture = function(furnitureGroup) {
  var groupFurniture = [];
  var furniture = furnitureGroup.getFurniture();
  for (var i = 0; i < furniture.length; i++) {
    var piece = furniture [i];
    if (piece instanceof HomeFurnitureGroup) {
      groupFurniture.push.apply(groupFurniture, this.getGroupFurniture(piece));
    } else {
      groupFurniture.push(piece);
    }
  }
  return groupFurniture;
}

/**
 * Adds the level <code>listener</code> in parameter to this home.
 * @param listener the listener to add
 */
Home.prototype.addLevelsListener = function(listener) {
  this.levelsChangeSupport.addCollectionListener(listener);
}

/**
 * Removes the level <code>listener</code> in parameter from this home.
 * @param listener the listener to remove
 */
Home.prototype.removeLevelsListener = function(listener) {
  this.levelsChangeSupport.removeCollectionListener(listener);
} 

/**
 * Returns an array of the levels of this home.
 * @return {Level []}
 */
Home.prototype.getLevels = function() {
  return this.levels;
}

/**
 * Adds the given <code>level</code> to the list of levels of this home.
 * Once the <code>level</code> is added, level listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to ADD. 
 * @param {Level} level  the level to add
 */
Home.prototype.addLevel = function(level) {
  if (level.getElevationIndex() < 0) {
    // Search elevation index of the added level
    var elevationIndex = 0;
    for (var i = 0; i < this.levels.length; i++) {
      var homeLevel = this.levels [i];
      if (homeLevel.getElevation() === level.getElevation()) {
        elevationIndex = homeLevel.getElevationIndex() + 1;
      } else if (homeLevel.getElevation() > level.getElevation()) {
        break;
      }
    }
    level.setElevationIndex(elevationIndex);
  }
  // Make a copy of the list to avoid conflicts in the list returned by getLevels
  this.levels = this.levels.slice(0);
  // Search at which index should be inserted the new level
  var levelIndex = 0;
  while (levelIndex < this.levels.length
         && Home.LEVEL_ELEVATION_COMPARATOR(level, this.levels [levelIndex]) <= 0) {
    levelIndex++;
  }
  this.levels.splice(levelIndex, 0, level);
  this.levelsChangeSupport.fireCollectionChanged(level, levelIndex, CollectionEvent.Type.ADD);
}

/**
 * Removes the given <code>level</code> from the set of levels of this home 
 * and all the furniture, walls, rooms, dimension lines and labels that belong to this level.
 * Once the <code>level</code> is removed, level listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to DELETE.
 * @param {Level} level  the level to remove
 */
Home.prototype.deleteLevel = function(level) {
  var index = this.levels.indexOf(level);
  if (index !== -1) {
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      if (piece [i].getLevel() === level) {
        this.deletePieceOfFurniture(piece);
      }
    }
    for (var i = 0; i < this.rooms.length; i++) {
      var room = this.rooms [i];
      if (room.getLevel() === level) {
        this.deleteRoom(room);
      }
    }
    for (var i = 0; i < this.walls.length; i++) {
      var wall = this.walls [i];
      if (wall.getLevel() === level) {
        this.deleteWall(wall);
      }
    }
    for (var i = 0; i < this.polylines.length; i++) {
      var polyline = this.polylines [i]; 
      if (polyline.getLevel() === level) {
        this.deletePolyline(polyline);
      }
    }
    for (var i = 0; i < this.dimensionLines.length; i++) {
      var dimensionLine = this.dimensionLines [i];
      if (dimensionLine.getLevel() === level) {
        this.deleteDimensionLine(dimensionLine);
      }
    }
    for (var i = 0; i < this.labels.length; i++) {
      var label = this.labels [i];
      if (label.getLevel() === level) {
        this.deleteLabel(label);
      }
    }
    if (this.selectedLevel === level) {
      if (this.levels.length === 1) {
        this.setSelectedLevel(null);
        this.setAllLevelsSelection(false);
      } else {
        this.setSelectedLevel(this.levels [index >= 1 ? index - 1 : index + 1]);
      }
    }
    // Make a copy of the list to avoid conflicts in the list returned by getLevels
    this.levels = this.levels.clone();
    this.levels.splice(index, 1);
    this.levelsChangeSupport.fireCollectionChanged(level, index, DELETE);
  }
}

/**
 * Returns the selected level in home or <code>null</code> if home has no level.
 * @return {Level}
 */
Home.prototype.getSelectedLevel = function() {
  return this.selectedLevel;
}

/**
 * Sets the selected level in home and notifies listeners of the change.
 * @param {Level} level  the level to select
 */
Home.prototype.setSelectedLevel = function(selectedLevel) {
  if (selectedLevel !== this.selectedLevel) {
    var oldSelectedLevel = this.selectedLevel;
    this.selectedLevel = selectedLevel;
    this.propertyChangeSupport.firePropertyChange("SELECTED_LEVEL", oldSelectedLevel, selectedLevel);
  }
}

/**
 * Returns <code>true</code> if the selected items in this home are from all levels.
 * @return {boolean}
 */
Home.prototype.isAllLevelsSelection = function() {
  return this.allLevelsSelection;
}

/**
 * Sets whether the selected items in this home are from all levels, and notifies listeners of the change.
 * @param {boolean} selectionAtAllLevels 
 */
Home.prototype.setAllLevelsSelection = function(selectionAtAllLevels) {
  if (selectionAtAllLevels !== this.allLevelsSelection) {
    this.allLevelsSelection = selectionAtAllLevels;
    this.propertyChangeSupport.firePropertyChange("ALL_LEVELS_SELECTION", !selectionAtAllLevels, selectionAtAllLevels);
  }
}

/**
 * Adds the furniture <code>listener</code> in parameter to this home.
 * @param listener the listener to add
 */
Home.prototype.addFurnitureListener = function(listener) {
  this.furnitureChangeSupport.addCollectionListener(listener);
}

/**
 * Removes the furniture <code>listener</code> in parameter from this home.
 * @param listener the listener to remove
 */
Home.prototype.removeFurnitureListener = function(listener) {
  this.furnitureChangeSupport.removeCollectionListener(listener);
}

/**
 * Returns an array of the furniture managed by this home. 
 * This furniture in this list is always sorted in the index order they were added to home. 
 * @return {HomePieceOfFurniture []}
 */
Home.prototype.getFurniture = function() {
  return this.furniture;
}

/**
 * Adds the <code>piece</code> in parameter at an optional <code>index</code>.
 * Once the <code>piece</code> is added, furniture listeners added to this home will receive a
 * {@link CollectionEvent} notification.
 * @param {HomePieceOfFurniture} piece  the piece to add
 * @param {number} [index] the index at which the piece will be added. 
 *                         If not indicated the piece will be added at the end of the furniture list
 */
Home.prototype.addPieceOfFurniture = function(piece, index) {
  if (index === undefined) {
    index = this.furniture.length;
  }
  // Make a copy of the list to avoid conflicts in the list returned by getFurniture
  this.furniture = this.furniture.slice(0);
  piece.setLevel(this.selectedLevel);
  this.furniture.splice(index, 0, piece);
  this.furnitureChangeSupport.fireCollectionChanged(piece, index, CollectionEvent.Type.ADD);
}

/**
 * Adds the <code>piece</code> in parameter at the <code>index</code> in the given <code>group</code>.
 * Once the <code>piece</code> is added, furniture listeners added to this home will receive a
 * {@link CollectionEvent} notification with an event index equal to -1.
 * @param {HomePieceOfFurniture} piece  the piece to add
 * @param {HomeFurnitureGroup} group  the group to which the piece will be added
 * @param {number} index  the index at which the piece will be added. 
 */
Home.prototype.addPieceOfFurnitureToGroup = function(piece, group, index) {
  piece.setLevel(this.selectedLevel);
  group.addPieceOfFurniture(piece, index);
  this.furnitureChangeSupport.fireCollectionChanged(piece, CollectionEvent.Type.ADD);
}

/**
 * Deletes the <code>piece</code> in parameter from this home.
 * Once the <code>piece</code> is deleted, furniture listeners added to this home will receive a
 * {@link CollectionEvent} notification. If the removed <code>piece</code> belongs to a group, the 
 * index of the event will be -1.
 * @param {HomePieceOfFurniture} piece  the piece to remove
 */
Home.prototype.deletePieceOfFurniture = function(piece) {
  // Ensure selectedItems don't keep a reference to piece
  this.deselectItem(piece);
  var index = this.furniture.indexOf(piece);
  var group = index === -1
      ? this.getPieceOfFurnitureGroup(piece, null, this.furniture)
      : null;
  if (index !== -1
      || group !== null) {
    piece.setLevel(null);
    // Make a copy of the list to avoid conflicts in the list returned by getFurniture
    this.furniture = this.furniture.slice(0);
    if (group !== null) {
      group.deletePieceOfFurniture(piece);
      this.furnitureChangeSupport.fireCollectionChanged(piece, CollectionEvent.Type.DELETE);
    } else {
      this.furniture.splice(index, 1);
      this.furnitureChangeSupport.fireCollectionChanged(piece, index, CollectionEvent.Type.DELETE);
    }
  }
}

/**
 * Returns the furniture group that contains the given <code>piece</code> or <code>null</code> 
 * if it can't be found.
 * @private
 */
Home.prototype.getPieceOfFurnitureGroup = function(piece, furnitureGroup, furniture) {
  for (var i = 0; i < furniture.length; i++) {
    var homePiece = furniture [i]; 
    if (homePiece === piece) {
      return furnitureGroup;
    } else if (homePiece instanceof HomeFurnitureGroup) {
      var group = this.getPieceOfFurnitureGroup(piece, homePiece, homePiece.getFurniture());
      if (group !== null) {
        return group;
      }
    }
  }
  return null;
}

/**
 * Adds the selection <code>listener</code> in parameter to this home.
 * @param listener the listener to add
 */
Home.prototype.addSelectionListener = function(listener) {
  this.selectionListeners.push(listener);
}

/**
 * Removes the selection <code>listener</code> in parameter from this home.
 * @param listener the listener to remove
 */
Home.prototype.removeSelectionListener = function(listener) {
  var index = this.selectionListeners.indexOf(listener);
  if (index !== - 1) {
    this.selectionListeners.splice(index, 1);
  }
}

/**
 * Returns an list of the selected items in home.
 * @return {Object []}
 */
Home.prototype.getSelectedItems = function() {
  return this.selectedItems;
}

/**
 * Sets the selected items in home and notifies listeners selection change.
 * @param {Object []} selectedItems the list of selected items
 */
Home.prototype.setSelectedItems = function(selectedItems) {
  // Make a copy of the list to avoid conflicts in the list returned by getSelectedItems
  this.selectedItems = selectedItems.slice(0);
  if (this.selectionListeners.length !== 0) {
    var selectionEvent = new SelectionEvent(this, this.getSelectedItems());
    // Work on a copy of selectionListeners to ensure a listener 
    // can modify safely listeners list
    var listeners = this.selectionListeners.slice(0);
    for (var i = 0; i < listeners.length; i++) {
      listeners [i](selectionEvent);
    }
  }
}

/**
 * Deselects <code>item</code> if it's selected and notifies listeners selection change.
 * @param {Object} item  the item to remove from selected items
 */
Home.prototype.deselectItem = function(item) {
  var pieceSelectionIndex = this.selectedItems.indexOf(item);
  if (pieceSelectionIndex !== -1) {
    var selectedItems = this.getSelectedItems().slice(0);
    selectedItems.splice(pieceSelectionIndex, 1);
    this.setSelectedItems(selectedItems);
  }
}

/**
 * Adds the room <code>listener</code> in parameter to this home.
 * @param listener the listener to add
 * @ignore
 */
Home.prototype.addRoomsListener = function(listener) {
  this.roomsChangeSupport.addCollectionListener(listener);
}

/**
 * Removes the room <code>listener</code> in parameter from this home.
 * @param listener the listener to remove
 * @ignore
 */
Home.prototype.removeRoomsListener = function(listener) {
  this.roomsChangeSupport.removeCollectionListener(listener);
} 

/**
 * Returns an array of the rooms of this home.
 * @return {Room []}
 * @ignore
 */
Home.prototype.getRooms = function() {
  return this.rooms;
}

/**
 * Adds the <code>room</code> in parameter at an optional <code>index</code>.
 * Once the <code>room</code> is added, room listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to ADD.
 * @param {Room}   room    the room to add
 * @param {number} [index] the index at which the room will be added.
 *                          If not indicated the room will be added at the end of the rooms list 
 * @ignore
 */
Home.prototype.addRoom = function(room, index) {
  if (index === undefined) {
    index = this.rooms.length;
  }
  // Make a copy of the list to avoid conflicts in the list returned by getRooms
  this.rooms = this.rooms.slice(0);
  this.rooms.splice(index, 0, room);
  room.setLevel(this.selectedLevel);
  this.roomsChangeSupport.fireCollectionChanged(room, index, CollectionEvent.Type.ADD);
}

/**
 * Removes the given <code>room</code> from the set of rooms of this home.
 * Once the <code>room</code> is removed, room listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to DELETE.
 * @param {Room} room  the room to remove
 * @ignore
 */
Home.prototype.deleteRoom = function(room) {
  //  Ensure selectedItems don't keep a reference to room
  this.deselectItem(room);
  var index = this.rooms.indexOf(room);
  if (index !== -1) {
    room.setLevel(null);
    // Make a copy of the list to avoid conflicts in the list returned by getRooms
    this.rooms = this.rooms.slice(0);
    this.rooms.splice(index, 1);
    this.roomsChangeSupport.fireCollectionChanged(room, index, CollectionEvent.Type.DELETE);
  }
}

/**
 * Adds the wall <code>listener</code> in parameter to this home.
 * @param listener the listener to add
 * @ignore
 */
Home.prototype.addWallsListener = function(listener) {
  this.wallsChangeSupport.addCollectionListener(listener);
}

/**
 * Removes the wall <code>listener</code> in parameter from this home.
 * @param listener the listener to remove
 * @ignore
 */
Home.prototype.removeWallsListener = function(listener) {
  this.wallsChangeSupport.removeCollectionListener(listener);
} 

/**
 * Returns an array of the walls of this home.
 * @return {Wall []}
 * @ignore
 */
Home.prototype.getWalls = function() {
  return this.walls;
}

/**
 * Adds the given <code>wall</code> to the set of walls of this home.
 * Once the <code>wall</code> is added, wall listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to ADD. 
 * @param {Wall} wall  the wall to add
 * @ignore
 */
Home.prototype.addWall = function(wall) {
  // Make a copy of the list to avoid conflicts in the list returned by getWalls
  this.walls = this.walls.slice(0);
  this.walls.push(wall);
  wall.setLevel(this.selectedLevel);
  this.wallsChangeSupport.fireCollectionChanged(wall, CollectionEvent.Type.ADD);
}

/**
 * Removes the given <code>wall</code> from the set of walls of this home.
 * Once the <code>wall</code> is removed, wall listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to DELETE.
 * If any wall is attached to <code>wall</code> they will be detached from it.
 * @param {Wall} wall  the wall to remove
 * @ignore
 */
Home.prototype.deleteWall = function(wall) {
  //  Ensure selectedItems don't keep a reference to wall
  this.deselectItem(wall);
  // Detach any other wall attached to wall
  var walls = this.getWalls();
  for (var i = 0; i < walls.length; i++) {
    var otherWall = walls [i]; 
    if (wall === otherWall.getWallAtStart()) {
      otherWall.setWallAtStart(null);
    } else if (wall === otherWall.getWallAtEnd()) {
      otherWall.setWallAtEnd(null);
    }
  }
  var index = this.walls.indexOf(wall);
  if (index !== -1) {
    wall.setLevel(null);
    // Make a copy of the list to avoid conflicts in the list returned by getWalls
    this.walls = this.walls.slice(0);
    this.walls.splice(index, 1);
    this.wallsChangeSupport.fireCollectionChanged(wall, CollectionEvent.Type.DELETE);
  }
}

/**
 * Adds the polyline <code>listener</code> in parameter to this home.
 * @param listener the listener to add
 * @ignore
 */
Home.prototype.addPolylinesListener = function(listener) {
  this.polylinesChangeSupport.addCollectionListener(listener);
}

/**
 * Removes the polyline <code>listener</code> in parameter from this home.
 * @param listener the listener to remove
 * @ignore
 */
Home.prototype.removePolylinesListener = function(listener) {
  this.polylinesChangeSupport.removeCollectionListener(listener);
} 

/**
 * Returns an array of the polylines of this home.
 * @return {Polyline []}
 * @ignore
 */
Home.prototype.getPolylines = function() {
  return this.polylines;
}

/**
 * Adds a <code>polyline</code> at an optional <code>index</code> of the set of polylines of this home.
 * Once the <code>polyline</code> is added, polyline listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to ADD. 
 * @param {Polyline} polyline  the polyline to add
 * @param {number} [index] the index at which the polyline will be added.
 *                          If not indicated the polyline will be added at the end of the polylines list 
 * @ignore
 */
Home.prototype.addPolyline = function(polyline, index) {
  if (index === undefined) {
    index = this.polylines.length;
  }
  // Make a copy of the list to avoid conflicts in the list returned by getPolylines
  this.polylines = this.polylines.slice(0);
  this.polylines.splice(index, 0, polyline);
  polyline.setLevel(this.selectedLevel);
  this.polylinesChangeSupport.fireCollectionChanged(polyline, CollectionEvent.Type.ADD);
}

/**
 * Removes a given <code>polyline</code> from the set of polylines of this home.
 * Once the <code>polyline</code> is removed, polyline listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to DELETE.
 * @param {Polyline} polyline  the polyline to remove
 * @ignore
 */
Home.prototype.deletePolyline = function(polyline) {
  //  Ensure selectedItems don't keep a reference to polyline
  this.deselectItem(polyline);
  var index = this.polylines.indexOf(polyline);
  if (index !== -1) {
    polyline.setLevel(null);
    // Make a copy of the list to avoid conflicts in the list returned by getPolylines
    this.polylines = this.polylines.slice(0);
    this.polylines.splice(index, 1);
    this.polylinesChangeSupport.fireCollectionChanged(polyline, CollectionEvent.Type.DELETE);
  }
}

/**
 * Adds the dimension line <code>listener</code> in parameter to this home.
 * @param listener the listener to add
 * @ignore
 */
Home.prototype.addDimensionLinesListener = function(listener) {
  this.dimensionLinesChangeSupport.addCollectionListener(listener);
}

/**
 * Removes the dimension line <code>listener</code> in parameter from this home.
 * @param listener the listener to remove
 * @ignore
 */
Home.prototype.removeDimensionLinesListener = function(listener) {
  this.dimensionLinesChangeSupport.removeCollectionListener(listener);
} 

/**
 * Returns an array of the dimension lines of this home.
 * @return {DimensionLine []}
 * @ignore
 */
Home.prototype.getDimensionLines = function() {
  return this.dimensionLines;
}

/**
 * Adds the given dimension line to the set of dimension lines of this home.
 * Once <code>dimensionLine</code> is added, dimension line listeners added 
 * to this home will receive a {@link CollectionEvent} notification, with an 
 * event type equal to ADD. 
 * @param {DimensionLine} dimensionLine  the dimension line to add
 * @ignore
 */
Home.prototype.addDimensionLine = function(dimensionLine) {
  // Make a copy of the list to avoid conflicts in the list returned by getDimensionLines
  this.dimensionLines = this.dimensionLines.slice(0);
  this.dimensionLines.push(dimensionLine);
  dimensionLine.setLevel(this.selectedLevel);
  this.dimensionLinesChangeSupport.fireCollectionChanged(dimensionLine, CollectionEvent.Type.ADD);
}

/**
 * Removes the given dimension line from the set of dimension lines of this home.
 * Once <code>dimensionLine</code> is removed, dimension line listeners added 
 * to this home will receive a {@link CollectionEvent} notification, with an 
 * event type equal to DELETE.
 * @param {DimensionLine} dimensionLine  the dimension line to remove
 * @ignore
 */
Home.prototype.deleteDimensionLine = function(dimensionLine) {
  //  Ensure selectedItems don't keep a reference to dimension line
  this.deselectItem(dimensionLine);
  var index = this.dimensionLines.indexOf(dimensionLine);
  if (index !== -1) {
    dimensionLine.setLevel(null);
    // Make a copy of the list to avoid conflicts in the list returned by getDimensionLines
    this.dimensionLines = this.dimensionLines.slice(0);
    this.dimensionLines.splice(index, 1);
    this.dimensionLinesChangeSupport.fireCollectionChanged(dimensionLine, CollectionEvent.Type.DELETE);
  }
}

/**
 * Adds the label <code>listener</code> in parameter to this home.
 * @param listener the listener to add
 * @ignore
 */
Home.prototype.addLabelsListener = function(listener) {
  this.labelsChangeSupport.addCollectionListener(listener);
}

/**
 * Removes the label <code>listener</code> in parameter from this home.
 * @param listener the listener to remove
 * @ignore
 */
Home.prototype.removeLabelsListener = function(listener) {
  this.labelsChangeSupport.removeCollectionListener(listener);
} 

/**
 * Returns an array of the labels of this home.
 * @return {Label []}
 * @ignore
 */
Home.prototype.getLabels = function() {
  return this.labels;
}

/**
 * Adds the given label to the set of labels of this home.
 * Once <code>label</code> is added, label listeners added 
 * to this home will receive a {@link CollectionEvent}
 * notification, with an event type equal to ADD. 
 * @param {Label} label  the label to add
 * @ignore
 */
Home.prototype.addLabel = function(label) {
  // Make a copy of the list to avoid conflicts in the list returned by getLabels
  this.labels = this.labels.slice(0);
  this.labels.push(label);
  label.setLevel(this.selectedLevel);
  this.labelsChangeSupport.fireCollectionChanged(label, CollectionEvent.Type.ADD);
}

/**
 * Removes the given label from the set of labels of this home.
 * Once <code>label</code> is removed, label listeners added to this home will receive a
 * {@link CollectionEvent} notification, with an event type equal to DELETE.
 * @param {Label} label  the label to remove
 * @ignore
 */
Home.prototype.deleteLabel = function(label) {
  //  Ensure selectedItems don't keep a reference to label
  this.deselectItem(label);
  var index = this.labels.indexOf(label);
  if (index !== -1) {
    label.setLevel(null);
    // Make a copy of the list to avoid conflicts in the list returned by getLabels
    this.labels = this.labels.slice(0);
    this.labels.splice(index, 1);
    this.labelsChangeSupport.fireCollectionChanged(label, CollectionEvent.Type.DELETE);
  }
}

/**
 * Returns all the selectable and viewable items in this home, except the observer camera.
 * @return a list containing viewable walls, furniture, dimension lines, labels and compass.
 * @reurn {Object []}
 */
Home.prototype.getSelectableViewableItems = function() {
  var homeItems = [];
  this.addViewableItems(this.walls, homeItems);
  this.addViewableItems(this.rooms, homeItems);
  this.addViewableItems(this.dimensionLines, homeItems);
  this.addViewableItems(this.polylines, homeItems);
  this.addViewableItems(this.labels, homeItems);
  var furniture = this.getFurniture();
  for (var i = 0; i < furniture.length; i++) {
    var piece = furniture [i];
    if (piece.isVisible()
        && (piece.getLevel() === null
            || piece.getLevel().isViewable())) {
      homeItems.push(piece);
    }
  }
  if (this.getCompass().isVisible()) {
    homeItems.push(getCompass());
  }
  return homeItems;
}

/**
 * Adds the viewable items to the set of selectable viewable items.
 * @private
 */
Home.prototype.addViewableItems = function(items, selectableViewableItems) {
  for (var i = 0; i < items.length; i++) {
    var item = items [i];
    if (item.getLevel) {
      var elevatableItem = item;
      if (elevatableItem.getLevel() === null
          || elevatableItem.getLevel().isViewable()) {
        selectableViewableItems.push(item);
      }
    }
  }
}

/**
 * Returns <code>true</code> if this home doesn't contain any item i.e.  
 * no piece of furniture, no wall, no room, no dimension line and no label.
 * @return {boolean}
 */
Home.prototype.isEmpty = function() {
  return this.furniture.length === 0
      && this.walls.length === 0
      && this.rooms.length === 0
      && this.dimensionLines.length === 0
      && this.polylines.length === 0
      && this.labels.length === 0;
}

/**
 * Adds the property change <code>listener</code> in parameter to this home.
 * @param {string} property the property to follow
 * @param listener the listener to add
 */
Home.prototype.addPropertyChangeListener = function(property, listener) {
  this.propertyChangeSupport.addPropertyChangeListener(property, listener);
}

/**
 * Removes the property change <code>listener</code> in parameter from this home.
 * @param {string} property the followed property 
 * @param listener the listener to remove
 */
Home.prototype.removePropertyChangeListener = function(property, listener) {
  this.propertyChangeSupport.removePropertyChangeListener(property, listener);
}

/**
 * Returns the wall height of this home.
 * @return {number}
 * @ignore
 */
Home.prototype.getWallHeight = function() {
  return this.wallHeight;
}

/**
 * Returns the name of this home.
 * @return {string}
 */
Home.prototype.getName = function() {
  return this.name;
}

/**
 * Sets the name of this home and fires a <code>PropertyChangeEvent</code>.
 * @param {string} name  the new name of this home 
 */
Home.prototype.setName = function(name) {
  if (name != this.name) {
    var oldName = this.name;
    this.name = name;
    this.propertyChangeSupport.firePropertyChange("NAME", oldName, name);
  }
}

/**
 * Returns whether the state of this home is modified or not.
 * @return {boolean}
 */
Home.prototype.isModified = function() {
  return this.modified;
}

/**
 * Sets the modified state of this home and fires a <code>PropertyChangeEvent</code>.
 * @param {boolean} modified
 */
Home.prototype.setModified = function(modified) {
  if (modified !== this.modified) {
    this.modified = modified;
    this.propertyChangeSupport.firePropertyChange("MODIFIED", !modified, modified);
  }
}

/**
 * Returns whether this home was recovered or not.
 * @return {boolean}
 * @ignore
 */
Home.prototype.isRecovered = function() {
  return this.recovered;
}

/**
 * Sets whether this home was recovered or not and fires a <code>PropertyChangeEvent</code>.
 * @param {boolean} recovered
 * @ignore
 */
Home.prototype.setRecovered = function(recovered) {
  if (recovered !== this.recovered) {
    this.recovered = recovered;
    this.propertyChangeSupport.firePropertyChange("RECOVERED", !recovered, recovered);
  }
}

/**
 * Returns whether this home was repaired or not.
 * @return {boolean}
 * @ignore
 */
Home.prototype.isRepaired = function() {
  return this.repaired;
}

/**
 * Sets whether this home is repaired or not and fires a <code>PropertyChangeEvent</code>.
 * @param {boolean} repaired
 * @ignore
 */
Home.prototype.setRepaired = function(repaired) {
  if (repaired !== this.repaired) {
    this.repaired = repaired;
    this.propertyChangeSupport.firePropertyChange("REPAIRED", !repaired, repaired);
  }
}

/**
 * Returns the furniture property on which home is sorted or <code>null</code> if
 * home furniture isn't sorted.
 * @return {string}
 * @ignore
 */
Home.prototype.getFurnitureSortedProperty = function() {
  return this.furnitureSortedProperty;
}

/**
 * Sets the furniture property on which this home should be sorted 
 * and fires a <code>PropertyChangeEvent</code>.
 * @param furnitureSortedProperty the new property
 * @ignore
 */
Home.prototype.setFurnitureSortedProperty = function(furnitureSortedProperty) {
  if (furnitureSortedProperty != this.furnitureSortedProperty) {
    var oldFurnitureSortedProperty = this.furnitureSortedProperty;
    this.furnitureSortedProperty = furnitureSortedProperty;
    this.propertyChangeSupport.firePropertyChange("FURNITURE_SORTED_PROPERTY", 
        oldFurnitureSortedProperty, furnitureSortedProperty);
  }
}

/**
 * Returns whether furniture is sorted in ascending or descending order.
 * @return {boolean}
 * @ignore
 */
Home.prototype.isFurnitureDescendingSorted = function() {
  return this.furnitureDescendingSorted;
}

/**
 * Sets the furniture sort order on which home should be sorted 
 * and fires a <code>PropertyChangeEvent</code>.
 * @param {boolean} furnitureDescendingSorted
 * @ignore
 */
Home.prototype.setFurnitureDescendingSorted = function(furnitureDescendingSorted) {
  if (furnitureDescendingSorted !== this.furnitureDescendingSorted) {
    this.furnitureDescendingSorted = furnitureDescendingSorted;
    this.propertyChangeSupport.firePropertyChange("FURNITURE_DESCENDING_SORTED", 
        !furnitureDescendingSorted, furnitureDescendingSorted);
  }
}

/**
 * Returns an unmodifiable list of the furniture properties that are visible.
 * @return {string []}
 * @ignore
 */
Home.prototype.getFurnitureVisibleProperties = function() {
  if (this.furnitureVisibleProperties === null) {
    return [];
  } else {
    return this.furnitureVisibleProperties;
  }
}

/**
 * Sets the furniture properties that are visible and the order in which they are visible,
 * then fires a <code>PropertyChangeEvent</code>.
 * @param {string []} furnitureVisibleProperties  the properties to display
 * @ignore
 */
Home.prototype.setFurnitureVisibleProperties = function(furnitureVisibleProperties) {
  if (furnitureVisibleProperties !== this.furnitureVisibleProperties) {
    var oldFurnitureVisibleProperties = this.furnitureVisibleProperties;
    this.furnitureVisibleProperties = furnitureVisibleProperties.slice(0);
    this.propertyChangeSupport.firePropertyChange("FURNITURE_VISIBLE_PROPERTIES", 
        Collections.unmodifiableList(oldFurnitureVisibleProperties), 
        Collections.unmodifiableList(furnitureVisibleProperties));
  }
}

/**
 * Returns the plan background image of this home.
 * @return {BackgroundImage}
 * @ignore
 */
Home.prototype.getBackgroundImage = function() {
  return this.backgroundImage;
}

/**
 * Sets the plan background image of this home and fires a <code>PropertyChangeEvent</code>.
 * @param {BackgroundImage} backgroundImage  the new background image
 * @ignore
 */
Home.prototype.setBackgroundImage = function(backgroundImage) {
  if (backgroundImage !== this.backgroundImage) {
    var oldBackgroundImage = this.backgroundImage;
    this.backgroundImage = backgroundImage;
    this.propertyChangeSupport.firePropertyChange("BACKGROUND_IMAGE", oldBackgroundImage, backgroundImage);
  }
}

/**
 * Returns the camera used to display this home from a top point of view.
 * @return {Camera}
 */
Home.prototype.getTopCamera = function() {
  return this.topCamera;
}

/**
 * Returns the camera used to display this home from an observer point of view.
 * @return {ObserverCamera}
 */
Home.prototype.getObserverCamera = function() {
  return this.observerCamera;
}

/**
 * Sets the camera used to display this home and fires a <code>PropertyChangeEvent</code>.
 * @param {Camera} camera  the camera to use
 */
Home.prototype.setCamera = function(camera) {
  if (camera !== this.camera) {
    var oldCamera = this.camera;
    this.camera = camera;
    this.propertyChangeSupport.firePropertyChange("CAMERA", oldCamera, camera);
  }
}

/**
 * Returns the camera used to display this home.
 * @return {Camera}
 */
Home.prototype.getCamera = function() {
  if (this.camera === null) {
    // Use by default top camera
    this.camera = this.getTopCamera();
  }
  return this.camera;
}

/**
 * Sets the cameras stored by this home and fires a <code>PropertyChangeEvent</code>.
 * The list given as parameter is cloned but not the camera instances it contains.
 * @param {Camera []} storedCameras  the new list of cameras 
 */
Home.prototype.setStoredCameras = function(storedCameras) {
  if (this.storedCameras !== storedCameras) {
    var oldStoredCameras = this.storedCameras;
    if (storedCameras === null) {
      this.storedCameras = [];
    } else {
      this.storedCameras = storedCameras.slice(0);
    }
    this.propertyChangeSupport.firePropertyChange("STORED_CAMERAS", oldStoredCameras, storedCameras);
  }
}

/**
 * Returns an array of the cameras stored by this home.
 * @return {Camera []}
 */
Home.prototype.getStoredCameras = function() {
  return this.storedCameras;
}

/**
 * Returns the environment attributes of this home.
 * @return {HomeEnvironment}
 */
Home.prototype.getEnvironment = function() {
  return this.environment;
}

/**
 * Returns the compass associated to this home.
 * @return {Compass}
 * @ignore
 */
Home.prototype.getCompass = function() {
  if (this.compass === null) {
    this.compass = new Compass(-100, 50, 100);
    this.compass.setVisible(true);
  }
  return this.compass;
}

/**
 * Returns the print attributes of this home.
 * @return {HomePrint}
 * @ignore
 */
Home.prototype.getPrint = function() {
  return this.print;
}

/**
 * Sets the print attributes of this home and fires a <code>PropertyChangeEvent</code>.
 * @param {HomePrint} print  the new print attributes
 * @ignore
 */
Home.prototype.setPrint = function(print) {
  if (print !== this.print) {
    var oldPrint = this.print;
    this.print = print;
    this.propertyChangeSupport.firePropertyChange(PRINT, oldPrint, print);
  }
  this.print = print;
}

/**
 * Returns the value of the property <code>propertyName</code> associated with this home.
 * @return {string} the value of the property or <code>null</code> if it doesn't exist. 
 */
Home.prototype.getProperty = function(propertyName) {
  return this.properties [propertyName];
}

/**
 * Returns the numeric value of the property <code>propertyName</code> associated with this home.
 * @return {number} a number or <code>null</code> if the property doesn't exist or can't be parsed. 
 */
Home.prototype.getNumericProperty = function(propertyName) {
  var value = this.properties [propertyName];
  if (value !== undefined) {
    number = parseFloat(value);
    if (!isNaN(number)) {
      return number;
    } 
  }
  return null;
}

/**
 * Sets a property associated with this home.
 * @param {string} propertyName   the name of the property to set
 * @param {string} propertyValue  the new value of the property 
 */
Home.prototype.setProperty = function(propertyName, propertyValue) {
  this.properties [propertyName] = propertyValue;
}

/**
 * Returns the property names.
 * @return {string []}
 */
Home.prototype.getPropertyNames = function() {
  return Object.keys(this.properties);
}

/**
 * Returns <code>true</code> if the home objects belonging to the base plan 
 * (generally walls, rooms, dimension lines and texts) are locked.
 * @return {boolean}
 * @ignore
 */
Home.prototype.isBasePlanLocked = function() {
  return this.basePlanLocked;
}

/**
 * Sets whether home objects belonging to the base plan (generally walls, rooms, 
 * dimension lines and texts) are locked and fires a <code>PropertyChangeEvent</code>.
 * @param {boolean} basePlanLocked
 * @ignore
 */
Home.prototype.setBasePlanLocked = function(basePlanLocked) {
  if (basePlanLocked !== this.basePlanLocked) {
    this.basePlanLocked = basePlanLocked;
    this.propertyChangeSupport.firePropertyChange("BASE_PLAN_LOCKED", !basePlanLocked, basePlanLocked);
  }
}

/**
 * Returns the version of this home the last time it was saved.  
 * Version is useful to know with which Sweet Home 3D version this home was saved
 * and warn user that he may lose information if he saves with 
 * current application a home created by a more recent version.
 * @return {number}
 */
Home.prototype.getVersion = function() {
  return this.version;
}

/**
 * Sets the application version of this home.
 * @return {number} version  the new version
 * @ignore
 */
Home.prototype.setVersion = function(version) {
  this.version = version;
}

/**
 * Returns a clone of this home and the objects it contains. 
 * Listeners bound to this home aren't added to the returned home.
 * @return {Home}
 */
Home.prototype.clone = function() {
  return new Home(this);
}

/**
 * Copies all data of a <code>source</code> home to a <code>destination</code> home.
 * @private
 */
Home.copyHomeData = function(source, destination) {
  // Copy non mutable data
  destination.allLevelsSelection = source.allLevelsSelection;
  destination.name = source.name;
  destination.modified = source.modified;
  destination.recovered = source.recovered;
  destination.repaired = source.repaired;
  destination.backgroundImage = source.backgroundImage;
  destination.print = source.print;
  destination.furnitureDescendingSorted = source.furnitureDescendingSorted;
  destination.version = source.version;
  destination.basePlanLocked = source.basePlanLocked;
  destination.furnitureSortedProperty = source.furnitureSortedProperty;
  destination.furnitureVisibleProperties = source.furnitureVisibleProperties;
  
  // Deep copy selectable items
  destination.selectedItems = [];
  destination.furniture = Home.cloneSelectableItems(
      source.furniture, source.selectedItems, destination.selectedItems);
  for (var i = 0; i < source.furniture.length; i++) {
    var piece = source.furniture [i];
    if (typeof HomeDoorOrWindow !== "undefined"
        && piece instanceof HomeDoorOrWindow
        && piece.isBoundToWall()) {
      destination.furniture [i].setBoundToWall(true);
    }
  }
  destination.rooms = Home.cloneSelectableItems(source.rooms, source.selectedItems, destination.selectedItems);
  destination.dimensionLines = Home.cloneSelectableItems(
      source.dimensionLines, source.selectedItems, destination.selectedItems);
  destination.polylines = Home.cloneSelectableItems(
      source.polylines, source.selectedItems, destination.selectedItems);
  destination.labels = Home.cloneSelectableItems(source.labels, source.selectedItems, destination.selectedItems);
  // Deep copy walls
  if (typeof Wall !== "undefined") {
    destination.walls = Wall.clone(source.walls);
  } else {
    destination.walls = [];
  }
  for (var i = 0; i < source.walls.length; i++) {
    var wall = source.walls [i];
    if (source.selectedItems.contains(wall)) {
      destination.selectedItems.push(destination.walls [i]);
    }
  }
  // Clone levels and set the level of cloned objects 
  destination.levels = [];
  if (source.levels.length > 0) {
    for (var i = 0; i < source.levels.length; i++) {
      destination.levels.push(source.levels [i].clone());
    }
    for (var i = 0; i < source.furniture.length; i++) {
      var pieceLevel = source.furniture [i].getLevel();
      if (pieceLevel !== null) {
        // As soon as there's more than one level, every object is supposed to have its level set
        // but as level can still be null for a undetermined reason, prefer to keep level
        // to null in the cloned object and having errors further than throwing exception here
        destination.furniture [i].setLevel(destination.levels [source.levels.indexOf(pieceLevel)]);
      }
    }
    for (var i = 0; i < source.rooms.length; i++) {
      var roomLevel = source.rooms [i].getLevel();
      if (roomLevel !== null) {
        destination.rooms [i].setLevel(destination.levels.get(source.levels.indexOf(roomLevel)));
      }
    }
    for (var i = 0; i < source.dimensionLines.length; i++) {
      var dimensionLineLevel = source.dimensionLines [i].getLevel();
      if (dimensionLineLevel !== null) {
        destination.dimensionLines [i].setLevel(destination.levels [source.levels.indexOf(dimensionLineLevel)]);
      }
    }
    for (var i = 0; i < source.polylines.length; i++) {
      var polylineLevel = source.polylines [i].getLevel();
      if (polylineLevel !== null) {
        destination.polylines [i].setLevel(destination.levels [source.levels.indexOf(polylineLevel)]);
      }
    }
    for (var i = 0; i < source.labels.length; i++) {
      var labelLevel = source.labels [i].getLevel();
      if (labelLevel !== null) {
        destination.labels [i].setLevel(destination.levels [source.levels.indexOf(labelLevel)]);
      }
    }
    for (var i = 0; i < source.walls.length; i++) {
      var wallLevel = source.walls [i].getLevel();
      if (wallLevel !== null) {
        destination.walls [i].setLevel(destination.levels [source.levels.indexOf(wallLevel)]);
      }
    }
    if (source.selectedLevel !== null) {
      destination.selectedLevel = destination.levels [source.levels.indexOf(source.selectedLevel)];
    }
  } else {
    destination.selectedLevel = null;
  }
  // Copy cameras
  destination.observerCamera = source.observerCamera.clone();
  destination.topCamera = source.topCamera.clone();
  if (source.camera === source.observerCamera) {
    destination.camera = destination.observerCamera;
    if (source.selectedItems.indexOf(source.observerCamera) !== -1) {
      destination.selectedItems.push(destination.observerCamera);
    }
  } else {
    destination.camera = destination.topCamera;
  }
  destination.storedCameras = new Array(source.storedCameras.length);
  for (var i = 0; i < source.storedCameras.length; i++) {
    var camera = source.storedCameras [i];
    destination.storedCameras [i] = camera.clone();
  }
  // Copy other mutable objects
  destination.environment = source.environment.clone();
  if (source.compass !== null) {
    destination.compass = source.compass.clone();
  }
  destination.furnitureVisibleProperties = source.furnitureVisibleProperties.slice(0);
  destination.properties = {};
  for (var i = 0; i < source.properties.length; i++) {
    destination.properties [i] = source.properties [i];
  }
  // Additional possible structure field
  destination.structure = source.structure;
}

/**
 * Returns the list of cloned items in <code>source</code>.
 * If a cloned item is selected its clone will be selected too (ie added to 
 * <code>destinationSelectedItems</code>).
 * @private
 */
Home.cloneSelectableItems = function(source, sourceSelectedItems, destinationSelectedItems) {
  var destination = new Array(source.length);
  for (var i = 0; i < source.length; i++) {
    var item = source [i];
    var clone = item.clone();
    destination [i] = clone;
    if (sourceSelectedItems.indexOf(item) !== -1) {
      destinationSelectedItems.push(clone);
    } else if (item instanceof HomeFurnitureGroup) {
      // Check if furniture in group is selected
      var sourceFurnitureGroup = item.getAllFurniture();
      var destinationFurnitureGroup = null;
      for (var j = 0, n = sourceFurnitureGroup.length; j < n; j++) {
        var piece = sourceFurnitureGroup [j];
        if (sourceSelectedItems.indexOf(piece) !== -1) {
          if (destinationFurnitureGroup === null) {
            destinationFurnitureGroup = clone.getAllFurniture();
          }
          destinationSelectedItems.push(destinationFurnitureGroup [j]);
        }
      }
    }
  }
  return destination;
}

/**
 * Returns a deep copy of home selectable <code>items</code>.
 * @param {Object []} items  the items to duplicate 
 */
Home.duplicate = function(items) {
  var list = [];
  for (var i = 0; i < items.length; i++) {
    var item = items [i];
    if (!(item instanceof Wall)         // Walls are copied further
        && !(item instanceof Camera)    // Cameras and compass can't be duplicated
        && !(item instanceof Compass)) { 
      list.push(item.clone());
    }
  }
  // Add to list a clone of walls list with their walls at start and end point set
  list.push.apply(list, Wall.clone(Home.getWallsSubList(items)));
  return list;
}

/**
 * Returns a sub list of <code>items</code> that contains only home furniture.
 * @param {Object []} items  the items among which the search is done
 * @return {HomePieceOfFurniture []}
 */
Home.getFurnitureSubList = function(items) {
  return Home.getSubList(items, HomePieceOfFurniture);
}

/**
 * Returns a sub list of <code>items</code> that contains only walls.
 * @param {Object []} items  the items among which the search is done
 * @return {Wall []}
 * @ignore
 */
Home.getWallsSubList = function(items) {
  if (typeof Wall !== "undefined") {
    return Home.getSubList(items, Wall);
  } else {
    // Silently ignore missing class
    return [];
  }
}

/**
 * Returns a sub list of <code>items</code> that contains only rooms.
 * @param {Object []} items  the items among which the search is done
 * @return {Room []}
 * @ignore
 */
Home.getRoomsSubList = function(items) {
  if (typeof Room !== "undefined") {
    return Home.getSubList(items, Room);
  } else {
    // Silently ignore missing class
    return [];
  }
}

/**
 * Returns a sub list of <code>items</code> that contains only labels.
 * @param {Object []} items  the items among which the search is done
 * @return {Polyline []}
 * @ignore
 */
Home.getPolylinesSubList = function(items) {
  if (typeof Polyline !== "undefined") {
    return Home.getSubList(items, Polyline);
  } else {
    // Silently ignore missing class
    return [];
  }
}

/**
 * Returns a sub list of <code>items</code> that contains only dimension lines.
 * @param {Object []} items  the items among which the search is done
 * @return {DimensionLine []}
 * @ignore
 */
Home.getDimensionLinesSubList = function(items) {
  if (typeof DimensionLine !== "undefined") {
    return Home.getSubList(items, DimensionLine);
  } else {
    // Silently ignore missing class
    return [];
  }
}

/**
 * Returns a sub list of <code>items</code> that contains only labels.
 * @param {Object []} items  the items among which the search is done
 * @return {Label []}
 * @ignore
 */
Home.getLabelsSubList = function(items) {
  if (typeof Label !== "undefined") {
    return Home.getSubList(items, Label);
  } else {
    // Silently ignore missing class
    return [];
  }
}

/**
 * Returns a sub list of <code>items</code> that contains only instances of <code>subListClass</code>.
 * @param {Object []} items      the items among which the search is done
 * @param {Object} subListClass  the class of the searched items
 * @return {Object []}
 */
Home.getSubList = function(items, subListClass) {
  var subList = [];
  for (var i = 0; i < items.length; i++) {
    var item = items [i];
    if (item instanceof subListClass) {
      subList.push(item);
    }
  }
  return subList;
}
