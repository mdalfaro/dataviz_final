var margin = {top: 20, right: 110, bottom: 70, left: 60},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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
  'DEN' : {'main':'#FB4F14', 'alt':'#002244'},
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

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("fpts_per_year.csv", function(data) {

  var keys = data.columns.slice(1)

  console.log(data)

  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 3, width ]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-2000, 2000])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#6EA4BB','#E4DCC2','#464646','#C04C4B','#F0DBA5','#F57653','#C58971'])

// Tom Brady,Drew Brees,Philip Rivers,Eli Manning,Ben Roethlisberger,Aaron Rodgers,Peyton Manning

  //stack the data?
  var stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)

  // Show the areas
  svg.selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .style("fill", function(d) { 
        console.log(d)
        return color(d.key); 
      })
      .attr("d", d3.area()
        .x(function(d, i) { return x(d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )

  // Append labels
  // Show the areas

  svg.append("text")
      .attr('x', 635)
      .attr('y', 373)
      .style("fill", '#6EA4BB')
      .style('font-size', 12)
      .attr("font-variant", 'small-caps')
      .text('Tom Brady')

  svg.append("text")
    .attr('x', 635)
    .attr('y', 330)
    .style("fill", '#E4DCC2')
    .style('font-size', 12)
    .attr("font-variant", 'small-caps')
    .text('Drew Brees')

  svg.append("text")
    .attr('x', 635)
    .attr('y', 285)
    .style("fill", '#464646')
    .style('font-size', 12)
    .attr("font-variant", 'small-caps')
    .text('Philip Rivers')

  svg.append("text")
    .attr('x', 635)
    .attr('y', 240)
    .style("fill", '#C04C4B')
    .style('font-size', 12)
    .attr("font-variant", 'small-caps')
    .text('Eli Manning')

  svg.append("text")
    .attr('x', 635)
    .attr('y', 193)
    .style("fill", '#F0DBA5')
    .style('font-size', 12)
    .attr("font-variant", 'small-caps')
    .text('Ben Roethlisberger')

  svg.append("text")
    .attr('x', 635)
    .attr('y', 145)
    .style("fill", '#F57653')
    .style('font-size', 12)
    .attr("font-variant", 'small-caps')
    .text('Aaron Rodgers')

  svg.append("text")
    .attr('x', 635)
    .attr('y', 100)
    .style("fill", '#C58971')
    .style('font-size', 12)
    .attr("font-variant", 'small-caps')
    .text('Peyton Manning')

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .style('font-size', 12)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Fantasy Points");      
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style('font-size', 12)
      .style("text-anchor", "middle")
      .text("Year");

})