<script lang="ts">
    export let text: string;
    export let widthPrecentage: number = 30;
    export let heightPercentage: number = 50;
    export let isEnabled: boolean = true;
    export let onHover: () => void = null;
    export let onMouseLeave: () => void = null;
    export let onClick: () => void;

    let isActive = false;
    let setIsActive = (newValue: boolean) => () => {
        isActive = newValue;
    }
</script>

<div
    style="--widthPrecentage: {widthPrecentage}%; --heightPercentage: {heightPercentage}%"
    class="btn"
    on:mousedown={isEnabled && setIsActive(true)}
    on:mouseup={isEnabled && setIsActive(false)}
    on:mouseout={isEnabled && setIsActive(false)}
    on:click={isEnabled && onClick}
    on:mouseover={isEnabled && onHover}
    on:mouseleave={isEnabled && onMouseLeave}
    class:active={isActive}
    class:disabled={!isEnabled}
>
    {text}
</div>

<style src="./Button.scss"></style>