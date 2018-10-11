/*
 * SAXParser.java 
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

// Bridges to JavaScript SAX classes implemented in lib/jsXmlSaxParser.js

class DefaultHandler {
}

interface Attributes {
  int getIndex(String qName);

  int getIndex(String uri, String localName);

  int getLength();

  String getLocalName(int index);

  String getQName(int index);

  String getType(int index);

  String getType(String qName);

  String getType(String uri, String localName);

  String getURI(int index);

  String getValue(int index);

  String getValue(String qName);

  String getValue(String uri, String localName);
}

@SuppressWarnings("serial")
class SAXException extends Error {
  public SAXException(String message) {
  }

  public SAXException(String message, Error cause) {
  }
}
