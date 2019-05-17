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

teams = ['Cardinals', 'Falcons', 'Bills', 'Ravens', 'Panthers', 'Bears', 'Bengals', 'Browns', 'Cowboys', 'Broncos', 
  'Lions', 'Packers', 'Texans', 'Colts', 'Jaguars', 'Chiefs', 'Chargers', 'Rams', 'Dolphins', 'Vikings', 'Patriots',
  'Saints', 'Giants', 'Jets', 'Raiders', 'Eagles', 'Steelers', 'Seahawks', '49ers', 'Buccaneers', 'Titans', 'Redskins']

d3.json('players.json', function(data) {

  var treemapLayout = d3.treemap()
    .size([800, 800])
    .paddingTop(20)
    .paddingInner(2);

  var rootNode = d3.hierarchy(data)

  rootNode.sum(function(d) {
    return d.value;
  });

  treemapLayout(rootNode);

  var nodes = d3.select('svg g')
    .selectAll('g')
    .data(rootNode.descendants())
    .enter()
    .append('g')
    .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'})

  nodes.append('rect')
    .attr('width', function(d) { return d.x1 - d.x0; })
    .attr('height', function(d) { return d.y1 - d.y0; })
    .attr('fill', function(d) {
      try {
        return colorDict[d.data['name']]['main']
      } catch(err) {
        return 'None'
      }
    })
    .attr('opacity', 0.8)
    .attr('stroke', 'white')

  nodes.append('text')
    .attr('dx', 4)
    .attr('dy', 14)
    .style('font-size', 8)
    .style('fill', function(d) {
      try {
        return colorDict[d.data['name']]['alt']
      } catch(err) {
        return 'white'
      }
    })
    .text(function(d) {
      var name_parts = d.data['name'].split(' ')

      try {
        if (teams.includes(name_parts[2])) {
          return 'D/ST'
        }
      } catch(err) {
      }

      if (name_parts.length == 1) {
        return name_parts[0]
      } else if (name_parts.length == 2) {
        return name_parts[1]
      } else {
        return name_parts[2]
      }
    })

})