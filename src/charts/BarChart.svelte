<script>
	import { onMount } from 'svelte';
	import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
	import { axisLeft, axisRight, axisTop, axisBottom } from 'd3-axis';
	import { format } from 'd3-format';
	import { select, selectAll } from 'd3-selection';
	import { vibrant } from '../helpers/colors.js'
	import { wrapLabel } from '../helpers/wrapLabel.js'

	let d3 = {
		scaleLinear: scaleLinear,
		scaleBand: scaleBand,
		scaleOrdinal: scaleOrdinal,
		select: select,
		selectAll: selectAll,
		axisLeft: axisLeft,
		axisRight: axisRight,
		axisBottom: axisBottom,
		axisTop: axisTop,
		format: format
	}

	let el;

	const padding = { top: 10, right: 0, bottom: 10, left: 50 };



	export let data = {data};
	export let width = {width};
	export let height = {height};
	export let xVar = {xVar};
	export let yVar = {xVar};
	export let yDomain = ([0, 100])
	export let fill = "black"
	export let orientation = "vertical";

	$: xScale = d3.scaleBand()
		.domain(xVar)
		.rangeRound([0, width - padding.left - padding.right])
		.padding(0.2);

	$: yScale = d3.scaleLinear()
		.domain(yDomain)
		.range([height - padding.bottom, padding.top]);

	onMount(generateBarChart);

	function generateBarChart() {
		console.log(data)
		if (orientation !== "vertical") {
			padding.top = 0;
			padding.left = 150;
			padding.right = 15;
			xScale.rangeRound([padding.top, height - padding.bottom])
			yScale.range([0, width - padding.left - padding.right])
		}

		// draw chart SVG
		var svg = d3.select(el)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform",
				  "translate(" + padding.left + "," + padding.top + ")");

		if (orientation !== "vertical") {
			// axes
			let axisLeft = svg.append("g")
			   .call(d3.axisLeft(xScale)
					.tickSizeInner(0)
					.tickSizeOuter(0)
					.tickPadding(5)
				)
				.call(g => g.select(".domain").remove())
				.call(g => g.selectAll(".tick text").attr("font-size","12px").attr("transform", "translate(-3, 0)"));

			axisLeft.selectAll(".tick text")
				.call(wrapLabel, padding.left);

			let axisBottom = svg.append("g")
				.attr("transform", "translate(0," + (height-padding.bottom) + ")")
	  			.call(d3.axisBottom(yScale)
					.ticks(5)
					.tickSizeInner(-width)
					.tickSizeOuter(0)
					.tickPadding(3)
					.tickFormat(d3.format('.0%'))
				)
				.call(g => g.select(".domain").remove())

			// add data points
			let length = xVar.length
			for (let v in xVar) {
				svg.append('g')
				    .selectAll("rect")
				    .data(data)
				    .enter()
				    .append("rect")
					 .attr("y", function (d) {
						 return xScale(xVar[v]) + ((xScale.bandwidth() / length));
					 })
				    .attr("x", function (d) {
						 return 0;
					 })
					 .attr("height",
					 	xScale.bandwidth()
					)
					 .attr("width", function (d) {
						 return yScale(d[xVar[v]]);
					 })
					 .attr("fill", function(d){
						 return fill;
					 });
			}

		}

	} // generateBarChart
</script>

<style>
	.chart :global(g.tick line) {
		stroke: #ccc;
	}
</style>

<div bind:this={el} class="chart"></div>
