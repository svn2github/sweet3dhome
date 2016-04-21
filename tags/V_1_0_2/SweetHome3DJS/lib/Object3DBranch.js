/*
 * Object3DBranch.js
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

// Requires scene3d.js

/**
 * Root of a 3D branch that matches a home object. 
 * @constructor
 * @extends BranchGroup3D
 * @author Emmanuel Puybaret
 */
function Object3DBranch() {
  BranchGroup3D.call(this);
}
Object3DBranch.prototype = Object.create(BranchGroup3D.prototype);
Object3DBranch.prototype.constructor = Object3DBranch;

Object3DBranch.DEFAULT_COLOR         = 0xFFFFFF;
Object3DBranch.DEFAULT_AMBIENT_COLOR = 0x333333;

/**
 * Updates an appearance with the given colors.
 * @protected
 * @ignore
 */
Object3DBranch.prototype.updateAppearanceMaterial = function(appearance, diffuseColor, ambientColor, shininess) {
  if (diffuseColor !== null) {
    appearance.setAmbientColor(vec3.fromValues(((ambientColor >>> 16) & 0xFF) / 255.,
                                               ((ambientColor >>> 8) & 0xFF) / 255.,
                                                (ambientColor & 0xFF) / 255.));
    appearance.setDiffuseColor(vec3.fromValues(((diffuseColor >>> 16) & 0xFF) / 255.,
                                               ((diffuseColor >>> 8) & 0xFF) / 255.,
                                                (diffuseColor & 0xFF) / 255.));
    appearance.setSpecularColor(vec3.fromValues(shininess, shininess, shininess));
    appearance.setShininess(shininess * 128);
  } else {
    appearance.setAmbientColor(vec3.fromValues(.2, .2, .2));
    appearance.setDiffuseColor(vec3.fromValues(1, 1, 1));
    appearance.setSpecularColor(vec3.fromValues(shininess, shininess, shininess));
    appearance.setShininess(shininess * 128);
  }
}
