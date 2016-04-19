/*
 * HomeEnvironment.js
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
//          URLContent.js
//          Camera.js
//          HomeTexture.js

/**
 * Creates home environment from (optional) parameters.
 * @param {number}  groundColor
 * @param {HomeTexture} groundTexture
 * @param {number} skyColor
 * @param {HomeTexture} skyTexture
 * @param {number} lightColor
 * @param {number} wallsAlpha
 * @constructor   
 * @author Emmanuel Puybaret
 */
function HomeEnvironment(groundColor, groundTexture, 
                         skyColor, skyTexture,
                         lightColor, wallsAlpha) {
  this.groundColor = groundColor !== undefined ? groundColor : 0xA8A8A8;
  this.groundTexture = groundTexture !== undefined ? groundTexture : null;
  this.skyColor = skyColor !== undefined ? skyColor : 0xCCE4FC;
  this.skyTexture = skyTexture !== undefined ? skyTexture : null;
  this.lightColor = lightColor !== undefined ? lightColor : 0xD0D0D0;
  this.wallsAlpha = wallsAlpha !== undefined ? wallsAlpha : 0;
  this.ceilingLightColor = 0xFFD0D0D0;
  this.observerCameraElevationAdjusted = true;
  this.drawingMode = HomeEnvironment.DrawingMode.FILL;
  this.subpartSizeUnderLight = 0;
  this.allLevelsVisible = false;
  this.photoWidth = 400;
  this.photoHeight = 300;
  this.photoAspectRatio = AspectRatio.VIEW_3D_RATIO;
  this.photoQuality = 0;
  this.videoWidth = 320;
  this.videoAspectRatio = AspectRatio.RATIO_4_3;
  this.videoQuality = 0;
  this.videoFrameRate = 25;
  this.cameraPath = [];
  this.propertyChangeSupport = new PropertyChangeSupport(this);
}

HomeEnvironment.DrawingMode = {FILL : 0, OUTLINE : 1, FILL_AND_OUTLINE : 2}

/**
 * Adds the property change <code>listener</code> in parameter to this environment.
 * @param listener  the listener that will receive {@link PropertyChangeEvent} events 
 */
HomeEnvironment.prototype.addPropertyChangeListener = function(property, listener) {
  this.propertyChangeSupport.addPropertyChangeListener(property, listener);
}

/**
 * Removes the property change <code>listener</code> in parameter from this environment.
 * @param listener  the listener to remove 
 */
HomeEnvironment.prototype.removePropertyChangeListener = function(property, listener) {
  this.propertyChangeSupport.removePropertyChangeListener(property, listener);
}

/**
 * Returns <code>true</code> if the observer elevation should be adjusted according 
 * to the elevation of the selected level.
 * @return {boolean}
 */
HomeEnvironment.prototype.isObserverCameraElevationAdjusted = function() {
  return this.observerCameraElevationAdjusted;
}

/**
 * Sets whether the observer elevation should be adjusted according 
 * to the elevation of the selected level and fires a <code>PropertyChangeEvent</code>.
 * @param {boolean} observerCameraElevationAdjusted
 */
HomeEnvironment.prototype.setObserverCameraElevationAdjusted = function(observerCameraElevationAdjusted) {
  if (this.observerCameraElevationAdjusted !== observerCameraElevationAdjusted) {
    this.observerCameraElevationAdjusted = observerCameraElevationAdjusted;
    this.propertyChangeSupport.firePropertyChange("OBSERVER_CAMERA_ELEVATION_ADJUSTED", 
        !observerCameraElevationAdjusted, observerCameraElevationAdjusted);
  }
}

/**
 * Returns the ground color of this environment.
 * @return {number}
 * @ignore
 */
HomeEnvironment.prototype.getGroundColor = function() {
  return this.groundColor;
}

/**
 * Sets the ground color of this environment and fires a <code>PropertyChangeEvent</code>.
 * @param {number} groundColor
 * @ignore
 */
HomeEnvironment.prototype.setGroundColor = function(groundColor) {
  if (groundColor !== this.groundColor) {
    var oldGroundColor = this.groundColor;
    this.groundColor = groundColor;
    this.propertyChangeSupport.firePropertyChange("GROUND_COLOR", oldGroundColor, groundColor);
  }
}

/**
 * Returns the ground texture of this environment.
 * @return {HomeTexture}
 * @ignore
 */
HomeEnvironment.prototype.getGroundTexture = function() {
  return this.groundTexture;
}

/**
 * Sets the ground texture of this environment and fires a <code>PropertyChangeEvent</code>.
 * @param {HomeTexture} groundTexture
 * @ignore
 */
HomeEnvironment.prototype.setGroundTexture = function(groundTexture) {
  if (groundTexture !== this.groundTexture) {
    var oldGroundTexture = this.groundTexture;
    this.groundTexture = groundTexture;
    this.propertyChangeSupport.firePropertyChange("GROUND_TEXTURE", oldGroundTexture, groundTexture);
  }
}

/**
 * Returns the sky color of this environment.
 * @return {number}
 */
HomeEnvironment.prototype.getSkyColor = function() {
  return this.skyColor;
}

/**
 * Sets the sky color of this environment and fires a <code>PropertyChangeEvent</code>.
 * @param {number} skyColor
 */
HomeEnvironment.prototype.setSkyColor = function(skyColor) {
  if (skyColor !== this.skyColor) {
    var oldSkyColor = this.skyColor;
    this.skyColor = skyColor;
    this.propertyChangeSupport.firePropertyChange("SKY_COLOR", oldSkyColor, skyColor);
  }
}

/**
 * Returns the sky texture of this environment.
 * @return {HomeTexture}
 */
HomeEnvironment.prototype.getSkyTexture = function() {
  return this.skyTexture;
}

/**
 * Sets the sky texture of this environment and fires a <code>PropertyChangeEvent</code>.
 * @param {HomeTexture} skyTexture
 */
HomeEnvironment.prototype.setSkyTexture = function(skyTexture) {
  if (skyTexture !== this.skyTexture) {
    var oldSkyTexture = this.skyTexture;
    this.skyTexture = skyTexture;
    this.propertyChangeSupport.firePropertyChange("SKY_TEXTURE", oldSkyTexture, skyTexture);
  }
}

/**
 * Returns the light color of this environment.
 * @return {number}
 */
HomeEnvironment.prototype.getLightColor = function() {
  return this.lightColor;
}

/**
 * Sets the color that lights this environment and fires a <code>PropertyChangeEvent</code>.
 * @param {number} lightColor
 */
HomeEnvironment.prototype.setLightColor = function(lightColor) {
  if (lightColor !== this.lightColor) {
    var oldLightColor = this.lightColor;
    this.lightColor = lightColor;
    this.propertyChangeSupport.firePropertyChange("LIGHT_COLOR", oldLightColor, lightColor);
  }
}

/**
 * Returns the color of ceiling lights.
 * @return {number}
 * @ignore
 */
HomeEnvironment.prototype.getCeillingLightColor = function() {
  return this.ceilingLightColor;
}

/**
 * Sets the color of ceiling lights and fires a <code>PropertyChangeEvent</code>.
 * @param {number} ceilingLightColor
 * @ignore
 */
HomeEnvironment.prototype.setCeillingLightColor = function(ceilingLightColor) {
  if (ceilingLightColor !== this.ceilingLightColor) {
    var oldCeilingLightColor = this.ceilingLightColor;
    this.ceilingLightColor = ceilingLightColor;
    this.propertyChangeSupport.firePropertyChange("CEILING_LIGHT_COLOR", oldCeilingLightColor, ceilingLightColor);
  }
}

/**
 * Returns the walls transparency alpha factor of this environment.
 * @return {number}
 * @ignore
 */
HomeEnvironment.prototype.getWallsAlpha = function() {
  return this.wallsAlpha;
}

/**
 * Sets the walls transparency alpha of this environment and fires a <code>PropertyChangeEvent</code>.
 * @param wallsAlpha a value between 0 and 1, 0 meaning opaque and 1 invisible.
 * @ignore
 */
HomeEnvironment.prototype.setWallsAlpha = function(wallsAlpha) {
  if (wallsAlpha !== this.wallsAlpha) {
    var oldWallsAlpha = this.wallsAlpha;
    this.wallsAlpha = wallsAlpha;
    this.propertyChangeSupport.firePropertyChange("WALLS_ALPHA", oldWallsAlpha, wallsAlpha);
  }
}

/**
 * Returns the drawing mode of this environment.
 * @ignore
 */
HomeEnvironment.prototype.getDrawingMode = function() {
  return this.drawingMode;
}

/**
 * Sets the drawing mode of this environment and fires a <code>PropertyChangeEvent</code>.
 * @ignore
 */
HomeEnvironment.prototype.setDrawingMode = function(drawingMode) {
  if (drawingMode !== this.drawingMode) {
    var oldDrawingMode = this.drawingMode;
    this.drawingMode = drawingMode;
    this.propertyChangeSupport.firePropertyChange("DRAWING_MODE", oldDrawingMode, drawingMode);
  }
}

/**
 * Returns the size of subparts under home lights in this environment.
 * @return a size in centimeters or 0 if home lights don't illuminate home.
 * @ignore
 */
HomeEnvironment.prototype.getSubpartSizeUnderLight = function() {
  return this.subpartSizeUnderLight;
}

/**
 * Sets the size of subparts under home lights of this environment and fires a <code>PropertyChangeEvent</code>.
 * @ignore
 */
HomeEnvironment.prototype.setSubpartSizeUnderLight = function(subpartSizeUnderLight) {
  if (subpartSizeUnderLight !== this.subpartSizeUnderLight) {
    var oldSubpartWidthUnderLight = this.subpartSizeUnderLight;
    this.subpartSizeUnderLight = subpartSizeUnderLight;
    this.propertyChangeSupport.firePropertyChange("SUBPART_SIZE_UNDER_LIGHT", oldSubpartWidthUnderLight, subpartSizeUnderLight);
  }
}

/**
 * Returns whether all levels should be visible or not.
 * @return {boolean}
 */
HomeEnvironment.prototype.isAllLevelsVisible = function() {
  return this.allLevelsVisible;
}

/**
 * Sets whether all levels should be visible or not and fires a <code>PropertyChangeEvent</code>.
 * @param {boolean} allLevelsVisible
 */
HomeEnvironment.prototype.setAllLevelsVisible = function(allLevelsVisible) {
  if (allLevelsVisible !== this.allLevelsVisible) {
    this.allLevelsVisible = allLevelsVisible;
    this.propertyChangeSupport.firePropertyChange("ALL_LEVELS_VISIBLE", !allLevelsVisible, allLevelsVisible);
  }
}

/**
 * Returns the preferred photo width.
 * @return {number} 
 * @ignore
 */
HomeEnvironment.prototype.getPhotoWidth = function() {
  return this.photoWidth;
}

/**
 * Sets the preferred photo width, and notifies
 * listeners of this change. 
 * @param {number} photoWidth
 * @ignore
 */
HomeEnvironment.prototype.setPhotoWidth = function(photoWidth) {
  if (this.photoWidth !== photoWidth) {
    var oldPhotoWidth = this.photoWidth;
    this.photoWidth = photoWidth;
    this.propertyChangeSupport.firePropertyChange("PHOTO_WIDTH", oldPhotoWidth, photoWidth);
  }
}

/**
 * Returns the preferred photo height. 
 * @return {number} 
 * @ignore
 */
HomeEnvironment.prototype.getPhotoHeight = function() {
  return this.photoHeight;
}

/**
 * Sets the preferred photo height, and notifies
 * listeners of this change. 
 * @param {number} photoHeight 
 * @ignore
 */
HomeEnvironment.prototype.setPhotoHeight = function(photoHeight) {
  if (this.photoHeight !== photoHeight) {
    var oldPhotoHeight = this.photoHeight;
    this.photoHeight = photoHeight;
    this.propertyChangeSupport.firePropertyChange("PHOTO_HEIGHT", oldPhotoHeight, photoHeight);
  }
}

/**
 * Returns the preferred photo aspect ratio. 
 * @ignore
 */
HomeEnvironment.prototype.getPhotoAspectRatio = function() {
  return this.photoAspectRatio;
}

/**
 * Sets the preferred photo aspect ratio, and notifies
 * listeners of this change. 
 * @ignore
 */
HomeEnvironment.prototype.setPhotoAspectRatio = function(photoAspectRatio) {
  if (this.photoAspectRatio !== photoAspectRatio) {
    var oldPhotoAspectRatio = this.photoAspectRatio;
    this.photoAspectRatio = photoAspectRatio;
    this.propertyChangeSupport.firePropertyChange("PHOTO_ASPECT_RATIO", oldPhotoAspectRatio, photoAspectRatio);
  }
}

/**
 * Returns the preferred photo quality. 
 * @ignore
 */
HomeEnvironment.prototype.getPhotoQuality = function() {
  return this.photoQuality;
}

/**
 * Sets preferred photo quality, and notifies
 * listeners of this change. 
 * @ignore
 */
HomeEnvironment.prototype.setPhotoQuality = function(photoQuality) {
  if (this.photoQuality !== photoQuality) {
    var oldPhotoQuality = this.photoQuality;
    this.photoQuality = photoQuality;
    this.propertyChangeSupport.firePropertyChange("PHOTO_QUALITY", oldPhotoQuality, photoQuality);
  }
}

/**
 * Returns the preferred video width. 
 * @ignore
 */
HomeEnvironment.prototype.getVideoWidth = function() {
  return this.videoWidth;
}

/**
 * Sets the preferred video width, and notifies
 * listeners of this change. 
 * @param {number} videoWidth 
 * @ignore
 */
HomeEnvironment.prototype.setVideoWidth = function(videoWidth) {
  if (this.videoWidth !== videoWidth) {
    var oldVideoWidth = this.videoWidth;
    this.videoWidth = videoWidth;
    this.propertyChangeSupport.firePropertyChange("VIDEO_WIDTH", oldVideoWidth, videoWidth);
  }
}

/**
 * Returns the preferred video height. 
 * @return {number} 
 * @ignore
 */
HomeEnvironment.prototype.getVideoHeight = function() {
  return Math.round(getVideoWidth() / getVideoAspectRatio().getValue());
}

/**
 * Returns the preferred video aspect ratio. 
 * @ignore
 */
HomeEnvironment.prototype.getVideoAspectRatio = function() {
  return this.videoAspectRatio;
}

/**
 * Sets the preferred video aspect ratio, and notifies
 * listeners of this change. 
 * @ignore
 */
HomeEnvironment.prototype.setVideoAspectRatio = function(videoAspectRatio) {
  if (this.videoAspectRatio !== videoAspectRatio) {
    var oldVideoAspectRatio = this.videoAspectRatio;
    this.videoAspectRatio = videoAspectRatio;
    this.propertyChangeSupport.firePropertyChange("VIDEO_ASPECT_RATIO", oldVideoAspectRatio, videoAspectRatio);
  }
}

/**
 * Returns preferred video quality. 
 * @ignore
 */
HomeEnvironment.prototype.getVideoQuality = function() {
  return this.videoQuality;
}

/**
 * Sets the preferred video quality, and notifies
 * listeners of this change. 
 * @ignore
 */
HomeEnvironment.prototype.setVideoQuality = function(videoQuality) {
  if (this.videoQuality !== videoQuality) {
    var oldVideoQuality = this.videoQuality;
    this.videoQuality = videoQuality;
    this.propertyChangeSupport.firePropertyChange("VIDEO_QUALITY", oldVideoQuality, videoQuality);
  }
}

/**
 * Returns the preferred video frame rate.
 * @return {number} 
 * @ignore
 */
HomeEnvironment.prototype.getVideoFrameRate = function() {
  return this.videoFrameRate;
}

/**
 * Sets the preferred video frame rate, and notifies
 * listeners of this change.
 * @param {number} videoFrameRate
 * @ignore
 */
HomeEnvironment.prototype.setVideoFrameRate = function(videoFrameRate) {
  if (this.videoFrameRate !== videoFrameRate) {
    var oldVideoFrameRate = this.videoFrameRate;
    this.videoFrameRate = videoFrameRate;
    this.propertyChangeSupport.firePropertyChange("VIDEO_FRAME_RATE", oldVideoFrameRate, videoFrameRate);
  }
}

/**
 * Returns the preferred video camera path.
 * @return {Camera[]} 
 */
HomeEnvironment.prototype.getVideoCameraPath = function() {
  return this.cameraPath.slice(0);
}

/**
 * Sets the preferred video camera path, and notifies
 * listeners of this change.
 * @param {Camera[]} cameraPath 
 */
HomeEnvironment.prototype.setVideoCameraPath = function(cameraPath) {
  if (this.cameraPath !== cameraPath) {
    var oldCameraPath = this.cameraPath;
    if (cameraPath !== null) {
      this.cameraPath = cameraPath.slice(0);
    } else {
      this.cameraPath = [];
    }
    this.propertyChangeSupport.firePropertyChange("VIDEO_CAMERA_PATH", oldCameraPath, cameraPath);
  }
}

/**
 * Returns a clone of this environment.
 * @return {HomeEnvironment}
 */
HomeEnvironment.prototype.clone = function() {
  var clone = new HomeEnvironment(this.groundColor, this.groundTexture, this.skyColor, this.skyTexture, this.lightColor, this.wallsAlpha);
  clone.ceilingLightColor = this.ceilingLightColor;
  clone.observerCameraElevationAdjusted = this.observerCameraElevationAdjusted;
  clone.drawingMode = this.drawingMode;
  clone.subpartSizeUnderLight = this.subpartSizeUnderLight;
  clone.allLevelsVisible = this.allLevelsVisible;
  clone.photoWidth = this.photoWidth;
  clone.photoHeight = this.photoHeight;
  clone.photoAspectRatio = this.photoAspectRatio;
  clone.photoQuality = this.photoQuality;
  clone.videoWidth = this.videoWidth;
  clone.videoAspectRatio = this.videoAspectRatio;
  clone.videoQuality = this.videoQuality;
  clone.videoFrameRate = this.videoFrameRate;
  clone.cameraPath = new Array(this.cameraPath.length);
  for (var i = 0; i < this.cameraPath.length; i++) {
    clone.cameraPath [i] = this.cameraPath [i].clone();
  }
  clone.propertyChangeSupport = new PropertyChangeSupport(clone);
  return clone;
}



/**
 * Aspect ratio for videos.
 * @enum
 * @ignore
 */
var AspectRatio = {
  FREE_RATIO    : { getValue : function() { return null;} }, 
  VIEW_3D_RATIO : { getValue : function() { return null;} }, 
  RATIO_4_3     : { getValue : function() { return 4 / 3;} }, 
  RATIO_3_2     : { getValue : function() { return 1.5;} }, 
  RATIO_16_9    : { getValue : function() { return 16 / 9;} }, 
  RATIO_2_1     : { getValue : function() { return 2;} }, 
  SQUARE_RATIO  : { getValue : function() { return 1;} }
}

