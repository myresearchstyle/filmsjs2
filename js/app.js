/****************************
  * Application 
****************************/

Flm = Ember.Application.create({
	author: "Ovidiu",
	rootElement: "#page",
	ready: function() {
	}
});


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


/****************************
  * Controllers
****************************/

Flm.listController = Ember.ArrayController.create({
	content: [],
	loadFilm: function(event) {
		event.preventDefault();
		var filmDescription = event.context;
		Flm.filmDisplay.addItem(filmDescription);
	}
});

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
			film.poster = filmInfo.posters.detailed;
		}
	});
	Flm.listController.set("content", data);
});

Flm.filmDisplay = Ember.ArrayController.create({
	content: [],
	addItem: function(filmDescription) {
		if ( this.get('length') ) this.removeAt( 0, this.get('length') );
		this.pushObject(filmDescription);
	}
});