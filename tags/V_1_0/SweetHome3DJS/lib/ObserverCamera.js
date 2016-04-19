/*
 * ObserverCamera.java 
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
//          Camera.js

/**
 * Creates an observer camera at the given location and angle.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} yaw  the yaw angle in radians
 * @param {number} pitch  the pitch angle in radians
 * @param {number} fieldOfView the horizontal field of view in radians
 * @constructor
 * @extends Camera
 * @author Emmanuel Puybaret
 */
function ObserverCamera(x, y, z, yaw, pitch, fieldOfView) {
  Camera.call(this, x, y, z, yaw, pitch, fieldOfView);
  this.fixedSize = false;
  this.shapeCache = null;
  this.rectangleShapeCache = null;
}
ObserverCamera.prototype = Object.create(Camera.prototype);
ObserverCamera.prototype.constructor = ObserverCamera;

/**
 * Sets whether camera size should depends on its elevation and will notify listeners
 * bound to size properties of the size change.
 */
ObserverCamera.prototype.setFixedSize = function(fixedSize) {
  if (this.fixedSize !== fixedSize) {
    var oldWidth = this.getWidth();
    var oldDepth = this.getDepth();
    var oldHeight = this.getHeight();
    this.fixedSize = fixedSize;
    this.shapeCache = null;
    this.rectangleShapeCache = null;
    this.propertyChangeSupport.firePropertyChange("WIDTH", oldWidth, this.getWidth());
    this.propertyChangeSupport.firePropertyChange("DEPTH", oldDepth, this.getDepth());
    this.propertyChangeSupport.firePropertyChange("HEIGHT", oldHeight, this.getHeight());
  }
}

/**
 * Returns <code>true</code> if the camera size doesn't change according to its elevation.
 * @return {boolean}
 */
ObserverCamera.prototype.isFixedSize = function() {
  return this.fixedSize;
}

/**
 * Sets the yaw angle in radians of this camera and notifies listeners 
 * of this change.
 * @param {number} yaw
 */
ObserverCamera.prototype.setYaw = function(yaw) {
  Camera.prototype.setYaw.call(this, yaw);
  this.shapeCache = null;
  this.rectangleShapeCache = null;
}

/**
 * Sets the abscissa of this camera and notifies listeners 
 * of this change.
 * @param {number} x
 */
ObserverCamera.prototype.setX = function(x) {
  Camera.prototype.setX.call(this, x);
  this.shapeCache = null;
  this.rectangleShapeCache = null;
}

/**
 * Sets the ordinate of this camera and notifies listeners 
 * of this change.
 * @param {number} y
 */
ObserverCamera.prototype.setY = function(y) {
  Camera.prototype.setY.call(this, y);
  this.shapeCache = null;
  this.rectangleShapeCache = null;
}

/**
 * Sets the elevation of this camera and notifies listeners 
 * of this change.
 * @param {number} z
 */
ObserverCamera.prototype.setZ = function(z) {
  var oldWidth = this.getWidth();
  var oldDepth = this.getDepth();
  var oldHeight = this.getHeight();
  Camera.prototype.setZ.call(this, z);
  this.shapeCache = null;
  this.rectangleShapeCache = null;
  this.propertyChangeSupport.firePropertyChange("WIDTH", oldWidth, this.getWidth());
  this.propertyChangeSupport.firePropertyChange("DEPTH", oldDepth, this.getDepth());
  this.propertyChangeSupport.firePropertyChange("HEIGHT", oldHeight, this.getHeight());
}

/**
 * Returns the width of this observer camera according to
 * human proportions with an eyes elevation at z. 
 * @return {number}
 */
ObserverCamera.prototype.getWidth = function() {
  if (this.fixedSize) {
    return 46.6;
  } else {
    // Adult width is 4 times the distance between head and eyes location    
    var width = this.getZ() * 4 / 14;
    return Math.min(Math.max(width, 20), 62.5);
  }
}

/**
 * Returns the depth of this observer camera according to
 * human proportions with an eyes elevation at z. 
 * @return {number}
 */
ObserverCamera.prototype.getDepth = function() {
  if (this.fixedSize) {
    return 18.6;
  } else {
    // Adult depth is equal to the 2 / 5 of its width 
    var depth = this.getZ() * 8 / 70;
    return Math.min(Math.max(depth, 8), 25);
  }
}

/**
 * Returns the height of this observer camera according to
 * human proportions with an eyes elevation at z. 
 * @return {number}
 */
ObserverCamera.prototype.getHeight = function() {
  if (this.fixedSize) {
    return 175;
  } else {
    // Eyes are 14 / 15 of an adult height
    return this.getZ() * 15 / 14;
  }
}

/**
 * Returns the points of each corner of the rectangle surrounding this camera.
 * @return an array of the 4 (x,y) coordinates of the camera corners.
 */
ObserverCamera.prototype.getPoints = function() {
  var cameraPoints = new Array(4);
  var it = this.getRectangleShape().getPathIterator(null);
  for (var i = 0; i < cameraPoints.length; i++) {
    cameraPoints [i] = [0., 0.];
    it.currentSegment(cameraPoints [i]);
    it.next();
  }
  return cameraPoints;
}

/**
 * Returns <code>true</code> if this camera intersects
 * with the horizontal rectangle which opposite corners are at points
 * (<code>x0</code>, <code>y0</code>) and (<code>x1</code>, <code>y1</code>).
 */
ObserverCamera.prototype.intersectsRectangle = function(x0, y0, x1, y1) {
  var rectangle = new Rectangle2D(x0, y0, 0, 0);
  rectangle.add(x1, y1);
  return this.getShape().intersects(rectangle);
}

/**
 * Returns <code>true</code> if this camera contains 
 * the point at (<code>x</code>, <code>y</code>)
 * with a given <code>margin</code>.
 */
ObserverCamera.prototype.containsPoint = function(x, y, margin) {
  if (margin == 0) {
    return this.getShape().contains(x, y);
  } else {
    return this.getShape().intersects(x - margin, y - margin, 2 * margin, 2 * margin);
  }
}

/**
 * Returns the ellipse shape matching this camera.
 */
ObserverCamera.prototype.getShape = function() {
  if (this.shapeCache == null) {
    // Create the ellipse that matches piece bounds
    var cameraEllipse = new Ellipse2D(
        this.getX() - this.getWidth() / 2, this.getY() - this.getDepth() / 2,
        this.getWidth(), this.getDepth());
    // Apply rotation to the rectangle
    var rotation = AffineTransform.getRotateInstance(this.getYaw(), this.getX(), this.getY());
    var it = cameraEllipse.getPathIterator(rotation);
    var pieceShape = new GeneralPath();
    pieceShape.append(it, false);
    // Cache shape
    this.shapeCache = pieceShape;
  }
  return this.shapeCache;
}

/**
 * Returns the rectangle shape matching this camera.
 */
ObserverCamera.prototype.getRectangleShape = function() {
  if (this.rectangleShapeCache == null) {
    // Create the ellipse that matches piece bounds
    var cameraRectangle = new Rectangle2D(
        this.getX() - this.getWidth() / 2, this.getY() - this.getDepth() / 2,
        this.getWidth(), this.getDepth());
    // Apply rotation to the rectangle
    var rotation = AffineTransform.getRotateInstance(this.getYaw(), this.getX(), this.getY());
    var it = cameraRectangle.getPathIterator(rotation);
    var cameraRectangleShape = new GeneralPath();
    cameraRectangleShape.append(it, false);
    // Cache shape
    this.rectangleShapeCache = cameraRectangleShape;
  }
  return this.rectangleShapeCache;
}

/**
 * Moves this camera of (<code>dx</code>, <code>dy</code>) units.
 */
ObserverCamera.prototype.move = function(dx, dy) {
  this.setX(this.getX() + dx);
  this.setY(this.getY() + dy);
}

/**
 * Returns a clone of this camera.
 * @return {ObserverCamera}
 */
ObserverCamera.prototype.clone = function() {
  var clone = new ObserverCamera(this.getX(), this.getY(), this.getZ(), this.getYaw(), 
      this.getPitch(), this.getFieldOfView(), this.getTime(), this.getLens());
  clone.fixedSize = this.fixedSize;
  clone.shapeCache = this.shapeCache;
  clone.rectangleShapeCache = this.rectangleShapeCache;
  return clone;
}
