let xScale;
let yScale;
let svg;
const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const w = 1000;
const h = 500;
const padding = 60;
const yScaleHeight = h - padding;

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
     .then(response => response.json())
     .then(function(response) {
        // console.log(response);
         addSvg(response);
     })


const addSvg = (response) => {
    svg = d3.select('#graph-div')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

    addScale(response);
}

const addScale = (response) => {

    xScale = d3.scaleLinear()
               .domain([1753, 2015])
               .range([padding, w - padding]);

    yScale = d3.scaleBand()
               .domain(monthArray)
               .range([padding, h - padding]);
    
    addAxis(response);
}

const addAxis = (response) => {
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
       .attr('id','x-axis')
       .attr('transform', `translate (0, ${yScaleHeight})`)
       .call(xAxis.tickFormat(d => d));
    
    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', `translate(${padding}, 0)`)
       .call(yAxis);
    
    addRect(response);
}

const addRect = (response) => {
    svg.selectAll('rect')
       .data(response.monthlyVariance)
       .enter()
       .append('rect')
       .attr('x', (d, i) => xScale(d.year))
       .attr('y', (d, i) => yScale(monthArray[d.month - 1]))
       .attr('width', 3.5)
       .attr('height', 31)
}