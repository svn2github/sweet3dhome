/*
 * BackgroundImage.js
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
 * Creates a background image.
 * @param {URLContent} image  the image displayed by this background image
 * @param {number} scaleDistance
 * @param {number} scaleDistanceXStart
 * @param {number} scaleDistanceYStart
 * @param {number} scaleDistanceXEnd
 * @param {number} scaleDistanceYEnd
 * @param {number} xOrigin
 * @param {number} yOrigin
 * @param {boolean} visible
 * @constructor
 * @ignore
 * @author Emmanuel Puybaret
 */
function BackgroundImage(image, scaleDistance, scaleDistanceXStart, scaleDistanceYStart, scaleDistanceXEnd, scaleDistanceYEnd, xOrigin, yOrigin, visible) {
  this.image = image;
  this.scaleDistance = scaleDistance;
  this.scaleDistanceXStart = scaleDistanceXStart;
  this.scaleDistanceYStart = scaleDistanceYStart;
  this.scaleDistanceXEnd = scaleDistanceXEnd;
  this.scaleDistanceYEnd = scaleDistanceYEnd;
  this.xOrigin = xOrigin;
  this.yOrigin = yOrigin;
  this.invisible = !visible;
}

/**
 * Returns the image content of this background image.
 * @return {URLContent}
 */
BackgroundImage.prototype.getImage = function() {
  return this.image;
}

/**
 * Returns the distance used to compute the scale of this image.
 * @return {number}
 */
BackgroundImage.prototype.getScaleDistance = function() {
  return this.scaleDistance;
}

/**
 * Returns the abscissa of the start point used to compute 
 * the scale of this image.
 * @return {number}
 */
BackgroundImage.prototype.getScaleDistanceXStart = function() {
  return this.scaleDistanceXStart;
}

/**
 * Returns the ordinate of the start point used to compute 
 * the scale of this image.
 * @return {number}
 */
BackgroundImage.prototype.getScaleDistanceYStart = function() {
  return this.scaleDistanceYStart;
}

/**
 * Returns the abscissa of the end point used to compute 
 * the scale of this image.
 * @return {number}
 */
BackgroundImage.prototype.getScaleDistanceXEnd = function() {
  return this.scaleDistanceXEnd;
}

/**
 * Returns the ordinate of the end point used to compute 
 * the scale of this image.
 * @return {number}
 */
BackgroundImage.prototype.getScaleDistanceYEnd = function() {
  return this.scaleDistanceYEnd;
}

/**
 * Returns the scale of this image.
 * @return {number}
 */
BackgroundImage.prototype.getScale = function() {
  return BackgroundImage.getScale(this.scaleDistance,
      this.scaleDistanceXStart, this.scaleDistanceYStart, 
      this.scaleDistanceXEnd, this.scaleDistanceYEnd);
}

/**
 * Returns the scale equal to <code>scaleDistance</code> divided
 * by the distance between the points 
 * (<code>scaleDistanceXStart</code>, <code>scaleDistanceYStart</code>)
 * and (<code>scaleDistanceXEnd</code>, <code>scaleDistanceYEnd</code>).
 * @return {number}
 */
BackgroundImage.getScale = function(scaleDistance, 
                                    scaleDistanceXStart, scaleDistanceYStart,
                                    scaleDistanceXEnd, scaleDistanceYEnd) {
  if (typeof Point2D === "undefined") {
    throw "Missing geom.js";
  }
  return scaleDistance 
      / Point2D.distance(scaleDistanceXStart, scaleDistanceYStart, 
                         scaleDistanceXEnd, scaleDistanceYEnd);
}

/**
 * Returns the origin abscissa of this image.
 * @return {number}
 */
BackgroundImage.prototype.getXOrigin = function() {
  return this.xOrigin;
}

/**
 * Returns the origin ordinate of this image.
 * @return {number}
 */
BackgroundImage.prototype.getYOrigin = function() {
  return this.yOrigin;
}

/**
 * Returns <code>true</code> if this image is visible in plan.
 * @return {boolean}
 */
BackgroundImage.prototype.isVisible = function() {
  return !this.invisible;
}
