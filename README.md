# sourceImageCartographer

functionality checked:

* load source XML
* delete measure
* add measure (using shift+click)
* save to db


## architecture

### images

At the moment sourceImageCartographer expects the facsimile images being served by digilig from the following location:

``/digilib/Scaler/' + this.facsimileViewer.getFacsimilePath()``

N.B. if you want to change this, you should change it in DigilibViewer.js lines 148 and 150 (-->  https://github.com/Edirom/sourceImageCartographer/blob/develop/tools/main/js/DigilibViewer.js#L1148

### xml

The XML-Data is expected to reside in the following collection in your eXist-db:

``/db/contents/``

With the following sub-collections:

``works`` for edirom-work files

``sources`` for edirom-source files

# use

If you want a source to be loaded the uri parameter has to be submitted in the window URL, e.g.:

``http://localhost:8080/exist/apps/edirom/sourceImageCartographer/index.html?uri=/contents/sources/A_page127.xml``

# license

This version of edirom:sourceImageCartographer is based on the republished files of the original EdiromEditor Java application that were republished in an early stage of Edirom Online and thus is licensed accordingly under the same license terms as Edirom Online Edirom:sourceImageCartographer is released to the public under the terms of the GNU GPL v.3 open source license, that can bw found online at http://www.gnu.org/copyleft/gpl.html and is included in this repository as [gpl.txt](gpl.txt)
