
d3.json("/api/graphs/word_cloud?username=" + username + "&date=" + date + "&query=" + query,
	function(error, data) {
		word_list = data.week_words;
		parseText(word_list);
	});
	
var fontSize = d3.scale.log().range([10, 100]);

var fill = d3.scale.category20();

var w = Math.min(750, $(window).width()),
	h = 400;
	
var words = [],
    max,
    scale = 1,
    complete = 0,
    keyword = "",
    tags,
    fontSize,
    maxLength = 30,
    fetcher;
	
var layout = d3.layout.cloud()
    .timeInterval(10)
    .size([w, h])
    .fontSize(function(d) { return fontSize(+d.value); })
    .text(function(d) { return d.key; })
    .on("end", draw);

var svg = d3.select("#wordle").append("svg")
	.attr("width", w)
	.attr("height", h);


var background = svg.append("g"),
	vis = svg.append("g")
	.attr("transform", "translate(" + [w >> 1, h >> 1] + ")");


d3.select("#download-png").on("click", downloadPNG);
	

var wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
    discard = /^(@|https?:|\/\/)/,
    htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
    matchTwitter = /^https?:\/\/([^\.]*\.)?twitter\.com/;

function parseHTML(d) {
  parseText(d.replace(htmlTags, " ").replace(/&#(x?)([\dA-Fa-f]{1,4});/g, function(d, hex, m) {
    return String.fromCharCode(+((hex ? "0x" : "") + m));
  }).replace(/&\w+;/g, " "));
}

// Converts a given word cloud to image/png.
function downloadPNG() {
  var canvas = document.createElement("canvas"),
      c = canvas.getContext("2d");
	  canvas.width = w;
	  canvas.height = h;
	  c.translate(w >> 1, h >> 1);
	  c.scale(scale, scale);
	  words.forEach(function(word, i) {
	    c.save();
	    c.translate(word.x, word.y);
	    c.rotate(word.rotate * Math.PI / 180);
	    c.textAlign = "center";
	    c.fillStyle = fill(word.text.toLowerCase());
	    c.font = word.size + "px " + word.font;
	    c.fillText(word.text, 0, 0);
	    c.restore();
	  });
  var a = document.createElement("a");
  a.download = "image.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
}



function parseText(word_list) {
  tags = {};
  var cases = {};
  word_list.forEach(function(word) {
    if (discard.test(word[0])) return;
    word_short = word[0].substr(0, maxLength);
    cases[word_short] = word_short;
    tags[word_short] = word[1];
  });
  tags = d3.entries(tags).sort(function(a, b) { return b.value - a.value; });
  tags.forEach(function(d) { d.key = cases[d.key]; });
  generate();
}

function generate() {
  layout
      .font("Arial")
      .spiral("archimedean");
  fontSize = d3.scale["sqrt"]().range([10, 100]);
  if (tags.length) fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
  complete = 0;
  words = [];
  layout.stop().words(tags.slice(0, max = Math.min(tags.length, +250))).start();
}

function draw(data, bounds) {
  scale = bounds ? Math.min(
      w / Math.abs(bounds[1].x - w / 2),
      w / Math.abs(bounds[0].x - w / 2),
      h / Math.abs(bounds[1].y - h / 2),
      h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
  words = data;
  var text = vis.selectAll("text")
      .data(words, function(d) { return d.text.toLowerCase(); });
      
  text.transition()
      .duration(1000)
      .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
      .style("font-size", function(d) { return d.size + "px"; });
      
  text.enter().append("text")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
      .style("font-size", function(d) { return d.size + "px"; })
      .on("click", function(d) {
        load(d.text);
      })
      .style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);
      
  text.style("font-family", function(d) { return d.font; })
      .style("fill", function(d) { return fill(d.text.toLowerCase()); })
      .text(function(d) { return d.text; });
      
  var exitGroup = background.append("g")
      .attr("transform", vis.attr("transform"));
      
  var exitGroupNode = exitGroup.node();
  
  text.exit().each(function() {
    exitGroupNode.appendChild(this);
  });
  
  exitGroup.transition()
      .duration(1000)
      .style("opacity", 1e-6)
      .remove();
      
  vis.transition()
      .delay(1000)
      .duration(750)
      .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
}
	