<script lang="ts">
    import { gameSession } from "../stores/GameSessionStore";
    import { getRandomGameConfiguration } from "../utils/jsonUtils";

    
    const initGameSession = () => {
		const gameConfiguration = getRandomGameConfiguration();
		gameSession.setGameConfiguration(gameConfiguration)
    }
</script>

<button on:click={initGameSession}>
    New
</button>