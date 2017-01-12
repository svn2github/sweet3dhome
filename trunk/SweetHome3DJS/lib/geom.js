/*
 * geom.js
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

// Classes of java.awt.geom package of OpenJDK 8 translated to Javascript

// Requires core.js

/**
 * Creates an NoninvertibleTransformException instance.
 * Adapted from java.awt.geom.NoninvertibleTransformException
 * @constructor
 */
function NoninvertibleTransformException(message) {
  this.message = message;
}


/**
 * Creates an NoninvertibleTransformException instance.
 * Adapted from java.awt.geom.IllegalPathStateException
 * @constructor
 */
function IllegalPathStateException(message) {
  this.message = message;
}


/**
 * Super class of path iterators.
 * @constructor
 */
function PathIterator() {
}

PathIterator.WIND_EVEN_ODD = 0;
PathIterator.WIND_NON_ZERO = 1;

PathIterator.SEG_MOVETO    = 0;
PathIterator.SEG_LINETO    = 1;
PathIterator.SEG_QUADTO    = 2;
PathIterator.SEG_CUBICTO   = 3;
PathIterator.SEG_CLOSE     = 4;


/**
 * Constructs and initializes a <code>Point2D</code> with the specified coordinates.
 * Adapted from java.awt.geom.Point2D
 * @constructor
 */
function Point2D(x, y) {
  this.x = x !== undefined ? x : 0;
  this.y = y !== undefined ? y : 0;
}

Point2D.prototype.getX = function() {
  return this.x;
}

Point2D.prototype.getY = function() {
  return this.y;
}

Point2D.prototype.setLocation = function(x, y) {
  if (y === undefined) {
    var p = x;
    this.setLocation(p.getX(), p.getY());
  } else {
    this.x = x;
    this.y = y;
  }
}

Point2D.distanceSq = function(x1, y1, x2, y2) {
  x1 -= x2;
  y1 -= y2;
  return (x1 * x1 + y1 * y1);
}

Point2D.distance = function(x1, y1, x2, y2) {
  x1 -= x2;
  y1 -= y2;
  return Math.sqrt(x1 * x1 + y1 * y1);
}

Point2D.prototype.distanceSq = function(px, py) {
  if (py === undefined) {
    var pt = px;
    this.distanceSq(pt.getX(), pt.getY());
  } else {
    px -= this.getX();
    py -= this.getY();
    return (px * px + py * py);
  }
}

Point2D.prototype.distance = function(px, py) {
  if (py === undefined) {
    var pt = px;
    this.distance(pt.getX(), pt.getY());
  } else {
    x -= this.getX();
    py -= this.getY();
    return Math.sqrt(px * px + py * py);
  }
}

Point2D.prototype.clone = function() {
  return new Point2D(this.x, this.y);
}

Point2D.prototype.equals = function(obj) {
  if (obj instanceof Point2D) {
    return (this.getX() === obj.getX()) && (this.getY() === obj.getY());
  }
  return false;
}


/**
 * Constructs and initializes a line.
 * Adapted from java.awt.geom.Line2D
 * @constructor
 */
function Line2D(x1, y1, x2, y2) {
  if (x1 === undefined) {
    // No parameter
    this.setLine(0., 0., 0., 0.);    
  } else if (x2 === undefined) {
    // 2 parameters
    var p1 = x1;
    var p2 = x2;
    this.setLine(p1, p2);
  } else {
    this.setLine(x1, y1, x2, y2);
  }
}

Line2D.prototype.getX1 = function() {
  return this.x1;
}

Line2D.prototype.getY1 = function() {
  return this.y1;
}

Line2D.prototype.getP1 = function() {
  return new Point2D.Float(x1, y1);
}

Line2D.prototype.getX2 = function() {
  return this.x2;
}

Line2D.prototype.getY2 = function() {
  return this.y2;
}

Line2D.prototype.getP2 = function() {
  return new Point2D.Float(x2, y2);
}

Line2D.prototype.setLine = function(x1, y1, x2, y2) {
  if (y1 === undefined) {
    // 1 parameter
    var l = x1;
    this.setLine(l.getX1(), l.getY1(), l.getX2(), l.getY2());
  } else if (x2 === undefined) {
    // 2 parameters
    var p1 = x1;
    var p2 = y1;
    this.setLine(p1.getX(), p1.getY(), p2.getX(), p2.getY());
  }
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
}

Line2D.prototype.getBounds2D = function() {
  var x, y, w, h;
  if (this.x1 < this.x2) {
    x = this.x1;
    w = this.x2 - this.x1;
  } else {
    x = this.x2;
    w = this.x1 - this.x2;
  }
  if (this.y1 < this.y2) {
    y = this.y1;
    h = this.y2 - this.y1;
  } else {
    y = this.y2;
    h = this.y1 - this.y2;
  }
  return new Rectangle2D(x, y, w, h);
}

Line2D.relativeCCW = function(x1, y1, x2, y2, px, py) {
  x2 -= x1;
  y2 -= y1;
  px -= x1;
  py -= y1;
  var ccw = px * y2 - py * x2;
  if (ccw === 0.0) {
    ccw = px * x2 + py * y2;
    if (ccw > 0.0) {
      px -= x2;
      py -= y2;
      ccw = px * x2 + py * y2;
      if (ccw < 0.0) {
        ccw = 0.0;
      }
    }
  }
  return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0);
}

Line2D.prototype.relativeCCW = function(px, py) {
  if (py === undefined) {
    var p = px;
    return Line2D.relativeCCW(this.getX1(), this.getY1(), this.getX2(), this.getY2(),
        p.getX(), p.getY());
  } else {
    return Line2D.relativeCCW(this.getX1(), this.getY1(), this.getX2(), this.getY2(), px, py);
  }
}

Line2D.linesIntersect = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  return ((Line2D.relativeCCW(x1, y1, x2, y2, x3, y3) *
           Line2D.relativeCCW(x1, y1, x2, y2, x4, y4) <= 0)
          && (Line2D.relativeCCW(x3, y3, x4, y4, x1, y1) *
              Line2D.relativeCCW(x3, y3, x4, y4, x2, y2) <= 0));
}

Line2D.prototype.intersectsLine = function(x1, y1, x2, y2) {
  if (y1 === undefined) {
    var l = x1;
    return Line2D.linesIntersect(l.getX1(), l.getY1(), l.getX2(), l.getY2(),
        this.getX1(), this.getY1(), this.getX2(), this.getY2());
  } else {
    return Line2D.linesIntersect(x1, y1, x2, y2,
        this.getX1(), this.getY1(), this.getX2(), this.getY2());
  }
}

Line2D.ptSegDistSq = function(x1, y1, x2, y2, px, py) {
  x2 -= x1;
  y2 -= y1;
  px -= x1;
  py -= y1;
  var dotprod = px * x2 + py * y2;
  var projlenSq;
  if (dotprod <= 0.0) {
    projlenSq = 0.0;
  } else {
    px = x2 - px;
    py = y2 - py;
    dotprod = px * x2 + py * y2;
    if (dotprod <= 0.0) {
      projlenSq = 0.0;
    } else {
      projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
    }
  }
  var lenSq = px * px + py * py - projlenSq;
  if (lenSq < 0) {
    lenSq = 0;
  }
  return lenSq;
}

Line2D.ptSegDist = function(x1, y1, x2, y2, px, py) {
  return Math.sqrt(Line2D.ptSegDistSq(x1, y1, x2, y2, px, py));
}

Line2D.prototype.ptSegDistSq = function(px, py) {
  if (py === undefined) {
    var pt = px;
    return Line2D.ptSegDistSq(this.getX1(), this.getY1(), this.getX2(), this.getY2(),
                              pt.getX(), pt.getY());
  } else {
    return Line2D.ptSegDistSq(this.getX1(), this.getY1(), this.getX2(), this.getY2(), px, py);
  }
}

Line2D.prototype.ptSegDist = function(px, py) {
  if (py === undefined) {
    var pt = px;
    return Line2D.ptSegDist(this.getX1(), this.getY1(), this.getX2(), this.getY2(),
                            pt.getX(), pt.getY());
  } else {
    return Line2D.ptSegDist(this.getX1(), this.getY1(), this.getX2(), this.getY2(), px, py);
  }
}

Line2D.ptLineDistSq = function(x1, y1, x2, y2, px, py) {
  x2 -= x1;
  y2 -= y1;
  px -= x1;
  py -= y1;
  var dotprod = px * x2 + py * y2;
  var projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
  var lenSq = px * px + py * py - projlenSq;
  if (lenSq < 0) {
    lenSq = 0;
  }
  return lenSq;
}

Line2D.ptLineDist = function(x1, y1, x2, y2, px, py) {
  return Math.sqrt(Line2D.ptLineDistSq(x1, y1, x2, y2, px, py));
}

Line2D.prototype.ptLineDistSq = function(px, py) {
  if (py === undefined) {
    var pt = px;
    return Line2D.ptLineDistSq(this.getX1(), this.getY1(), this.getX2(), this.getY2(),
        pt.getX(), pt.getY());
  } else {
    return Line2D.ptLineDistSq(this.getX1(), this.getY1(), this.getX2(), this.getY2(), px, py);
  }
}

Line2D.prototype.ptLineDist = function(px, py) {
  if (py === undefined) {
    var pt = px;
    return Line2D.ptLineDist(this.getX1(), this.getY1(), this.getX2(), this.getY2(), 
        pt.getX(), pt.getY());
  } else {
    return Line2D.ptLineDist(this.getX1(), this.getY1(), this.getX2(), this.getY2(), px, py);
  }
}

Line2D.prototype.intersects = function(x, y, w, h) {
  if (y === undefined) {
    var r = x;
    return r.intersectsLine(this.getX1(), this.getY1(), this.getX2(), this.getY2());
  } else {
    return this.intersects(new Rectangle2D(x, y, w, h));
  }
}

Line2D.prototype.contains = function(x, y, w, h) {
  return false;
}

Line2D.prototype.getPathIterator = function(at, flatness) {
  return new LineIterator(this, at);
}

Line2D.prototype.clone = function() {
  return new Line2D(this.getX1(), this.getY1(), this.getX2(), this.getY2());
}


/**
 * Creates an iterator able to iterate over the path segments of a line segment.
 * Adapted from java.awt.geomLineIterator
 * @constructor
 * @extends PathIterator
 * @package
 */
function LineIterator(l, at) {
  this.line = l;
  this.affine = at;
  this.index = 0;
}
LineIterator.prototype = Object.create(PathIterator.prototype);
LineIterator.prototype.constructor = LineIterator;

LineIterator.prototype.getWindingRule = function() {
  return PathIterator.WIND_NON_ZERO;
}

LineIterator.prototype.isDone = function() {
  return (this.index > 1);
}

LineIterator.prototype.next = function() {
  this.index++;
}

LineIterator.prototype.currentSegment = function(coords) {
  if (this.isDone()) {
    throw new NoSuchElementException("line iterator out of bounds");
  }
  var type;
  if (this.index === 0) {
    coords[0] = this.line.getX1();
    coords[1] = this.line.getY1();
    type = PathIterator.SEG_MOVETO;
  } else {
    coords[0] = this.line.getX2();
    coords[1] = this.line.getY2();
    type = PathIterator.SEG_LINETO;
  }
  if (this.affine !== null) {
    this.affine.transform(coords, 0, coords, 0, 1);
  }
  return type;
}


/**
 * Constructs and initializes a <code>Rectangle2D</code> from the optional coordinates.
 * Adapted from java.awt.geom.Rectangle2D
 * @constructor
 */
function Rectangle2D(x, y, w, h) {
  this.setRect(x !== undefined ? x : 0, 
      y !== undefined ? y : 0, 
      w !== undefined ? w : 0, 
      h !== undefined ? h : 0);
}

Rectangle2D.OUT_LEFT = 1;
Rectangle2D.OUT_TOP = 2;
Rectangle2D.OUT_RIGHT = 4;
Rectangle2D.OUT_BOTTOM = 8;

Rectangle2D.prototype.getX = function() {
  return this.x;
}

Rectangle2D.prototype.getY = function() {
  return this.y;
}

Rectangle2D.prototype.getWidth = function() {
  return this.width;
}

Rectangle2D.prototype.getHeight = function() {
  return this.height;
}

Rectangle2D.prototype.getMinX = function() {
  return this.getX();
}

Rectangle2D.prototype.getMinY = function() {
  return this.getY();
}

Rectangle2D.prototype.getMaxX = function() {
  return this.getX() + this.getWidth();
}

Rectangle2D.prototype.getMaxY = function() {
  return this.getY() + this.getHeight();
}

Rectangle2D.prototype.getCenterX = function() {
  return this.getX() + this.getWidth() / 2.0;
}

Rectangle2D.prototype.getCenterY = function() {
  return this.getY() + this.getHeight() / 2.0;
}

Rectangle2D.prototype.isEmpty = function() {
  return (this.width <= 0.) || (this.height <= 0.);
}

Rectangle2D.prototype.setRect = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
}

Rectangle2D.prototype.outcode = function(x, y) {
  var out = 0;
  if (this.width <= 0) {
    out |= Rectangle2D.OUT_LEFT | Rectangle2D.OUT_RIGHT;
  } else if (x < this.x) {
    out |= Rectangle2D.OUT_LEFT;
  } else if (x > this.x + this.width) {
    out |= Rectangle2D.OUT_RIGHT;
  }
  if (this.height <= 0) {
    out |= Rectangle2D.OUT_TOP | Rectangle2D.OUT_BOTTOM;
  } else if (y < this.y) {
    out |= Rectangle2D.OUT_TOP;
  } else if (y > this.y + this.height) {
    out |= Rectangle2D.OUT_BOTTOM;
  }
  return out;
}

Rectangle2D.prototype.getBounds2D = function() {
    return new Rectangle2D(this.x, this.y, this.width, this.height);
}

Rectangle2D.prototype.createIntersection = function(r) {
  var dest = new Rectangle2D();
  Rectangle2D.intersect(this, r, dest);
  return dest;
}

Rectangle2D.prototype.createUnion = function(r) {
  var dest = Rectangle2D();
  Rectangle2D.union(this, r, dest);
  return dest;
}

Rectangle2D.prototype.intersectsLine = function(x1, y1, x2, y2) {
  var out1, out2;
  if ((out2 = this.outcode(x2, y2)) === 0) {
      return true;
  }
  while ((out1 = this.outcode(x1, y1)) !== 0) {
    if ((out1 & out2) !== 0) {
      return false;
    }
    if ((out1 & (Rectangle2D.OUT_LEFT | Rectangle2D.OUT_RIGHT)) !== 0) {
      var x = this.getX();
      if ((out1 & Rectangle2D.OUT_RIGHT) !== 0) {
        x += this.getWidth();
      }
      y1 = y1 + (x - x1) * (y2 - y1) / (x2 - x1);
      x1 = x;
    } else {
      var y = this.getY();
      if ((out1 & Rectangle2D.OUT_BOTTOM) !== 0) {
        y += this.getHeight();
      }
      x1 = x1 + (y - y1) * (x2 - x1) / (y2 - y1);
      y1 = y;
    }
  }
  return true;
}

Rectangle2D.prototype.setFrame = function(x, y, w, h) {
  this.setRect(x, y, w, h);
}

Rectangle2D.prototype.intersects = function(x, y, w, h) {
  if (this.isEmpty() || w <= 0 || h <= 0) {
    return false;
  }
  var x0 = this.getX();
  var y0 = this.getY();
  return (x + w > x0 &&
      y + h > y0 &&
      x < x0 + this.getWidth() &&
      y < y0 + this.getHeight());
}

Rectangle2D.prototype.contains = function(x, y, w, h) {
  if (w === undefined) {
    // 2 parameters
    var x0 = this.getX();
    var y0 = this.getY();
    return (x >= x0 &&
        y >= y0 &&
        x < x0 + this.getWidth() &&
        y < y0 + this.getHeight());
  } else {
    if (this.isEmpty() || w <= 0 || h <= 0) {
        return false;
    }
    var x0 = this.getX();
    var y0 = this.getY();
    return (x >= x0 &&
        y >= y0 &&
        (x + w) <= x0 + this.getWidth() &&
        (y + h) <= y0 + this.getHeight());
  }
}

Rectangle2D.intersect = function(src1, src2, dest) {
  var x1 = Math.max(src1.getMinX(), src2.getMinX());
  var y1 = Math.max(src1.getMinY(), src2.getMinY());
  var x2 = Math.min(src1.getMaxX(), src2.getMaxX());
  var y2 = Math.min(src1.getMaxY(), src2.getMaxY());
  dest.setFrame(x1, y1, x2-x1, y2-y1);
}
    
Rectangle2D.union = function(src1, src2, dest) {
  var x1 = Math.min(src1.getMinX(), src2.getMinX());
  var y1 = Math.min(src1.getMinY(), src2.getMinY());
  var x2 = Math.max(src1.getMaxX(), src2.getMaxX());
  var y2 = Math.max(src1.getMaxY(), src2.getMaxY());
  dest.setFrameFromDiagonal(x1, y1, x2, y2);
}
    
Rectangle2D.prototype.add = function(newx, newy) {
  var x1, x2, y1, y2;
  if (newy === undefined) {
    if (newx instanceof Rectangle2D) {
      var r = newx;
      x1 = Math.min(this.getMinX(), r.getMinX());
      x2 = Math.max(this.getMaxX(), r.getMaxX());
      y1 = Math.min(this.getMinY(), r.getMinY());
      y2 = Math.max(this.getMaxY(), r.getMaxY());
    } else {
      var pt = newX;
      this.add(pt.getX(), pt.getY());
      return;
    }
  } else {
    x1 = Math.min(this.getMinX(), newx);
    x2 = Math.max(this.getMaxX(), newx);
    y1 = Math.min(this.getMinY(), newy);
    y2 = Math.max(this.getMaxY(), newy);
  } 
  this.setRect(x1, y1, x2 - x1, y2 - y1);
}

Rectangle2D.prototype.getPathIterator = function(at, flatness) {
  return new RectIterator(this, at);
}

Rectangle2D.prototype.equals = function(obj) {
  if (obj === this) {
    return true;
  }
  if (obj instanceof Rectangle2D) {
    return ((this.getX() === obj.getX()) &&
        (this.getY() === obj.getY()) &&
        (this.getWidth() === obj.getWidth()) &&
        (this.getHeight() === obj.getHeight()));
  }
  return false;
}


/**
 * A utility class to iterate over the path segments of a rectangle
 * through the PathIterator interface.
 * Adapted from java.awt.geom.RectIterator
 * @constructor
 * @extends PathIterator
 * @package
 */
function RectIterator(r, at) {
  this.x = r.getX();
  this.y = r.getY();
  this.w = r.getWidth();
  this.h = r.getHeight();
  this.affine = at;
  if (this.w < 0 || this.h < 0) {
    this.index = 6;
  } else {
    this.index = 0;
  }
}
RectIterator.prototype = Object.create(PathIterator.prototype);
RectIterator.prototype.constructor = RectIterator;

RectIterator.prototype.getWindingRule = function() {
  return PathIterator.WIND_NON_ZERO;
}

RectIterator.prototype.isDone = function() {
  return this.index > 5;
}

RectIterator.prototype.next = function() {
  this.index++;
}

RectIterator.prototype.currentSegment = function(coords) {
  if (this.isDone()) {
    throw new NoSuchElementException("rect iterator out of bounds");
  }
  if (this.index === 5) {
    return PathIterator.SEG_CLOSE;
  }
  coords[0] = this.x;
  coords[1] = this.y;
  if (this.index === 1 || this.index === 2) {
    coords[0] += this.w;
  }
  if (this.index === 2 || this.index === 3) {
    coords[1] += this.h;
  }
  if (this.affine !== null) {
    this.affine.transform(coords, 0, coords, 0, 1);
  }
  return (this.index === 0 ? PathIterator.SEG_MOVETO : PathIterator.SEG_LINETO);
}


/**
 * Constructs and initializes a <code>Ellipse2D</code> from the optional coordinates.
 * Adapted from java.awt.geom.Ellipse2D
 * @constructor
 */
function Ellipse2D(x, y, w, h) {
  this.setFrame(x !== undefined ? x : 0, 
      y !== undefined ? y : 0, 
      w !== undefined ? w : 0, 
      h !== undefined ? h : 0);
}

Ellipse2D.prototype.getX = function() {
  return this.x;
}

Ellipse2D.prototype.getY = function() {
  return this.y;
}

Ellipse2D.prototype.getWidth = function() {
  return this.width;
}

Ellipse2D.prototype.getHeight = function() {
  return this.height;
}

Ellipse2D.prototype.isEmpty = function() {
  return (this.width <= 0.0 || this.height <= 0.0);
}

Ellipse2D.prototype.setFrame = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
}

Ellipse2D.prototype.getBounds2D = function() {
  return new Rectangle2D(this.x, this.y, this.width, this.height);
}

Ellipse2D.prototype.intersects = function(x, y, w, h) {
  if (w <= 0.0 || h <= 0.0) {
    return false;
  }
  var ellw = this.getWidth();
  if (ellw <= 0.0) {
    return false;
  }
  var normx0 = (x - this.getX()) / ellw - 0.5;
  var normx1 = normx0 + w / ellw;
  var ellh = this.getHeight();
  if (ellh <= 0.0) {
    return false;
  }
  var normy0 = (y - this.getY()) / ellh - 0.5;
  var normy1 = normy0 + h / ellh;
  var nearx, neary;
  if (normx0 > 0.0) {
    nearx = normx0;
  } else if (normx1 < 0.0) {
    nearx = normx1;
  } else {
    nearx = 0.0;
  }
  if (normy0 > 0.0) {
    neary = normy0;
  } else if (normy1 < 0.0) {
    neary = normy1;
  } else {
    neary = 0.0;
  }
  return (nearx * nearx + neary * neary) < 0.25;
}

Ellipse2D.prototype.contains = function(x, y, w, h) {
  if (w === undefined) {
    // 2 parameters
    var ellw = this.getWidth();
    if (ellw <= 0.0) {
      return false;
    }
    var normx = (x - this.getX()) / ellw - 0.5;
    var ellh = this.getHeight();
    if (ellh <= 0.0) {
      return false;
    }
    var normy = (y - this.getY()) / ellh - 0.5;
    return (normx * normx + normy * normy) < 0.25;
    
  } else {
    return (this.contains(x, y) &&
            this.contains(x + w, y) &&
            this.contains(x, y + h) &&
            this.contains(x + w, y + h));
  }
}

Ellipse2D.prototype.getPathIterator = function(at) {
  return new EllipseIterator(this, at);
}

Ellipse2D.prototype.equals = function(obj) {
  if (obj === this) {
    return true;
  }
  if (obj instanceof Ellipse2D) {
    var e2d = obj;
    return ((this.getX() === e2d.getX()) &&
            (this.getY() === e2d.getY()) &&
            (this.getWidth() === e2d.getWidth()) &&
            (this.getHeight() === e2d.getHeight()));
  }
  return false;
}


/**
 * A utility class to iterate over an ellipse through the PathIterator interface.
 * Adapted from java.awt.geom.EllipseIterator
 * @constructor
 * @package
 */
function EllipseIterator(e, at) {
  this.x = e.getX();
  this.y = e.getY();
  this.w = e.getWidth();
  this.h = e.getHeight();
  this.affine = at;
  if (w < 0 || h < 0) {
      this.index = 6;
  } else {
    this.index = 0;
  }
}
EllipseIterator.prototype = Object.create(PathIterator.prototype);
EllipseIterator.prototype.constructor = EllipseIterator;

EllipseIterator.CtrlVal = 0.5522847498307933;
EllipseIterator.pcv = 0.5 + EllipseIterator.CtrlVal * 0.5;
EllipseIterator.ncv = 0.5 - EllipseIterator.CtrlVal * 0.5;
EllipseIterator.ctrlpts = [
  [                1.0,  EllipseIterator.pcv,  EllipseIterator.pcv,                  1.0,  0.5,  1.0 ],
  [EllipseIterator.ncv,                  1.0,                  0.0,  EllipseIterator.pcv,  0.0,  0.5 ],
  [                0.0,  EllipseIterator.ncv,  EllipseIterator.ncv,                  0.0,  0.5,  0.0 ],
  [EllipseIterator.pcv,                  0.0,                  1.0,  EllipseIterator.ncv,  1.0,  0.5 ]
];

EllipseIterator.prototype.getWindingRule = function() {
  return PathIterator.WIND_NON_ZERO;
}

EllipseIterator.prototype.isDone = function() {
  return this.index > 5;
}

EllipseIterator.prototype.next = function() {
  this.index++;
}

EllipseIterator.prototype.currentSegment = function(coords) {
  if (this.isDone()) {
    throw new NoSuchElementException("ellipse iterator out of bounds");
  }
  if (this.index == 5) {
    return PathIterator.SEG_CLOSE;
  }
  if (this.index == 0) {
    var ctrls = EllipseIterator.ctrlpts[3];
    coords[0] = this.x + ctrls[4] * this.w;
    coords[1] = this.y + ctrls[5] * this.h;
    if (this.affine != null) {
      this.affine.transform(coords, 0, coords, 0, 1);
    }
    return PathIterator.SEG_MOVETO;
  }
  var ctrls = EllipseIterator.ctrlpts[index - 1];
  coords[0] = this.x + ctrls[0] * this.w;
  coords[1] = this.y + ctrls[1] * this.h;
  coords[2] = this.x + ctrls[2] * this.w;
  coords[3] = this.y + ctrls[3] * this.h;
  coords[4] = this.x + ctrls[4] * this.w;
  coords[5] = this.y + ctrls[5] * this.h;
  if (this.affine != null) {
    this.affine.transform(coords, 0, coords, 0, 3);
  }
  return PathIterator.SEG_CUBICTO;
}


/**
 * Creates an AffineTransform instance.
 * Adapted from java.awt.geom.AffineTransform
 * @constructor
 */
function AffineTransform(m00, m10, m01, m11, m02, m12, state) {
  if (m00 === undefined) {
    // No parameter
    // Identity transformation
    this.m00 = 1.;
    this.m10 = 0;
    this.m01 = 0;
    this.m11 = 1.;
    this.m02 = 0;
    this.m12 = 0;
    this.state = AffineTransform.APPLY_IDENTITY;
    this.type = AffineTransform.TYPE_IDENTITY;
  } else if (m00 instanceof AffineTransform) {
    // 1 parameter
    var transformation = m00;
    this.m00 = transformation.m00;
    this.m10 = transformation.m10;
    this.m01 = transformation.m01;
    this.m11 = transformation.m11;
    this.m02 = transformation.m02;
    this.m12 = transformation.m12;
    this.state = transformation.state;
    this.type = transformation.type;
  } else if (state === undefined) {
    // 6 parameters
    this.m00 = m00;
    this.m10 = m10;
    this.m01 = m01;
    this.m11 = m11;
    this.m02 = m02;
    this.m12 = m12;
    this.updateState();
  } else {
    this.m00 = m00;
    this.m10 = m10;
    this.m01 = m01;
    this.m11 = m11;
    this.m02 = m02;
    this.m12 = m12;
    this.state = state;
    this.type = AffineTransform.TYPE_UNKNOWN;
  }
}

AffineTransform.TYPE_UNKNOWN = -1;
AffineTransform.TYPE_IDENTITY = 0;
AffineTransform.TYPE_TRANSLATION = 1;
AffineTransform.TYPE_UNIFORM_SCALE = 2;
AffineTransform.TYPE_GENERAL_SCALE = 4;
AffineTransform.TYPE_MASK_SCALE = (AffineTransform.TYPE_UNIFORM_SCALE | AffineTransform.TYPE_GENERAL_SCALE);
AffineTransform.TYPE_FLIP = 64;
AffineTransform.TYPE_QUADRANT_ROTATION = 8;
AffineTransform.TYPE_GENERAL_ROTATION = 16;
AffineTransform.TYPE_MASK_ROTATION = (AffineTransform.TYPE_QUADRANT_ROTATION | AffineTransform.TYPE_GENERAL_ROTATION);
AffineTransform.TYPE_GENERAL_TRANSFORM = 32;
AffineTransform.APPLY_IDENTITY = 0;
AffineTransform.APPLY_TRANSLATE = 1;
AffineTransform.APPLY_SCALE = 2;
AffineTransform.APPLY_SHEAR = 4;
AffineTransform.HI_SHIFT = 3;
AffineTransform.HI_IDENTITY = AffineTransform.APPLY_IDENTITY << AffineTransform.HI_SHIFT;
AffineTransform.HI_TRANSLATE = AffineTransform.APPLY_TRANSLATE << AffineTransform.HI_SHIFT;
AffineTransform.HI_SCALE = AffineTransform.APPLY_SCALE << AffineTransform.HI_SHIFT;
AffineTransform.HI_SHEAR = AffineTransform.APPLY_SHEAR << AffineTransform.HI_SHIFT;

AffineTransform.rot90conversion = [
     AffineTransform.APPLY_SHEAR, AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE,
     AffineTransform.APPLY_SHEAR, AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE,
     AffineTransform.APPLY_SCALE, AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE,
     AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE,
     AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE,
 ];

AffineTransform.getTranslateInstance = function(tx, ty) {
  var transformation = new AffineTransform();
  transformation.setToTranslation(tx, ty);
  return transformation;
}

AffineTransform.getRotateInstance = function(vecx, vecy, anchorx, anchory) {
  var transformation = new AffineTransform();
  if (vecy === undefined) {
    // 1 parameter
    var theta = vecx;
    transformation.setToRotation(theta);
  } else if (anchorx === undefined) {
    // 2 parameters
    transformation.setToRotation(vecx, vecy);
  } else if (anchory === undefined) {
    // 3 parameters
    var theta = vecx;
    anchory = anchorx; 
    anchorx = vecy;
    transformation.setToRotation(theta, anchorx, anchory);
  } else {
    transformation.setToRotation(vecx, vecy, anchorx, anchory);
  }
  return transformation;
}

AffineTransform.getQuadrantRotateInstance = function(numquadrants, anchorx, anchory)
{
  var transformation = new AffineTransform();
  if (anchorx === undefined) {
    transformation.setToQuadrantRotation(numquadrants);
  } else {
    transformation.setToQuadrantRotation(numquadrants, anchorx, anchory);
  }
  return transformation;
}

AffineTransform.getScaleInstance = function(sx, sy) {
  var transformation = new AffineTransform();
  transformation.setToScale(sx, sy);
  return transformation;
}

AffineTransform.getShearInstance = function(shx, shy) {
  var transformation = new AffineTransform();
  transformation.setToShear(shx, shy);
  return transformation;
}

AffineTransform.prototype.getType = function() {
  if (this.type === AffineTransform.TYPE_UNKNOWN) {
    this.calculateType();
  }
  return this.type;
}

AffineTransform.prototype.calculateType = function() {
  var ret = AffineTransform.TYPE_IDENTITY;
  var sgn0, sgn1;
  var M0, M1, M2, M3;
  this.updateState();
  switch (this.state) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      ret = AffineTransform.TYPE_TRANSLATION;
      /* NOBREAK */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      if ((M0 = this.m00) * (M2 = this.m01) + (M3 = this.m10) * (M1 = this.m11) !== 0) {
        this.type = AffineTransform.TYPE_GENERAL_TRANSFORM;
        return;
      }
      sgn0 = (M0 >= 0.0);
      sgn1 = (M1 >= 0.0);
      if (sgn0 === sgn1) {
        if (M0 !== M1 || M2 !== -M3) {
          ret |= (AffineTransform.TYPE_GENERAL_ROTATION | AffineTransform.TYPE_GENERAL_SCALE);
        } else if (M0 * M1 - M2 * M3 !== 1.0) {
          ret |= (AffineTransform.TYPE_GENERAL_ROTATION | AffineTransform.TYPE_UNIFORM_SCALE);
        } else {
          ret |= AffineTransform.TYPE_GENERAL_ROTATION;
        }
      } else {
        if (M0 !== -M1 || M2 !== M3) {
          ret |= (AffineTransform.TYPE_GENERAL_ROTATION |
                  AffineTransform.TYPE_FLIP |
                  AffineTransform.TYPE_GENERAL_SCALE);
        } else if (M0 * M1 - M2 * M3 !== 1.0) {
          ret |= (AffineTransform.TYPE_GENERAL_ROTATION |
                  AffineTransform.TYPE_FLIP |
                  AffineTransform.TYPE_UNIFORM_SCALE);
        } else {
          ret |= (AffineTransform.TYPE_GENERAL_ROTATION | AffineTransform.TYPE_FLIP);
        }
      }
      break;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
      ret = AffineTransform.TYPE_TRANSLATION;
      /* NOBREAK */
    case (AffineTransform.APPLY_SHEAR):
      sgn0 = ((M0 = this.m01) >= 0.0);
      sgn1 = ((M1 = this.m10) >= 0.0);
      if (sgn0 !== sgn1) {
        // Different signs - simple 90 degree rotation
        if (M0 !== -M1) {
          ret |= (AffineTransform.TYPE_QUADRANT_ROTATION | AffineTransform.TYPE_GENERAL_SCALE);
        } else if (M0 !== 1.0 && M0 !== -1.0) {
          ret |= (AffineTransform.TYPE_QUADRANT_ROTATION | AffineTransform.TYPE_UNIFORM_SCALE);
        } else {
          ret |= AffineTransform.TYPE_QUADRANT_ROTATION;
        }
      } else {
        // Same signs - 90 degree rotation plus an axis flip too
        if (M0 === M1) {
          ret |= (AffineTransform.TYPE_QUADRANT_ROTATION |
                  AffineTransform.TYPE_FLIP |
                  AffineTransform.TYPE_UNIFORM_SCALE);
        } else {
          ret |= (AffineTransform.TYPE_QUADRANT_ROTATION |
                  AffineTransform.TYPE_FLIP |
                  AffineTransform.TYPE_GENERAL_SCALE);
        }
      }
      break;
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      ret = AffineTransform.TYPE_TRANSLATION;
      /* NOBREAK */
    case (AffineTransform.APPLY_SCALE):
      sgn0 = ((M0 = this.m00) >= 0.0);
      sgn1 = ((M1 = this.m11) >= 0.0);
      if (sgn0 === sgn1) {
        if (sgn0) {
          if (M0 === M1) {
            ret |= AffineTransform.TYPE_UNIFORM_SCALE;
          } else {
            ret |= AffineTransform.TYPE_GENERAL_SCALE;
          }
        } else {
          if (M0 !== M1) {
            ret |= (AffineTransform.TYPE_QUADRANT_ROTATION | AffineTransform.TYPE_GENERAL_SCALE);
          } else if (M0 !== -1.0) {
            ret |= (AffineTransform.TYPE_QUADRANT_ROTATION | AffineTransform.TYPE_UNIFORM_SCALE);
          } else {
            ret |= AffineTransform.TYPE_QUADRANT_ROTATION;
          }
        }
      } else {
        if (M0 === -M1) {
          if (M0 === 1.0 || M0 === -1.0) {
            ret |= AffineTransform.TYPE_FLIP;
          } else {
            ret |= (AffineTransform.TYPE_FLIP | AffineTransform.TYPE_UNIFORM_SCALE);
          }
        } else {
          ret |= (AffineTransform.TYPE_FLIP | AffineTransform.TYPE_GENERAL_SCALE);
        }
      }
      break;
    case (AffineTransform.APPLY_TRANSLATE):
        ret = AffineTransform.TYPE_TRANSLATION;
        break;
    case (AffineTransform.APPLY_IDENTITY):
        break;
    }
    this.type = ret;
}

AffineTransform.prototype.getDeterminant = function() {
  switch (this.state) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      return this.m00 * this.m11 - this.m01 * this.m10;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SHEAR):
      return -(this.m01 * this.m10);
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SCALE):
      return this.m00 * this.m11;
    case (AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_IDENTITY):
      return 1.0;
    }
}

AffineTransform.prototype.updateState = function() {
  if (this.m01 === 0.0 && this.m10 === 0.0) {
    if (this.m00 === 1.0 && this.m11 === 1.0) {
      if (this.m02 === 0.0 && this.m12 === 0.0) {
        this.state = AffineTransform.APPLY_IDENTITY;
        this.type = AffineTransform.TYPE_IDENTITY;
      } else {
        this.state = AffineTransform.APPLY_TRANSLATE;
        this.type = AffineTransform.TYPE_TRANSLATION;
      }
    } else {
      if (this.m02 === 0.0 && this.m12 === 0.0) {
        this.state = AffineTransform.APPLY_SCALE;
        this.type = AffineTransform.TYPE_UNKNOWN;
      } else {
        this.state = (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE);
        this.type = AffineTransform.TYPE_UNKNOWN;
      }
    }
  } else {
    if (this.m00 === 0.0 && this.m11 === 0.0) {
      if (this.m02 === 0.0 && this.m12 === 0.0) {
        this.state = AffineTransform.APPLY_SHEAR;
        this.type = AffineTransform.TYPE_UNKNOWN;
      } else {
        this.state = (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE);
        this.type = AffineTransform.TYPE_UNKNOWN;
      }
    } else {
      if (this.m02 === 0.0 && this.m12 === 0.0) {
        this.state = (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE);
        this.type = AffineTransform.TYPE_UNKNOWN;
      } else {
        this.state = (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE);
        this.type = AffineTransform.TYPE_UNKNOWN;
      }
    }
  }
}

AffineTransform.prototype.stateError = function() {
  throw new InternalError("missing case in transform state switch");
}
  
AffineTransform.prototype.getMatrix = function(flatmatrix) {
  flatmatrix[0] = this.m00;
  flatmatrix[1] = this.m10;
  flatmatrix[2] = this.m01;
  flatmatrix[3] = this.m11;
  if (flatmatrix.length > 5) {
    flatmatrix[4] = this.m02;
    flatmatrix[5] = this.m12;
  }
}

AffineTransform.prototype.getScaleX = function() {
  return this.m00;
}

AffineTransform.prototype.getScaleY = function() {
  return this.m11;
}

AffineTransform.prototype.getShearX = function() {
  return this.m01;
}

AffineTransform.prototype.getShearY = function() {
  return this.m10;
}

AffineTransform.prototype.getTranslateX = function() {
  return this.m02;
}

AffineTransform.prototype.getTranslateY = function() {
  return this.m12;
}

AffineTransform.prototype.translate = function(tx, ty) {
  switch (this.state) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      this.m02 = tx * this.m00 + ty * this.m01 + this.m02;
      this.m12 = tx * this.m10 + ty * this.m11 + this.m12;
      if (this.m02 === 0.0 && this.m12 === 0.0) {
        this.state = AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE;
        if (this.type !== AffineTransform.TYPE_UNKNOWN) {
          this.type -= AffineTransform.TYPE_TRANSLATION;
        }
      }
      return;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      this.m02 = tx * this.m00 + ty * this.m01;
      this.m12 = tx * this.m10 + ty * this.m11;
      if (this.m02 !== 0.0 || this.m12 !== 0.0) {
        this.state = AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE;
        this.type |= AffineTransform.TYPE_TRANSLATION;
      }
      return;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
      this.m02 = ty * this.m01 + this.m02;
      this.m12 = tx * this.m10 + this.m12;
      if (this.m02 === 0.0 && this.m12 === 0.0) {
        this.state = AffineTransform.APPLY_SHEAR;
        if (this.type !== AffineTransform.TYPE_UNKNOWN) {
          this.type -= AffineTransform.TYPE_TRANSLATION;
        }
      }
      return;
    case (AffineTransform.APPLY_SHEAR):
      this.m02 = ty * this.m01;
      this.m12 = tx * this.m10;
      if (this.m02 !== 0.0 || this.m12 !== 0.0) {
        this.state = AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE;
        this.type |= AffineTransform.TYPE_TRANSLATION;
      }
      return;
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      this.m02 = tx * this.m00 + this.m02;
      this.m12 = ty * this.m11 + this.m12;
      if (this.m02 === 0.0 && this.m12 === 0.0) {
        this.state = AffineTransform.APPLY_SCALE;
        if (this.type !== AffineTransform.TYPE_UNKNOWN) {
          this.type -= AffineTransform.TYPE_TRANSLATION;
        }
      }
      return;
    case (AffineTransform.APPLY_SCALE):
      this.m02 = tx * this.m00;
      this.m12 = ty * this.m11;
      if (this.m02 !== 0.0 || this.m12 !== 0.0) {
        this.state = AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE;
        this.type |= AffineTransform.TYPE_TRANSLATION;
      }
      return;
    case (AffineTransform.APPLY_TRANSLATE):
      this.m02 = tx + this.m02;
      this.m12 = ty + this.m12;
      if (this.m02 === 0.0 && this.m12 === 0.0) {
        this.state = AffineTransform.APPLY_IDENTITY;
        this.type = AffineTransform.TYPE_IDENTITY;
      }
      return;
    case (AffineTransform.APPLY_IDENTITY):
      this.m02 = tx;
      this.m12 = ty;
      if (tx !== 0.0 || ty !== 0.0) {
        this.state = AffineTransform.APPLY_TRANSLATE;
        this.type = AffineTransform.TYPE_TRANSLATION;
      }
      return;
  }
}

AffineTransform.prototype.rotate90 = function() {
  var M0 = this.m00;
  this.m00 = this.m01;
  this.m01 = -M0;
  M0 = this.m10;
  this.m10 = this.m11;
  this.m11 = -M0;
  var state = rot90conversion[this.state];
  if ((state & (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE)) === AffineTransform.APPLY_SCALE &&
      this.m00 === 1.0 && this.m11 === 1.0)  {
    state -= AffineTransform.APPLY_SCALE;
  }
  this.state = state;
  this.type = AffineTransform.TYPE_UNKNOWN;
}

AffineTransform.prototype.rotate180 = function() {
  this.m00 = -this.m00;
  this.m11 = -this.m11;
  var state = this.state;
  if ((state & (AffineTransform.APPLY_SHEAR)) !== 0) {
    // If there was a shear, then this rotation has no
    // effect on the state.
    this.m01 = -this.m01;
    this.m10 = -this.m10;
  } else {
    // No shear means the SCALE state may toggle when
    // m00 and m11 are negated.
    if (this.m00 === 1.0 && this.m11 === 1.0) {
      this.state = state & ~AffineTransform.APPLY_SCALE;
    } else {
      this.state = state | AffineTransform.APPLY_SCALE;
    }
  }
  this.type = AffineTransform.TYPE_UNKNOWN;
}

AffineTransform.prototype.rotate270 = function() {
  var M0 = this.m00;
  this.m00 = -this.m01;
  this.m01 = M0;
  M0 = this.m10;
  this.m10 = -this.m11;
  this.m11 = M0;
  var state = rot90conversion[this.state];
  if ((state & (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE)) === AffineTransform.APPLY_SCALE &&
      this.m00 === 1.0 && this.m11 === 1.0) {
    state -= AffineTransform.APPLY_SCALE;
  }
  this.state = state;
  this.type = AffineTransform.TYPE_UNKNOWN;
}

AffineTransform.prototype.rotate = function(vecx, vecy, anchorx, anchory) {
  if (vecy === undefined) {    
    // 1 parameter
    var theta = vecx;
    var sin = Math.sin(theta);
    if (sin === 1.0) {
      this.rotate90();
    } else if (sin === -1.0) {
      this.rotate270();
    } else {
      var cos = Math.cos(theta);
      if (cos === -1.0) {
        this.rotate180();
      } else if (cos !== 1.0) {
        var M0, M1;
        M0 = this.m00;
        M1 = this.m01;
        this.m00 =  cos * M0 + sin * M1;
        this.m01 = -sin * M0 + cos * M1;
        M0 = this.m10;
        M1 = this.m11;
        this.m10 =  cos * M0 + sin * M1;
        this.m11 = -sin * M0 + cos * M1;
        this.updateState();
      }
    }
  } else if (anchorx === undefined) {
    // 2 parameters
    if (vecy === 0.0) {
      if (vecx < 0.0) {
        this.rotate180();
      }
    } else if (vecx === 0.0) {
      if (vecy > 0.0) {
        this.rotate90();
      } else {  // vecy must be < 0.0
        this.rotate270();
      }
    } else {
      var len = Math.sqrt(vecx * vecx + vecy * vecy);
      var sin = vecy / len;
      var cos = vecx / len;
      var M0, M1;
      M0 = this.m00;
      M1 = this.m01;
      this.m00 =  cos * M0 + sin * M1;
      this.m01 = -sin * M0 + cos * M1;
      M0 = this.m10;
      M1 = this.m11;
      this.m10 =  cos * M0 + sin * M1;
      this.m11 = -sin * M0 + cos * M1;
      this.updateState();
    }
  } else if (anchory === undefined) {
    // 3 parameters
    var theta = vecx;
    anchory = anchorx; 
    anchorx = vecy;
    this.translate(anchorx, anchory);
    this.rotate(theta);
    this.translate(-anchorx, -anchory);
  } else {
    this.translate(anchorx, anchory);
    this.rotate(vecx, vecy);
    this.translate(-anchorx, -anchory);
  }
}

AffineTransform.prototype.quadrantRotate = function(numquadrants, anchorx, anchory) {
  if (anchorx === undefined) {
    switch (numquadrants & 3) {
    case 0:
      break;
    case 1:
      this.rotate90();
      break;
    case 2:
      this.rotate180();
      break;
    case 3:
      this.rotate270();
      break;
    }
  } else {
    switch (numquadrants & 3) {
    case 0:
      return;
    case 1:
      this.m02 += anchorx * (this.m00 - this.m01) + anchory * (this.m01 + this.m00);
      this.m12 += anchorx * (this.m10 - this.m11) + anchory * (this.m11 + this.m10);
      this.rotate90();
      break;
    case 2:
      this.m02 += anchorx * (this.m00 + this.m00) + anchory * (this.m01 + this.m01);
      this.m12 += anchorx * (this.m10 + this.m10) + anchory * (this.m11 + this.m11);
      this.rotate180();
      break;
    case 3:
      this.m02 += anchorx * (this.m00 + this.m01) + anchory * (this.m01 - this.m00);
      this.m12 += anchorx * (this.m10 + this.m11) + anchory * (this.m11 - this.m10);
      this.rotate270();
      break;
    }
    if (this.m02 === 0.0 && this.m12 === 0.0) {
      this.state &= ~AffineTransform.APPLY_TRANSLATE;
    } else {
      this.state |= AffineTransform.APPLY_TRANSLATE;
    }
  }
}

AffineTransform.prototype.scale = function(sx, sy) {
  var state = this.state;
  switch (state) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      this.m00 *= sx;
      this.m11 *= sy;
      /* NOBREAK */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SHEAR):
      this.m01 *= sy;
      this.m10 *= sx;
      if (this.m01 === 0 && this.m10 === 0) {
        state &= AffineTransform.APPLY_TRANSLATE;
        if (this.m00 === 1.0 && this.m11 === 1.0) {
          this.type = (state === AffineTransform.APPLY_IDENTITY
                       ? AffineTransform.TYPE_IDENTITY
                       : AffineTransform.TYPE_TRANSLATION);
        } else {
          state |= AffineTransform.APPLY_SCALE;
          this.type = AffineTransform.TYPE_UNKNOWN;
        }
        this.state = state;
      }
      return;
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SCALE):
      this.m00 *= sx;
      this.m11 *= sy;
      if (this.m00 === 1.0 && this.m11 === 1.0) {
        this.state = (state &= AffineTransform.APPLY_TRANSLATE);
        this.type = (state === AffineTransform.APPLY_IDENTITY
                       ? AffineTransform.TYPE_IDENTITY
                       : AffineTransform.TYPE_TRANSLATION);
      } else {
        this.type = AffineTransform.TYPE_UNKNOWN;
      }
      return;
    case (AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_IDENTITY):
      this.m00 = sx;
      this.m11 = sy;
      if (sx !== 1.0 || sy !== 1.0) {
        this.state = state | AffineTransform.APPLY_SCALE;
        this.type = AffineTransform.TYPE_UNKNOWN;
      }
      return;
  }
}

AffineTransform.prototype.shear = function(shx, shy) {
  var state = this.state;
  switch (state) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      var M0, M1;
      M0 = this.m00;
      M1 = this.m01;
      this.m00 = M0 + M1 * shy;
      this.m01 = M0 * shx + M1;

      M0 = this.m10;
      M1 = this.m11;
      this.m10 = M0 + M1 * shy;
      this.m11 = M0 * shx + M1;
      this.updateState();
      return;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SHEAR):
      this.m00 = this.m01 * shy;
      this.m11 = this.m10 * shx;
      if (this.m00 !== 0.0 || this.m11 !== 0.0) {
        this.state = state | AffineTransform.APPLY_SCALE;
      }
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SCALE):
      this.m01 = this.m00 * shx;
      this.m10 = this.m11 * shy;
      if (this.m01 !== 0.0 || this.m10 !== 0.0) {
        this.state = state | AffineTransform.APPLY_SHEAR;
      }
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
    case (AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_IDENTITY):
      this.m01 = shx;
      this.m10 = shy;
      if (this.m01 !== 0.0 || this.m10 !== 0.0) {
          this.state = state | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_SHEAR;
          this.type = AffineTransform.TYPE_UNKNOWN;
      }
      return;
  }
}

AffineTransform.prototype.setToIdentity = function() {
  this.m00 = this.m11 = 1.0;
  this.m10 = this.m01 = this.m02 = this.m12 = 0.0;
  this.state = AffineTransform.APPLY_IDENTITY;
  this.type = AffineTransform.TYPE_IDENTITY;
}

AffineTransform.prototype.setToTranslation = function(tx, ty) {
  this.m00 = 1.0;
  this.m10 = 0.0;
  this.m01 = 0.0;
  this.m11 = 1.0;
  this.m02 = tx;
  this.m12 = ty;
  if (tx !== 0.0 || ty !== 0.0) {
    this.state = AffineTransform.APPLY_TRANSLATE;
    this.type = AffineTransform.TYPE_TRANSLATION;
  } else {
    this.state = AffineTransform.APPLY_IDENTITY;
    this.type = AffineTransform.TYPE_IDENTITY;
  }
}

AffineTransform.prototype.setToRotation = function(vecx, vecy, anchorx, anchory) {
  if (vecy === undefined) {    
    // 1 parameter
    var theta = vecx;
    var sin = Math.sin(theta);
    var cos;
    if (sin === 1.0 || sin === -1.0) {
      cos = 0.0;
      this.state = AffineTransform.APPLY_SHEAR;
      this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
    } else {
      cos = Math.cos(theta);
      if (cos === -1.0) {
        sin = 0.0;
        this.state = AffineTransform.APPLY_SCALE;
        this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
      } else if (cos === 1.0) {
        sin = 0.0;
        this.state = AffineTransform.APPLY_IDENTITY;
        this.type = AffineTransform.TYPE_IDENTITY;
      } else {
        this.state = AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE;
        this.type = AffineTransform.TYPE_GENERAL_ROTATION;
      }
    }
    this.m00 =  cos;
    this.m10 =  sin;
    this.m01 = -sin;
    this.m11 =  cos;
    this.m02 =  0.0;
    this.m12 =  0.0;
  } else if (anchorx === undefined) {
    // 2 parameters
    var sin, cos;
    if (vecy === 0) {
      sin = 0.0;
      if (vecx < 0.0) {
        cos = -1.0;
        this.state = AffineTransform.APPLY_SCALE;
        this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
      } else {
        cos = 1.0;
        this.state = AffineTransform.APPLY_IDENTITY;
        this.type = AffineTransform.TYPE_IDENTITY;
      }
    } else if (vecx === 0) {
      cos = 0.0;
      sin = (vecy > 0.0) ? 1.0 : -1.0;
      this.state = AffineTransform.APPLY_SHEAR;
      this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
    } else {
      var len = Math.sqrt(vecx * vecx + vecy * vecy);
      cos = vecx / len;
      sin = vecy / len;
      this.state = AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE;
      this.type = AffineTransform.TYPE_GENERAL_ROTATION;
    }
    this.m00 =  cos;
    this.m10 =  sin;
    this.m01 = -sin;
    this.m11 =  cos;
    this.m02 =  0.0;
    this.m12 =  0.0;
  } else if (anchory === undefined) {
    // 3 parameters
    var theta = vecx;
    anchory = anchorx; 
    anchorx = vecy;
    this.setToRotation(theta);
    var sin = this.m10;
    var oneMinusCos = 1.0 - this.m00;
    this.m02 = anchorx * oneMinusCos + anchory * sin;
    this.m12 = anchory * oneMinusCos - anchorx * sin;
    if (this.m02 !== 0.0 || this.m12 !== 0.0) {
      this.state |= AffineTransform.APPLY_TRANSLATE;
      this.type |= AffineTransform.TYPE_TRANSLATION;
    }
  } else {
    this.setToRotation(vecx, vecy);
    var sin = this.m10;
    var oneMinusCos = 1.0 - this.m00;
    this.m02 = anchorx * oneMinusCos + anchory * sin;
    this.m12 = anchory * oneMinusCos - anchorx * sin;
    if (this.m02 !== 0.0 || this.m12 !== 0.0) {
      this.state |= AffineTransform.APPLY_TRANSLATE;
      this.type |= AffineTransform.TYPE_TRANSLATION;
    }
  }
}

AffineTransform.prototype.setToQuadrantRotation = function(numquadrants, anchorx, anchory) {
  if (anchorx === undefined) {
    switch (numquadrants & 3) {
      case 0:
        this.m00 =  1.0;
        this.m10 =  0.0;
        this.m01 =  0.0;
        this.m11 =  1.0;
        this.m02 =  0.0;
        this.m12 =  0.0;
        this.state = AffineTransform.APPLY_IDENTITY;
        this.type = AffineTransform.TYPE_IDENTITY;
        break;
      case 1:
        this.m00 =  0.0;
        this.m10 =  1.0;
        this.m01 = -1.0;
        this.m11 =  0.0;
        this.m02 =  0.0;
        this.m12 =  0.0;
        this.state = AffineTransform.APPLY_SHEAR;
        this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
        break;
      case 2:
        this.m00 = -1.0;
        this.m10 =  0.0;
        this.m01 =  0.0;
        this.m11 = -1.0;
        this.m02 =  0.0;
        this.m12 =  0.0;
        this.state = AffineTransform.APPLY_SCALE;
        this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
        break;
      case 3:
        this.m00 =  0.0;
        this.m10 = -1.0;
        this.m01 =  1.0;
        this.m11 =  0.0;
        this.m02 =  0.0;
        this.m12 =  0.0;
        this.state = AffineTransform.APPLY_SHEAR;
        this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
        break;
    }
  } else {
    switch (numquadrants & 3) {
      case 0:
        this.m00 =  1.0;
        this.m10 =  0.0;
        this.m01 =  0.0;
        this.m11 =  1.0;
        this.m02 =  0.0;
        this.m12 =  0.0;
        state = AffineTransform.APPLY_IDENTITY;
        type = AffineTransform.TYPE_IDENTITY;
        break;
      case 1:
        this.m00 =  0.0;
        this.m10 =  1.0;
        this.m01 = -1.0;
        this.m11 =  0.0;
        this.m02 =  anchorx + anchory;
        this.m12 =  anchory - anchorx;
        if (this.m02 === 0.0 && this.m12 === 0.0) {
          this.state = AffineTransform.APPLY_SHEAR;
          this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
        } else {
          this.state = AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE;
          this.type = AffineTransform.TYPE_QUADRANT_ROTATION | AffineTransform.TYPE_TRANSLATION;
        }
        break;
      case 2:
        this.m00 = -1.0;
        this.m10 =  0.0;
        this.m01 =  0.0;
        this.m11 = -1.0;
        this.m02 =  anchorx + anchorx;
        this.m12 =  anchory + anchory;
        if (this.m02 === 0.0 && this.m12 === 0.0) {
          this.state = AffineTransform.APPLY_SCALE;
          this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
        } else {
          this.state = AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE;
          this.type = AffineTransform.TYPE_QUADRANT_ROTATION | AffineTransform.TYPE_TRANSLATION;
        }
        break;
      case 3:
        this.m00 =  0.0;
        this.m10 = -1.0;
        this.m01 =  1.0;
        this.m11 =  0.0;
        this.m02 =  anchorx - anchory;
        this.m12 =  anchory + anchorx;
        if (this.m02 === 0.0 && this.m12 === 0.0) {
          this.state = AffineTransform.APPLY_SHEAR;
          this.type = AffineTransform.TYPE_QUADRANT_ROTATION;
        } else {
          this.state = AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE;
          this.type = AffineTransform.TYPE_QUADRANT_ROTATION | AffineTransform.TYPE_TRANSLATION;
        }
        break;
    }
  }
}

AffineTransform.prototype.setToScale = function(sx, sy) {
  this.m00 = sx;
  this.m10 = 0.0;
  this.m01 = 0.0;
  this.m11 = sy;
  this.m02 = 0.0;
  this.m12 = 0.0;
  if (sx !== 1.0 || sy !== 1.0) {
    this.state = AffineTransform.APPLY_SCALE;
    this.type = AffineTransform.TYPE_UNKNOWN;
  } else {
    this.state = AffineTransform.APPLY_IDENTITY;
    this.type = AffineTransform.TYPE_IDENTITY;
  }
}

AffineTransform.prototype.setToShear = function(shx, shy) {
  this.m00 = 1.0;
  this.m01 = shx;
  this.m10 = shy;
  this.m11 = 1.0;
  this.m02 = 0.0;
  this.m12 = 0.0;
  if (shx !== 0.0 || shy !== 0.0) {
    this.state = (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE);
    this.type = AffineTransform.TYPE_UNKNOWN;
  } else {
    this.state = AffineTransform.APPLY_IDENTITY;
    this.type = AffineTransform.TYPE_IDENTITY;
  }
}

AffineTransform.prototype.setTransform = function(m00, m10, m01, m11, m02, m12) {
  if (m00 instanceof AffineTransform) {
    var transformation = m00;
    this.m00 = transformation.m00;
    this.m10 = transformation.m10;
    this.m01 = transformation.m01;
    this.m11 = transformation.m11;
    this.m02 = transformation.m02;
    this.m12 = transformation.m12;
    this.state = transformation.state;
    this.type = transformation.type;
  } else {
    this.m00 = m00;
    this.m10 = m10;
    this.m01 = m01;
    this.m11 = m11;
    this.m02 = m02;
    this.m12 = m12;
    this.updateState();
  }
}

AffineTransform.prototype.concatenate = function(transformation) {
  var M0, M1;
  var T00, T01, T10, T11;
  var T02, T12;
  var mystate = this.state;
  var txstate = transformation.state;
  switch ((txstate << AffineTransform.HI_SHIFT) | mystate) {
    /* ---------- transformation === IDENTITY cases ---------- */
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_IDENTITY):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SHEAR):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      return;

    /* ---------- this === IDENTITY cases ---------- */
    case (AffineTransform.HI_SHEAR | AffineTransform.HI_SCALE | AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_IDENTITY):
      this.m01 = transformation.m01;
      this.m10 = transformation.m10;
      /* NOBREAK */
    case (AffineTransform.HI_SCALE | AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_IDENTITY):
      this.m00 = transformation.m00;
      this.m11 = transformation.m11;
      /* NOBREAK */
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_IDENTITY):
      this.m02 = transformation.m02;
      this.m12 = transformation.m12;
      this.state = txstate;
      this.type = transformation.type;
      return;
    case (AffineTransform.HI_SHEAR | AffineTransform.HI_SCALE | AffineTransform.APPLY_IDENTITY):
      this.m01 = transformation.m01;
      this.m10 = transformation.m10;
      /* NOBREAK */
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_IDENTITY):
      this.m00 = transformation.m00;
      this.m11 = transformation.m11;
      this.state = txstate;
      this.type = transformation.type;
      return;
    case (AffineTransform.HI_SHEAR | AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_IDENTITY):
      this.m02 = transformation.m02;
      this.m12 = transformation.m12;
      /* NOBREAK */
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_IDENTITY):
      this.m01 = transformation.m01;
      this.m10 = transformation.m10;
      this.m00 = this.m11 = 0.0;
      this.state = txstate;
      this.type = transformation.type;
      return;
    /* ---------- transformation === TRANSLATE cases ---------- */
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SHEAR):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_TRANSLATE):
      this.translate(transformation.m02, transformation.m12);
      return;

    /* ---------- transformation === SCALE cases ---------- */
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SHEAR):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_TRANSLATE):
      this.scale(transformation.m00, transformation.m11);
      return;

      /* ---------- transformation === SHEAR cases ---------- */
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      T01 = transformation.m01; T10 = transformation.m10;
      M0 = this.m00;
      this.m00 = this.m01 * T10;
      this.m01 = M0 * T01;
      M0 = this.m10;
      this.m10 = this.m11 * T10;
      this.m11 = M0 * T01;
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SHEAR):
      this.m00 = this.m01 * transformation.m10;
      this.m01 = 0.0;
      this.m11 = this.m10 * transformation.m01;
      this.m10 = 0.0;
      this.state = mystate ^ (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE);
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SCALE):
      this.m01 = this.m00 * transformation.m01;
      this.m00 = 0.0;
      this.m10 = this.m11 * transformation.m10;
      this.m11 = 0.0;
      this.state = mystate ^ (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE);
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_TRANSLATE):
      this.m00 = 0.0;
      this.m01 = transformation.m01;
      this.m10 = transformation.m10;
      this.m11 = 0.0;
      this.state = AffineTransform.APPLY_TRANSLATE | AffineTransform.APPLY_SHEAR;
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
  }
  // If transformation has more than one attribute, it is not worth optimizing
  // all of those cases...
  T00 = transformation.m00; T01 = transformation.m01; T02 = transformation.m02;
  T10 = transformation.m10; T11 = transformation.m11; T12 = transformation.m12;
  switch (mystate) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      this.state = mystate | txstate;
      /* NOBREAK */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      M0 = this.m00;
      M1 = this.m01;
      this.m00  = T00 * M0 + T10 * M1;
      this.m01  = T01 * M0 + T11 * M1;
      this.m02 += T02 * M0 + T12 * M1;

      M0 = this.m10;
      M1 = this.m11;
      this.m10  = T00 * M0 + T10 * M1;
      this.m11  = T01 * M0 + T11 * M1;
      this.m12 += T02 * M0 + T12 * M1;
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SHEAR):
      M0 = this.m01;
      this.m00  = T10 * M0;
      this.m01  = T11 * M0;
      this.m02 += T12 * M0;

      M0 = this.m10;
      this.m10  = T00 * M0;
      this.m11  = T01 * M0;
      this.m12 += T02 * M0;
      break;
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.APPLY_SCALE):
      M0 = this.m00;
      this.m00  = T00 * M0;
      this.m01  = T01 * M0;
      this.m02 += T02 * M0;

      M0 = this.m11;
      this.m10  = T10 * M0;
      this.m11  = T11 * M0;
      this.m12 += T12 * M0;
      break;
    case (AffineTransform.APPLY_TRANSLATE):
      this.m00  = T00;
      this.m01  = T01;
      this.m02 += T02;
  
      this.m10  = T10;
      this.m11  = T11;
      this.m12 += T12;
      this.state = txstate | AffineTransform.APPLY_TRANSLATE;
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
  }
  this.updateState();
}

AffineTransform.prototype.preConcatenate = function(transformation) {
  var M0, M1;
  var T00, T01, T10, T11;
  var T02, T12;
  var mystate = this.state;
  var txstate = transformation.state;
  switch ((txstate << AffineTransform.HI_SHIFT) | mystate) {
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_IDENTITY):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SHEAR):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_IDENTITY | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      // transformation is IDENTITY...
      return;
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_IDENTITY):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SHEAR):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
        // transformation is TRANSLATE, this has no TRANSLATE
      this.m02 = transformation.m02;
      this.m12 = transformation.m12;
      this.state = mystate | AffineTransform.APPLY_TRANSLATE;
      this.type |= AffineTransform.TYPE_TRANSLATION;
      return;
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_TRANSLATE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      // transformation is TRANSLATE, this has one too
      this.m02 = this.m02 + transformation.m02;
      this.m12 = this.m12 + transformation.m12;
      return;
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_IDENTITY):
      // Only these two existing states need a new state
      this.state = mystate | AffineTransform.APPLY_SCALE;
      /* NOBREAK */
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SHEAR):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SCALE | AffineTransform.APPLY_SCALE):
      // transformation is SCALE, this is anything
      T00 = transformation.m00;
      T11 = transformation.m11;
      if ((mystate & AffineTransform.APPLY_SHEAR) !== 0) {
        this.m01 = this.m01 * T00;
        this.m10 = this.m10 * T11;
        if ((mystate & AffineTransform.APPLY_SCALE) !== 0) {
          this.m00 = this.m00 * T00;
          this.m11 = this.m11 * T11;
        }
      } else {
        this.m00 = this.m00 * T00;
        this.m11 = this.m11 * T11;
      }
      if ((mystate & AffineTransform.APPLY_TRANSLATE) !== 0) {
        this.m02 = this.m02 * T00;
        this.m12 = this.m12 * T11;
      }
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SHEAR):
      mystate = mystate | AffineTransform.APPLY_SCALE;
      /* NOBREAK */
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_IDENTITY):
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SCALE):
      this.state = mystate ^ AffineTransform.APPLY_SHEAR;
      /* NOBREAK */
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
    case (AffineTransform.HI_SHEAR | AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      // transformation is SHEAR, this is anything
      T01 = transformation.m01;
      T10 = transformation.m10;

      M0 = this.m00;
      this.m00 =  this.m10 * T01;
      this.m10 = M0 * T10;

      M0 = this.m01;
      this.m01 =  this.m11 * T01;
      this.m11 = M0 * T10;

      M0 = this.m02;
      this.m02 = this.m12 * T01;
      this.m12 = M0 * T10;
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
  }
  // If transformation has more than one attribute, it is not worth optimizing
  // all of those cases...
  T00 = transformation.m00; T01 = transformation.m01; T02 = transformation.m02;
  T10 = transformation.m10; T11 = transformation.m11; T12 = transformation.m12;
  switch (mystate) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      M0 = this.m02;
      M1 = this.m12;
      T02 += M0 * T00 + M1 * T01;
      T12 += M0 * T10 + M1 * T11;
      /* NOBREAK */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      this.m02 = T02;
      this.m12 = T12;  
      M0 = this.m00;
      M1 = this.m10;
      this.m00 = M0 * T00 + M1 * T01;
      this.m10 = M0 * T10 + M1 * T11;

      M0 = this.m01;
      M1 = this.m11;
      this.m01 = M0 * T00 + M1 * T01;
      this.m11 = M0 * T10 + M1 * T11;
      break;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
      M0 = this.m02;
      M1 = this.m12;
      T02 += M0 * T00 + M1 * T01;
      T12 += M0 * T10 + M1 * T11;
      /* NOBREAK */
    case (AffineTransform.APPLY_SHEAR):
      this.m02 = T02;
      this.m12 = T12;

      M0 = this.m10;
      this.m00 = M0 * T01;
      this.m10 = M0 * T11;

      M0 = this.m01;
      this.m01 = M0 * T00;
      this.m11 = M0 * T10;
      break;
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      M0 = this.m02;
      M1 = this.m12;
      T02 += M0 * T00 + M1 * T01;
      T12 += M0 * T10 + M1 * T11;
      /* NOBREAK */
    case (AffineTransform.APPLY_SCALE):
      this.m02 = T02;
      this.m12 = T12;

      M0 = this.m00;
      this.m00 = M0 * T00;
      this.m10 = M0 * T10;

      M0 = this.m11;
      this.m01 = M0 * T01;
      this.m11 = M0 * T11;
      break;
    case (AffineTransform.APPLY_TRANSLATE):
      M0 = this.m02;
      M1 = this.m12;
      T02 += M0 * T00 + M1 * T01;
      T12 += M0 * T10 + M1 * T11;
      /* NOBREAK */
    case (AffineTransform.APPLY_IDENTITY):
      this.m02 = T02;
      this.m12 = T12;
    
      this.m00 = T00;
      this.m10 = T10;
    
      this.m01 = T01;
      this.m11 = T11;
    
      this.state = mystate | txstate;
      this.type = AffineTransform.TYPE_UNKNOWN;
      return;
  }
  this.updateState();
}

AffineTransform.prototype.createInverse = function() {
  var det;
  switch (this.state) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      det = this.m00 * this.m11 - this.m01 * this.m10;
      if (Math.abs(det) <= Number.MIN_VALUE) {
        throw new NoninvertibleTransformException("Determinant is "+ det);
      }
      return new AffineTransform( this.m11 / det, -this.m10 / det,
                                 -this.m01 / det,  this.m00 / det,
                                 (this.m01 * this.m12 - this.m11 * this.m02) / det,
                                 (this.m10 * this.m02 - this.m00 * this.m12) / det,
                                 (AffineTransform.APPLY_SHEAR |
                                  AffineTransform.APPLY_SCALE |
                                  AffineTransform.APPLY_TRANSLATE));
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      det = this.m00 * this.m11 - this.m01 * this.m10;
      if (Math.abs(det) <= Number.MIN_VALUE) {
        throw new NoninvertibleTransformException("Determinant is "+ det);
      }
      return new AffineTransform( this.m11 / det, -this.m10 / det,
                                 -this.m01 / det,  this.m00 / det,
                                  0.0,        0.0,
                                 (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE));
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
      if (this.m01 === 0.0 || this.m10 === 0.0) {
        throw new NoninvertibleTransformException("Determinant is 0");
      }
      return new AffineTransform( 0.0,             1.0 / this.m01,
                                  1.0 / this.m10,  0.0,
                                  -this.m12 / this.m10, -this.m02 / this.m01,
                                 (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE));
    case (AffineTransform.APPLY_SHEAR):
      if (this.m01 === 0.0 || this.m10 === 0.0) {
        throw new NoninvertibleTransformException("Determinant is 0");
      }
      return new AffineTransform(0.0,            1.0 / this.m01,
                                 1.0 / this.m10, 0.0,
                                 0.0,            0.0,
                                 (AffineTransform.APPLY_SHEAR));
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      if (this.m00 === 0.0 || this.m11 === 0.0) {
        throw new NoninvertibleTransformException("Determinant is 0");
      }
      return new AffineTransform( 1.0 / this.m00,  0.0,
                                  0.0,             1.0 / this.m11,
                                  -this.m02 / this.m00, -this.m12 / this.m11,
                                 (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE));
    case (AffineTransform.APPLY_SCALE):
      if (this.m00 === 0.0 || this.m11 === 0.0) {
        throw new NoninvertibleTransformException("Determinant is 0");
      }
      return new AffineTransform(1.0 / this.m00, 0.0,
                                 0.0,            1.0 / this.m11,
                                 0.0,            0.0,
                                 (AffineTransform.APPLY_SCALE));
    case (AffineTransform.APPLY_TRANSLATE):
      return new AffineTransform( 1.0,  0.0,
                                  0.0,  1.0,
                                  -this.m02, -this.m12,
                                 (AffineTransform.APPLY_TRANSLATE));
    case (AffineTransform.APPLY_IDENTITY):
      return new AffineTransform();
  }
}

AffineTransform.prototype.invert = function() {
  var M00, M01, M02;
  var M10, M11, M12;
  var det;
  switch (state) {
    default:
      this.stateError();
      /* NOTREACHED */
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      M00 = this.m00; M01 = this.m01; M02 = this.m02;
      M10 = this.m10; M11 = this.m11; M12 = this.m12;
      det = M00 * M11 - M01 * M10;
      if (Math.abs(det) <= Number.MIN_VALUE) {
        throw new NoninvertibleTransformException("Determinant is "+ det);
      }
      this.m00 =  M11 / det;
      this.m10 = -M10 / det;
      this.m01 = -M01 / det;
      this.m11 =  M00 / det;
      this.m02 = (M01 * M12 - M11 * M02) / det;
      this.m12 = (M10 * M02 - M00 * M12) / det;
      break;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
      M00 = this.m00; M01 = this.m01;
      M10 = this.m10; M11 = this.m11;
      det = M00 * M11 - M01 * M10;
      if (Math.abs(det) <= Number.MIN_VALUE) {
        throw new NoninvertibleTransformException("Determinant is "+ det);
      }
      this.m00 =  M11 / det;
      this.m10 = -M10 / det;
      this.m01 = -M01 / det;
      this.m11 =  M00 / det;
      // this.m02 = 0.0;
      // this.m12 = 0.0;
      break;
    case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
      M01 = this.m01; M02 = this.m02;
      M10 = this.m10; M12 = this.m12;
      if (M01 === 0.0 || M10 === 0.0) {
        throw new NoninvertibleTransformException("Determinant is 0");
      }
      // this.m00 = 0.0;
      this.m10 = 1.0 / M01;
      this.m01 = 1.0 / M10;
      // this.m11 = 0.0;
      this.m02 = -M12 / M10;
      this.m12 = -M02 / M01;
      break;
    case (AffineTransform.APPLY_SHEAR):
      M01 = this.m01;
      M10 = this.m10;
      if (M01 === 0.0 || M10 === 0.0) {
        throw new NoninvertibleTransformException("Determinant is 0");
      }
      // this.m00 = 0.0;
      this.m10 = 1.0 / M01;
      this.m01 = 1.0 / M10;
      // this.m11 = 0.0;
      // this.m02 = 0.0;
      // this.m12 = 0.0;
      break;
    case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      M00 = this.m00; M02 = this.m02;
      M11 = this.m11; M12 = this.m12;
      if (M00 === 0.0 || M11 === 0.0) {
        throw new NoninvertibleTransformException("Determinant is 0");
      }
      this.m00 = 1.0 / M00;
      // this.m10 = 0.0;
      // this.m01 = 0.0;
      this.m11 = 1.0 / M11;
      this.m02 = -M02 / M00;
      this.m12 = -M12 / M11;
      break;
    case (AffineTransform.APPLY_SCALE):
      M00 = this.m00;
      M11 = this.m11;
      if (M00 === 0.0 || M11 === 0.0) {
        throw new NoninvertibleTransformException("Determinant is 0");
      }
      this.m00 = 1.0 / M00;
      // this.m10 = 0.0;
      // this.m01 = 0.0;
      this.m11 = 1.0 / M11;
      // this.m02 = 0.0;
      // this.m12 = 0.0;
      break;
    case (AffineTransform.APPLY_TRANSLATE):
      // this.m00 = 1.0;
      // this.m10 = 0.0;
      // this.m01 = 0.0;
      // this.m11 = 1.0;
      this.m02 = -this.m02;
      this.m12 = -this.m12;
      break;  
    case (AffineTransform.APPLY_IDENTITY):
      // this.m00 = 1.0;
      // this.m10 = 0.0;
      // this.m01 = 0.0;
      // this.m11 = 1.0;
      // this.m02 = 0.0;
      // this.m12 = 0.0;
      break;
  }
}

AffineTransform.prototype.transform = function(srcPts, srcOff, dstPts, dstOff, numPts) {
  if (srcPts instanceof Point2D) {
    // 2 Point2D parameters
    var ptSrc = srcPts;
    var ptDst = srcOff;
    
    if (ptDst === null) {
      ptDst = new Point2D();
    }
    // Copy source coords into local variables in case src === dst
    var x = ptSrc.getX();
    var y = ptSrc.getY();
    switch (this.state) {
      default:
        this.stateError();
        /* NOTREACHED */
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
        ptDst.setLocation(x * this.m00 + y * this.m01 + this.m02,
                          x * this.m10 + y * this.m11 + this.m12);
        return ptDst;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
        ptDst.setLocation(x * this.m00 + y * this.m01, x * this.m10 + y * this.m11);
        return ptDst;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
        ptDst.setLocation(y * this.m01 + this.m02, x * this.m10 + this.m12);
        return ptDst;
      case (AffineTransform.APPLY_SHEAR):
        ptDst.setLocation(y * this.m01, x * this.m10);
        return ptDst;
      case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
        ptDst.setLocation(x * this.m00 + this.m02, y * this.m11 + this.m12);
        return ptDst;
      case (AffineTransform.APPLY_SCALE):
        ptDst.setLocation(x * this.m00, y * this.m11);
        return ptDst;
      case (AffineTransform.APPLY_TRANSLATE):
        ptDst.setLocation(x + this.m02, y + this.m12);
        return ptDst;
      case (AffineTransform.APPLY_IDENTITY):
        ptDst.setLocation(x, y);
        return ptDst;
    }
  } else if (srcPts [0] instanceof Point2D) {
    // 5 parameters with Point2D arrays
    var ptSrc = srcPts;
    var ptDst = dstPts;
    
    var state = this.state;
    while (--numPts >= 0) {
      // Copy source coords into local variables in case src === dst
      var src = ptSrc[srcOff++];
      var x = src.getX();
      var y = src.getY();
      var dst = ptDst[dstOff++];
      if (dst === null) {
        dst = new Point2D();
        ptDst[dstOff - 1] = dst;
      }
      switch (state) {
        default:
          this.stateError();
          /* NOTREACHED */
        case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
          dst.setLocation(x * this.m00 + y * this.m01 + this.m02,
                          x * this.m10 + y * this.m11 + this.m12);
          break;
        case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
          dst.setLocation(x * this.m00 + y * this.m01, x * this.m10 + y * this.m11);
          break;
        case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
          dst.setLocation(y * this.m01 + this.m02, x * this.m10 + this.m12);
          break;
        case (AffineTransform.APPLY_SHEAR):
          dst.setLocation(y * this.m01, x * this.m10);
          break;
        case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
          dst.setLocation(x * this.m00 + this.m02, y * this.m11 + this.m12);
          break;
        case (AffineTransform.APPLY_SCALE):
          dst.setLocation(x * this.m00, y * this.m11);
          break;
        case (AffineTransform.APPLY_TRANSLATE):
          dst.setLocation(x + this.m02, y + this.m12);
          break;
        case (AffineTransform.APPLY_IDENTITY):
          dst.setLocation(x, y);
          break;
      }
    }
  } else {
    // 5 parameters with arrays
    var M00, M01, M02, M10, M11, M12;    // For caching
    if (dstPts === srcPts &&
        dstOff > srcOff && dstOff < srcOff + numPts * 2) {
      System.arraycopy(srcPts, srcOff, dstPts, dstOff, numPts * 2);
      srcOff = dstOff;
    }
    switch (this.state) {
      default:
        this.stateError();
        /* NOTREACHED */
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
        M00 = this.m00; M01 = this.m01; M02 = this.m02;
        M10 = this.m10; M11 = this.m11; M12 = this.m12;
        while (--numPts >= 0) {
          var x = srcPts[srcOff++];
          var y = srcPts[srcOff++];
          dstPts[dstOff++] = M00 * x + M01 * y + M02;
          dstPts[dstOff++] = M10 * x + M11 * y + M12;
        }
        return;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
        M00 = this.m00; M01 = this.m01;
        M10 = this.m10; M11 = this.m11;
        while (--numPts >= 0) {
          var x = srcPts[srcOff++];
          var y = srcPts[srcOff++];
          dstPts[dstOff++] = M00 * x + M01 * y;
          dstPts[dstOff++] = M10 * x + M11 * y;
        }
        return;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
        M01 = this.m01; M02 = this.m02;
        M10 = this.m10; M12 = this.m12;
        while (--numPts >= 0) {
          var x = srcPts[srcOff++];
          dstPts[dstOff++] = M01 * srcPts[srcOff++] + M02;
          dstPts[dstOff++] = M10 * x + M12;
        }
        return;
      case (AffineTransform.APPLY_SHEAR):
        M01 = this.m01; M10 = this.m10;
        while (--numPts >= 0) {
          var x = srcPts[srcOff++];
          dstPts[dstOff++] = M01 * srcPts[srcOff++];
          dstPts[dstOff++] = M10 * x;
        }
        return;
      case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
        M00 = this.m00; M02 = this.m02;
        M11 = this.m11; M12 = this.m12;
        while (--numPts >= 0) {
          dstPts[dstOff++] = M00 * srcPts[srcOff++] + M02;
          dstPts[dstOff++] = M11 * srcPts[srcOff++] + M12;
        }
        return;
      case (AffineTransform.APPLY_SCALE):
        M00 = this.m00; M11 = this.m11;
        while (--numPts >= 0) {
          dstPts[dstOff++] = M00 * srcPts[srcOff++];
          dstPts[dstOff++] = M11 * srcPts[srcOff++];
        }
        return;
      case (AffineTransform.APPLY_TRANSLATE):
        M02 = this.m02; M12 = this.m12;
        while (--numPts >= 0) {
          dstPts[dstOff++] = srcPts[srcOff++] + M02;
          dstPts[dstOff++] = srcPts[srcOff++] + M12;
        }
        return;
      case (AffineTransform.APPLY_IDENTITY):
        if (srcPts !== dstPts || srcOff !== dstOff) {
          System.arraycopy(srcPts, srcOff, dstPts, dstOff, numPts * 2);
        }
        return;
    }
  }
}

AffineTransform.prototype.inverseTransform = function(srcPts, srcOff, dstPts, dstOff, numPts) {
  if (dstPts === undefined) {
    // 2 Point2D parameters
    var ptSrc = srcPts;
    var ptDst = srcOff;
    
    if (ptDst === null) {
      ptDst = new Point2D();
    }
    // Copy source coords into local variables in case src === dst
    var x = ptSrc.getX();
    var y = ptSrc.getY();
    switch (this.state) {
    default:
      this.stateError();
        /* NOTREACHED */
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
        x -= this.m02;
        y -= this.m12;
        /* NOBREAK */
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
        var det = this.m00 * this.m11 - this.m01 * this.m10;
        if (Math.abs(det) <= Number.MIN_VALUE) {
          throw new NoninvertibleTransformException("Determinant is "+ det);
        }
        ptDst.setLocation((x * this.m11 - y * this.m01) / det,
                          (y * this.m00 - x * this.m10) / det);
        return ptDst;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
        x -= this.m02;
        y -= this.m12;
        /* NOBREAK */
      case (AffineTransform.APPLY_SHEAR):
        if (this.m01 === 0.0 || this.m10 === 0.0) {
            throw new NoninvertibleTransformException("Determinant is 0");
        }
        ptDst.setLocation(y / this.m10, x / this.m01);
        return ptDst;
      case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
        x -= this.m02;
        y -= this.m12;
        /* NOBREAK */
      case (AffineTransform.APPLY_SCALE):
        if (this.m00 === 0.0 || this.m11 === 0.0) {
            throw new NoninvertibleTransformException("Determinant is 0");
        }
        ptDst.setLocation(x / this.m00, y / this.m11);
        return ptDst;
      case (AffineTransform.APPLY_TRANSLATE):
        ptDst.setLocation(x - this.m02, y - this.m12);
        return ptDst;
      case (AffineTransform.APPLY_IDENTITY):
        ptDst.setLocation(x, y);
        return ptDst;
    }
  } else {
    var M00, M01, M02, M10, M11, M12;    // For caching
    var det;
    if (dstPts === srcPts &&
        dstOff > srcOff && dstOff < srcOff + numPts * 2) {
      System.arraycopy(srcPts, srcOff, dstPts, dstOff, numPts * 2);
      // srcPts = dstPts;         // They are known to be equal.
      srcOff = dstOff;
    }
    switch (this.state) {
      default:
        this.stateError();
        /* NOTREACHED */
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
        M00 = this.m00; M01 = this.m01; M02 = this.m02;
        M10 = this.m10; M11 = this.m11; M12 = this.m12;
        det = M00 * M11 - M01 * M10;
        if (Math.abs(det) <= Number.MIN_VALUE) {
          throw new NoninvertibleTransformException("Determinant is "+ det);
        }
        while (--numPts >= 0) {
          var x = srcPts[srcOff++] - M02;
          var y = srcPts[srcOff++] - M12;
          dstPts[dstOff++] = (x * M11 - y * M01) / det;
          dstPts[dstOff++] = (y * M00 - x * M10) / det;
        }
        return;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
        M00 = this.m00; M01 = this.m01;
        M10 = this.m10; M11 = this.m11;
        det = M00 * M11 - M01 * M10;
        if (Math.abs(det) <= Number.MIN_VALUE) {
          throw new NoninvertibleTransformException("Determinant is "+ det);
        }
        while (--numPts >= 0) {
          var x = srcPts[srcOff++];
          var y = srcPts[srcOff++];
          dstPts[dstOff++] = (x * M11 - y * M01) / det;
          dstPts[dstOff++] = (y * M00 - x * M10) / det;
        }
        return;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
        M01 = this.m01; M02 = this.m02;
        M10 = this.m10; M12 = this.m12;
        if (M01 === 0.0 || M10 === 0.0) {
          throw new NoninvertibleTransformException("Determinant is 0");
        }
        while (--numPts >= 0) {
          var x = srcPts[srcOff++] - M02;
          dstPts[dstOff++] = (srcPts[srcOff++] - M12) / M10;
          dstPts[dstOff++] = x / M01;
        }
        return;
      case (AffineTransform.APPLY_SHEAR):
        M01 = this.m01; M10 = this.m10;
        if (M01 === 0.0 || M10 === 0.0) {
          throw new NoninvertibleTransformException("Determinant is 0");
        }
        while (--numPts >= 0) {
          var x = srcPts[srcOff++];
          dstPts[dstOff++] = srcPts[srcOff++] / M10;
          dstPts[dstOff++] = x / M01;
        }
        return;
      case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
        M00 = this.m00; M02 = this.m02;
        M11 = this.m11; M12 = this.m12;
        if (M00 === 0.0 || M11 === 0.0) {
          throw new NoninvertibleTransformException("Determinant is 0");
        }
        while (--numPts >= 0) {
          dstPts[dstOff++] = (srcPts[srcOff++] - M02) / M00;
          dstPts[dstOff++] = (srcPts[srcOff++] - M12) / M11;
        }
        return;
      case (AffineTransform.APPLY_SCALE):
        M00 = this.m00; M11 = this.m11;
        if (M00 === 0.0 || M11 === 0.0) {
          throw new NoninvertibleTransformException("Determinant is 0");
        }
        while (--numPts >= 0) {
          dstPts[dstOff++] = srcPts[srcOff++] / M00;
          dstPts[dstOff++] = srcPts[srcOff++] / M11;
        }
        return;
      case (AffineTransform.APPLY_TRANSLATE):
        M02 = this.m02; M12 = this.m12;
        while (--numPts >= 0) {
          dstPts[dstOff++] = srcPts[srcOff++] - M02;
          dstPts[dstOff++] = srcPts[srcOff++] - M12;
        }
        return;
      case (AffineTransform.APPLY_IDENTITY):
        if (srcPts !== dstPts || srcOff !== dstOff) {
          System.arraycopy(srcPts, srcOff, dstPts, dstOff, numPts * 2);
        }
        return;
    }
  }
}

AffineTransform.prototype.deltaTransform = function(srcPts, srcOff, dstPts, dstOff, numPts) {
  if (dstPts === undefined) {
     // 2 Point2D parameters
    var ptSrc = srcPts;
    var ptDst = srcOff;
    if (ptDst === null) {
      ptDst = new Point2D();
    }
    var x = ptSrc.getX();
    var y = ptSrc.getY();
    switch (this.state) {
      default:
      this.stateError();
        /* NOTREACHED */
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
        ptDst.setLocation(x * this.m00 + y * this.m01, x * this.m10 + y * this.m11);
        return ptDst;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
      case (AffineTransform.APPLY_SHEAR):
        ptDst.setLocation(y * this.m01, x * this.m10);
        return ptDst;
      case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      case (AffineTransform.APPLY_SCALE):
        ptDst.setLocation(x * this.m00, y * this.m11);
        return ptDst;
      case (AffineTransform.APPLY_TRANSLATE):
      case (AffineTransform.APPLY_IDENTITY):
        ptDst.setLocation(x, y);
        return ptDst;
    }
  } else {
    var M00, M01, M10, M11;      // For caching
    if (dstPts === srcPts &&
      dstOff > srcOff && dstOff < srcOff + numPts * 2) {
      System.arraycopy(srcPts, srcOff, dstPts, dstOff, numPts * 2);
      // srcPts = dstPts;         // They are known to be equal.
      srcOff = dstOff;
    }
    switch (this.state) {
      default:
        this.stateError();
          /* NOTREACHED */
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_SCALE):
        M00 = this.m00; M01 = this.m01;
        M10 = this.m10; M11 = this.m11;
        while (--numPts >= 0) {
          var x = srcPts[srcOff++];
          var y = srcPts[srcOff++];
          dstPts[dstOff++] = x * M00 + y * M01;
          dstPts[dstOff++] = x * M10 + y * M11;
        }
        return;
      case (AffineTransform.APPLY_SHEAR | AffineTransform.APPLY_TRANSLATE):
      case (AffineTransform.APPLY_SHEAR):
        M01 = this.m01; M10 = this.m10;
        while (--numPts >= 0) {
          var x = srcPts[srcOff++];
          dstPts[dstOff++] = srcPts[srcOff++] * M01;
          dstPts[dstOff++] = x * M10;
        }
        return;
      case (AffineTransform.APPLY_SCALE | AffineTransform.APPLY_TRANSLATE):
      case (AffineTransform.APPLY_SCALE):
        M00 = this.m00; M11 = this.m11;
        while (--numPts >= 0) {
          dstPts[dstOff++] = srcPts[srcOff++] * M00;
          dstPts[dstOff++] = srcPts[srcOff++] * M11;
        }
        return;
      case (AffineTransform.APPLY_TRANSLATE):
      case (AffineTransform.APPLY_IDENTITY):
        if (srcPts !== dstPts || srcOff !== dstOff) {
          System.arraycopy(srcPts, srcOff, dstPts, dstOff, numPts * 2);
        }
        return;
    }
  }
}

AffineTransform.prototype.createTransformedShape = function(pSrc) {
  if (pSrc === null) {
    return null;
  }
  return new Path2D(pSrc, this);
}

AffineTransform.prototype.isIdentity = function() {
  return (this.state === AffineTransform.APPLY_IDENTITY || (this.getType() === AffineTransform.TYPE_IDENTITY));
}

AffineTransform.prototype.clone = function() {
  return new AffineTransform(this);
}

AffineTransform.prototype.equals = function(obj) {
  if (!(obj instanceof AffineTransform)) {
      return false;
  }
  return ((this.m00 === obj.m00) && (this.m01 === obj.m01) && (this.m02 === obj.m02) &&
          (this.m10 === obj.m10) && (this.m11 === obj.m11) && (this.m12 === obj.m12));
}


/**
 * Constructs a new Path2D object.
 * Adapted from java.awt.geom.Path2D
 * @constructor
 */
function Path2D(s, at) {
  this.numTypes = 0;
  this.numCoords = 0;
  if (s === undefined) {
    // No parameter
    this.setWindingRule(PathIterator.WIND_NON_ZERO);
    this.pointTypes = new Array(Point2D.INIT_SIZE);
    this.pointCoords = new Array(Point2D.INIT_SIZE * 2);
    return;
  } else if (at === undefined) {
    // 1 parameter
    if (typeof s === "object") {
      at = null;
    } else {
      var rule = s;
      this.setWindingRule(rule);
      this.pointTypes = new Array(Point2D.INIT_SIZE);
      this.pointCoords = new Array(Point2D.INIT_SIZE * 2);
      return;
    }
  } else {
    if (typeof s !== "object") {
      var rule = s;
      var initialCapacity = at;
      this.setWindingRule(rule);
      this.pointTypes = new Array(initialCapacity);
      this.pointCoords = new Array(initialCapacity * 2);
      return;
    }
  }
  
  if (s instanceof Path2D) {
    var p2d = s;
    this.setWindingRule(p2d.windingRule);
    this.numTypes = p2d.numTypes;
    this.pointTypes = p2d.pointTypes.splice(0);
    this.numCoords = p2d.numCoords;
    this.pointCoords = p2d.cloneCoordsFloat(at);
  } else {
    var pi = s.getPathIterator(at);
    this.setWindingRule(pi.getWindingRule());
    this.pointTypes = new Array(Point2D.INIT_SIZE);
    this.pointCoords = new Array(Point2D.INIT_SIZE * 2);
    this.append(pi, false);
  }
}

Point2D.INIT_SIZE = 20;
Point2D.EXPAND_MAX = 500;

Path2D.prototype.cloneCoordsFloat = function(at) {
  var ret;
  if (at === null) {
    ret = this.pointCoords.splice(0);
  } else {
    ret = new Array(this.pointCoords.length);
    at.transform(this.pointCoords, 0, ret, 0, this.numCoords / 2);
  }
  return ret;
}

Path2D.prototype.append = function(s, connect) {
  if (s instanceof PathIterator) {
    var pi = s;
    var coords = new Array(6);
    while (!pi.isDone()) {
      switch (pi.currentSegment(coords)) {
        case PathIterator.SEG_MOVETO:
          if (!connect || this.numTypes < 1 || this.numCoords < 1) {
            this.moveTo(coords[0], coords[1]);
            break;
          }
          if (this.pointTypes[this.numTypes - 1] !== PathIterator.SEG_CLOSE &&
              this.pointCoords[this.numCoords-2] === coords[0] &&
              this.pointCoords[this.numCoords-1] === coords[1])
          {
            // Collapse out initial moveto/lineto
            break;
          }
          this.lineTo(coords[0], coords[1]);
          break;
        case PathIterator.SEG_LINETO:
          this.lineTo(coords[0], coords[1]);
          break;
        case PathIterator.SEG_QUADTO:
          this.quadTo(coords[0], coords[1],
              coords[2], coords[3]);
          break;
        case PathIterator.SEG_CUBICTO:
          this.curveTo(coords[0], coords[1],
              coords[2], coords[3],
              coords[4], coords[5]);
          break;
        case PathIterator.SEG_CLOSE:
          this.closePath();
          break;
      }
      pi.next();
      connect = false;
    }
  } else if (typeof s === "object") {
    this.append(s.getPathIterator(null), connect);
  } else {
    var x = s;
    var y = connect;
    this.pointCoords[this.numCoords++] = x;
    this.pointCoords[this.numCoords++] = y;
  }
}

Point2D.prototype.getPoint = function(coordindex) {
  return new Point2D(this.pointCoords[coordindex],
                     this.pointCoords[coordindex+1]);
}

Path2D.prototype.needRoom = function(needMove, newCoords) {
  if (needMove && this.numTypes === 0) {
    throw new IllegalPathStateException("missing initial moveto in path definition");
  }
  var size = this.pointTypes.length;
  if (this.numTypes >= size) {
    var grow = size;
    if (grow > Point2D.EXPAND_MAX) {
      grow = Point2D.EXPAND_MAX;
    }
    this.pointTypes.push.apply(this.pointTypes, new Array(grow));
  }
  size = this.pointCoords.length;
  if (this.numCoords + newCoords > size) {
    var grow = size;
    if (grow > Point2D.EXPAND_MAX * 2) {
      grow = Point2D.EXPAND_MAX * 2;
    }
    if (grow < newCoords) {
      grow = newCoords;
    }
    this.pointCoords.push.apply(this.pointCoords, new Array(grow));
  }
}

Path2D.prototype.moveTo = function(x, y) {
  if (this.numTypes > 0 && this.pointTypes[this.numTypes - 1] === PathIterator.SEG_MOVETO) {
    this.pointCoords[this.numCoords-2] = x;
    this.pointCoords[this.numCoords-1] = y;
  } else {
    this.needRoom(false, 2);
    this.pointTypes[this.numTypes++] = PathIterator.SEG_MOVETO;
    this.pointCoords[this.numCoords++] = x;
    this.pointCoords[this.numCoords++] = y;
  }
}

Path2D.prototype.lineTo = function(x, y) {
  this.needRoom(true, 2);
  this.pointTypes[this.numTypes++] = PathIterator.SEG_LINETO;
  this.pointCoords[this.numCoords++] = x;
  this.pointCoords[this.numCoords++] = y;
}

Path2D.prototype.quadTo = function(x1, y1, x2, y2) {
  this.needRoom(true, 4);
  this.pointTypes[this.numTypes++] = PathIterator.SEG_QUADTO;
  this.pointCoords[this.numCoords++] = x1;
  this.pointCoords[this.numCoords++] = y1;
  this.pointCoords[this.numCoords++] = x2;
  this.pointCoords[this.numCoords++] = y2;
}

Path2D.prototype.curveTo = function(x1, y1, x2, y2, x3, y3) {
  this.needRoom(true, 6);
  this.pointTypes[this.numTypes++] = PathIterator.SEG_CUBICTO;
  this.pointCoords[this.numCoords++] = x1;
  this.pointCoords[this.numCoords++] = y1;
  this.pointCoords[this.numCoords++] = x2;
  this.pointCoords[this.numCoords++] = y2;
  this.pointCoords[this.numCoords++] = x3;
  this.pointCoords[this.numCoords++] = y3;
}

Path2D.prototype.pointCrossings = function(px, py) {
  var movx, movy, curx, cury, endx, endy;
  var coords = this.pointCoords;
  curx = movx = coords[0];
  cury = movy = coords[1];
  var crossings = 0;
  var ci = 2;
  for (var i = 1; i < this.numTypes; i++) {
    switch (this.pointTypes[i]) {
      case PathIterator.SEG_MOVETO:
        if (cury !== movy) {
          crossings += Curve.pointCrossingsForLine(px, py,
                curx, cury,
                movx, movy);
        }
        movx = curx = coords[ci++];
        movy = cury = coords[ci++];
        break;
      case PathIterator.SEG_LINETO:
        crossings += Curve.pointCrossingsForLine(px, py,
              curx, cury,
              endx = coords[ci++],
              endy = coords[ci++]);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_QUADTO:
        crossings += Curve.pointCrossingsForQuad(px, py,
              curx, cury,
              coords[ci++],
              coords[ci++],
              endx = coords[ci++],
              endy = coords[ci++],
              0);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_CUBICTO:
        crossings += Curve.pointCrossingsForCubic(px, py,
              curx, cury,
              coords[ci++],
              coords[ci++],
              coords[ci++],
              coords[ci++],
              endx = coords[ci++],
              endy = coords[ci++],
              0);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_CLOSE:
        if (cury !== movy) {
          crossings += Curve.pointCrossingsForLine(px, py,
                curx, cury,
                movx, movy);
        }
        curx = movx;
        cury = movy;
        break;
    }
  }
  if (cury !== movy) {
    crossings += Curve.pointCrossingsForLine(px, py,
          curx, cury,
          movx, movy);
  }
  return crossings;
}

Path2D.prototype.rectCrossings = function(rxmin, rymin, rxmax, rymax) {
  var coords = this.pointCoords;
  var curx, cury, movx, movy, endx, endy;
  curx = movx = coords[0];
  cury = movy = coords[1];
  var crossings = 0;
  var ci = 2;
  for (var i = 1; crossings !== Curve.RECT_INTERSECTS && i < this.numTypes; i++) {
    switch (this.pointTypes[i]) {
      case PathIterator.SEG_MOVETO:
        if (curx !== movx || cury !== movy) {
          crossings = Curve.rectCrossingsForLine(crossings,
                rxmin, rymin,
                rxmax, rymax,
                curx, cury,
                movx, movy);
        }
        movx = curx = coords[ci++];
        movy = cury = coords[ci++];
        break;
      case PathIterator.SEG_LINETO:
        crossings = Curve.rectCrossingsForLine(crossings,
              rxmin, rymin,
              rxmax, rymax,
              curx, cury,
              endx = coords[ci++],
              endy = coords[ci++]);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_QUADTO:
        crossings = Curve.rectCrossingsForQuad(crossings,
              rxmin, rymin,
              rxmax, rymax,
              curx, cury,
              coords[ci++],
              coords[ci++],
              endx = coords[ci++],
              endy = coords[ci++],
              0);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_CUBICTO:
        crossings = Curve.rectCrossingsForCubic(crossings,
              rxmin, rymin,
              rxmax, rymax,
              curx, cury,
              coords[ci++],
              coords[ci++],
              coords[ci++],
              coords[ci++],
              endx = coords[ci++],
              endy = coords[ci++],
              0);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_CLOSE:
        if (curx !== movx || cury !== movy) {
          crossings = Curve.rectCrossingsForLine(crossings,
                rxmin, rymin,
                rxmax, rymax,
                curx, cury,
                movx, movy);
        }
        curx = movx;
        cury = movy;
        break;
    }
  }
  if (crossings !== Curve.RECT_INTERSECTS &&
      (curx !== movx || cury !== movy)) {
    crossings = Curve.rectCrossingsForLine(crossings,
          rxmin, rymin,
          rxmax, rymax,
          curx, cury,
          movx, movy);
  }
  return crossings;
}

Path2D.prototype.transform = function(at) {
  at.transform(this.pointCoords, 0, this.pointCoords, 0, this.numCoords / 2);
}

Path2D.prototype.getBounds2D = function() {
  var x1, y1, x2, y2;
  var i = this.numCoords;
  if (i > 0) {
    y1 = y2 = this.pointCoords[--i];
    x1 = x2 = this.pointCoords[--i];
    while (i > 0) {
      var y = this.pointCoords[--i];
      var x = this.pointCoords[--i];
      if (x < x1) x1 = x;
      if (y < y1) y1 = y;
      if (x > x2) x2 = x;
      if (y > y2) y2 = y;
    }
  } else {
    x1 = y1 = x2 = y2 = 0.;
  }
  return new Rectangle2D(x1, y1, x2 - x1, y2 - y1);
}

Path2D.prototype.closePath = function() {
  if (this.numTypes === 0 || this.pointTypes[this.numTypes - 1] !== PathIterator.SEG_CLOSE) {
    this.needRoom(true, 0);
    this.pointTypes[this.numTypes++] = PathIterator.SEG_CLOSE;
  }
}

Path2D.prototype.getWindingRule = function() {
  return this.windingRule;
}

Path2D.prototype.setWindingRule = function(rule) {
  if (rule !== PathIterator.WIND_EVEN_ODD && rule !== PathIterator.WIND_NON_ZERO) {
    throw new IllegalArgumentException("winding rule must be WIND_EVEN_ODD or WIND_NON_ZERO");
  }
  this.windingRule = rule;
}

Path2D.prototype.getCurrentPoint = function() {
  var index = this.numCoords;
  if (this.numTypes < 1 || index < 1) {
    return null;
  }
  if (this.pointTypes[this.numTypes - 1] === PathIterator.SEG_CLOSE) {
    loop:
      for (var i = this.numTypes - 2; i > 0; i--) {
        switch (this.pointTypes[i]) {
        case PathIterator.SEG_MOVETO:
          break loop;
        case PathIterator.SEG_LINETO:
          index -= 2;
          break;
        case PathIterator.SEG_QUADTO:
          index -= 4;
          break;
        case PathIterator.SEG_CUBICTO:
          index -= 6;
          break;
        case PathIterator.SEG_CLOSE:
          break;
        }
      }
  }
  return this.getPoint(index - 2);
}

Path2D.prototype.reset = function() {
  this.numTypes = this.numCoords = 0;
}

Path2D.prototype.createTransformedShape = function(at) {
  var p2d = this.clone();
  if (at != null) {
    p2d.transform(at);
  }
  return p2d;
}

Path2D.contains = function(pi, x, y, w, h) {
  if (y === undefined) {
    // 2 parameters
    if (x instanceof Rectangle2D) {
      var r = x;
      return Path2D.contains(pi, r.getX(), r.getY(), r.getWidth(), r.getHeight());
    } else {
      var p = x;
      return Path2D.contains(pi, p.getX(), p.getY()); 
    }
  } else if (w === undefined) {
    // 3 parameters
    if (x * 0.0 + y * 0.0 === 0.0) {
      var mask = (pi.getWindingRule() === PathIterator.WIND_NON_ZERO ? -1 : 1);
      var cross = Curve.pointCrossingsForPath(pi, x, y);
      return ((cross & mask) !== 0);
    } else {
      return false;
    }
  } else {
    if (isNaN(x+w) || isNaN(y+h)) {
      return false;
    }
    if (w <= 0 || h <= 0) {
      return false;
    }
    var mask = (pi.getWindingRule() === PathIterator.WIND_NON_ZERO ? -1 : 2);
    var crossings = Curve.rectCrossingsForPath(pi, x, y, x+w, y+h);
    return (crossings !== Curve.RECT_INTERSECTS &&
        (crossings & mask) !== 0);
  }
}

Path2D.prototype.contains = function(x, y, w, h) {
  if (y === undefined) {
    // 1 parameter
    if (x instanceof Rectangle2D) {
      var r = x;
      return this.contains(r.getX(), r.getY(), r.getWidth(), r.getHeight());
    } else {
      var p = x;
      return this.contains(p.getX(), p.getY());
    }
  } else if (w === undefined) {
    // 2 parameters
    if (x * 0.0 + y * 0.0 === 0.0) {
      if (this.numTypes < 2) {
        return false;
      }
      var mask = (this.windingRule === PathIterator.WIND_NON_ZERO ? -1 : 1);
      return ((this.pointCrossings(x, y) & mask) !== 0);
    } else {
      return false;
    }
  } else {
    if (isNaN(x+w) || isNaN(y+h)) {
      return false;
    }
    if (w <= 0 || h <= 0) {
      return false;
    }
    var mask = (this.windingRule === PathIterator.WIND_NON_ZERO ? -1 : 2);
    var crossings = this.rectCrossings(x, y, x+w, y+h);
    return (crossings !== Curve.RECT_INTERSECTS &&
        (crossings & mask) !== 0);
  }
}

Path2D.intersects = function(pi, x, y, w, h) {
  if (y === undefined) {
    // 2 parameters
    var r = x;
    return Path2D.intersects(pi, r.getX(), r.getY(), r.getWidth(), r.getHeight());
  } else {
    if (isNaN(x+w) || isNaN(y+h)) {
      return false;
    }
    if (w <= 0 || h <= 0) {
      return false;
    }
    var mask = (pi.getWindingRule() === PathIterator.WIND_NON_ZERO ? -1 : 2);
    var crossings = Curve.rectCrossingsForPath(pi, x, y, x+w, y+h);
    return (crossings === Curve.RECT_INTERSECTS ||
        (crossings & mask) !== 0);
  }
}

Path2D.prototype.intersects = function(x, y, w, h) {
  if (y === undefined) {
    // 1 parameter
    var r = y;
    return this.intersects(r.getX(), r.getY(), r.getWidth(), r.getHeight());
  } else if (h === undefined) {
    if (isNaN(x+w) || isNaN(y+h)) {
      return false;
    }
    if (w <= 0 || h <= 0) {
      return false;
    }
    var mask = (this.windingRule === PathIterator.WIND_NON_ZERO ? -1 : 2);
    var crossings = this.rectCrossings(x, y, x+w, y+h);
    return (crossings === Curve.RECT_INTERSECTS ||
        (crossings & mask) !== 0);
  }
}

Path2D.prototype.getPathIterator = function(at, flatness)  {
  if (flatness === undefined) {
    if (at === null) {
      return new Path2DCopyIterator(this);
    } else {
      return new Path2DTxIterator(this, at);
    }
  } else {
    return new FlatteningPathIterator(this.getPathIterator(at), flatness);
  }
}

Path2D.prototype.clone = function() {
  if (this instanceof GeneralPath) {
    return new GeneralPath(this);
  } else {
    return new Path2D(this);
  }
}

/**
 * Path2D iterators.
 * @constructor
 * @extends PathIterator
 * @package
 */
function Path2DIterator(path) {
  this.path = path;
  this.typeIdx = 0;
  this.pointIdx = 0;
}
Path2DIterator.prototype = Object.create(PathIterator.prototype);
Path2DIterator.prototype.constructor = Path2DIterator;

Path2DIterator.curvecoords = [2, 2, 4, 6, 0];

Path2DIterator.prototype.getWindingRule = function() {
  return this.path.getWindingRule();
}

Path2DIterator.prototype.isDone = function() {
  return (this.typeIdx >= this.path.numTypes);
}

Path2DIterator.prototype.next = function() {
  var type = this.path.pointTypes[this.typeIdx++];
  this.pointIdx += Path2DIterator.curvecoords[type];
}


/**
 * @constructor
 * @extends Path2DIterator
 * @package
 */
function Path2DCopyIterator(p2df) {
  Path2DIterator.call(this, p2df);
  this.pointCoords = p2df.pointCoords;
}
Path2DCopyIterator.prototype = Object.create(Path2DIterator.prototype);
Path2DCopyIterator.prototype.constructor = Path2DCopyIterator;

Path2DCopyIterator.prototype.currentSegment = function(coords) {
  var type = this.path.pointTypes[this.typeIdx];
  var numCoords = Path2DIterator.curvecoords[type];
  if (numCoords > 0) {
    System.arraycopy(this.pointCoords, this.pointIdx, coords, 0, numCoords);
  }
  return type;
}


/**
 * @constructor
 * @extends Path2DIterator
 * @package
 */
function Path2DTxIterator(p2df, at) {
  Path2DIterator.call(this, p2df);
  this.pointCoords = p2df.pointCoords;
  this.affine = at;
}
Path2DTxIterator.prototype = Object.create(Path2DIterator.prototype);
Path2DTxIterator.prototype.constructor = Path2DTxIterator;

Path2DTxIterator.prototype.currentSegment = function(coords) {
  var type = this.path.pointTypes[this.typeIdx];
  var numCoords = Path2DIterator.curvecoords[type];
  if (numCoords > 0) {
    this.affine.transform(this.pointCoords, this.pointIdx, coords, 0, numCoords / 2);
  }
  return type;
}


/**
 * Creates a FlatteningPathIterator instance.
 * Adapted from java.awt.geom.FlatteningPathIterator
 * @constructor
 * @extends PathIterator
 */
function FlatteningPathIterator(src, flatness, limit) {
  this.hold = new Array(14);
  this.curx = 0;
  this.cury = 0;
  this.movx = 0;
  this.movy = 0;
  this.holdType = 0;
  this.holdEnd = 0;
  this.holdIndex = 0;
  this.levelIndex = 0;
  this.done = false;

  if (limit === undefined) {
    limit = 10;
  }
  if (flatness < 0.0) {
    throw new IllegalArgumentException("flatness must be >= 0");
  }
  if (limit < 0) {
    throw new IllegalArgumentException("limit must be >= 0");
  }
  this.src = src;
  this.squareflat = flatness * flatness;
  this.limit = limit;
  this.levels = new Array(limit + 1);
  // prime the first path segment
  this.next(false);
}
FlatteningPathIterator.prototype = Object.create(PathIterator.prototype);
FlatteningPathIterator.prototype.constructor = FlatteningPathIterator;

FlatteningPathIterator.GROW_SIZE = 24; 

FlatteningPathIterator.prototype.getFlatness = function() {
  return Math.sqrt(this.squareflat);
}

FlatteningPathIterator.prototype.getRecursionLimit = function() {
  return this.limit;
}

FlatteningPathIterator.prototype.getWindingRule = function() {
  return this.src.getWindingRule();
}

FlatteningPathIterator.prototype.isDone = function() {
  return this.done;
}

FlatteningPathIterator.prototype.ensureHoldCapacity = function(want) {
  if (this.holdIndex - want < 0) {
    var have = this.hold.length - this.holdIndex;
    var newsize = this.hold.length + FlatteningPathIterator.GROW_SIZE;
    var newhold = new Array(newsize);
    System.arraycopy(this.hold, this.holdIndex,
        newhold, this.holdIndex + FlatteningPathIterator.GROW_SIZE,
        have);
    this.hold = newhold;
    this.holdIndex += FlatteningPathIterator.GROW_SIZE;
    this.holdEnd += FlatteningPathIterator.GROW_SIZE;
  }
}

FlatteningPathIterator.prototype.next = function(doNext) {
  if (doNext === undefined) {
    doNext = true;
  }
  var level;  
  if (this.holdIndex >= this.holdEnd) {
    if (doNext) {
      this.src.next();
    }
    if (this.src.isDone()) {
      this.done = true;
      return;
    }
    this.holdType = this.src.currentSegment(this.hold);
    this.levelIndex = 0;
    this.levels[0] = 0;
  }
  
  switch (this.holdType) {
    case PathIterator.SEG_MOVETO:
    case PathIterator.SEG_LINETO:
      this.curx = this.hold[0];
      this.cury = this.hold[1];
      if (this.holdType === PathIterator.SEG_MOVETO) {
        this.movx = this.curx;
        this.movy = this.cury;
      }
      this.holdIndex = 0;
      this.holdEnd = 0;
      break;
    case PathIterator.SEG_CLOSE:
      this.curx = this.movx;
      this.cury = this.movy;
      this.holdIndex = 0;
      this.holdEnd = 0;
      break;
    case PathIterator.SEG_QUADTO:
      if (this.holdIndex >= this.holdEnd) {
        // Move the coordinates to the end of the array.
        this.holdIndex = this.hold.length - 6;
        this.holdEnd = this.hold.length - 2;
        this.hold[this.holdIndex + 0] = this.curx;
        this.hold[this.holdIndex + 1] = this.cury;
        this.hold[this.holdIndex + 2] = this.hold[0];
        this.hold[this.holdIndex + 3] = this.hold[1];
        this.hold[this.holdIndex + 4] = this.curx = this.hold[2];
        this.hold[this.holdIndex + 5] = this.cury = this.hold[3];
      }
      
      level = this.levels[this.levelIndex];
      while (level < this.limit) {
        if (QuadCurve2D.getFlatnessSq(this.hold, this.holdIndex) < this.squareflat) {
          break;
        }
        
        this.ensureHoldCapacity(4);
        QuadCurve2D.subdivide(this.hold, this.holdIndex,
            this.hold, this.holdIndex - 4,
            this.hold, this.holdIndex);
        this.holdIndex -= 4;
        
        level++;
        this.levels[this.levelIndex] = level;
        this.levelIndex++;
        this.levels[this.levelIndex] = level;
      }
      
      this.holdIndex += 4;
      this.levelIndex--;
      break;
    case PathIterator.SEG_CUBICTO:
      if (this.holdIndex >= this.holdEnd) {
        // Move the coordinates to the end of the array.
        this.holdIndex = this.hold.length - 8;
        this.holdEnd = this.hold.length - 2;
        this.hold[this.holdIndex + 0] = this.curx;
        this.hold[this.holdIndex + 1] = this.cury;
        this.hold[this.holdIndex + 2] = this.hold[0];
        this.hold[this.holdIndex + 3] = this.hold[1];
        this.hold[this.holdIndex + 4] = this.hold[2];
        this.hold[this.holdIndex + 5] = this.hold[3];
        this.hold[this.holdIndex + 6] = this.curx = this.hold[4];
        this.hold[this.holdIndex + 7] = this.cury = this.hold[5];
      }
      
      level = this.levels[this.levelIndex];
      while (level < this.limit) {
        if (CubicCurve2D.getFlatnessSq(this.hold, this.holdIndex) < this.squareflat) {
          break;
        }
        
        this.ensureHoldCapacity(6);
        CubicCurve2D.subdivide(this.hold, this.holdIndex,
            this.hold, this.holdIndex - 6,
            this.hold, this.holdIndex);
        this.holdIndex -= 6;
        
        level++;
        this.levels[this.levelIndex] = level;
        this.levelIndex++;
        this.levels[this.levelIndex] = level;
      }
      
      this.holdIndex += 6;
      this.levelIndex--;
      break;
  }
}

FlatteningPathIterator.prototype.currentSegment = function(coords) {
  if (this.isDone()) {
    throw new NoSuchElementException("flattening iterator out of bounds");
  }
  var type = this.holdType;
  if (type !== PathIterator.SEG_CLOSE) {
    coords[0] = this.hold[this.holdIndex + 0];
    coords[1] = this.hold[this.holdIndex + 1];
    if (type !== PathIterator.SEG_MOVETO) {
      type = PathIterator.SEG_LINETO;
    }
  }
  return type;
}


/**
 * Constructs a new <code>GeneralPath</code> object.
 * Adpated from java.awt.geom.GeneralPath
 * @constructor
 * @extends Path2D
 */
function GeneralPath(windingRule, pointTypes, numTypes, pointCoords, numCoords) {
  if (windingRule === undefined) {
    // No parameter
    Path2D.call(this, PathIterator.WIND_NON_ZERO, Point2D.INIT_SIZE);
  } else if (pointTypes === undefined) {
    // 1 parameter
    if (typeof windingRule === "object") {
      var s = windingRule;
      Path2D.call(this, s, null);
    } else {
      Path2D.call(this, windingRule, Point2D.INIT_SIZE);
    }
  } else if (numTypes === undefined) {
    // 2 parameters
    var rule = windingRule;
    var initialCapacity = pointTypes;
    Path2D.call(this, rule, initialCapacity);
  } else {
    this.windingRule = windingRule;
    this.pointTypes = pointTypes;
    this.numTypes = numTypes;
    this.pointCoords = pointCoords;
    this.numCoords = numCoords;
  }
}
GeneralPath.prototype = Object.create(Path2D.prototype);
GeneralPath.prototype.constructor = GeneralPath;

GeneralPath.intersects = Path2D.intersects;
GeneralPath.contains   = Path2D.contains;


/**
 * A quadratic parametric curve segment.
 * Adpated from java.awt.geom.QuadCurve2D
 * @constructor
 */
function QuadCurve2D(x1, y1, ctrlx, ctrly, x2, y2) {
  if (x1 === undefined) {
    this.setCurve(0, 0, 0, 0, 0, 0);
  } else {
    this.setCurve(x1, y1, ctrlx, ctrly, x2, y2);
  }
}

QuadCurve2D.BELOW = -2;
QuadCurve2D.LOWEDGE = -1;
QuadCurve2D.INSIDE = 0;
QuadCurve2D.HIGHEDGE = 1;
QuadCurve2D.ABOVE = 2;

QuadCurve2D.prototype.getX1 = function() {
  return this.x1;
}

QuadCurve2D.prototype.getY1 = function() {
  return this.y1;
}

QuadCurve2D.prototype.getP1 = function() {
  return new Point2D(this.x1, this.y1);
}

QuadCurve2D.prototype.getCtrlX = function() {
  return this.ctrlx;
}

QuadCurve2D.prototype.getCtrlY = function() {
  return this.ctrly;
}

QuadCurve2D.prototype.getCtrlPt = function() {
  return new Point2D(this.ctrlx, this.ctrly);
}

QuadCurve2D.prototype.getX2 = function() {
  return this.x2;
}

QuadCurve2D.prototype.getY2 = function() {
  return this.y2;
}

QuadCurve2D.prototype.getP2 = function() {
  return new Point2D(this.x2, this.y2);
}

QuadCurve2D.prototype.setCurve = function(x1, y1, ctrlx, ctrly, x2, y2) {
  if (y1 === undefined) {
    // 1 parameter
    var c = x1;
    this.setCurve(c.getX1(), c.getY1(),
                  c.getCtrlX(), c.getCtrlY(),
                  c.getX2(), c.getY2());
  } else if (ctrlx === undefined) {
    // 2 parameters
    var offset = y1;
    if (p1 [0] instanceof Point2D) {
      var coords = x1;
      this.setCurve(coords[offset + 0], coords[offset + 1],
                    coords[offset + 2], coords[offset + 3],
                    coords[offset + 4], coords[offset + 5]);      
    } else {
      var pts = x1;
      this.setCurve(pts[offset + 0].getX(), pts[offset + 0].getY(),
                    pts[offset + 1].getX(), pts[offset + 1].getY(),
                    pts[offset + 2].getX(), pts[offset + 2].getY());
    }
  } else if (ctrly === undefined) {
    // 3 parameters
    var p1 = x1;
    var cp = y1;
    var p2 = ctrlx;
    this.setCurve(p1.getX(), p1.getY(),
                  cp.getX(), cp.getY(),
                  p2.getX(), p2.getY());
  } else {
    this.x1    = x1;
    this.y1    = y1;
    this.ctrlx = ctrlx;
    this.ctrly = ctrly;
    this.x2    = x2;
    this.y2    = y2;
  }
}

QuadCurve2D.prototype.getBounds2D = function() {
  var left   = Math.min(Math.min(this.x1, this.x2), this.ctrlx);
  var top    = Math.min(Math.min(this.y1, this.y2), this.ctrly);
  var right  = Math.max(Math.max(this.x1, this.x2), this.ctrlx);
  var bottom = Math.max(Math.max(this.y1, this.y2), this.ctrly);
  return new Rectangle2D(left, top,
      right - left, bottom - top);
}

QuadCurve2D.getFlatnessSq = function(x1, y1, ctrlx, ctrly, x2, y2) {
  if (ctrlx === undefined) {
    var coords = x1;
    var offset = y1;
    return Line2D.ptSegDistSq(coords[offset + 0], coords[offset + 1],
                              coords[offset + 4], coords[offset + 5],
                              coords[offset + 2], coords[offset + 3]);
  } else {
    return Line2D.ptSegDistSq(x1, y1, x2, y2, ctrlx, ctrly);
  }
}

QuadCurve2D.prototype.getFlatnessSq = function() {
  return Line2D.ptSegDistSq(this.getX1(), this.getY1(),
                            this.getX2(), this.getY2(),
                            this.getCtrlX(), this.getCtrlY());
}

QuadCurve2D.getFlatness = function(x1, y1, ctrlx, ctrly, x2, y2) {
  if (ctrlx === undefined) {
    var coords = x1;
    var offset = y1;
    return Line2D.ptSegDist(coords[offset + 0], coords[offset + 1],
                            coords[offset + 4], coords[offset + 5],
                            coords[offset + 2], coords[offset + 3]);
  } else {
    return Line2D.ptSegDist(x1, y1, x2, y2, ctrlx, ctrly);
  }
}

QuadCurve2D.prototype.getFlatness = function() {
  return Line2D.ptSegDist(this.getX1(), this.getY1(),
                          this.getX2(), this.getY2(),
                          this.getCtrlX(), this.getCtrlY());
}

QuadCurve2D.prototype.subdivide = function(left, right) {
  QuadCurve2D.subdivide(this, left, right);
}

QuadCurve2D.subdivide = function(src, srcoff, left, leftoff, right, rightoff) {
  if (leftoff === undefined) {
    // 3 parameters
    right = left;
    left = srcoff;
    var x1 = src.getX1();
    var y1 = src.getY1();
    var ctrlx = src.getCtrlX();
    var ctrly = src.getCtrlY();
    var x2 = src.getX2();
    var y2 = src.getY2();
    var ctrlx1 = (x1 + ctrlx) / 2.0;
    var ctrly1 = (y1 + ctrly) / 2.0;
    var ctrlx2 = (x2 + ctrlx) / 2.0;
    var ctrly2 = (y2 + ctrly) / 2.0;
    ctrlx = (ctrlx1 + ctrlx2) / 2.0;
    ctrly = (ctrly1 + ctrly2) / 2.0;
    if (left !== null) {
      left.setCurve(x1, y1, ctrlx1, ctrly1, ctrlx, ctrly);
    }
    if (right !== null) {
      right.setCurve(ctrlx, ctrly, ctrlx2, ctrly2, x2, y2);
    }
  } else {
    var x1 = src[srcoff + 0];
    var y1 = src[srcoff + 1];
    var ctrlx = src[srcoff + 2];
    var ctrly = src[srcoff + 3];
    var x2 = src[srcoff + 4];
    var y2 = src[srcoff + 5];
    if (left !== null) {
      left[leftoff + 0] = x1;
      left[leftoff + 1] = y1;
    }
    if (right !== null) {
      right[rightoff + 4] = x2;
      right[rightoff + 5] = y2;
    }
    x1 = (x1 + ctrlx) / 2.0;
    y1 = (y1 + ctrly) / 2.0;
    x2 = (x2 + ctrlx) / 2.0;
    y2 = (y2 + ctrly) / 2.0;
    ctrlx = (x1 + x2) / 2.0;
    ctrly = (y1 + y2) / 2.0;
    if (left !== null) {
      left[leftoff + 2] = x1;
      left[leftoff + 3] = y1;
      left[leftoff + 4] = ctrlx;
      left[leftoff + 5] = ctrly;
    }
    if (right !== null) {
      right[rightoff + 0] = ctrlx;
      right[rightoff + 1] = ctrly;
      right[rightoff + 2] = x2;
      right[rightoff + 3] = y2;
    }
  }
}

QuadCurve2D.solveQuadratic = function(eqn, res) {
  if (res === undefined) {
    return QuadCurve2D.solveQuadratic(eqn, eqn);
  } else {
    var a = [0., 0.];
    var b = eqn[1];
    var c = eqn[0];
    var roots = 0;
    if (a === 0.0) {
      if (b === 0.0) {
        return -1;
      }
      res[roots++] = -c / b;
    } else {
      var d = b * b - 4.0 * a * c;
      if (d < 0.0) {
        return 0;
      }
      d = Math.sqrt(d);
      if (b < 0.0) {
        d = -d;
      }
      var q = (b + d) / -2.0;
      res[roots++] = q / a;
      if (q !== 0.0) {
        res[roots++] = c / q;
      }
    }
    return roots;
  }
}

QuadCurve2D.prototype.contains = function(x, y) {
  if (y === undefined) {
    var p = x;
    return this.contains(p.getX(), p.getY());
  } else {
    var x1 = this.getX1();
    var y1 = this.getY1();
    var xc = this.getCtrlX();
    var yc = this.getCtrlY();
    var x2 = this.getX2();
    var y2 = this.getY2();
    
    var kx = x1 - 2 * xc + x2;
    var ky = y1 - 2 * yc + y2;
    var dx = x - x1;
    var dy = y - y1;
    var dxl = x2 - x1;
    var dyl = y2 - y1;
    
    var t0 = (dx * ky - dy * kx) / (dxl * ky - dyl * kx);
    if (t0 < 0 || t0 > 1 || t0 !== t0) {
      return false;
    }
    
    var xb = kx * t0 * t0 + 2 * (xc - x1) * t0 + x1;
    var yb = ky * t0 * t0 + 2 * (yc - y1) * t0 + y1;
    var xl = dxl * t0 + x1;
    var yl = dyl * t0 + y1;
    
    return (x >= xb && x < xl) ||
           (x >= xl && x < xb) ||
           (y >= yb && y < yl) ||
           (y >= yl && y < yb);
  }
}

QuadCurve2D.fillEqn = function(eqn, val, c1, cp, c2) {
  eqn[0] = c1 - val;
  eqn[1] = cp + cp - c1 - c1;
  eqn[2] = c1 - cp - cp + c2;
}

QuadCurve2D.evalQuadratic = function(vals, num, include0, include1, inflect, c1, ctrl, c2) {
  var j = 0;
  for (var i = 0; i < num; i++) {
    var t = vals[i];
    if ((include0 ? t >= 0 : t > 0) &&
        (include1 ? t <= 1 : t < 1) &&
        (inflect === null ||
            inflect[1] + 2*inflect[2]*t !== 0)) {
      var u = 1 - t;
      vals[j++] = c1*u*u + 2*ctrl*t*u + c2*t*t;
    }
  }
  return j;
}

QuadCurve2D.getTag = function(coord, low, high) {
  if (coord <= low) {
    return (coord < low ? QuadCurve2D.BELOW : QuadCurve2D.LOWEDGE);
  }
  if (coord >= high) {
    return (coord > high ? QuadCurve2D.ABOVE : QuadCurve2D.HIGHEDGE);
  }
  return QuadCurve2D.INSIDE;
}

QuadCurve2D.inwards = function(pttag, opt1tag, opt2tag) {
  switch (pttag) {
    case QuadCurve2D.BELOW:
    case QuadCurve2D.ABOVE:
    default:
      return false;
    case QuadCurve2D.LOWEDGE:
      return (opt1tag >= QuadCurve2D.INSIDE || opt2tag >= QuadCurve2D.INSIDE);
    case QuadCurve2D.INSIDE:
      return true;
    case QuadCurve2D.HIGHEDGE:
      return (opt1tag <= QuadCurve2D.INSIDE || opt2tag <= QuadCurve2D.INSIDE);
    }
}

QuadCurve2D.prototype.intersects = function(x, y, w, h) {
  if (y === undefined) {
    var r = x;
    return this.intersects(r.getX(), r.getY(), r.getWidth(), r.getHeight());
  } else {
    if (w <= 0 || h <= 0) {
      return false;
    }
    
    var x1 = this.getX1();
    var y1 = this.getY1();
    var x1tag = QuadCurve2D.getTag(x1, x, x+w);
    var y1tag = QuadCurve2D.getTag(y1, y, y+h);
    if (x1tag === QuadCurve2D.INSIDE && y1tag === QuadCurve2D.INSIDE) {
      return true;
    }
    var x2 = this.getX2();
    var y2 = this.getY2();
    var x2tag = QuadCurve2D.getTag(x2, x, x+w);
    var y2tag = QuadCurve2D.getTag(y2, y, y+h);
    if (x2tag === QuadCurve2D.INSIDE && y2tag === QuadCurve2D.INSIDE) {
      return true;
    }
    var ctrlx = this.getCtrlX();
    var ctrly = this.getCtrlY();
    var ctrlxtag = QuadCurve2D.getTag(ctrlx, x, x+w);
    var ctrlytag = QuadCurve2D.getTag(ctrly, y, y+h);
    
    // Trivially reject if all points are entirely to one side of
    // the rectangle.
    if (x1tag < QuadCurve2D.INSIDE && x2tag < QuadCurve2D.INSIDE && ctrlxtag < QuadCurve2D.INSIDE) {
      return false;       // All points left
    }
    if (y1tag < QuadCurve2D.INSIDE && y2tag < QuadCurve2D.INSIDE && ctrlytag < QuadCurve2D.INSIDE) {
      return false;       // All points above
    }
    if (x1tag > QuadCurve2D.INSIDE && x2tag > QuadCurve2D.INSIDE && ctrlxtag > QuadCurve2D.INSIDE) {
      return false;       // All points right
    }
    if (y1tag > QuadCurve2D.INSIDE && y2tag > QuadCurve2D.INSIDE && ctrlytag > QuadCurve2D.INSIDE) {
      return false;       // All points below
    }
    
    if (QuadCurve2D.inwards(x1tag, x2tag, ctrlxtag) &&
        QuadCurve2D.inwards(y1tag, y2tag, ctrlytag)) {
      // First endpoint on border with either edge moving inside
      return true;
    }
    if (QuadCurve2D.inwards(x2tag, x1tag, ctrlxtag) &&
        QuadCurve2D.inwards(y2tag, y1tag, ctrlytag)) {
      // Second endpoint on border with either edge moving inside
      return true;
    }
    
    // Trivially accept if endpoints span directly across the rectangle
    var xoverlap = (x1tag * x2tag <= 0);
    var yoverlap = (y1tag * y2tag <= 0);
    if (x1tag === QuadCurve2D.INSIDE && x2tag === QuadCurve2D.INSIDE && yoverlap) {
      return true;
    }
    if (y1tag === QuadCurve2D.INSIDE && y2tag === QuadCurve2D.INSIDE && xoverlap) {
      return true;
    }
    
    var eqn = [0., 0., 0.];
    var res = [0., 0., 0.];
    if (!yoverlap) {
      QuadCurve2D.fillEqn(eqn, (y1tag < QuadCurve2D.INSIDE ? y : y+h), y1, ctrly, y2);
      return (QuadCurve2D.solveQuadratic(eqn, res) === 2 &&
              QuadCurve2D.evalQuadratic(res, 2, true, true, null, x1, ctrlx, x2) === 2 &&
              QuadCurve2D.getTag(res[0], x, x+w) * QuadCurve2D.getTag(res[1], x, x+w) <= 0);
    }
    
    // Y ranges overlap.  Now we examine the X ranges
    if (!xoverlap) {
      QuadCurve2D.fillEqn(eqn, (x1tag < QuadCurve2D.INSIDE ? x : x+w), x1, ctrlx, x2);
      return (QuadCurve2D.solveQuadratic(eqn, res) === 2 &&
              QuadCurve2D.evalQuadratic(res, 2, true, true, null, y1, ctrly, y2) === 2 &&
              QuadCurve2D.getTag(res[0], y, y+h) * QuadCurve2D.getTag(res[1], y, y+h) <= 0);
    }
    
    var dx = x2 - x1;
    var dy = y2 - y1;
    var k = y2 * x1 - x2 * y1;
    var c1tag, c2tag;
    if (y1tag === QuadCurve2D.INSIDE) {
      c1tag = x1tag;
    } else {
      c1tag = QuadCurve2D.getTag((k + dx * (y1tag < QuadCurve2D.INSIDE ? y : y+h)) / dy, x, x+w);
    }
    if (y2tag === QuadCurve2D.INSIDE) {
      c2tag = x2tag;
    } else {
      c2tag = QuadCurve2D.getTag((k + dx * (y2tag < QuadCurve2D.INSIDE ? y : y+h)) / dy, x, x+w);
    }
    if (c1tag * c2tag <= 0) {
      return true;
    }
    
    c1tag = ((c1tag * x1tag <= 0) ? y1tag : y2tag);
    
    QuadCurve2D.fillEqn(eqn, (c2tag < QuadCurve2D.INSIDE ? x : x+w), x1, ctrlx, x2);
    var num = QuadCurve2D.solveQuadratic(eqn, res);
    
    QuadCurve2D.evalQuadratic(res, num, true, true, null, y1, ctrly, y2);
    
    c2tag = QuadCurve2D.getTag(res[0], y, y+h);
    
    return (c1tag * c2tag <= 0);
  }
}

QuadCurve2D.prototype.contains = function(x, y, w, h) {
  if (y === undefined) {
    var r = x;
    return this.contains(r.getX(), r.getY(), r.getWidth(), r.getHeight());
  } else {
    if (w <= 0 || h <= 0) {
      return false;
    }
    return (this.contains(x, y) &&
            this.contains(x + w, y) &&
            this.contains(x + w, y + h) &&
            this.contains(x, y + h));
  }
}

QuadCurve2D.prototype.getPathIterator = function(at, flatness) {
  if (flatness === undefined) {
    return new QuadIterator(this, at);
  } else {
    return new FlatteningPathIterator(this.getPathIterator(at), flatness);
  }
}

QuadCurve2D.prototype.clone = function() {
  return new QuadCurve2D(this.x1, this.y1, this.ctrlx, this.ctrly, this.x2, this.y2);
}


/**
 * Creates an iterator able to iterate over the path segments of a quadratic curve
 * segment through the PathIterator interface.
 * Adpated from java.awt.geomQuadIterator
 * @constructor
 * @extends PathIterator 
 * @package
 */
function QuadIterator(q, at) {
  this.quad = q;
  this.affine = at;
  this.index = 0;
}
QuadIterator.prototype = Object.create(PathIterator.prototype);
QuadIterator.prototype.constructor = QuadIterator;

QuadIterator.prototype.getWindingRule = function() {
  return PathIterator.WIND_NON_ZERO;
}

QuadIterator.prototype.isDone = function() {
 return (this.index > 1);
}

QuadIterator.prototype.next = function() {
  this.index++;
}

QuadIterator.prototype.currentSegment = function(coords) {
  if (this.isDone()) {
    throw new NoSuchElementException("quad iterator iterator out of bounds");
  }
  var type;
  if (this.index === 0) {
    coords[0] = this.quad.getX1();
    coords[1] = this.quad.getY1();
    type = PathIterator.SEG_MOVETO;
  } else {
    coords[0] = this.quad.getCtrlX();
    coords[1] = this.quad.getCtrlY();
    coords[2] = this.quad.getX2();
    coords[3] = this.quad.getY2();
    type = PathIterator.SEG_QUADTO;
  }
  if (this.affine !== null) {
    this.affine.transform(coords, 0, coords, 0, this.index === 0 ? 1 : 2);
  }
  return type;
}


/**
 * Creates a CubicCurve2D instance.
 * Adapted from java.awt.geom.CubicCurve2D
 * @constructor
 */
function CubicCurve2D(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2) {
  if (x1 === undefined) {
    this.setCurve(0., 0., 0., 0., 0., 0., 0., 0.);
  } else {
    this.setCurve(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2);
  }
}

CubicCurve2D.prototype.getX1 = function() {
  return this.x1;
}

CubicCurve2D.prototype.getY1 = function() {
  return this.y1;
}

CubicCurve2D.prototype.getP1 = function() {
  return new Point2D.Float(this.x1, this.y1);
}

CubicCurve2D.prototype.getCtrlX1 = function() {
  return this.ctrlx1;
}

CubicCurve2D.prototype.getCtrlY1 = function() {
  return this.ctrly1;
}

CubicCurve2D.prototype.getCtrlP1 = function() {
  return new Point2D.Float(this.ctrlx1, this.ctrly1);
}

CubicCurve2D.prototype.getCtrlX2 = function() {
  return this.ctrlx2;
}

CubicCurve2D.prototype.getCtrlY2 = function() {
  return this.ctrly2;
}

CubicCurve2D.prototype.getCtrlP2 = function() {
  return new Point2D.Float(this.ctrlx2, this.ctrly2);
}

CubicCurve2D.prototype.getX2 = function() {
  return this.x2;
}

CubicCurve2D.prototype.getY2 = function() {
  return this.y2;
}

CubicCurve2D.prototype.getP2 = function() {
  return new Point2D.Float(this.x2, this.y2);
}

CubicCurve2D.prototype.setCurve = function(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2) {
  if (y1 === undefined) {
    // 1 parameter
    var c = x1;
    this.setCurve(c.getX1(), c.getY1(), c.getCtrlX1(), c.getCtrlY1(),
                  c.getCtrlX2(), c.getCtrlY2(), c.getX2(), c.getY2());
  } else if (ctrlx1 === undefined) {
    // 2 parameters
    var offset = y1;
    if (x1 [0] instanceof Point2D) {
      var pts = x1;
      this.setCurve(pts[offset + 0].getX(), pts[offset + 0].getY(),
                    pts[offset + 1].getX(), pts[offset + 1].getY(),
                    pts[offset + 2].getX(), pts[offset + 2].getY(),
                    pts[offset + 3].getX(), pts[offset + 3].getY());
    } else {
      var coords = x1;
      this.setCurve(coords[offset + 0], coords[offset + 1],
                    coords[offset + 2], coords[offset + 3],
                    coords[offset + 4], coords[offset + 5],
                    coords[offset + 6], coords[offset + 7]);
    }
  } else if (ctrlx2 === undefined) {
    var p1 = x1;
    var cp1 = y1;
    var cp2 = ctrlx1;
    var p2 = ctrly1;
    this.setCurve(p1.getX(), p1.getY(), cp1.getX(), cp1.getY(),
                  cp2.getX(), cp2.getY(), p2.getX(), p2.getY());
  } else {
    this.x1     = x1;
    this.y1     = y1;
    this.ctrlx1 = ctrlx1;
    this.ctrly1 = ctrly1;
    this.ctrlx2 = ctrlx2;
    this.ctrly2 = ctrly2;
    this.x2     = x2;
    this.y2     = y2;
  }
}

CubicCurve2D.prototype.getBounds2D = function() {
  var left   = Math.min(Math.min(this.x1, this.x2),
                        Math.min(this.ctrlx1, this.ctrlx2));
  var top    = Math.min(Math.min(this.y1, this.y2),
                        Math.min(this.ctrly1, this.ctrly2));
  var right  = Math.max(Math.max(this.x1, this.x2),
                        Math.max(this.ctrlx1, this.ctrlx2));
  var bottom = Math.max(Math.max(this.y1, this.y2),
                        Math.max(this.ctrly1, this.ctrly2));
  return new Rectangle2D(left, top, right - left, bottom - top);
}

CubicCurve2D.getFlatnessSq = function(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2) {
  if (ctrlx1 === undefined) {
    var coords = x1;
    var offset = y1;
    return this.getFlatnessSq(coords[offset + 0], coords[offset + 1],
                              coords[offset + 2], coords[offset + 3],
                              coords[offset + 4], coords[offset + 5],
                              coords[offset + 6], coords[offset + 7]);
  } else {
    return Math.max(Line2D.ptSegDistSq(x1, y1, x2, y2, ctrlx1, ctrly1),
                    Line2D.ptSegDistSq(x1, y1, x2, y2, ctrlx2, ctrly2));
  }
}

CubicCurve2D.getFlatness = function(x1, y1, ctrlx1, ctrly1, ctrlx2, ctrly2, x2, y2) {
  if (ctrlx1 === undefined) {
    var coords = x1;
    var offset = y1;
    return this.getFlatness(coords[offset + 0], coords[offset + 1],
                            coords[offset + 2], coords[offset + 3],
                            coords[offset + 4], coords[offset + 5],
                            coords[offset + 6], coords[offset + 7]);
  } else {
    return Math.sqrt(this.getFlatnessSq(x1, y1, ctrlx1, ctrly1,
                                        ctrlx2, ctrly2, x2, y2));
  }
}

CubicCurve2D.prototype.getFlatnessSq = function() {
  return CubicCurve2D.getFlatnessSq(this.getX1(), this.getY1(), this.getCtrlX1(), this.getCtrlY1(),
                                    this.getCtrlX2(), this.getCtrlY2(), this.getX2(), this.getY2());
}

CubicCurve2D.prototype.getFlatness = function() {
  return CubicCurve2D.getFlatness(this.getX1(), this.getY1(), this.getCtrlX1(), this.getCtrlY1(),
                                  this.getCtrlX2(), this.getCtrlY2(), this.getX2(), this.getY2());
}

CubicCurve2D.prototype.subdivide = function(left, right) {
  CubicCurve2D.subdivide(this, left, right);
}

CubicCurve2D.subdivide = function(src, srcoff, left, leftoff, right, rightoff) {
  if (leftoff === undefined) {
    right = left;
    left = srcoff;
    var x1 = src.getX1();
    var y1 = src.getY1();
    var ctrlx1 = src.getCtrlX1();
    var ctrly1 = src.getCtrlY1();
    var ctrlx2 = src.getCtrlX2();
    var ctrly2 = src.getCtrlY2();
    var x2 = src.getX2();
    var y2 = src.getY2();
    var centerx = (ctrlx1 + ctrlx2) / 2.0;
    var centery = (ctrly1 + ctrly2) / 2.0;
    ctrlx1 = (x1 + ctrlx1) / 2.0;
    ctrly1 = (y1 + ctrly1) / 2.0;
    ctrlx2 = (x2 + ctrlx2) / 2.0;
    ctrly2 = (y2 + ctrly2) / 2.0;
    var ctrlx12 = (ctrlx1 + centerx) / 2.0;
    var ctrly12 = (ctrly1 + centery) / 2.0;
    var ctrlx21 = (ctrlx2 + centerx) / 2.0;
    var ctrly21 = (ctrly2 + centery) / 2.0;
    centerx = (ctrlx12 + ctrlx21) / 2.0;
    centery = (ctrly12 + ctrly21) / 2.0;
    if (left !== null) {
      left.setCurve(x1, y1, ctrlx1, ctrly1,
                    ctrlx12, ctrly12, centerx, centery);
    }
    if (right !== null) {
      right.setCurve(centerx, centery, ctrlx21, ctrly21,
                     ctrlx2, ctrly2, x2, y2);
    }
  } else {
    var x1 = src[srcoff + 0];
    var y1 = src[srcoff + 1];
    var ctrlx1 = src[srcoff + 2];
    var ctrly1 = src[srcoff + 3];
    var ctrlx2 = src[srcoff + 4];
    var ctrly2 = src[srcoff + 5];
    var x2 = src[srcoff + 6];
    var y2 = src[srcoff + 7];
    if (left !== null) {
      left[leftoff + 0] = x1;
      left[leftoff + 1] = y1;
    }
    if (right !== null) {
      right[rightoff + 6] = x2;
      right[rightoff + 7] = y2;
    }
    x1 = (x1 + ctrlx1) / 2.0;
    y1 = (y1 + ctrly1) / 2.0;
    x2 = (x2 + ctrlx2) / 2.0;
    y2 = (y2 + ctrly2) / 2.0;
    var centerx = (ctrlx1 + ctrlx2) / 2.0;
    var centery = (ctrly1 + ctrly2) / 2.0;
    ctrlx1 = (x1 + centerx) / 2.0;
    ctrly1 = (y1 + centery) / 2.0;
    ctrlx2 = (x2 + centerx) / 2.0;
    ctrly2 = (y2 + centery) / 2.0;
    centerx = (ctrlx1 + ctrlx2) / 2.0;
    centery = (ctrly1 + ctrly2) / 2.0;
    if (left !== null) {
      left[leftoff + 2] = x1;
      left[leftoff + 3] = y1;
      left[leftoff + 4] = ctrlx1;
      left[leftoff + 5] = ctrly1;
      left[leftoff + 6] = centerx;
      left[leftoff + 7] = centery;
    }
    if (right !== null) {
      right[rightoff + 0] = centerx;
      right[rightoff + 1] = centery;
      right[rightoff + 2] = ctrlx2;
      right[rightoff + 3] = ctrly2;
      right[rightoff + 4] = x2;
      right[rightoff + 5] = y2;
    }
  }
}

CubicCurve2D.solveCubic = function(eqn, res) {
  if (res === undefined) {
    return CubicCurve2D.solveCubic(eqn, eqn);
  } else {
    // From Graphics Gems:
    // http://tog.acm.org/resources/GraphicsGems/gems/Roots3And4.c
    var d = eqn[3];
    if (d === 0) {
      return QuadCurve2D.solveQuadratic(eqn, res);
    }
    
    var A = eqn[2] / d;
    var B = eqn[1] / d;
    var C = eqn[0] / d;
    
    var sq_A = A * A;
    var p = 1.0/3 * (-1.0/3 * sq_A + B);
    var q = 1.0/2 * (2.0/27 * A * sq_A - 1.0/3 * A * B + C);
    
    var cb_p = p * p * p;
    var D = q * q + cb_p;
    
    var sub = 1.0/3 * A;
    
    var num;
    if (D < 0) { /* Casus irreducibilis: three real solutions */
      var phi = 1.0/3 * Math.acos(-q / Math.sqrt(-cb_p));
      var t = 2 * Math.sqrt(-p);
      
      if (res === eqn) {
        eqn = eqn.slice(0, 4);
        while (eqn.length < 4) {
          eqn.push(0.);
        }
      }
      
      res[ 0 ] =  ( t * Math.cos(phi));
      res[ 1 ] =  (-t * Math.cos(phi + Math.PI / 3));
      res[ 2 ] =  (-t * Math.cos(phi - Math.PI / 3));
      num = 3;
      
      for (var i = 0; i < num; ++i) {
        res[ i ] -= sub;
      }
      
    } else {
      var sqrt_D = Math.sqrt(D);
      var u = Math.cbrt(sqrt_D - q);
      var v = - Math.cbrt(sqrt_D + q);
      var uv = u+v;
      
      num = 1;

      var err = 1200000000*CubicCurve2D.ulp(Math.abs(uv) + Math.abs(sub));
      if (CubicCurve2D.iszero(D, err) || CubicCurve2D.within(u, v, err)) {
        if (res === eqn) {
          eqn = eqn.slice(0, 4);
          while (eqn.length < 4) {
            eqn.push(0.);
          }
        }
        res[1] = -(uv / 2) - sub;
        num = 2;
      }
      res[ 0 ] =  uv - sub;
    }
    
    if (num > 1) { // num === 3 || num === 2
      num = CubicCurve2D.fixRoots(eqn, res, num);
    }
    if (num > 2 && (res[2] === res[1] || res[2] === res[0])) {
      num--;
    }
    if (num > 1 && res[1] === res[0]) {
      res[1] = res[--num]; // Copies res[2] to res[1] if needed
    }
    return num;
  }
}

CubicCurve2D.fixRoots = function(eqn, res, num) {
  var intervals = [eqn[1], 2*eqn[2], 3*eqn[3]];
  var critCount = QuadCurve2D.solveQuadratic(intervals, intervals);
  if (critCount === 2 && intervals[0] === intervals[1]) {
    critCount--;
  }
  if (critCount === 2 && intervals[0] > intervals[1]) {
    var tmp = intervals[0];
    intervals[0] = intervals[1];
    intervals[1] = tmp;
  }
  
  if (num === 3) {
    var xe = CubicCurve2D.getRootUpperBound(eqn);
    var x0 = -xe;
    
    // Sort the num first items: Arrays.sort(res, 0, num);
    var sortedArray = res.slice(0, num).sort();
    if (num < res.length) {
      sortedArray.push.apply(sortedArray, res.slice(num));
    }
    res = sortedArray;    
    if (critCount === 2) {
      res[0] = CubicCurve2D.refineRootWithHint(eqn, x0, intervals[0], res[0]);
      res[1] = CubicCurve2D.refineRootWithHint(eqn, intervals[0], intervals[1], res[1]);
      res[2] = CubicCurve2D.refineRootWithHint(eqn, intervals[1], xe, res[2]);
      return 3;
    } else if (critCount === 1) {
      var fxe = eqn[3];
      var fx0 = -fxe;
      
      var x1 = intervals[0];
      var fx1 = CubicCurve2D.solveEqn(eqn, 3, x1);
      if (CubicCurve2D.oppositeSigns(fx0, fx1)) {
        res[0] = CubicCurve2D.bisectRootWithHint(eqn, x0, x1, res[0]);
      } else if (CubicCurve2D.oppositeSigns(fx1, fxe)) {
        res[0] = CubicCurve2D.bisectRootWithHint(eqn, x1, xe, res[2]);
      } else /* fx1 must be 0 */ {
        res[0] = x1;
      }
      // return 1
    } else if (critCount === 0) {
      res[0] = CubicCurve2D.bisectRootWithHint(eqn, x0, xe, res[1]);
      // return 1
    }
  } else if (num === 2 && critCount === 2) {
    var goodRoot = res[0];
    var badRoot = res[1];
    var x1 = intervals[0];
    var x2 = intervals[1];
    var x = Math.abs(x1 - goodRoot) > Math.abs(x2 - goodRoot) ? x1 : x2;
    var fx = CubicCurve2D.solveEqn(eqn, 3, x);
    
    if (CubicCurve2D.iszero(fx, 10000000*CubicCurve2D.ulp(x))) {
      var badRootVal = CubicCurve2D.solveEqn(eqn, 3, badRoot);
      res[1] = Math.abs(badRootVal) < Math.abs(fx) ? badRoot : x;
      return 2;
    }
  } 
  return 1;
}

// use newton's method.
CubicCurve2D.refineRootWithHint = function(eqn, min, max, t) {
  if (!CubicCurve2D.inInterval(t, min, max)) {
    return t;
  }
  var deriv = [eqn[1], 2*eqn[2], 3*eqn[3]];
  var origt = t;
  for (var i = 0; i < 3; i++) {
    var slope = CubicCurve2D.solveEqn(deriv, 2, t);
    var y = CubicCurve2D.solveEqn(eqn, 3, t);
    var delta = - (y / slope);
    var newt = t + delta;
    
    if (slope === 0 || y === 0 || t === newt) {
      break;
    }
    
    t = newt;
  }
  if (CubicCurve2D.within(t, origt, 1000*CubicCurve2D.ulp(origt)) && CubicCurve2D.inInterval(t, min, max)) {
    return t;
  }
  return origt;
}

CubicCurve2D.bisectRootWithHint = function(eqn, x0, xe, hint) {
  var delta1 = Math.min(Math.abs(hint - x0) / 64, 0.0625);
  var delta2 = Math.min(Math.abs(hint - xe) / 64, 0.0625);
  var x02 = hint - delta1;
  var xe2 = hint + delta2;
  var fx02 = CubicCurve2D.solveEqn(eqn, 3, x02);
  var fxe2 = CubicCurve2D.solveEqn(eqn, 3, xe2);
  while (CubicCurve2D.oppositeSigns(fx02, fxe2)) {
    if (x02 >= xe2) {
      return x02;
    }
    x0 = x02;
    xe = xe2;
    delta1 /= 64;
    delta2 /= 64;
    x02 = hint - delta1;
    xe2 = hint + delta2;
    fx02 = CubicCurve2D.solveEqn(eqn, 3, x02);
    fxe2 = CubicCurve2D.solveEqn(eqn, 3, xe2);
  }
  if (fx02 === 0) {
    return x02;
  }
  if (fxe2 === 0) {
    return xe2;
  }
  
  return CubicCurve2D.bisectRoot(eqn, x0, xe);
}

CubicCurve2D.bisectRoot = function(eqn, x0, xe) {
  var fx0 = CubicCurve2D.solveEqn(eqn, 3, x0);
  var m = x0 + (xe - x0) / 2;
  while (m !== x0 && m !== xe) {
    var fm = CubicCurve2D.solveEqn(eqn, 3, m);
    if (fm === 0) {
      return m;
    }
    if (CubicCurve2D.oppositeSigns(fx0, fm)) {
      xe = m;
    } else {
      fx0 = fm;
      x0 = m;
    }
    m = x0 + (xe-x0)/2;
  }
  return m;
}

CubicCurve2D.inInterval = function(t, min, max) {
  return min <= t && t <= max;
}

CubicCurve2D.within = function(x, y, err) {
  var d = y - x;
  return (d <= err && d >= -err);
}

CubicCurve2D.iszero = function(x, err) {
  return CubicCurve2D.within(x, 0, err);
}

CubicCurve2D.oppositeSigns = function(x1, x2) {
  return (x1 < 0 && x2 > 0) || (x1 > 0 && x2 < 0);
}

CubicCurve2D.solveEqn = function(eqn, order, t) {
  var v = eqn[order];
  while (--order >= 0) {
    v = v * t + eqn[order];
  }
  return v;
}

CubicCurve2D.ulp = function(x) { 
  x = Number(x); 
  return x < 0 ? CubicCurve2D.nextUp(x) - x : x - (-CubicCurve2D.nextUp(-x)); 
}

CubicCurve2D.nextUp = function(x) {
  x = Number(x);
  if (x !== x) {
    return x;
  }
  if (x === -Number.POSITIVE_INFINITY) {
    return -Number.MAX_VALUE;
  }
  if (x === Number.POSITIVE_INFINITY) {
    return Number.POSITIVE_INFINITY;
  }
  if (x === +Number.MAX_VALUE) {
    return Number.POSITIVE_INFINITY;
  }
  var y = x * (x < 0 ? 1 - Number.EPSILON / 2 : 1 + Number.EPSILON);
  if (y === x) {
    var MIN_VALUE = Number.MIN_VALUE;
    if (MIN_VALUE === 0) {
      MIN_VALUE = 2.2250738585072014e-308;
    }
    if (5e-324 !== 0 && 5e-324 < MIN_VALUE) {
      MIN_VALUE = 5e-324;
    }
    y = x + MIN_VALUE;
  }
  if (y === Number.POSITIVE_INFINITY) {
    y = Number.MAX_VALUE;
  }
  var b = x + (y - x) / 2;
  if (x < b && b < y) {
    y = b;
  }
  var c = (y + x) / 2;
  if (x < c && c < y) {
    y = c;
  }
  return y === 0 ? -0 : y;
}

CubicCurve2D.getRootUpperBound = function(eqn) {
  var d = eqn[3];
  var a = eqn[2];
  var b = eqn[1];
  var c = eqn[0];

  var M = 1 + Math.max(Math.max(Math.abs(a), Math.abs(b)), Math.abs(c)) / Math.abs(d);
  M += CubicCurve2D.ulp(M) + 1;
  return M;
}

CubicCurve2D.prototype.contains = function(x, y, w, h) {
  if (y === undefined) {
    // 1 parameter
    if (x instanceof Rectangle2D) {
      var r = x;
      return this.contains(r.getX(), r.getY(), r.getWidth(), r.getHeight());
    } else {
      var p = x;
      return this.contains(p.getX(), p.getY());
    }
  } else if (w === undefined) {
    // 2 parameters
    if (!(x * 0.0 + y * 0.0 === 0.0)) {
      return false;
    }
    var x1 = this.getX1();
    var y1 = this.getY1();
    var x2 = this.getX2();
    var y2 = this.getY2();
    var crossings = (Curve.pointCrossingsForLine(x, y, x1, y1, x2, y2) +
                     Curve.pointCrossingsForCubic(x, y,
                          x1, y1,
                          this.getCtrlX1(), this.getCtrlY1(),
                          this.getCtrlX2(), this.getCtrlY2(),
                          x2, y2, 0));
    return ((crossings & 1) === 1);
  } else {
    if (w <= 0 || h <= 0) {
      return false;
    }
    var numCrossings = this.rectCrossings(x, y, w, h);
    return !(numCrossings === 0 || numCrossings === Curve.RECT_INTERSECTS);
  }
}

CubicCurve2D.prototype.intersects = function(x, y, w, h) {
  if (y === undefined) {
    var r = x;
    return this.intersects(r.getX(), r.getY(), r.getWidth(), r.getHeight());
  } else {
    if (w <= 0 || h <= 0) {
      return false;
    }
    var numCrossings = this.rectCrossings(x, y, w, h);
    return numCrossings !== 0;
  }
}

CubicCurve2D.prototype.rectCrossings = function(x, y, w, h) {
  var crossings = 0;
  if (!(this.getX1() === this.getX2() && this.getY1() === this.getY2())) {
    crossings = Curve.rectCrossingsForLine(crossings,
        x, y,
        x+w, y+h,
        this.getX1(), this.getY1(),
        this.getX2(), this.getY2());
    if (crossings === Curve.RECT_INTERSECTS) {
      return crossings;
    }
  }
  return Curve.rectCrossingsForCubic(crossings,
      x, y,
      x+w, y+h,
      this.getX2(), this.getY2(),
      this.getCtrlX2(), this.getCtrlY2(),
      this.getCtrlX1(), this.getCtrlY1(),
      this.getX1(), this.getY1(), 0);
}

CubicCurve2D.prototype.getPathIterator = function(at, flatness) {
  if (flatness === undefined) {
    return new CubicIterator(this, at);
  } else {
    return new FlatteningPathIterator(this.getPathIterator(at), flatness);
  }
}

CubicCurve2D.prototype.clone = function() {
  return new CubicCurve2D(this.x1, this.y1, this.ctrlx1, this.ctrly1, this.ctrlx2, this.ctrly2, this.x2, this.y2);
}

/**
 * Creates an iterator able to iterate over the path segments of a cubic curve
 * segment through the PathIterator interface.
 * Adpated from java.awt.geom.CubicIterator
 * @constructor
 * @extends PathIterator
 * @package
 */
function CubicIterator(q, at) {
  this.cubic = q;
  this.affine = at;
  this.index = 0;
}
CubicIterator.prototype = Object.create(PathIterator.prototype);
CubicIterator.prototype.constructor = CubicIterator;

CubicIterator.prototype.getWindingRule = function() {
  return PathIterator.WIND_NON_ZERO;
}

CubicIterator.prototype.isDone = function() {
  return (this.index > 1);
}

CubicIterator.prototype.next = function() {
  this.index++;
}

CubicIterator.prototype.currentSegment = function(coords) {
  if (this.isDone()) {
    throw new NoSuchElementException("cubic iterator iterator out of bounds");
  }
  var type;
  if (this.index === 0) {
    coords[0] = this.cubic.getX1();
    coords[1] = this.cubic.getY1();
    type = PathIterator.SEG_MOVETO;
  } else {
    coords[0] = this.cubic.getCtrlX1();
    coords[1] = this.cubic.getCtrlY1();
    coords[2] = this.cubic.getCtrlX2();
    coords[3] = this.cubic.getCtrlY2();
    coords[4] = this.cubic.getX2();
    coords[5] = this.cubic.getY2();
    type = PathIterator.SEG_CUBICTO;
  }
  if (this.affine !== null) {
    this.affine.transform(coords, 0, coords, 0, this.index === 0 ? 1 : 3);
  }
  return type;
}


/**
 * Creates a new area.
 * Adapted from java.awt.Area
 * @constructor
 */
function Area(s) {
  if (s === undefined) {
    this.curves = [];
  } else {
    if (s instanceof Area) {
      this.curves = s.curves;
    } else {
      this.curves = Area.pathToCurves(s.getPathIterator(null));
    }
  }
  this.cachedBounds = null;
}

Area.pathToCurves = function(pi) {
  var curves = [];
  var windingRule = pi.getWindingRule();
  var coords = new Array(23);
  var movx = 0, movy = 0;
  var curx = 0, cury = 0;
  var newx, newy;
  while (!pi.isDone()) {
    switch (pi.currentSegment(coords)) {
      case PathIterator.SEG_MOVETO:
        Curve.insertLine(curves, curx, cury, movx, movy);
        curx = movx = coords[0];
        cury = movy = coords[1];
        Curve.insertMove(curves, movx, movy);
        break;
      case PathIterator.SEG_LINETO:
        newx = coords[0];
        newy = coords[1];
        Curve.insertLine(curves, curx, cury, newx, newy);
        curx = newx;
        cury = newy;
        break;
      case PathIterator.SEG_QUADTO:
        newx = coords[2];
        newy = coords[3];
        Curve.insertQuad(curves, curx, cury, coords);
        curx = newx;
        cury = newy;
        break;
      case PathIterator.SEG_CUBICTO:
        newx = coords[4];
        newy = coords[5];
        Curve.insertCubic(curves, curx, cury, coords);
        curx = newx;
        cury = newy;
        break;
      case PathIterator.SEG_CLOSE:
        Curve.insertLine(curves, curx, cury, movx, movy);
        curx = movx;
        cury = movy;
        break;
    }
    pi.next();
  }
  Curve.insertLine(curves, curx, cury, movx, movy);
  var operator;
  if (windingRule === PathIterator.WIND_EVEN_ODD) {
    operator = new AreaOpEOWindOp();
  } else {
    operator = new AreaOpNZWindOp();
  }
  return operator.calculate(curves, []);
}

Area.prototype.add = function(rhs) {
  this.curves = new AreaOpAddOp().calculate(this.curves, rhs.curves);
  this.invalidateBounds();
}

Area.prototype.subtract = function(rhs) {
  this.curves = new AreaOpSubOp().calculate(this.curves, rhs.curves);
  this.invalidateBounds();
}

Area.prototype.intersect = function(rhs) {
  this.curves = new AreaOpIntOp().calculate(this.curves, rhs.curves);
  this.invalidateBounds();
}

Area.prototype.exclusiveOr = function(rhs) {
  this.curves = new AreaOpXorOp().calculate(this.curves, rhs.curves);
  this.invalidateBounds();
}

Area.prototype.reset = function() {
  this.curves.length = 0;
  this.invalidateBounds();
}

Area.prototype.isEmpty = function() {
  return (this.curves.length === 0);
}

Area.prototype.isPolygonal = function() {
  for (var i = 0; i < this.curves.length; i++) {
    if (this.curves [i].getOrder() > 1) {
      return false;
    }
  }
  return true;
}

Area.prototype.isRectangular = function() {
  var size = this.curves.length;
  if (size === 0) {
    return true;
  }
  if (size > 3) {
    return false;
  }
  var c1 = this.curves [1];
  var c2 = this.curves [2];
  if (c1.getOrder() !== 1 || c2.getOrder() !== 1) {
    return false;
  }
  if (c1.getXTop() !== c1.getXBot() || c2.getXTop() !== c2.getXBot()) {
    return false;
  }
  if (c1.getYTop() !== c2.getYTop() || c1.getYBot() !== c2.getYBot()) {
    // One might be able to prove that this is impossible...
    return false;
  }
  return true;
}

Area.prototype.isSingular = function() {
  if (this.curves.length < 3) {
    return true;
  }
  // First Order0 "moveto"
  for (var i = 1; i < this.curves.length; i++) {
    if (this.curves [i].getOrder() === 0) {
      return false;
    }
  }
  return true;
}

Area.prototype.invalidateBounds = function() {
  this.cachedBounds = null;
}

Area.prototype.getCachedBounds = function() {
  if (this.cachedBounds !== null) {
    return this.cachedBounds;
  }
  var r = new Rectangle2D();
  if (this.curves.length > 0) {
    var c = this.curves [0];
    // First point is always an order 0 curve (moveto)
    r.setRect(c.getX0(), c.getY0(), 0, 0);
    for (var i = 1; i < this.curves.length; i++) {
      this.curves [i].enlarge(r);
    }
  }
  return (this.cachedBounds = r);
}

Area.prototype.getBounds2D = function() {
  return this.getCachedBounds().getBounds2D();
}

Area.prototype.clone = function() {
  return new Area(this);
}

Area.prototype.equals = function(other) {
  if (other === this) {
    return true;
  }
  if (other === null) {
    return false;
  }
  var c = new AreaOpXorOp().calculate(this.curves, other.curves);
  return c.isEmpty();
}

Area.prototype.transform = function(t) {
  if (t === null) {
    throw new NullPointerException("transform must not be null");
  }
  this.curves = Area.pathToCurves(this.getPathIterator(t));
  this.invalidateBounds();
}

Area.prototype.createTransformedArea = function(t) {
  var a = new Area(this);
  a.transform(t);
  return a;
}

Area.prototype.contains = function(x, y) {
  if (!this.getCachedBounds().contains(x, y)) {
    return false;
  }
  var crossings = 0;
  for (var i = 0; i < this.curves.length; i++) {
    var c = this.curves [i];
    crossings += c.crossingsFor(x, y);
  }
  return ((crossings & 1) === 1);
}

Area.prototype.contains = function(x, y, w, h) {
  if (y === undefined) {
    if (x instanceof Rectangle2D) {
      var r = x;
      return this.contains(r.getX(), r.getY(), r.getWidth(), r.getHeight());
    } else {
      var p = x;
      return this.contains(p.getX(), p.getY());
    }
  } else {
    if (w < 0 || h < 0) {
      return false;
    }
    if (!this.getCachedBounds().contains(x, y, w, h)) {
      return false;
    }
    var c = Crossings.findCrossings(this.curves, x, y, x+w, y+h);
    return (c !== null && c.covers(y, y+h));
  }
}

Area.prototype.intersects = function(x, y, w, h) {
  if (y === undefined) {
    var r = x;
    return this.intersects(r.getX(), r.getY(), r.getWidth(), r.getHeight());
  } else {
    if (w < 0 || h < 0) {
      return false;
    }
    if (!this.getCachedBounds().intersects(x, y, w, h)) {
      return false;
    }
    var c = Crossings.findCrossings(this.curves, x, y, x+w, y+h);
    return (c === null || !c.isEmpty());
  }
}

Area.prototype.getPathIterator = function(at, flatness) {
  if (flatness === undefined) {
    return new AreaIterator(this.curves, at);
  } else {
    return new FlatteningPathIterator(this.getPathIterator(at), flatness);
  }
}

/**
 * Creates an iterator able to iterate over an area.
 * Adapted from java.awt.AreaIterator
 * @constructor
 * @extends PathIterator
 * @package
 */
function AreaIterator(curves, at) {
  this.curves = curves;
  this.transform = at;
  this.index = 0;
  this.prevcurve = null;
  if (curves.length >= 1) {
    this.thiscurve = curves [0];
  } else {
    this.thiscurve = null;
  }
}
AreaIterator.prototype = Object.create(PathIterator.prototype);
AreaIterator.prototype.constructor = AreaIterator;

AreaIterator.prototype.getWindingRule = function() {
  return PathIterator.WIND_NON_ZERO;
}

AreaIterator.prototype.isDone = function() {
  return (this.prevcurve === null && this.thiscurve === null);
}

AreaIterator.prototype.next = function() {
  if (this.prevcurve !== null) {
    this.prevcurve = null;
  } else {
    this.prevcurve = this.thiscurve;
    this.index++;
    if (this.index < this.curves.length) {
      this.thiscurve = this.curves [this.index];
      if (this.thiscurve.getOrder() !== 0 &&
          this.prevcurve.getX1() === this.thiscurve.getX0() &&
          this.prevcurve.getY1() === this.thiscurve.getY0()) {
        this.prevcurve = null;
      }
    } else {
      this.thiscurve = null;
    }
  }
}

AreaIterator.prototype.currentSegment = function(coords) {
  var segtype;
  var numpoints;
  if (this.prevcurve !== null) {
    if (this.thiscurve === null || this.thiscurve.getOrder() === 0) {
      return PathIterator.SEG_CLOSE;
    }
    coords[0] = this.thiscurve.getX0();
    coords[1] = this.thiscurve.getY0();
    segtype = PathIterator.SEG_LINETO;
    numpoints = 1;
  } else if (this.thiscurve === null) {
    throw new NoSuchElementException("area iterator out of bounds");
  } else {
    segtype = this.thiscurve.getSegment(coords);
    numpoints = this.thiscurve.getOrder();
    if (numpoints === 0) {
      numpoints = 1;
    }
  }
  if (this.transform !== null) {
    this.transform.transform(coords, 0, coords, 0, numpoints);
  }
  return segtype;
}


/**
 * Superclass of curves used by previous geometry classes.
 * Adapted from sun.awt.geom.Curve
 * @constructor
 */
function Curve(direction) {
  this.direction = direction;
}

Curve.INCREASING = 1;
Curve.DECREASING = -1;

Curve.RECT_INTERSECTS = 0x80000000;

Curve.TMIN = 1E-3;

Curve.prototype.getDirection = function() {
  return this.direction;
}

Curve.prototype.getWithDirection = function(direction) {
  return (this.direction === direction ? this : this.getReversedCurve());
}

Curve.insertMove = function(curves, x, y) {
  curves.push(new Order0(x, y));
}

Curve.insertLine = function(curves, x0,  y0, x1, y1) {
  if (y0 < y1) {
    curves.push(new Order1(x0, y0,
                           x1, y1,
                           Curve.INCREASING));
  } else if (y0 > y1) {
    curves.push(new Order1(x1, y1,
                           x0, y0,
                           Curve.DECREASING));
  }
}

Curve.insertQuad = function(curves, x0, y0, coords) {
  var y1 = coords[3];
  if (y0 > y1) {
    Order2.insert(curves, coords,
                  coords[2], y1,
                  coords[0], coords[1],
                  x0, y0,
                  Curve.DECREASING);
  } else if (y0 === y1 && y0 === coords[1]) {
    return;
  } else {
    Order2.insert(curves, coords,
                  x0, y0,
                  coords[0], coords[1],
                  coords[2], y1,
                  Curve.INCREASING);
  }
}

Curve.insertCubic = function(curves, x0, y0, coords) {
  var y1 = coords[5];
  if (y0 > y1) {
    Order3.insert(curves, coords,
                  coords[4], y1,
                  coords[2], coords[3],
                  coords[0], coords[1],
                  x0, y0,
                  Curve.DECREASING);
  } else if (y0 === y1 && y0 === coords[1] && y0 === coords[3]) {
    return;
  } else {
    Order3.insert(curves, coords,
                  x0, y0,
                  coords[0], coords[1],
                  coords[2], coords[3],
                  coords[4], y1,
                  Curve.INCREASING);
  }
}

Curve.pointCrossingsForPath = function(pi, px, py) {
  if (pi.isDone()) {
    return 0;
  }
  var coords = new Array(6);
  if (pi.currentSegment(coords) !== PathIterator.SEG_MOVETO) {
    throw new IllegalPathStateException("missing initial moveto "+
                                        "in path definition");
  }
  pi.next();
  var movx = coords[0];
  var movy = coords[1];
  var curx = movx;
  var cury = movy;
  var endx, endy;
  var crossings = 0;
  while (!pi.isDone()) {
    switch (pi.currentSegment(coords)) {
      case PathIterator.SEG_MOVETO:
        if (cury !== movy) {
          crossings += Curve.pointCrossingsForLine(px, py,
                                                   curx, cury,
                                                   movx, movy);
        }
        movx = curx = coords[0];
        movy = cury = coords[1];
        break;
      case PathIterator.SEG_LINETO:
        endx = coords[0];
        endy = coords[1];
        crossings += Curve.pointCrossingsForLine(px, py,
                                                 curx, cury,
                                                 endx, endy);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_QUADTO:
        endx = coords[2];
        endy = coords[3];
        crossings += Curve.pointCrossingsForQuad(px, py,
                                                 curx, cury,
                                                 coords[0], coords[1],
                                                 endx, endy, 0);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_CUBICTO:
        endx = coords[4];
        endy = coords[5];
        crossings += Curve.pointCrossingsForCubic(px, py,
                                                  curx, cury,
                                                  coords[0], coords[1],
                                                  coords[2], coords[3],
                                                  endx, endy, 0);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_CLOSE:
        if (cury !== movy) {
          crossings += Curve.pointCrossingsForLine(px, py,
                                                   curx, cury,
                                                   movx, movy);
        }
        curx = movx;
        cury = movy;
        break;
    }
    pi.next();
  }
  if (cury !== movy) {
      crossings += Curve.pointCrossingsForLine(px, py,
                                               curx, cury,
                                               movx, movy);
  }
  return crossings;
}

Curve.pointCrossingsForLine = function(px, py, x0, y0, x1, y1) {
  if (py <  y0 && py <  y1) return 0;
  if (py >= y0 && py >= y1) return 0;
  if (px >= x0 && px >= x1) return 0;
  if (px <  x0 && px <  x1) return (y0 < y1) ? 1 : -1;
  var xintercept = x0 + (py - y0) * (x1 - x0) / (y1 - y0);
  if (px >= xintercept) return 0;
  return (y0 < y1) ? 1 : -1;
}

Curve.pointCrossingsForQuad = function(px, py, x0, y0, xc, yc, x1, y1, level) {
  if (py <  y0 && py <  yc && py <  y1) return 0;
  if (py >= y0 && py >= yc && py >= y1) return 0;
  // Note y0 could equal y1...
  if (px >= x0 && px >= xc && px >= x1) return 0;
  if (px <  x0 && px <  xc && px <  x1) {
    if (py >= y0) {
      if (py < y1) return 1;
    } else {
      if (py >= y1) return -1;
    }
    return 0;
  }
  // double precision only has 52 bits of mantissa
  if (level > 52) {
    return Curve.pointCrossingsForLine(px, py, x0, y0, x1, y1);
  }
  var x0c = (x0 + xc) / 2;
  var y0c = (y0 + yc) / 2;
  var xc1 = (xc + x1) / 2;
  var yc1 = (yc + y1) / 2;
  xc = (x0c + xc1) / 2;
  yc = (y0c + yc1) / 2;
  if (isNaN(xc) || isNaN(yc)) {
    return 0;
  }
  return (Curve.pointCrossingsForQuad(px, py,
                                      x0, y0, x0c, y0c, xc, yc,
                                      level+1) +
          Curve.pointCrossingsForQuad(px, py,
                                      xc, yc, xc1, yc1, x1, y1,
                                      level+1));
}

Curve.pointCrossingsForCubic = function(px, py, x0, y0, xc0, yc0, xc1, yc1, x1, y1, level) {
  if (py <  y0 && py <  yc0 && py <  yc1 && py <  y1) return 0;
  if (py >= y0 && py >= yc0 && py >= yc1 && py >= y1) return 0;
  if (px >= x0 && px >= xc0 && px >= xc1 && px >= x1) return 0;
  if (px <  x0 && px <  xc0 && px <  xc1 && px <  x1) {
    if (py >= y0) {
      if (py < y1) return 1;
    } else {
      if (py >= y1) return -1;
    }
    return 0;
  }
  // double precision only has 52 bits of mantissa
  if (level > 52) {
    return pointCrossingsForLine(px, py, x0, y0, x1, y1);
  } 
  var xmid = (xc0 + xc1) / 2;
  var ymid = (yc0 + yc1) / 2;
  xc0 = (x0 + xc0) / 2;
  yc0 = (y0 + yc0) / 2;
  xc1 = (xc1 + x1) / 2;
  yc1 = (yc1 + y1) / 2;
  var xc0m = (xc0 + xmid) / 2;
  var yc0m = (yc0 + ymid) / 2;
  var xmc1 = (xmid + xc1) / 2;
  var ymc1 = (ymid + yc1) / 2;
  xmid = (xc0m + xmc1) / 2;
  ymid = (yc0m + ymc1) / 2;
  if (isNaN(xmid) || isNaN(ymid)) {
    return 0;
  }
  return (Curve.pointCrossingsForCubic(px, py,
                                       x0, y0, xc0, yc0,
                                       xc0m, yc0m, xmid, ymid, level+1) +
          Curve.pointCrossingsForCubic(px, py,
                                       xmid, ymid, xmc1, ymc1,
                                       xc1, yc1, x1, y1, level+1));
}

Curve.rectCrossingsForPath = function(pi, rxmin, rymin, rxmax, rymax) {
  if (rxmax <= rxmin || rymax <= rymin) {
    return 0;
  }
  if (pi.isDone()) {
    return 0;
  }
  var coords = new Array(6);
  if (pi.currentSegment(coords) !== PathIterator.SEG_MOVETO) {
    throw new IllegalPathStateException("missing initial moveto "+
                                        "in path definition");
  }
  pi.next();
  var curx, cury, movx, movy, endx, endy;
  curx = movx = coords[0];
  cury = movy = coords[1];
  var crossings = 0;
  while (crossings !== Curve.RECT_INTERSECTS && !pi.isDone()) {
    switch (pi.currentSegment(coords)) {
      case PathIterator.SEG_MOVETO:
        if (curx !== movx || cury !== movy) {
          crossings = Curve.rectCrossingsForLine(crossings,
                                                 rxmin, rymin,
                                                 rxmax, rymax,
                                                 curx, cury,
                                                 movx, movy);
        }
        movx = curx = coords[0];
        movy = cury = coords[1];
        break;
      case PathIterator.SEG_LINETO:
        endx = coords[0];
        endy = coords[1];
        crossings = Curve.rectCrossingsForLine(crossings,
                                               rxmin, rymin,
                                               rxmax, rymax,
                                               curx, cury,
                                               endx, endy);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_QUADTO:
        endx = coords[2];
        endy = coords[3];
        crossings = Curve.rectCrossingsForQuad(crossings,
                                               rxmin, rymin,
                                               rxmax, rymax,
                                               curx, cury,
                                               coords[0], coords[1],
                                               endx, endy, 0);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_CUBICTO:
        endx = coords[4];
        endy = coords[5];
        crossings = Curve.rectCrossingsForCubic(crossings,
                                                rxmin, rymin,
                                                rxmax, rymax,
                                                curx, cury,
                                                coords[0], coords[1],
                                                coords[2], coords[3],
                                                endx, endy, 0);
        curx = endx;
        cury = endy;
        break;
      case PathIterator.SEG_CLOSE:
        if (curx !== movx || cury !== movy) {
          crossings = Curve.rectCrossingsForLine(crossings,
                                                 rxmin, rymin,
                                                 rxmax, rymax,
                                                 curx, cury,
                                                 movx, movy);
        }
        curx = movx;
        cury = movy;
        break;
    }
    pi.next();
  }
  if (crossings !== Curve.RECT_INTERSECTS && (curx !== movx || cury !== movy)) {
    crossings = Curve.rectCrossingsForLine(crossings,
                                           rxmin, rymin,
                                           rxmax, rymax,
                                           curx, cury,
                                           movx, movy);
  }
  return crossings;
}

Curve.rectCrossingsForLine = function(crossings, rxmin, rymin, rxmax, rymax, x0, y0, x1, y1) {
  if (y0 >= rymax && y1 >= rymax) return crossings;
  if (y0 <= rymin && y1 <= rymin) return crossings;
  if (x0 <= rxmin && x1 <= rxmin) return crossings;
  if (x0 >= rxmax && x1 >= rxmax) {
    if (y0 < y1) {
      if (y0 <= rymin) crossings++;
      if (y1 >= rymax) crossings++;
    } else if (y1 < y0) {
      if (y1 <= rymin) crossings--;
      if (y0 >= rymax) crossings--;
    }
    return crossings;
  }
  if ((x0 > rxmin && x0 < rxmax && y0 > rymin && y0 < rymax) ||
      (x1 > rxmin && x1 < rxmax && y1 > rymin && y1 < rymax)) {
    return Curve.RECT_INTERSECTS;
  }
  var xi0 = x0;
  if (y0 < rymin) {
    xi0 += ((rymin - y0) * (x1 - x0) / (y1 - y0));
  } else if (y0 > rymax) {
    xi0 += ((rymax - y0) * (x1 - x0) / (y1 - y0));
  }
  var xi1 = x1;
  if (y1 < rymin) {
    xi1 += ((rymin - y1) * (x0 - x1) / (y0 - y1));
  } else if (y1 > rymax) {
    xi1 += ((rymax - y1) * (x0 - x1) / (y0 - y1));
  }
  if (xi0 <= rxmin && xi1 <= rxmin) return crossings;
  if (xi0 >= rxmax && xi1 >= rxmax) {
    if (y0 < y1) {
      if (y0 <= rymin) crossings++;
      if (y1 >= rymax) crossings++;
    } else if (y1 < y0) {
      if (y1 <= rymin) crossings--;
      if (y0 >= rymax) crossings--;
    }
    return crossings;
  }
  return Curve.RECT_INTERSECTS;
}

Curve.rectCrossingsForQuad = function(crossings, rxmin, rymin, rxmax, rymax, x0, y0, xc, yc, x1, y1, level) {
  if (y0 >= rymax && yc >= rymax && y1 >= rymax) return crossings;
  if (y0 <= rymin && yc <= rymin && y1 <= rymin) return crossings;
  if (x0 <= rxmin && xc <= rxmin && x1 <= rxmin) return crossings;
  if (x0 >= rxmax && xc >= rxmax && x1 >= rxmax) {
    if (y0 < y1) {
      // y-increasing line segment...
      if (y0 <= rymin && y1 >  rymin) crossings++;
      if (y0 <  rymax && y1 >= rymax) crossings++;
    } else if (y1 < y0) {
      // y-decreasing line segment...
      if (y1 <= rymin && y0 >  rymin) crossings--;
      if (y1 <  rymax && y0 >= rymax) crossings--;
    }
    return crossings;
  }
  if ((x0 < rxmax && x0 > rxmin && y0 < rymax && y0 > rymin) ||
      (x1 < rxmax && x1 > rxmin && y1 < rymax && y1 > rymin)) {
    return Curve.RECT_INTERSECTS;
  }
  if (level > 52) {
    return Curve.rectCrossingsForLine(crossings,
                                      rxmin, rymin, rxmax, rymax,
                                      x0, y0, x1, y1);
  }
  var x0c = (x0 + xc) / 2;
  var y0c = (y0 + yc) / 2;
  var xc1 = (xc + x1) / 2;
  var yc1 = (yc + y1) / 2;
  xc = (x0c + xc1) / 2;
  yc = (y0c + yc1) / 2;
  if (Number.isNaN(xc) || Number.isNaN(yc)) {
    return 0;
  }
  crossings = Curve.rectCrossingsForQuad(crossings,
                                         rxmin, rymin, rxmax, rymax,
                                         x0, y0, x0c, y0c, xc, yc,
                                         level+1);
  if (crossings !== Curve.RECT_INTERSECTS) {
    crossings = Curve.rectCrossingsForQuad(crossings,
                                           rxmin, rymin, rxmax, rymax,
                                           xc, yc, xc1, yc1, x1, y1,
                                           level+1);
  }
  return crossings;
}

Curve.rectCrossingsForCubic = function(crossings, rxmin, rymin, rxmax, rymax, x0,  y0, xc0, yc0, xc1, yc1, x1,  y1, level) {
  if (y0 >= rymax && yc0 >= rymax && yc1 >= rymax && y1 >= rymax) {
    return crossings;
  }
  if (y0 <= rymin && yc0 <= rymin && yc1 <= rymin && y1 <= rymin) {
    return crossings;
  }
  if (x0 <= rxmin && xc0 <= rxmin && xc1 <= rxmin && x1 <= rxmin) {
    return crossings;
  }
  if (x0 >= rxmax && xc0 >= rxmax && xc1 >= rxmax && x1 >= rxmax) {
    if (y0 < y1) {
      // y-increasing line segment...
      if (y0 <= rymin && y1 >  rymin) crossings++;
      if (y0 <  rymax && y1 >= rymax) crossings++;
    } else if (y1 < y0) {
      // y-decreasing line segment...
      if (y1 <= rymin && y0 >  rymin) crossings--;
      if (y1 <  rymax && y0 >= rymax) crossings--;
    }
    return crossings;
  }
  if ((x0 > rxmin && x0 < rxmax && y0 > rymin && y0 < rymax) ||
      (x1 > rxmin && x1 < rxmax && y1 > rymin && y1 < rymax)) {
    return Curve.RECT_INTERSECTS;
  }
  if (level > 52) {
    return Curve.rectCrossingsForLine(crossings,
                                      rxmin, rymin, rxmax, rymax,
                                      x0, y0, x1, y1);
  }
  var xmid = (xc0 + xc1) / 2;
  var ymid = (yc0 + yc1) / 2;
  xc0 = (x0 + xc0) / 2;
  yc0 = (y0 + yc0) / 2;
  xc1 = (xc1 + x1) / 2;
  yc1 = (yc1 + y1) / 2;
  var xc0m = (xc0 + xmid) / 2;
  var yc0m = (yc0 + ymid) / 2;
  var xmc1 = (xmid + xc1) / 2;
  var ymc1 = (ymid + yc1) / 2;
  xmid = (xc0m + xmc1) / 2;
  ymid = (yc0m + ymc1) / 2;
  if (Number.isNaN(xmid) || Number.isNaN(ymid)) {
    return 0;
  }
  crossings = Curve.rectCrossingsForCubic(crossings,
                                          rxmin, rymin, rxmax, rymax,
                                          x0, y0, xc0, yc0,
                                          xc0m, yc0m, xmid, ymid, level+1);
  if (crossings !== Curve.RECT_INTERSECTS) {
      crossings = Curve.rectCrossingsForCubic(crossings,
                                              rxmin, rymin, rxmax, rymax,
                                              xmid, ymid, xmc1, ymc1,
                                              xc1, yc1, x1, y1, level+1);
  }
  return crossings;
}

Curve.round = function(v) {
  return v;
}

Curve.orderof = function(x1, x2) {
  if (x1 < x2) {
    return -1;
  }
  if (x1 > x2) {
    return 1;
  }
  return 0;
}

Curve.prototype.crossingsFor = function(x, y) {
  if (y >= this.getYTop() && y < this.getYBot()) {
    if (x < this.getXMax() && (x < this.getXMin() || x < this.XforY(y))) {
      return 1;
    }
  }
  return 0;
}

Curve.prototype.accumulateCrossings = function(c) {
  var xhi = c.getXHi();
  if (this.getXMin() >= xhi) {
    return false;
  }
  var xlo = c.getXLo();
  var ylo = c.getYLo();
  var yhi = c.getYHi();
  var y0 = this.getYTop();
  var y1 = this.getYBot();
  var tstart, ystart, tend, yend;
  if (y0 < ylo) {
    if (y1 <= ylo) {
      return false;
    }
    ystart = ylo;
    tstart = this.TforY(ylo);
  } else {
    if (y0 >= yhi) {
      return false;
    }
    ystart = y0;
    tstart = 0;
  }
  if (y1 > yhi) {
    yend = yhi;
    tend = this.TforY(yhi);
  } else {
    yend = y1;
    tend = 1;
  }
  var hitLo = false;
  var hitHi = false;
  while (true) {
    var x = this.XforT(tstart);
    if (x < xhi) {
      if (hitHi || x > xlo) {
        return true;
      }
      hitLo = true;
    } else {
      if (hitLo) {
        return true;
      }
      hitHi = true;
    }
    if (tstart >= tend) {
      break;
    }
    tstart = this.nextVertical(tstart, tend);
  }
  if (hitLo) {
    c.record(ystart, yend, direction);
  }
  return false;
}

Curve.prototype.compareTo = function(that, yrange) {
  var y0 = yrange[0];
  var y1 = yrange[1];
  y1 = Math.min(Math.min(y1, this.getYBot()), that.getYBot());
  if (y1 <= yrange[0]) {
    throw new InternalError("backstepping from "+yrange[0]+" to "+y1);
  }
  yrange[1] = y1;
  if (this.getXMax() <= that.getXMin()) {
    if (this.getXMin() === that.getXMax()) {
      return 0;
    }
    return -1;
  }
  if (this.getXMin() >= that.getXMax()) {
    return 1;
  }
  var s0 = this.TforY(y0);
  var ys0 = this.YforT(s0);
  if (ys0 < y0) {
    s0 = this.refineTforY(s0, ys0, y0);
    ys0 = this.YforT(s0);
  }
  var s1 = this.TforY(y1);
  if (this.YforT(s1) < y0) {
    s1 = this.refineTforY(s1, this.YforT(s1), y0);
  }
  var t0 = that.TforY(y0);
  var yt0 = that.YforT(t0);
  if (yt0 < y0) {
    t0 = that.refineTforY(t0, yt0, y0);
    yt0 = that.YforT(t0);
  }
  var t1 = that.TforY(y1);
  if (that.YforT(t1) < y0) {
    t1 = that.refineTforY(t1, that.YforT(t1), y0);
  }
  var xs0 = this.XforT(s0);
  var xt0 = that.XforT(t0);
  var scale = Math.max(Math.abs(y0), Math.abs(y1));
  var ymin = Math.max(scale * 1E-14, 1E-300);
  if (this.fairlyClose(xs0, xt0)) {
    var bump = ymin;
    var maxbump = Math.min(ymin * 1E13, (y1 - y0) * .1);
    var y = y0 + bump;
    while (y <= y1) {
      if (this.fairlyClose(this.XforY(y), that.XforY(y))) {
        if ((bump *= 2) > maxbump) {
          bump = maxbump;
        }
      } else {
        y -= bump;
        while (true) {
          bump /= 2;
          var newy = y + bump;
          if (newy <= y) {
            break;
          }
          if (this.fairlyClose(this.XforY(newy), that.XforY(newy))) {
            y = newy;
          }
        }
        break;
      }
      y += bump;
    }
    if (y > y0) {
      if (y < y1) {
        yrange[1] = y;
      }
      return 0;
    }
  }
  while (s0 < s1 && t0 < t1) {
    var sh = this.nextVertical(s0, s1);
    var xsh = this.XforT(sh);
    var ysh = this.YforT(sh);
    var th = that.nextVertical(t0, t1);
    var xth = that.XforT(th);
    var yth = that.YforT(th);
    try {
      if (this.findIntersect(that, yrange, ymin, 0, 0,
                             s0, xs0, ys0, sh, xsh, ysh,
                             t0, xt0, yt0, th, xth, yth)) {
        break;
      }
    } catch (t) {
      return 0;
    }
    if (ysh < yth) {
      if (ysh > yrange[0]) {
        if (ysh < yrange[1]) {
          yrange[1] = ysh;
        }
        break;
      }
      s0 = sh;
      xs0 = xsh;
      ys0 = ysh;
    } else {
      if (yth > yrange[0]) {
        if (yth < yrange[1]) {
          yrange[1] = yth;
        }
        break;
      }
      t0 = th;
      xt0 = xth;
      yt0 = yth;
    }
  }
  var ymid = (yrange[0] + yrange[1]) / 2;
  return Curve.orderof(this.XforY(ymid), that.XforY(ymid));
}

Curve.prototype.findIntersect = function(that, yrange, ymin, slevel, tlevel, s0, xs0, ys0, s1, xs1, ys1, t0, xt0, yt0, t1, xt1, yt1) {
  if (ys0 > yt1 || yt0 > ys1) {
    return false;
  }
  if (Math.min(xs0, xs1) > Math.max(xt0, xt1) ||
      Math.max(xs0, xs1) < Math.min(xt0, xt1))  {
    return false;
  }
  if (s1 - s0 > Curve.TMIN) {
    var s = (s0 + s1) / 2;
    var xs = this.XforT(s);
    var ys = this.YforT(s);
    if (s === s0 || s === s1) {
      throw new InternalError("no s progress!");
    }
    if (t1 - t0 > Curve.TMIN) {
      var t = (t0 + t1) / 2;
      var xt = that.XforT(t);
      var yt = that.YforT(t);
      if (t === t0 || t === t1) {
        throw new InternalError("no t progress!");
      }
      if (ys >= yt0 && yt >= ys0) {
        if (this.findIntersect(that, yrange, ymin, slevel+1, tlevel+1,
                               s0, xs0, ys0, s, xs, ys,
                               t0, xt0, yt0, t, xt, yt)) {
          return true;
        }
      }
      if (ys >= yt) {
        if (this.findIntersect(that, yrange, ymin, slevel+1, tlevel+1,
                               s0, xs0, ys0, s, xs, ys,
                               t, xt, yt, t1, xt1, yt1)) {
          return true;
        }
      }
      if (yt >= ys) {
        if (this.findIntersect(that, yrange, ymin, slevel+1, tlevel+1,
                               s, xs, ys, s1, xs1, ys1,
                               t0, xt0, yt0, t, xt, yt)) {
          return true;
        }
      }
      if (ys1 >= yt && yt1 >= ys) {
        if (this.findIntersect(that, yrange, ymin, slevel+1, tlevel+1,
                               s, xs, ys, s1, xs1, ys1,
                               t, xt, yt, t1, xt1, yt1)) {
          return true;
        }
      }
    } else {
      if (ys >= yt0) {
        if (this.findIntersect(that, yrange, ymin, slevel+1, tlevel,
                               s0, xs0, ys0, s, xs, ys,
                               t0, xt0, yt0, t1, xt1, yt1)) {
          return true;
        }
      }
      if (yt1 >= ys) {
        if (this.findIntersect(that, yrange, ymin, slevel+1, tlevel,
                               s, xs, ys, s1, xs1, ys1,
                               t0, xt0, yt0, t1, xt1, yt1)) {
          return true;
        }
      }
    }
  } else if (t1 - t0 > Curve.TMIN) {
    var t = (t0 + t1) / 2;
    var xt = that.XforT(t);
    var yt = that.YforT(t);
    if (t === t0 || t === t1) {
      throw new InternalError("no t progress!");
    }
    if (yt >= ys0) {
      if (this.findIntersect(that, yrange, ymin, slevel, tlevel+1,
                             s0, xs0, ys0, s1, xs1, ys1,
                             t0, xt0, yt0, t, xt, yt)) {
        return true;
      }
    }
    if (ys1 >= yt) {
      if (this.findIntersect(that, yrange, ymin, slevel, tlevel+1,
                             s0, xs0, ys0, s1, xs1, ys1,
                             t, xt, yt, t1, xt1, yt1)) {
        return true;
      }
    }
  } else {
      // No more subdivisions
    var xlk = xs1 - xs0;
    var ylk = ys1 - ys0;
    var xnm = xt1 - xt0;
    var ynm = yt1 - yt0;
    var xmk = xt0 - xs0;
    var ymk = yt0 - ys0;
    var det = xnm * ylk - ynm * xlk;
    if (det !== 0) {
      var detinv = 1 / det;
      var s = (xnm * ymk - ynm * xmk) * detinv;
      var t = (xlk * ymk - ylk * xmk) * detinv;
      if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        s = s0 + s * (s1 - s0);
        t = t0 + t * (t1 - t0);
        var y = (this.YforT(s) + that.YforT(t)) / 2;
        if (y <= yrange[1] && y > yrange[0]) {
          yrange[1] = y;
          return true;
        }
      }
    }
  }
  return false;
}

Curve.prototype.refineTforY = function(t0, yt0, y0) {
  var t1 = 1;
  while (true) {
    var th = (t0 + t1) / 2;
    if (th === t0 || th === t1) {
      return t1;
    }
    var y = this.YforT(th);
    if (y < y0) {
      t0 = th;
      yt0 = y;
    } else if (y > y0) {
      t1 = th;
    } else {
      return t1;
    }
  }
}

Curve.prototype.fairlyClose = function(v1, v2) {
  return (Math.abs(v1 - v2) <
          Math.max(Math.abs(v1), Math.abs(v2)) * 1E-10);
}

/**
 * Adapted from sun.awt.geom.Order0 
 * @constructor
 * @extends Curve
 * @package
 */
function Order0(x, y) {
  Curve.call(this, Curve.INCREASING);
  this.x = x;
  this.y = y;
}
Order0.prototype = Object.create(Curve.prototype);
Order0.prototype.constructor = Order0;

Order0.prototype.getOrder = function() {
  return 0;
}

Order0.prototype.getXTop = function() {
  return this.x;
}

Order0.prototype.getYTop = function() {
  return this.y;
}

Order0.prototype.getXBot = function() {
  return this.x;
}

Order0.prototype.getYBot = function() {
  return this.y;
}

Order0.prototype.getXMin = function() {
  return this.x;
}

Order0.prototype.getXMax = function() {
  return this.x;
}

Order0.prototype.getX0 = function() {
  return this.x;
}

Order0.prototype.getY0 = function() {
  return this.y;
}

Order0.prototype.getX1 = function() {
  return this.x;
}

Order0.prototype.getY1 = function() {
  return this.y;
}

Order0.prototype.XforY = function(y) {
  return this.y;
}

Order0.prototype.TforY = function(y) {
  return 0;
}

Order0.prototype.XforT = function(t) {
  return this.x;
}

Order0.prototype.YforT = function(t) {
  return this.y;
}

Order0.prototype.dXforT = function(t, deriv) {
  return 0;
}

Order0.prototype.dYforT = function(t, deriv) {
  return 0;
}

Order0.prototype.nextVertical = function(t0, t1) {
  return t1;
}

Order0.prototype.crossingsFor = function(x, y) {
  return 0;
}

Order0.prototype.accumulateCrossings = function(c) {
  return (this.x > c.getXLo() &&
          this.x < c.getXHi() &&
          this.y > c.getYLo() &&
          this.y < c.getYHi());
}

Order0.prototype.enlarge = function(r) {
  r.add(this.x, this.y);
}

Order0.prototype.getSubCurve = function(ystart, yend, dir) {
  return this;
}

Order0.prototype.getReversedCurve = function() {
  return this;
}

Order0.prototype.getSegment = function(coords) {
  coords[0] = this.x;
  coords[1] = this.y;
  return PathIterator.SEG_MOVETO;
}

/**
 * Adapted from sun.awt.geom.Order1 
 * @constructor
 * @extends Curve
 * @package
 */
function Order1(x0, y0, x1, y1, direction) {
  Curve.call(this, direction);
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  if (x0 < x1) {
    this.xmin = x0;
    this.xmax = x1;
  } else {
    this.xmin = x1;
    this.xmax = x0;
  }
}
Order1.prototype = Object.create(Curve.prototype);
Order1.prototype.constructor = Order1;

Order1.prototype.getOrder = function() {
  return 1;
}

Order1.prototype.getXTop = function() {
  return this.x0;
}

Order1.prototype.getYTop = function() {
  return this.y0;
}

Order1.prototype.getXBot = function() {
  return this.x1;
}

Order1.prototype.getYBot = function() {
  return this.y1;
}

Order1.prototype.getXMin = function() {
  return this.xmin;
}

Order1.prototype.getXMax = function() {
  return this.xmax;
}

Order1.prototype.getX0 = function() {
  return (this.direction === Curve.INCREASING) ? this.x0 : this.x1;
}

Order1.prototype.getY0 = function() {
  return (this.direction === Curve.INCREASING) ? this.y0 : this.y1;
}

Order1.prototype.getX1 = function() {
  return (this.direction === Curve.DECREASING) ? this.x0 : this.x1;
}

Order1.prototype.getY1 = function() {
  return (this.direction === Curve.DECREASING) ? this.y0 : this.y1;
}

Order1.prototype.XforY = function(y) {
  if (this.x0 === this.x1 || y <= this.y0) {
    return this.x0;
  }
  if (y >= this.y1) {
    return this.x1;
  }
  return (this.x0 + (y - this.y0) * (this.x1 - this.x0) / (this.y1 - this.y0));
}

Order1.prototype.TforY = function(y) {
  if (y <= this.y0) {
    return 0;
  }
  if (y >= this.y1) {
    return 1;
  }
  return (y - this.y0) / (this.y1 - this.y0);
}

Order1.prototype.XforT = function(t) {
  return this.x0 + t * (this.x1 - this.x0);
}

Order1.prototype.YforT = function(t) {
  return this.y0 + t * (this.y1 - this.y0);
}

Order1.prototype.dXforT = function(t, deriv) {
  switch (deriv) {
    case 0:
      return this.x0 + t * (this.x1 - this.x0);
    case 1:
      return (this.x1 - this.x0);
    default:
      return 0;
  }
}

Order1.prototype.dYforT = function(t, deriv) {
  switch (deriv) {
    case 0:
      return this.y0 + t * (this.y1 - this.y0);
    case 1:
      return (this.y1 - this.y0);
    default:
      return 0;
  }
}

Order1.prototype.nextVertical = function(t0, t1) {
  return t1;
}

Order1.prototype.accumulateCrossings = function(c) {
  var xlo = c.getXLo();
  var ylo = c.getYLo();
  var xhi = c.getXHi();
  var yhi = c.getYHi();
  if (this.xmin >= xhi) {
    return false;
  }
  var xstart, ystart, xend, yend;
  if (this.y0 < ylo) {
    if (this.y1 <= ylo) {
      return false;
    }
    ystart = ylo;
    xstart = this.XforY(ylo);
  } else {
    if (this.y0 >= yhi) {
      return false;
    }
    ystart = this.y0;
    xstart = this.x0;
  }
  if (this.y1 > yhi) {
    yend = yhi;
    xend = this.XforY(yhi);
  } else {
    yend = this.y1;
    xend = this.x1;
  }
  if (xstart >= xhi && xend >= xhi) {
    return false;
  }
  if (xstart > xlo || xend > xlo) {
    return true;
  }
  c.record(ystart, yend, this.direction);
  return false;
}

Order1.prototype.enlarge = function(r) {
  r.add(this.x0, this.y0);
  r.add(this.x1, this.y1);
}

Order1.prototype.getSubCurve = function(ystart, yend, dir) {
  if (dir === undefined) {
    dir = this.direction;
  }
  if (ystart === this.y0 && yend === this.y1) {
    return this.getWithDirection(dir);
  }
  if (this.x0 === this.x1) {
    return new Order1(this.x0, ystart, this.x1, yend, dir);
  }
  var num = this.x0 - this.x1;
  var denom = this.y0 - this.y1;
  var xstart = (this.x0 + (ystart - this.y0) * num / denom);
  var xend = (this.x0 + (yend - this.y0) * num / denom);
  return new Order1(xstart, ystart, xend, yend, dir);
}

Order1.prototype.getReversedCurve = function() {
  return new Order1(this.x0, this.y0, this.x1, this.y1, -this.direction);
}

Order1.prototype.compareTo = function(other, yrange) {
  if (!(other instanceof Order1)) {
    return Curve.prototype.compareTo.call(this, other, yrange);
  }
  var c1 = other;
  if (yrange[1] <= yrange[0]) {
    throw new InternalError("yrange already screwed up...");
  }
  yrange[1] = Math.min(Math.min(yrange[1], this.y1), c1.y1);
  if (yrange[1] <= yrange[0]) {
    throw new InternalError("backstepping from "+yrange[0]+" to "+yrange[1]);
  }
  if (this.xmax <= c1.xmin) {
    return (this.xmin === c1.xmax) ? 0 : -1;
  }
  if (this.xmin >= c1.xmax) {
    return 1;
  }
  
  var dxa = this.x1 - this.x0;
  var dya = this.y1 - this.y0;
  var dxb = c1.x1 - c1.x0;
  var dyb = c1.y1 - c1.y0;
  var denom = dxb * dya - dxa * dyb;
  var y;
  if (denom !== 0) {
    var num = ((this.x0 - c1.x0) * dya * dyb
        - this.y0 * dxa * dyb
        + c1.y0 * dxb * dya);
    y = num / denom;
    if (y <= yrange[0]) {
      y = Math.min(this.y1, c1.y1);
    } else {
      if (y < yrange[1]) {
        yrange[1] = y;
      }
      y = Math.max(this.y0, c1.y0);
    }
  } else {
    y = Math.max(this.y0, c1.y0);
  }
  return Curve.orderof(this.XforY(y), c1.XforY(y));
}

Order1.prototype.getSegment = function(coords) {
  if (this.direction === Curve.INCREASING) {
    coords[0] = this.x1;
    coords[1] = this.y1;
  } else {
    coords[0] = this.x0;
    coords[1] = this.y0;
  }
  return PathIterator.SEG_LINETO;
}


/**
 * Adapted from sun.awt.geom.Order2 
 * @constructor
 * @extends Curve
 * @package
 */
function Order2(x0, y0, cx0, cy0, x1, y1, direction) {
  Curve.call(this, direction);
  if (cy0 < y0) {
    cy0 = y0;
  } else if (cy0 > y1) {
    cy0 = y1;
  }
  this.x0 = x0;
  this.y0 = y0;
  this.cx0 = cx0;
  this.cy0 = cy0;
  this.x1 = x1;
  this.y1 = y1;
  this.xmin = Math.min(Math.min(x0, x1), cx0);
  this.xmax = Math.max(Math.max(x0, x1), cx0);
  this.xcoeff0 = x0;
  this.xcoeff1 = cx0 + cx0 - x0 - x0;
  this.xcoeff2 = x0 - cx0 - cx0 + x1;
  this.ycoeff0 = y0;
  this.ycoeff1 = cy0 + cy0 - y0 - y0;
  this.ycoeff2 = y0 - cy0 - cy0 + y1;
}
Order2.prototype = Object.create(Curve.prototype);
Order2.prototype.constructor = Order1;

Order2.prototype.getOrder = function() {
  return 2;
}

Order2.prototype.getXTop = function() {
  return this.x0;
}

Order2.prototype.getYTop = function() {
  return this.y0;
}

Order2.prototype.getXBot = function() {
  return this.x1;
}

Order2.prototype.getYBot = function() {
  return this.y1;
}

Order2.prototype.getXMin = function() {
  return this.xmin;
}

Order2.prototype.getXMax = function() {
  return this.xmax;
}

Order2.prototype.getX0 = function() {
  return (this.direction === Curve.INCREASING) ? this.x0 : this.x1;
}

Order2.prototype.getY0 = function() {
  return (this.direction === Curve.INCREASING) ? this.y0 : this.y1;
}

Order2.prototype.getCX0 = function() {
  return this.cx0;
}

Order2.prototype.getCY0 = function() {
  return this.cy0;
}

Order2.prototype.getX1 = function() {
  return (this.direction === Curve.DECREASING) ? this.x0 : this.x1;
}

Order2.prototype.getY1 = function() {
  return (this.direction === Curve.DECREASING) ? this.y0 : this.y1;
}

Order2.prototype.XforY = function(y) {
  if (y <= this.y0) {
    return this.x0;
  }
  if (y >= this.y1) {
    return this.x1;
  }
  return this.XforT(this.TforY(y));
}

Order2.prototype.TforY = function(y) {
  if (y <= this.y0) {
    return 0;
  }
  if (y >= this.y1) {
    return 1;
  }
  return Order2.TforY(y, this.ycoeff0, this.ycoeff1, this.ycoeff2);
}

Order2.insert = function(curves, tmp, x0, y0, cx0, cy0, x1, y1, direction) {
  var numparams = Order2.getHorizontalParams(y0, cy0, y1, tmp);
  if (numparams === 0) {
    Order2.addInstance(curves, x0, y0, cx0, cy0, x1, y1, direction);
    return;
  }
  var t = tmp[0];
  tmp[0] = x0;  tmp[1] = y0;
  tmp[2] = cx0; tmp[3] = cy0;
  tmp[4] = x1;  tmp[5] = y1;
  Order2.split(tmp, 0, t);
  var i0 = (direction === Curve.INCREASING)? 0 : 4;
  var i1 = 4 - i0;
  Order2.addInstance(curves, tmp[i0], tmp[i0 + 1], tmp[i0 + 2], tmp[i0 + 3],
      tmp[i0 + 4], tmp[i0 + 5], direction);
  Order2.addInstance(curves, tmp[i1], tmp[i1 + 1], tmp[i1 + 2], tmp[i1 + 3],
      tmp[i1 + 4], tmp[i1 + 5], direction);
}

Order2.addInstance = function(curves, x0, y0, cx0, cy0, x1, y1, direction) {
  if (y0 > y1) {
    curves.push(new Order2(x1, y1, cx0, cy0, x0, y0, -direction));
  } else if (y1 > y0) {
    curves.push(new Order2(x0, y0, cx0, cy0, x1, y1, direction));
  }
}

Order2.getHorizontalParams = function(c0, cp, c1, ret) {
  if (c0 <= cp && cp <= c1) {
    return 0;
  }
  c0 -= cp;
  c1 -= cp;
  var denom = c0 + c1;
  if (denom === 0) {
    return 0;
  }
  var t = c0 / denom;
  if (t <= 0 || t >= 1) {
    return 0;
  }
  ret[0] = t;
  return 1;
}

Order2.split = function(coords, pos, t) {
  var x0, y0, cx, cy, x1, y1;
  coords[pos+8] = x1 = coords[pos+4];
  coords[pos+9] = y1 = coords[pos+5];
  cx = coords[pos+2];
  cy = coords[pos+3];
  x1 = cx + (x1 - cx) * t;
  y1 = cy + (y1 - cy) * t;
  x0 = coords[pos+0];
  y0 = coords[pos+1];
  x0 = x0 + (cx - x0) * t;
  y0 = y0 + (cy - y0) * t;
  cx = x0 + (x1 - x0) * t;
  cy = y0 + (y1 - y0) * t;
  coords[pos+2] = x0;
  coords[pos+3] = y0;
  coords[pos+4] = cx;
  coords[pos+5] = cy;
  coords[pos+6] = x1;
  coords[pos+7] = y1;
}

Order2.TforY = function(y, ycoeff0, ycoeff1, ycoeff2) {
  ycoeff0 -= y;
  if (ycoeff2 === 0.0) {
    var root = -ycoeff0 / ycoeff1;
    if (root >= 0 && root <= 1) {
      return root;
    }
  } else {
    var d = ycoeff1 * ycoeff1 - 4.0 * ycoeff2 * ycoeff0;
    if (d >= 0.0) {
      d = Math.sqrt(d);
      if (ycoeff1 < 0.0) {
        d = -d;
      }
      var q = (ycoeff1 + d) / -2.0;
      var root = q / ycoeff2;
      if (root >= 0 && root <= 1) {
        return root;
      }
      if (q !== 0.0) {
        root = ycoeff0 / q;
        if (root >= 0 && root <= 1) {
          return root;
        }
      }
    }
  }
  var y0 = ycoeff0;
  var y1 = ycoeff0 + ycoeff1 + ycoeff2;
  return (0 < (y0 + y1) / 2) ? 0.0 : 1.0;
}

Order2.prototype.XforT = function(t) {
  return (this.xcoeff2 * t + this.xcoeff1) * t + this.xcoeff0;
}

Order2.prototype.YforT = function(t) {
  return (this.ycoeff2 * t + this.ycoeff1) * t + this.ycoeff0;
}

Order2.prototype.dXforT = function(t, deriv) {
  switch (deriv) {
    case 0:
      return (this.xcoeff2 * t + this.xcoeff1) * t + this.xcoeff0;
    case 1:
      return 2 * this.xcoeff2 * t + this.xcoeff1;
    case 2:
      return 2 * this.xcoeff2;
    default:
      return 0;
  }
}

Order2.prototype.dYforT = function(t, deriv) {
  switch (deriv) {
    case 0:
      return (this.ycoeff2 * t + this.ycoeff1) * t + this.ycoeff0;
    case 1:
      return 2 * this.ycoeff2 * t + this.ycoeff1;
    case 2:
      return 2 * this.ycoeff2;
    default:
      return 0;
  }
}

Order2.prototype.nextVertical = function(t0, t1) {
  var t = -this.xcoeff1 / (2 * this.xcoeff2);
  if (t > t0 && t < t1) {
    return t;
  }
  return t1;
}

Order2.prototype.enlarge = function(r) {
  r.add(this.x0, this.y0);
  var t = -this.xcoeff1 / (2 * this.xcoeff2);
  if (t > 0 && t < 1) {
    r.add(this.XforT(t), this.YforT(t));
  }
  r.add(this.x1, this.y1);
}

Order2.prototype.getSubCurve = function(ystart, yend, dir) {
  if (dir === undefined) {
    dir = this.direction;
  }
  var t0, t1;
  if (ystart <= this.y0) {
    if (yend >= this.y1) {
      return this.getWithDirection(dir);
    }
    t0 = 0;
  } else {
    t0 = Order2.TforY(ystart, this.ycoeff0, this.ycoeff1, this.ycoeff2);
  }
  if (yend >= y1) {
    t1 = 1;
  } else {
    t1 = Order2.TforY(yend, this.ycoeff0, this.ycoeff1, this.ycoeff2);
  }
  var eqn = new Array(10);
  eqn[0] = this.x0;
  eqn[1] = this.y0;
  eqn[2] = this.cx0;
  eqn[3] = this.cy0;
  eqn[4] = this.x1;
  eqn[5] = this.y1;
  if (t1 < 1) {
    Order2.split(eqn, 0, t1);
  }
  var i;
  if (t0 <= 0) {
    i = 0;
  } else {
    Order2.split(eqn, 0, t0 / t1);
    i = 4;
  }
  return new Order2(eqn[i+0], ystart,
                    eqn[i+2], eqn[i+3],
                    eqn[i+4], yend,
                    dir);
}

Order2.prototype.getReversedCurve = function() {
  return new Order2(this.x0, this.y0, this.cx0, this.cy0, this.x1, this.y1, -this.direction);
}

Order2.prototype.getSegment = function(coords) {
  coords[0] = this.cx0;
  coords[1] = this.cy0;
  if (this.direction === Curve.INCREASING) {
    coords[2] = this.x1;
    coords[3] = this.y1;
  } else {
    coords[2] = this.x0;
    coords[3] = this.y0;
  }
  return PathIterator.SEG_QUADTO;
}


/**
 * Adapted from sun.awt.geom.Order3 
 * @constructor
 * @extends Curve
 * @package
 */
function Order3(x0, y0, cx0, cy0, cx1, cy1, x1, y1, direction) {
  Curve.call(this, direction);
  if (cy0 < y0) 
    this.cy0 = y0;
  if (cy1 > y1) 
    this.cy1 = y1;
  this.x0 = x0;
  this.y0 = y0;
  this.cx0 = cx0;
  this.cy0 = cy0; // ???
  this.cx1 = cx1;
  this.cy1 = cy1; // ???
  this.x1 = x1;
  this.y1 = y1;
  this.xmin = Math.min(Math.min(x0, x1), Math.min(cx0, cx1));
  this.xmax = Math.max(Math.max(x0, x1), Math.max(cx0, cx1));
  this.xcoeff0 = x0;
  this.xcoeff1 = (cx0 - x0) * 3.0;
  this.xcoeff2 = (cx1 - cx0 - cx0 + x0) * 3.0;
  this.xcoeff3 = x1 - (cx1 - cx0) * 3.0 - x0;
  this.ycoeff0 = y0;
  this.ycoeff1 = (cy0 - y0) * 3.0;
  this.ycoeff2 = (cy1 - cy0 - cy0 + y0) * 3.0;
  this.ycoeff3 = y1 - (cy1 - cy0) * 3.0 - y0;
  this.YforT1 = this.YforT2 = this.YforT3 = y0;
  this.TforY1 = this.TforY2 = this.TforY3 = 0;
}
Order3.prototype = Object.create(Curve.prototype);
Order3.prototype.constructor = Order3;

Order3.prototype.getOrder = function() {
  return 3;
}

Order3.prototype.getXTop = function() {
  return this.x0;
}

Order3.prototype.getYTop = function() {
  return this.y0;
}

Order3.prototype.getXBot = function() {
  return this.x1;
}

Order3.prototype.getYBot = function() {
  return this.y1;
}

Order3.prototype.getXMin = function() {
  return this.xmin;
}

Order3.prototype.getXMax = function() {
  return this.xmax;
}

Order3.prototype.getX0 = function() {
  return (this.direction === Curve.INCREASING) ? this.x0 : this.x1;
}

Order3.prototype.getY0 = function() {
  return (this.direction === Curve.INCREASING) ? this.y0 : this.y1;
}

Order3.prototype.getCX0 = function() {
  return (this.direction === Curve.INCREASING) ? this.cx0 : this.cx1;
}

Order3.prototype.getCY0 = function() {
  return (this.direction === Curve.INCREASING) ? this.cy0 : this.cy1;
}

Order3.prototype.getCX1 = function() {
  return (this.direction === Curve.DECREASING) ? this.cx0 : this.cx1;
}

Order3.prototype.getCY1 = function() {
  return (this.direction === Curve.DECREASING) ? this.cy0 : this.cy1;
}

Order3.prototype.getX1 = function() {
  return (this.direction === Curve.DECREASING) ? this.x0 : this.x1;
}

Order3.prototype.getY1 = function() {
  return (this.direction === Curve.DECREASING) ? this.y0 : this.y1;
}

Order3.insert = function(curves, tmp, x0, y0, cx0, cy0, cx1, cy1, x1, y1, direction) {
  var numparams = Order3.getHorizontalParams(y0, cy0, cy1, y1, tmp);
  if (numparams === 0) {
    Order3.addInstance(curves, x0, y0, cx0, cy0, cx1, cy1, x1, y1, direction);
    return;
  }
  // Store coordinates for splitting at tmp[3..10]
  tmp[3] = x0;  tmp[4]  = y0;
  tmp[5] = cx0; tmp[6]  = cy0;
  tmp[7] = cx1; tmp[8]  = cy1;
  tmp[9] = x1;  tmp[10] = y1;
  var t = tmp[0];
  if (numparams > 1 && t > tmp[1]) {
    // Perform a "2 element sort"...
    tmp[0] = tmp[1];
    tmp[1] = t;
    t = tmp[0];
  }
  Order3.split(tmp, 3, t);
  if (numparams > 1) {
    // Recalculate tmp[1] relative to the range [tmp[0]...1]
    t = (tmp[1] - t) / (1 - t);
    Order3.split(tmp, 9, t);
  }
  var index = 3;
  if (direction === Curve.DECREASING) {
    index += numparams * 6;
  }
  while (numparams >= 0) {
    Order3.addInstance(curves,
                       tmp[index + 0], tmp[index + 1],
                       tmp[index + 2], tmp[index + 3],
                       tmp[index + 4], tmp[index + 5],
                       tmp[index + 6], tmp[index + 7],
                       direction);
    numparams--;
    if (direction === Curve.INCREASING) {
      index += 6;
    } else {
      index -= 6;
    }
  }
}

Order3.addInstance = function(curves, x0, y0, cx0, cy0, cx1, cy1, x1, y1, direction) {
  if (y0 > y1) {
    curves.push(new Order3(x1, y1, cx1, cy1, cx0, cy0, x0, y0, -direction));
  } else if (y1 > y0) {
    curves.push(new Order3(x0, y0, cx0, cy0, cx1, cy1, x1, y1, direction));
  }
}

Order3.getHorizontalParams = function(c0, cp0, cp1, c1, ret) {
  if (c0 <= cp0 && cp0 <= cp1 && cp1 <= c1) {
    return 0;
  }
  c1 -= cp1;
  cp1 -= cp0;
  cp0 -= c0;
  ret[0] = cp0;
  ret[1] = (cp1 - cp0) * 2;
  ret[2] = (c1 - cp1 - cp1 + cp0);
  var numroots = QuadCurve2D.solveQuadratic(ret, ret);
  var j = 0;
  for (var i = 0; i < numroots; i++) {
    var t = ret[i];
    if (t > 0 && t < 1) {
      if (j < i) {
        ret[j] = t;
      }
      j++;
    }
  }
  return j;
}

Order3.split = function(coords, pos, t) {
  var x0, y0, cx0, cy0, cx1, cy1, x1, y1;
  coords[pos+12] = x1 = coords[pos+6];
  coords[pos+13] = y1 = coords[pos+7];
  cx1 = coords[pos+4];
  cy1 = coords[pos+5];
  x1 = cx1 + (x1 - cx1) * t;
  y1 = cy1 + (y1 - cy1) * t;
  x0 = coords[pos+0];
  y0 = coords[pos+1];
  cx0 = coords[pos+2];
  cy0 = coords[pos+3];
  x0 = x0 + (cx0 - x0) * t;
  y0 = y0 + (cy0 - y0) * t;
  cx0 = cx0 + (cx1 - cx0) * t;
  cy0 = cy0 + (cy1 - cy0) * t;
  cx1 = cx0 + (x1 - cx0) * t;
  cy1 = cy0 + (y1 - cy0) * t;
  cx0 = x0 + (cx0 - x0) * t;
  cy0 = y0 + (cy0 - y0) * t;
  coords[pos+2] = x0;
  coords[pos+3] = y0;
  coords[pos+4] = cx0;
  coords[pos+5] = cy0;
  coords[pos+6] = cx0 + (cx1 - cx0) * t;
  coords[pos+7] = cy0 + (cy1 - cy0) * t;
  coords[pos+8] = cx1;
  coords[pos+9] = cy1;
  coords[pos+10] = x1;
  coords[pos+11] = y1;
}

Order3.prototype.TforY = function(y) {
  if (y <= this.y0) return 0;
  if (y >= this.y1) return 1;
  if (y === this.YforT1) return this.TforY1;
  if (y === this.YforT2) return this.TforY2;
  if (y === this.YforT3) return this.TforY3;
  if (this.ycoeff3 === 0.0) {
    return Order2.TforY(y, this.ycoeff0, this.ycoeff1, this.ycoeff2);
  }
  var a = this.ycoeff2 / this.ycoeff3;
  var b = this.ycoeff1 / this.ycoeff3;
  var c = (this.ycoeff0 - y) / this.ycoeff3;
  var roots = 0;
  var Q = (a * a - 3.0 * b) / 9.0;
  var R = (2.0 * a * a * a - 9.0 * a * b + 27.0 * c) / 54.0;
  var R2 = R * R;
  var Q3 = Q * Q * Q;
  var a_3 = a / 3.0;
  var t;
  if (R2 < Q3) {
    var theta = Math.acos(R / Math.sqrt(Q3));
    Q = -2.0 * Math.sqrt(Q);
    t = this.refine(a, b, c, y, Q * Math.cos(theta / 3.0) - a_3);
    if (t < 0) {
      t = this.refine(a, b, c, y,
          Q * Math.cos((theta + Math.PI * 2.0)/ 3.0) - a_3);
    }
    if (t < 0) {
      t = this.refine(a, b, c, y,
          Q * Math.cos((theta - Math.PI * 2.0)/ 3.0) - a_3);
    }
  } else {
    var neg = (R < 0.0);
    var S = Math.sqrt(R2 - Q3);
    if (neg) {
      R = -R;
    }
    var A = Math.pow(R + S, 1.0 / 3.0);
    if (!neg) {
      A = -A;
    }
    var B = (A === 0.0) ? 0.0 : (Q / A);
    t = this.refine(a, b, c, y, (A + B) - a_3);
  }
  if (t < 0) {
    var t0 = 0;
    var t1 = 1;
    while (true) {
      t = (t0 + t1) / 2;
      if (t === t0 || t === t1) {
        break;
      }
      var yt = this.YforT(t);
      if (yt < y) {
        t0 = t;
      } else if (yt > y) {
        t1 = t;
      } else {
        break;
      }
    }
  }
  if (t >= 0) {
    this.TforY3 = this.TforY2;
    this.YforT3 = this.YforT2;
    this.TforY2 = this.TforY1;
    this.YforT2 = this.YforT1;
    this.TforY1 = t;
    this.YforT1 = y;
  }
  return t;
}

Order3.prototype.refine = function(a, b, c, target, t) {
  if (t < -0.1 || t > 1.1) {
    return -1;
  }
  var y = this.YforT(t);
  var t0, t1;
  if (y < target) {
    t0 = t;
    t1 = 1;
  } else {
    t0 = 0;
    t1 = t;
  }
  var origt = t;
  var origy = y;
  var useslope = true;
  while (y !== target) {
    if (!useslope) {
      var t2 = (t0 + t1) / 2;
      if (t2 === t0 || t2 === t1) {
        break;
      }
      t = t2;
    } else {
      var slope = this.dYforT(t, 1);
      if (slope === 0) {
        useslope = false;
        continue;
      }
      var t2 = t + ((target - y) / slope);
      if (t2 === t || t2 <= t0 || t2 >= t1) {
        useslope = false;
        continue;
      }
      t = t2;
    }
    y = this.YforT(t);
    if (y < target) {
      t0 = t;
    } else if (y > target) {
      t1 = t;
    } else {
      break;
    }
  }
  return (t > 1) ? -1 : t;
}

Order3.prototype.XforY = function(y) {
  if (y <= this.y0) {
    return this.x0;
  }
  if (y >= this.y1) {
    return this.x1;
  }
  return this.XforT(this.TforY(y));
}

Order3.prototype.XforT = function(t) {
  return (((this.xcoeff3 * t) + this.xcoeff2) * t + this.xcoeff1) * t + this.xcoeff0;
}

Order3.prototype.YforT = function(t) {
  return (((this.ycoeff3 * t) + this.ycoeff2) * t + this.ycoeff1) * t + this.ycoeff0;
}

Order3.prototype.dXforT = function(t, deriv) {
  switch (deriv) {
    case 0:
      return (((this.xcoeff3 * t) + this.xcoeff2) * t + this.xcoeff1) * t + this.xcoeff0;
    case 1:
      return ((3 * this.xcoeff3 * t) + 2 * this.xcoeff2) * t + this.xcoeff1;
    case 2:
      return (6 * this.xcoeff3 * t) + 2 * this.xcoeff2;
    case 3:
      return 6 * this.xcoeff3;
    default:
      return 0;
  }
}

Order3.prototype.dYforT = function(t, deriv) {
  switch (deriv) {
    case 0:
      return (((this.ycoeff3 * t) + this.ycoeff2) * t + this.ycoeff1) * t + this.ycoeff0;
    case 1:
      return ((3 * this.ycoeff3 * t) + 2 * this.ycoeff2) * t + this.ycoeff1;
    case 2:
      return (6 * this.ycoeff3 * t) + 2 * this.ycoeff2;
    case 3:
      return 6 * this.ycoeff3;
    default:
      return 0;
  }
}

Order3.prototype.nextVertical = function(t0, t1) {
  var eqn = [this.xcoeff1, 2 * this.xcoeff2, 3 * this.xcoeff3];
  var numroots = QuadCurve2D.solveQuadratic(eqn, eqn);
  for (var i = 0; i < numroots; i++) {
    if (eqn[i] > t0 && eqn[i] < t1) {
      t1 = eqn[i];
    }
  }
  return t1;
}

Order3.prototype.enlarge = function(r) {
  r.add(this.x0, this.y0);
  var eqn = [this.xcoeff1, 2 * this.xcoeff2, 3 * this.xcoeff3];
  var numroots = QuadCurve2D.solveQuadratic(eqn, eqn);
  for (var i = 0; i < numroots; i++) {
    var t = eqn[i];
    if (t > 0 && t < 1) {
      r.add(this.XforT(t), this.YforT(t));
    }
  }
  r.add(this.x1, this.y1);
}

Order3.prototype.getSubCurve = function(ystart, yend, dir) {
  if (dir === undefined) {
    dir = this.direction;
  }
  if (ystart <= this.y0 && yend >= this.y1) {
    return this.getWithDirection(dir);
  }
  var eqn = new Array(14);
  var t0, t1;
  t0 = this.TforY(ystart);
  t1 = this.TforY(yend);
  eqn[0] = this.x0;
  eqn[1] = this.y0;
  eqn[2] = this.cx0;
  eqn[3] = this.cy0;
  eqn[4] = this.cx1;
  eqn[5] = this.cy1;
  eqn[6] = this.x1;
  eqn[7] = this.y1;
  if (t0 > t1) {
    var t = t0;
    t0 = t1;
    t1 = t;
  }
  if (t1 < 1) {
    Order3.split(eqn, 0, t1);
  }
  var i;
  if (t0 <= 0) {
    i = 0;
  } else {
    Order3.split(eqn, 0, t0 / t1);
    i = 6;
  }
  return new Order3(eqn[i+0], ystart,
                    eqn[i+2], eqn[i+3],
                    eqn[i+4], eqn[i+5],
                    eqn[i+6], yend,
                    dir);
}

Order3.prototype.getReversedCurve = function() {
  return new Order3(this.x0, this.y0, this.cx0, this.cy0, this.cx1, this.cy1, this.x1, this.y1, -this.direction);
}

Order3.prototype.getSegment = function(coords) {
  if (this.direction === Curve.INCREASING) {
    coords[0] = this.cx0;
    coords[1] = this.cy0;
    coords[2] = this.cx1;
    coords[3] = this.cy1;
    coords[4] = this.x1;
    coords[5] = this.y1;
  } else {
    coords[0] = this.cx1;
    coords[1] = this.cy1;
    coords[2] = this.cx0;
    coords[3] = this.cy0;
    coords[4] = this.x0;
    coords[5] = this.y0;
  }
  return PathIterator.SEG_CUBICTO;
}


/**
 * Adapted from sun.awt.geom.Crossings
 * @constructor
 */
function Crossings(xlo, ylo, xhi, yhi) {
  this.xlo = xlo;
  this.ylo = ylo;
  this.xhi = xhi;
  this.yhi = yhi;
  this.limit = 0;
  this.yranges = new Array(10);
}

Crossings.prototype.getXLo = function() {
  return this.xlo;
}

Crossings.prototype.getYLo = function() {
  return this.ylo;
}

Crossings.prototype.getXHi = function() {
  return this.xhi;
}

Crossings.prototype.getYHi = function() {
  return this.yhi;
}

Crossings.prototype.isEmpty = function() {
  return (this.limit === 0);
}

Crossings.findCrossings = function(curves, xlo, ylo, xhi, yhi) {
  var cross = new CrossingsEvenOdd(xlo, ylo, xhi, yhi);
  for (var i = 0; i < curves.length; i++) {
    var c = curves [i];
    if (c.accumulateCrossings(cross)) {
      return null;
    }
  }
  return cross;
}

Crossings.findCrossings = function(pi, xlo, ylo, xhi, yhi) {
  var cross;
  if (pi.getWindingRule() === PathIterator.WIND_EVEN_ODD) {
    cross = new CrossingsEvenOdd(xlo, ylo, xhi, yhi);
  } else {
    cross = new CrossingsNonZero(xlo, ylo, xhi, yhi);
  }
  var coords = new Array(23);
  var movx = 0;
  var movy = 0;
  var curx = 0;
  var cury = 0;
  var newx, newy;
  while (!pi.isDone()) {
    var type = pi.currentSegment(coords);
    switch (type) {
      case PathIterator.SEG_MOVETO:
        if (movy !== cury &&
            cross.accumulateLine(curx, cury, movx, movy)) {
          return null;
        }
        movx = curx = coords[0];
        movy = cury = coords[1];
        break;
      case PathIterator.SEG_LINETO:
        newx = coords[0];
        newy = coords[1];
        if (cross.accumulateLine(curx, cury, newx, newy)) {
          return null;
        }
        curx = newx;
        cury = newy;
        break;
      case PathIterator.SEG_QUADTO:
        newx = coords[2];
        newy = coords[3];
        if (cross.accumulateQuad(curx, cury, coords)) {
          return null;
        }
        curx = newx;
        cury = newy;
        break;
      case PathIterator.SEG_CUBICTO:
        newx = coords[4];
        newy = coords[5];
        if (cross.accumulateCubic(curx, cury, coords)) {
          return null;
        }
        curx = newx;
        cury = newy;
        break;
      case PathIterator.SEG_CLOSE:
        if (movy !== cury &&
            cross.accumulateLine(curx, cury, movx, movy))
        {
          return null;
        }
        curx = movx;
        cury = movy;
        break;
    }
    pi.next();
  }
  if (movy !== cury) {
    if (cross.accumulateLine(curx, cury, movx, movy)) {
      return null;
    }
  }
  return cross;
}

Crossings.prototype.accumulateLine = function(x0, y0, x1, y1, direction) {
  if (direction === undefined) {
    if (y0 <= y1) {
      return this.accumulateLine(x0, y0, x1, y1, 1);
    } else {
      return this.accumulateLine(x1, y1, x0, y0, -1);
    }
  } else {
    if (this.yhi <= y0 || this.ylo >= y1) {
      return false;
    }
    if (x0 >= this.xhi && x1 >= this.xhi) {
      return false;
    }
    if (y0 === y1) {
      return (x0 >= this.xlo || x1 >= this.xlo);
    }
    var xstart, ystart, xend, yend;
    var dx = (x1 - x0);
    var dy = (y1 - y0);
    if (y0 < this.ylo) {
      xstart = x0 + (this.ylo - y0) * dx / dy;
      ystart = this.ylo;
    } else {
      xstart = x0;
      ystart = y0;
    }
    if (this.yhi < y1) {
      xend = x0 + (this.yhi - y0) * dx / dy;
      yend = this.yhi;
    } else {
      xend = x1;
      yend = y1;
    }
    if (xstart >= this.xhi && xend >= this.xhi) {
      return false;
    }
    if (xstart > this.xlo || xend > this.xlo) {
      return true;
    }
    this.record(ystart, yend, direction);
    return false; 
  }
}

Crossings.prototype.accumulateQuad = function(x0, y0, coords) {
  if (y0 < this.ylo && coords[1] < this.ylo && coords[3] < this.ylo) {
    return false;
  }
  if (y0 > this.yhi && coords[1] > this.yhi && coords[3] > this.yhi) {
    return false;
  }
  if (x0 > this.xhi && coords[0] > this.xhi && coords[2] > this.xhi) {
    return false;
  }
  if (x0 < this.xlo && coords[0] < this.xlo && coords[2] < this.xlo) {
    if (y0 < coords[3]) {
      this.record(Math.max(y0, this.ylo), Math.min(coords[3], this.yhi), 1);
    } else if (y0 > coords[3]) {
      this.record(Math.max(coords[3], this.ylo), Math.min(y0, this.yhi), -1);
    }
    return false;
  }
  var tmp = [];
  Curve.insertQuad(tmp, x0, y0, coords);
  for (var i = 0; i < tmp.length; i++) {
    var c = tmp [i];
    if (c.accumulateCrossings(this)) {
      return true;
    }
  }
  return false;
}

Crossings.prototype.accumulateCubic = function(x0, y0, coords) {
  if (y0 < this.ylo && coords[1] < this.ylo &&
      coords[3] < this.ylo && coords[5] < this.ylo)
  {
    return false;
  }
  if (y0 > this.yhi && coords[1] > this.yhi &&
      coords[3] > this.yhi && coords[5] > this.yhi)
  {
    return false;
  }
  if (x0 > this.xhi && coords[0] > this.xhi &&
      coords[2] > this.xhi && coords[4] > this.xhi)
  {
    return false;
  }
  if (x0 < this.xlo && coords[0] < this.xlo &&
      coords[2] < this.xlo && coords[4] < this.xlo)
  {
    if (y0 <= coords[5]) {
      this.record(Math.max(y0, this.ylo), Math.min(coords[5], this.yhi), 1);
    } else {
      this.record(Math.max(coords[5], this.ylo), Math.min(y0, this.yhi), -1);
    }
    return false;
  }
  var tmp = [];
  Curve.insertCubic(this.tmp, x0, y0, coords);
  for (var i = 0; i < tmp.length; i++) {
    var c = tmp [i];
    if (c.accumulateCrossings(this)) {
      return true;
    }
  }
  return false;
}

/**
 * @constructor
 * @extends Crossings
 * @package
 */  
function CrossingsEvenOdd(xlo, ylo, xhi, yhi) {
  Crossings.call(this, xlo, ylo, xhi, yhi);
}
CrossingsEvenOdd.prototype = Object.create(Crossings.prototype);
CrossingsEvenOdd.prototype.constructor = CrossingsEvenOdd;

CrossingsEvenOdd.prototype.covers = function(ystart, yend) {
  return (this.limit === 2 && this.yranges[0] <= ystart && this.yranges[1] >= yend);
}

CrossingsEvenOdd.prototype.record = function(ystart, yend, direction) {
  if (ystart >= yend) {
    return;
  }
  var from = 0;
  // Quickly jump over all pairs that are completely "above"
  while (from < this.limit && ystart > this.yranges[from+1]) {
    from += 2;
  }
  var to = from;
  while (from < this.limit) {
    var yrlo = this.yranges[from++];
    var yrhi = this.yranges[from++];
    if (yend < yrlo) {
      // Quickly handle insertion of the new range
      this.yranges[to++] = ystart;
      this.yranges[to++] = yend;
      ystart = yrlo;
      yend = yrhi;
      continue;
    }
    // The ranges overlap - sort, collapse, insert, iterate
    var yll, ylh, yhl, yhh;
    if (ystart < yrlo) {
      yll = ystart;
      ylh = yrlo;
    } else {
      yll = yrlo;
      ylh = ystart;
    }
    if (yend < yrhi) {
      yhl = yend;
      yhh = yrhi;
    } else {
      yhl = yrhi;
      yhh = yend;
    }
    if (ylh === yhl) {
      ystart = yll;
      yend = yhh;
    } else {
      if (ylh > yhl) {
        ystart = yhl;
        yhl = ylh;
        ylh = ystart;
      }
      if (yll !== ylh) {
        this.yranges[to++] = yll;
        this.yranges[to++] = ylh;
      }
      ystart = yhl;
      yend = yhh;
    }
    if (ystart >= yend) {
      break;
    }
  }
  if (to < from && from < this.limit) {
    System.arraycopy(this.yranges, from, this.yranges, to, this.limit-from);
  }
  to += (this.limit-from);
  if (ystart < yend) {
    if (to >= this.yranges.length) {
      var newranges = new Array(to+10);
      System.arraycopy(this.yranges, 0, newranges, 0, to);
      this.yranges = newranges;
    }
    this.yranges[to++] = ystart;
    this.yranges[to++] = yend;
  }
  this.limit = to;
}

/**
 * @constructor
 * @extends Crossings
 * @package
 */  
function CrossingsNonZero(xlo, ylo, xhi, yhi) {
  Crossings.call(this.xlo, ylo, xhi, yhi);
  this.crosscounts = new Array(this.yranges.length / 2);
}
CrossingsNonZero.prototype = Object.create(Crossings.prototype);
CrossingsNonZero.prototype.constructor = CrossingsNonZero;

CrossingsNonZero.prototype.covers = function(ystart, yend) {
  var i = 0;
  while (i < this.limit) {
    var ylo = this.yranges[i++];
    var yhi = this.yranges[i++];
    if (ystart >= yhi) {
      continue;
    }
    if (ystart < ylo) {
      return false;
    }
    if (yend <= yhi) {
      return true;
    }
    ystart = yhi;
  }
  return (ystart >= yend);
}

CrossingsNonZero.prototype.remove = function(cur) {
  this.limit -= 2;
  var rem = this.limit - cur;
  if (rem > 0) {
    System.arraycopy(this.yranges, cur+2, this.yranges, cur, rem);
    System.arraycopy(crosscounts, cur/2+1,
        crosscounts, cur/2,
        rem/2);
  }
}

CrossingsNonZero.prototype.insert = function(cur, lo, hi, dir) {
  var rem = this.limit - cur;
  var oldranges = this.yranges;
  var oldcounts = crosscounts;
  if (this.limit >= this.yranges.length) {
    this.yranges = new Array(this.limit+10);
    System.arraycopy(oldranges, 0, this.yranges, 0, cur);
    crosscounts = new Array((this.limit+10)/2);
    System.arraycopy(oldcounts, 0, crosscounts, 0, cur/2);
  }
  if (rem > 0) {
    System.arraycopy(oldranges, cur, this.yranges, cur+2, rem);
    System.arraycopy(oldcounts, cur/2,
        crosscounts, cur/2+1,
        rem/2);
  }
  this.yranges[cur+0] = lo;
  this.yranges[cur+1] = hi;
  crosscounts[cur/2] = dir;
  this.limit += 2;
}

CrossingsNonZero.prototype.record = function(ystart, yend, direction) {
  if (ystart >= yend) {
    return;
  }
  var cur = 0;
  while (cur < this.limit && ystart > this.yranges[cur+1]) {
    cur += 2;
  }
  if (cur < this.limit) {
    var rdir = crosscounts[cur/2];
    var yrlo = this.yranges[cur+0];
    var yrhi = this.yranges[cur+1];
    if (yrhi === ystart && rdir === direction) {
      if (cur+2 === this.limit) {
        this.yranges[cur+1] = yend;
        return;
      }
      this.remove(cur);
      ystart = yrlo;
      rdir = crosscounts[cur/2];
      yrlo = this.yranges[cur+0];
      yrhi = this.yranges[cur+1];
    }
    if (yend < yrlo) {
      this.insert(cur, ystart, yend, direction);
      return;
    }
    if (yend === yrlo && rdir === direction) {
      this.yranges[cur] = ystart;
      return;
    }
    if (ystart < yrlo) {
      this.insert(cur, ystart, yrlo, direction);
      cur += 2;
      ystart = yrlo;
    } else if (yrlo < ystart) {
      this.insert(cur, yrlo, ystart, rdir);
      cur += 2;
      yrlo = ystart;
    }
    var newdir = rdir + direction;
    var newend = Math.min(yend, yrhi);
    if (newdir === 0) {
      this.remove(cur);
    } else {
      crosscounts[cur/2] = newdir;
      this.yranges[cur++] = ystart;
      this.yranges[cur++] = newend;
    }
    ystart = yrlo = newend;
    if (yrlo < yrhi) {
      this.insert(cur, yrlo, yrhi, rdir);
    }
  }
  if (ystart < yend) {
    this.insert(cur, ystart, yend, direction);
  }
}

/**
 * Adapted from sun.awt.geom.AreaOp
 * @constructor
 * @package
 */
function AreaOp() {
}

AreaOp.CTAG_LEFT = 0;
AreaOp.CTAG_RIGHT = 1;
AreaOp.ETAG_IGNORE = 0;
AreaOp.ETAG_ENTER = 1;
AreaOp.ETAG_EXIT = -1;
AreaOp.RSTAG_INSIDE = 1;
AreaOp.RSTAG_OUTSIDE = -1;

AreaOp.EmptyLinkList = [null, null];
AreaOp.EmptyChainList = [null, null]

AreaOp.prototype.calculate = function(left, right) {
  var edges = [];
  AreaOp.addEdges(edges, left, AreaOp.CTAG_LEFT);
  AreaOp.addEdges(edges, right, AreaOp.CTAG_RIGHT);
  edges = this.pruneEdges(edges);
  return edges;
}

AreaOp.addEdges = function(edges, curves, curvetag) {
  for (var i = 0; i < curves.length; i++) {
    var c = curves [i];
    if (c.getOrder() > 0) {
      edges.push(new Edge(c, curvetag));
    }
  }
}

AreaOp.YXTopComparator = function(o1, o2) {
  var c1 = o1.getCurve();
  var c2 = o2.getCurve();
  var v1, v2;
  if ((v1 = c1.getYTop()) === (v2 = c2.getYTop())) {
    if ((v1 = c1.getXTop()) === (v2 = c2.getXTop())) {
      return 0;
    }
  }
  if (v1 < v2) {
    return -1;
  }
  return 1;
}

AreaOp.prototype.pruneEdges = function(edges) {
  var numedges = edges.length;
  if (numedges < 2) {
    return edges;
  }
  var edgelist = edges.slice(0);
  edgelist.sort(AreaOp.YXTopComparator);
  var e;
  var left = 0;
  var right = 0;
  var cur = 0;
  var next = 0;
  var yrange = [0, 0];
  var subcurves = [];
  var chains = [];
  var links = [];
  while (left < numedges) {
    var y = yrange[0];
    for (cur = next = right - 1; cur >= left; cur--) {
      e = edgelist[cur];
      if (e.getCurve().getYBot() > y) {
        if (next > cur) {
          edgelist[next] = e;
        }
        next--;
      }
    }
    left = next + 1;
    if (left >= right) {
      if (right >= numedges) {
        break;
      }
      y = edgelist[right].getCurve().getYTop();
      if (y > yrange[0]) {
        AreaOp.finalizeSubCurves(subcurves, chains);
      }
      yrange[0] = y;
    }
    while (right < numedges) {
      e = edgelist[right];
      if (e.getCurve().getYTop() > y) {
        break;
      }
      right++;
    }
    yrange[1] = edgelist[left].getCurve().getYBot();
    if (right < numedges) {
      y = edgelist[right].getCurve().getYTop();
      if (yrange[1] > y) {
        yrange[1] = y;
      }
    }
    var nexteq = 1;
    for (cur = left; cur < right; cur++) {
      e = edgelist[cur];
      e.setEquivalence(0);
      for (next = cur; next > left; next--) {
        var prevedge = edgelist[next-1];
        var ordering = e.compareTo(prevedge, yrange);
        if (yrange[1] <= yrange[0]) {
          throw new InternalError("backstepping to "+yrange[1]+
              " from "+yrange[0]);
        }
        if (ordering >= 0) {
          if (ordering === 0) {
            var eq = prevedge.getEquivalence();
            if (eq === 0) {
              eq = nexteq++;
              prevedge.setEquivalence(eq);
            }
            e.setEquivalence(eq);
          }
          break;
        }
        edgelist[next] = prevedge;
      }
      edgelist[next] = e;
    }
    this.newRow();
    var ystart = yrange[0];
    var yend = yrange[1];
    for (cur = left; cur < right; cur++) {
      e = edgelist[cur];
      var etag;
      var eq = e.getEquivalence();
      if (eq !== 0) {
        var origstate = this.getState();
        etag = (origstate === AreaOp.RSTAG_INSIDE
                ? AreaOp.ETAG_EXIT
                : AreaOp.ETAG_ENTER);
        var activematch = null;
        var longestmatch = e;
        var furthesty = yend;
        do {
          this.classify(e);
          if (activematch === null &&
              e.isActiveFor(ystart, etag)) {
            activematch = e;
          }
          y = e.getCurve().getYBot();
          if (y > furthesty) {
            longestmatch = e;
            furthesty = y;
          }
        } while (++cur < right &&
                 (e = edgelist[cur]).getEquivalence() === eq);
        --cur;
        if (this.getState() === origstate) {
          etag = AreaOp.ETAG_IGNORE;
        } else {
          e = (activematch !== null ? activematch : longestmatch);
        }
      } else {
        etag = this.classify(e);
      }
      if (etag !== AreaOp.ETAG_IGNORE) {
        e.record(yend, etag);
        links.push(new CurveLink(e.getCurve(), ystart, yend, etag));
      }
    }
    if (this.getState() !== AreaOp.RSTAG_OUTSIDE) {
      for (cur = left; cur < right; cur++) {
        e = edgelist[cur];
      }
    }
    AreaOp.resolveLinks(subcurves, chains, links);
    links.length = 0;
    yrange[0] = yend;
  }
  AreaOp.finalizeSubCurves(subcurves, chains);
  var ret = [];
  for (var i = 0; i < subcurves.length; i++) {
    var link = subcurves [i];
    ret.push(link.getMoveto());
    var nextlink = link;
    while ((nextlink = nextlink.getNext()) !== null) {
      if (!link.absorb(nextlink)) {
        ret.push(link.getSubCurve());
        link = nextlink;
      }
    }
    ret.push(link.getSubCurve());
  }
  return ret;
}

AreaOp.finalizeSubCurves = function(subcurves, chains) {
  var numchains = chains.length;
  if (numchains === 0) {
    return;
  }
  if ((numchains & 1) !== 0) {
    throw new InternalError("Odd number of chains!");
  }
  var endlist = chains.slice(0);
  for (var i = 1; i < numchains; i += 2) {
    var open = endlist[i - 1];
    var close = endlist[i];
    var subcurve = open.linkTo(close);
    if (subcurve !== null) {
      subcurves.push(subcurve);
    }
  }
  chains.length = 0;
}

AreaOp.resolveLinks = function(subcurves, chains, links) {
  var numlinks = links.length;
  var linklist;
  if (numlinks === 0) {
    linklist = AreaOp.EmptyLinkList;
  } else {
    if ((numlinks & 1) !== 0) {
      throw new InternalError("Odd number of new curves!");
    }
    linklist = links.slice(0);
    linklist.push(null, null);
  }
  var numchains = chains.length;
  var endlist;
  if (numchains === 0) {
    endlist = AreaOp.EmptyChainList;
  } else {
    if ((numchains & 1) !== 0) {
      throw new InternalError("Odd number of chains!");
    }
    endlist = chains.slice(0);
    endlist.push(null, null);
  }
  var curchain = 0;
  var curlink = 0;
  chains.length = 0;
  var chain = endlist[0];
  var nextchain = endlist[1];
  var link = linklist[0];
  var nextlink = linklist[1];
  while (chain !== null || link !== null) {
    var connectchains = (link === null);
    var connectlinks = (chain === null);
    if (!connectchains && !connectlinks) {
      connectchains = ((curchain & 1) === 0 &&
          chain.getX() === nextchain.getX());
      connectlinks = ((curlink & 1) === 0 &&
          link.getX() === nextlink.getX());
      
      if (!connectchains && !connectlinks) {
        var cx = chain.getX();
        var lx = link.getX();
        connectchains =
          (nextchain !== null && cx < lx &&
              AreaOp.obstructs(nextchain.getX(), lx, curchain));
        connectlinks =
          (nextlink !== null && lx < cx &&
              AreaOp.obstructs(nextlink.getX(), cx, curlink));
      }
    }
    if (connectchains) {
      var subcurve = chain.linkTo(nextchain);
      if (subcurve !== null) {
        subcurves.push(subcurve);
      }
      curchain += 2;
      chain = endlist[curchain];
      nextchain = endlist[curchain+1];
    }
    if (connectlinks) {
      var openend = new ChainEnd(link, null);
      var closeend = new ChainEnd(nextlink, openend);
      openend.setOtherEnd(closeend);
      chains.push(openend);
      chains.push(closeend);
      curlink += 2;
      link = linklist[curlink];
      nextlink = linklist[curlink+1];
    }
    if (!connectchains && !connectlinks) {
      chain.addLink(link);
      chains.push(chain);
      curchain++;
      chain = nextchain;
      nextchain = endlist[curchain+1];
      curlink++;
      link = nextlink;
      nextlink = linklist[curlink+1];
    }
  }
}

AreaOp.obstructs = function(v1, v2, phase) {
  return (((phase & 1) === 0) ? (v1 <= v2) : (v1 < v2));
}

/**
 * @constructor
 * @extends AreaOp
 * @package
 */
function AreaOpCAGOp() {
  this.inLeft = false;
  this.inRight = false;
  this.inResult = false;
}
AreaOpCAGOp.prototype = Object.create(AreaOp.prototype);
AreaOpCAGOp.prototype.constructor = AreaOpCAGOp;

AreaOpCAGOp.prototype.newRow = function() {
  this.inLeft = false;
  this.inRight = false;
  this.inResult = false;
}

AreaOpCAGOp.prototype.classify = function(e) {
  if (e.getCurveTag() === AreaOp.CTAG_LEFT) {
    this.inLeft = !this.inLeft;
  } else {
    this.inRight = !this.inRight;
  }
  var newClass = this.newClassification(this.inLeft, this.inRight);
  if (this.inResult === newClass) {
    return AreaOp.ETAG_IGNORE;
  }
  this.inResult = newClass;
  return (newClass ? AreaOp.ETAG_ENTER : AreaOp.ETAG_EXIT);
}

AreaOpCAGOp.prototype.getState = function() {
  return (this.inResult ? AreaOp.RSTAG_INSIDE : AreaOp.RSTAG_OUTSIDE);
}

/**
 * @constructor
 * @extends AreaOpCAGOp
 * @package
 */
function AreaOpAddOp() {
  AreaOpCAGOp.call(this);
}
AreaOpAddOp.prototype = Object.create(AreaOpCAGOp.prototype);
AreaOpAddOp.prototype.constructor = AreaOpAddOp;

AreaOpAddOp.prototype.newClassification = function(inLeft, inRight) {
  return (inLeft || inRight);
}

/**
 * @constructor
 * @extends AreaOpCAGOp
 * @package
 */
function AreaOpSubOp() {
  AreaOpCAGOp.call(this);
}
AreaOpSubOp.prototype = Object.create(AreaOpCAGOp.prototype);
AreaOpSubOp.prototype.constructor = AreaOpSubOp;

AreaOpSubOp.prototype.newClassification = function(inLeft, inRight) {
  return (inLeft && !inRight);
}

/**
 * @constructor
 * @extends AreaOpCAGOp
 * @package
 */
function AreaOpIntOp() {
  AreaOpCAGOp.call(this);
}
AreaOpIntOp.prototype = Object.create(AreaOpCAGOp.prototype);
AreaOpIntOp.prototype.constructor = AreaOpIntOp;

AreaOpIntOp.prototype.newClassification = function(inLeft, inRight) {
  return (inLeft && inRight);
}

/**
 * @constructor
 * @extends AreaOpCAGOp
 * @package
 */
function AreaOpXorOp() {
  AreaOpCAGOp.call(this);
}
AreaOpXorOp.prototype = Object.create(AreaOpCAGOp.prototype);
AreaOpXorOp.prototype.constructor = AreaOpXorOp;

AreaOpXorOp.prototype.newClassification = function(inLeft, inRight) {
  return (inLeft !== inRight);
}

/**
 * @constructor
 * @extends AreaOp
 * @package
 */
function AreaOpNZWindOp() {
  this.count = 0;
}
AreaOpNZWindOp.prototype = Object.create(AreaOp.prototype);
AreaOpNZWindOp.prototype.constructor = AreaOpNZWindOp;

AreaOpNZWindOp.prototype.newRow = function() {
  this.count = 0;
}

AreaOpNZWindOp.prototype.classify = function(e) {
  var newCount = this.count;
  var type = (newCount === 0 ? AreaOp.ETAG_ENTER : AreaOp.ETAG_IGNORE);
  newCount += e.getCurve().getDirection();
  this.count = newCount;
  return (newCount === 0 ? AreaOp.ETAG_EXIT : type);
}

AreaOpNZWindOp.prototype.getState = function() {
  return ((this.count === 0) ? AreaOp.RSTAG_OUTSIDE : AreaOp.RSTAG_INSIDE);
}

/**
 * @constructor
 * @extends AreaOp
 * @package
 */
function AreaOpEOWindOp() {
  this.inside = false;
}
AreaOpEOWindOp.prototype = Object.create(AreaOp.prototype);
AreaOpEOWindOp.prototype.constructor = AreaOpEOWindOp;

AreaOpEOWindOp.prototype.newRow = function() {
  inside = false;
}

AreaOpEOWindOp.prototype.classify = function(e) {
  var newInside = !this.inside;
  this.inside = newInside;
  return (newInside ? AreaOp.ETAG_ENTER : AreaOp.ETAG_EXIT);
}

AreaOpEOWindOp.prototype.getState = function() {
  return (inside ? AreaOp.RSTAG_INSIDE : AreaOp.RSTAG_OUTSIDE);
}


/**
 * Adapted from sun.awt.geom.ChainEnd 
 * @constructor
 * @package
 */
function ChainEnd(first, partner) {
  this.head = first;
  this.tail = first;
  this.partner = partner;
  this.etag = first.getEdgeTag();
}

ChainEnd.prototype.getChain = function() {
  return this.head;
}

ChainEnd.prototype.setOtherEnd = function(partner) {
  this.partner = partner;
}

ChainEnd.prototype.getPartner = function() {
  return this.partner;
}

ChainEnd.prototype.linkTo = function(that) {
  if (this.etag === AreaOp.ETAG_IGNORE ||
      that.etag === AreaOp.ETAG_IGNORE)  {
    throw new InternalError("ChainEnd linked more than once!");
  }
  if (this.etag === that.etag) {
    throw new InternalError("Linking chains of the same type!");
  }
  var enter, exit;
  if (this.etag === AreaOp.ETAG_ENTER) {
    enter = this;
    exit = that;
  } else {
    enter = that;
    exit = this;
  }
  this.etag = AreaOp.ETAG_IGNORE;
  that.etag = AreaOp.ETAG_IGNORE;
  enter.tail.setNext(exit.head);
  enter.tail = exit.tail;
  if (this.partner === that) {
    return enter.head;
  }
  var otherenter = exit.partner;
  var otherexit = enter.partner;
  otherenter.partner = otherexit;
  otherexit.partner = otherenter;
  if (enter.head.getYTop() < otherenter.head.getYTop()) {
    enter.tail.setNext(otherenter.head);
    otherenter.head = enter.head;
  } else {
    otherexit.tail.setNext(enter.head);
    otherexit.tail = enter.tail;
  }
  return null;
}

ChainEnd.prototype.addLink = function(newlink) {
  if (this.etag === AreaOp.ETAG_ENTER) {
    this.tail.setNext(newlink);
    this.tail = newlink;
  } else {
    newlink.setNext(this.head);
    this.head = newlink;
  }
}

ChainEnd.prototype.getX = function() {
  if (this.etag === AreaOp.ETAG_ENTER) {
    return this.tail.getXBot();
  } else {
    return this.head.getXBot();
  }
}


/**
 * Adapted from sun.awt.geom.CurveLink 
 * @constructor
 * @package
 */
function CurveLink(curve, ystart, yend, etag) {
  this.curve = curve;
  this.ytop = ystart;
  this.ybot = yend;
  this.etag = etag;
  this.next = null;
  if (this.ytop < curve.getYTop() || this.ybot > curve.getYBot()) {
    throw new InternalError("bad curvelink ["+ytop+"=>"+ybot+"] for "+curve);
  }
}

CurveLink.prototype.absorb = function(link) {
    return this.absorb(link.curve, link.ytop, link.ybot, link.etag);
}

CurveLink.prototype.absorb = function(curve, ystart, yend, etag) {
  if (this.curve !== curve || this.etag !== etag ||
      this.ybot < ystart || this.ytop > yend) {
    return false;
  }
  if (ystart < curve.getYTop() || yend > curve.getYBot()) {
    throw new InternalError("bad curvelink ["+ystart+"=>"+yend+"] for "+curve);
  }
  this.ytop = Math.min(this.ytop, ystart);
  this.ybot = Math.max(this.ybot, yend);
  return true;
}

CurveLink.prototype.isEmpty = function() {
  return (this.ytop === this.ybot);
}

CurveLink.prototype.getCurve = function() {
  return this.curve;
}

CurveLink.prototype.getSubCurve = function() {
  if (this.ytop === this.curve.getYTop() && this.ybot === this.curve.getYBot()) {
    return this.curve.getWithDirection(this.etag);
  }
  return this.curve.getSubCurve(this.ytop, this.ybot, this.etag);
}

CurveLink.prototype.getMoveto = function() {
  return new Order0(this.getXTop(), this.getYTop());
}

CurveLink.prototype.getXTop = function() {
  return this.curve.XforY(this.ytop);
}

CurveLink.prototype.getYTop = function() {
  return this.ytop;
}

CurveLink.prototype.getXBot = function() {
  return this.curve.XforY(this.ybot);
}

CurveLink.prototype.getYBot = function() {
  return this.ybot;
}

CurveLink.prototype.getX = function() {
  return this.curve.XforY(this.ytop);
}

CurveLink.prototype.getEdgeTag = function() {
  return this.etag;
}

CurveLink.prototype.setNext = function(link) {
  this.next = link;
}

CurveLink.prototype.getNext = function() {
  return this.next;
}

/**
 * Adapted from sun.awt.geom.Edge
 * @constructor
 * @package
 */
function Edge(c, ctag, etag) {
  if (etag === undefined) {
    etag = AreaOp.ETAG_IGNORE;
  }
  this.curve = c;
  this.ctag = ctag;
  this.etag = etag;
  this.activey = 0.;
  this.equivalence = 0;

  this.lastEdge = null;
  this.lastResult = 0;
  this.lastLimit = 0.;
}

Edge.prototype.getCurve = function() {
  return this.curve;
}

Edge.prototype.getCurveTag = function() {
  return this.ctag;
}

Edge.prototype.getEdgeTag = function() {
  return this.etag;
}

Edge.prototype.setEdgeTag = function(etag) {
  this.etag = etag;
}

Edge.prototype.getEquivalence = function() {
  return this.equivalence;
}

Edge.prototype.setEquivalence = function(eq) {
  this.equivalence = eq;
}

Edge.prototype.compareTo = function(other, yrange) {
  if (other === this.lastEdge && yrange[0] < this.lastLimit) {
    if (yrange[1] > this.lastLimit) {
      yrange[1] = this.lastLimit;
    }
    return this.lastResult;
  }
  if (this === other.lastEdge && yrange[0] < other.lastLimit) {
    if (yrange[1] > other.lastLimit) {
      yrange[1] = other.lastLimit;
    }
    return 0-other.lastResult;
  }
  var ret = this.curve.compareTo(other.curve, yrange);
  this.lastEdge = other;
  this.lastLimit = yrange[1];
  this.lastResult = ret;
  return ret;
}

Edge.prototype.record = function(yend, etag) {
  this.activey = yend;
  this.etag = etag;
}

Edge.prototype.isActiveFor = function(y, etag) {
  return (this.etag === etag && this.activey >= y);
}
