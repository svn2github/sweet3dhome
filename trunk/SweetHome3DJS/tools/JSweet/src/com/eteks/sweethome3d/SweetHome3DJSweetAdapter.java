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

import javax.lang.model.element.Element;
import javax.lang.model.element.ElementKind;
import javax.lang.model.element.ExecutableElement;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.QualifiedNameable;
import javax.lang.model.element.TypeElement;

import org.jsweet.JSweetConfig;
import org.jsweet.transpiler.AnnotationAdapter;
import org.jsweet.transpiler.element.CaseElement;
import org.jsweet.transpiler.element.ExtendedElement;
import org.jsweet.transpiler.element.FieldAccessElement;
import org.jsweet.transpiler.element.IdentifierElement;
import org.jsweet.transpiler.element.LiteralElement;
import org.jsweet.transpiler.element.MethodInvocationElement;
import org.jsweet.transpiler.element.NewClassElement;
import org.jsweet.transpiler.extensions.RemoveJavaDependenciesAdapter;
import org.jsweet.transpiler.util.PrinterAdapter;
import org.jsweet.transpiler.util.Util;

/**
 * This adapter tunes the JavaScript generation for some SweetHome3D
 * specificities.
 * 
 * <p>
 * It is a subclass of {@link RemoveJavaDependenciesAdapter} since we always
 * want the Java APIs to be removed form the generated code and use no runtime.
 * 
 * @author Renaud Pawlak
 */
public class SweetHome3DJSweetAdapter extends RemoveJavaDependenciesAdapter {

  // A local type map to save mapping that can be handled in a generic way
  private Map<String, String> sh3dTypeMapping = new HashMap<>();

  public SweetHome3DJSweetAdapter(PrinterAdapter parent) {
    super(parent);
    // Types that are supported in core.js
    sh3dTypeMapping.put(IllegalArgumentException.class.getName(), "IllegalArgumentException");
    sh3dTypeMapping.put(IllegalStateException.class.getName(), "IllegalStateException");
    sh3dTypeMapping.put(InternalError.class.getName(), "InternalError");
    sh3dTypeMapping.put(NoSuchElementException.class.getName(), "NoSuchElementException");
    sh3dTypeMapping.put(NullPointerException.class.getName(), "NullPointerException");
    sh3dTypeMapping.put(UnsupportedOperationException.class.getName(), "UnsupportedOperationException");
    sh3dTypeMapping.put(PropertyChangeEvent.class.getName(), "PropertyChangeEvent");
    sh3dTypeMapping.put(PropertyChangeListener.class.getName(), "PropertyChangeListener");
    sh3dTypeMapping.put(PropertyChangeSupport.class.getName(), "PropertyChangeSupport");
    // We assume we have the big.js lib and we map BigDecimal to Big
    sh3dTypeMapping.put(BigDecimal.class.getName(), "Big");
    // Activate the local type map
    addTypeMappings(sh3dTypeMapping);
    // We don't have a specific implementation for ResourceURLContent in JS...
    // Use the default one
    addTypeMapping("com.eteks.sweethome3d.tools.ResourceURLContent", "URLContent");
    // All enums that are named *Property will be translated to string in JS
    addTypeMapping(
        (typeTree, name) -> typeTree.getTypeElement().getKind() == ElementKind.ENUM && name.endsWith("Property")
            ? "string" : null);

    // All the Java elements to be ignored (will generate no JS)
    addAnnotation("jsweet.lang.Erased", //
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
        "com.eteks.sweethome3d.mobile", //
        "com.eteks.sweethome3d.io.HomeContentContext", //
        "com.eteks.sweethome3d.io.HomeXMLHandler.contentContext");

    // We now ignore some Java elements with a programmatic adapter
    addAnnotationAdapter(new AnnotationAdapter() {
      @Override
      public AnnotationState getAnnotationState(Element element, String annotationType) {
        // We add the @Erased annotation upon some specific conditions
        if (JSweetConfig.ANNOTATION_ERASED.equals(annotationType)) {
          if (element.getKind() == ElementKind.ENUM && element.getSimpleName().toString().endsWith("Property")) {
            // All enums named *Property will be erased (because they will be
            // strings in the generated code)
            return AnnotationState.ADDED;
          } else if (Util.isDeprecated(element)) {
            // All deprecated elements will be erased
            return AnnotationState.ADDED;
          } else if (element.getKind() == ElementKind.CONSTRUCTOR && ((QualifiedNameable) element.getEnclosingElement())
              .getQualifiedName().toString().equals("com.eteks.sweethome3d.model.CatalogPieceOfFurniture")) {
            // Only keep the 3 constructors of CatalogPieceOfFurniture
            ExecutableElement c = (ExecutableElement) element;
            if (!element.getModifiers().contains(Modifier.PRIVATE)) {
              if (c.getParameters().size() != 14 && c.getParameters().size() != 24 && c.getParameters().size() != 26) {
                return AnnotationState.ADDED;
              }
            }
          }
        }
        return AnnotationState.UNCHANGED;
      }

      @Override
      public String getAnnotationValue(Element element, String annotationType, String propertyName,
          String defaultValue) {
        return null;
      }

    });

    // We erase some packages: all the elements in these packages will be top
    // level in JS
    addAnnotation("@Root", "java.awt.geom", "com.eteks.sweethome3d.model", "com.eteks.sweethome3d.io");

    // Replace some Java implementations with some JS-specific implementations
    addAnnotation(
        "@TypeScriptBody('if (this.shapeCache == null) { this.shapeCache = this.getPolylinePath(); } return this.shapeCache; ')",
        "com.eteks.sweethome3d.model.Polyline.getShape()");
    addAnnotation(
        "@TypeScriptBody('if(content.indexOf('://') >= 0) { return new URLContent(content); } else { new HomeURLContent(content); }')",
        "com.eteks.sweethome3d.io.HomeXMLHandler.parseContent(java.lang.String)");

    // Force some interface to be mapped so functional types when possible
    addAnnotation(FunctionalInterface.class, "com.eteks.sweethome3d.model.CollectionListener",
        "com.eteks.sweethome3d.model.LocationAndSizeChangeListener");

  }

  @Override
  public boolean substituteNewClass(NewClassElement newClass, TypeElement type, String className) {
    // Handle generically all types that are locally mapped
    if (sh3dTypeMapping.containsKey(className)) {
      print("new ").print(newClass.getTypeElement().getSimpleName().toString()).print("(")
          .printArgList(newClass.getArguments()).print(")");
      return true;
    }
    switch (className) {
    // This is a hack until we have actual locale support (just create JS Date
    // objects)
    case "java.util.GregorianCalendar":
      if (newClass.getArguments().size() == 1) {
        if (newClass.getArguments().get(0) instanceof LiteralElement) {
          Object value = ((LiteralElement) newClass.getArguments().get(0)).getValue();
          if (!(value instanceof String && "UTC".equals(value))) {
            // This will use the user's locale
            print("new Date()");
            return true;
          }
        } else {
          // This will use the user's locale
          print("new Date()");
          return true;
        }
      }
    }
    return super.substituteNewClass(newClass, type, className);
  }

  @Override
  public boolean substituteMethodInvocation(MethodInvocationElement invocation, FieldAccessElement fieldAccess,
      Element targetType, String targetClassName, String targetMethodName) {
    if (targetClassName != null) {
      switch (targetClassName) {
      case "java.text.Collator":
        switch (targetMethodName) {
        case "setStrength":
          printMacroName(targetMethodName);
          // Erase setStrength completely
          print(fieldAccess.getExpression());
          return true;
        }
        break;
      case "java.math.BigDecimal":
        // Support for Java big decimal (method are mapped to their Big.js equivalent)
        switch (targetMethodName) {
        case "multiply":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression()).print(".times(").printArgList(invocation.getArguments()).print(")");
          return true;
        case "add":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression()).print(".plus(").printArgList(invocation.getArguments()).print(")");
          return true;
        case "scale":
          printMacroName(targetMethodName);
          // Always have a scale of 2 (we only have currencies, so 2 is a standard)
          print("2");
          return true;
        case "setScale":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression()).print(".round(").print(invocation.getArguments().get(0)).print(")");
          return true;
        case "compareTo":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression()).print(".cmp(").print(invocation.getArguments().get(0)).print(")");
          return true;
        }
        break;

      }
      // SH3D maps Property enums to strings
      if (targetType.getKind() == ElementKind.ENUM && targetClassName.endsWith("Property")) {
        switch (targetMethodName) {
        case "name":
          printMacroName(targetMethodName);
          print(fieldAccess.getExpression());
          return true;
        case "equals":
          printMacroName(targetMethodName);
          print("(").print(fieldAccess.getExpression()).print(" == ").print(invocation.getArguments().get(0))
              .print(")");
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
      // support for equals in case not supported by existing adapters
      if (targetMethodName.equals("equals")) {
        print("((o:any, o2) => { return o.equals?o.equals(o2):o===o2 })(").print(fieldAccess.getExpression()).print(",")
            .print(invocation.getArguments().get(0)).print(")");
        return true;
      }
    }
    return substituted;
  }

  @Override
  public boolean substituteFieldAccess(FieldAccessElement fieldAccess, Element targetType, String targetClassName,
      String targetFieldName) {
    switch (targetClassName) {
    case "java.text.Collator":
      switch (targetFieldName) {
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
    // Map *Property enums to strings
    if (targetType.getKind() == ElementKind.ENUM && targetClassName.endsWith("Property")) {
      print("\"" + targetFieldName + "\"");
      return true;
    }
    return super.substituteFieldAccess(fieldAccess, targetType, targetClassName, targetFieldName);
  }

  @Override
  public boolean substituteIdentifier(IdentifierElement identifier) {
    // Map *Property enums to strings
    if (identifier.getTypeElement().getKind() == ElementKind.ENUM && Util.isConstant(identifier)
        && identifier.getTypeElement().getSimpleName().toString().endsWith("Property")) {
      print("\"" + identifier + "\"");
      return true;
    }
    return super.substituteIdentifier(identifier);
  }

  @Override
  public boolean substituteCaseStatementPattern(CaseElement caseStatement, ExtendedElement pattern) {
    // Map *Property enums to strings
    if (pattern.getTypeElement().getKind() == ElementKind.ENUM
        && pattern.getTypeElement().getSimpleName().toString().endsWith("Property")) {
      print("\"" + pattern + "\"");
      return true;
    }
    return super.substituteCaseStatementPattern(caseStatement, pattern);
  }

}
