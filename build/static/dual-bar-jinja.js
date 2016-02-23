var barChart = {
	getAttr: function(type, path, path2, contain, w, h, m, color, color2, sort, xlabel, ylabel, tF, tick, pad, title, subhed, source, max, items, round){
		var p = {
			label:[],
			data:[],
			w:null,
			h:null,
			m:{},
			contain:null,
			xaxisLabel:null,
			yaxisLabel:null,
			tickFormat:null,
			ticks:null,
			tickValues:[],
			path:null,
			path2:null,
			color:null,
			color2:null,
			padding:null,
			sort:false,
			title:null,
			subhed:null,
			source:null,
			type:null,
			max: null,
			items: null,
			round:0
		}
		p.type = type;
		p.w = parseInt(w);
		p.h = parseInt(h);
		p.m = {
			top:m[0],
			right:m[1],
			bottom:m[2],
			left:m[3]
		};
		p.path = path;
		p.path2 = path2;
		p.contain = '#' + contain;
		p.xaxisLabel = xlabel;
		p.yaxisLabel = ylabel;
		p.tickFormat = tF;
		p.ticks = tick;
		p.items = items;

		if (max !== null || max !== 'null'){p.max = max;}

		p.color = color;
		p.color2 = color2;
		
		p.padding = pad;
		p.sort = sort;
		p.round = round;

		p.title = title;
		p.subhed = subhed;
		p.source = source;

		barChart.parseData(p);
	},
	commaSeparateNumber:function(val){
	    while (/(\d+)(\d{3})/.test(val.toString())){
	      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	    }
	    return val;
	},
	roundTo:function(p, n, t){
		// find length
		var len = n.toString().length - 1, i=0;

		// get first character of n
		var first = n.toString().match(/\d/);
		if (first[0] != 9){first = parseInt(first[0]);}
		else {first = 1; len += 1;}
		n = first;

		// get second character
		if (t != 0){
			var second = parseInt(n.toString().substring(1,2));
			if (second > t){second = 0;}
			else {second = t;}
			len -= 1;n += second.toString();
		}
		else if (t == 0) {n += 1;}

		// build maximum value
		while (i < len){n += '0'; i += 1;}

		// give me five clean ticks yo
		var x = parseInt(n) / p.ticks;
		for (var i=1 ; i < p.ticks ; i++){p.tickValues.push(x*i);}
	
		return parseInt(n);
	},
	parseData:function(p){

		/* DATA AND DRAW
		===============================================================================*/
		var data = new Array(), max = new Array();
		for (var i = 0 ; i < p.items ; i++){
			data[i] = new Object();

			switch (i){
				case 0:
					data[i].value = +p.path.y201415;
					data[i].value2 = +p.path2.y201415;
					data[i].xlabel = '2014-15 Funding';
					break;
				case 1:
					data[i].value = +p.path.y201516;
					data[i].value2 = +p.path2.y201516;
					data[i].xlabel = '2015-16 Estimate';
					break;
				case 2:
					data[i].value = +p.path.y202021;
					data[i].value2 = +p.path2.y202021;
					data[i].xlabel = '2020-21 Estimate';
					break;
			}	

			max.push(data[i].value);
			max.push(data[i].value2);

			data[i].label = p.path.target;
			data[i].label2 = p.path2.target;
		}

		/* DETERMINE MAX
		==========================*/
		p.max = Math.max(...max);
		p.max = barChart.roundTo(p, p.max, p.round);
		console.log(p.max)
		barChart.drawChart(p, data);
	},
	drawChart: function(p, data){
		var contain = p.contain;

		/* SCALE
		==========================*/
		var xScale = d3.scale.ordinal().rangeRoundBands([0, p.w - (p.m.left + p.m.right)], p.padding);
		var yScale = d3.scale.linear().rangeRound([p.h, 0]);

		/* MAPS POS	
		====================================*/
		xScale.domain(data.map(function(d){ return d.xlabel;}));
		yScale.domain([0, p.max]).clamp(true);	

		/* AXES
		==========================*/
		var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
		var yAxis = d3.svg.axis().scale(yScale).orient('left').tickValues([0,p.tickValues[0],p.tickValues[1],p.tickValues[2],p.tickValues[3],p.max]).tickFormat(d3.format(p.tickFormat));

		/* CHART
		==========================*/
		var chart = d3.select(p.contain).append('svg').classed('s_c_p', true).attr('width', p.w).attr('height', p.h)
					.append('g').attr('transform', 'translate('+ p.m.left +','+ p.m.top + ')');

		/* SORT
		====================================*/
		if (p.sort == true || p.sort === 'true'){data.sort(function(a,b) {return b.value - a.value;})}

		/* DRAW AXES
		====================================*/
		chart.append('g').attr('class', 'xaxis').attr('transform', 'translate(0,' + p.h + ')').call(xAxis)
			.selectAll(".tick text").call(barChart.wrapLabels, xScale.rangeBand());
		chart.append('g').attr('class', 'yaxis').attr('transform','translate(0,0)').call(yAxis);

		/* TOOLTIP
		====================================*/
		var tip = d3.tip().html(function(d) { 
			jQuery('.n').addClass('d3-tip');
			if (p.tickFormat == '.0%'){
				return (d.label + '<br>' + Math.round(d.value*100) + '%');
			}
			else if (p.tickFormat == '$,'){
				return (d.label + '<br>' + '$' + barChart.commaSeparateNumber(Math.round(d.value)));
			}
			else if (p.tickFormat == ',g'){
				return (d.label + '<br>' + barChart.commaSeparateNumber(Math.round(d.value)));
			}
		});
		var tip2 = d3.tip().html(function(d) { 
			jQuery('.n').addClass('d3-tip');
			if (p.tickFormat == '.0%'){
				return (d.label2 + '<br>' + Math.round(d.value2*100) + '%');
			}
			else if (p.tickFormat == '$,'){
				return (d.label2 + '<br>' + '$' + barChart.commaSeparateNumber(Math.round(d.value2)));
			}
			else if (p.tickFormat == ',g'){
				return (d.label2 + '<br>' + barChart.commaSeparateNumber(Math.round(d.value2)));
			}
		});
		chart.call(tip);
		chart.call(tip2);


		/* DRAW COLUMNS
		====================================*/
	    //bar the first
	    dual = chart.selectAll(".xitem").data(data).enter().append("rect").attr("class", "xitem")
	     	.attr("x", function(d) { return xScale(d.xlabel); }).attr("width", xScale.rangeBand()/2).attr("y", function(d) { return yScale(d.value); }).attr("height", function(d) { return p.h - yScale(d.value); })
	     	.style('fill', p.color).on('mouseover', tip.show).on('mouseout', tip.hide);
	    
	    //bar the first
	    dual2 = chart.selectAll(".xitem2").data(data).enter().append("rect").attr("class", "xitem2")
	     	.attr("x", function(d) { return xScale(d.xlabel) + xScale.rangeBand()/2; }).attr("width", xScale.rangeBand()/2).attr("y", function(d) { return yScale(d.value2); }).attr("height", function(d) { return p.h - yScale(d.value2); })
	     	.style('fill', p.color2).on('mouseover', tip2.show).on('mouseout', tip2.hide);

		/* ADJUST CHART TEMP
		====================================*/
		jQuery(contain + ' svg').attr('height', p.h+(p.m.top * 2));
		
		/* ADD LEGEND
		=================================*/
		jQuery(contain).prepend('<div id="legend"></div>');
		jQuery(contain + ' #legend').append('<div><div><div style="background:'+p.color +'"></div></div><div><p>'+data[0].label+'</p></div></div></div>');
		jQuery(contain + ' #legend').append('<div><div><div style="background:'+p.color2 +'"></div></div><div><p>'+data[0].label2+'</p></div></div></div>');

		/* ADD META DETAILS
		=================================*/
		jQuery(contain).prepend('<div id="meta"></div>');
		jQuery(contain + ' #meta').append('<p>'+p.subhed+'</p>');

		/* STYLES
		=================================*/
		jQuery(contain).css('width', parseInt(p.w)+ 'px');
		jQuery(contain + ' #meta p').css({'margin':0});
				
	},
	wrapLabels: function(text, width){
		text.each(function() {
		    var text = d3.select(this),
		        words = text.text().split(/\s+/).reverse(),
		        word,
		        line = [],
		        lineNumber = 0,
		        lineHeight = 1.1, // ems
		        y = text.attr("y"),
		        dy = parseFloat(text.attr("dy")),
		        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		    while (word = words.pop()) {
		      line.push(word);
		      tspan.text(line.join(" "));
		      if (tspan.node().getComputedTextLength() > width) {
		        line.pop();
		        tspan.text(line.join(" "));
		        line = [word];
		        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		      }
		    }
		  });
	}
}