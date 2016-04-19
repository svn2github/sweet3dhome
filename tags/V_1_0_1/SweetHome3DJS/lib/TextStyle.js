/*
 * TextStyle.js
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

/**
 * The different attributes that defines a text style.
 * @param {string} [fontName] the font used to draw a text at this style
 * @param {number} fontSize the size of the font 
 * @param {boolean} [bold]
 * @param {boolean} [italic]
 * @param {boolean} [cached]
 * @constructor 
 * @author Emmanuel Puybaret
 */
function TextStyle(fontName, fontSize, bold, italic, cached) {
  if (cached === undefined) {
    // 4 parameters or less
    cached = true;
  } 
  if (italic === undefined) {
    // 3 parameters
    italic = bold;
    bold = fontSize;
    fontSize = fontName;
    fontName = null;
  } else if (fontSize === undefined) {
    // One parameter
    italic = false;
    bold = false;
    fontSize = fontName;
    fontName = null;
  }
  this.fontName = fontName;
  this.fontSize = fontSize;
  this.bold = bold;
  this.italic = italic;
  
  if (cached) {
    TextStyle.textStylesCache.push(this);
  }
}

TextStyle.textStylesCache = []; 
  
/**
 * Returns the text style instance matching the given parameters.
 * @return {TextStyle}
 */
TextStyle.prototype.getInstance = function(fontName, fontSize, bold, italic) {
  var textStyle = new TextStyle(fontName, fontSize, bold, italic, false);
  for (var i = 0; i < TextStyle.textStylesCache.length; i++) {
    var cachedTextStyle = TextStyle.textStylesCache [i];
    if (cachedTextStyle.equals(textStyle)) {
      return textStyle;
    }
  }
  textStylesCache.push(textStyle);
  return textStyle;
}

/**
 * Returns the font name of this text style.
 * @return {string}  
 */
TextStyle.prototype.getFontName = function() {
  return this.fontName;
}

/**
 * Returns the font size of this text style.
 * @return {number}  
 */
TextStyle.prototype.getFontSize = function() {
  return this.fontSize;
}

/**
 * Returns whether this text style is bold or not.
 * @return {boolean}
 */
TextStyle.prototype.isBold = function() {
  return this.bold;
}

/**
 * Returns whether this text style is italic or not.
 * @return {boolean}
 */
TextStyle.prototype.isItalic = function() {
  return this.italic;
}

/**
 * Returns a derived style of this text style with a given font name or size.
 * @return {TextStyle}
 */
TextStyle.prototype.deriveStyle = function(fontName) {
  if (typeof fontName === "string") {
    if (this.getFontName() == fontName) {
      return this;
    } else {
      return getInstance(this.fontName, this.getFontSize(), this.isBold(), this.isItalic());
    }
  } else {
    var fontSize = fontName;
    if (this.getFontSize() == fontSize) {
      return this;
    } else {
      return this.getInstance(this.getFontName(), fontSize, this.isBold(), this.isItalic());
    }
  }
}

/**
 * Returns a derived style of this text style with a given bold style.
 * @return {TextStyle}
 */
TextStyle.prototype.deriveBoldStyle = function(bold) {
  if (this.isBold() == bold) {
    return this;
  } else {
    return this.getInstance(this.getFontName(), this.getFontSize(), bold, this.isItalic());
  }
}

/**
 * Returns a derived style of this text style with a given italic style.
 * @return {TextStyle}
 */
TextStyle.prototype.deriveItalicStyle = function(italic) {
  if (this.isItalic() == italic) {
    return this;
  } else {
    return this.getInstance(this.getFontName(), this.getFontSize(), this.isBold(), italic);
  }
}

/**
 * Returns <code>true</code> if this text style is equal to <code>object</code>.
 */
TextStyle.prototype.equals = function(object) {
  if (object instanceof TextStyle) {
    var textStyle = object;
    return textStyle.fontName == this.fontName
        && textStyle.fontSize === this.fontSize
        && textStyle.bold === this.bold
        && textStyle.italic === this.italic;
  }
  return false;
}
  
