/*
 * ModelManager.js
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

// Requires URLContent.js
//          scene3d.js
//          ModelLoader.js
//          OBJLoader.js
//          HomeObject.js
//          HomePieceOfFurniture.js

/**
 * Singleton managing 3D models cache.
 * @constructor
 * @author Emmanuel Puybaret
 */
function ModelManager() {
  this.loadedModelNodes = {};
  this.loadingModelObservers = {};
}

/**
 * <code>Shape3D</code> name prefix for window pane shapes. 
 */
ModelManager.WINDOW_PANE_SHAPE_PREFIX = "sweethome3d_window_pane";
/**
 * <code>Shape3D</code> name prefix for mirror shapes. 
 */
ModelManager.MIRROR_SHAPE_PREFIX = "sweethome3d_window_mirror";
/**
 * <code>Shape3D</code> name prefix for lights. 
 */
ModelManager.LIGHT_SHAPE_PREFIX = "sweethome3d_light";

// Singleton
ModelManager.instance = null;

/**
 * Returns an instance of this singleton.
 * @return {ModelManager} 
 */
ModelManager.getInstance = function() {
  if (ModelManager.instance == null) {
    ModelManager.instance = new ModelManager();
  }
  return ModelManager.instance;
}

/**
 * Clears loaded models cache. 
 */
ModelManager.prototype.clear = function() {
  this.loadedModelNodes = {};
  this.loadingModelObservers = {};
  if (this.modelLoaders) {
    for (var i = 0; i < this.modelLoaders.length; i++) {
      this.modelLoaders [i].clear();
    } 
  }
}

/**
 * Returns the minimum size of a model.
 */
ModelManager.prototype.getMinimumSize = function() {
  return 0.001;
}

/**
 * Returns the size of 3D shapes of node after an additional optional transformation.
 * @param {Node3D} node  the root of a model 
 * @param {Array}  [transformation] the optional transformation applied to the model  
 */
ModelManager.prototype.getSize = function(node, transformation) {
  if (transformation === undefined) {
    transformation = mat4.create();
  }
  var bounds = this.getBounds(node, transformation);
  var lower = vec3.create();
  bounds.getLower(lower);
  var upper = vec3.create();
  bounds.getUpper(upper);
  return vec3.fromValues(Math.max(this.getMinimumSize(), upper[0] - lower[0]), 
      Math.max(this.getMinimumSize(), upper[1] - lower[1]), 
      Math.max(this.getMinimumSize(), upper[2] - lower[2]));
}

/**
 * Returns the bounds of the 3D shapes of node with an additional optional transformation.
 * @param {Node3D} node  the root of a model 
 * @param {Array}  [transformation] the optional transformation applied to the model  
 */
ModelManager.prototype.getBounds = function(node, transformation) {
  if (transformation === undefined) {
    transformation = mat4.create();
  }
  var objectBounds = new BoundingBox3D(
      vec3.fromValues(Infinity, Infinity, Infinity), 
      vec3.fromValues(-Infinity, -Infinity, -Infinity));
  this.computeBounds(node, objectBounds, transformation, !this.isOrthogonalRotation(transformation));
  return objectBounds;
}

/**
 * Returns true if the rotation matrix matches only rotations of 
 * a multiple of 90° degrees around x, y or z axis.
 * @private
 */
ModelManager.prototype.isOrthogonalRotation = function(transformation) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      // Return false if the matrix contains a value different from 0 1 or -1
      if (Math.abs(transformation[i * 4 + j]) > 1E-6
          && Math.abs(transformation[i * 4 + j] - 1) > 1E-6
          && Math.abs(transformation[i * 4 + j] + 1) > 1E-6) {
        return false;
      }
    }
  }
  return true;
}

/**
 * @private
 */
ModelManager.prototype.computeBounds = function(node, bounds, parentTransformations, transformShapeGeometry) {
  if (node instanceof Group3D) {
    if (node instanceof TransformGroup3D) {
      parentTransformations = mat4.clone(parentTransformations);
      mat4.mul(parentTransformations, parentTransformations, node.transform);
    }
    // Compute the bounds of all the node children
    for (var i = 0; i < node.children.length; i++) {
      this.computeBounds(node.children [i], bounds, parentTransformations, transformShapeGeometry);
    }
  } else if (node instanceof Link3D) {
    this.computeBounds(node.getSharedGroup(), bounds, parentTransformations, transformShapeGeometry);
  } else if (node instanceof Shape3D) {
    var shapeBounds;
    if (transformShapeGeometry) {
      shapeBounds = this.computeTransformedGeometryBounds(node, parentTransformations);
    } else {
      shapeBounds = node.getBounds();
      shapeBounds.transform(parentTransformations);
    }
    bounds.combine(shapeBounds);
  }
}

/**
 * @private
 */
ModelManager.prototype.computeTransformedGeometryBounds = function(shape, transformation) {
  var lower = vec3.fromValues(Infinity, Infinity, Infinity);
  var upper = vec3.fromValues(-Infinity, -Infinity, -Infinity);    
  for (var i = 0; i < shape.geometries.length; i++) {
    // geometry instanceof IndexedGeometryArray3D
    var geometry = shape.geometries [i];
    var vertex = vec3.create();
    for (var index = 0; index < geometry.vertexIndices.length; index++) {
      vec3.copy(vertex, geometry.vertices [geometry.vertexIndices [index]]);
      this.updateBounds(vertex, transformation, lower, upper);
    }
  }
  return new BoundingBox3D(lower, upper);
}

/**
 * @private
 */
ModelManager.prototype.updateBounds = function(vertex, transformation, lower, upper) {
  if (transformation !== null) {
    vec3.transformMat4(vertex, vertex, transformation);
  }
  vec3.min(lower, lower, vertex);
  vec3.max(upper, upper, vertex);
}

/**
 * Returns a transform group that will transform the model node
 * to let it fill a box of the given width centered on the origin.
 * @param {Node3D} node     the root of a model with any size and location
 * @param {Array}  modelRotation the rotation applied to the model before normalization 
 *                 or <code>null</code> if no transformation should be applied to node.
 * @param {number} width    the width of the box
 */
ModelManager.prototype.getNormalizedTransformGroup = function(node, modelRotation, width) {
  return new TransformGroup3D(this.getNormalizedTransform(node, modelRotation, width));
}

/**
 * Returns a transformation matrix that will transform the model node
 * to let it fill a box of the given width centered on the origin.
 * @param {Node3D} node     the root of a model with any size and location
 * @param {?Array} modelRotation the rotation applied to the model before normalization 
 *                 or <code>null</code> if no transformation should be applied to node.
 * @param {number} width    the width of the box
 */
ModelManager.prototype.getNormalizedTransform = function(node, modelRotation, width) {
  // Get model bounding box size 
  var modelBounds = this.getBounds(node);
  var lower = vec3.create();
  modelBounds.getLower(lower);
  var upper = vec3.create();
  modelBounds.getUpper(upper);
  // Translate model to its center
  var translation = mat4.create();
  mat4.translate(translation, translation,
      vec3.fromValues(-lower[0] - (upper[0] - lower[0]) / 2, 
          -lower[1] - (upper[1] - lower[1]) / 2, 
          -lower[2] - (upper[2] - lower[2]) / 2));
  
  var modelTransform;
  if (modelRotation !== undefined && modelRotation !== null) {
    // Get model bounding box size with model rotation
    var modelTransform = this.getRotationTransformation(modelRotation);
    mat4.mul(modelTransform, modelTransform, translation);
    var rotatedModelBounds = this.getBounds(node, modelTransform);
    rotatedModelBounds.getLower(lower);
    rotatedModelBounds.getUpper(upper);
  } else {
    modelTransform = translation;
  }

  // Scale model to make it fill a 1 unit wide box
  var scaleOneTransform = mat4.create();
  mat4.scale(scaleOneTransform, scaleOneTransform,
      vec3.fromValues(width / Math.max(this.getMinimumSize(), upper[0] - lower[0]), 
          width / Math.max(this.getMinimumSize(), upper[1] - lower[1]), 
          width / Math.max(this.getMinimumSize(), upper[2] - lower[2])));
  mat4.mul(scaleOneTransform, scaleOneTransform, modelTransform);
  return scaleOneTransform;
}

/**
 * Returns a transformation matching the given rotation.
 * @param {Array}  modelRotation  the desired rotation.
 */
ModelManager.prototype.getRotationTransformation = function(modelRotation) {
  var modelTransform = mat4.create();
  modelTransform [0] = modelRotation [0][0];
  modelTransform [4] = modelRotation [0][1];
  modelTransform [8] = modelRotation [0][2];
  modelTransform [1] = modelRotation [1][0];
  modelTransform [5] = modelRotation [1][1];
  modelTransform [9] = modelRotation [1][2];
  modelTransform [2] = modelRotation [2][0];
  modelTransform [6] = modelRotation [2][1];
  modelTransform [10] = modelRotation [2][2];
  return modelTransform;
}

/**
 * Returns a transformation able to place in the scene the normalized model 
 * of the given <code>piece</code>.
 * @param {HomePieceOfFurniture} piece   a piece of furniture
 */
ModelManager.prototype.getPieceOFFurnitureNormalizedModelTransformation = function(piece) {
  // Set piece size
  var scale = mat4.create();
  var pieceWidth = piece.getWidth();
  // If piece model is mirrored, inverse its width
  if (piece.isModelMirrored()) {
    pieceWidth *= -1;
  }
  mat4.scale(scale, scale, vec3.fromValues(pieceWidth, piece.getHeight(), piece.getDepth()));
  // Change its angle around y axis
  var orientation = mat4.create();
  mat4.rotateY(orientation, orientation, -piece.getAngle());
  mat4.mul(orientation, orientation, scale);
  // Translate it to its location
  var pieceTransform = mat4.create();
  var z = piece.getElevation() + piece.getHeight() / 2.;
  if (piece.getLevel() !== null) {
    z += piece.getLevel().getElevation();
  }
  mat4.translate(pieceTransform, pieceTransform, vec3.fromValues(piece.getX(), z, piece.getY()));      
  mat4.mul(pieceTransform, pieceTransform, orientation);
  return pieceTransform;
}

/**
 * Reads a 3D node from content with supported loaders
 * and notifies the loaded model to the given modelObserver once available
 * with its modelUpdated and modelError methods. 
 * @param {URLContent} content an object containing a model
 * @param {boolean} [synchronous] optional parameter equal to false by default
 * @param {{modelUpdated, modelError, progression}} modelObserver  
 *           the observer that will be notified once the model is available
 *           or if an error happens
 */
ModelManager.prototype.loadModel = function(content, synchronous, modelObserver) {
  if (modelObserver === undefined) {
    modelObserver = synchronous;
    synchronous = false;
  }
  var contentUrl = content.getURL();
  if (contentUrl in this.loadedModelNodes) {
    // Notify cached model to observer with a clone of the model
    var model = this.loadedModelNodes [contentUrl];
    modelObserver.modelUpdated(this.cloneNode(model));
  } else {
    if (contentUrl in this.loadingModelObservers) {
      // If observers list exists, content model is already being loaded
      // register observer for future notification
      this.loadingModelObservers [contentUrl].push(modelObserver);
    } else {
      // Create a list of observers that will be notified once content model is loaded
      var observers = [];
      observers.push(modelObserver);
      this.loadingModelObservers [contentUrl] = observers;
      if (!this.modelLoaders) {
        // As model loaders are reentrant, use the same loaders for multiple loading
        this.modelLoaders = [new OBJLoader()];
        // Optional loaders
        if (typeof Max3DSLoader !== "undefined") {
          this.modelLoaders.push(new Max3DSLoader());
        }
      }
      var modelManager = this;
      var modelObserver = {
          modelLoaderIndex: 0,
          modelLoaded: function(model) {
            if (model.getChildren().length !== 0) {
              var observers = modelManager.loadingModelObservers [contentUrl];
              if (observers) {
                delete modelManager.loadingModelObservers [contentUrl];
                modelManager.updateWindowPanesTransparency(model);
                modelManager.loadedModelNodes [contentUrl] = model;
                for (var i = 0; i < observers.length; i++) {
                  observers [i].modelUpdated(modelManager.cloneNode(model));
                }
              }
            } else if (++this.modelLoaderIndex < modelManager.modelLoaders.length) {
              modelManager.modelLoaders [this.modelLoaderIndex].load(contentUrl, synchronous, this);
            } else {
              this.modelError("Unsupported 3D format");
            }
          },
          modelError: function(err) {
            var observers = modelManager.loadingModelObservers [contentUrl];
            if (observers) {
              delete modelManager.loadingModelObservers [contentUrl];
              for (var i = 0; i < observers.length; i++) {
                observers [i].modelError(err);
              }
            }
          },
          progression: function(part, info, percentage) {
            var observers = modelManager.loadingModelObservers [contentUrl];
            if (observers) {
              for (var i = 0; i < observers.length; i++) {
                observers [i].progression(part, info, percentage);
              } 
            }
          }
        };
      modelManager.modelLoaders [0].load(contentUrl, synchronous, modelObserver);
    }
  }
}

/**
 * Removes the model matching the given content from the manager. 
 * @param {URLContent} content an object containing a model
 * @param {boolean}    disposeGeometries if <code>true</code> model geometries will be disposed too
 */
ModelManager.prototype.unloadModel = function(content, disposeGeometries) {
  var contentUrl = content.getURL();
  var modelRoot = this.loadedModelNodes [contentUrl];
  delete this.loadedModelNodes [contentUrl];
  delete this.loadingModelObservers [contentUrl];
  if (disposeGeometries) {
    this.disposeGeometries(modelRoot);
  }
}

/**
 * Frees geometry data of the given <code>node</code>.
 * @param {Node3D} node  the root of a model
 * @package 
 */
ModelManager.prototype.disposeGeometries = function(node) {
  if (node instanceof Group3D) {
    for (var i = 0; i < node.children.length; i++) {
      this.disposeGeometries(node.children [i]);
    }
  } else if (node instanceof Link3D) {
    // Not a problem to dispose more than once geometries of a shared group
    this.disposeGeometries(node.getSharedGroup());
  } else if (node instanceof Shape3D) {
    var nodeGeometries = node.getGeometries();
    for (var i = 0; i < nodeGeometries.length; i++) {
      nodeGeometries [i].disposeCoordinates(); 
    }
  }
}

/**
 * Returns a clone of the given <code>node</code>.
 * All the children and the attributes of the given node are duplicated except the geometries 
 * and the texture images of shapes.
 * @param {Node3D} node  the root of a model 
 */
ModelManager.prototype.cloneNode = function(node, clonedSharedGroups) {
  if (clonedSharedGroups === undefined) {
    return this.cloneNode(node, []);
  } else {
    var clonedNode = node.clone();
    if (node instanceof Shape3D) {
      var clonedAppearance;
      if (node.getAppearance()) {
        clonedNode.setAppearance(node.getAppearance().clone());
      }
    } else if (node instanceof Link3D) {
      var clonedLink = node.clone();
      // Force duplication of shared groups too if not duplicated yet
      var sharedGroup = clonedLink.getSharedGroup();
      if (sharedGroup !== null) {
        var clonedSharedGroup = null;
        for (var i = 0; i < clonedSharedGroups.length; i++) {
          if (clonedSharedGroups [i].sharedGroup === sharedGroup) {
            clonedSharedGroup = clonedSharedGroups [i].clonedSharedGroup;
            break;
          }
        }
        if (clonedSharedGroup === null) {
          clonedSharedGroup = this.cloneNode(sharedGroup, clonedSharedGroups);
          clonedSharedGroups.push({sharedGroup: sharedGroup, 
                                   clonedSharedGroup: clonedSharedGroup});          
        }
        clonedLink.setSharedGroup(clonedSharedGroup);
      }
      return clonedLink;
    } else {
      clonedNode = node.clone();
      if (node instanceof Group3D) {
        var children = node.getChildren();
        for (var i = 0; i < children.length; i++) {
          var clonedChild = this.cloneNode(children [i]);
          clonedNode.addChild(clonedChild);
        }
      }
    }
    return clonedNode;
  }
}

/**
 * Updates the transparency of window panes shapes.
 * @private
 */
ModelManager.prototype.updateWindowPanesTransparency = function(node) {
  if (node instanceof Group3D) {
    for (var i = 0; i < node.children.length; i++) {
      this.updateWindowPanesTransparency(node.children [i]);
    }
  } else if (node instanceof Link3D) {
    this.updateWindowPanesTransparency(node.getSharedGroup());
  } else if (node instanceof Shape3D) {
    if (node.getName().indexOf(ModelManager.WINDOW_PANE_SHAPE_PREFIX) === 0) {
      var appearance = node.getAppearance();
      if (appearance === null) {
        appearance = new Appearance3D();
        node.setAppearance(appearance);
      }
      if (appearance.getTransparency() === undefined) {
        appearance.setTransparency(0.5);
      }
    }
  }
}

