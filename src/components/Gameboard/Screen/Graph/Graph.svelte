<script lang="ts">
    import "./Graph.scss";

    import { scaleLinear } from "d3-scale";
    import { display, halfHeight } from "../../../../stores/DisplayStore";
    import { getSessionDomain, rangeAroundZero } from "../../../../utils/mathUtils";
    import {
        currentHover,
        currentPath,
        currentCoordinate,
        gameSession,
    } from "../../../../stores/GameSessionStore";
    import type { Domain } from "../../../../types/Display";
    import { fade } from "svelte/transition";

    let svg;
    const pathCircleRadius = "0.5vmax";
    const highlightCircleRadius = "0.8vmax";
    
    
    const calcTickStep = (size: number): number => {
        if (size < 10) {
            return 2
        }
        const partial = size / 2.5;
        return Math.max(partial - (partial % 5), 5);
    };

    $: domain = getSessionDomain($gameSession.boardSideSize, $display);
    
    $: fontSize = 0.06 * $display.width;

    $: padding = {
        top: fontSize,
        right: fontSize * 3,
        bottom: fontSize * 2,
        left: fontSize * 2,
    };

    $: xScale = scaleLinear()
        .domain(domain.x)
        .range([padding.left, $display.width - padding.right]);

    $: yScale = scaleLinear()
        .domain(domain.y)
        .range([$halfHeight - padding.bottom, padding.top]);

    $: tickStep = Math.max(
        calcTickStep(domain.x[1]),
        calcTickStep(domain.y[1])
    );

    $: xTicks = rangeAroundZero(...domain.x, tickStep);

    $: yTicks = rangeAroundZero(...domain.y, tickStep);
</script>

<div class="graph-panel" in:fade={{delay: 300, duration: 300}} out:fade={{duration: 300}}>
    <svg bind:this={svg} class="svg-graph" id="graph">
        <!-- y axis -->
        <g class="axis horizontal-axis">
            {#each rangeAroundZero(...domain.y, Math.max(1, tickStep / 5)) as lineId}
                <g
                    class="tick tick-{lineId}"
                    transform="translate(0, {yScale(lineId)})"
                >
                    <line
                        x1={padding.left}
                        x2={xScale(domain.x[1])}
                        class:bold-tick={yTicks.indexOf(lineId) >= 0}
                    />
                    {#if yTicks.indexOf(lineId) >= 0}
                        <text
                            x={padding.left - fontSize * 0.4}
                            y="+{fontSize * 0.35}">{lineId}</text
                        >
                    {/if}
                </g>
            {/each}
        </g>

        <!-- x axis -->
        <g class="axis vertical-axis">
            {#each rangeAroundZero(...domain.x, Math.max(1, tickStep / 5)) as lineId}
                <g class="tick" transform="translate({xScale(lineId)},0)">
                    <line
                        y1={yScale(domain.y[0])}
                        y2={yScale(domain.y[1])}
                        class:bold-tick={xTicks.indexOf(lineId) >= 0}
                    />
                    {#if xTicks.indexOf(lineId) >= 0}
                        <text
                            x="-{fontSize * (lineId >= 0 ? 0 : 0.2)}"
                            y={$halfHeight - (padding.bottom - fontSize)}
                            >{lineId}</text
                        >
                    {/if}
                </g>
            {/each}
        </g>
        <g class="vertical-axis" transform="translate({xScale(0)},0)">
            <line
                y1={yScale(domain.y[0])}
                y2={yScale(domain.y[1])}
                class="cross-axis bold-tick"
            />
        </g>

        <g class="horizontal-axis" transform="translate(0,{yScale(0)})">
            <line
                x1={padding.left}
                x2={xScale(domain.x[1])}
                class="cross-axis bold-tick"
            />
        </g>

        <!-- data -->
        <!-- draw lines -->
        {#each $currentPath as crd, i}
            <g transition:fade={{ duration: 100 }}>
                {#if i > 0}
                    <line
                        x1={xScale($currentPath[i - 1].x)}
                        y1={yScale($currentPath[i - 1].y)}
                        x2={xScale(crd.x)}
                        y2={yScale(crd.y)}
                        class="path-vector"
                    />
                {/if}
            </g>
        {/each}

        <!-- draw circles -->
        {#each $currentPath as crd, i}
            <circle
                cx={xScale(crd.x)}
                cy={yScale(crd.y)}
                r={!$currentHover && i == $currentPath.length - 1
                    ? highlightCircleRadius
                    : pathCircleRadius}
                class="path-crd"
                class:current-crd={i == $currentPath.length - 1}
            />
            {#if !$currentHover && i == $currentPath.length - 1}
                <text
                    x={xScale(crd.x) + fontSize * 0.5}
                    y={yScale(crd.y) + fontSize}>({crd.x},{crd.y})</text
                >
            {/if}
        {/each}

        {#if $currentHover}
            <g in:fade={{ duration: 100 }}>
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
                    r={highlightCircleRadius}
                    class="hover-crd"
                />
                <text
                    x={xScale($currentHover.x) + fontSize * 0.5}
                    y={yScale($currentHover.y) + fontSize}
                    >({$currentHover.x},{$currentHover.y})</text
                >
            </g>
        {/if}

        <circle
            cx={xScale($gameSession.targetCoordinate.x)}
            cy={yScale($gameSession.targetCoordinate.y)}
            r={highlightCircleRadius}
            class="target-crd"
        />
    </svg>
</div>
