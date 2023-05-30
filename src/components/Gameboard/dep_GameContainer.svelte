<script>
	import Grid from './dep_Grid.svelte';
	let grid = [10, 10];
</script>

<div>
	<span>
		<label for="rows">Rows</label>
		<input bind:value={grid[0]} type="number"/>
	</span>
	<span>
		<label for="columns">Columns</label>
		<input bind:value={grid[1]} type="number"/>
	</span>
</div>

<Grid {grid} />

<style>
	div {
		display: flex;
		width: 200px;
		justify-content: space-between;
	}
	
	div span:first-child {
		margin-right: 20px;
	}
	
	input {
		width: 100%
	}
</style>