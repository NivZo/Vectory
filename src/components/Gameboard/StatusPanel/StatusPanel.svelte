<script lang="ts">
    import "./StatusPanel.scss";

    import {
        currentCoordinate,
        gameSession,
        remainingMoves,
    } from "../../../stores/GameSessionStore";
    import { display } from "../../../stores/DisplayStore";
    import { admin } from "../../../stores/AdminStore";
</script>

<div class="status-panel">
    <span class="status-panel-item"
        >Current:
        <br />
        <b>({$currentCoordinate.x}, {$currentCoordinate.y})</b></span
    >
    <span class="status-panel-item">
        Goal:
        <br />
        <b>
            ({$gameSession.targetCoordinate.x}, {$gameSession.targetCoordinate
                .y})
        </b>
    </span>
    <span class="status-panel-item" on:click={admin.toggleAdmin}>
        Moves Left:
        <br />
        {$remainingMoves}
    </span>
</div>
