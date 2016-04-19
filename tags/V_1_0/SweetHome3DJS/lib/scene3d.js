/*
 * scene3d.js
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

// Requires gl-matrix-min.js
//          core.js

// Classes used to manage a scene tree of 3D objects displayed by a HTMLCanvas3D instance 
// inspired from Java 3D API

/**
 * Creates an abstract 3D node.
 * @constructor
 * @author Emmanuel Puybaret
 */
function Node3D() {
}

Node3D.READING_MODEL = "Reading model";
Node3D.PARSING_MODEL = "Parsing model";
Node3D.BUILDING_MODEL = "Building model";
Node3D.BINDING_MODEL = "Binding model";

Node3D.prototype.setCapability = function(capability) {
  if (this.capability === undefined) {
    this.capability = 0;
  }
  this.capabilities |= capability;
}

Node3D.prototype.getCapability = function(capability) {
  if (this.capability === undefined) {
    return false;
  } else {
    return this.capabilities & capability !== 0;
  }
}

/**
 * Adds the property change <code>listener</code> in parameter to this node.
 */
Node3D.prototype.addPropertyChangeListener = function(property, listener) {
  if (this.propertyChangeSupport === undefined) {
    this.propertyChangeSupport = new PropertyChangeSupport(this);    
  }
  this.propertyChangeSupport.addPropertyChangeListener(property, listener);
}

/**
 * Removes the property change <code>listener</code> in parameter from this node.
 */
Node3D.prototype.removePropertyChangeListener = function(property, listener) {
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.removePropertyChangeListener(property, listener);
  }
}

Node3D.prototype.clone = function() {
  return new Node3D();
}


/**
 * Creates a 3D shape.
 * @constructor
 * @extends Node3D
 * @author Emmanuel Puybaret
 */
function Shape3D(geometry, appearance) {
  Node3D.call(this);
  this.appearance = appearance;
  this.bounds = null; 
  this.name = null;
  this.geometries = [];
  if (geometry !== null) {
    this.addGeometry(geometry);
  }
}
Shape3D.prototype = Object.create(Node3D.prototype);
Shape3D.prototype.constructor = Shape3D;

Shape3D.prototype.addGeometry = function(geometry3D) {
  this.geometries.push(geometry3D);
  // Update bounds
  var lower = vec3.fromValues(Infinity, Infinity, Infinity);
  var upper = vec3.fromValues(-Infinity, -Infinity, -Infinity);
  if (this.bounds !== null) {
    this.bounds.getLower(lower);
    this.bounds.getUpper(upper);
  }
  for (var index = 0; index < geometry3D.vertexIndices.length; index++) {
    var vertex = geometry3D.vertices [geometry3D.vertexIndices [index]];
    vec3.min(lower, lower, vertex);
    vec3.max(upper, upper, vertex);
  }
  this.bounds = new BoundingBox3D(lower, upper);
}

Shape3D.prototype.getBounds = function() {
  return this.bounds.clone();
}

Shape3D.prototype.setName = function(name) {
  this.name = name;
}

Shape3D.prototype.getName = function() {
  return this.name;
}

Shape3D.prototype.getGeometries = function() {
  return this.geometries;
}

Shape3D.prototype.getAppearance = function() {
  return this.appearance;
}

Shape3D.prototype.setAppearance = function(appearance) {
  this.appearance = appearance;
}

Shape3D.prototype.clone = function() {
  var clone = new Shape3D(null, this.appearance);
  if (this.name !== undefined) {
    clone.name = this.name;
  }
  clone.geometries = this.geometries;
  clone.bounds = this.bounds;
  return clone;
}


/**
 * Creates a 3D background.
 * @constructor
 * @extends Node3D
 * @author Emmanuel Puybaret
 */
function Background3D(group) {
  this.geometry = group;
} 
Background3D.prototype = Object.create(Node3D.prototype);
Background3D.prototype.constructor = Background3D;

Background3D.prototype.getGeometry = function() {
  return this.geometry;
}

Background3D.prototype.clone = function() {
  return new Background3D(this.geometry);
}


/**
 * Creates a 3D light.
 * @constructor
 * @extends Node3D
 * @author Emmanuel Puybaret
 */
function Light3D(color) {
  Node3D.call(this);
  this.color = color;
}
Light3D.prototype = Object.create(Node3D.prototype);
Light3D.prototype.constructor = Light3D;

Light3D.prototype.getColor = function() {
  return this.color;
}

Light3D.prototype.setColor = function(color) {
  var oldColor = this.color
  this.color = color;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("COLOR", oldColor, color);
  }
}


/**
 * Creates an ambient light.
 * @constructor
 * @extends Light3D
 * @author Emmanuel Puybaret
 */
function AmbientLight3D(color) {
  Light3D.call(this, color);
}
AmbientLight3D.prototype = Object.create(Light3D.prototype);
AmbientLight3D.prototype.constructor = AmbientLight3D;


AmbientLight3D.prototype.clone = function() {
  return new AmbientLight3D(this.color);
}


/**
 * Creates a directional light.
 * @constructor
 * @extends Light3D
 * @author Emmanuel Puybaret
 */
function DirectionalLight3D(color, direction) {
  Light3D.call(this, color);
  this.direction = direction;
}
DirectionalLight3D.prototype = Object.create(Light3D.prototype);
DirectionalLight3D.prototype.constructor = DirectionalLight3D;

Light3D.prototype.getDirection = function() {
  return this.direction;
}

DirectionalLight3D.prototype.clone = function() {
  return new DirectionalLight3D(this.color, this.direction);
}


/**
 * Creates a group, parent of 3D shapes and other groups.
 * @constructor
 * @extends Node3D
 * @author Emmanuel Puybaret
 */
function Group3D() {
  Node3D.call(this);
  this.children = [];
}
Group3D.prototype = Object.create(Node3D.prototype);
Group3D.prototype.constructor = Group3D;

Group3D.ALLOW_CHILDREN_EXTEND = 1;

Group3D.prototype.addChild = function(child) {
  this.insertChild(child, this.children.length);
}

Group3D.prototype.insertChild = function(child, index) {
  this.children.splice(index, 0, child);
  if (child instanceof BranchGroup3D) {
    child.parent = this; 
  }
  if (this.childrenChangeSupport !== undefined) {
    this.childrenChangeSupport.fireCollectionChanged(child, index, CollectionEvent.Type.ADD);
  }
}

Group3D.prototype.getChild = function(index) {
  return this.children [index];
}

Group3D.prototype.getChildren = function() {
  return this.children;
}

Group3D.prototype.removeChild = function(index) {
  var child;
  if (index instanceof Node3D) {
    child = index;
    index = this.children.indexOf(child);
  } else {
    child = this.children [index];
  }
  this.children.splice(index, 1);
  delete child.parent; 
  if (this.childrenChangeSupport !== undefined) {
    this.childrenChangeSupport.fireCollectionChanged(child, index, CollectionEvent.Type.DELETE);
  }
}

Group3D.prototype.removeAllChildren = function() {
  for (var i = this.children.length - 1; i >= 0; i--) {
    this.removeChild(i);
  }
}

/**
 * Adds the children <code>listener</code> in parameter to this home.
 */
Group3D.prototype.addChildrenListener = function(listener) {
  if (this.childrenChangeSupport === undefined) {
    this.childrenChangeSupport = new CollectionChangeSupport(this);
  }
  this.childrenChangeSupport.addCollectionListener(listener);
}

/**
 * Removes the children <code>listener</code> in parameter from this home.
 */
Group3D.prototype.removeChildrenListener = function(listener) {
  if (this.childrenChangeSupport !== undefined) {
    this.childrenChangeSupport.removeCollectionListener(listener);
  }
} 

Group3D.prototype.clone = function() {
  return new Group3D();
}


/**
 * Creates a branch group with a children list that may change once a 3D scene is already live.
 * @constructor
 * @extends Group3D
 * @author Emmanuel Puybaret
 */
function BranchGroup3D() {
  Group3D.call(this);
}
BranchGroup3D.prototype = Object.create(Group3D.prototype);
BranchGroup3D.prototype.constructor = BranchGroup3D;

BranchGroup3D.prototype.detach = function() {
  if (this.parent) {
    this.parent.removeChild(this);
  }
}

BranchGroup3D.prototype.clone = function() {
  return new BranchGroup3D();
}


/**
 * Creates a transform group.
 * @constructor
 * @extends Group3D
 * @author Emmanuel Puybaret
 */
function TransformGroup3D(transform) {
  Group3D.call(this);
  if (transform !== undefined) {
    this.transform = mat4.clone(transform);
  } else {
    this.transform = mat4.create();
  }
}
TransformGroup3D.prototype = Object.create(Group3D.prototype);
TransformGroup3D.prototype.constructor = TransformGroup3D;

TransformGroup3D.ALLOW_TRANSFORM_WRITE = 2;

TransformGroup3D.prototype.getTransform = function(transform) {
  mat4.copy(transform, this.transform);
}

TransformGroup3D.prototype.setTransform = function(transform) {
  var oldTransform = mat4.clone(this.transform); 
  mat4.copy(this.transform, transform);
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("TRANSFORM", oldTransform, transform);
  }
}

TransformGroup3D.prototype.clone = function() {
  return new TransformGroup3D(this.transform);
}


/**
 * Creates an appearance to store material attributes, transparency and texture.
 * @constructor
 * @author Emmanuel Puybaret
 */
function Appearance3D(name) {
  this.name = name;
}

Appearance3D.CULL_NONE = 0;
Appearance3D.CULL_BACK = 1;
Appearance3D.CULL_FRONT = 2;

/**
 * Adds the property change <code>listener</code> in parameter to this object.
 */
Appearance3D.prototype.addPropertyChangeListener = function(listener) {
  if (this.propertyChangeSupport === undefined) {
    this.propertyChangeSupport = new PropertyChangeSupport(this);    
  }
  this.propertyChangeSupport.addPropertyChangeListener(listener);
}

/**
 * Removes the property change <code>listener</code> in parameter from this object.
 */
Appearance3D.prototype.removePropertyChangeListener = function(listener) {
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.removePropertyChangeListener(listener);
  }
}

Appearance3D.prototype.getName = function() {
  return this.name;
}

Appearance3D.prototype.setAmbientColor = function(ambientColor) {
  var oldAmbientColor = this.ambientColor;
  this.ambientColor = ambientColor;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("AMBIENT_COLOR", oldAmbientColor, ambientColor);
  }
}

Appearance3D.prototype.getAmbientColor = function() {
  return this.ambientColor;
}

Appearance3D.prototype.setDiffuseColor = function(diffuseColor) {
  var oldDiffuseColor = this.diffuseColor;
  this.diffuseColor = diffuseColor;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("DIFFUSE_COLOR", oldDiffuseColor, diffuseColor);
  }
}

Appearance3D.prototype.getDiffuseColor = function() {
  return this.diffuseColor;
}

Appearance3D.prototype.setSpecularColor = function(specularColor) {
  var oldSpecularColor = this.specularColor;
  this.specularColor = specularColor;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("SPECULAR_COLOR", oldSpecularColor, specularColor);
  }
}

Appearance3D.prototype.getSpecularColor = function() {
  return this.specularColor;
}

Appearance3D.prototype.setShininess = function(shininess) {
  shininess = Math.max(shininess, 1);
  var oldShininess = this.shininess;
  this.shininess = shininess;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("SHININESS", oldShininess, shininess);
  }
}

Appearance3D.prototype.getShininess = function() {
  return this.shininess;
}

Appearance3D.prototype.setTransparency = function(transparency) {
  var oldTransparency = this.transparency;
  this.transparency = transparency;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("TRANSPARENCY", oldTransparency, transparency);
  }
}

Appearance3D.prototype.getTransparency = function() {
  return this.transparency;
}

Appearance3D.prototype.setIllumination = function(illumination) {
  var oldIllumination = this.illumination;
  this.illumination = illumination;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("ILLUMINATION", oldIllumination, illumination);
  }
}

Appearance3D.prototype.getIllumination = function() {
  return this.illumination;
}

Appearance3D.prototype.setTextureImage = function(textureImage) {
  var oldTextureImage = this.textureImage;
  this.textureImage = textureImage;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("TEXTURE_IMAGE", oldTextureImage, textureImage);
  }
}

Appearance3D.prototype.getTextureImage = function() {
  return this.textureImage;
}

Appearance3D.prototype.setTextureCoordinatesGeneration = function(textureCoordinatesGeneration) {
  var oldTextureCoordinatesGeneration = this.textureCoordinatesGeneration;
  this.textureCoordinatesGeneration = textureCoordinatesGeneration;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("TEXTURE_COORDINATES_GENERATION", oldTextureCoordinatesGeneration, textureCoordinatesGeneration);
  }
}

Appearance3D.prototype.getTextureCoordinatesGeneration = function() {
  return this.textureCoordinatesGeneration;
}

Appearance3D.prototype.setTextureTransform = function(textureTransform) {
  var oldTextureTransform = this.textureTransform;
  this.textureTransform = textureTransform;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("TEXTURE_TRANSFORM", oldTextureTransform, textureTransform);
  }
}

Appearance3D.prototype.getTextureTransform = function() {
  return this.textureTransform;
}

Appearance3D.prototype.setVisible = function(visible) {
  var oldVisible = this.visible;
  this.visible = visible;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("VISIBLE", oldVisible, visible);
  }
}

Appearance3D.prototype.isVisible = function() {
  return this.visible !== false;
}

Appearance3D.prototype.setCullFace = function(cullFace) {
  var oldCullFace = this.cullFace;
  this.cullFace = cullFace;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("CULL_FACE", oldCullFace, cullFace);
  }
}

Appearance3D.prototype.getCullFace = function() {
  return this.cullFace;
}

Appearance3D.prototype.setBackFaceNormalFlip = function(backFaceNormalFlip) {
  var oldBackFaceNormalFlip = this.backFaceNormalFlip;
  this.backFaceNormalFlip = backFaceNormalFlip;
  if (this.propertyChangeSupport !== undefined) {
    this.propertyChangeSupport.firePropertyChange("BACK_FACE_NORMAL_FLIP", oldBackFaceNormalFlip, backFaceNormalFlip);
  }
}

Appearance3D.prototype.getBackFaceNormalFlip = function() {
  return this.backFaceNormalFlip;
}

Appearance3D.prototype.isBackFaceNormalFlip = function() {
  return this.backFaceNormalFlip === true;
}

Appearance3D.prototype.clone = function() {
  var clone = new Appearance3D(this.name);
  for (var attribute in this) {
    if (this.hasOwnProperty(attribute)) {
      clone [attribute] = this [attribute];
    } 
  }
  return clone;
}

/**
 * Creates an indexed 3D geometry array.
 * @constructor
 * @author Emmanuel Puybaret
 */
function IndexedGeometryArray3D(vertices, vertexIndices,
                                textureCoordinates, textureCoordinateIndices) {
  this.vertices = vertices;
  this.vertexIndices = vertexIndices;
  this.textureCoordinates = textureCoordinates;
  this.textureCoordinateIndices = textureCoordinateIndices;
  this.textureCoordinatesDefined = this.textureCoordinateIndices && this.textureCoordinateIndices.length > 0;
}

IndexedGeometryArray3D.prototype.hasTextureCoordinates = function() {
  return this.textureCoordinatesDefined;
}

/**
 * Disposes the vertices and texture coordinates used by this geometry.
 */
IndexedGeometryArray3D.prototype.disposeCoordinates = function() {
  delete this.vertices;
  delete this.vertexIndices;
  delete this.textureCoordinates;
  delete this.textureCoordinateIndices;
}


/**
 * Creates the 3D geometry of an indexed line array.
 * @constructor
 * @extends IndexedGeometryArray3D
 * @author Emmanuel Puybaret
 */
function IndexedLineArray3D(vertices, vertexIndices,
                            textureCoordinates, textureCoordinateIndices) {
  IndexedGeometryArray3D.call(this, vertices, vertexIndices, textureCoordinates, textureCoordinateIndices);
}
IndexedLineArray3D.prototype = Object.create(IndexedGeometryArray3D.prototype);
IndexedLineArray3D.prototype.constructor = IndexedLineArray3D;


/**
 * Creates the 3D geometry of an indexed triangle array.
 * @constructor
 * @extends IndexedGeometryArray3D
 * @author Emmanuel Puybaret
 */
function IndexedTriangleArray3D(vertices, vertexIndices,
                                textureCoordinates, textureCoordinateIndices, 
                                normals, normalIndices) {
  IndexedGeometryArray3D.call(this, vertices, vertexIndices, textureCoordinates, textureCoordinateIndices);
  this.normals = normals;
  this.normalIndices = normalIndices;
}
IndexedTriangleArray3D.prototype = Object.create(IndexedGeometryArray3D.prototype);
IndexedTriangleArray3D.prototype.constructor = IndexedTriangleArray3D;

/**
 * Disposes the vertices, texture coordinates and normals used by this geometry.
 */
IndexedTriangleArray3D.prototype.disposeCoordinates = function() {
  IndexedGeometryArray3D.prototype.disposeCoordinates.call(this);
  delete this.normals;
  delete this.normalIndices;
}


/**
 * Creates a 3D bounding box.
 * @constructor
 * @author Emmanuel Puybaret
 */
function BoundingBox3D(lower, upper) {
  this.lower = lower !== undefined 
      ? vec3.clone(lower) 
      : vec3.fromValues(-1.0, -1.0, -1.0);
  this.upper = upper !== undefined 
      ? vec3.clone(upper) 
      : vec3.fromValues( 1.0,  1.0,  1.0);
}

BoundingBox3D.prototype.getLower = function(p) {
  vec3.copy(p, this.lower);
}

BoundingBox3D.prototype.getUpper = function(p) {
  vec3.copy(p, this.upper);
}

BoundingBox3D.prototype.combine = function(bounds) {
  if (bounds instanceof BoundingBox3D) {
    if (this.lower[0] > bounds.lower[0]) {
      this.lower[0] = bounds.lower[0];
    }
    if (this.lower[1] > bounds.lower[1]) {
      this.lower[1] = bounds.lower[1];
    }
    if (this.lower[2] > bounds.lower[2]) {
      this.lower[2] = bounds.lower[2];
    }
    if (this.upper[0] < bounds.upper[0]) {
      this.upper[0] = bounds.upper[0];
    }
    if (this.upper[1] < bounds.upper[1]) {
      this.upper[1] = bounds.upper[1];
    }
    if (this.upper[2] < bounds.upper[2]) {
      this.upper[2] = bounds.upper[2];
    }
  } else {
    var point = bounds;
    if (this.lower[0] > point[0]) {
      this.lower[0] = point[0];
    }
    if (this.lower[1] > point[1]) {
      this.lower[1] = point[1];
    }
    if (this.lower[2] > point[2]) {
      this.lower[2] = point[2];
    }
    if (this.upper[0] < point[0]) {
      this.upper[0] = point[0];
    }
    if (this.upper[1] < point[1]) {
      this.upper[1] = point[1];
    }
    if (this.upper[2] < point[2]) {
      this.upper[2] = point[2];
    }
  }
}

/** 
 * Transforms this bounding box by the given matrix.
 */
BoundingBox3D.prototype.transform = function(transform) {
  var xUpper = this.upper [0]; 
  var yUpper = this.upper [1]; 
  var zUpper = this.upper [2];
  var xLower = this.lower [0]; 
  var yLower = this.lower [1]; 
  var zLower = this.lower [2];
  
  var vector = vec3.fromValues(xUpper, yUpper, zUpper);
  vec3.transformMat4(vector, vector, transform);
  this.upper [0] = vector [0];
  this.upper [1] = vector [1];
  this.upper [2] = vector [2];
  this.lower [0] = vector [0];
  this.lower [1] = vector [1];
  this.lower [2] = vector [2];
  
  vec3.set(vector, xLower, yUpper, zUpper);
  vec3.transformMat4(vector, vector, transform); 
  if (vector [0]  > this.upper [0]) {
    this.upper [0] = vector [0];
  }
  if (vector [1]  > this.upper [1]) {
    this.upper [1] = vector [1];
  }
  if (vector [2]  > this.upper [2]) {
    this.upper [2] = vector [2];
  }
  if (vector [0]  < this.lower [0]) {
    this.lower [0] = vector [0];
  }
  if (vector [1]  < this.lower [1]) {
    this.lower [1] = vector [1];
  }
  if (vector [2]  < this.lower [2]) {
    this.lower [2] = vector [2];
  }
  
  vec3.set(vector, xLower, yLower, zUpper);
  vec3.transformMat4(vector, vector, transform);
  if (vector [0]  > this.upper [0]) {
    this.upper [0] = vector [0];
  }
  if (vector [1]  > this.upper [1]) {
    this.upper [1] = vector [1];
  }
  if (vector [2]  > this.upper [2]) {
    this.upper [2] = vector [2];
  }
  if (vector [0]  < this.lower [0]) {
    this.lower [0] = vector [0];
  }
  if (vector [1]  < this.lower [1]) {
    this.lower [1] = vector [1];
  }
  if (vector [2]  < this.lower [2]) {
    this.lower [2] = vector [2];
  }
  
  vec3.set(vector, xUpper, yLower, zUpper);
  vec3.transformMat4(vector, vector, transform);
  if (vector [0] > this.upper [0]) {
    this.upper [0] = vector [0];
  }
  if (vector [1] > this.upper [1]) {
    this.upper [1] = vector [1];
  }
  if (vector [2] > this.upper [2]) {
    this.upper [2] = vector [2];
  }
  if (vector [0] < this.lower [0]) {
    this.lower [0] = vector [0];
  }
  if (vector [1] < this.lower [1]) {
    this.lower [1] = vector [1];
  }
  if (vector [2] < this.lower [2]) {
    this.lower [2] = vector [2];
  }
  
  vec3.set(vector, xLower, yUpper, zLower);
  vec3.transformMat4(vector, vector, transform);
  if (vector [0] > this.upper [0]) {
    this.upper [0] = vector [0];
  }
  if (vector [1] > this.upper [1]) {
    this.upper [1] = vector [1];
  }
  if (vector [2] > this.upper [2]) {
    this.upper [2] = vector [2];
  }
  if (vector [0] < this.lower [0]) {
    this.lower [0] = vector [0];
  }
  if (vector [1] < this.lower [1]) {
    this.lower [1] = vector [1];
  }
  if (vector [2] < this.lower [2]) {
    this.lower [2] = vector [2];
  }
  
  vec3.set(vector, xUpper, yUpper, zLower);
  vec3.transformMat4(vector, vector, transform);
  if (vector [0] > this.upper [0]) {
    this.upper [0] = vector [0];
  }
  if (vector [1] > this.upper [1]) {
    this.upper [1] = vector [1];
  }
  if (vector [2] > this.upper [2]) {
    this.upper [2] = vector [2];
  }
  if (vector [0] < this.lower [0]) {
    this.lower [0] = vector [0];
  }
  if (vector [1] < this.lower [1]) {
    this.lower [1] = vector [1];
  }
  if (vector [2] < this.lower [2]) {
    this.lower [2] = vector [2];
  }
  
  vec3.set(vector, xLower, yLower, zLower);
  vec3.transformMat4(vector, vector, transform);
  if (vector [0] > this.upper [0]) {
    this.upper [0] = vector [0];
  }
  if (vector [1] > this.upper [1]) {
    this.upper [1] = vector [1];
  }
  if (vector [2] > this.upper [2]) {
    this.upper [2] = vector [2];
  }
  if (vector [0] < this.lower [0]) {
    this.lower [0] = vector [0];
  }
  if (vector [1] < this.lower [1]) {
    this.lower [1] = vector [1];
  }
  if (vector [2] < this.lower [2]) {
    this.lower [2] = vector [2];
  }
  
  vec3.set(vector, xUpper, yLower, zLower);
  vec3.transformMat4(vector, vector, transform);
  if (vector [0] > this.upper [0]) {
    this.upper [0] = vector [0];
  }
  if (vector [1] > this.upper [1]) {
    this.upper [1] = vector [1];
  }
  if (vector [2] > this.upper [2]) {
    this.upper [2] = vector [2];
  }
  if (vector [0] < this.lower [0]) {
    this.lower [0] = vector [0];
  }
  if (vector [1] < this.lower [1]) {
    this.lower [1] = vector [1];
  }
  if (vector [2] < this.lower [2]) {
    this.lower [2] = vector [2];
  }
}

BoundingBox3D.prototype.clone = function() {
  return new BoundingBox3D(this.lower, this.upper);
}

/**
 * Creates a 3D box shape.
 * @constructor
 * @extends Shape3D
 * @author Emmanuel Puybaret
 */
function Box3D(xdim, ydim, zdim, appearance) {
  Shape3D.call(this, 
      new IndexedTriangleArray3D([vec3.fromValues(-xdim, -ydim, -zdim),
                                  vec3.fromValues(xdim, -ydim, -zdim),
                                  vec3.fromValues(xdim, -ydim, zdim),
                                  vec3.fromValues(-xdim, -ydim, zdim),
                                  vec3.fromValues(-xdim, ydim, -zdim),
                                  vec3.fromValues(-xdim, ydim, zdim),
                                  vec3.fromValues(xdim, ydim, zdim),
                                  vec3.fromValues(xdim, ydim, -zdim)],
                                 [0, 1, 2, 0, 2, 3, 
                                  4, 5, 6, 4, 6, 7, 
                                  0, 3, 5, 0, 5, 4, 
                                  1, 7, 6, 1, 6, 2, 
                                  0, 4, 7, 0, 7, 1, 
                                  2, 6, 5, 2, 5, 3],
                                 [vec2.fromValues(0., 0.),
                                  vec2.fromValues(1., 0.),
                                  vec2.fromValues(1., 1.),
                                  vec2.fromValues(0., 1.)],
                                 [0, 1, 2, 0, 2, 3, 
                                  3, 0, 1, 3, 1, 2, 
                                  0, 1, 2, 0, 2, 3, 
                                  1, 2, 3, 1, 3, 0, 
                                  1, 2, 3, 1, 3, 0, 
                                  1, 2, 3, 1, 3, 0],
                                 [vec3.fromValues(0., -1., 0.),
                                  vec3.fromValues(0., 1., 0.),
                                  vec3.fromValues(-1., 0., 0.),
                                  vec3.fromValues(1., 0., 0.),
                                  vec3.fromValues(0., 0., -1.),
                                  vec3.fromValues(0., 0., 1.)],
                                 [0, 0, 0, 0, 0, 0, 
                                  1, 1, 1, 1, 1, 1, 
                                  2, 2, 2, 2, 2, 2, 
                                  3, 3, 3, 3, 3, 3, 
                                  4, 4, 4, 4, 4, 4, 
                                  5, 5, 5, 5, 5, 5]),
      appearance);
  this.bounds = new BoundingBox3D(vec3.fromValues(-xdim, -ydim, -zdim), vec3.fromValues(xdim, ydim, zdim));
}
Box3D.prototype = Object.create(Shape3D.prototype);
Box3D.prototype.constructor = Box3D;
