<script lang="ts">
    import "./Button.scss";
    
    export let text: string;
    export let widthPrecentage: number = 30;
    export let heightPercentage: number = 90;
    export let isEnabled: boolean = true;
    export let onHover: () => void = null;
    // export let onMouseLeave: () => void = null;
    export let onClick: () => void;
</script>

<button
    style="--widthPrecentage: {widthPrecentage}%; --heightPercentage: {heightPercentage}%"
    class="btn"
    on:touchstart={isEnabled && onHover}
    on:mouseover={isEnabled && onHover}
    on:click={isEnabled && onClick}
    on:contextmenu|preventDefault={isEnabled && onClick}
    class:disabled={!isEnabled}
    disabled={!isEnabled}
>
    {text}
</button>

