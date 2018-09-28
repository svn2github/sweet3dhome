/*
 * ShapeTools.js
 *
 * Sweet Home 3D, Copyright (c) 2018 Emmanuel PUYBARET / eTeks <info@eteks.com>
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

// Requires scene3d.js


/**
 * Gathers some useful tools for shapes.
 * @author Emmanuel Puybaret
 */
var ShapeTools = {
    parsedShapes : {}
};

/**
 * Returns the line stroke matching the given line styles.
 * @param {number} thickness
 * @param {Polyline.CapStyle} capStyle
 * @param {Polyline.JoinStyle} joinStyle
 * @param {Polyline.DashStyle} dashStyle
 * @param {number} dashOffset
 * @return {Object}
 */
ShapeTools.getStroke = function (thickness, capStyle, joinStyle, dashStyle, dashOffset) {
  var strokeCapStyle;
  switch (capStyle) {
    case Polyline.CapStyle.ROUND:
      strokeCapStyle = java.awt.BasicStroke.CAP_ROUND;
      break;
    case Polyline.CapStyle.SQUARE:
      strokeCapStyle = java.awt.BasicStroke.CAP_SQUARE;
      break;
    default:
      strokeCapStyle = java.awt.BasicStroke.CAP_BUTT;
      break;
  }
  
  var strokeJoinStyle;
  switch (joinStyle) {
    case Polyline.JoinStyle.ROUND:
    case Polyline.JoinStyle.CURVED:
      strokeJoinStyle = java.awt.BasicStroke.JOIN_ROUND;
      break;
    case Polyline.JoinStyle.BEVEL:
      strokeJoinStyle = java.awt.BasicStroke.JOIN_BEVEL;
      break;
    default:
      strokeJoinStyle = java.awt.BasicStroke.JOIN_MITER;
      break;
  }
  
  var strokeDashes;
  switch (dashStyle) {
    case Polyline.DashStyle.DOT:
      strokeDashes = [thickness, thickness];
      break;
    case Polyline.DashStyle.DASH:
      strokeDashes = [thickness * 4, thickness * 2];
      break;
    case Polyline.DashStyle.DASH_DOT:
      strokeDashes = [thickness * 8, thickness * 2, thickness * 2, thickness * 2];
      break;
    case Polyline.DashStyle.DASH_DOT_DOT:
      strokeDashes = [thickness * 8, thickness * 2, thickness * 2, thickness * 2, thickness * 2, thickness * 2];
      break;
    default:
      strokeDashes = null;
      break;
  }
  
  var dashPhase = 0;
  if (strokeDashes !== null) {
    for (var i = 0; i < strokeDashes.length; i++) {
      dashPhase += strokeDashes[i];
    }
    dashPhase *= dashOffset;
  }
  return new java.awt.BasicStroke(thickness, strokeCapStyle, strokeJoinStyle, 10, strokeDashes, dashPhase);
}

/**
 * Returns the shape of a polyline.
 * @param {Array} points
 * @param {boolean} curved
 * @param {boolean} closedPath
 * @return {Object}
 */
ShapeTools.getPolylineShape = function (points, curved, closedPath) {
  if (curved) {
    var polylineShape = new java.awt.geom.GeneralPath();
    for (var i = 0, n = closedPath ? points.length : points.length - 1; i < n; i++) {
      var curve2D = new java.awt.geom.CubicCurve2D.Float();
      var previousPoint = points[i === 0 ? points.length - 1 : i - 1];
      var point = points[i];
      var nextPoint = points[i === points.length - 1 ? 0 : i + 1];
      var vectorToBisectorPoint = [nextPoint[0] - previousPoint[0], nextPoint[1] - previousPoint[1]];
      var nextNextPoint = points[(i + 2) % points.length];
      var vectorToBisectorNextPoint = [point[0] - nextNextPoint[0], point[1] - nextNextPoint[1]];
      curve2D.setCurve(point[0], point[1], 
          point[0] + (i !== 0 || closedPath ? vectorToBisectorPoint[0] / 3.625 : 0), 
          point[1] + (i !== 0 || closedPath ? vectorToBisectorPoint[1] / 3.625 : 0), 
          nextPoint[0] + (i !== points.length - 2 || closedPath ? vectorToBisectorNextPoint[0] / 3.625 : 0), 
          nextPoint[1] + (i !== points.length - 2 || closedPath ? vectorToBisectorNextPoint[1] / 3.625 : 0), 
          nextPoint[0], nextPoint[1]);
      polylineShape.append(curve2D, true);
    }
    return polylineShape;
  } else {
      return ShapeTools.getShape(points, closedPath, null);
  }
}

/**
 * Returns the shape matching the coordinates in <code>points</code> array 
 * or the shape matching the given <a href="http://www.w3.org/TR/SVG/paths.html">SVG path shape</a> 
 * if the first parameter is a string.
 * @param {Array|string} points array or a SVG path 
 * @param {boolean} [closedPath]
 * @param {java.awt.geom.AffineTransform} [transform]
 * @return {Object}
 * @protected
 * @ignore
 */
ShapeTools.getShape = function(points, closedPath, transform) {
  if (points instanceof Array) {
    var path = new java.awt.geom.GeneralPath();
    path.moveTo(Math.fround(points[0][0]), Math.fround(points[0][1]));
    for (var i = 1; i < points.length; i++) {
      path.lineTo(Math.fround(points[i][0]), Math.fround(points[i][1]));
    }
    if (closedPath) {
      path.closePath();
    }
    if (transform != null) {
      path.transform(transform);
    }
    return path;
  } else {
    var svgPathShape = points;
    var shape2D = ShapeTools.parsedShapes [svgPathShape];
    if (!shape2D) {
      shape2D = new java.awt.geom.Rectangle2D.Float(0, 0, 1, 1);
      try {
        var pathProducer = new org.apache.batik.parser.AWTPathProducer();
        var pathParser = new org.apache.batik.parser.PathParser();
        pathParser.setPathHandler(pathProducer);
        pathParser.parse(svgPathShape);
        shape2D = pathProducer.getShape();
      } catch (ex) {
        // Keep default value if Batik is not available or if the path is incorrect
      }
      ShapeTools.parsedShapes[svgPathShape] = shape2D;
    }
    return shape2D;
  }
}