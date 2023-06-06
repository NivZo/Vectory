<script lang="ts">
    import "./OptionsPanel.scss";
    import UndoButton from "../Buttons/UndoButton.svelte";
    import NextButton from "../Buttons/NextButton.svelte";
    import Button from "../Buttons/Button/Button.svelte";
    import { showNextButton } from "../../../stores/GameSessionStore";
    import MenuButton from "../Buttons/MenuButton.svelte";
</script>

<div class="options-panel">
    <MenuButton />
    <svelte:component this={$showNextButton ? NextButton : UndoButton} />
    <Button isEnabled={false}></Button>
    <!-- <UndoButton /> -->
    <!-- <NextButton /> -->
</div>
