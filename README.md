# sourceImageCartographer

The _sourceImageCartographer_ is a tool isolated from the _Edirom Editor_ for marking up measures on digital facsimiles. This allows independent installation and use of the tool in any eXist-db instance, e.g. in the same database that hosts an _Edirom Online_.
At least for marking measures this renders the _Edirom Editor_ obsolete, if your setup meets the following criteria.
But pleae be aware, that in its current setup this tool is deprecated in certain aspects and will not be subject to further developments.

# prerequisites 
## image server

As _Edirom Online_ the _sourceImageCartographer_ relies on the presence of a digilib server for serving the image files (http://digilib.sourceforge.net/). 

By default _sourceImageCartographer_ expects images being served by digilig from the following location:

```javascript
'/digilib/Scaler/'
```

If you want to change this you can supply a paramter to the build task as will be described below.

## usage

Please use firefox browser, with other browsers the user interface will not work properly.

Your data can be in any collection of the eXist-db. If you want a source to be loaded you have to submit a `uri` parameter in the window URL. The `uri` parameter has to be the absolute path in the eXist-db `db`-folder, e.g.:

```http://localhost:8080/exist/apps/edirom/sourceImageCartographer/index.html?uri=/contents/sources/A_page127.xml```

# building

Building a XAR-file for installation in eXist-db requires Apache Ant to be installed on your system. In your command prompt execute the following command for a default build:

```
ant xar
```

If you want to modify the url that is expected to serve the images you can supply it according to the follwoing example:

```ant xar -Ddigilib.server=HOST:PORT/CONTEXT```

Your "HOST:PORT/CONTEXT" will be prepended to the default `/digilib/Scaler/` context.
If this does not fit your need in any way and you need a completely different URL for the digilib image server you will have to modify lines 148 and 150 in `tools/main/js/DigilibViewer.js`

https://github.com/Edirom/sourceImageCartographer/blob/develop/tools/main/js/DigilibViewer.js#L148
https://github.com/Edirom/sourceImageCartographer/blob/develop/tools/main/js/DigilibViewer.js#L150


# license

This version of edirom:sourceImageCartographer is based on the republished files of the original EdiromEditor Java application that were republished in an early stage of Edirom Online and thus is licensed accordingly under the same license terms as Edirom Online Edirom:sourceImageCartographer is released to the public under the terms of the GNU GPL v.3 open source license, that can bw found online at http://www.gnu.org/copyleft/gpl.html and is included in this repository as [gpl.txt](gpl.txt)
