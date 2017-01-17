let STATE = {
  data: [10, 20, 100],
  width: 350,
  height: 250,
  radius: 125,
  title: 'My Graph',
  type: 'pie',
};

// handlers
$('input[type="radio"]').on('change', function (e, i) {
    update('type', this.value);
});

$('#data').on('keyup', function (e) {
  update('data', $(this).val());
});

$('#title').on('keyup', function (e) {
  update('title', $(this).val());
});

const update = (prop, val) => {
  if (prop === 'data') {
    STATE[prop] = val.split(', ').map(x => parseInt(x));
  } else {
    STATE[prop] = val;
  }

  render();
}

const render = () => {
  d3.select('.chart svg').remove();

  if (STATE.type === 'pie') {
    drawPie();
  } else {
    drawBar();
  }
};

const drawPie = () => {
  var margin = {top: 40, right: 0, bottom: 40, left: 0};
  var width = STATE.width - margin.left - margin.right;
  var height = STATE.height + margin.top + margin.bottom;

  var arc = d3.arc()
    .outerRadius(STATE.radius - 10)
    .innerRadius(STATE.radius - 50);

  var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d; })
    .startAngle(1.1 * Math.PI)
    .endAngle(3.1 * Math.PI);

  var svg = d3.select('.chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');

  var arcs = svg.selectAll('.arc')
    .data(pie(STATE.data))
    .enter()
    .append('g')
    .attr('class', 'arc');

  var background = arcs.append('path')
    .style('fill', '#ddd')
    .attr('d', arc);

  arcs.append('path')
    .attr('d', arc);
  /* **** Animate the pie graph in 
  TODO for later
    .transition()
    .delay(function(d, i) { return i * 500; }).duration(500)
    .attrTween('d', function(d) {
        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function(t) {
            d.endAngle = i(t);
          return arc(d);
        }
    });
  */

  svg.append('text')
    .attr('class', 'title')
    .attr('x', 0)
    .attr('y', 0 - (STATE.height / 2))
    .attr('text-anchor', 'middle')
    .text(STATE.title);
  
  arcs.append('text')
    .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')' })
    .attr('dy', '.35em')
    .style('fill', '#000')
    .text(function (d) { return d.data; });
}

const drawBar = () => {
  var margin = {top: 40, right: 20, bottom: 30, left: 40};
  var width = STATE.width - margin.left - margin.right;
  var height = STATE.height - margin.top - margin.bottom;

  var svg = d3.select('.chart').append('svg')
    .attr('width', STATE.width)
    .attr('height', STATE.height)
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  x.domain(STATE.data.map((d, i) => i + 1));
  y.domain([0, d3.max(STATE.data, d => d)]);

  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(d3.axisBottom(x));
  
  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).ticks(10))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Frequency');

  g.selectAll('.bar')
    .data(STATE.data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d, i) { return x(i + 1); })
    .attr('y', function(d) { return y(d); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d); });
  
  g.append('text')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', (margin.top / 2) * -1)
    .attr('text-anchor', 'middle')
    .text(STATE.title);
}

render();