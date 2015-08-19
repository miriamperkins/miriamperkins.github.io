(function(){
    var units = "Students";

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3.select("#sankeyDiagram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// create a definitions element in the SVG
var defs = svg.append("defs");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(17)
    .nodePadding(27)
    .size([width, height]);

var path = sankey.link();

// load the data (using the timelyportfolio csv method)
var graph = getData();

  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

// define a function for link gradient
function getGradID(d){return "linkGrad-" + d.source.name + d.target.name;}
function nodeColor(d) {return d.color}

//function nodeColor(d) {return d.color = color(d.name.replace(/ .*/, ""));}

// create a selection of gradient objects withing defs and join to link data
var grads = defs.selectAll("linearGradient")
                 .data(graph.links, getGradID);

grads.enter().append("linearGradient")
    .attr("id", getGradID)
    .attr("gradientUnits", "userSpaceOnUse");

function positionGrads() {
grads.attr("x1", function(d){return d.source.x;})
    .attr("y1", function(d){return d.source.y;})
    .attr("x2", function(d){return d.target.x;})
    .attr("y2", function(d){return d.target.y;});
    }
positionGrads();

grads.html("") //erase any existing <stop> elements on update
     .append("stop")
     .attr("offset", "0%")
     .attr("stop-color", function(d){
           return nodeColor( (d.source.x <= d.target.x)? d.source: d.target)
          });

grads.append("stop")
     .attr("offset", "100%")
     .attr("stop-color", function(d){
           return nodeColor( (d.source.x > d.target.x)? d.source: d.target)
          });

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-opacity", "0.4")
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .style("stroke", function(d) {
      return "url(#" + getGradID(d) + ")";
      })
      .sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
  link.append("title")
        .text(function(d) {
    		return d.source.name + " → " +
                d.target.name + "\n" + format(d.value); });

// add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
		  return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() {
		  this.parentNode.appendChild(this); })
      .on("drag", dragmove));

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
		  return d.color})
      .style("fill-opacity", ".9")
      .style("shape-rendering", "crispEdges")
      .style("stroke", function(d) {
		  return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) {
		  return d.name + "\n" + format(d.value); });

// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");



// the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform",
        "translate(" + (
            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
        )
        + "," + (
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
        ) + ")");
    sankey.relayout();
    link.attr("d", path);
     positionGrads();
  };

function getData() {
return {
  "nodes":[
{"node":0,"name":"Excellent-T1","color":"#00FFFF"},
{"node":1,"name":"Good-T1","color":"#00FF00"},
{"node":2,"name":"Moderate-T1","color":"#FFFF00"},
{"node":3,"name":"Poor-T1","color":"#FF0000"},
{"node":0,"name":"Excellent-T2","color":"#00FFFF"},
{"node":1,"name":"Good-T2","color":"#00FF00"},
{"node":2,"name":"Moderate-T2","color":"#FFFF00"},
{"node":3,"name":"Poor-T2","color":"#FF0000"},
{"node":0,"name":"T3-Excellent","color":"#00FFFF"},
{"node":1,"name":"T3-Good","color":"#00FF00"},
{"node":2,"name":"Moderate-T3","color":"#FFFF00"},
{"node":3,"name":"Poor-T3","color":"#FF0000"}
],
"links":[
{"source":0,"target":4,"value":24443},
{"source":0,"target":5,"value":7748},
{"source":0,"target":6,"value":5694},
{"source":0,"target":7,"value":5764},
{"source":1,"target":4,"value":5337},
{"source":1,"target":5,"value":38491},
{"source":1,"target":6,"value":11202},
{"source":1,"target":7,"value":6681},
{"source":2,"target":4,"value":4260},
{"source":2,"target":5,"value":9737},
{"source":2,"target":6,"value":37563},
{"source":2,"target":7,"value":13897},
{"source":3,"target":4,"value":4501},
{"source":3,"target":5,"value":4318},
{"source":3,"target":6,"value":11893},
{"source":3,"target":7,"value":43575},
{"source":4,"target":8,"value":32725},
{"source":4,"target":9,"value":1715},
{"source":4,"target":10,"value":1780},
{"source":4,"target":11,"value":2321},
{"source":5,"target":8,"value":1743},
{"source":5,"target":9,"value":51425},
{"source":5,"target":10,"value":4025},
{"source":5,"target":11,"value":3101},
{"source":6,"target":8,"value":1747},
{"source":6,"target":9,"value":3645},
{"source":6,"target":10,"value":55223},
{"source":6,"target":11,"value":5737},
{"source":7,"target":8,"value":2109},
{"source":7,"target":9,"value":1977},
{"source":7,"target":10,"value":4780},
{"source":7,"target":11,"value":61051}
]};
}
})();
