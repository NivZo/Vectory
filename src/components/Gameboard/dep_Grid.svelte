<script lang="ts">
    import { display, halfHeight, isPortrait } from "../../stores/DisplayStore";

    export let grid = [4, 4];
    export let minAmount = 10;

    let colCount = 0,
        rowCount = 0,
        cellSideSize = 0,
        unit = "vh";

    display.subscribe((d) => {
        if (d) {
            if ($isPortrait) {
                rowCount = minAmount;
                unit = "vh";
                cellSideSize = 100 / rowCount - 0.25 * 2
                colCount = Math.floor(100 / cellSideSize);
                if (colCount % 2 != 0) {
                    colCount -= 1;
                }
            } else {
                colCount = minAmount;
                unit = "vw";
                cellSideSize = 100 / colCount - 0.25 * 2
                rowCount = Math.floor(100 / cellSideSize);
                if (rowCount % 2 != 0) {
                    rowCount -= 1;
                }
            }
        }
    });

    $: col = `repeat(${colCount}, ${cellSideSize}${unit})`;
    $: row = `repeat(${rowCount}, ${cellSideSize}${unit})`;
</script>

<div>
    rowCount: {rowCount}
    colCount: {colCount}
    cellSideSize: {cellSideSize}
    isPortrait: {$isPortrait}
    {$display?.width}x{$display?.height}
</div>
<div
    class="container"
    style="grid-template-rows: {row}; grid-template-columns: {col};"
>
    {#each { length: grid[0] } as _, i (i)}
        {#each { length: grid[1] } as _, j (j)}
            <div class={i == grid[0] / 2 ? "x-axis" : ""} />
        {/each}
    {/each}
</div>

<style>
    .container {
        display: grid;
        border: 0.25vmax solid #999;
        border-radius: 0.25vmax;
        width: 100%;
        height: 50%;
        grid-gap: 0.25vmax;
        background: #999;
    }

    .container div {
        background: #fff;
    }

    div.x-axis {
        background: orange;
        border-radius: 1%;
    }
</style>
