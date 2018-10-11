/*
 * Core.java
 *
 * Copyright (c) 2015 Emmanuel PUYBARET / eTeks <info@eteks.com>
 * 
 * Copyright (c) 1997, 2013, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the LICENSE file that accompanied OpenJDK 8 source code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
package def.sweethome3d;

import java.util.List;

import def.js.Error;

// Bridges to JavaScript classes implemented in src/core.js  

/**
 * A bridge to the JavaScript implementation of IllegalArgumentException.
 * @author Renaud Pawlak
 */
@SuppressWarnings("serial")
class IllegalArgumentException extends Error {
  public IllegalArgumentException(String message) {
  }
}

/**
 * A bridge to the JavaScript implementation of NullPointerException.
 * @author Renaud Pawlak
 */
@SuppressWarnings("serial")
class NullPointerException extends Error {
  public NullPointerException(String message) {
  }
}

/**
 * A bridge to the JavaScript implementation of IllegalStateException.
 * @author Renaud Pawlak
 */
@SuppressWarnings("serial")
class IllegalStateException extends Error {
  public IllegalStateException(String message) {
  }
}

/**
 * A bridge to the JavaScript implementation of UnsupportedOperationException.
 * @author Renaud Pawlak
 */
@SuppressWarnings("serial")
class UnsupportedOperationException extends Error {
  public UnsupportedOperationException() {
  }
  
  public UnsupportedOperationException(String message) {
  }
}

/**
 * A bridge to the JavaScript implementation of InternalError.
 * @author Renaud Pawlak
 */
@SuppressWarnings("serial")
class InternalError extends Error {
  public InternalError(String message) {
  }
}

/**
 * A bridge to the JavaScript implementation of NoSuchElementException.
 * @author Renaud Pawlak
 */
@SuppressWarnings("serial")
class NoSuchElementException extends Error {

  public NoSuchElementException(String message) {
  }
}

/**
 * A bridge to the JavaScript implementation of EventObject.
 * @author Renaud Pawlak
 */
class EventObject {
  public EventObject(Object source) {
  }
  
  public native Object getSource();
}

/**
 * A bridge to the JavaScript implementation of PropertyChangeEvent.
 * @author Renaud Pawlak
 */
class PropertyChangeEvent extends EventObject {
  public PropertyChangeEvent(Object source, String propertyName, Object oldValue, Object newValue) {
    super(source);
  }
  
  public native Object getSource();
  
  public native Object getNewValue();
  
  public native Object getOldValue();
  
  public native String getPropertyName();

}

interface PropertyChangeListener {
  void propertyChange(PropertyChangeEvent event);
}

/**
 * A bridge to the JavaScript implementation of PropertyChangeSupport.
 * @author Renaud Pawlak
 */
class PropertyChangeSupport {
  public PropertyChangeSupport(Object source) {
  }

  public native void addPropertyChangeListener(PropertyChangeListener listener);

  public native void addPropertyChangeListener(String propertyName, PropertyChangeListener listener);

  public native void removePropertyChangeListener(PropertyChangeListener listener);

  public native void removePropertyChangeListener(String propertyName, PropertyChangeListener listener);

  public native List<PropertyChangeListener> getPropertyChangeListeners(String propertyName);

  public native void firePropertyChange(String propertyName, Object oldValue, Object newValue);
}
