<script lang="ts">
    import { currentPath, gameSession } from "../../../stores/GameSessionStore";
    import { mainScreen } from "../../../stores/MainScreenStore";
    import Button from "./Button/Button.svelte";

    $: isMenu = $mainScreen == "menu"
</script>

<Button
    onClick={mainScreen.toMenu}
    isEnabled={!isMenu}>
    {isMenu ? "" : "Menu"}
</Button>
