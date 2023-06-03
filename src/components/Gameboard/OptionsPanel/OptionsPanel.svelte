<script lang="ts">
    import "./OptionsPanel.scss";
    import UndoButton from "../Buttons/UndoButton.svelte";
    import ResetButton from "../Buttons/ResetButton.svelte";
    import NextButton from "../Buttons/NextButton.svelte";
    import { setContext } from "svelte";
    import Button from "../Buttons/Button/Button.svelte";

    setContext("isSurePrompt", false);
</script>

<div class="options-panel">
    <UndoButton />
    <Button isEnabled={false}>Level:</Button>
    <!-- <ResetButton /> -->
    <NextButton />
</div>
