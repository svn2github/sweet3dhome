/*
 * FurnitureView.java 29 mai 2006
 *
 * Copyright (c) 2006 Emmanuel PUYBARET / eTeks <info@eteks.com>. All Rights Reserved.
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
package com.eteks.sweethome3d.viewcontroller;

import java.util.List;

import com.eteks.sweethome3d.model.HomePieceOfFurniture;

/**
 * A MVC view for furniture table.
 * @author Emmanuel Puybaret
 */
public interface FurnitureView extends View {
  /**
   * Returns the list of selected furniture in table.
   * @return a list of furniture. If no furniture is selected, the list should be empty.
   */
  public List<HomePieceOfFurniture> getSelectedFurniture();

  /**
   * Sets the list of selected furniture in table and ensures the first and the
   * last one is visible.
   * @param furniture the furniture to select
   */
  public void setSelectedFurniture(List<HomePieceOfFurniture> furniture);

  /**
   * Ensures the rectangle which displays <code>furniture</code> is visible.
   */
  void ensureFurnitureIsVisible(List<HomePieceOfFurniture> furniture);
}
