/*
 * Level.js
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

/**
 * Creates a home level from an existing level.
 * @param {string} name  the name of the level
 * @param {number} elevation the elevation of the bottom of the level
 * @param {number} floorThickness the floor thickness of the level
 * @param {number} height the height of the level
 * @constructor
 * @author Emmanuel Puybaret
 */
function Level(name, elevation, floorThickness, height) {
  this.name = name;
  this.elevation = elevation;
  this.floorThickness = floorThickness;
  this.height = height;
  this.backgroundImage = null;
  this.visible = true;
  this.viewable = true;
  this.elevationIndex = -1;
  this.propertyChangeSupport = new PropertyChangeSupport(this);
}

/**
 * Adds the property change <code>listener</code> in parameter to this level.
 * @param listener the listener to add
 */
Level.prototype.addPropertyChangeListener = function(listener) {
  this.propertyChangeSupport.addPropertyChangeListener(listener);
}

/**
 * Removes the property change <code>listener</code> in parameter from this level.
 * @param listener the listener to remove
 */
Level.prototype.removePropertyChangeListener = function(listener) {
  this.propertyChangeSupport.removePropertyChangeListener(listener);
}

/**
 * Returns the name of this level.
 * @return {string} name
 */
Level.prototype.getName = function() {
  return this.name;
}

/**
 * Sets the name of this level. Once this level 
 * is updated, listeners added to this level will receive a change notification.
 * @param {string} name
 */
Level.prototype.setName = function(name) {
  if (name != this.name) {
    var oldName = this.name;
    this.name = name;
    this.propertyChangeSupport.firePropertyChange("NAME", oldName, name);
  }
}

/**
 * Returns the elevation of the bottom of this level.
 * @return {number} 
 */
Level.prototype.getElevation = function() {
  return this.elevation;
}

/**
 * Sets the elevation of this level. Once this level is updated, 
 * listeners added to this level will receive a change notification.
 * @param {number} elevation
 */
Level.prototype.setElevation = function(elevation) {
  if (elevation != this.elevation) {
    var oldElevation = this.elevation;
    this.elevation = elevation;
    this.propertyChangeSupport.firePropertyChange("ELEVATION", oldElevation, elevation);
  }
}

/**
 * Returns the floor thickness of this level. 
 * @return {number} 
 */
Level.prototype.getFloorThickness = function() {
  return this.floorThickness;
}

/**
 * Sets the floor thickness of this level. Once this level is updated, 
 * listeners added to this level will receive a change notification.
 * @param {number} floorThickness
 */
Level.prototype.setFloorThickness = function(floorThickness) {
  if (floorThickness != this.floorThickness) {
    var oldFloorThickness = this.floorThickness;
    this.floorThickness = floorThickness;
    this.propertyChangeSupport.firePropertyChange("FLOOR_THICKNESS", oldFloorThickness, floorThickness);
  }
}

/**
 * Returns the height of this level.
 * @return {number} 
 */
Level.prototype.getHeight = function() {
  return this.height;
}

/**
 * Sets the height of this level. Once this level is updated, 
 * listeners added to this level will receive a change notification.
 * @param {number} height
 */
Level.prototype.setHeight = function(height) {
  if (height != this.height) {
    var oldHeight = this.height;
    this.height = height;
    this.propertyChangeSupport.firePropertyChange("HEIGHT", oldHeight, height);
  }
}

/**
 * Returns the plan background image of this level.
 * @return {BackgroundImage}
 * @ignore 
 */
Level.prototype.getBackgroundImage = function() {
  return this.backgroundImage;
}

/**
 * Sets the plan background image of this level and fires a <code>PropertyChangeEvent</code>.
 * @param {BackgroundImage} backgroundImage
 * @ignore 
 */
Level.prototype.setBackgroundImage = function(backgroundImage) {
  if (backgroundImage != this.backgroundImage) {
    var oldBackgroundImage = this.backgroundImage;
    this.backgroundImage = backgroundImage;
    this.propertyChangeSupport.firePropertyChange("BACKGROUND_IMAGE", oldBackgroundImage, backgroundImage);
  }
}

/**
 * Returns <code>true</code> if this level is visible.
 * @returns {boolean} 
 */
Level.prototype.isVisible = function() {
  return this.visible;
}

/**
 * Sets whether this level is visible or not. Once this level is updated, 
 * listeners added to this level will receive a change notification.
 * @param {boolean} visible
 */
Level.prototype.setVisible = function(visible) {
  if (visible != this.visible) {
    this.visible = visible;
    this.propertyChangeSupport.firePropertyChange("VISIBLE", !visible, visible);
  }
}

/**
 * Returns <code>true</code> if this level is viewable.
 * @return {boolean} 
 */
Level.prototype.isViewable = function() {
  return this.viewable;
}

/**
 * Sets whether this level is viewable or not. Once this level is updated, 
 * listeners added to this level will receive a change notification.
 * @param {boolean} viewable
 */
Level.prototype.setViewable = function(viewable) {
  if (viewable != this.viewable) {
    this.viewable = viewable;
    this.propertyChangeSupport.firePropertyChange("VIEWABLE", !viewable, viewable);
  }
}

/**
 * Returns <code>true</code> if this level is viewable and visible.
 * @return {boolean} 
 */
Level.prototype.isViewableAndVisible = function() {
  return this.viewable && this.visible;
}

/**
 * Returns the index of this level used to order levels at the same elevation.
 * @return {number} 
 */
Level.prototype.getElevationIndex = function() {
  return this.elevationIndex;
}

/**
 * Sets the index of this level used to order levels at the same elevation.
 * @param {number} elevationIndex
 */
Level.prototype.setElevationIndex = function(elevationIndex) {
  if (elevationIndex != this.elevationIndex) {
    var oldElevationIndex = this.elevationIndex;
    this.elevationIndex = elevationIndex;
    this.propertyChangeSupport.firePropertyChange("ELEVATION_INDEX", oldElevationIndex, elevationIndex);
  }
}

/**
 * Returns a clone of this level.
 * @return {Level} 
 */
Level.prototype.clone = function() {
  var clone = new Level(this.name, this.elevation, this.floorThickness, this.height);
  clone.backgroundImage = this.backgroundImage;
  clone.visible = this.visible;
  clone.viewable = this.viewable;
  clone.elevationIndex = this.elevationIndex;
  clone.propertyChangeSupport = new PropertyChangeSupport(clone);
  return clone;
}

