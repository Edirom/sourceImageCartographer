# [sic] sourceImageCartographer

The _edirom:sourceImageCartographer_ ( _edirom:sic_ ) is a tool isolated from the [_Edirom Editor_](https://github.com/Edirom/Edirom-Editor) for marking up measures on digital facsimiles. This allows independent installation and use of the tool in any [_eXist-db_](http://exist-db.org/) instance, e.g. in the same database that hosts an [_Edirom Online_](https://github.com/Edirom/Edirom-Online).
At least for marking measures this renders the _Edirom Editor_ obsolete, if your setup meets the following criteria.
But pleae be aware, that in its current setup this tool is deprecated in certain aspects and will not be subject to further feature development.

# prerequisites 
## image server

_edirom:sic_ relies on the presence of [digilib](http://digilib.sourceforge.net/) for serving the image files of the sources. By default _edirom:sic_ expects images being served by digilig from the following location:

```javascript
'/digilib/Scaler/'
```

If you want to change this you can supply a paramter to the build task as will be described below.

## usage

Please use [_Mozilla Firefox_](https://www.mozilla.org/en-US/firefox/new/) browser to access the tool, with other browsers the user interface will not work properly!

Your data can be in any collection of the _eXist-db_. If you want a source to be loaded you have to submit a `uri` parameter in the window URL. The `uri` parameter has to be the absolute path in the eXist-db `db`-folder, e.g.:

```
http://localhost:8080/exist/apps/edirom/sourceImageCartographer/index.html?uri=/contents/sources/A_page127.xml
```

# releases and versioning

For its releases this project follows the [_Semantic Versioning Specification (SemVer) 2.0.0_](http://semver.org/spec/v2.0.0.html).

The code of specific releases will be pulished in the master branch of this repo and tagged accordingly. Moreover the corresponding release description and XAR-files will be available as GitHub releases.

# database deployment

When deploying to _eXist-db_  _edirom:sourceImageCartographer_ will be installed to the following location:

```
edirom/sourceImageCartographer
```

The default privileges and permissions are:

```xml
user="edirom" group="edirom" mode="rwxr-xr--"
```

Theses settigns can be changed in the [repo.xml](repo.xml) file.

# development and contributing

For development purposes this project applies the git branching model known as "GitFlow" as proposed by Vincent Driessen 2010 in [_A successful Git branching model_](http://nvie.com/posts/a-successful-git-branching-model/).

# building

Building a _XAR-file_ for installation in _eXist-db_ requires [_Apache Ant_™](http://ant.apache.org/) to be installed on your system. In your command prompt execute the following command for a default build:

```
ant xar
```

If you want to modify the URL that is expected to serve the images you can supply it according to the follwoing example:

``` shell
ant xar -Ddigilib.server=HOST:PORT/CONTEXT
```

Your "HOST:PORT/CONTEXT" will be prepended to the default `/digilib/Scaler/` context.
If this does not fit your need in any way and you need a completely different URL for the _digilib_ image server you will have to modify lines 148 and 150 in `tools/main/js/DigilibViewer.js`

https://github.com/Edirom/sourceImageCartographer/blob/develop/tools/main/js/DigilibViewer.js#L148
https://github.com/Edirom/sourceImageCartographer/blob/develop/tools/main/js/DigilibViewer.js#L150

# license

This version of _edirom:sourceImageCartographer_ is based on the republished files of the original _Edirom Editor_ Java application that were republished in an early stage of _Edirom Online_ and thus is licensed accordingly under the same license terms as _Edirom Online_. _edirom:sourceImageCartographer_ is released to the public under the terms of the GNU GPL v.3 open source license, that can bw found online at http://www.gnu.org/copyleft/gpl.html and is included in this repository as [gpl.txt](gpl.txt)
