<script>
    import "./PuzzleSession.scss";

    import { onMount } from "svelte";
    import Graph from "../Graph/Graph.svelte";
    import { gameSession } from "../../../stores/GameSessionStore";
    import { display } from "../../../stores/DisplayStore";
    import { getSessionDomain } from "../../../utils/mathUtils";
    import ButtonPanel from "../Buttons/ButtonPanel/ButtonPanel.svelte";
    import StatusPanel from "../StatusPanel/StatusPanel.svelte";

    onMount(() => {
        gameSession.resetGameState();
    });

    $: domain = getSessionDomain($gameSession.boardSideSize, $display);
</script>

<div class="puzzle-session">
    <StatusPanel />
    <Graph {domain} />
    <ButtonPanel {domain} />
</div>