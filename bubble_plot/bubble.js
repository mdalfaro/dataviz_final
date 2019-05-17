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

function load_data() {
    d3.csv("nfl_projections.csv", function(error, fantasy_data) {
        if (error) {throw error};
        players = {'QB':[], 'RB':[], 'WR':[], 
                    'TE':[], 'K':[], 'DST':[]}

        fantasy_data.forEach(function(d) {
            var player = {
              name: d['player'].replace("'", ""),
              team: d['team'],
              position: d['pos'], 
              playerid: d['player'].replace("'", "").replace(".", "").replace("-", "").trim().split(' ')[1] + d['player'].replace("'", "").replace(".", "").replace("-", "").trim().split(' ')[0],
              points: +d['fpts'], 
              clicked: false
            };
            if (player.position.includes('QB')) {
                players['QB'].push(player)
            }
            if (player.position.includes('RB')) {
                players['RB'].push(player)
            }
            if (player.position.includes('WR')) {
                players['WR'].push(player)
            }
            if (player.position.includes('TE')) {
                players['TE'].push(player)
            }
            if (player.position.includes('K')) {
                players['K'].push(player)
            }
            if (player.position.includes('DST')) {
                players['DST'].push(player)
            }
        })

        var svg_filters = d3.select("body")
            .append("svg")
            .attr("width", 800)
            .attr("height", 200)
            .attr("class", "labels");

        var position_names = [{pos:'QB', clicked:true}, {pos:'RB', clicked:false}, {pos:'WR', clicked:false}, 
                                {pos:'TE', clicked:false}, {pos:'K', clicked:false}, {pos:'DST', clicked:false}]   

        svg_filters.selectAll('.labels')
            .data(position_names)
            .enter()
            .append('text')
            .attr('class', 'labels')
            .attr('x', function(d, i) {
                return 10 + 80*i
            })
            .attr('y', 100)
            .attr('font-size', '40px')
            .attr("font-variant", 'small-caps')
            .attr('fill', function(d) {
                if (!d.clicked) {
                    d3.select(this)
                        .style('fill', '#F0DBA5');
                } else {
                    d3.select(this)
                        .style('fill', '#C04C4B');
                }
            })
            .text(function(d) {
                return d['pos']
            })
            .on('mouseover', function(d) {
                d3.select(this)
                    .style('fill', '#C04C4B')
                    .style("cursor", "pointer");
            })
            .on('mouseout', function(d) {
                if (!d.clicked) {
                    d3.select(this)
                        .style('fill', '#F0DBA5');
                } else {
                    d3.select(this)
                        .style('fill', '#C04C4B');
                }
            })
            .on('click', function(d) {
                if (d.clicked) {
                    d3.select(this)
                        .style('fill', '#F0DBA5');
                } else {
                    d3.select(this)
                        .style('fill', '#C04C4B');
                }
                d.clicked = !d.clicked

                clicked = []
                position_names.forEach(function(d) {
                    if (d.clicked) {
                        clicked.push(d.pos)
                    }
                })
                generate_bubbles(clicked)
            })

        diameter = 700
        svg_bubbles = d3.select("body")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter);

        generate_bubbles(['QB']);
    })
}

function generate_bubbles(positions) {

    svg_bubbles.selectAll("*").remove();

    if (positions.length != 0) {

        var all_players = []
        positions.forEach(function(d) {
            all_players = all_players.concat(players[d])
        })

        dataset = {'children': all_players}

        var bubble = d3.pack(dataset)
            .size([diameter-50, diameter-50])
            .padding(1.5);

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.points; });

        var node = svg_bubbles.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return !d.children
            })
            .append("g")
            .attr('class', function(d) {
                return d.data.playerid
            })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on('mouseover', function(d) {
                d3.select(this)
                    .attr('r', d.r + 40)
                    .style("cursor", "pointer")
                    .moveToFront();

                node.selectAll("." + d.data.playerid)
                    .attr("font-size", function(d) {
                        return d.data.r;
                    })

            })
            .on('mouseout', function(d) {
                node.selectAll("." + d.data.playerid)
                    .attr("font-size", function(d) {
                        return d.r / 5;
                    })
            })
            .on('click', function(d) {
                d.data.clicked = !d.data.clicked 
                if (d.data.clicked) {
                    console.log('NODE CLICKED!')
                    d3.select(this)
                        .attr('fill', '#C04C4B')
                } else {
                    d3.select(this)
                        .attr('fill', '#E7E7E6')
                }
            });

        node.append("title")
            .text(function(d) {
                return d.name + ": " + d.points;
            });

        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .attr('class', function(d) {
                return d.data.playerid
            })
            .style("fill", function(d) {
                //return colorDict[d.data.team.toLowerCase()]['main'];
                return "#E7E7E6"
            })
            .style("stroke", function(d) {
                //return colorDict[d.data.team.toLowerCase()]['alt'];
                return "black"
            })
            .on('mouseover', function(d) {
                d3.select(this)
                    .attr('r', d.r + 40)
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .attr('r', d.r)
                    .style("cursor", "pointer")
                node.selectAll("." + d.data.playerid)
                    .attr("font-size", function(d) {
                        return d.r / 5;
                    })
            })
            .on('click', function(d) {

                d.data['clicked'] = !d.data['clicked']

                if (d.data['clicked']) {
                    d3.select(this)
                        .attr('fill', '#C04C4B')
                } else {
                    d3.select(this)
                        .attr('fill', '#E7E7E6')
                }
            });

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .attr('class', function(d) {
                return d.data.playerid
            })
            .text(function(d) {
                return d.data.name;
            })
            .style("fill", function(d) {
                //return colorDict[d.data.team.toLowerCase()]['alt']
                return 'black'
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "black")
            .on('mouseover', function(d) {
                d3.select(this)
                    .style("cursor", "pointer")
                node.selectAll("." + d.data.playerid)
                    .attr("r", function(d) {
                        return d.r;
                    })
            });

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .attr('class', function(d) {
                return d.data.playerid
            })
            .text(function(d) {
                return d.data.points;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "black")
            .on('mouseover', function(d) {
                d3.select(this)
                    .style("cursor", "pointer")
                node.selectAll("." + d.data.playerid)
                    .attr("r", function(d) {
                        return d.r;
                    })
            });
    }
}

load_data()