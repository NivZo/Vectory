<script lang="ts">
    import { currentPath, gameSession } from "../../../stores/GameSessionStore";
    import Button from "./Button/Button.svelte";

    export let isSurePrompt = false;
</script>

<Button
    onClick={isSurePrompt
        ? () => {
              gameSession.resetGameState();
              isSurePrompt = false;
          }
        : () => {
              isSurePrompt = true;
          }}
    classes={isSurePrompt ? ['warn-btn'] : []}
    isEnabled={!($currentPath.length <= 1)}
    >{isSurePrompt ? "Sure?" : "Reset"}</Button
>
