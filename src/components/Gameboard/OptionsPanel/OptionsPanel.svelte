<script lang="ts">
    import "./OptionsPanel.scss";
    import UndoButton from "../Buttons/UndoButton.svelte";
    import NextButton from "../Buttons/NextButton.svelte";
    import Button from "../Buttons/Button/Button.svelte";
    import { isVictory } from "../../../stores/GameSessionStore";
    import { admin } from "../../../stores/AdminStore";
    import { mainScreen } from "../../../stores/MainScreenStore";
    import MenuButton from "../Buttons/MenuButton.svelte";
</script>

<div class="options-panel">
    <MenuButton />
    <svelte:component
        this={$admin || $isVictory || $mainScreen == "menu"
            ? NextButton
            : UndoButton}
    />
    <Button isEnabled={false}>Hint</Button>
    <!-- <UndoButton /> -->
    <!-- <NextButton /> -->
</div>
