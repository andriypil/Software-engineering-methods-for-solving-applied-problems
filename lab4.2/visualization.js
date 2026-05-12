function drawChart(points, lagrangeFunc, mnkFunc) {
    const svg = d3.select("#chart");
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 600;
    const margin = 60;

    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);

    const xScale = d3.scaleLinear()
        .domain([d3.min(xValues) - 1, d3.max(xValues) + 1])
        .range([margin, width - margin]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(yValues) + 10])
        .range([height - margin, margin]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(yScale));

    svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "black");

    const lagrangeData = [];
    const mnkData = [];

    for (let x = d3.min(xValues); x <= d3.max(xValues); x += 0.05) {
        lagrangeData.push({ x, y: lagrangeFunc(x) });
        mnkData.push({ x, y: mnkFunc(x) });
    }

    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    svg.append("path")
        .datum(lagrangeData)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("path")
        .datum(mnkData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line);
}
