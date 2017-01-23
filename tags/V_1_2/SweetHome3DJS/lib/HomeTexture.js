/*
 * HomeTexture.js
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

// Requires URLContent.js

/**
 * Creates a home texture from an existing one with customized angle and offset.
 * @param {Object} texture the texture from which data are copied, 
 *                    either an instance of {@link CatalogTexture} or of this class
 * @param {number}  [angle]   the rotation angle applied to the texture
 * @param {boolean} [leftToRightOriented]
 * @constructor
 * @author Emmanuel Puybaret
 */
function HomeTexture(texture, angle, leftToRightOriented) {
  if (leftToRightOriented === undefined) {
    leftToRightOriented = false;
  }
  if (angle === undefined) {
    angle = 0;
  }
  this.name = texture.getName();
  this.image = texture.getImage();
  this.width = texture.getWidth();
  this.height = texture.getHeight();
  this.angle = angle;
  this.leftToRightOriented = leftToRightOriented;
  if (texture instanceof HomeTexture) {
    this.catalogId = texture.getCatalogId();
  } else if (texture instanceof CatalogTexture) {
    this.catalogId = texture.getId();
  } else {
    this.catalogId = null;
  }
}

/**
 * Returns the catalog ID of this texture or <code>null</code> if it doesn't exist.
 * @return {string}
 */
HomeTexture.prototype.getCatalogId = function() {
  return this.catalogId;
}

/**
 * Returns the name of this texture.
 * @return {string}
 */
HomeTexture.prototype.getName = function() {
  return this.name;
}

/**
 * Returns the content of the image used for this texture.
 * @return {URLContent} 
 */
HomeTexture.prototype.getImage = function() {
  return this.image;
}

/**
 * Returns the width of the image in centimeters.
 * @return {number}
 */
HomeTexture.prototype.getWidth = function() {
  return this.width;
}

/**
 * Returns the height of the image in centimeters.
 * @return {number} 
 */
HomeTexture.prototype.getHeight = function() {
  return this.height;
}

/**
 * Returns the angle of rotation in radians applied to this texture.
 * @return {number} 
 */
HomeTexture.prototype.getAngle = function() {
  return this.angle;
}

/**
 * Returns <code>true</code> if the objects using this texture should take into account 
 * the orientation of the texture.
 * @return {boolean} 
 */
HomeTexture.prototype.isLeftToRightOriented = function() {
  return this.leftToRightOriented;
}

/**
 * Returns <code>true</code> if the object in parameter is equal to this texture.
 * @param {Object} obj
 * @return {boolean} 
 */
HomeTexture.prototype.equals = function(obj) {
  if (obj == this) {
    return true;
  } else if (obj instanceof HomeTexture) {
    var texture = obj;
    return (texture.name == this.name)
        && (texture.image === this.image 
            || texture.image !== null && texture.image.equals(this.image))
        && texture.width === this.width
        && texture.height === this.height
        && texture.leftToRightOriented === this.leftToRightOriented
        && texture.angle === this.angle;
  } else {
    return false;
  }
}
