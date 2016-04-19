/*
 * CatalogPieceOfFurniture.js
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

// Requires big.js
//          URLContent.js
//          CatalogTexture.js

/**
 * Creates a piece of furniture of the catalog.
 * @param {string} id    the id of the new piece or <code>null</code>
 * @param {string} name  the name of the new piece
 * @param {string} description the description of the new piece 
 * @param {string} information additional information associated to the new piece
 * @param {string[]} tags tags associated to the new piece
 * @param {number} creationDate creation date of the new piece in milliseconds since the epoch 
 * @param {number} grade grade of the piece of furniture or <code>null</code>
 * @param {URLContent} icon content of the icon of the new piece
 * @param {URLContent} planIcon content of the icon of the new piece displayed in plan
 * @param {URLContent} model content of the 3D model of the new piece
 * @param {number} width  the width in centimeters of the new piece
 * @param {number} depth  the depth in centimeters of the new piece
 * @param {number} height  the height in centimeters of the new piece
 * @param {number} elevation  the elevation in centimeters of the new piece
 * @param {number} dropOnTopElevation  a percentage of the height at which should be placed 
 *            an object dropped on the new piece
 * @param {boolean} movable if <code>true</code>, the new piece is movable
 * @param {string} staircaseCutOutShape the shape used to cut out upper levels when they intersect 
 *            with the piece like a staircase
 * @param {Array} modelRotation the rotation 3 by 3 matrix applied to the piece model
 * @param {boolean} backFaceShown if <code>true</code> back faces should be used 
 * @param {string} creator the creator of the model
 * @param {boolean} resizable if <code>true</code>, the size of the new piece may be edited
 * @param {boolean} deformable if <code>true</code>, the width, depth and height of the new piece may 
 *            change independently from each other
 * @param {boolean} texturable if <code>false</code> this piece should always keep the same color or texture.
 * @param {Big} price the price of the new piece or <code>null</code> 
 * @param {Big} valueAddedTaxPercentage the Value Added Tax percentage applied to the 
 *             price of the new piece or <code>null</code> 
 * @param {string} currency the price currency, noted with ISO 4217 code, or <code>null</code>
 * @constructor   
 * @author Emmanuel Puybaret
 */
function CatalogPieceOfFurniture(id, name, description,  information, tags, creationDate, grade, 
                                 icon, planIcon, model, width, depth, height, elevation, dropOnTopElevation, 
                                 movable, doorOrWindow, color, staircaseCutOutShape, modelRotation, backFaceShown, 
                                 creator, resizable, deformable, texturable, 
                                 price, valueAddedTaxPercentage, currency, modifiable) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.information = information;
  this.tags = tags;
  this.creationDate = creationDate;
  this.grade = grade;
  this.icon = icon;
  this.planIcon = planIcon;
  this.model = model;
  this.width = width;
  this.depth = depth;
  this.height = height;
  this.elevation = elevation;
  this.dropOnTopElevation = dropOnTopElevation;
  this.movable = movable;
  this.doorOrWindow = doorOrWindow;
  this.color = color;
  this.staircaseCutOutShape = staircaseCutOutShape;
  this.creator = creator;
  this.price = price;
  this.valueAddedTaxPercentage = valueAddedTaxPercentage;
  this.currency = currency;
  if (modelRotation == null) {
    this.modelRotation = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  } else {
    this.modelRotation = this.deepCopy(modelRotation);
  }
  this.resizable = resizable;
  this.deformable = deformable;
  this.texturable = texturable;
  this.backFaceShown = backFaceShown;
  this.iconYaw = Math.PI / 8;
  this.proportional = true;
  this.modifiable = modifiable !== undefined ? modifiable : false; 
  this.category = null;
}

/**
 * Returns the ID of this piece of furniture or <code>null</code>.
 * @return {string}
 */
CatalogPieceOfFurniture.prototype.getId = function() {
  return this.id;
}

/**
 * Returns the name of this piece of furniture.
 * @return {string}
 */
CatalogPieceOfFurniture.prototype.getName = function() {
  return this.name;
}

/**
 * Returns the description of this piece of furniture.
 * The returned value may be <code>null</code>.
 * @return {string}
 */
CatalogPieceOfFurniture.prototype.getDescription = function() {
  return this.description;
}

/**
 * Returns the additional information associated to this piece, or <code>null</code>.
 * @return {string}
 */
CatalogPieceOfFurniture.prototype.getInformation = function() {
  return this.information;
}

/**
 * Returns the tags associated to this piece.
 * @return {string []}
 */
CatalogPieceOfFurniture.prototype.getTags = function() {
  return this.tags;
}

/**
 * Returns the creation date of this piece in milliseconds since the epoch, 
 * or <code>null</code> if no date is given to this piece.
 * @return {number}
 */
CatalogPieceOfFurniture.prototype.getCreationDate = function() {
  return this.creationDate;
}

/**
 * Returns the grade of this piece, or <code>null</code> if no grade is given to this piece.
 * @return {number}
 */
CatalogPieceOfFurniture.prototype.getGrade = function() {
  return this.grade;
}

/**
 * Returns the depth of this piece of furniture.
 * @return {number}
 */
CatalogPieceOfFurniture.prototype.getDepth = function() {
  return this.depth;
}

/**
 * Returns the height of this piece of furniture.
 * @return {number}
 */
CatalogPieceOfFurniture.prototype.getHeight = function() {
  return this.height;
}

/**
 * Returns the width of this piece of furniture.
 * @return {number}
 */
CatalogPieceOfFurniture.prototype.getWidth = function() {
  return this.width;
}

/**
 * Returns the elevation of this piece of furniture.
 * @return {number}
 */
CatalogPieceOfFurniture.prototype.getElevation = function() {
  return this.elevation;
}

/**
 * Returns the elevation at which should be placed an object dropped on this piece.
 * @return {number} a percentage of the height of this piece. A negative value means that the piece 
 *         should be ignored when an object is dropped on it. 
 */
CatalogPieceOfFurniture.prototype.getDropOnTopElevation = function() {
  return this.dropOnTopElevation;
}

/**
 * Returns <code>true</code> if this piece of furniture is movable.
 * @return {boolean}
 */
CatalogPieceOfFurniture.prototype.isMovable = function() {
  return this.movable;
}

/**
 * Returns <code>true</code> if this piece of furniture is a door or a window.
 * As this method existed before {@link CatalogDoorOrWindow} class,
 * you shouldn't rely on the value returned by this method to guess if a piece
 * is an instance of <code>DoorOrWindow</code> class.
 * @return {boolean}
 */
CatalogPieceOfFurniture.prototype.isDoorOrWindow = function() {
  return this.doorOrWindow;
}

/**
 * Returns the icon of this piece of furniture.
 * @return {URLContent}
 */
CatalogPieceOfFurniture.prototype.getIcon = function() {
  return this.icon;
}

/**
 * Returns the icon of this piece of furniture displayed in plan or <code>null</code>.
 * @return {URLContent}
 */
CatalogPieceOfFurniture.prototype.getPlanIcon = function() {
  return this.planIcon;
}

/**
 * Returns the 3D model of this piece of furniture.
 * @return {URLContent}
 */
CatalogPieceOfFurniture.prototype.getModel = function() {
  return this.model;
}

/**
 * Returns the rotation 3 by 3 matrix of this piece of furniture that ensures 
 * its model is correctly oriented.
 * @return {Array}
 */
CatalogPieceOfFurniture.prototype.getModelRotation = function() {
  // Return a deep copy to avoid any misuse of piece data
  return this.deepCopy(this.modelRotation);
}

/**
 * @param {Array} modelRotation
 * @returns {Array}
 * @private
 */
CatalogPieceOfFurniture.prototype.deepCopy = function(modelRotation) {
  return [[modelRotation [0][0], modelRotation [0][1], modelRotation [0][2]],
          [modelRotation [1][0], modelRotation [1][1], modelRotation [1][2]],
          [modelRotation [2][0], modelRotation [2][1], modelRotation [2][2]]];
}

/**
 * Returns the shape used to cut out upper levels when they intersect with the piece   
 * like a staircase.
 * @return {string}
 */
CatalogPieceOfFurniture.prototype.getStaircaseCutOutShape = function() {
  return this.staircaseCutOutShape;
}

/**
 * Returns the creator of this piece.
 * @return {string}
 */
CatalogPieceOfFurniture.prototype.getCreator = function() {
  return this.creator;
}

/**
 * Returns <code>true</code> if the back face of the piece of furniture
 * model should be displayed.
 */
CatalogPieceOfFurniture.prototype.isBackFaceShown = function() {
  return this.backFaceShown;
}

/**
 * Returns the color of this piece of furniture.
 * @return {number}
 */
CatalogPieceOfFurniture.prototype.getColor = function() {
  return this.color;
}

/**
 * Returns the yaw angle used to create the piece icon.
 * @return {number}
 */
CatalogPieceOfFurniture.prototype.getIconYaw = function() {
  return this.iconYaw;
}

/**
 * Returns <code>true</code> if size proportions should be kept.
 * @return {boolean}
 */
CatalogPieceOfFurniture.prototype.isProportional = function() {
  return this.proportional;
}

/**
 * Returns <code>true</code> if this piece is modifiable (not read from resources).
 * @return {boolean}
 */
CatalogPieceOfFurniture.prototype.isModifiable = function() {
  return this.modifiable;
}

/**
 * Returns <code>true</code> if this piece is resizable.
 * @return {boolean}
 */
CatalogPieceOfFurniture.prototype.isResizable = function() {
  return this.resizable;    
}

/**
 * Returns <code>true</code> if this piece is deformable.
 * @return {boolean}
 */
CatalogPieceOfFurniture.prototype.isDeformable = function() {
  return this.deformable;    
}

/**
 * Returns <code>false</code> if this piece should always keep the same color or texture.
 * @return {boolean}
 */
CatalogPieceOfFurniture.prototype.isTexturable = function() {
  return this.texturable;
}

/**
 * Returns the price of this piece of furniture or <code>null</code>. 
 * @return {Big}
 */
CatalogPieceOfFurniture.prototype.getPrice = function() {
  return this.price;
}

/**
 * Returns the Value Added Tax percentage applied to the price of this piece of furniture. 
 * @return {Big}
 */
CatalogPieceOfFurniture.prototype.getValueAddedTaxPercentage = function() {
  return this.valueAddedTaxPercentage;
}

/**
 * Returns the price currency, noted with ISO 4217 code, or <code>null</code> 
 * if it has no price or default currency should be used.
 * @return {string}
 */
CatalogPieceOfFurniture.prototype.getCurrency = function() {
  return this.currency;
}

/**
 * Returns the category of this piece of furniture.
 * @return {Object}
 * @ignore
 */
CatalogPieceOfFurniture.prototype.getCategory = function() {
  return this.category;
}

/**
 * Sets the category of this piece of furniture.
 * @package
 * @ignore
 */
CatalogPieceOfFurniture.prototype.setCategory = function(category) {
  this.category = category;
}

/** 
 * Compares the names of the two pieces in parameter.
 * @param {CatalogPieceOfFurniture} piece1
 * @param {CatalogPieceOfFurniture} piece2
 */
CatalogPieceOfFurniture.compare = function(piece1, piece2) {
  var nameComparison = piece1.name.localeCompare(piece2.name);
  if (nameComparison != 0) {
    return nameComparison;
  } else {
    return piece1.modifiable == piece2.modifiable 
        ? 0
        : (piece1.modifiable ? 1 : -1); 
  }
}

/**
 * Returns <code>true</code> if this piece matches the given <code>filter</code> text. 
 * Each substring of the <code>filter</code> is considered as a search criterion that can match
 * the name, the category name, the creator, the description or the tags of this piece.
 * @param {string} filter
 * @return {boolean}
 */
CatalogPieceOfFurniture.prototype.matchesFilter = function(filter) {
  var regex = new RegExp(filter, 'i');
  if (this.getName().match(regex)
      || this.getCategory() !== null && this.getCategory().getName().match(regex)
      || this.getDescription() !== null && this.getDescription().match(regex)
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
