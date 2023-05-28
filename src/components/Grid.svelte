<script lang="ts">
    import { onMount } from "svelte";
    import { initDrawEngine, type DrawEngine } from "../utils/drawUtils";
    import {
    canvasSize,
        currentCoordinate,
        currentHover,
        currentPath,
        gameSession,
    } from "../stores/GameSessionStore";

    let canvas;
    let ctx;
    let drawEngine: DrawEngine;

    type Palette = {
        Source: string;
        Target: string;
        Path: string;
        CurrentCoordinate: string,
        Hover: string;
    };
    let COLORS: Palette = {
        Source: "green",
        Target: "red",
        Path: "blue",
        CurrentCoordinate: "yellow",
        Hover: "lightblue",
    };

    const initCanvas = () => {
        drawEngine = initDrawEngine(
            canvas,
            $gameSession.boardSideSize
            );
            ctx = canvas.getContext("2d");
            gameSession.resetGameState();
            gameSession.addCoordinate($gameSession.sourceCoordinate);
        }
        
    onMount(() => {
        // init
        initCanvas();

        // draw path
        currentPath.subscribe((p) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawEngine.drawGrid();
            drawEngine.drawAxes();
            drawEngine.drawPoint($gameSession.sourceCoordinate, COLORS.Source);
            drawEngine.drawPoint($gameSession.targetCoordinate, COLORS.Target);

            for (let i = 1; i < p.length; i++) {
                drawEngine.drawVector(p[i - 1], p[i], COLORS.Path);
                drawEngine.drawPoint(p[i], COLORS.Path);
            }

            if (p.length > 1)
                drawEngine.drawPoint(p[p.length - 1], COLORS.CurrentCoordinate);
        });

        // draw hover
        currentHover.subscribe((hoverCrd) => {
            if (hoverCrd != null) {
                drawEngine.drawPoint(hoverCrd, COLORS.Hover);
                drawEngine.drawVector($currentCoordinate, hoverCrd, COLORS.Hover);
            }
        });

        // subscribe for updates
        canvasSize.subscribe(initCanvas);
    });
</script>

<canvas bind:this={canvas} width="800" height="800" />
