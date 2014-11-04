var setWidth = function() {
  w = 300;
  $('.column').each(function(index) {
    w += parseInt($(this).width());
  });
  $('#container').width(w).css('display', 'block');
}

var sources = ['C_07_Kind_Autograph', 'C_07_Handexemplar', 'C_07_Kind_Theaterschriften'];
//var core = {app : []};
// Example structure:
// "app": [
//   "rdg": [{source: "", ptr: []}]
// ]  

/* Set up backbone models an views */
var coreModel = Backbone.Model.extend({
  defaults: {
    "app": []
  }
});
// &lt;rdg wit="#A-pt"&gt;
//     &lt;ptr target="#A-pt_l2"/&gt;
//     &lt;ptr target="#A-pt_l3"/&gt;
//   &lt;/rdg&gt;
var core = new coreModel();
var coreView = Backbone.View.extend({
  template: _.template('<% _.each(app, function(a, i) { %><a href="#" class="remove" id="_<%=i%>">remove</a><pre class="sh_xml">&lt;app&gt;<% _.each(a.rdg, function(r) { %>\
\n  &lt;rdg wit="#<%=r.source%>"&gt;\
<% _.each(r.ptr, function(p) { %>\n    &lt;ptr target="#<%=p%>"/&gt;\
\n  <% }); %>&lt;/rdg&gt;<% }); %>\
\n&lt;/app&gt;</pre><% }); %>'),
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    $('#corexml').html(this.$el.html());
    sh_highlightDocument();
    this.bindRemove(this.model);
    return this;
  },
  bindRemove: function(model) {
    $('.remove').click(function(){
      var idx = /_(\d+)/.exec($(this).attr('id'))[1];
      var app = model.toJSON().app;
      model.set(app.splice(0, idx).concat(app.splice(idx, app.length)));
    });
  }
});

var selection = Backbone.Model.extend({
	defaults: {
	  "source": "",
	  "elements": []
	}
});

var appEntry = Backbone.Collection.extend({
    model: selection,
    initialize: function() {
    }
});

var appView = Backbone.View.extend({
  template: _.template("<ul><%= source %></ul>"),
    initialize: function() {
  },
  render: function() {
    this.$el.html(this.template({}));
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function(model) {
    var view = new selectionView({model: model});
    $('#cur_grp').show().append(view.render().$el);
    $('#save').show();
    $('#makeNew').hide();
  },
  updateCore: function() {
    var c = this.collection.toJSON();
    var rgroup = {rdg:[], id: generateUid()};
    for (var i=0; i<c.length; i++){
      rgroup.rdg.push({source:c[i].source, ptr: c[i].elements});
    }
    core.attributes.app.push(rgroup);
    var m;
    while (m = this.collection.first()) {
      m.destroy();
    }
  }
});

var selectionView = Backbone.View.extend({
	template: _.template("<li><%= source %>\
		<ul>\
			<% _.each(elements, function(e) { %> <li><%= e %></li> <% }); %>\
		</ul>\
	</li>"),
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

/* Set up SAX PARSER */

var end = false;
var skip = ['teiHeader', 'lb']
var skipping = false;
var parser = new SAXParser({
  startDocument: function() { },
  endDocument: function() { },
  startElement: function(node) {
      end = false;
      if (skip.indexOf(node.name) != -1) {skipping=true;}
      if (!skipping) { 
    		has_id = ($.inArray('xml:id', Object.keys(node.attributes)) !== -1) ? ' class="has_id '+window.source+'" data-teiid="'+node.attributes['xml:id'].value+'"' : '';
    		window.loc.append('<dt'+has_id+'>'+node.name+'</dd>');
      }
      //if (skipping && node.isSelfClosing) {skipping=false;}
  	},
  endElement: function(node) {
  	end = true;
    if (skip.indexOf(node) != -1){
      skipping=false;
    }
  },
  characters: function(text) {
  		if (!end && !skipping) {
  			var t = (text.length > 20) ? text.substr(0,19) : text;
  			window.loc.append('<dd>'+t+'</dd>');
  		}  		
  	},
  comment: function(comment) { }
});

/* GET DATA */

var loadTEI = function(s, cb) {
  $.get('/exist/rest//db/contents/FreiDi/textData/sources/with_ids/'+s[0]+'.xml', function(data) {
    var column = $('<div class="column TEI"><h2 class="anchored">'+s[0]+'</h2></div>');
    var dl = $('<dl id="'+s[0]+'"/>');
    column.append(dl);
    $('#container').prepend(column);
    window.loc = dl;
    window.source = s[0];
    parser.parse(data);
  }, 'text');
  if (cb != null || cb != undefined) {cb(s.slice(1, s.length));}
}

// Load sources in order (pipe through a callback)
var pipe = function(ss) {
  if (ss.length > 1) {
    loadTEI(ss, pipe);
  }
  else { loadTEI(ss); }
}
pipe(sources);

// Attach events to TEI elements when creating a new selection.
var bindTEI = function(source, sel) {
	var selected = {};
	selected[source] = [];
	$('.has_id.'+source).click(function(){
		elm = $(this);
		teiid = elm.attr('data-teiid');
		if ($.inArray(teiid, selected[source]) == -1) {
			selected[source].push(elm.attr('data-teiid'));
			elm.addClass('selected');
		} 
		else {
			selected[source].remove(teiid);
			elm.removeClass('selected');
			sel.unset({source:source, elements:selected[source]});
		}
		sel.set({source:source, elements:selected[source]}, {silent:true});
		sel.trigger("change"); //Firing change manually seems to make this work better.
	});
}
// Detach events to TEI elements when creating a new selection.
var unbindTEI = function(source, sel) {
  $('.has_id').unbind('click');
  $('.has_id.selected').removeClass('selected');
}

var cur_col;

$('#makeNew').click(function(){
	var entry = new appEntry();
  var entryView = new appView({collection:entry});
  cur_col = entryView;
  for (var i=0; i<sources.length; i++){
    var s = new selection(); 
    entry.add(s);   
    bindTEI(sources[i], s);
  }
  entryView.render();
});

$('#save').click(function(){
  cur_col.updateCore();
  $('#save').hide();
  $('#cur_grp').hide();
  $('#makeNew').show();
  unbindTEI();
  var cv = new coreView({model:core});
  cv.render();
  setWidth();
});

$('#saveall').click(function(){
  var xml = '<?xml version="1.0" encoding="UTF-8"?><TEI>'+$('pre').text()+"</TEI>";
  //THIS + http://updates.html5rocks.com/2011/08/Saving-generated-files-on-the-client-side 
  // AND https://github.com/eligrey/FileSaver.js:
  var bb = new Blob([xml], {"type":"text\/xml"});
  saveAs(bb, 'core.xml');
});