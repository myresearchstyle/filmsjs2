/****************************
  * Application 
****************************/

Flm = Ember.Application.create({
	author: "Ovidiu",
	rootElement: "#page",
	ready: function() {
		Flm.filteredListController.ready();
	}
});

Flm.initialize();


/****************************
  * Models
****************************/
//Flm.Film = Ember.Object.extend({
//	id: null,
//	title: null,
//	director: null,
//	genre: null,
//	summary: null,
//	rottenTomatoesId: null,
//	synopsis: null,
//	thumbnail: null
//});


/****************************
  * Views
****************************/

Flm.FilmFilter = Ember.TextField.extend({
	change: function() {
		var value = this.get("value");
		console.log(value);
		this.set("value", value);
		var filter = value.replace(/^\s+||\s+$/g,'');
		Flm.filteredListController.filter(filter);
	}.observes("value")
});

Flm.FilmListView = Ember.View.extend({
	ready: function() {
		var me = this;
		$(me).children();
	},
	mouseEnter: function(event) {
		var ul = $(event.currentTarget).children("ul");
	}
});

Flm.FilmListItemView = Ember.View.extend({
	click: function() {
		var film = this.content;
		Flm.filmDisplay.addItem(film);
		return false;
	}
});

// This is the view for the image tag
Flm.FilmView = Ember.View.extend({
	ready: function() {
		var me = this;
	}
});


/****************************
  * Controllers
****************************/



Flm.listController = Ember.ArrayController.create({
	content: [],
	ready: function () {
		var me = this;
		$.getJSON("data/films.js", function(data) {
			$.each(data, function(index, film) {
				var rottenTommatoesID = film.rottenTommatoesID;
				var urlJSON = "http://api.rottentomatoes.com/api/public/v1.0/movies/" + rottenTommatoesID + ".json?apikey=2k5j37rmsuw3duzyua4bcnek";
				$.ajax({
					url: urlJSON,
					dataType: "jsonp",
					success: result
				});
				function result(filmInfo) {
					if (film.synopsis == "") {
						film.synopsis = filmInfo.synopsis;
					}
					film.thumb = filmInfo.posters.profile;
					film.poster = filmInfo.posters.original;
					me.pushObject(film); // it's important that an object is pushed to the content of this controller from the ajax success function otherwise the external json content may not load.
				}
			});
			
		});
		var myContent = me.get("content");
		console.log(myContent);
	}
});

Flm.filteredListController = Ember.ArrayController.create({
	content: [],
	ready: function() {
		Flm.listController.ready();
		var originalFilmList = Flm.listController.get("content");
		this.pushObjects(originalFilmList);
	},
	filter: function(filter) {
		//this.set("content", "");
		var pattern = new RegExp(filter, "i");
		
		var originalFilmList = Flm.listController.get("content");
		var filteredFilmList = $.grep(originalFilmList, function(element,index) {
			return element.title.match(pattern);
		});
		this.set("content", filteredFilmList);
	}
});



Flm.filmDisplay = Ember.ArrayController.create({
	content: [],
	addItem: function(film) {
		var me = this;
		if ( this.get('length') ) this.removeAt( 0, this.get('length') );
		this.pushObject(film);
	}	
});