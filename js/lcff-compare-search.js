var searchTool = {
	vars:{
		data:[],
		results:[]
	},
	processData:function(v){
		//jQuery.getJSON('http://edsource.org/wp-content/js/json/lcff-comparison/data_search.json', function(d){
		jQuery.getJSON('/static/data_search.json', function(d){
			v.data = d;	

			searchTool.calibrateSearch(v.data, searchTool.vars.results);
		})
	},
	calibrateSearch:function(d, r){
		jQuery('#search-bar').on('keyup', function(e){
		    var key = e.which,
		    	text = document.getElementById('search-bar').value;
		    if (key){searchTool.retrieveResults(text, d, r);}
		});
	},
	retrieveResults:function(search, d, r){
		var re = new RegExp(search, 'i');
		r.length = 0; //clear results

		// grab matches and add to results
		for (var i = 1; i < d.length ; i++){
			var t = d[i][0].match(re); //test search term

			if (t != null){
				r.push(d[i]);
			}
		}

		searchTool.populateResults(r);
	},
	populateResults:function(r){
		jQuery('div[role="results"]').empty();

		for (var i=0 ; i < r.length ; i++){
			jQuery('div[role="results"]').append('<a href="'+r[i][1]+'.html"><div><h2>'+r[i][0]+'</h2><h4>'+r[i][2]+'</h4></div></a>');
		}
	}
}

window.onload = function(){
	searchTool.processData(searchTool.vars);
}