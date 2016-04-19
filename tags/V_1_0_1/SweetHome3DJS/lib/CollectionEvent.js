/*
 * CollectionEvent.js
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
 * Creates an event for an item with its index.
 * @param {Object} source the object to which an item was added or deleted
 * @param {Object} item   the added or deleted item
 * @param {number} index  the index at which the item was added or deleted, or -1 if unknown
 * @param type   <code>CollectionEvent.Type.ADD</code> or <code>CollectionEvent.Type.DELETE</code> 
 * @constructor
 * @author Emmanuel Puybaret
 */
function CollectionEvent(source, item, index, type) {
  this.source = source;
  this.item = item;
  this.index = index;
  this.type =  type;
}

/**
 * The type of change in the collection.
 */
CollectionEvent.Type = {ADD : 0, DELETE : 1};

/**
 * Returns the source of the event.
 * @return {Object}
 */
CollectionEvent.prototype.getSource = function() {
  return this.source;
}

/**
 * Returns the added or deleted item.
 * @return {Object}
 */
CollectionEvent.prototype.getItem = function() {
  return this.item;
}

/**
 * Returns the index of the item in collection or -1 if this index is unknown.
 * @return {number}
 */
CollectionEvent.prototype.getIndex = function() {
  return this.index;
}

/**
 * Returns the type of event. 
 * @return <code>CollectionEvent.Type.ADD</code> or <code>CollectionEvent.Type.DELETE</code> 
 */
CollectionEvent.prototype.getType = function() {
  return this.type;
}
