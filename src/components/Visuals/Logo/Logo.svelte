<script lang="ts">
    import "./Logo.scss";
    import { fade } from "svelte/transition";
</script>

<svg
    id="vectory-logo"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 300 300"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
    style="background-color:transparent"
    ><g transform="matrix(1.699262 0 0 1.699262-98.847786-66.61613)"
        ><text
            id="logo-ectory"
            dx="0"
            dy="0"
            font-family="&quot;eAZkWzVF2GR1:::Urbanist&quot;"
            font-size="32"
            font-weight="400"
            transform="translate(138 135)"
            fill="#444850"
            stroke-width="0"
            in:fade={{ duration: 1000, delay: 500 }}
        >
            <tspan y="0" font-weight="400" stroke-width="0">
                ectory
            </tspan></text
        >
        <text
            id="logo-v"
            dx="0"
            dy="0"
            font-family="&quot;eAZkWzVF2GR1:::Urbanist&quot;"
            font-size="72"
            font-weight="400"
            transform="translate(75 150)"
            fill="#444850"
            stroke-width="0"
            in:fade={{ duration: 800, delay: 200 }}
        >
            <tspan y="0" font-weight="400" stroke-width="0"> V </tspan>
        </text>

        <path id="logo-frame" d="" fill="none" stroke="#3f5787" stroke-width="0.6" /><path
            d="M134.598397,120v-28.505543h-72.098397v72.009123h28.571612"
            fill="none"
            stroke="#444850"
            stroke-width="3"
            in:fade={{ duration: 500, delay: 0 }}
        /></g
    >
</svg>
