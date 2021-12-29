// jQuery

$(document).mousemove(function(event) {
    $('#tooltip').css('left', event.clientX + 'px')
    $('#tooltip').css('top', event.clientY - 50 + 'px')
    if (event.target.classList[0] == null) {
        $('#tooltip').css('opacity', 0)
    }
});


let xScale;
let yScale;
let svg;
let legendSvg;
let legendXScale;
const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const tempArray = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8]
const tempDisplayArr = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7]

const w = 1000;
const h = 500;
const legendH = 250;
const legendW = 500;
const padding = 60;
const yScaleHeight = h - padding;

const tempColor = (data) => {
    const curTemp = 8.66 + data;

   if (curTemp < 3.9) {
       return '#1420FF';
   } else if (curTemp < 5.0) {
       return '#5E66FF';
   } else if (curTemp < 6.1) {
       return '#B5B9FF'
   } else if (curTemp < 7.2) {
       return '#F2F3FF';
   } else if (curTemp < 8.3) {
       return '#FFE8A1';
   } else if (curTemp < 9.5) {
       return '#FFAD61';
   } else if (curTemp < 10.6) {
       return '#FF9B3D';
   } else if (curTemp < 11.7) {
       return '#FF6E3D';
   } else {
       return '#FF2200';
   } 
}

const legendColor = (curTemp) => {

    if (curTemp < 3.9) {
        return '#1420FF';
    } else if (curTemp < 5.0) {
        return '#5E66FF';
    } else if (curTemp < 6.1) {
        return '#B5B9FF'
    } else if (curTemp < 7.2) {
        return '#F2F3FF';
    } else if (curTemp < 8.3) {
        return '#FFE8A1';
    } else if (curTemp < 9.5) {
        return '#FFAD61';
    } else if (curTemp < 10.6) {
        return '#FF9B3D';
    } else if (curTemp < 11.7) {
        return '#FF6E3D';
    } else {
        return '#FF2200';
    } 
}

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
     .then(response => response.json())
     .then(function(response) {
        console.log(response);
         addSvg(response);
         
     })


const addSvg = (response) => {
    svg = d3.select('#graph-div')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

    addScale(response);
}

const tooltip = d3.select('#graph-div')
                  .append('div')
                  .attr('id', 'tooltip')
                  .style('position', 'absolute')
                  .style('opacity', '0')

    legendSvg = d3.select('#legend')
                  .append('svg')
                  .attr('width', legendW)
                  .attr('height', legendH)

const addScale = (response) => {

    xScale = d3.scaleLinear()
               .domain([1753, 2015])
               .range([padding, w - padding]);

    yScale = d3.scaleBand()
               .domain(monthArray)
               .range([padding, h - padding]);

    legendXScale = d3.scaleBand()
                     .domain(tempArray)
                     .range([padding, legendW - padding]);
    
    addAxis(response);
}

const addAxis = (response) => {
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    const legendX = d3.axisBottom(legendXScale);

    svg.append('g')
       .attr('id','x-axis')
       .attr('transform', `translate (0, ${yScaleHeight})`)
       .call(xAxis.tickFormat(d => d));
    
    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', `translate(${padding}, 0)`)
       .call(yAxis);
    
    legendSvg.append('g')
             .attr('transform', `translate (0, ${padding})`)
             .call(legendX.tickFormat(d => d).ticks(12));
    
    addRect(response);
}

const addRect = (response) => {
    svg.selectAll('rect')
       .data(response.monthlyVariance)
       .enter()
       .append('rect')
       .attr('x', (d, i) => xScale(d.year))
       .attr('y', (d, i) => yScale(monthArray[d.month - 1]))
       .attr('width', (w - padding - padding) / 262)
       .attr('height', (h - padding - padding) / 12)
       .attr('fill', (d) => tempColor(d.variance))
       .attr('class', 'cell')
       .attr('data-month', (d) => d.month - 1)
       .attr('data-year', (d) => d.year)
       .attr('data-temp', (d) => d.variance)
       .attr('data-var', function(d)  {
          const temp = 8.66 - d.variance
          return temp.toFixed(2)        
        })
       .on('mouseover', (event) => tooltip.style('opacity', '1')
                                          .attr('data-year', event.currentTarget.dataset.year))
       .on('mousemove', (event) => tooltip.html(`<b>Month:</b> ${monthArray[event.currentTarget.dataset.month]} <br> <b>Temp:</b> ${event.currentTarget.dataset.var} <br> <b>Variance:</b> ${event.currentTarget.dataset.temp}`))
    
    legendSvg.selectAll('rect')
             .data(tempDisplayArr)
             .enter()
             .append('rect')
             .attr('x', (d, i) => legendXScale(d) + 20)
             .attr('fill', (d) => legendColor(d))
             .attr('y', 39)
             .attr('width', 35)
             .attr('height', 20)

}

