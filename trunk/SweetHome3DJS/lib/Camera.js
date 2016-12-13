/*
 * Camera.java 
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

// Requires core.js
//          HomeObject.js

/**
 * Creates a camera at given location and angles.
 * By default, time is set at midday and lens is a pinhole lens.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} yaw  the yaw angle in radians
 * @param {number} pitch  the pitch angle in radians
 * @param {number} fieldOfView the horizontal field of view in radians
 * @param {number} [time] the date / time of this camera
 * @param {number} [lens] <code>Camera.Lens.PINHOLE</code>, <code>Camera.Lens.NORMAL</code>, 
 *                        <code>Camera.Lens.FISHEYE</code> or <code>Camera.Lens.SPHERICAL</code>
 * @constructor   
 * @author Emmanuel Puybaret
 */
function Camera(x, y, z, yaw, pitch, fieldOfView, time, lens) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.yaw = yaw;
  this.pitch = pitch;
  this.fieldOfView = fieldOfView;
  this.time = time !== undefined ? time : Camera.midday();
  this.lens = lens !== undefined ? lens : Camera.Lens.PINHOLE;
  this.propertyChangeSupport = new PropertyChangeSupport(this);
}
Camera.prototype = Object.create(HomeObject.prototype);
Camera.prototype.constructor = Camera;

/**
 * The kind of lens that can be used with a camera.
 * @enum
 */
Camera.Lens = {PINHOLE : 0, NORMAL : 1, FISHEYE : 2, SPHERICAL : 3} 

/**
 * Returns the time of midday today in milliseconds since the Epoch in UTC time zone.
 * @private
 */
Camera.midday = function() {
  var midday = new Date();
  midday.setHours(12, 0, 0, 0);
  return midday.getTime();
}

/**
 * Adds the property change <code>listener</code> in parameter to this camera.
 * The listener is a function that will receive in parameter an event of {@link PropertyChangeEvent} class.
 * @param listener  the listener that will receive {@link PropertyChangeEvent} events 
 */
Camera.prototype.addPropertyChangeListener = function(listener) {
  this.propertyChangeSupport.addPropertyChangeListener(listener);
}

/**
 * Removes the property change <code>listener</code> in parameter from this camera.
 * @param listener  the listener to remove 
 */
Camera.prototype.removePropertyChangeListener = function(listener) {
  this.propertyChangeSupport.removePropertyChangeListener(listener);
}

/**
 * Returns the name of this camera.
 * @return {string}
 */
Camera.prototype.getName = function() {
  return this.name;
}

/**
 * Sets the name of this camera and notifies listeners of this change.
 * @param {string} name 
 */
Camera.prototype.setName = function(name) {
  if (name != this.name) {
    var oldName = this.name;
    this.name = name;
    this.propertyChangeSupport.firePropertyChange("NAME", oldName, name);
  }
}

/**
 * Returns the yaw angle in radians of this camera.
 * @return {number}
 */
Camera.prototype.getYaw = function() {
  return this.yaw;
}

/**
 * Sets the yaw angle in radians of this camera and notifies listeners 
 * of this change.
 * @param {number} yaw
 */
Camera.prototype.setYaw = function(yaw) {
  if (yaw !== this.yaw) {
    var oldYaw = this.yaw;
    this.yaw = yaw;
    this.propertyChangeSupport.firePropertyChange("YAW", oldYaw, yaw);
  }
}

/**
 * Returns the pitch angle in radians of this camera.
 * @return {number}
 */
Camera.prototype.getPitch = function() {
  return this.pitch;
}

/**
 * Sets the pitch angle in radians of this camera and notifies listeners 
 * of this change.
 * @param {number} pitch
 */
Camera.prototype.setPitch = function(pitch) {
  if (pitch !== this.pitch) {
    var oldPitch = this.pitch;
    this.pitch = pitch;
    this.propertyChangeSupport.firePropertyChange("PITCH", oldPitch, pitch);
  }
}

/**
 * Returns the field of view in radians of this camera.
 * @return {number}
 */
Camera.prototype.getFieldOfView = function() {
  return this.fieldOfView;
}

/**
 * Sets the field of view in radians of this camera and notifies listeners 
 * of this change.
 * @param {number} fieldOfView
 */
Camera.prototype.setFieldOfView = function(fieldOfView) {
  if (fieldOfView !== this.fieldOfView) {
    var oldFieldOfView = this.fieldOfView;
    this.fieldOfView = fieldOfView;
    this.propertyChangeSupport.firePropertyChange("FIELD_OF_VIEW", oldFieldOfView, fieldOfView);
  }
}

/**
 * Returns the abscissa of this camera.
 * @return {number}
 */
Camera.prototype.getX = function() {
  return this.x;
}

/**
 * Sets the abscissa of this camera and notifies listeners 
 * of this change.
 * @param {number} x
 */
Camera.prototype.setX = function(x) {
  if (x !== this.x) {
    var oldX = this.x;
    this.x = x;
    this.propertyChangeSupport.firePropertyChange("X", oldX, x);
  }
}

/**
 * Returns the ordinate of this camera.
 * @return {number}
 */
Camera.prototype.getY = function() {
  return this.y;
}

/**
 * Sets the ordinate of this camera and notifies listeners 
 * of this change.
 * @param {number} y
 */
Camera.prototype.setY = function(y) {
  if (y !== this.y) {
    var oldY = this.y;
    this.y = y;
    this.propertyChangeSupport.firePropertyChange("Y", oldY, y);
  }
}

/**
 * Returns the elevation of this camera.
 * @return {number}
 */
Camera.prototype.getZ = function() {
  return this.z;
}

/**
 * Sets the elevation of this camera and notifies listeners 
 * of this change.
 * @param {number} z
 */
Camera.prototype.setZ = function(z) {
  if (z !== this.z) {
    var oldZ = this.z;
    this.z = z;
    this.propertyChangeSupport.firePropertyChange("Z", oldZ, z);
  }
}

/**
 * Returns the time in milliseconds when this camera is used.
 * @return {number} a time in milliseconds since the Epoch in UTC time zone
 */
Camera.prototype.getTime = function() {
  return this.time;
}

/**
 * Sets the use time in milliseconds since the Epoch in UTC time zone, 
 * and notifies listeners of this change. 
 * @param {number} time
 */
Camera.prototype.setTime = function(time) {
  if (this.time !== time) {
    var oldTime = this.time;
    this.time = time;
    this.propertyChangeSupport.firePropertyChange("TIME",  oldTime, time);
  }
}

/**
 * Returns a time expressed in UTC time zone converted to the given time zone. 
 */
Camera.convertTimeToTimeZone = function(utcTime, timeZone) { 
  if (timeZone === undefined) {
    timeZone = ""; 
  }
  var utcDate = new Date(utcTime);
  var stringDate = utcDate.toString();
  stringDate = stringDate.substring(0, stringDate.indexOf("GMT"));
  var date = new Date(stringDate + timeZone).getTime();
  if (isNaN(date)) {
    // Return time in GMT if invalid time zone
    return new Date(stringDate + "GMT").getTime(); 
  } else {
    return date; 
  } 
}

/**
 * Returns the lens of this camera.
 */
Camera.prototype.getLens = function() {
  return this.lens;
}

/**
 * Sets the lens of this camera and notifies listeners 
 * of this change.
 */
Camera.prototype.setLens = function(lens) {
  if (lens !== this.lens) {
    var oldLens = this.lens;
    this.lens = lens;
    this.propertyChangeSupport.firePropertyChange("LENS", oldLens, lens);
  }
}

/**
 * Sets the location and angles of this camera from the <code>camera</code> in parameter.
 * @param {Camera} camera
 */
Camera.prototype.setCamera = function(camera) {
  this.setX(camera.getX());
  this.setY(camera.getY());
  this.setZ(camera.getZ());
  this.setYaw(camera.getYaw());
  this.setPitch(camera.getPitch());
  this.setFieldOfView(camera.getFieldOfView());
}

/**
 * Returns a clone of this camera.
 * @return {Camera}
 */
Camera.prototype.clone = function() {
  var clone = new Camera(this.getX(), this.getY(), this.getZ(), this.getYaw(), 
      this.getPitch(), this.getFieldOfView(), this.getTime(), this.getLens());
  this.duplicateAttributes(clone);
  return clone;
}
