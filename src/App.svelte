<script>
	import { onMount, afterUpdate } from 'svelte';
	import { scaleOrdinal } from 'd3-scale';
	import BarChart from './charts/BarChart.svelte'
	import GraphicTitle from './components/GraphicTitle.svelte'
	import GraphicFooter from './components/GraphicFooter.svelte'
	import * as colors from './helpers/colors.js'
	import * as data from '../public/datasets/data.json'

	let dataset;
	let selectoptions;
	let active;
	let schemes = [colors.divergingbrownteal, colors.political, colors.dark]

	onMount(function() {
		selectoptions = ([...new Set(data.default.map(d => d.group))])
		active = selectoptions[0]
		dataset = data.default.filter(d => (d.group === active))
		colorScale.domain(data.default.map(d => d.subgroup))
	})

	afterUpdate(function() {
		dataset = data.default.filter(d => (d.group === active))
	})

	let width = Math.min(
		document.getElementById('interactive').getBoundingClientRect().width,
		1000
	);

	function chartwidth(x) {
		if (window.innerWidth <= 768) {
			return x
		} else {
			return x/2
		}
	}

	$: colorScale = scaleOrdinal()
		.domain([0,1,2])
		.range(colors.dark.concat(colors.vibrant.concat(colors.political)));


</script>

<style>
	:global(div.chart) {
		display:inline;
	}

	:global(form) {
		display:inline;

	}

	:global(form select) {
		font-size:1.25rem;
		font-family: "Akkurat", sans-serif;
		padding:0.5rem 0.2rem;
	}

	:global(#demographics-filter) {
		display:block;
		width: 100%;
		text-align:center;
		margin:0 0 2rem;
		font-size:1.1rem;
	}

	h4.chart-sub-label {
		display:block;
		text-align:center;
		width:100%;
		text-transform:capitalize;
		margin:1rem auto 0;
		 border-bottom: unset;
		 letter-spacing: unset;
	}

	div.chart-container {
		display:flex;
		flex-wrap: wrap;
		flex-basis: 50%
	}

	div.minichart {
		display:inline-block;
		clear:both;
	}

	@media screen and (max-width:768px) {
		div.chart-container {
			flex-basis:100%;
		}
	}

</style>

<GraphicTitle
	title={"xxx"}
/>
{#if dataset && dataset.length > 0}
	<div id="interactive-filter">
		<span>View most common responses based on: </span>
		<form>
			<select bind:value={active}>
				{#each selectoptions as opt}
					<option value={opt}>
						{opt}
					</option>
				{/each}
			</select>
		</form>
	</div>
	<div class="chart-container">
		{#each (dataset.filter(d => (d.group === active)).map(d => d.subgroup)) as subgroup, i}
			<div class="minichart">
				<h4 class="chart-sub-label">{subgroup}</h4>
				<BarChart
					width={
						chartwidth(width)
					}
					height={
						250
					}
					data={dataset.filter(d => {
						return d["subgroup"] === subgroup
					})}
					xVar={["Already vaccinated", "As soon as possible","After at least some people I know","After most people I know","Would not get the COVID-19 vaccine"]}
					yDomain={[0,0.50]}
					orientation={"horizontal"}
					fill={colorScale(subgroup)}
				/>
			</div>
		{/each}
	</div>
{/if}
<GraphicFooter
	source={"<a href='//covidstates.org'>The COVID-19 Consortium for Understanding the Public's Policy Preferences Across States</a>."}
	credit={"Tyler Machado/Northeastern University"}
/>
