/*
 * SweetHome3D.java 
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
package def.sweethome3d;

import java.text.Format;

// Bridges to Sweet Home 3D JavaScript classes reimplemented in some src/*.js  

class UserPreferences {
}

class URLContent {
  public URLContent(String content) {
  }
}

class HomeURLContent {
  public HomeURLContent(String content) {
  }
}

class LengthUnit {
    public static LengthUnit MILLIMETER;
    public static LengthUnit CENTIMETER;
    public static LengthUnit METER;
    public static LengthUnit INCH;
    public static LengthUnit INCH_DECIMALS;

    public native static float centimeterToInch(float length);

    public native static float centimeterToFoot(float length);
    
    public native static float inchToCentimeter(float length);
    
    public native static float footToCentimeter(float length);
    
    public native Format getFormatWithUnit(); 

    public native Format getFormat();
    
    public native Format getAreaFormatWithUnit();

    public native String getName();
    
    public native float getMagnetizedLength(float length, float maxDelta);

    public native float getMinimumLength();
    
    public native float getMaximumLength();
    
    public native float getMaximumElevation();
    
    public native float centimeterToUnit(float length);

    public native float unitToCentimeter(float length);
}