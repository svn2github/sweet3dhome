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
package com.eteks.sweethome3d.jsweet;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.math.BigDecimal;
import java.net.URL;
import java.text.Format;
import java.util.EventObject;
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
import org.jsweet.transpiler.extension.AnnotationManager;
import org.jsweet.transpiler.extension.PrinterAdapter;
import org.jsweet.transpiler.model.CaseElement;
import org.jsweet.transpiler.model.ExtendedElement;
import org.jsweet.transpiler.model.IdentifierElement;
import org.jsweet.transpiler.model.LiteralElement;
import org.jsweet.transpiler.model.MethodInvocationElement;
import org.jsweet.transpiler.model.NewClassElement;
import org.jsweet.transpiler.model.VariableAccessElement;

/**
 * This adapter tunes the JavaScript generation for some SweetHome3D specificities.
 * @author Renaud Pawlak
 */
public class SweetHome3DJSweetAdapter extends PrinterAdapter {
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
    sh3dTypeMapping.put(EventObject.class.getName(), "EventObject");
    sh3dTypeMapping.put(PropertyChangeListener.class.getName(), "PropertyChangeListener");
    sh3dTypeMapping.put(PropertyChangeSupport.class.getName(), "PropertyChangeSupport");
    // We assume we have the big.js lib and we map BigDecimal to Big
    sh3dTypeMapping.put(BigDecimal.class.getName(), "Big");
    // Activate the local type map
    addTypeMappings(sh3dTypeMapping);
    // We don't have a specific implementation for ResourceURLContent in JS...
    // Use the default one
    addTypeMapping("com.eteks.sweethome3d.tools.ResourceURLContent", "URLContent");
    addTypeMapping(Format.class.getName(), "string");
    addTypeMapping(URL.class.getName(), "string");
    // All enums that are named *Property will be translated to string in JS
    addTypeMapping(
        (typeTree, name) -> typeTree.getTypeAsElement().getKind() == ElementKind.ENUM && name.endsWith("Property")
            ? "string" : null);

    // All the Java elements to be ignored (will generate no JS) except the ones starting with !
    addAnnotation("jsweet.lang.Erased",
        "**.readObject(..)",
        "**.writeObject(..)",
        "**.hashCode(..)",
        "**.Compass.updateSunLocation(..)",
        "**.Compass.getSunAzimuth(..)",
        "**.Compass.getSunElevation(..)",
        "**.serialVersionUID",
        "**.Content.openStream(..)",
        "com.eteks.sweethome3d.model.UserPreferences",
        "com.eteks.sweethome3d.model.LengthUnit",
        "com.eteks.sweethome3d.model.HomeRecorder",
        "com.eteks.sweethome3d.model.HomeApplication",
        "com.eteks.sweethome3d.model.*Exception",
        "com.eteks.sweethome3d.tools",
        "com.eteks.sweethome3d.io.*",
        "!com.eteks.sweethome3d.io.HomeXMLHandler",
        "com.eteks.sweethome3d.io.HomeXMLHandler.contentContext",
        "com.eteks.sweethome3d.io.HomeXMLHandler.setContentContext(**)",
        "com.eteks.sweethome3d.io.HomeXMLHandler.isSameContent(**)");
    if ("SweetHome3DJSViewer".equals(System.getProperty("transpilationTarget"))) {
      // Only HomeController3D and its dependencies are needed for Sweet Home 3D viewer 
      addAnnotation("jsweet.lang.Erased",
          "com.eteks.sweethome3d.viewcontroller.*",
          "!com.eteks.sweethome3d.viewcontroller.HomeController3D",
          "com.eteks.sweethome3d.viewcontroller.HomeController3D.modifyAttributes(**)",
          "!com.eteks.sweethome3d.viewcontroller.Controller",
          "!com.eteks.sweethome3d.viewcontroller.View");
    } else {
      addAnnotation("jsweet.lang.Erased",
          "com.eteks.sweethome3d.viewcontroller.ThreadedTaskController",
          "com.eteks.sweethome3d.viewcontroller.HomeController",
          "com.eteks.sweethome3d.viewcontroller.HelpController",
          "com.eteks.sweethome3d.viewcontroller.PrintPreviewController",
          "com.eteks.sweethome3d.viewcontroller.HomeView",
          "com.eteks.sweethome3d.viewcontroller.ExportableView.exportData(..)",
          "com.eteks.sweethome3d.viewcontroller.ViewFactoryAdapter",
          "com.eteks.sweethome3d.viewcontroller.ViewFactory.createHelpView(..)",
          "com.eteks.sweethome3d.viewcontroller.ViewFactory.createHomeView(..)",
          "com.eteks.sweethome3d.viewcontroller.UserPreferencesController.homeController",
          "com.eteks.sweethome3d.viewcontroller.UserPreferencesController.UserPreferencesController(*,*,*,*)",
          "com.eteks.sweethome3d.viewcontroller.UserPreferencesController.checkUpdates()",
          "com.eteks.sweethome3d.viewcontroller.UserPreferencesController.mayImportLanguageLibrary()",
          "com.eteks.sweethome3d.viewcontroller.UserPreferencesController.importLanguageLibrary()");
    }

    // Ignore some Java elements with a programmatic adapter
    addAnnotationManager(new AnnotationManager() {
      @Override
      public Action manageAnnotation(Element element, String annotationType) {
        // Add the @Erased annotation upon some specific conditions
        if (JSweetConfig.ANNOTATION_ERASED.equals(annotationType)) {
          if (element.getKind() == ElementKind.ENUM && element.getSimpleName().toString().endsWith("Property")) {
            // All enums named *Property will be erased (because they will be
            // strings in the generated code)
            return Action.ADD;
          } else if (util().isDeprecated(element)) {
            // All deprecated elements will be erased
            return Action.ADD;
          } else if (element.getKind() == ElementKind.CONSTRUCTOR && ((QualifiedNameable) element.getEnclosingElement())
              .getQualifiedName().toString().equals("com.eteks.sweethome3d.model.CatalogPieceOfFurniture")) {
            // Only keep the private constructor of CatalogPieceOfFurniture and its 2 public constructors used 
            // to create pieces available in version 5.3 and 5.5 
            ExecutableElement c = (ExecutableElement) element;
            if (!element.getModifiers().contains(Modifier.PRIVATE)) {
              if (c.getParameters().size() != 16 && c.getParameters().size() != 26 && c.getParameters().size() != 28) {
                return Action.ADD;
              }
            }
            // Keep less constructors in CatalogLight and CatalogDoorOrWindow
          } else if (element.getKind() == ElementKind.CONSTRUCTOR && ((QualifiedNameable) element.getEnclosingElement())
              .getQualifiedName().toString().equals("com.eteks.sweethome3d.model.CatalogLight")) {
            // Only keep the public constructor of CatalogLight available in version 5.5 
            // (CatalogLight class didn't exist in SweetHome3DJS 1.2) 
            ExecutableElement c = (ExecutableElement) element;
            if (c.getParameters().size() != 29) {
              return Action.ADD;
            }
          } else if (element.getKind() == ElementKind.CONSTRUCTOR && ((QualifiedNameable) element.getEnclosingElement())
              .getQualifiedName().toString().equals("com.eteks.sweethome3d.model.CatalogDoorOrWindow")) {
            // Only keep the public constructor of CatalogDoorOrWindow used to create unmodifiable pieces
            // (CatalogDoorOrWindow class didn't exist in SweetHome3DJS 1.2) 
            ExecutableElement c = (ExecutableElement) element;
            if (c.getParameters().size() != 18 && c.getParameters().size() != 32) {
              return Action.ADD;
            }
          }
        }
        return Action.VOID;
      }

    });

    // Erase com.eteks.sweethome3d packages to keep all their elements at top level in JavaScript
    addAnnotation("@Root", "com.eteks.sweethome3d.model", "com.eteks.sweethome3d.io",
        "com.eteks.sweethome3d.viewcontroller", "com.eteks.sweethome3d.j3d");

    // Replace some Java implementations with some JavaScript-specific implementations
    
    // Ignore polyline thickness because BasicStroke#createStrokedShape isn't available
    addAnnotation(
        "@Replace('if (this.shapeCache == null) { this.shapeCache = this.getPolylinePath(); } return this.shapeCache; ')",
        "com.eteks.sweethome3d.model.Polyline.getShape()");
    // Manage content without contentContext
    addAnnotation(
        "@Replace('if (contentFile == null) { return null; } else if (contentFile.indexOf('://') >= 0) { return new URLContent(contentFile); } else { return new HomeURLContent('jar:' + this['homeUrl'] + '!/' + contentFile); }')",
        "com.eteks.sweethome3d.io.HomeXMLHandler.parseContent(java.lang.String,java.lang.String)");
    // Store home structure if set in the XML file
    addAnnotation(
        "@Replace('{{ body }}{{ baseIndent }}if(attributes['structure']) { home['structure'] = this.parseContent(attributes['structure'], null); }')",
        "com.eteks.sweethome3d.io.HomeXMLHandler.setHomeAttributes(..)");
    // WARNING: this constructor delegates to an erased constructor, so we need to replace its implementation
    addAnnotation(
        "@Replace('this.preferences = preferences; this.viewFactory = viewFactory; this.propertyChangeSupport = new PropertyChangeSupport(this); this.updateProperties();')",
        "com.eteks.sweethome3d.viewcontroller.UserPreferencesController.UserPreferencesController(*,*,*)");
    
    // Force some interface to be mapped as functional types when possible
    addAnnotation(FunctionalInterface.class, "com.eteks.sweethome3d.model.CollectionListener",
        "com.eteks.sweethome3d.model.LocationAndSizeChangeListener");
  }

  @Override
  public boolean substituteNewClass(NewClassElement newClass) {
    String className = newClass.getTypeAsElement().toString();
    // Handle generically all types that are locally mapped
    if (sh3dTypeMapping.containsKey(className)) {
      print("new ").print(sh3dTypeMapping.get(className)).print("(").printArgList(newClass.getArguments()).print(")");
      return true;
    }
    switch (className) {
      // This is a hack until we have actual locale support (just create JS Date objects)
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
      case "com.eteks.sweethome3d.io.DefaultUserPreferences":
        print("new UserPreferences()");
        return true;
    }
    return super.substituteNewClass(newClass);
  }

  @Override
  public boolean substituteMethodInvocation(MethodInvocationElement invocation) {
    if (invocation.getTargetExpression() != null) {
      Element targetType = invocation.getTargetExpression().getTypeAsElement();
      switch (targetType.toString()) {
        // Override invocations to LengthUnit so that it is not handled as a
        // complex enum and use the JS implementation instead
        case "com.eteks.sweethome3d.model.LengthUnit":
          print(invocation.getTargetExpression()).print(".").print(invocation.getMethodName()).print("(")
              .printArgList(invocation.getArguments()).print(")");
          return true;
        case "java.text.Collator":
          switch (invocation.getMethodName()) {
            case "setStrength":
              printMacroName(invocation.getMethodName());
              // Erase setStrength completely
              print(invocation.getTargetExpression());
              return true;
            }
          break;
        case "java.util.Arrays":
          switch (invocation.getMethodName()) {
            // WARNING: we assume that this method will be used to log arrays so we
            // just pass the array as is to the log function... this may fail if a
            // string is actually expected
            case "deepToString":
              printMacroName(invocation.getMethodName());
              print(invocation.getArgument(0));
              return true;
            }
          break;
        case "java.math.BigDecimal":
          // Support for Java big decimal (method are mapped to their Big.js equivalent)
          switch (invocation.getMethodName()) {
            case "multiply":
              printMacroName(invocation.getMethodName());
              print(invocation.getTargetExpression()).print(".times(").printArgList(invocation.getArguments()).print(")");
              return true;
            case "add":
              printMacroName(invocation.getMethodName());
              print(invocation.getTargetExpression()).print(".plus(").printArgList(invocation.getArguments()).print(")");
              return true;
            case "scale":
              printMacroName(invocation.getMethodName());
              // Always have a scale of 2 (we only have currencies, so 2 is a standard)
              print("2");
              return true;
            case "setScale":
              printMacroName(invocation.getMethodName());
              print(invocation.getTargetExpression()).print(".round(").print(invocation.getArguments().get(0)).print(")");
              return true;
            case "compareTo":
              printMacroName(invocation.getMethodName());
              print(invocation.getTargetExpression()).print(".cmp(").print(invocation.getArguments().get(0)).print(")");
              return true;
            case "equals":
              printMacroName(invocation.getMethodName());
              print(invocation.getTargetExpression()).print(".eq(").print(invocation.getArguments().get(0)).print(")");
              return true;
          }
          break;
        case "java.lang.Class":
          switch (invocation.getMethodName()) {
            case "getResource":
              printMacroName(invocation.getMethodName());
              print(invocation.getArgument(0));
              return true;
            }
            break;
      }

      // Map model Property enums to strings
      if (targetType.getKind() == ElementKind.ENUM && targetType.toString().endsWith("Property")) {
        switch (invocation.getMethodName()) {
          case "name":
            printMacroName(invocation.getMethodName());
            print(invocation.getTargetExpression());
            return true;
          case "valueOf":
            printMacroName(invocation.getMethodName());
            print(invocation.getArgument(0));
            return true;
          case "equals":
            printMacroName(invocation.getMethodName());
            print("(").print(invocation.getTargetExpression()).print(" == ").print(invocation.getArguments().get(0)).print(")");
            return true;
          }
      }
      // Special case for the AspectRatio enum
      if (targetType.toString().endsWith(".AspectRatio") && invocation.getMethodName().equals("getValue")) {
        print(
            "{FREE_RATIO:null,VIEW_3D_RATIO:null,RATIO_4_3:4/3,RATIO_3_2:1.5,RATIO_16_9:16/9,RATIO_2_1:2/1,SQUARE_RATIO:1}[")
                .print(invocation.getTargetExpression()).print("]");
        return true;
      }
    }
    
    // Provide a partial default simple JavaScript implementation for String.format 
    if (invocation.getMethodName().equals("format")
        && String.class.getName().equals(invocation.getTargetExpression().getTypeAsElement().toString())) {
      print(
          "((s, r) => { let result = s; result = s.replace(/%s/g, r); result = s.replace(/%d/g, r); result = s.replace(/%%/, '%'); return result; })(")
              .print(invocation.getArgument(0)).print(",''+").print(invocation.getArgument(1)).print(")");
      return true;
    }

    boolean substituted = super.substituteMethodInvocation(invocation);
    if (!substituted) {
      // support for equals in case not supported by existing adapters
      if (invocation.getMethodName().equals("equals")) {
        print("((o:any, o2) => { return o.equals?o.equals(o2):o===o2 })(").print(invocation.getTargetExpression())
            .print(",").print(invocation.getArguments().get(0)).print(")");
        return true;
      }
    }
    return substituted;
  }

  @Override
  public boolean substituteVariableAccess(VariableAccessElement variableAccess) {
    switch (variableAccess.getTargetElement().toString()) {
      case "java.text.Collator":
        switch (variableAccess.getVariableName()) {
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
        break;
    }
    // Map *Property enums to strings
    if (variableAccess.getTargetElement().getKind() == ElementKind.ENUM
        && variableAccess.getTargetElement().toString().endsWith("Property")) {
      print("\"" + variableAccess.getVariableName() + "\"");
      return true;
    }
    return super.substituteVariableAccess(variableAccess);
  }

  @Override
  public boolean substituteIdentifier(IdentifierElement identifier) {
    // Map *Property enums to strings
    if (identifier.getTypeAsElement().getKind() == ElementKind.ENUM && identifier.isConstant()
        && identifier.getTypeAsElement().getSimpleName().toString().endsWith("Property")) {
      print("\"" + identifier + "\"");
      return true;
    }
    return super.substituteIdentifier(identifier);
  }

  @Override
  public boolean substituteCaseStatementPattern(CaseElement caseStatement, ExtendedElement pattern) {
    // Map *Property enums to strings
    if (pattern.getTypeAsElement().getKind() == ElementKind.ENUM
        && pattern.getTypeAsElement().getSimpleName().toString().endsWith("Property")) {
      print("\"" + pattern + "\"");
      return true;
    }
    return super.substituteCaseStatementPattern(caseStatement, pattern);
  }

  @Override
  public String adaptDocComment(Element element, String commentText) {
    String comment = super.adaptDocComment(element, commentText);
    if (comment == null) {
      return comment;
    }
    String[] lines = comment.split("\n");
    StringBuffer newComment = new StringBuffer();
    for (String line : lines) {
      if (!line.contains("@since")) {
        newComment.append(line);
        newComment.append("\n");
      }
    }
    newComment.deleteCharAt(newComment.length() - 1);
    if (element instanceof TypeElement) {
      TypeElement type = (TypeElement) element;
      if (types().isSubtype(type.asType(), util().getType(Throwable.class))) {
        newComment.append("\n");
        newComment.append("@ignore");
      }
    }

    return newComment.toString().replace("{*}", "{Object}");
  }

  @Override
  public boolean eraseSuperClass(TypeElement type, TypeElement superClass) {
    String name = superClass.getQualifiedName().toString();
    if (EventObject.class.getName().equals(name)) {
      return false;
    }
    return super.eraseSuperClass(type, superClass);
  }
}
