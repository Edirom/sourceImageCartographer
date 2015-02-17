# sourceImageCartographer

functionality checked:

* load source XML
* delete measure
* save to db


## architecture

### images

At the moment sourceImageCartographer expects the facsimile images being served by digilig from the following location:

``/digilib/Scaler/' + this.facsimileViewer.getFacsimilePath()``

### xml

The XML-Data is expected to reside in the following collection in your eXist-db:

``/db/contents/``

With the following sub-collections:

``works`` for edirom-work files

``sources`` for edirom-source files
