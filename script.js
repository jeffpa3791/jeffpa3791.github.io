// format variables 
var formatRevenue = d3.format(',0f')
var formatInputDate = d3.time.format('%Y-%m-%d')  //"1995-10-30"
var formatOutputDate = d3.time.format('%m/%d/%Y')
var formatTickDate = d3.time.format('%m/%Y')

// trigger variables
var pageno = '1'
var selectedGenre = 'All'
var selectedGroup = '1'
var selectedStartYear = '1970'
var selectedEndYear = '1979'

// text to display 
var text1 = "Let's take a look at the Top 10 Movies from each year, by Revenue as reported by IMDB.com.  You can hover over any movie to see a ToolTip.\nWhat kind of movies have been most popular over time?"
var text2 = "In the early years of moviemaking, Dramas were very popular but have since lost the lead spot."
var text3 = "Advances in special effects have helped Action movies become more popular."
var text4 = "Interestingly, Animation was very popular early on, and has made a comeback in recent years."
var text5 = "Now it's your turn.  Click a type of movie in the Legend and see if it has become more or less popular.  I hope you find your favorite!"

// screen size variables
var body = d3.select('body')
var margin = { top: 50, right: 160, bottom: 50, left: 100 }
var h = 500 - margin.top - margin.bottom
var w = 1200 - margin.left - margin.right

// legend variables
var legendRectSize = 18;                                  
var legendSpacing = 4;                                   
var legend_genre_names = [ "Action", "Adventure","Animation",
"Comedy", "Crime", "Documentary", "Drama", "Family",
"Fantasy", "Foreign", "History", "Horror", "Music", "Mystery",
"Romance", "Science Fiction", "Thriller", "TV Movie", "War", "Western"]


// SVG
var svg = body.append('svg')
	    .attr('height',h + margin.top + margin.bottom)
	    .attr('width',w + margin.left + margin.right)
	    .append('g')
	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')

//colors
var colorScale = d3.scale.category20() 


//Axes
var x = d3.time.scale().range([0, w]);
var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5);



d3.csv('top10.csv', function (data) {
  data.forEach(function(d) {
    d.release_date = formatInputDate.parse(d.release_date)
    d.revenue = +d.revenue
    d.main_genre_num = +d.main_genre;
  });

  var body = d3.select('body')

  document.getElementById("p1").innerHTML = text1;

  // Scales
  x.domain(d3.extent(data, function(d) { return d.release_date; }))


  // Scales
  var xScale = d3.time.scale()
     .domain(d3.extent(data, function(d) { return d.release_date; }))
     .nice()
     .range([0,w])

  var yScale = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(data,function (d) { return d.revenue })]),
    	1.1 * d3.max([0,d3.max(data,function (d) { return d.revenue })] )
    	])
    .nice()
    .range([h,0])

// Y-axis
	var yAxis = d3.svg.axis()
	  .scale(yScale)
	  .tickFormat(formatRevenue)
	  .ticks(5)
	  .orient('left')


  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
 //   .filter(function(d) { return d.group == selectedGroup })
      .attr('cx',function (d) { return xScale(d.release_date) })
      .attr('cy',function (d) { return yScale(d.revenue) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(d.main_genre_num) })
      .attr('data-legend',function (d) { return d.main_genre_name })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d.title +
                           '\nRelease Date: ' + formatOutputDate(d.release_date) +
                           '\nRevenue: ' + formatRevenue(d.revenue) +
                           '\nType: ' + d.main_genre_name})
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Release Date')
  // Y-axis
  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Revenue')

  var legend = svg.selectAll(".legend")
        .data(legend_genre_names)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", w + 10)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i) { return colorScale(i + 1) ; });

  legend.append("text")
      .attr("x", w + 33)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });

    legend.on("click", function(genre) {
        // dim all of the icons in legend
        d3.selectAll(".legend")
            .style("opacity", 0.35);
        // make the one selected be un-dimmed
        d3.select(this)
          .style("opacity", 1);
        selectedGenre = genre;
        HighlightGenre();
 //       // select all dots and apply 0 opacity (hide)
 //       d3.selectAll(".dot")
 //       // .transition()
 //       // .duration(500)
 //       .style("opacity", 0.0)
 //       // filter out the ones we want to show and apply properties
 //       .filter(function(d) {
 //           return d["first_careunit"] == type;
 //       })
 //           .style("opacity", 1) // need this line to unhide dots
 //       .style("stroke", "black")
 //       // apply stroke rule
 //       .style("fill", function(d) {
 //           if (d.hospital_expire_flag == 1) {
 //               return this
 //           } else {
 //               return "white"
 //           };
 //       });
    });




  function HighlightGenre() {
    console.log("in HighlightGenre")
    svg.selectAll("circle")
        .style("opacity", 0.1)
        .attr("pointer-events", "none")
        .filter(function(d) { return d["main_genre_name"] == selectedGenre; })
        .style("opacity", 1)
        .attr("pointer-events", "all")
        .on('mouseover', function () {
           d3.select(this)
             .transition()
             .duration(500)
             .attr('r',20)
             .attr('stroke-width',3)
           })
         .on('mouseout', function () {
           d3.select(this)
             .transition()
             .duration(500)
             .attr('r',10)
             .attr('stroke-width',1)
          })

    console.log("done in HighlightGenre")
  }

  function TimeframeChange() {
    console.log("in TimeframeChange")
    console.log("selectedStartYear = ", selectedStartYear)
    console.log("selectedEndYear = ", selectedEndYear)

    svg.selectAll("circle")
        .style("opacity", 0.1)
        .filter(function(d) { return d["release_year"] >= selectedStartYear & d["release_year"] <= selectedEndYear ; })
        .style("opacity", 0.25)
        .filter(function(d) { return d["main_genre_name"] == selectedGenre; })
        .style("opacity", 1)
        .on('mouseover', function () {
           d3.select(this)
             .transition()
             .duration(500)
             .attr('r',20)
             .attr('stroke-width',3)
           })
         .on('mouseout', function () {
           d3.select(this)
             .transition()
             .duration(500)
             .attr('r',10)
             .attr('stroke-width',1)
          })

    console.log("done in TimeframeChange")
  }

})

// navigation

//document.getElementById("Button_PrevPage").disabled = true; 

function clickedPrevPage() {
  console.log('Prev Page');
  if (pageno == '2') {
      pageno = '1';
      selectedGenre = 'All';
      document.getElementById("p1").innerHTML = text1;
    } else if (pageno == '3') {
      pageno = '2';
      selectedGenre = 'Drama';
      document.getElementById("p1").innerHTML = text2;
    } else if (pageno == '4') {
      pageno = '3';
      selectedGenre = 'Action'
      document.getElementById("p1").innerHTML = text3;
    } else if (pageno == '5') {
      pageno = '4';
      selectedGenre = 'Animation';
      document.getElementById("p1").innerHTML = text4;
      d3.selectAll(".legend")
            .style("opacity", 1);
    } 
    console.log("selectedGenre = ", selectedGenre);
    svg.call(HighlightGenre) ;
    console.log('Next Page done');
}


function clickedNextPage() {
  console.log('Next Page');
  if (pageno == '1') {
      pageno = '2';
      selectedGenre = 'Drama';
      document.getElementById("p1").innerHTML = text2;
    } else if (pageno == '2') {
      pageno = '3';
      selectedGenre = 'Action';
      document.getElementById("p1").innerHTML = text3;
    } else if (pageno == '3') {
      pageno = '4';
      selectedGenre = 'Animation';
      document.getElementById("p1").innerHTML = text4;
    } else if (pageno == '4') {
      pageno = '5';
      selectedGenre = 'All';
      document.getElementById("p1").innerHTML = text5;
    } 
    console.log("selectedGenre = ", selectedGenre);
    svg.call(HighlightGenre) ;
    console.log('Next Page done');
}


  function HighlightGenre() {
    console.log("in HighlightGenre")
    svg.selectAll("circle")
        .style("opacity", 0.1)
        .attr("pointer-events", "none")
        .filter(function(d) { return d["main_genre_name"] == selectedGenre || selectedGenre == 'All'; })
        .style("opacity", 1)
        .attr("pointer-events", "all")
        .on('mouseover', function () {
           d3.select(this)
             .transition()
             .duration(500)
             .attr('r',20)
             .attr('stroke-width',3)
           })
         .on('mouseout', function () {
           d3.select(this)
             .transition()
             .duration(500)
             .attr('r',10)
             .attr('stroke-width',1)
          })

    console.log("done in HighlightGenre")
  }


