<script lang="ts">
    import "./OptionsPanel.scss";
    import UndoButton from "../Buttons/UndoButton.svelte";
    import ResetButton from "../Buttons/ResetButton.svelte";
    import NewGameButton from "../Buttons/NewGameButton.svelte";

    let isSurePrompt = false;
</script>

<div class="options-panel">
    <UndoButton
        overrideOnClick={isSurePrompt
            ? () => {
                  isSurePrompt = false;
              }
            : null}
    />
    <ResetButton bind:isSurePrompt={isSurePrompt} />
    <NewGameButton />
</div>
