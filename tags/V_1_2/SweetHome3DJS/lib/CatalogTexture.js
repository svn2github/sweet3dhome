/*
 * CatalogTexture.js
 * 
 * Sweet Home 3D, Copyright (c) 2015 Emmanuel PUYBARET / eTeks <info@eteks.com>
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 */

// Requires URLContent.js

/**
 * Creates a catalog texture.
 * @param {string} id   the id of the texture
 * @param {string} name the name of this texture 
 * @param {URLContent} image the content of the image used for this texture
 * @param {number} width the width of the texture in centimeters
 * @param {number} height the height of the texture in centimeters
 * @param {string} creator the creator of this texture
 * @constructor   
 * @author Emmanuel Puybaret
 */
function CatalogTexture(id, name, image, width, height, creator, modifiable) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.width = width;
  this.height = height;
  this.creator = creator;
  this.modifiable = modifiable !== undefined ? modifiable : false;
  this.category = null;
}

/**
 * Returns the ID of this texture or <code>null</code>.
 * @return {string}
 */
CatalogTexture.prototype.getId = function() {
  return this.id;
}

/**
 * Returns the name of this texture.
 * @return {string}
 */
CatalogTexture.prototype.getName = function() {
  return this.name;
}

/**
 * Returns the content of the image used for this texture. 
 * @return {URLContent}
 */
CatalogTexture.prototype.getImage = function() {
  return this.image;
}

/**
 * Returns the icon of this texture.
 * @return {URLContent} the image of this texture.
 */
CatalogTexture.prototype.getIcon = function() {
  return this.getImage();
}

/**
 * Returns the width of the image in centimeters.
 * @return {number}
 */
CatalogTexture.prototype.getWidth = function() {
  return this.width;
}

/**
 * Returns the height of the image in centimeters.
 * @return {number}
 */
CatalogTexture.prototype.getHeight = function() {
  return this.height;
}

/**
 * Returns the creator of this texture or <code>null</code>.
 * @return {string}
 */
CatalogTexture.prototype.getCreator = function() {
  return this.creator;
}

/**
 * Returns <code>true</code> if this texture is modifiable (not read from resources).
 * @return {boolean}
 */
CatalogTexture.prototype.isModifiable = function() {
  return this.modifiable;
}

/**
 * Returns the category of this texture.
 * @return {Object}
 * @ignore
 */
CatalogTexture.prototype.getCategory = function() {
  return this.category;
}

/**
 * Sets the category of this texture.
 * @package
 * @ignore
 */
CatalogTexture.prototype.setCategory = function(category) {
  this.category = category;
}

/** 
 * Compares the names of this texture and the one in parameter.
 * @param {CatalogTexture} texture1
 * @param {CatalogTexture} texture2
 */
CatalogTexture.compare = function(texture1, texture2) {
  var nameComparison =  texture1.name.localeCompare(texture2.name);
  if (nameComparison != 0) {
    return nameComparison;
  } else {
    return texture1.modifiable == texture2.modifiable 
        ? 0
        : (texture1.modifiable ? 1 : -1); 
  }
}

/**
 * Returns <code>true</code> if this texture matches the given <code>filter</code> text. 
 * Each substring of the <code>filter</code> is considered as a search criterion that can match
 * the name, the category name or the creator of this texture.
 * @param {string} filter
 * @return {boolean}
 */
CatalogTexture.prototype.matchesFilter = function(filter) {
  var regex = new RegExp(filter, 'i');
  if (this.getName().match(regex)
      || this.getCategory() !== null && this.getCategory().getName().match(regex)
      || this.getCreator() !== null && this.getCreator().match(regex))
    return true;
  else {
    var tags = this.getTags();
    for (var i = 0; i < tags.length; i++) {
      if (tags [i].match(regex)) {
        return true;
      }
    }
  }
  return false;
}
