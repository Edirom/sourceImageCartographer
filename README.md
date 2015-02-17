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

N.B. if you want to change this, you should change it in DigilibViewer.js lines 149 and 151

### xml

The XML-Data is expected to reside in the following collection in your eXist-db:

``/db/contents/``

With the following sub-collections:

``works`` for edirom-work files

``sources`` for edirom-source files
