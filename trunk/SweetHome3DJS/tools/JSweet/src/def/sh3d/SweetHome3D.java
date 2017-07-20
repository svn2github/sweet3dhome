package def.sh3d;

import java.text.Format;

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