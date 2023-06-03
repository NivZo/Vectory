<script lang="ts">
    import "./StatusPanel.scss";

    import {
        currentCoordinate,
        gameSession,
        remainingMoves,
    } from "../../../stores/GameSessionStore";
    import { admin } from "../../../stores/AdminStore";
    import { currentLevel } from "../../../stores/LocalStorageStore";
</script>

<div class="status-panel">
    <span class="status-panel-item status-panel-level-item">
        Level:
        <br />
        {$currentLevel}
    </span>
    <span class="status-panel-item" on:click={admin.toggleAdmin}>
        Moves:
        <br />
        <b>{$remainingMoves}</b>
    </span>
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
</div>
