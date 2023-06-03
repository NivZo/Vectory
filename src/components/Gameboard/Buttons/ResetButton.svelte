<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { currentPath, gameSession } from "../../../stores/GameSessionStore";
    import Button from "./Button/Button.svelte";

    $: isSurePrompt = getContext("isSurePrompt");
</script>

<Button
    onClick={isSurePrompt
        ? () => {
              gameSession.resetGameState();
              setContext('isSurePrompt', false);
          }
        : () => {
            setContext('isSurePrompt', true);
          }}
    classes={isSurePrompt ? ['warn-btn'] : []}
    isEnabled={!($currentPath.length <= 1)}
    >{isSurePrompt ? "Sure?" : "Reset"}</Button
>
