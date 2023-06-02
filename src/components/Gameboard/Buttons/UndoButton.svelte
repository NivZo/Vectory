<script lang="ts">
    import { currentPath, gameSession } from "../../../stores/GameSessionStore";
    import Button from "./Button/Button.svelte";

    export let overrideOnClick: () => void = null;
</script>

<Button
    classes={!!overrideOnClick ? ['warn-btn'] : []}
    onClick={!!overrideOnClick
        ? overrideOnClick
        : gameSession.removeLastCoordinate}
    isEnabled={!($currentPath.length <= 1)}>Undo</Button
>
