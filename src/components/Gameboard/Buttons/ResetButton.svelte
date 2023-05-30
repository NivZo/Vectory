<script lang="ts">
    import { currentPath, gameSession } from "../../../stores/GameSessionStore";
    import Button from "./Button/Button.svelte";
</script>

<Button onClick={gameSession.resetGameState} isEnabled={!($currentPath.length <= 1)} text="Reset"/>