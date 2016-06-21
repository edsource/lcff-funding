var searchTool = {
	vars:{
		data:[],
		results:[]
	},
	processData:function(v){
		//jQuery.getJSON('http://edsource.org/wp-content/js/json/lcff-comparison/data_search.json', function(d){
		jQuery.getJSON('//edsource.org/local-control-funding-formula-database/static/data_search.json', function(d){
			v.data = d;	

			searchTool.calibrateSearch(v.data, searchTool.vars.results);
		})
	},
	calibrateSearch:function(d, r){
		jQuery('.search-bar').on('keyup', function(e){
		    var key = e.which,
		    	bar = jQuery(this).attr('role'),
		    	link = jQuery(this).attr('link'),
		    	text = jQuery(this).val();
		    text.length > 2 ? searchTool.retrieveResults(text, d, r, bar, link) : jQuery('div[role="results"]').empty()
		});
	},
	retrieveResults:function(search, d, r, c, l){
		var re = new RegExp(search, 'i');
		r.length = 0; //clear results

		// grab matches and add to results
		for (var i = 1; i < d.length ; i++){
			var t = d[i][0].match(re); //test search term

			if (t != null){
				r.push(d[i]);
			}
		}

		searchTool.populateResults(r,c,l);
	},
	populateResults:function(r, c, l){
		jQuery('div[role="results"]').empty();

		for (var i=0 ; i < r.length ; i++){
			if (l === 'yes'){jQuery('.lcff-results').append('<a href="'+r[i][1]+'.html"><div><h2>'+r[i][0]+'</h2><h4>'+r[i][2]+'</h4></div></a>');}
			else if (l === 'no') {jQuery('.lcff-results').append('<a href="#" data="'+i+'" onclick="return false;"><div><h2>'+r[i][0]+'</h2><h4>'+r[i][2]+'</h4></div></a>');}
		}

		jQuery('div[role="results"] a').on('click', function(){
			var id = jQuery(this).attr('data'),
				target = jQuery('div[role="results"] a:eq('+id+') h2').text();
	
			jQuery('.search-bar[role="'+c+'"]').val(target);
			jQuery('div[role="results"]').empty();

			if (l === 'no'){updateChart(data, c, target);}
		})
	}
}

window.onload = function(){
	searchTool.processData(searchTool.vars);
}