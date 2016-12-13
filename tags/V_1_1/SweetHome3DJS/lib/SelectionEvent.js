/*
 * SelectionEvent.js
 *
 * Sweet Home 3D, Copyright (c) 2016 Emmanuel PUYBARET / eTeks <info@eteks.com>
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
 * Type of event notified when selection changes in home or furniture catalog.
 * @param {Object} source          the object where selection changed
 * @param {Object[]} selectedItems the added or deleted item
 * @constructor
 * @author Emmanuel Puybaret
 */
function SelectionEvent(source, selectedItems) {
  this.source = source;
  this.selectedItems = selectedItems;
}

/**
 * Returns the source of the event.
 * @return {Object}
 */
SelectionEvent.prototype.getSource = function() {
  return this.source;
}

/**
 * Returns the selected items.
 * @return {Object[]}
 */
SelectionEvent.prototype.getSelectedItems = function() {
  return this.selectedItems;
}
