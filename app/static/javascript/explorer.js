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

function setup() {
  svg = d3.select("#player_board_js")
              .append("svg")
              .attr("width", 600)
              .attr("height", 800)

  margin = { top: 170, right: 30, bottom: 260, left: 70 },
        margin2 = { top: 580, right: 30, bottom: 180, left: 70 },
        margin_density = { top: 170, right: 60, bottom: 260, left: 60 },
        width = +svg.attr("width") - margin.left - margin.right,
        width_density = 600, 
        height = +svg.attr("height") - margin.top - margin.bottom,
        height2 = +svg.attr("height") - margin2.top - margin2.bottom,
        height_density = 800;

  // Scales
  x = d3.scaleBand().range([0, width]).padding(0.1),
        x2 = d3.scaleBand().range([0, width]).padding(0.1),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]),
        x_density = d3.scaleLinear().domain([0, 50]).range([margin_density.left, width_density - margin_density.right]),
        y_density = d3.scaleLinear().domain([0, .05]).range([height_density - margin_density.bottom, margin_density.top]);

  // Axes
  xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y),
        xAxis_density = d3.axisBottom(x_density),
        yAxis_density = d3.axisLeft(y_density).ticks(null, "%");

  // Axis Labels
  svg.append("text")             
      .attr("transform",
            "translate(" + ((width/2 + margin.left)) + " ," + 
                           (height + margin.top + 25) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", "11px")
      .text("Available Players");
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left/3)
      .attr("x",0 - (height))
      .attr("dy", "1em")
      .attr("font-size", "11px")
      .style("text-anchor", "middle")
      .text("Projected Fantasy Points (Season)");

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
}

function load_data() {
  d3.csv("../static/data/nfl_projections.csv", function(error, fantasy_data) {
    if (error) {throw error};
    data = []
    fantasy_data.forEach(function(d) {
      if (d['pos'] == 'RB' & +d['fpts'] > 0) {
        var player = {
          name: d['player'],
          playerid: d['player'].split(' ')[0] + d['player'].split(' ')[1],
          fpts: +d['fpts'],
          clicked: false
        };
        data.push(player);
      }
    })

    data.sort((a, b) => a['fpts'] - b['fpts']);
    
    // Domains
    x.domain(data.map(function(d) { return d['playerid']}));
    y.domain([0, 400]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    // Brush & Zoom
    brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", (brushed));
    zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]]);

    // Create focus (larger bar chart)
    focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    // Create context (smaller bar chart)
    context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

    updateMiniBars();
    barTooltips();

  })
}

function barTooltips() {
  var tooltip = svg.append("g")
    .attr("class", "bar_tooltip")
    .style("display", "none");
  tooltip.append("rect")
    .attr("width", 130)
    .attr("height", 40)
    .attr("y", 120)
    .attr("x", -18)
    .attr("fill", "white")
    .style("opacity", 0.8);
  tooltip.append("text")
    .attr('class', 'line_1')
    .attr("x", 48)
    .attr("y", 120)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "14px");
  tooltip.append("text")
    .attr('class', 'line_2')
    .attr("x", 48)
    .attr("y", 120)
    .attr("dy", "2.4em")
    .style("text-anchor", "middle")
    .attr("font-size", "14px");
}

function updateMiniBars(){
  let mini_bars = context.selectAll(".bar")
      .data(data);

  mini_bars
      .enter()
      .insert("rect")
      .attr("class", "bar")
      .attr("x", d => x2(d.name))
      .attr("width", x2.bandwidth())
      .attr("y", d => y2(d.fpts))
      .attr("height", d => height2 - y2(d.fpts))
      .style('fill', function(d) {
        if (d.clicked) {
          return '#FAFB97'
        } else {
          return '#464646'
        }
      });

  mini_bars.exit().remove();

  context.select('.axis--x').remove();

  context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2)

  // remove names
  context.select('.axis--x')
      .selectAll("text")
      .remove();

}

function update() {
  displayed = 0;
  let bar = focus.selectAll(".bar")
    .data(data);

  bar
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.fpts))
    .attr("height", d => height - y(d.fpts))
    .style('fill', function(d) {
      if (d.clicked) {
        return "#FAFB97"
      } else {
        return "#464646"
      }
    })
    .style("display", (d) => {
      let to_display = x(d.name) != null;
      if (to_display) {
        displayed += 1;
        return 'initial';
      }
      return 'none';
    })
    .on("mouseover", function(d){

      // activate tooltip
      svg.select('.bar_tooltip')
         .style('display', null); 

      // highlight bar
      d3.select(this)
        .style("fill", "#fbf9f3") // #C04C4B
        .style("cursor", "pointer");
    })
    .on("mouseout",function(d){ 

      // deactivate tooltip
      svg.select('.bar_tooltip').style('display', 'none'); 

      if (d.clicked) {
        d3.select(this)
          .style("fill", "#FAFB97")
          .style("cursor", "pointer");
      } else {
        d3.select(this)
          .style("fill", "#464646")
          .style("cursor", "pointer");
      }
    })
    .on("mousemove", function(d) {
      const tooltip = svg.select('.bar_tooltip');
      tooltip
        .select("text.line_1")
        .text(`${d.name}`);
      tooltip.select('text.line_2')
        .text(`${(d.fpts)}`);
      tooltip
        .attr('transform', `translate(${[d3.mouse(this)[0], d3.mouse(this)[1]]})`);
    })
    .on("click", function(d){
      d.clicked = !d.clicked
      if (d.clicked) {

        // Highlight bar 
        d3.select(this)
          .style("fill", "#FAFB97")
          .style("cursor", "pointer");

        drawDensity(d);

      } else {

        d3.selectAll("#" + d['playerid']).remove("*");

        // Revert bar color
        d3.select(this)
          .style("fill", "#464646")
          .style("cursor", "pointer");
      }
    });

  bar.enter()
    .insert("rect", '.mean')
    .attr("class", "bar")
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.fpts))
    .attr("height", d => height - y(d.fpts));
}

function updateAxis() {
  let axis_x = focus.select(".axis--x").call(xAxis);

  axis_x.selectAll("text")
      .remove();
}

function updateContext(min, max) {
  context.selectAll(".bar")
      .style('fill-opacity', (_, i) => i >= min && i < max ? '1' : '0.3');
}

function brushed() {
  var s = d3.event.selection || x2.range();
  current_range = [Math.round(s[0] / (width/data.length)), Math.round(s[1] / (width/data.length))];
  x.domain(data.slice(current_range[0], current_range[1]).map(ft => ft.name));
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (current_range[1] - current_range[0]))
      .translate(-current_range[0], 0));
  update();
  updateAxis();
  var min = current_range[0]
  var max = current_range[1]
  updateContext(min, max);
}

function main() {
  setup()
  load_data()
}

main()

d3.csv("../static/data/rb.csv", function(error, historical) {
  if (error) {throw error};

  players = {};
  historical.forEach(function(d) {

    if (d['year'] == 2018) {

      if (!(d['name'] in players)) {
        players[d['name']] = {}
        players[d['name']]['name'] = d['name']
        players[d['name']]['playerid'] = d['name'].split(' ')[0] + d['name'].split(' ')[1]
        players[d['name']]['fpts'] = []
        players[d['name']]['team'] = ''
      }
      players[d['name']]['fpts'].push(+d['fpts']);
      players[d['name']]['team'] = d['team'];
    }
  })

})

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

  var player = players[player_proj['name']];

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