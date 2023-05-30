<script lang="ts">
	import { onMount } from "svelte";
	import { getRandomGameConfiguration } from "./utils/jsonUtils";
	import { gameSession } from "./stores/GameSessionStore";
    import Display from "./components/Utility/Display.svelte";
    import PuzzleSession from "./components/Gameboard/PuzzleSession.svelte";
	import type { Theme } from "./types/Theme";

	let gameConfiguration;

	onMount(() => {
		gameConfiguration = getRandomGameConfiguration();
		gameSession.setGameConfiguration(gameConfiguration)
	})

	export let theme: Theme = "basic-theme"
</script>

<main class={theme}>
	<Display/>
	<PuzzleSession/>
</main>

<style src="./App.css"></style>