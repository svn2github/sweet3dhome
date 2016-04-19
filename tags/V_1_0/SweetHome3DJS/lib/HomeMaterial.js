/*
 * HomeMaterial.js
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

// Requires HomeTexture.js

/**
 * Creates a material instance from parameters.
 * @param {string} name the name of this material 
 * @param {string} key  the key of this material if different from name
 * @param {number} color  the color of the material in ARGB
 * @param {HomeTexture} texture the texture used for material
 * @param {number} shininess the shininess of this material material
 * @constructor   
 * @author Emmanuel Puybaret
 */
function HomeMaterial(name, key, color, texture, shininess) {
  this.name = name;
  this.key = key;
  this.color = color;
  this.texture = texture;
  this.shininess = shininess;
}

/**
 * Returns the name of this material.
 * @return {string} the name of the material or <code>null</code> if material has no name.
 */
HomeMaterial.prototype.getName = function() {
  return this.name;
}

/**
 * Returns the key of this material.
 * @return {string} the key of the material or <code>null</code> if material name should be used as key.
 */
HomeMaterial.prototype.getKey = function() {
  return this.key;
}

/**
 * Returns the color of this material.
 * @return {number} the color of the material as RGB code or <code>null</code> if material color is unchanged.
 */
HomeMaterial.prototype.getColor = function() {
  return this.color;
}

/**
 * Returns the texture of this material.
 * @return {HomeTexture} the texture of the material or <code>null</code> if material texture is unchanged.
 */
HomeMaterial.prototype.getTexture = function() {
  return this.texture;
}

/**
 * Returns the shininess of this material.
 * @return {number} a value between 0 (matt) and 1 (very shiny) or <code>null</code> if material shininess is unchanged.
 */
HomeMaterial.prototype.getShininess = function() {
  return this.shininess;
}
