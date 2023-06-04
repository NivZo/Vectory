<script lang="ts">
    import "./OptionsPanel.scss";
    import UndoButton from "../Buttons/UndoButton.svelte";
    import NextButton from "../Buttons/NextButton.svelte";
    import Button from "../Buttons/Button/Button.svelte";
    import { isVictory } from "../../../stores/GameSessionStore";
    import { admin } from "../../../stores/AdminStore";
</script>

<div class="options-panel">
    <Button isEnabled={false}>Good</Button>
    <svelte:component this={$admin || $isVictory ? NextButton : UndoButton} />
    <Button isEnabled={false}>Luck</Button>
    <!-- <UndoButton /> -->
    <!-- <NextButton /> -->
</div>
