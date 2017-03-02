/*
 * SweetHome3DJava3DJSweetAdapter.java 
 *
 * Sweet Home 3D, Copyright (c) 2017 Emmanuel PUYBARET / eTeks <info@eteks.com>
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
package com.eteks.sweethome3d;

import javax.lang.model.element.Element;

import org.jsweet.transpiler.element.FieldAccessElement;
import org.jsweet.transpiler.element.MethodInvocationElement;
import org.jsweet.transpiler.util.PrinterAdapter;

/**
 * This adapter tunes the JavaScript generation for some SweetHome3D
 * specificities.
 * 
 * @author Renaud Pawlak
 */
public class SweetHome3DJava3DJSweetAdapter extends PrinterAdapter {

  public SweetHome3DJava3DJSweetAdapter(PrinterAdapter parent) {
    super(parent);

    addTypeMapping("javax.media.j3d.Appearance", "Appearance3D");
    addTypeMapping("javax.media.j3d.TransparencyAttributes", "Appearance3D");

  }

  @Override
  public boolean substituteMethodInvocation(MethodInvocationElement invocation, FieldAccessElement fieldAccess,
      Element targetType, String targetClassName, String targetMethodName) {
    if (targetClassName != null) {
      switch (targetClassName) {
      case "javax.media.j3d.Appearance":
        switch (targetMethodName) {
        case "getTransparencyAttributes":
          print(fieldAccess.getExpression());
          return true;
        }
        break;

      }
    }
    return super.substituteMethodInvocation(invocation, fieldAccess, targetType, targetClassName, targetMethodName);
  }

}
