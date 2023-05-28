<script>
	import { onMount } from "svelte";
	import GameBoard from "./components/GameBoard.svelte";
	import { getRandomGameConfiguration } from "./utils/jsonUtils";
	import { gameSession } from "./stores/GameSessionStore";

	let gameConfiguration;
	onMount(() => {
		gameConfiguration = getRandomGameConfiguration();
		gameSession.setGameConfiguration(gameConfiguration)
	})
</script>

<main>
	<GameBoard {gameConfiguration} />
</main>