<script lang="ts">
    import { scaleLinear } from "d3-scale";
    import { display, halfHeight } from "../../../stores/DisplayStore";
    import { range, rangeAroundZero } from "../../../utils/mathUtils";
    import {
        currentHover,
        currentPath,
        currentCoordinate,
        gameSession,
    } from "../../../stores/GameSessionStore";
    import type { Domain } from "../../../types/Display";

    let svg;
    const fontSize = 14;
    export let domain: Domain = {
        x: [0, 0],
        y: [0, 0],
    };

    const padding = { top: 20, right: 40, bottom: 40, left: 25 };

    $: xScale = scaleLinear()
        .domain(domain.x)
        .range([padding.left, $display.width - padding.right]);

    $: yScale = scaleLinear()
        .domain(domain.y)
        .range([$halfHeight - padding.bottom, padding.top]);

    $: xTicks = rangeAroundZero(...domain.x, $display.width > 180 ? 4 : 5);

    $: yTicks = rangeAroundZero(...domain.y, $halfHeight > 180 ? 4 : 5);
</script>

<svg bind:this={svg}>
    <!-- y axis -->
    <g class="axis horizontal-axis">
        {#each range(...domain.y) as lineId}
            <g
                class="tick tick-{lineId}"
                transform="translate(0, {yScale(lineId)})"
            >
                <line
                    x1={padding.left}
                    x2={xScale(domain.x[1])}
                    class:cross-axis={lineId == 0}
                />
                {#if yTicks.indexOf(lineId) >= 0}
                    <text x={padding.left - 8} y="+4">{lineId}</text>
                {/if}
            </g>
        {/each}
    </g>

    <!-- x axis -->
    <g class="axis vertical-axis">
        {#each range(...domain.x) as lineId}
            <g class="tick" transform="translate({xScale(lineId)},0)">
                <line
                    y1={yScale(domain.y[0])}
                    y2={yScale(domain.y[1])}
                    class:cross-axis={lineId == 0}
                />
                {#if xTicks.indexOf(lineId) >= 0}
                    <text y={$halfHeight - padding.bottom + 16}>{lineId}</text>
                {/if}
            </g>
        {/each}
    </g>

    <!-- data -->
    {#each $currentPath as crd, i}
        {#if i > 0}
            <line
                x1={xScale($currentPath[i - 1].x)}
                y1={yScale($currentPath[i - 1].y)}
                x2={xScale(crd.x)}
                y2={yScale(crd.y)}
                class="path-vector"
            />
        {/if}
        <circle
            cx={xScale(crd.x)}
            cy={yScale(crd.y)}
            r="5"
            class="path-crd"
            class:current-crd={i == $currentPath.length - 1}
        />
        <text x={xScale(crd.x) + fontSize} y={yScale(crd.y) + fontSize}
            >P{i} ({crd.x},{crd.y})</text
        >
    {/each}

    {#if $currentHover}
        <line
            x1={xScale($currentCoordinate.x)}
            y1={yScale($currentCoordinate.y)}
            x2={xScale($currentHover.x)}
            y2={yScale($currentHover.y)}
            class="hover-vector"
        />
        <circle
            cx={xScale($currentHover.x)}
            cy={yScale($currentHover.y)}
            r="5"
            class="hover-crd"
        />
    {/if}

    <circle
        cx={xScale($gameSession.targetCoordinate.x)}
        cy={yScale($gameSession.targetCoordinate.y)}
        r="5"
        class="target-crd"
    />
</svg>

<style src="./Graph.css"></style>
