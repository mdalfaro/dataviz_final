var colorDict = {
  'ARI' : {'main':'#97233F', 'alt':'#000000'},
  'ATL' : {'main':'#A71930', 'alt':'#000000'},
  'BAL' : {'main':'#241773', 'alt':'#000000'},
  'BUF' : {'main':'#00338D', 'alt':'#C60C30'},
  'CAR' : {'main':'#0085CA', 'alt':'#101820'},
  'CHI' : {'main':'#0B162A', 'alt':'#C83803'},
  'CIN' : {'main':'#FB4F14', 'alt':'#000000'},
  'CLE' : {'main':'#311D00', 'alt':'#FF3C00'},
  'DAL' : {'main':'#041E42', 'alt':'#869397'},
  'DET' : {'main':'#0076B6', 'alt':'#B0B7BC'},
  'GB' : {'main':'#203731', 'alt':'#FFB612'},
  'HOU' : {'main':'#03202F', 'alt':'#A71930'},
  'IND' : {'main':'#002C5F', 'alt':'#A2AAAD'},
  'JAC' : {'main':'#006778', 'alt':'#D7A22A'},
  'KC' : {'main':'#E31837', 'alt':'#FFB81C'},
  'LAC' : {'main':'#002A5E', 'alt':'#FFC20E'},
  'LAR' : {'main':'#002244', 'alt':'#866D4B'},
  'MIA' : {'main':'#008E97', 'alt':'#FC4C02'},
  'MIN' : {'main':'#4F2683', 'alt':'#FFC62F'},
  'NE' : {'main': '#002244', 'alt':'#C60C30'},
  'NO' : {'main': '#D3BC8D', 'alt':'#101820'},
  'NYG' : {'main': '#0B2265', 'alt':'#A71930'},
  'NYJ' : {'main': '#125740', 'alt':'#000000'},
  'OAK' : {'main': '#000000', 'alt':'#A5ACAF'},
  'PHI' : {'main': '#004C54', 'alt':'#A5ACAF'},
  'PIT' : {'main':'#FFB612', 'alt':'#101820'},
  'SEA' : {'main':'#002244', 'alt':'#69BE28'},
  'SF' : {'main': '#AA0000', 'alt':'#B3995D'},
  'TB' : {'main': '#D50A0A', 'alt':'#FF7900'},
  'TEN' : {'main':'#0C2340' , 'alt':'#418FDE'},
  'WAS' : {'main':'#773141' , 'alt':'#FFB612'}
}

const playercard = d3.select("#player_board_js")
	.append("svg")
	.attr("width", 1200)
	.attr("height", 180)

var svg = d3.select("#player_board_js")
	.append("svg")
	.attr("width", 700)
	.attr("height", 500)

// DENSITY
margin_density = { top: 170, right: 60, bottom: 260, left: 60 }
width_density = 600
height_density = 800
x_density = d3.scaleLinear().domain([0, 50]).range([margin_density.left, width_density - margin_density.right])
y_density = d3.scaleLinear().domain([0, .05]).range([height_density - margin_density.bottom, margin_density.top]);
xAxis_density = d3.axisBottom(x_density)
yAxis_density = d3.axisLeft(y_density).ticks(null, "%")

var margin = { top: 50, right: 20, bottom: 180, left: 100 },
	margin2 = { top: 360, right: 20, bottom: 100, left: 100 },
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom,
	height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var x = d3.scaleBand().range([0, width]).padding(0.1),
      x2 = d3.scaleBand().range([0, width]).padding(0.1),
      y = d3.scaleLinear().range([height, 0]),
      y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
      xAxis2 = d3.axisBottom(x2),
      yAxis = d3.axisLeft(y);

var parseDate = d3.timeParse("%Y-%m-%d");
var formatDate = d3.timeFormat("%b %d, %Y");

// ###########################

var width_radial = 450,
	height_radial = 450,
	margin_radial = {top: width_radial/2 - 20, right: 0, bottom: 400, left: height_radial/2},
	radius = Math.min(width_radial, height_radial - 50) / 2 - 30;

var svg_radial = d3.select("#player_board_js")
		.append("svg")
		.attr("width", width_radial)
		.attr("height", height_radial)
		.append("g")
		.attr("transform", "translate(" + margin_radial.left + "," + margin_radial.top + ")");

var r = d3.scaleLinear()
	.domain([0, .5])
	.range([0, radius]);
	
var scales = create_scales();

// ###########################

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() {  
  return this.each(function() { 
      var firstChild = this.parentNode.firstChild; 
      if (firstChild) { 
          this.parentNode.insertBefore(this, firstChild); 
      } 
  });
};

var teamDict = {
  'ARI' : 'Arizona Cardinals',
  'ATL' : 'Atlanta Falcons',
  'BAL' : {'main':'#241773', 'alt':'#000000'},
  'BUF' : {'main':'#00338D', 'alt':'#C60C30'},
  'CAR' : {'main':'#0085CA', 'alt':'#101820'},
  'CHI' : {'main':'#0B162A', 'alt':'#C83803'},
  'CIN' : {'main':'#FB4F14', 'alt':'#000000'},
  'CLE' : {'main':'#311D00', 'alt':'#FF3C00'},
  'DAL' : {'main':'#041E42', 'alt':'#869397'},
  'DET' : {'main':'#0076B6', 'alt':'#B0B7BC'},
  'GB' :  {'main':'#203731', 'alt':'#FFB612'},
  'HOU' : {'main':'#03202F', 'alt':'#A71930'},
  'IND' : {'main':'#002C5F', 'alt':'#A2AAAD'},
  'JAC' : {'main':'#006778', 'alt':'#D7A22A'},
  'KC' :  {'main':'#E31837', 'alt':'#FFB81C'},
  'LAC' : {'main':'#002A5E', 'alt':'#FFC20E'},
  'LAR' : {'main':'#002244', 'alt':'#866D4B'},
  'MIA' : {'main':'#008E97', 'alt':'#FC4C02'},
  'MIN' : {'main':'#4F2683', 'alt':'#FFC62F'},
  'NE' :  {'main': '#002244', 'alt':'#C60C30'},
  'NO' :  'New Orleans Saints',
  'NYG' : {'main': '#0B2265', 'alt':'#A71930'},
  'NYJ' : {'main': '#125740', 'alt':'#000000'},
  'OAK' : 'Oakland Raiders',
  'PHI' : {'main': '#004C54', 'alt':'#A5ACAF'},
  'PIT' : {'main':'#FFB612', 'alt':'#101820'},
  'SEA' :  'Seattle Seahawks',
  'SF' :  {'main': '#AA0000', 'alt':'#B3995D'},
  'TB' :  {'main': '#D50A0A', 'alt':'#FF7900'},
  'TEN' : {'main':'#0C2340' , 'alt':'#418FDE'},
  'WAS' : {'main':'#773141' , 'alt':'#FFB612'}
}

// ############################


var input = getUrlVars()['Player'].split(/\s*\-\s*/g)
var player_name = input[0] + ' ' + input[1]

d3.csv("../static/data/nfl_projections.csv", function(error, fantasy_data) {
    if (error) {throw error};
    projection = {}
    fantasy_data.forEach(function(d) {
      if (d['player'] == player_name) {
        projection = d;
      }
    })
    drawDensity(projection)
})

d3.csv("../static/data/qb.csv", function(error, input_data) {

	if (error) {throw error};

	data = []
	input_data.forEach(function(d) {
		if (d['name'] == player_name) {
			var game = {
				year: +d.year,
				week: +d.week,
				fpts: +d.fpts,
				position: d.position, 
				team: d.team,
				clicked: false
			};
			data.push(game); 
		}
	})

	var date_range = d3.timeDays(d3.min(data, function(d) { return d.date; }),
								 d3.max(data, function(d) { return d.date; }));
	var player_dates = d3.map(data, function(d) {return d.date}).keys();
	date_range.forEach(function(date) {
		if (player_dates.includes(String(date)) == false) {
			dummy_game = {date:date, 
						  fpts:0,
						  team:data[0].team
						}
			data.push(dummy_game)
		}
	})
	data.sort(function(a,b) {
    	return a.year - b.year;
    });

    // ############################

	playercard.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 1200)
		.attr("height", 180)
		.style("fill", colorDict[data[data.length-1].team]['main'])
		.style("stroke-width", 0);
		
	playercard.append("circle")
		.attr("cx", 95)
		.attr("cy", 90)
		.attr("r", 80)
		.style("fill", "#fbf9f3");

	playercard.append("svg:image")
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', 190)
		.attr('height', 190)
		.attr("xlink:href", '../static/images/' + player_name + '.png') // Fix this

	playercard.append("circle")
		.attr("cx", 95)
		.attr("cy", 90)
		.attr("r", 78)
		.style("fill", "none")
		.style("stroke", "#fbf9f3")
		.style('stroke-width', 5);

	playercard.append("circle")
		.attr("cx", 95)
		.attr("cy", 90)
		.attr("r", 78)
		.style("fill", "none")
		.style("stroke", colorDict[data[data.length-1].team]['alt']);

	playercard.append("circle")
		.attr("cx", 95)
		.attr("cy", 90)
		.attr("r", 100) // 100 usually
		.style("fill", "none")
		.style("stroke-width", 40) // 40 usually
		.style("stroke", colorDict[data[data.length-1].team]['main']);

	playercard.append("rect")
		.attr("x", 5)
		.attr("y", 5)
		.attr("width", 1200-10)
		.attr("height", 180-10)
		.style("fill", 'none')
		.style("stroke-width", 1)
		.style('stroke', colorDict[data[data.length-1].team]['alt']);

	playercard.append("text")
		.attr("x", 200)
		.attr("y", 50)
		.attr("font-family", "sans-serif")
		.style("fill", "#fbf9f3")
		.style("font-size", 40)
		.attr("font-variant", "small-caps")
		.text(player_name)

	playercard.append("text")
		.attr("x", 200)
		.attr("y", 80)
		.attr("font-family", "sans-serif")
		.style("fill", colorDict[data[data.length-1].team]['alt'])
		.style("font-size", 20)
		.text(teamDict[data[data.length-1].team])

	playercard.append("text")
		.attr("x", 410)
		.attr("y", 80)
		.attr("font-family", "sans-serif")
		.style("fill", "#fbf9f3")
		.style("font-size", 20)
		.attr("font-variant", "small-caps")
		.text(data[data.length-1].position)

	// #########
	drawDensity();
});

// ################## DENSITY PLOT ##################
const svg_density = d3.select("#player_board_js")
  .append("svg")
  .attr("width", 600)
  .attr("height", 800)

svg_density.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + (height_density - margin_density.bottom) + ")")
  .call(xAxis_density);

svg_density.append("text")             
    .attr("x", width_density/2)
    .attr("y", height_density - margin_density.bottom + 40)
    .style("text-anchor", "middle")
    .attr("font-size", "11px")
    .text("Fantasy Points (Per-Game)");

// ######### DENSITY ##########

function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

function drawPlayer(player, density) { 

  // Find highest point
  var coords = [0, 0]
  density.forEach(function(d) {
    if (d[1] >= coords[1]) {
      coords = d; 
    }
  })

  var defs = svg_density.append("defs")
    .attr("id", "imgdefs")

  var playerid = player['name'].split(' ')[0] + player['name'].split(' ')[1]

  var playerpattern = defs.append("pattern")
                          .attr("id", playerid)
                          .attr("height", 1)
                          .attr("width", 1)
                          .attr("x", "1")
                          .attr("y", "1")

  playerpattern.append("image")
       .attr("x", -15)
       .attr("y", -10)
       .attr("height", 90)
       .attr("width", 90)
       .attr("xlink:href", '../static/images/' + player['name'] + '.png')

  svg_density.append("circle")
    .attr("cx", x_density(coords[0]))
    .attr("cy", y_density(coords[1])-35)
    .attr("id", player['playerid'])
    .attr("r", 30)
    .style("fill", "none")
    .style("stroke", colorDict[player['team']]['main']);

  svg_density.append("circle")
      .attr("r", 30)
      .attr("cx", x_density(coords[0]))
      .attr("cy", y_density(coords[1])-35)
      .attr("id", player['playerid'])
      .attr("fill", "url(#" + playerid + ")")
      .on('mouseover', function(d) {
        d3.selectAll("#" + player['playerid'])
          .moveToFront()
          .style("cursor", "pointer");
      })
      .on('click', function(d) {
        player_name = player['name'].split(/[ ,]+/)[0] + '-' + player['name'].split(/[ ,]+/)[1]
        link = window.location.protocol + '/player?Player=' + player_name
        window.open(link)
      })
}

function drawDensity(player_proj) {

  var player = player_proj;

  console.log(data);

  var n = player['fpts'].length,
      bins = d3.histogram().domain(x_density.domain()).thresholds(40)(player['fpts']),
      density = kernelDensityEstimator(kernelEpanechnikov(7), x_density.ticks(40))(player['fpts']);
  density[0][1] = 0
  density[density.length - 1][1] = 0

  drawPlayer(player, density)

  svg_density.append("path")
    .datum(density)
    .attr("fill", colorDict[player['team']]['main'])
    .attr("stroke", colorDict[player['team']]['alt'])
    .attr("stroke-width", "1.5")
    .attr("opacity", 0.8)
    .attr("id", player['playerid'])
    .attr("stroke-linejoin", "round")
    .attr("d",  d3.line()
        .curve(d3.curveCardinal)
        .x(function(d) { return x_density(d[0]); })
        .y(function(d) { return y_density(d[1]); }))
    .on('mouseover', function(d) {
      d3.selectAll("#" + player['playerid'])
        .moveToFront()
        .style("cursor", "pointer");
    });

    var idx1 = Math.floor(player_proj['fpts']/16)
    var idx2 = idx1 + 1
    var line_height = ((density[idx1][1] + density[idx2][1])) / 2

    svg_density.append("line")
      .attr("x1", x_density(player_proj['fpts']/16))
      .attr("y1", y_density(0))
      .attr("x2", x_density(player_proj['fpts']/16))
      .attr("y2", y_density(line_height))
      .attr("id", player['playerid'])
      .style("stroke-width", 2)
      .style("stroke", colorDict[player['team']]['alt'])
      .style("stroke-dasharray", ("3, 3"))
      .style("fill", colorDict[player['team']]['alt']);
}

// #########################

function create_scales() {
	scale_FPts = d3.scaleLinear()
		.domain([0, 80])
		.range([0, radius])
	scale_Blocks = d3.scaleLinear()
		.domain([0, 3])
		.range([0, radius])
	scale_Points = d3.scaleLinear()
		.domain([0, 50])
		.range([0, radius])
	scale_Assists = d3.scaleLinear()
		.domain([0, 15])
		.range([0, radius])
	scale_Steals = d3.scaleLinear()
		.domain([0, 10])
		.range([0, radius])
	scale_Turnovers = d3.scaleLinear()
		.domain([0, 10])
		.range([0, radius])
	scale_Rebounds = d3.scaleLinear()
		.domain([0, 15])
		.range([0, radius])
	scale_Salary = d3.scaleLinear()
		.domain([0, 15000])
		.range([0, radius])
	var scales = [scale_FPts, scale_Blocks, scale_Points, scale_Assists,
		scale_Steals, scale_Turnovers, scale_Rebounds, scale_Salary]
	return scales
}

function getMeanValues(data) {
    var mean_FPts = d3.mean(data, function(d) { return d.fpts; });
    var mean_Blocks = d3.mean(data, function(d) { return d.blocks; });
    var mean_Points = d3.mean(data, function(d) { return d.points; });
    var mean_Assists = d3.mean(data, function(d) { return d.assists; });
    var mean_Steals = d3.mean(data, function(d) { return d.steals; });
    var mean_Turnovers = d3.mean(data, function(d) { return d.turnovers; });
    var mean_Rebounds = d3.mean(data, function(d) { return d.rebounds; });
    var mean_Salary = d3.mean(data, function(d) { return d.salary; });
    var values = [mean_FPts, mean_Blocks, mean_Points, mean_Assists,
                mean_Steals, mean_Turnovers, mean_Rebounds, mean_Salary]
    return values
}

var gr = svg_radial.append("g")
    .attr("class", "r axis")
    .selectAll("g")
    .data(r.ticks(5).slice(1))
    .enter()
    .append("g");

gr.append("circle")
    .attr("r", r)
    .attr("stroke-width", .1)
    .attr("stroke", 'black')
    .attr('fill', "None");

var ga = svg_radial.append("g")
    .attr("class", "a axis")
  .selectAll("g")
    .data(d3.range(0, 360, 45))
  .enter().append("g")
    .attr("transform", function(d) { return "rotate(" + -d + ")"; });

ga.append("line")
    .attr("x2", radius)
    .attr("stroke-width", .5)
    .style("stroke", "black");

// Interior labels

var tick_values = []
scale_names = ['FPts', 'Blocks', 'Points', 'Assists', 'Steals', 'Turnovers', 'Rebounds', 'Salary']
// Create 5 values for each scale
for (var i=0; i < scales.length; i++) {
  var color = 'black'
  if (i%2 == 0) {
  	color = 'white'
  }
  for (var j=1; j < 5+1; j+=2) {
    tick_values.push({'name':scale_names[i],
                      'val':(scales[i].domain()[1]/5*j).toFixed(0),
                      'rot':22.5*(2*i+1),
                      'scale':scales[i],
                      'color':color})
  }
}
            
var radial_axis_labels = svg_radial.append("g")
    .attr("class", "r_axis_labels")
    .selectAll("g")
    .data(tick_values)
    .enter()
    .append("g");

radial_axis_labels.append("text")
    .attr("y", function(d) { return - d.scale(d.val) + 10})
    .style("font-size", "10px")
    .attr('fill', function(d) {
    	return d.color;
    })
    .attr("font-family", "sans-serif")
    .attr("transform", function(d) {
      return "rotate(" + d.rot + ")"
    })
    .style("text-anchor", "middle")
    .text(function(d) { return d.val; });

// Exterior labels

var labs = []
// Create 1 value for each statistic

for (var i=0; i < scales.length; i++) {

  labs.push({'name':scale_names[i],
             'val':(scales[i].domain()[1]).toFixed(0),
             'rot':22.5*(2*i+1),
             'scale':scales[i]
           })
}

var exterior_labels = svg_radial.append("g")
    .attr("class", "r_exterior_labels")
    .selectAll("g")
    .data(labs)
    .enter()
    .append("g");

exterior_labels.append("text")
    .attr("y", function(d) { 
    	return - d.scale(d.val) - 10
    })
    .style("font-size", "10px")
    .attr("font-family", "sans-serif")
    .attr("transform", function(d) {return "rotate(" + d.rot + ")"} )
    .style("text-anchor", "middle")
    .text(function(d) { return d.name; });

function create_arcs(date_range) {

    // Update data based on selected range
    var updated_data = data.filter(function(d) { 
    	return date_range[0] < d.date & d.date < date_range[1] & d.minutes_played > 0;
    })

    // Get mean Values
    var mean_values = getMeanValues(updated_data)

    // Create data for arcs
    var pairs = []
    d3.range(0, 8, 1).map(function(t, i) {
        pairs.push({'start_angle': (i) * Math.PI/4, 'end_angle': (i+1) * Math.PI/4, 
                    //'rad':Math.random() * radius})
                    'rad': scales[i](mean_values[i])}) // fix this
    });

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(function(d) {return d.rad})
        .startAngle(function(d) {return d.start_angle})
        .endAngle(function(d) {return d.end_angle}); 

    svg_radial.selectAll('.arc').remove('*');


    // Does not work
    svg_radial.selectAll('.arc')
    	.append("text")
		.attr("x", width_radial/2)
		.attr("y", height_radial - 100)
		.attr("font-family", "sans-serif")
		.style("fill", "#6EA4BB")
		.style("font-size", 15)
		.text('Averages from ' + formatDate(date_range[0]) + '-' + formatDate(date_range[1]))

	// Add text value at end of each arc
	// var radial_values = svg_radial
	// 	.append("g")
	//     .selectAll("g")
	//     .data(pairs)
	//     .enter()
	//     .append("g");

	// radial_values.append("text")
	//     .attr("y", function(d) { return - d.scale(d.val) + 10})
	//     .style("font-size", "10px")
	//     .attr('fill', function(d) {
	//     	return d.color;
	//     })
	//     .attr("font-family", "sans-serif")
	//     .attr("transform", function(d) {
	//       return "rotate(" + d.rot + ")"
	//     })
	//     .style("text-anchor", "middle")
	//     .text(function(d) { return d.val; });


    svg_radial.selectAll('.arc')
        .data(pairs)
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("d", arc)
        .style("fill", function(d, i) {

        	d3.select(this)
	          	.moveToBack();

            if (i%2==0) {
                return colorDict[data[data.length-1].team]['alt']
            } else {
                return colorDict[data[data.length-1].team]['main']
            }
        })
        .style("stroke-width", "0px")
        .on("mouseover", function(d){ 
          d3.select(this)
          	.moveToFront()
            .style("cursor", "pointer");

		/*
          d3.select(this)
			.append("text")
			.attr("x", 10)
			.attr("y", 10)
			.attr("font-family", "sans-serif")
			.style("fill", "black")
			.style("font-size", 20)
			.attr("font-variant", "small-caps")
			.text(function(d) {
				console.log(d)
			})
		*/

        })
        .on("mouseout", function(d, i){ 
          var orig_color = (i%2==0) ? colorDict[data[data.length-1].team]['alt'] : colorDict[data[data.length-1].team]['main']
          d3.select(this)
          	.moveToBack()
            .style("fill", orig_color)
            .style("cursor", "pointer");
        });
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
