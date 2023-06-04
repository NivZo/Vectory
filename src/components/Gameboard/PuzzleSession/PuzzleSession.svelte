<script>
    import "./PuzzleSession.scss";

    import { onMount } from "svelte";
    import Graph from "../Screen/Graph/Graph.svelte";
    import { gameSession } from "../../../stores/GameSessionStore";
    import { display } from "../../../stores/DisplayStore";
    import { getSessionDomain } from "../../../utils/mathUtils";
    import ButtonPanel from "../Buttons/ButtonPanel/ButtonPanel.svelte";
    import StatusPanel from "../StatusPanel/StatusPanel.svelte";
    import MainScreen from "../Screen/MainScreen.svelte";

    onMount(() => {
        gameSession.resetGameState();
    });

    $: domain = getSessionDomain($gameSession.boardSideSize, $display);
    $: isPortrait = $display.height > $display.width;
</script>

<div
    class="puzzle-session"
    class:landscape={!isPortrait}
    class:portrait={isPortrait}
>
    <StatusPanel />
    <MainScreen />
    <ButtonPanel {domain} />
</div>
