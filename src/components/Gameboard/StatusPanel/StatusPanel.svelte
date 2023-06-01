<script lang="ts">
    import {
        currentCoordinate,
        currentPath,
        gameSession,
        remainingMoves,
    } from "../../../stores/GameSessionStore";
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
    <span class="status-panel-item">
        Moves Left:
        <br />
        {$remainingMoves}
    </span>
</div>

<style src="./StatusPanel.scss"></style>
