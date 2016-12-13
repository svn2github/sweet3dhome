/*
 * HomeObject.js
 *
 * Sweet Home 3D, Copyright (c) 2016 Emmanuel PUYBARET / eTeks <info@eteks.com>
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

/**
 * An object with data where users can stored their own properties.
 * @constructor   
 * @author Emmanuel Puybaret
 */
function HomeObject() {
}

/**
 * Returns the value of the property <code>name</code> associated with this object.
 * @return {string} the value of the property or <code>null</code> if it doesn't exist. 
 */
HomeObject.prototype.getProperty = function(name) {
  if (this.hasOwnProperty("properties")) {
    return this.properties [name];
  } else {
    return null;
  }
}

/**
 * Sets a property associated with this object.
 * @param {string} name   the name of the property to set
 * @param {string} value  the new value of the property 
 */
HomeObject.prototype.setProperty = function(name, value) {
  if (value === null) {
    if (this.hasOwnProperty("properties") && this.properties.hasOwnProperty(name)) {
      delete this.properties [name];
    }
  } else {
    if (!this.hasOwnProperty("properties")) {
      this.properties = {};
    }
    this.properties [name] = value;
  }
}

/**
 * Returns the property names.
 * @return {string []}
 */
HomeObject.prototype.getPropertyNames = function() {
  if (this.hasOwnProperty("properties")) {
    return Object.keys(this.properties);
  } else {
    return [];
  }
}

/**
 * Returns a clone of this object. 
 * @return {HomeObject}
 */
HomeObject.prototype.clone = function() {
  var clone = new HomeObject();
  this.duplicateAttributes(clone);
  return clone;
}

/**
 * Duplicates the attributes of this object. 
 * @param {HomeObject} object the object to which attributes are duplicated.
 * @protected
 * @ignore
 */
HomeObject.prototype.duplicateAttributes = function(homeObject) {
  if (this.hasOwnProperty("properties")) {
    homeObject.properties = {};
    for (var property in this.properties) {
      if (this.properties.hasOwnProperty(property)) {
        homeObject.properties [property] = this.properties [property];
      } 
    }
  }
}
