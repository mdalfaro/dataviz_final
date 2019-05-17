var width = 960,
    height = 500, 
    margin = {top: 20, right: 30, bottom: 30, left: 60};

const svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

var x = d3.scaleLinear()
    .domain([0, 14000])
    .range([margin.left, width - margin.right]);
var y = d3.scaleLinear()
    .domain([0, 70])
    .range([height - margin.bottom, margin.top]);
/*
var radius = d3.scaleLinear()
    .domain([0, 7])
    .range([2, 6]);
*/

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

var colorDict = {
  'atl' : {'main':'#E03A3E', 'alt':'#C1D32F'},
  'bos' : {'main':'#007A33', 'alt':'#BA9653'},
  'den' : {'main':'#0E2240', 'alt':'#FEC524'},
  'sac' : {'main':'#5A2D81', 'alt':'#63727A'},
  'por' : {'main':'#E03A3E', 'alt':'#63727A'},
  'phi' : {'main':'#006BB6', 'alt':'#ED174C'},
  'lac' : {'main':'#C8102E', 'alt':'#1D428A'},
  'nyk' : {'main':'#006BB6', 'alt':'#F58426'},
  'mil' : {'main':'#00471B', 'alt':'#EEE1C6'},
  'uta' : {'main':'#002B5C', 'alt':'#00471B'},
  'det' : {'main':'#C8102E', 'alt':'#006BB6'},
  'tor' : {'main':'#CE1141' , 'alt':'black'},
  'okc' : {'main':'#007AC1', 'alt':'#EF3B24'},
  'bkn' : {'main':'#000000', 'alt':'#FFFFFF'},
  'pho' : {'main':'#1D1160', 'alt':'#E56020'},
  'was' : {'main':'#002B5C', 'alt':'#E31837'},
  'lal' : {'main':'#552583', 'alt':'#FDB927'},
  'min' : {'main':'#0C2340', 'alt':'#236192'},
  'hou' : {'main':'#CE1141', 'alt':'#000000'},
  'gsw' : {'main': '#006BB6', 'alt':'#FDB927'},
  'dal' : {'main': '#00538C', 'alt':'#B8C4CA'},
  'nop' : {'main': '#0C2340', 'alt':'#85714D'},
  'mia' : {'main': '#98002E', 'alt':'#F9A01B'},
  'chi' : {'main': '#CE1141', 'alt':'#000000'},
  'mem' : {'main': '#5D76A9', 'alt':'#12173F'},
  'cle' : {'main':'#6F263D', 'alt':'#041E42'},
  'sas' : {'main': '#000000', 'alt':'#C4CED4'},
  'cha' : {'main': '#1D1160', 'alt':'#00788C'},
  'orl' : {'main':'#0077C0' , 'alt':'#C4CED4'},
  'ind' : {'main':'#002D62' , 'alt':'#FDBB30'}
}

svg.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + (height - margin.bottom) + ")")
	.call(d3.axisBottom(x)
		.tickFormat(d3.format(".2s"))
    	.ticks(null, "$"))
	.append("text")
		.attr("x", width - margin.right)
		.attr("y", -6)
		.attr("fill", "#000")
		.attr('font-size', 10)
		.attr("text-anchor", "end")
		.text("Salary ($)");
svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y))
    .append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 0 + 12)
      	.attr("x", 0 - (margin.top))
	    .attr("fill", "#000")
	    .attr('font-size', 10)
	    .attr("text-anchor", "beginning")
	    .text("Fantasy Points");;

d3.csv("projections.csv", function(error, projections) {
  if (error) {throw error};

  total = 0

  projections.forEach(function(d) {
    d['Salary'] = +d['Salary'];
    d['Points'] = +d['Points'];
    d['Pt/$/K'] = +d['Pt/$/K'];
    total += d['Pt/$/K']
  });

  data = projections

  avg_pts_per_1k = total / projections.length

  scatter()
})

function scatter() {
	svg.selectAll('.circle')
		.data(data)
		.enter()
		.append('circle')
		//.attr('r', function(d) {return radius(d['Pt/$/K'])})
		.attr('r', 3)
		.attr('cx', function(d) {return x(d['Salary'])})
		.attr('cy', function(d) {return y(d['Points'])})
		.attr('fill', function(d) {
			//return colorDict[d['Team'].toLowerCase()]['main'];
			return '#464646'
		})
		.attr('stroke', function(d) {
			//return colorDict[d['Team'].toLowerCase()]['alt'];
			return 'None'
		})
		.attr('stroke-width', 1)
		.on('mouseover', function(d) {
			d3.select(this)
              .attr('r', 20)
              .style("cursor", "pointer")
              .style('opacity', 0.8)
              .moveToBack()
		})
		.on('mouseout', function(d) {
			d3.select(this)
              .attr('r', 3)
              .style('opacity', 1.0)
		})

	svg.append('line')
		.attr('x1', x(0))
		.attr('y1', y(0))
		.attr('x2', x(70 / avg_pts_per_1k * 1000))
		.attr('y2', y(70))
		.attr('stroke', 'black')

	svg.append('text')
		.attr("transform", "translate(" + x(55 / avg_pts_per_1k * 1000) + "," + y(55+1) + ") rotate("+-25+")")
		.attr('fill', 'black')
		.attr('font-size', '12')
		.text('Average (Points/$1000): ' + String(Math.round(avg_pts_per_1k*100)/100))

}