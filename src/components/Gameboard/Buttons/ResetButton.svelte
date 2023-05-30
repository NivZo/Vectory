<script lang="ts">
    import { currentPath, gameSession } from "../../../stores/GameSessionStore";
</script>

<button on:click|preventDefault={gameSession.resetGameState} disabled={$currentPath.length <= 1}>
    Reset
</button>