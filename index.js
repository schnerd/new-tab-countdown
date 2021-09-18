var width = 1600,
    height = 200,
    cellSize = 17; // cell size

var calStartDate = new Date(2020, 0, 1);
var calEndDate = new Date(2021, 3, 1);

var breakStartDate = new Date(2020, 1, 12);
var sixMonthsDate = new Date(2020, 7, 12);
var yearDate = new Date(2021, 1, 12);
var today = new Date(2020, 5, 11);

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(5, 40)");

d3.select('.elapsed').text(d3.timeDay.count(breakStartDate, today));
d3.select('.remaining-6').text(d3.timeDay.count(today, sixMonthsDate));
d3.select('.remaining-12').text(d3.timeDay.count(today, yearDate));

var rect = svg.selectAll(".day")
    .data(d3.timeDays(calStartDate, calEndDate))
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fill", function(d) {
      if (d < breakStartDate || d > yearDate) {
        return '#999';
      }
      if (d < today) {
        return '#e74c3c';
      }
      return '#fff';
    })
    .attr("stroke", function(d) {
      if (d < breakStartDate || d > yearDate) {
        return '#777';
      }
      if (d < today) {
        return '#c0392b';
      }
      return '#ccc';
    })
    .attr("x", function(d) { return d3.timeWeek.count(calStartDate, d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })

rect.append("title")
  .text(function(d) { return d; });

const months = svg.selectAll(".month")
    .data(d3.timeMonths(calStartDate, calEndDate))
    .enter();

months.append("path")
    .attr("class", "month")
    .attr("d", monthPath);

months.append("text")
    .attr("class", "month-label")
    .text(d => d.toLocaleString('default', { month: 'short' }))
    .attr("x", function(d) { 
      const base = d3.timeWeek.count(calStartDate, d);
      if (d.getDay() === 0) {
        return base * cellSize;
      }
      return (base + 1) * cellSize;
    })
    .attr("y", -7);

svg.selectAll(".year-label")
    .data([calStartDate, new Date(2020, 0, 1)])
    .enter()
    .append("text")
    .attr("class", "year-label")
    .text(d => d.getFullYear())
    .attr("x", function(d) { 
      const base = d3.timeWeek.count(calStartDate, d);
      if (d.getDay() === 0) {
        return base * cellSize;
      }
      return (base + 1) * cellSize;
    })
    .attr("y", -20);

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.timeWeek.count(calStartDate, t0)
      d1 = t1.getDay(), w1 = d3.timeWeek.count(calStartDate, t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}
