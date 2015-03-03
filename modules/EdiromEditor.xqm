xquery version "3.0";
(:
  Edirom Online
  Copyright (C) 2011 The Edirom Project
  http://www.edirom.de

  Edirom Online is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Edirom Online is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with Edirom Online.  If not, see <http://www.gnu.org/licenses/>.
:)


(:~
: This module provides library functions for Edirom Online Backend
:
: @author <a href="mailto:roewenstrunk@edirom.de">Daniel Röwenstrunk</a>
:)
module namespace ee = "http://www.edirom.de/xquery/EdiromEditor";

import module namespace functx="http://www.functx.com" at 'functx-1.0-nodoc-2007-01.xq';
import module namespace templates="http://exist-db.org/xquery/templates" at "templates.xql";
import module namespace config="http://www.edirom.de/apps/sourceImageCartographer/config" at "config.xqm";

(:~
 : This function generates the sidenav
 :)
declare function ee:generateSidenav($node as node(), $params as element(parameters)?, $model as item()*) {
    
    let $activePage := request:get-attribute("$exist:resource")
    return
    templates:process(
        <div class="sidenav">
            <ul class="nav nav-pills nav-stacked level1">
                <li class="nav-header">Dashboard</li>
                {ee:generateSidenavItem('index.html', $activePage, 'Home')}
                
                <li class="nav-header">Objects</li>
                {ee:generateSidenavItem('manage-objects.html', $activePage, 'Manage Objects')}
                {ee:generateSidenavItem('../eXide/', $activePage, 'Edit Object')}
                {ee:generateSidenavItem('view-object.html', $activePage, 'View Object')}
                

                <li class="nav-header">Measures</li>
                <!--{ee:generateSidenavItem('index.html', $activePage, 'Takte anlegen')}-->
                {ee:generateSidenavItem('measure-coordinates.html', $activePage, 'Set measure coordinates')}
                <!--{ee:generateSidenavItem('index.html', $activePage, 'Musik und Faksimile mergen')}-->
                
                <!--<li class="nav-header">Konkordanzen</li>
                {ee:generateSidenavItem('index.html', $activePage, 'Satzkonkordanzen anlegen')}
                {ee:generateSidenavItem('index.html', $activePage, 'Taktkonkordanzen anlegen')}-->
                
                <!--<li class="nav-header">Importieren</li>
                {ee:generateSidenavItem('index.html', $activePage, 'Bilder importieren')}
                {ee:generateSidenavItem('index.html', $activePage, 'Texte importieren')}
                {ee:generateSidenavItem('index.html', $activePage, 'Musik importieren')}-->
                
                <li class="nav-header space-above">Administration</li>
                {ee:generateSidenavItem('settings.html', $activePage, 'Settings')}
                {ee:generateSidenavItem('../dashboard/', $activePage, 'Manage Users')}
                
                { if(exists(xmldb:get-child-collections($config:app-root||'/plugins')))
                  then(
                     <li class="nav-header space-above">Plugins</li>,
                   (:generate an entry for each plugin sub-collection:)
                     for $item in xmldb:get-child-collections($config:app-root||'/plugins')
                     let $info := doc(string-join(($config:app-root,'plugins',$item,'info.xml'),'/'))
                     return (element li {
                           ee:generateSidenavItem('plugins/'||$item||'/index.html', $activePage, $info//name)
                     })
                  )else()
                }

            </ul>
        </div>,
        $model
  )
};

declare function ee:create-rel-link($link as xs:string?) as xs:string? {
      
      let $exist:controller := request:get-parameter('$exist:controller','/EdiromEditor')
      let $exist:prefix := request:get-parameter('$exist:prefix','/apps')
      let $log := util:log-system-out($exist:controller)
      return
      if($link) then replace(string-join((request:get-context-path(), $exist:prefix,$exist:controller, $link), "/"), "/+", "/")
      else ()
};

declare function ee:generateSidenavItem($page as xs:string, $activePage as xs:string, $label as xs:string) as node() {
   let $log := util:log-system-out($page)
   let $relLink := ee:create-rel-link($page)
   let $exist:controller := request:get-parameter('$exist:controller','contr?')

    return
    <li class="{if($page eq $activePage)then('active')else('')}">
        <a href="{$relLink}">{$label}</a>
    </li>
};

declare function ee:getEditorTitle($node as node(), $params as element(parameters)?, $model as item()*) {
    let $uri := request:get-parameter('uri', '')
    return
        templates:process(
        
            <h3>{$uri}</h3>,
            $model
        )
};


declare function ee:getEditorVariables($node as node(), $params as element(parameters)?, $model as item()*) {
    
    let $uri := request:get-parameter('uri', '')
    return

    <div>
        <input type="hidden" id="editorSourceUri" value="{$uri}"/>
        <input type="hidden" id="editorSourceType" value="{ee:getEditorType($uri)}"/>
    </div>
};

declare function ee:getEditorType($uri as xs:string) as xs:string {
    
    let $type := functx:substring-after-last($uri, '.')
    return

        if($type eq 'xml' or $type eq 'mei' or $type eq 'tei')
        then('xml')
        else if($type eq 'xq' or $type eq 'xql' or $type eq 'xqm' or $type eq 'xquery')
        then('xquery')
        else if($type eq 'js')
        then('javascript')
        else('')
};

declare function ee:getMeasureCoordTitle($node as node(), $model as map(*)) {
    let $uri := request:get-parameter('uri', '')
    return
        templates:process(
        
            <h3 xmlns="http://www.w3.org/1999/xhtml">{$uri}</h3>,
            $model
        )
};


declare function ee:getMeasureCoordVariables($node as node(), $model as map(*)) {
    
    let $uri := request:get-parameter('uri', '')
    return

    <div xmlns="http://www.w3.org/1999/xhtml">
        <input type="hidden" id="measureCoordUri" value="{$uri}"/>
    </div>
};
