<script lang="ts">
	import "./App.scss";

	import { onMount } from "svelte";
	import { getRandomGameConfiguration } from "./utils/jsonUtils";
	import { gameSession } from "./stores/GameSessionStore";
	import Display from "./components/Utility/Display.svelte";
	import PuzzleSession from "./components/Gameboard/PuzzleSession/PuzzleSession.svelte";

	let gameConfiguration;

	onMount(() => {
		gameConfiguration = getRandomGameConfiguration();
		gameSession.setGameConfiguration(gameConfiguration);
	});

	export let theme = "default";
</script>

<main class="{theme}-theme" on:contextmenu|preventDefault={null}>
	<div id="vectory-app">
		<Display />
		<PuzzleSession />
	</div>
</main>