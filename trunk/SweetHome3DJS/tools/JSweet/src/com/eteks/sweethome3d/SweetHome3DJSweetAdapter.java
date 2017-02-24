/*
 * SweetHome3DJSweetAdapter.java 
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

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

import org.jsweet.JSweetConfig;
import org.jsweet.transpiler.AnnotationAdapter;
import org.jsweet.transpiler.extensions.RemoveJavaDependenciesAdapter;
import org.jsweet.transpiler.util.AbstractPrinterAdapter;
import org.jsweet.transpiler.util.Util;

import com.sun.tools.javac.code.Symbol;
import com.sun.tools.javac.code.Symbol.MethodSymbol;
import com.sun.tools.javac.code.Symbol.TypeSymbol;
import com.sun.tools.javac.tree.JCTree.JCCase;
import com.sun.tools.javac.tree.JCTree.JCExpression;
import com.sun.tools.javac.tree.JCTree.JCFieldAccess;
import com.sun.tools.javac.tree.JCTree.JCIdent;
import com.sun.tools.javac.tree.JCTree.JCLiteral;
import com.sun.tools.javac.tree.JCTree.JCMethodInvocation;
import com.sun.tools.javac.tree.JCTree.JCNewClass;

/**
 * This adapter tunes the JavaScript generation for some SweetHome3D specificities.
 * 
 * @author Renaud Pawlak
 */
public class SweetHome3DJSweetAdapter extends RemoveJavaDependenciesAdapter {

  Map<String, String> sh3dTypeMapping = new HashMap<>();

  public SweetHome3DJSweetAdapter(AbstractPrinterAdapter parent) {
    super(parent);

    sh3dTypeMapping.put(IllegalArgumentException.class.getName(), "IllegalArgumentException");
    sh3dTypeMapping.put(IllegalStateException.class.getName(), "IllegalStateException");
    sh3dTypeMapping.put(InternalError.class.getName(), "InternalError");
    sh3dTypeMapping.put(NoSuchElementException.class.getName(), "NoSuchElementException");
    sh3dTypeMapping.put(NullPointerException.class.getName(), "NullPointerException");
    sh3dTypeMapping.put(UnsupportedOperationException.class.getName(), "UnsupportedOperationException");
    sh3dTypeMapping.put(PropertyChangeEvent.class.getName(), "PropertyChangeEvent");
    sh3dTypeMapping.put(PropertyChangeListener.class.getName(), "PropertyChangeListener");
    sh3dTypeMapping.put(PropertyChangeSupport.class.getName(), "PropertyChangeSupport");
    sh3dTypeMapping.put(BigDecimal.class.getName(), "Big");
    addTypeMappings(sh3dTypeMapping);
    addTypeMapping((typeTree, name) -> typeTree.type.tsym.isEnum() && name.endsWith("Property") ? "string" : null);

    context.addAnnotation("jsweet.lang.Erased", //
        "*.readObject(*)", //
        "*.writeObject(*)", //
        "*.hashCode(*)", //
        "*.Compass.updateSunLocation(*)", //
        "*.Compass.getSunAzimuth(*)", //
        "*.Compass.getSunElevation(*)", //
        "*.serialVersionUID", //
        "*.Content.openStream(*)", //
        "com.eteks.sweethome3d.model.UserPreferences", //
        "com.eteks.sweethome3d.model.LengthUnit", //
        "com.eteks.sweethome3d.mobile");

    context.addAnnotation("@Root", "java.awt.geom", "com.eteks.sweethome3d.model");

    context.addAnnotation(
        "@TypeScriptBody('if (this.shapeCache == null) { this.shapeCache = this.getPolylinePath(); } return this.shapeCache; ')",
        "com.eteks.sweethome3d.model.Polyline.getShape()");

    context.addAnnotation(FunctionalInterface.class, "com.eteks.sweethome3d.model.CollectionListener");

    context.addAnnotationAdapter(new AnnotationAdapter() {
      @Override
      public AnnotationState getAnnotationState(Symbol symbol, String annotationType) {
        if (JSweetConfig.ANNOTATION_ERASED.equals(annotationType)) {
          if (symbol.isEnum() && symbol.getQualifiedName().toString().endsWith("Property")) {
            return AnnotationState.ADDED;
          } else if (symbol.isDeprecated()) {
            return AnnotationState.ADDED;
          } else if (symbol.isConstructor() && symbol.getEnclosingElement().getQualifiedName().toString()
              .equals("com.eteks.sweethome3d.model.CatalogPieceOfFurniture")) {
            MethodSymbol c = (MethodSymbol) symbol;
            if (!symbol.isPrivate()) {
              // only keep the 3 constructors are not deprecated and delegate to
              // the
              // private constructor
              if (c.getParameters().size() != 14 && c.getParameters().size() != 24 && c.getParameters().size() != 26) {
                return AnnotationState.ADDED;
              }
            }
          }
        }
        return AnnotationState.UNCHANGED;
      }

      @Override
      public String getAnnotationValue(Symbol symbol, String annotationType, String propertyName, String defaultValue) {
        return null;
      }

    });

  }

  @Override
  protected boolean substituteNewClass(JCNewClass newClass, String className) {
    if (sh3dTypeMapping.containsKey(className)) {
      print("new ").print(newClass.clazz.type.tsym.getSimpleName().toString()).print("(").printArgList(newClass.args)
          .print(")");
      return true;
    }
    switch (className) {
    // this is a hack until we have actual locale support
    case "java.util.GregorianCalendar":
      if (newClass.args.size() == 1) {
        if (newClass.args.head instanceof JCLiteral) {
          Object value = ((JCLiteral) newClass.args.head).getValue();
          if (!(value instanceof String && "UTC".equals(value))) {
            // this will use the user's locale
            print("new Date()");
            return true;
          }
        } else {
          // this will use the user's locale
          print("new Date()");
          return true;
        }
      }
    }
    return super.substituteNewClass(newClass, className);
  }

  @Override
  protected boolean substituteMethodInvocation(JCMethodInvocation invocation, JCFieldAccess fieldAccess,
      TypeSymbol targetType, String targetClassName, String targetMethodName) {
    if (targetClassName != null) {
      switch (targetClassName) {
      case "java.text.Collator":
        switch (targetMethodName) {
        case "setStrength":
          printMacroName(targetMethodName);
          // erase setStrength completely
          print(fieldAccess.getExpression());
          return true;
        }
        break;
      case "java.math.BigDecimal":
        switch (targetMethodName) {
        case "multiply":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression()).print(".times(").printArgList(invocation.args).print(")");
          return true;
        case "add":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression()).print(".plus(").printArgList(invocation.args).print(")");
          return true;
        case "scale":
          printMacroName(targetMethodName);
          print("2");
          return true;
        case "setScale":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression()).print(".round(").print(invocation.args.head).print(")");
          return true;
        case "compareTo":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression()).print(".cmp(").print(invocation.args.head).print(")");
          return true;
        }

      }
      // SH3D maps Property enums to strings
      if (targetType.isEnum() && targetClassName.endsWith("Property")) {
        switch (targetMethodName) {
        case "name":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression());
          return true;
        case "equals":
          printMacroName(targetMethodName);
          print("(").print(fieldAccess.getExpression()).print(" == ").print(invocation.args.head).print(")");
          return true;
        }
      }
      // special case for the AspectRatio enum
      if (targetClassName.endsWith(".AspectRatio") && targetMethodName.equals("getValue")) {
        print(
            "{FREE_RATIO:null,VIEW_3D_RATIO:null,RATIO_4_3:4/3,RATIO_3_2:1.5,RATIO_16_9:16/9,RATIO_2_1:2/1,SQUARE_RATIO:1}[")
                .print(fieldAccess.getExpression()).print("]");
        return true;
      }
    }
    boolean substituted = super.substituteMethodInvocation(invocation, fieldAccess, targetType, targetClassName,
        targetMethodName);
    if (!substituted) {
      if (targetMethodName.equals("equals")) {
        print("((o:any, o2) => { return o.equals?o.equals(o2):o===o2 })(").print(fieldAccess.getExpression()).print(",")
            .print(invocation.args.head).print(")");
        return true;
      }
    }
    return substituted;
  }

  @Override
  protected boolean substituteFieldAccess(JCFieldAccess fieldAccess, TypeSymbol targetType, String accessedType) {
    switch (accessedType) {
    case "java.text.Collator":
      switch (fieldAccess.name.toString()) {
      case "CANONICAL_DECOMPOSITION":
      case "FULL_DECOMPOSITION":
      case "IDENTICAL":
      case "NO_DECOMPOSITION":
      case "PRIMARY":
      case "SECONDARY":
      case "TERTIARY":
        print("undefined");
        return true;
      }
    }
    // SH3D maps Property enums to strings
    if (targetType.isEnum() && accessedType.endsWith("Property")) {
      print("\"" + fieldAccess.name + "\"");
      return true;
    }
    return super.substituteFieldAccess(fieldAccess, targetType, accessedType);
  }

  @Override
  public boolean substituteIdentifier(JCIdent identifier) {
    // SH3D maps Property enums to strings
    if (identifier.type.tsym.isEnum() && Util.isConstant(identifier)
        && identifier.type.tsym.getSimpleName().toString().endsWith("Property")) {
      print("\"" + identifier + "\"");
      return true;
    }
    return super.substituteIdentifier(identifier);
  }

  @Override
  public boolean substituteCaseStatementPattern(JCCase caseStatement, JCExpression pattern) {
    // SH3D maps Property enums to strings
    if (pattern.type.tsym.isEnum() && pattern.type.tsym.getSimpleName().toString().endsWith("Property")) {
      print("\"" + pattern + "\"");
      return true;
    }
    return super.substituteCaseStatementPattern(caseStatement, pattern);
  }

}
