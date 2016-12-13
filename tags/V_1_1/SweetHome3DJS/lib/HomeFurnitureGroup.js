/*
 * HomeFurnitureGroup.js
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
//          geom.js
//          big.js
//          URLContent.js
//          HomePieceOfFurniture.js

/**
 * Creates a group from the given <code>furniture</code> list. 
 * The level of each piece of furniture of the group will be reset to <code>null</code> and if they belong to levels
 * with different elevations, their elevation will be updated to be relative to the elevation of the lowest level.
 * The angle of the group is the one of the leading piece if it exists.
 * @param {HomePieceOfFurniture []} furniture
 * @param {number}  [angle]
 * @param {boolean} [modelMirrored]
 * @param {string}  name
 * @constructor   
 * @extends HomePieceOfFurniture
 * @author Emmanuel Puybaret
 */
function HomeFurnitureGroup(furniture, angle, modelMirrored, name) {
  HomePieceOfFurniture.call(this, furniture [0]);
  if (modelMirrored === undefined) {
    // 2 parameters
    name = angle;
    var leadingPiece = furniture [0];
    angle = leadingPiece.getAngle();
    modelMirrored = false;
  } else if (name === undefined) {
    // 3 parameters
    var leadingPiece = modelMirrored;
    angle = leadingPiece.getAngle();
    name = modelMirrored;
    modelMirrored = false;
  }
  this.furniture = furniture.slice(0); 
  var movable = true;
  this.resizable = true;
  this.deformable = true;
  this.texturable = true;
  this.doorOrWindow = true;
  var visible = false;
  this.currency = furniture [0].getCurrency();
  for (var i = 0; i < furniture.length; i++) {
    var piece = furniture[i]; 
    movable &= piece.isMovable();
    this.resizable &= piece.isResizable();
    this.deformable &= piece.isDeformable();
    this.texturable &= piece.isTexturable();
    this.doorOrWindow &= piece.isDoorOrWindow();
    visible |= piece.isVisible();
    if (this.currency !== null) {
      if (piece.getCurrency() === null
          || !piece.getCurrency() === this.currency) {
        this.currency = null; 
      }
    }
  }
  
  this.setName(name);
  this.setNameVisible(false);
  this.setNameXOffset(0);
  this.setNameYOffset(0);
  this.setNameStyle(null);
  this.setDescription(null);
  this.setMovable(movable);
  this.setVisible(visible);
  
  this.updateLocationAndSize(furniture, angle, true);
  HomePieceOfFurniture.prototype.setAngle.call(this, angle);
  HomePieceOfFurniture.prototype.setModelMirrored.call(this, modelMirrored);
  
  this.addFurnitureListener();
}
HomeFurnitureGroup.prototype = Object.create(HomePieceOfFurniture.prototype);
HomeFurnitureGroup.prototype.constructor = HomeFurnitureGroup;

/**
 * Updates the location and size of this group from the furniture it contains.
 * @private
 */
HomeFurnitureGroup.prototype.updateLocationAndSize = function(furniture, angle, init) {
  var elevation = Number.MAX_VALUE;
  if (init) {
    // Search the lowest level elevation among grouped furniture
    var minLevel = null;
    for (var i = 0; i < furniture.length; i++) {
      var piece = furniture [i];
      var level = piece.getLevel();
      if (level !== null 
          && (minLevel === null
              || level.getElevation() < minLevel.getElevation())) {
        minLevel = level;
      }
    }
    for (var i = 0; i < furniture.length; i++) {
      var piece = furniture [i];
      if (piece.getLevel() !== null) {
        elevation = Math.min(elevation, piece.getGroundElevation() - minLevel.getElevation());
        // Reset piece level and elevation
        piece.setElevation(piece.getGroundElevation() - minLevel.getElevation());
        piece.setLevel(null);
      } else {
        elevation = Math.min(elevation, piece.getElevation());
      }
    }
  } else {
    for (var i = 0; i < furniture.length; i++) {
      elevation = Math.min(elevation, furniture [i].getElevation());
    }
  }
  HomePieceOfFurniture.prototype.setElevation.call(this, elevation);
  
  var height = 0;
  var dropOnTopElevation = -1;
  for (var i = 0; i < furniture.length; i++) {
    var piece = furniture [i];
    height = Math.max(height, piece.getElevation() + piece.getHeight());
    if (piece.getDropOnTopElevation() >= 0) {
      dropOnTopElevation = Math.max(dropOnTopElevation, 
          piece.getElevation() + piece.getHeight() * piece.getDropOnTopElevation());
    }
  }
  if (this.resizable) {
    HomePieceOfFurniture.prototype.setHeight.call(this, height - elevation);
  } else {
    this.fixedHeight = height - elevation;
  }
  this.dropOnTopElevation = (dropOnTopElevation - elevation) / height;
  
  if (typeof Rectangle2D !== "undefined") {
    // Search the size of the furniture group
    var rotation = AffineTransform.getRotateInstance(-angle);
    var unrotatedBoundingRectangle = null;
    var furnitureWithoutGroups = this.getFurnitureWithoutGroups(furniture);
    for (var i = 0; i < furnitureWithoutGroups.length; i++) {
      var piece = furnitureWithoutGroups [i];
      var pieceShape = new GeneralPath();
      var points = piece.getPoints();
      pieceShape.moveTo(points [0][0], points [0][1]);
      for (var j = 1; j < points.length; j++) {
        pieceShape.lineTo(points [j][0], points [j][1]);
      }
      pieceShape.closePath();
      if (unrotatedBoundingRectangle === null) {
        unrotatedBoundingRectangle = pieceShape.createTransformedShape(rotation).getBounds2D();
      } else {
        unrotatedBoundingRectangle.add(pieceShape.createTransformedShape(rotation).getBounds2D());
      }
    }
    // Search center of the group
    var center = new Point2D(unrotatedBoundingRectangle.getCenterX(), unrotatedBoundingRectangle.getCenterY());
    rotation.setToRotation(angle);
    rotation.transform(center, center);
  
    if (this.resizable) {
      HomePieceOfFurniture.prototype.setWidth.call(this, unrotatedBoundingRectangle.getWidth());
      HomePieceOfFurniture.prototype.setDepth.call(this, unrotatedBoundingRectangle.getHeight());
    } else {
      this.fixedWidth = unrotatedBoundingRectangle.getWidth();
      this.fixedDepth = unrotatedBoundingRectangle.getHeight();
    }
    HomePieceOfFurniture.prototype.setX.call(this, center.getX());
    HomePieceOfFurniture.prototype.setY.call(this, center.getY());
  }
}

/**
 * Adds a listener to the furniture of this group that will update the size and location 
 * of the group when its furniture is moved or resized. 
 * @private
 */
HomeFurnitureGroup.prototype.addFurnitureListener = function() {
  var group = this;
  this.furnitureListener = function(ev) {
      if ("X" == ev.getPropertyName()
          || "Y" == ev.getPropertyName()
          || "ELEVATION" == ev.getPropertyName()
          || "ANGLE" == ev.getPropertyName()
          || "WIDTH" == ev.getPropertyName()
          || "DEPTH" == ev.getPropertyName()
          || "HEIGHT" == ev.getPropertyName()) {
        group.updateLocationAndSize(group.getFurniture(), group.getAngle(), false);
      }
    };
  for (var i = 0; i < this.furniture.length; i++) {
    this.furniture [i].addPropertyChangeListener(this.furnitureListener);
  }    
}

/**
 * Returns all the pieces of the given <code>furniture</code> list.  
 * @return {HomePieceOfFurniture []}
 * @private 
 */
HomeFurnitureGroup.prototype.getFurnitureWithoutGroups = function(furniture) {
  var pieces = [];
  for (var i = 0; i < furniture.length; i++) {
    var piece = furniture [i];
    if (piece instanceof HomeFurnitureGroup) {
      pieces.push.apply(pieces, this.getFurnitureWithoutGroups(piece.getFurniture()));
    } else {
      pieces.push(piece);
    }
  }
  return pieces;
}

/**
 * Returns the furniture of this group and of all its subgroups.  
 * @return {HomePieceOfFurniture []}
 */
HomeFurnitureGroup.prototype.getAllFurniture = function(){
  var pieces = this.furniture.slice(0);
  for (var i = 0; i < this.furniture.length; i++) {
    var piece = this.furniture [i];
    if (piece instanceof HomeFurnitureGroup) {
      pieces.push.apply(pieces, piece.getAllFurniture());
    } 
  }
  return pieces;
}

/**
 * Returns an array of the furniture of this group.
 * @return {HomePieceOfFurniture []}
 */
HomeFurnitureGroup.prototype.getFurniture = function() {
  return this.furniture;
}

/**
 * Adds the <code>piece</code> in parameter at the given <code>index</code>.
 * @param {HomePieceOfFurniture} piece
 * @param {number} index
 * @package
 * @ignore
 */
HomeFurnitureGroup.prototype.addPieceOfFurniture = function(piece, index) {
  // Make a copy of the list to avoid conflicts in the list returned by getFurniture
  this.furniture = this.furniture.slice(0);
  piece.setLevel(this.getLevel());
  this.furniture.splice(index, 0, piece);
  piece.addPropertyChangeListener(this.furnitureListener);
  this.updateLocationAndSize(this.furniture, this.getAngle(), false);
}

/**
 * Deletes the <code>piece</code> in parameter from this group.
 * @param {HomePieceOfFurniture} piece
 * @throws IllegalStateException if the last piece in this group is the one in parameter
 * @package
 * @ignore
 */
HomeFurnitureGroup.prototype.deletePieceOfFurniture = function(piece) {
  var index = this.furniture.indexOf(piece);
  if (index !== -1) {
    if (this.furniture.length > 1) {
      piece.setLevel(null);
      piece.removePropertyChangeListener(this.furnitureListener);
      // Make a copy of the list to avoid conflicts in the list returned by getFurniture
      this.furniture = this.furniture.slice(0);
      this.furniture.splice(index, 1);
      this.updateLocationAndSize(this.furniture, this.getAngle(), false);
    } else {
      throw new IllegalStateException("Group can't be empty");
    }
  }
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getCatalogId = function() {
  return null;
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getInformation = function() {
  return null;
}

/**
 * Returns <code>true</code> if all furniture of this group are movable.
 * @return {boolean}
 */
HomeFurnitureGroup.prototype.isMovable = function() {
  return HomePieceOfFurniture.prototype.isMovable.call(this);
}

/**
 * Sets whether this piece and its children are movable or not.
 * @param {boolean} movable
 */
HomeFurnitureGroup.prototype.setMovable = function(movable) {
  HomePieceOfFurniture.prototype.setMovable.call(this, movable);
  for (var i = 0; i < this.furniture.length; i++) {
    this.furniture [i].setMovable(movable);
  }
}

/**
 * Returns <code>true</code> if all furniture of this group are doors or windows.
 * @return {boolean}
 */
HomeFurnitureGroup.prototype.isDoorOrWindow = function() {
  return this.doorOrWindow;
}

/**
 * Returns <code>true</code> if all furniture of this group are resizable.
 * @return {boolean}
 */
HomeFurnitureGroup.prototype.isResizable = function() {
  return this.resizable;
}

/**
 * Returns <code>true</code> if all furniture of this group are deformable.
 * @return {boolean}
 */
HomeFurnitureGroup.prototype.isDeformable = function() {
  return this.deformable;
}

/**
 * Returns <code>true</code> if all furniture of this group are texturable.
 * @return {boolean}
 */
HomeFurnitureGroup.prototype.isTexturable = function() {
  return this.texturable;
}

/**
 * Returns the abscissa of this group.
 * @return {number}
 */
HomeFurnitureGroup.prototype.getX = function() {
  if (typeof Rectangle2D === "undefined") {
    throw "Missing geom.js";
  }
  return HomePieceOfFurniture.prototype.getX.call(this);
}

/**
 * Returns the ordinate of this group.
 * @return {number}
 */
HomeFurnitureGroup.prototype.getY = function() {
  if (typeof Rectangle2D === "undefined") {
    throw "Missing geom.js";
  }
  return HomePieceOfFurniture.prototype.getY.call(this);
}

/**
 * Returns the width of this group.
 * @return {number}
 */
HomeFurnitureGroup.prototype.getWidth = function() {
  if (typeof Rectangle2D === "undefined") {
    throw "Missing geom.js";
  }
  if (!this.resizable) {
    return this.fixedWidth;
  } else {
    return HomePieceOfFurniture.prototype.getWidth.call(this);
  }
}

/**
 * Returns the depth of this group.
 * @return {number}
 */
HomeFurnitureGroup.prototype.getDepth = function() {
  if (typeof Rectangle2D === "undefined") {
    throw "Missing geom.js";
  }
  if (!this.resizable) {
    return this.fixedDepth;
  } else {
    return HomePieceOfFurniture.prototype.getDepth.call(this);
  }
}

/**
 * Returns the height of this group.
 * @return {number}
 */
HomeFurnitureGroup.prototype.getHeight = function() {
  if (!this.resizable) {
    return this.fixedHeight;
  } else {
    return HomePieceOfFurniture.prototype.getHeight.call(this);
  }
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getIcon = function() {
  return null;
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getPlanIcon = function() {
  return null;
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getModel = function() {
  return null;
}

/**
 * Returns an identity matrix.
 */
HomeFurnitureGroup.prototype.getModelRotation = function() {
  return HomePieceOfFurniture.IDENTITY;
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getStaircaseCutOutShape = function() {
  return null;
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getCreator = function() {
  return null;
}

/**
 * Returns the price of the furniture of this group with a price.
 * @return {Big}
 */
HomeFurnitureGroup.prototype.getPrice = function() {
  var price = null;
  for (var i = 0; i < this.furniture.length; i++) {
    var piece = this.furniture [i];
    if (piece.getPrice() !== null) {
      if (price === null) {
        price = piece.getPrice();
      } else {
        price = price.plus(piece.getPrice()); 
      }
    }
  }
  if (price === null) {
    return HomePieceOfFurniture.prototype.getPrice.call(this);
  } else {
    return price;
  }
}

/**
 * Sets the price of this group.
 * @param {Big} price
 * @throws UnsupportedOperationException if the price of one of the pieces is set
 */
HomeFurnitureGroup.prototype.setPrice = function(price) {
  for (var i = 0; i < this.furniture.length; i++) {
    if (this.furniture [i].getPrice() !== null) {
      throw new UnsupportedOperationException("Can't change the price of a group containing pieces with a price");
    }
  }
  HomePieceOfFurniture.prototype.setPrice.call(this, price);
}

/**
 * Returns the VAT percentage of the furniture of this group 
 * or <code>null</code> if one piece has no VAT percentage 
 * or has a VAT percentage different from the other furniture.
 * @return {Big}
 */
HomeFurnitureGroup.prototype.getValueAddedTaxPercentage = function() {
  var valueAddedTaxPercentage = this.furniture [0].getValueAddedTaxPercentage();
  if (valueAddedTaxPercentage !== null) {
    for (var i = 0; i < this.furniture.length; i++) {
      var pieceValueAddedTaxPercentage = this.furniture [i].getValueAddedTaxPercentage();
      if (pieceValueAddedTaxPercentage === null
          || !pieceValueAddedTaxPercentage.eq(valueAddedTaxPercentage)) {
        return null; 
      }
    }
  }
  return valueAddedTaxPercentage;
}

/**
 * Returns the currency of the furniture of this group 
 * or <code>null</code> if one piece has no currency 
 * or has a currency different from the other furniture.
 * @return {string}
 */
HomeFurnitureGroup.prototype.getCurrency = function() {
  return this.currency;
}

/**
 * Returns the VAT of the furniture of this group.
 * @return {Big}
 */
HomeFurnitureGroup.prototype.getValueAddedTax = function() {
  var valueAddedTax = null;
  for (var i = 0; i < this.furniture.length; i++) {
    var pieceValueAddedTax = this.furniture [i].getValueAddedTax();
    if (pieceValueAddedTax !== null) {
      if (valueAddedTax === null) {
        valueAddedTax = pieceValueAddedTax;
      } else {
        valueAddedTax = valueAddedTax.plus(pieceValueAddedTax);
      }
    }
  }
  return valueAddedTax;
}

/**
 * Returns the total price of the furniture of this group.
 * @return {Big}
 */
HomeFurnitureGroup.prototype.getPriceValueAddedTaxIncluded = function() {
  var priceValueAddedTaxIncluded = null;
  for (var i = 0; i < this.furniture.length; i++) {
    var piece = this.furniture [i];
    if (piece.getPrice() !== null) {
      if (priceValueAddedTaxIncluded === null) {
        priceValueAddedTaxIncluded = piece.getPriceValueAddedTaxIncluded();
      } else {
        priceValueAddedTaxIncluded = priceValueAddedTaxIncluded.plus(piece.getPriceValueAddedTaxIncluded());
      }
    }
  }
  return priceValueAddedTaxIncluded;
}

/**
 * Returns <code>false</code>.
 */
HomeFurnitureGroup.prototype.isBackFaceShown = function() {
  return false;
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getColor = function() {
  return null; 
}

/**
 * Sets the <code>color</code> of the furniture of this group.
 * @param {number} color
 */
HomeFurnitureGroup.prototype.setColor = function(color) {
  if (this.isTexturable()) {
    for (var i = 0; i < this.furniture.length; i++) {
      this.furniture [i].setColor(color);
    }
  }
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getTexture = function() {
  return null; 
}

/**
 * Sets the <code>texture</code> of the furniture of this group.
 * @param {HomeTexture} texture
 */
HomeFurnitureGroup.prototype.setTexture = function(texture) {
  if (this.isTexturable()) {
    for (var i = 0; i < this.furniture.length; i++) {
      this.furniture [i].setTexture(texture);
    }
  } 
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getModelMaterials = function() {
  return null;
}

/**
 * Sets the materials of the furniture of this group.
 * @param {HomeMaterial[]} modelMaterials
 */
HomeFurnitureGroup.prototype.setModelMaterials = function(modelMaterials) {
  if (this.isTexturable()) {
    for (var i = 0; i < this.furniture.length; i++) {
      this.furniture [i].setModelMaterials(modelMaterials);
    }
  } 
}

/**
 * Returns <code>null</code>.
 */
HomeFurnitureGroup.prototype.getShininess = function() {
  return null; 
}

/**
 * Sets the <code>shininess</code> of the furniture of this group.
 * @param {Number} shininess
 */
HomeFurnitureGroup.prototype.setShininess = function(shininess) {
  if (this.isTexturable()) {
    for (var i = 0; i < this.furniture.length; i++) {
      this.furniture [i].setShininess(shininess);
    }
  } 
}

/**
 * Sets the <code>angle</code> of the furniture of this group.
 * @param {Number} angle
 */
HomeFurnitureGroup.prototype.setAngle = function(angle) {
  if (angle !== this.getAngle()) {
    var angleDelta = angle - this.getAngle();
    var cosAngleDelta = Math.cos(angleDelta);
    var sinAngleDelta = Math.sin(angleDelta);
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      piece.removePropertyChangeListener(this.furnitureListener);
      piece.setAngle(piece.getAngle() + angleDelta);     
      var newX = this.getX() + ((piece.getX() - this.getX()) * cosAngleDelta - (piece.getY() - this.getY()) * sinAngleDelta);
      var newY = this.getY() + ((piece.getX() - this.getX()) * sinAngleDelta + (piece.getY() - this.getY()) * cosAngleDelta);
      piece.setX(newX);
      piece.setY(newY);
      piece.addPropertyChangeListener(this.furnitureListener);
    }
    HomePieceOfFurniture.prototype.setAngle.call(this, angle);
  }
}

/**
 * Sets the <code>abscissa</code> of this group and moves its furniture accordingly.
 * @param {Number} x
 */
HomeFurnitureGroup.prototype.setX = function(x) {
  if (x !== this.getX()) {
    var dx = x - this.getX();
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      piece.removePropertyChangeListener(this.furnitureListener);
      piece.setX(piece.getX() + dx);
      piece.addPropertyChangeListener(this.furnitureListener);
    }
    HomePieceOfFurniture.prototype.setX.call(this, x);
  }
}

/**
 * Sets the <code>ordinate</code> of this group and moves its furniture accordingly.
 * @param {Number} y
 */
HomeFurnitureGroup.prototype.setY = function(y) {
  if (y !== this.getY()) {
    var dy = y - this.getY();
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      piece.addPropertyChangeListener(this.furnitureListener);
      piece.setY(piece.getY() + dy);
      piece.removePropertyChangeListener(this.furnitureListener);
    }
    HomePieceOfFurniture.prototype.setY.call(this, y);
  }
}

/**
 * Sets the <code>width</code> of this group, then moves and resizes its furniture accordingly.
 * @param {Number} width
 */
HomeFurnitureGroup.prototype.setWidth = function(width) {
  if (width !== this.getWidth()) {
    var widthFactor = width / this.getWidth();
    var angle = this.getAngle();
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      piece.removePropertyChangeListener(this.furnitureListener);
      var angleDelta = piece.getAngle() - angle;
      var pieceWidth = piece.getWidth();
      var pieceDepth = piece.getDepth();
      piece.setWidth(pieceWidth + pieceWidth * (widthFactor - 1) * Math.abs(Math.cos(angleDelta)));
      piece.setDepth(pieceDepth + pieceDepth * (widthFactor - 1) * Math.abs(Math.sin(angleDelta)));
      // Rotate piece to angle 0
      var cosAngle = Math.cos(angle);
      var sinAngle = Math.sin(angle);
      var newX = this.getX() + ((piece.getX() - this.getX()) * cosAngle + (piece.getY() - this.getY()) * sinAngle);
      var newY = this.getY() + ((piece.getX() - this.getX()) * -sinAngle + (piece.getY() - this.getY()) * cosAngle);
      // Update its abscissa
      newX = this.getX() + (newX - this.getX()) * widthFactor; 
      // Rotate piece back to its angle
      piece.setX(this.getX() + ((newX - this.getX()) * cosAngle - (newY - this.getY()) * sinAngle));
      piece.setY(this.getY() + ((newX - this.getX()) * sinAngle + (newY - this.getY()) * cosAngle));
      piece.addPropertyChangeListener(this.furnitureListener);
    }
    HomePieceOfFurniture.prototype.setWidth.call(this, width);
  }
}

/**
 * Sets the <code>depth</code> of this group, then moves and resizes its furniture accordingly.
 * @param {Number} depth
 */
HomeFurnitureGroup.prototype.setDepth = function(depth) {
  if (depth !== this.getDepth()) {
    var depthFactor = depth / this.getDepth();
    var angle = this.getAngle();
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      piece.removePropertyChangeListener(this.furnitureListener);
      var angleDelta = piece.getAngle() - angle;
      var pieceWidth = piece.getWidth();
      var pieceDepth = piece.getDepth();
      piece.setWidth(pieceWidth + pieceWidth * (depthFactor - 1) * Math.abs(Math.sin(angleDelta)));
      piece.setDepth(pieceDepth + pieceDepth * (depthFactor - 1) * Math.abs(Math.cos(angleDelta)));
      // Rotate piece to angle 0
      var cosAngle = Math.cos(angle);
      var sinAngle = Math.sin(angle);
      var newX = this.getX() + ((piece.getX() - this.getX()) * cosAngle + (piece.getY() - this.getY()) * sinAngle);
      var newY = this.getY() + ((piece.getX() - this.getX()) * -sinAngle + (piece.getY() - this.getY()) * cosAngle);
      // Update its ordinate
      newY = this.getY() + (newY - this.getY()) * depthFactor;
      // Rotate piece back to its angle
      piece.setX(this.getX() + ((newX - this.getX()) * cosAngle - (newY - this.getY()) * sinAngle));
      piece.setY(this.getY() + ((newX - this.getX()) * sinAngle + (newY - this.getY()) * cosAngle));
      piece.addPropertyChangeListener(this.furnitureListener);
    }
    HomePieceOfFurniture.prototype.setDepth.call(this, depth);
  }
}

/**
 * Sets the <code>height</code> of this group, then moves and resizes its furniture accordingly.
 * @param {Number} height
 */
HomeFurnitureGroup.prototype.setHeight = function(height) {
  if (height !== this.getHeight()) {
    var heightFactor = height / this.getHeight();
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      piece.removePropertyChangeListener(this.furnitureListener);
      piece.setHeight(piece.getHeight() * heightFactor);
      piece.setElevation(this.getElevation() 
          + (piece.getElevation() - this.getElevation()) * heightFactor);
      piece.addPropertyChangeListener(this.furnitureListener);
    }
    HomePieceOfFurniture.prototype.setHeight.call(this, height);
  }
}

/**
 * Sets the <code>elevation</code> of this group, then moves its furniture accordingly.
 * @param {Number} elevation
 */
HomeFurnitureGroup.prototype.setElevation = function(elevation) {
  if (elevation !== this.getElevation()) {
    var elevationDelta = elevation - this.getElevation();
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      piece.removePropertyChangeListener(this.furnitureListener);
      piece.setElevation(piece.getElevation() + elevationDelta);
      piece.addPropertyChangeListener(this.furnitureListener);
    }
    HomePieceOfFurniture.prototype.setElevation.call(this, elevation);
  }
}

/**
 * Sets whether the furniture of this group should be mirrored or not.
 * @param {boolean} modelMirrored 
 */
HomeFurnitureGroup.prototype.setModelMirrored = function(modelMirrored) {
  if (modelMirrored !== this.isModelMirrored()) {
    var angle = this.getAngle();
    for (var i = 0; i < this.furniture.length; i++) {
      var piece = this.furniture [i];
      piece.removePropertyChangeListener(this.furnitureListener);
      piece.setModelMirrored(!piece.isModelMirrored());
      // Rotate piece to angle 0
      var cosAngle = Math.cos(angle);
      var sinAngle = Math.sin(angle);
      var newX = this.getX() + ((piece.getX() - this.getX()) * cosAngle + (piece.getY() - this.getY()) * sinAngle);
      var newY = this.getY() + ((piece.getX() - this.getX()) * -sinAngle + (piece.getY() - this.getY()) * cosAngle);
      // Update its abscissa
      newX = this.getX() - (newX - this.getX()); 
      // Rotate piece back to its angle
      piece.setX(this.getX() + ((newX - this.getX()) * cosAngle - (newY - this.getY()) * sinAngle));
      piece.setY(this.getY() + ((newX - this.getX()) * sinAngle + (newY - this.getY()) * cosAngle));
      piece.addPropertyChangeListener(this.furnitureListener);
    }
    HomePieceOfFurniture.prototype.setModelMirrored.call(this, modelMirrored);
  }
}

/**
 * Sets whether the furniture of this group should be visible or not.
 * @param {boolean} visible 
 */
HomeFurnitureGroup.prototype.setVisible = function(visible) {
  for (var i = 0; i < this.furniture.length; i++) {
    this.furniture [i].setVisible(visible);
  }
  HomePieceOfFurniture.prototype.setVisible.call(this, visible);
}

/**
 * Set the level of this group and the furniture it contains.
 * @param {Level} level
 */
HomeFurnitureGroup.prototype.setLevel = function(level) {
  for (var i = 0; i < this.furniture.length; i++) {
    this.furniture [i].setLevel(level);
  }
  HomePieceOfFurniture.prototype.setLevel.call(this, level);
}

/**
 * Returns <code>true</code> if one of the pieces of this group intersects
 * with the horizontal rectangle which opposite corners are at points
 * (<code>x0</code>, <code>y0</code>) and (<code>x1</code>, <code>y1</code>).
 * @return {boolean}
 */
HomeFurnitureGroup.prototype.intersectsRectangle = function(x0, y0, x1, y1) {
  for (var i = 0; i < this.furniture.length; i++) {
    if (this.furniture [i].intersectsRectangle(x0, y0, x1, y1)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns <code>true</code> if one of the pieces of this group contains 
 * the point at (<code>x</code>, <code>y</code>) with a given <code>margin</code>.
 * @return {boolean}
 */
HomeFurnitureGroup.prototype.containsPoint = function(x, y, margin) {
  for (var i = 0; i < this.furniture.length; i++) {
    if (this.furniture [i].containsPoint(x, y, margin)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns a clone of this group with cloned furniture.
 * @return {HomeFurnitureGroup}
 */
HomeFurnitureGroup.prototype.clone = function() {
  // Deep clone furniture managed by this group
  var furniture = new Array(this.furniture.length);
  for (var i = 0; i < this.furniture.length; i++) {
    var piece = this.furniture [i];
    var pieceClone = piece.clone();
    furniture [i] = pieceClone;
    if (typeof HomeDoorOrWindow !== "undefined"
        && piece instanceof HomeDoorOrWindow
        && piece.isBoundToWall()) {
      pieceClone.setBoundToWall(true);
    }
  }
  
  var clone = new HomeFurnitureGroup(furniture, name);
  clone.description = this.description;
  clone.information = this.information;
  clone.icon = this.icon;
  clone.planIcon = this.planIcon;
  clone.model = this.model;
  clone.width = this.width;
  clone.depth = this.depth;
  clone.height = this.height;
  clone.elevation = this.elevation;
  clone.dropOnTopElevation = this.dropOnTopElevation;
  clone.movable = this.movable;
  clone.doorOrWindow = this.doorOrWindow;
  clone.color = this.color;
  clone.modelRotation = this.modelRotation;
  clone.staircaseCutOutShape = this.staircaseCutOutShape;
  clone.creator = this.creator;
  clone.backFaceShown = this.backFaceShown;
  clone.resizable = this.resizable;
  clone.deformable = this.deformable;
  clone.texturable = this.texturable;
  clone.price = this.price;
  clone.valueAddedTaxPercentage = this.valueAddedTaxPercentage;
  clone.currency = this.currency;
  clone.catalogId = this.catalogId;
  clone.nameVisible = this.nameVisible;
  clone.nameXOffset = this.nameXOffset;
  clone.nameYOffset = this.nameYOffset;
  clone.nameAngle = this.nameAngle;
  clone.nameStyle = this.nameStyle;
  clone.visible = this.visible;
  clone.angle = this.angle;
  clone.x = this.x;
  clone.y = this.y;
  clone.modelMirrored = this.modelMirrored;
  clone.texture = this.texture;
  clone.shininess = this.shininess;
  clone.modelMaterials = this.modelMaterials;
  return clone;
}
