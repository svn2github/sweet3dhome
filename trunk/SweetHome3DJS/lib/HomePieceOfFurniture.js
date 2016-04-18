/*
 * HomePieceOfFurniture.js
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

/**
 * Creates a home piece of furniture from an existing piece.
 * @param {Object} piece  the piece from which data are copied, either an 
 *          instance of {@link CatalogPieceOfFurniture} or of this class   
 * @constructor
 * @author Emmanuel Puybaret
 */
function HomePieceOfFurniture(piece) {
  this.name = piece.getName();
  this.level = null;
  this.description = piece.getDescription();
  this.information = piece.getInformation();
  this.icon = piece.getIcon();
  this.planIcon = piece.getPlanIcon();
  this.model = piece.getModel();
  this.width = piece.getWidth();
  this.depth = piece.getDepth();
  this.height = piece.getHeight();
  this.elevation = piece.getElevation();
  this.dropOnTopElevation = piece.getDropOnTopElevation();
  this.movable = piece.isMovable();
  this.doorOrWindow = piece.isDoorOrWindow();
  this.color = piece.getColor();
  this.modelRotation = piece.getModelRotation();
  this.staircaseCutOutShape = piece.getStaircaseCutOutShape();
  this.creator = piece.getCreator();
  this.backFaceShown = piece.isBackFaceShown();
  this.resizable = piece.isResizable();
  this.deformable = piece.isDeformable();
  this.texturable = piece.isTexturable();
  this.price = piece.getPrice();
  this.valueAddedTaxPercentage = piece.getValueAddedTaxPercentage();
  this.currency = piece.getCurrency();
  if (piece instanceof HomePieceOfFurniture) {
    this.catalogId = piece.getCatalogId();
    this.nameVisible = piece.isNameVisible();
    this.nameXOffset = piece.getNameXOffset();
    this.nameYOffset = piece.getNameYOffset();
    this.nameAngle = piece.getNameAngle();
    this.nameStyle = piece.getNameStyle();
    this.visible = piece.isVisible();
    this.angle = piece.getAngle();
    this.x = piece.getX();
    this.y = piece.getY();
    this.modelMirrored = piece.isModelMirrored();
    this.texture = piece.getTexture();
    this.shininess = piece.getShininess();
    this.modelMaterials = piece.getModelMaterials();
  } else {
    if (piece instanceof CatalogPieceOfFurniture) {
      this.catalogId = piece.getId();
    } else {
      this.catalogId = null;
    }     
    this.nameVisible = false;
    this.nameXOffset = 0.;
    this.nameYOffset = 0.;
    this.nameAngle = 0.;
    this.nameStyle = null;
    this.visible = true;
    this.angle = 0.;
    this.x = this.width / 2;
    this.y = this.depth / 2;
    this.modelMirrored = false;
    this.texture = null;
    this.shininess = 0.;
    this.modelMaterials = null;
  }
    
  this.propertyChangeSupport = new PropertyChangeSupport(this);
  this.shapeCache = null;
}

HomePieceOfFurniture.TWICE_PI = 2 * Math.PI;
HomePieceOfFurniture.IDENTITY = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

/**
 * Adds the property change <code>listener</code> in parameter to this piece.
 * @param listener the listener to add
 */
HomePieceOfFurniture.prototype.addPropertyChangeListener = function(listener) {
  this.propertyChangeSupport.addPropertyChangeListener(listener);
}

/**
 * Removes the property change <code>listener</code> in parameter from this piece.
 * @param listener the listener to remove
 */
HomePieceOfFurniture.prototype.removePropertyChangeListener = function(listener) {
  this.propertyChangeSupport.removePropertyChangeListener(listener);
}

/**
 * Returns the catalog ID of this piece of furniture or <code>null</code> if it doesn't exist.
 * @return {string}
 */
HomePieceOfFurniture.prototype.getCatalogId = function() {
  return this.catalogId;
}
  
/**
 * Returns the name of this piece of furniture.
 * @return {string}
 */
HomePieceOfFurniture.prototype.getName = function() {
  return this.name;
}

/**
 * Sets the name of this piece of furniture. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {string} name
 */
HomePieceOfFurniture.prototype.setName = function(name) {
  if (name != this.name) {
    var oldName = this.name;
    this.name = name;
    this.propertyChangeSupport.firePropertyChange("NAME", oldName, name);
  }
}
   
/**
 * Returns whether the name of this piece should be drawn or not.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isNameVisible = function() {
  return this.nameVisible;  
}
  
/**
 * Sets whether the name of this piece is visible or not. Once this piece of
 * furniture is updated, listeners added to this piece will receive a change
 * notification.
 * @param {boolean} nameVisible
 */
HomePieceOfFurniture.prototype.setNameVisible = function(nameVisible) {
  if (nameVisible !== this.nameVisible) {
    this.nameVisible = nameVisible;
    this.propertyChangeSupport.firePropertyChange("NAME_VISIBLE", !nameVisible, nameVisible);
  }
}
  
/**
 * Returns the distance along x axis applied to piece abscissa to display
 * piece name.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getNameXOffset = function() {
  return this.nameXOffset;  
}
  
/**
 * Sets the distance along x axis applied to piece abscissa to display piece
 * name. Once this piece is updated, listeners added to this piece will
 * receive a change notification.
 * @param {number} nameXOffset
 */
HomePieceOfFurniture.prototype.setNameXOffset = function(nameXOffset) {
  if (nameXOffset !== this.nameXOffset) {
    var oldNameXOffset = this.nameXOffset;
    this.nameXOffset = nameXOffset;
    this.propertyChangeSupport.firePropertyChange("NAME_X_OFFSET", oldNameXOffset, nameXOffset);
  }
}
  
/**
 * Returns the distance along y axis applied to piece ordinate to display
 * piece name.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getNameYOffset = function() {
  return this.nameYOffset;  
}

/**
 * Sets the distance along y axis applied to piece ordinate to display piece
 * name. Once this piece is updated, listeners added to this piece will
 * receive a change notification.
 * @param {number} nameYOffset
 */
HomePieceOfFurniture.prototype.setNameYOffset = function(nameYOffset) {
  if (nameYOffset !== this.nameYOffset) {
    var oldNameYOffset = this.nameYOffset;
    this.nameYOffset = nameYOffset;
    this.propertyChangeSupport.firePropertyChange("NAME_Y_OFFSET", oldNameYOffset, nameYOffset);
  }
}

/**
 * Returns the text style used to display piece name.
 * @return {TextStyle}
 */
HomePieceOfFurniture.prototype.getNameStyle = function() {
  return this.nameStyle;  
}

/**
 * Sets the text style used to display piece name. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {TextStyle} nameStyle
 */
HomePieceOfFurniture.prototype.setNameStyle = function(nameStyle) {
  if (nameStyle !== this.nameStyle) {
    var oldNameStyle = this.nameStyle;
    this.nameStyle = nameStyle;
    this.propertyChangeSupport.firePropertyChange("NAME_STYLE", oldNameStyle, nameStyle);
  }
}
  
/**
 * Returns the angle in radians used to display the piece name.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getNameAngle = function() {
  return this.nameAngle;
}

/**
 * Sets the angle in radians used to display the piece name. Once this piece
 * is updated, listeners added to this piece will receive a change notification.
 * @param {number} nameAngle
 */
HomePieceOfFurniture.prototype.setNameAngle = function(nameAngle) {
  // Ensure angle is always positive and between 0 and 2 PI
  nameAngle = (nameAngle % HomePieceOfFurniture.TWICE_PI + HomePieceOfFurniture.TWICE_PI) % HomePieceOfFurniture.TWICE_PI;
  if (nameAngle !== this.nameAngle) {
    var oldNameAngle = this.nameAngle;
    this.nameAngle = nameAngle;
    this.propertyChangeSupport.firePropertyChange("NAME_ANGLE", oldNameAngle, nameAngle);
  }
}

/**
 * Returns the description of this piece of furniture. The returned value may be <code>null</code>.
 * @return {string}
 */
HomePieceOfFurniture.prototype.getDescription = function() {
  return this.description;
}

/**
 * Sets the description of this piece of furniture. Once this piece is
 * updated, listeners added to this piece will receive a change notification.
 * @param {string} description
 */
HomePieceOfFurniture.prototype.setDescription = function(description) {
  if (description !== this.description) {
    var oldDescription = this.description;
    this.description = description;
    this.propertyChangeSupport.firePropertyChange("DESCRIPTION", oldDescription, description);
  }
}
   
/**
 * Returns the additional information associated to this piece, or <code>null</code>.
 * @return {string}
 */
HomePieceOfFurniture.prototype.getInformation = function() {
  return this.information;
}
  
/**
 * Returns the depth of this piece of furniture.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getDepth = function() {
  return this.depth;
}

/**
 * Sets the depth of this piece of furniture. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {number} depth
 * @throws IllegalStateException if this piece of furniture isn't resizable
 */
HomePieceOfFurniture.prototype.setDepth = function(depth) {
  if (this.isResizable()) {
    if (depth !== this.depth) {
      var oldDepth = this.depth;
      this.depth = depth;
      this.shapeCache = null;
      this.propertyChangeSupport.firePropertyChange("DEPTH", oldDepth, depth);
    }
  } else {
    throw new IllegalStateException("Piece isn't resizable");
  }
}

/**
 * Returns the height of this piece of furniture.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getHeight = function() {
  return this.height;
}

/**
 * Sets the height of this piece of furniture. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {number} height
 * @throws IllegalStateException if this piece of furniture isn't resizable
 */
HomePieceOfFurniture.prototype.setHeight = function(height) {
  if (this.isResizable()) {
    if (height !== this.height) {
      var oldHeight = this.height;
      this.height = height;
      this.propertyChangeSupport.firePropertyChange("HEIGHT", oldHeight, height);
    }
  } else {
    throw new IllegalStateException("Piece isn't resizable");
  }
}

/**
 * Returns the width of this piece of furniture.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getWidth = function() {
  return this.width;
}

/**
 * Sets the width of this piece of furniture. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {number} width
 * @throws IllegalStateException if this piece of furniture isn't resizable
 */
HomePieceOfFurniture.prototype.setWidth = function(width) {
  if (this.isResizable()) {
    if (width !== this.width) {
      var oldWidth = this.width;
      this.width = width;
      this.shapeCache = null;
      this.propertyChangeSupport.firePropertyChange("WIDTH", oldWidth, width);
    }
  } else {
    throw new IllegalStateException("Piece isn't resizable");
  }
}

/**
 * Returns the elevation of the bottom of this piece of furniture on its  level.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getElevation = function() {
  return this.elevation;
}

/**
 * Returns the elevation at which should be placed an object dropped on this  piece.
 * @return {number} a percentage of the height of this piece. A negative value means
 *       that the piece should be ignored when an object is dropped on it.
 */
HomePieceOfFurniture.prototype.getDropOnTopElevation = function() {
  return this.dropOnTopElevation;
}

/**
 * Returns the elevation of the bottom of this piece of furniture from the
 * ground according to the elevation of its level.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getGroundElevation = function() {
  if (this.level !== null) {
    return this.elevation + this.level.getElevation();
  } else {
    return this.elevation;
  }
}

/**
 * Sets the elevation of this piece of furniture on its level. Once this piece
 * is updated, listeners added to this piece will receive a change notification.
 * @param {number} elevation
 */
HomePieceOfFurniture.prototype.setElevation = function(elevation) {
  if (elevation !== this.elevation) {
    var oldElevation = this.elevation;
    this.elevation = elevation;
    this.propertyChangeSupport.firePropertyChange("ELEVATION", oldElevation, elevation);
  }
}

/**
 * Returns <code>true</code> if this piece of furniture is movable.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isMovable = function() {
  return this.movable;
}

/**
 * Sets whether this piece is movable or not.
 * @param {boolean} movable
 */
HomePieceOfFurniture.prototype.setMovable = function(movable) {
  if (movable !== this.movable) {
    this.movable = movable;
    this.propertyChangeSupport.firePropertyChange("MOVABLE", !movable, movable);
  }
}
  
/**
 * Returns <code>true</code> if this piece of furniture is a door or a window. 
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isDoorOrWindow = function() {
  return this.doorOrWindow;
}

/**
 * Returns the icon of this piece of furniture.
 * @return {URLContent}
 */
HomePieceOfFurniture.prototype.getIcon = function() {
  return this.icon;
}

/**
 * Returns the icon of this piece of furniture displayed in plan or
 * <code>null</code>.
 * @return {URLContent}
 */
HomePieceOfFurniture.prototype.getPlanIcon = function() {
  return this.planIcon;
}

/**
 * Returns the 3D model of this piece of furniture.
 * @return {URLContent}
 */
HomePieceOfFurniture.prototype.getModel = function() {
  return this.model;
}

/**
 * Sets the materials of the 3D model of this piece of furniture. Once this
 * piece is updated, listeners added to this piece will receive a change notification.
 * @param {HomeMaterial []} modelMaterials  the materials of the 3D model or <code>null</code> if they
 *        shouldn't be changed
 * @throws IllegalStateException if this piece of furniture isn't texturable
 */
HomePieceOfFurniture.prototype.setModelMaterials = function(modelMaterials) {
  if (this.isTexturable()) {
    var sameMaterials = modelMaterials === null && this.modelMaterials === null;
    if (!sameMaterials) {
      if (modelMaterials === null || this.modelMaterials === null) {
        sameMaterials = false;
      } else {
        for (var i = 0; sameMaterials && (i < modelMaterials.length); i++) {
          if (modelMaterials [i] !== this.modelMaterials [i]) {
            sameMaterials = false;
          }
        }
      }
    }
    if (!sameMaterials) {
      var oldModelMaterials = this.modelMaterials;
      this.modelMaterials = modelMaterials !== null 
            ? modelMaterials.slice(0)
            : null;
      this.propertyChangeSupport.firePropertyChange("MODEL_MATERIALS", oldModelMaterials, modelMaterials);
    }
  } else {
    throw new IllegalStateException("Piece isn't texturable");
  }
}
  
/**
 * Returns the materials applied to the 3D model of this piece of furniture.
 * @return {HomeMaterial []}
 * @return the materials of the 3D model or <code>null</code> if the
 *       individual materials of the 3D model are not modified.
 */
HomePieceOfFurniture.prototype.getModelMaterials = function() {
  if (this.modelMaterials !== null) {
    return this.modelMaterials.slice(0);
  } else {
    return null;
  }
}
  
/**
 * Returns the color of this piece of furniture.
 * @return {number} the color of the piece as RGB code or <code>null</code> if piece
 *       color is unchanged.
 */
HomePieceOfFurniture.prototype.getColor = function() {
  return this.color;
}
  
/**
 * Sets the color of this piece of furniture. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {number} color the color of this piece of furniture or <code>null</code> if
 *        piece color is the default one
 * @throws IllegalStateException if this piece of furniture isn't texturable
 */
HomePieceOfFurniture.prototype.setColor = function(color) {
  if (this.isTexturable()) {
    if (color !== this.color) {
      var oldColor = this.color;
      this.color = color;
      this.propertyChangeSupport.firePropertyChange("COLOR", oldColor, color);
    }
  } else {
    throw new IllegalStateException("Piece isn't texturable");
  }
}

/**
 * Returns the texture of this piece of furniture.
 * @return {HomeTexture} the texture of the piece or <code>null</code> if piece texture is
 *       unchanged.
 */
HomePieceOfFurniture.prototype.getTexture = function() {
  return this.texture;
}
  
/**
 * Sets the texture of this piece of furniture. Once this piece is updated,
 * listeners added to this piece will receive a change notification. 
 * @param {HomeTexture} texture the texture of this piece of furniture or <code>null</code> if
 *        piece texture is the default one
 * @throws IllegalStateException if this piece of furniture isn't texturable
 */
HomePieceOfFurniture.prototype.setTexture = function(texture) {
  if (this.isTexturable()) {
    if (texture !== this.texture
          && (texture === null || !texture.equals(this.texture))) {
      var oldTexture = this.texture;
      this.texture = texture;
      this.propertyChangeSupport.firePropertyChange("TEXTURE", oldTexture, texture);
    }
  } else {
    throw new IllegalStateException("Piece isn't texturable");
  }
}

/**
 * Returns the shininess of this piece of furniture.
 * @return {number} a value between 0 (matt) and 1 (very shiny) or <code>null</code>
 *       if piece shininess is unchanged.
 */
HomePieceOfFurniture.prototype.getShininess = function() {
  return this.shininess;
}
  
/**
 * Sets the shininess of this piece of furniture or <code>null</code> if
 * piece shininess is unchanged. Once this piece is updated, listeners added
 * to this piece will receive a change notification.
 * @param {number} shininess a value value between 0 (matt) and 1 (very shiny) or <code>null</code>
 *                           if piece shininess is unchanged
 * @throws IllegalStateException if this piece of furniture isn't texturable
 */
HomePieceOfFurniture.prototype.setShininess = function(shininess) {
  if (this.isTexturable()) {
    if (shininess !== this.shininess) {
      var oldShininess = this.shininess;
      this.shininess = shininess;
      this.propertyChangeSupport.firePropertyChange("SHININESS", oldShininess, shininess);
    }
  } else {
    throw new IllegalStateException("Piece isn't texturable");
  }
}

/**
 * Returns <code>true</code> if this piece is resizable.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isResizable = function() {
  return this.resizable;    
}
  
/**
 * Returns <code>true</code> if this piece is deformable.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isDeformable = function() {
  return this.deformable;    
}

/**
 * Returns <code>false</code> if this piece should always keep the same
 * color or texture.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isTexturable = function() {
  return this.texturable;
}

/**
 * Returns the price of this piece of furniture or <code>null</code>.
 * @return {Big}
 */
HomePieceOfFurniture.prototype.getPrice = function() {
  return this.price;
}
  
/**
 * Sets the price of this piece of furniture. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {Big} price
 */
HomePieceOfFurniture.prototype.setPrice = function(price) {
  if (price !== this.price
        && (price === null || !price.eq(this.price))) {
    var oldPrice = this.price;
    this.price = price;
    this.propertyChangeSupport.firePropertyChange("PRICE", oldPrice, price);
  }
}
   
/**
 * Returns the Value Added Tax percentage applied to the price of this piece
 * of furniture.
 * @return {Big}
 */
HomePieceOfFurniture.prototype.getValueAddedTaxPercentage = function() {
  return this.valueAddedTaxPercentage;
}

/**
 * Returns the Value Added Tax applied to the price of this piece of furniture.
 * @return {Big}
 */
HomePieceOfFurniture.prototype.getValueAddedTax = function() {
  if (this.price !== null && this.valueAddedTaxPercentage !== null) {
    return this.price.times(this.valueAddedTaxPercentage).round(2);
  } else {
    return null;
  }
}

/**
 * Returns the price of this piece of furniture, Value Added Tax included.
 * @return {Big}
 */
HomePieceOfFurniture.prototype.getPriceValueAddedTaxIncluded = function() {
  if (this.price !== null && this.valueAddedTaxPercentage !== null) {
    return this.price.plus(this.getValueAddedTax());
  } else {
    return this.price;
  }
}

/**
 * Returns the price currency, noted with ISO 4217 code, or <code>null</code>
 * if it has no price or default currency should be used.
 * @return {string}
 */
HomePieceOfFurniture.prototype.getCurrency = function() {
  return this.currency;
}

/**
 * Returns <code>true</code> if this piece of furniture is visible.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isVisible = function() {
  return this.visible;
}
  
/**
 * Sets whether this piece of furniture is visible or not. Once this piece is
 * updated, listeners added to this piece will receive a change notification.
 * @param {boolean} visible
 */
HomePieceOfFurniture.prototype.setVisible = function(visible) {
  if (visible !== this.visible) {
    this.visible = visible;
    this.propertyChangeSupport.firePropertyChange("VISIBLE", !visible, visible);
  }
}

/**
 * Returns the abscissa of the center of this piece of furniture.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getX = function() {
  return this.x;
}

/**
 * Sets the abscissa of the center of this piece. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {number} x
 */
HomePieceOfFurniture.prototype.setX = function(x) {
  if (x !== this.x) {
    var oldX = this.x;
    this.x = x;
    this.shapeCache = null;
    this.propertyChangeSupport.firePropertyChange("X", oldX, x);
  }
}
  
/**
 * Returns the ordinate of the center of this piece of furniture.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getY = function() {
  return this.y;
}

/**
 * Sets the ordinate of the center of this piece. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {number} y
 */
HomePieceOfFurniture.prototype.setY = function(y) {
  if (y !== this.y) {
    var oldY = this.y;
    this.y = y;
    this.shapeCache = null;
    this.propertyChangeSupport.firePropertyChange("Y", oldY, y);
  }
}

/**
 * Returns the angle in radians of this piece of furniture around vertical axis.
 * @return {number}
 */
HomePieceOfFurniture.prototype.getAngle = function() {
  return this.angle;
}

/**
 * Sets the angle of this piece around vertical axis. Once this piece is
 * updated, listeners added to this piece will receive a change notification.
 * @param {number} angle
 */
HomePieceOfFurniture.prototype.setAngle = function(angle) {
  // Ensure angle is always positive and between 0 and 2 PI
  angle = (angle % HomePieceOfFurniture.TWICE_PI + HomePieceOfFurniture.TWICE_PI) % HomePieceOfFurniture.TWICE_PI;
  if (angle !== this.angle) {
    var oldAngle = this.angle;
    this.angle = angle;
    this.shapeCache = null;
    this.propertyChangeSupport.firePropertyChange("ANGLE", oldAngle, angle);
  }
}

/**
 * Returns <code>true</code> if the model of this piece should be mirrored.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isModelMirrored = function() {
  return this.modelMirrored;
}

/**
 * Sets whether the model of this piece of furniture is mirrored or not. Once
 * this piece is updated, listeners added to this piece will receive a change notification.
 * @return {boolean} modelMirrored
 * @throws IllegalStateException if this piece of furniture isn't resizable
 */
HomePieceOfFurniture.prototype.setModelMirrored = function(modelMirrored) {
  if (this.isResizable()) {
    if (modelMirrored !== this.modelMirrored) {
      this.modelMirrored = modelMirrored;
      this.propertyChangeSupport.firePropertyChange("MODEL_MIRRORED", !modelMirrored, modelMirrored);
    }
  } else {
    throw new IllegalStateException("Piece isn't resizable");
  }
}

/**
 * Returns the rotation 3 by 3 matrix of this piece of furniture that ensures
 * its model is correctly oriented.
 * @return {Array}
 */
HomePieceOfFurniture.prototype.getModelRotation = function() {
  // Return a deep copy to avoid any misuse of piece data
  return [[this.modelRotation[0][0], this.modelRotation[0][1], this.modelRotation[0][2]],
          [this.modelRotation[1][0], this.modelRotation[1][1], this.modelRotation[1][2]],
          [this.modelRotation[2][0], this.modelRotation[2][1], this.modelRotation[2][2]]];
}

/**
 * Returns the shape used to cut out upper levels when they intersect with the
 * piece like a staircase.
 * @return {string}
 */
HomePieceOfFurniture.prototype.getStaircaseCutOutShape = function() {
  return this.staircaseCutOutShape;
}

/**
 * Returns the creator of this piece.
 * @return {string}
 */
HomePieceOfFurniture.prototype.getCreator = function() {
  return this.creator;
}

/**
 * Returns <code>true</code> if the back face of the piece of furniture
 * model should be displayed.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isBackFaceShown = function() {
  return this.backFaceShown;
}

/**
 * Returns the level which this piece belongs to.
 * return {Level}
 */
HomePieceOfFurniture.prototype.getLevel = function() {
  return this.level;
}

/**
 * Sets the level of this piece of furniture. Once this piece is updated,
 * listeners added to this piece will receive a change notification.
 * @param {Level} level
 */
HomePieceOfFurniture.prototype.setLevel = function(level) {
  if (level !== this.level) {
    var oldLevel = this.level;
    this.level = level;
    this.propertyChangeSupport.firePropertyChange("LEVEL", oldLevel, level);
  }
}
  
/**
 * Returns <code>true</code> if this piece is at the given
 * <code>level</code> or at a level with the same elevation and a smaller
 * elevation index or if the elevation of its highest point is higher than
 * <code>level</code> elevation.
 * @param {Level} level
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isAtLevel = function(level) {
  if (this.level === level) {
    return true;
  } else if (this.level !== null && level !== null) {
    var pieceLevelElevation = this.level.getElevation();
    var levelElevation = level.getElevation();
    return pieceLevelElevation === levelElevation
             && this.level.getElevationIndex() < level.getElevationIndex()
          || pieceLevelElevation < levelElevation
             && this.isTopAtLevel(level);
  } else {
    return false;
  }
}
  
/**
 * Returns <code>true</code> if the top of this piece is visible at the given level.
 * @return {boolean}
 * @private
 */
HomePieceOfFurniture.prototype.isTopAtLevel = function(level) {
  var topElevation = this.level.getElevation() + this.elevation + this.height;
  if (this.staircaseCutOutShape !== null) {
    // Consider the top of stair cases is at the given level if their
    // elevation is higher or equal
    return topElevation >= level.getElevation();
  } else {
    return topElevation > level.getElevation();
  }
}
  
/**
 * Returns the points of each corner of a piece.
 * @return an array of the 4 (x,y) coordinates of the piece corners.
 */
HomePieceOfFurniture.prototype.getPoints = function() {
  var piecePoints = new Array(4);
  var it = this.getShape().getPathIterator(null);
  for (var i = 0; i < piecePoints.length; i++) {
    piecePoints [i] = [0., 0.];
    it.currentSegment(piecePoints [i]);
    it.next();
  }
  return piecePoints;
}
  
/**
 * Returns <code>true</code> if this piece intersects with the horizontal
 * rectangle which opposite corners are at points (<code>x0</code>,
 * <code>y0</code>) and (<code>x1</code>, <code>y1</code>).
 */
HomePieceOfFurniture.prototype.intersectsRectangle = function(x0, y0, x1, y1) {
  if (typeof Rectangle2D === "undefined") {
    throw "Missing geom.js";
  }
  var rectangle = new Rectangle2D(x0, y0, 0, 0);
  rectangle.add(x1, y1);
  return this.getShape().intersects(rectangle);
}
  
/**
 * Returns <code>true</code> if this piece contains the point at (<code>x</code>,
 * <code>y</code>) with a given <code>margin</code>.
 */
HomePieceOfFurniture.prototype.containsPoint = function(x, y, margin) {
  if (margin === 0) {
    return this.getShape().contains(x, y);
  } else {
    return this.getShape().intersects(x - margin, y - margin, 2 * margin, 2 * margin);
  }
}
  
/**
 * Returns <code>true</code> if one of the corner of this piece is the point
 * at (<code>x</code>, <code>y</code>) with a given <code>margin</code>.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isPointAt = function(x, y, margin) {
  var points = this.getPoints();
  for (var i = 0; i < points.length; i++) {
    var point = points [i];
    if (Math.abs(x - point[0]) <= margin && Math.abs(y - point[1]) <= margin) {
      return true;
    }
  } 
  return false;
}

/**
 * Returns <code>true</code> if the top left point of this piece is the
 * point at (<code>x</code>, <code>y</code>) with a given
 * <code>margin</code>, and if that point is closer to top left point than
 * to top right and bottom left points.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isTopLeftPointAt = function(x, y, margin) {
  var points = this.getPoints();
  var distanceSquareToTopLeftPoint = Point2D.distanceSq(x, y, points[0][0], points[0][1]);
  return distanceSquareToTopLeftPoint <= margin * margin
        && distanceSquareToTopLeftPoint < Point2D.distanceSq(x, y, points[1][0], points[1][1])
        && distanceSquareToTopLeftPoint < Point2D.distanceSq(x, y, points[3][0], points[3][1]);
}

/**
 * Returns <code>true</code> if the top right point of this piece is the
 * point at (<code>x</code>, <code>y</code>) with a given
 * <code>margin</code>, and if that point is closer to top right point than
 * to top left and bottom right points.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isTopRightPointAt = function(x, y, margin) {
  var points = this.getPoints();
  var distanceSquareToTopRightPoint = Point2D.distanceSq(x, y, points[1][0], points[1][1]);
  return distanceSquareToTopRightPoint <= margin * margin
        && distanceSquareToTopRightPoint < Point2D.distanceSq(x, y, points[0][0], points[0][1])
        && distanceSquareToTopRightPoint < Point2D.distanceSq(x, y, points[2][0], points[2][1]);
}

/**
 * Returns <code>true</code> if the bottom left point of this piece is the
 * point at (<code>x</code>, <code>y</code>) with a given
 * <code>margin</code>, and if that point is closer to bottom left point
 * than to top left and bottom right points.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isBottomLeftPointAt = function(x, y, margin) {
  var points = this.getPoints();
  var distanceSquareToBottomLeftPoint = Point2D.distanceSq(x, y, points[3][0], points[3][1]);
  return distanceSquareToBottomLeftPoint <= margin * margin
        && distanceSquareToBottomLeftPoint < Point2D.distanceSq(x, y, points[0][0], points[0][1])
        && distanceSquareToBottomLeftPoint < Point2D.distanceSq(x, y, points[2][0], points[2][1]);
}

/**
 * Returns <code>true</code> if the bottom right point of this piece is the
 * point at (<code>x</code>, <code>y</code>) with a given
 * <code>margin</code>, and if that point is closer to top left point than
 * to top right and bottom left points.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isBottomRightPointAt = function(x, y, margin) {
  var points = this.getPoints();
  var distanceSquareToBottomRightPoint = Point2D.distanceSq(x, y, points[2][0], points[2][1]);
  return distanceSquareToBottomRightPoint <= margin * margin
        && distanceSquareToBottomRightPoint < Point2D.distanceSq(x, y, points[1][0], points[1][1])
        && distanceSquareToBottomRightPoint < Point2D.distanceSq(x, y, points[3][0], points[3][1]);
}

/**
 * Returns <code>true</code> if the center point at which is displayed the
 * name of this piece is equal to the point at (<code>x</code>,
 * <code>y</code>) with a given <code>margin</code>.
 * @return {boolean}
 */
HomePieceOfFurniture.prototype.isNameCenterPointAt = function(x, y, margin) {
  return Math.abs(x - this.getX() - this.getNameXOffset()) <= margin 
        && Math.abs(y - this.getY() - this.getNameYOffset()) <= margin;
}

/**
 * Returns the shape matching this piece.
 * @private
 */
HomePieceOfFurniture.prototype.getShape = function() {
  if (typeof Rectangle2D === "undefined") {
    throw "Missing geom.js";
  }
  if (this.shapeCache === null) {
    // Create the rectangle that matches piece bounds
    var pieceRectangle = new Rectangle2D(
        this.getX() - this.getWidth() / 2,
        this.getY() - this.getDepth() / 2,
        this.getWidth(), this.getDepth());
    // Apply rotation to the rectangle
    var rotation = AffineTransform.getRotateInstance(this.getAngle(), this.getX(), this.getY());
    var it = pieceRectangle.getPathIterator(rotation);
    var pieceShape = new GeneralPath();
    pieceShape.append(it, false);
    // Cache shape
    this.shapeCache = pieceShape;
  }
  return this.shapeCache;
}

/**
 * Moves this piece of (<code>dx</code>, <code>dy</code>) units.
 * @param {number} dx
 * @param {number} dy
 */
HomePieceOfFurniture.prototype.move = function(dx, dy) {
  this.setX(this.getX() + dx);
  this.setY(this.getY() + dy);
}
  
/**
 * Returns a clone of this piece.
 * @return {HomePieceOfFurniture}
 */
HomePieceOfFurniture.prototype.clone = function() {
  var clone = new HomePieceOfFurniture(this);
  clone.shapeCache = this.shapeCache; 
  return clone;
}
