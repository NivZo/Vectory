<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { currentPath, gameSession } from "../../../stores/GameSessionStore";
    import Button from "./Button/Button.svelte";

    $: isSurePrompt = getContext("isSurePrompt");
</script>

<Button
    classes={!!isSurePrompt ? ["warn-btn"] : []}
    onClick={!!isSurePrompt
        ? () => {
              setContext("isSurePrompt", false);
          }
        : gameSession.removeLastCoordinate}
    isEnabled={!($currentPath.length <= 1)}>Undo</Button
>
