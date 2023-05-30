<script lang="ts">
    import { currentPath, gameSession } from "../../../stores/GameSessionStore";
</script>

<button on:click|preventDefault={gameSession.removeLastCoordinate} disabled={$currentPath.length <= 1}>
    Undo
</button>