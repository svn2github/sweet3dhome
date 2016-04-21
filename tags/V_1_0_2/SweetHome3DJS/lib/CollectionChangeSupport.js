/*
 * CollectionChangeSupport.js
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
 * Creates a helper to manage listener for events of type {@link CollectionEvent}.
 * @param {Object} source  the collection to which data will be added.  
 * @constructor
 * @author Emmanuel Puybaret
 */
function CollectionChangeSupport(source) {
  this.source = source;
  this.collectionListeners = [];
}

/**
 * Adds the <code>listener</code> in parameter to the list of listeners that may be notified.
 * @param listener  a callback that will be called with a {@link CollectionEvent} instance
 */
CollectionChangeSupport.prototype.addCollectionListener = function(listener) {
  this.collectionListeners.push(listener);
}

/**
 * Removes the <code>listener</code> in parameter to the list of listeners that may be notified.
 * @param listener the listener to remove. If it doesn't exist, it's simply ignored.
 */
CollectionChangeSupport.prototype.removeCollectionListener = function(listener) {
  var index = this.collectionListeners.indexOf(listener);
  if (index !== - 1) {
    this.collectionListeners.splice(index, 1);
  }
}

/**
 * Fires a collection event about <code>item</code> at a given <code>index</code>.
 * @param {Object} item      the added ore deleted item 
 * @param {number} [index]   the optional index at which the item was added or deleted 
 * @param {number} eventType <code>CollectionEvent.Type.ADD</code> or <code>CollectionEvent.Type.DELETE</code> 
 */
CollectionChangeSupport.prototype.fireCollectionChanged = function(item, index, eventType) {
  if (eventType === undefined) {
    // 2 parameters
    eventType = index;
    index = -1;
  }
  if (this.collectionListeners.length > 0) {
    var event = new CollectionEvent(this.source, item, index, eventType);
    // Work on a copy of collectionListeners to ensure a listener 
    // can modify safely listeners list
    var listeners = this.collectionListeners.slice(0);
    for (var i = 0; i < listeners.length; i++) {
      listeners [i](event);
    }
  }
}
