<script lang="ts">
    export let text: string;
    export let widthPrecentage: number = 30;
    export let heightPercentage: number = 90;
    export let isEnabled: boolean = true;
    export let onHover: () => void = null;
    export let onMouseLeave: () => void = null;
    export let onClick: () => void;

    let isActive = false;
    let setIsActive = (newValue: boolean) => () => {
        isActive = newValue;
    };
</script>

<div
    style="--widthPrecentage: {widthPrecentage}%; --heightPercentage: {heightPercentage}%"
    class="btn"
    on:mousedown={isEnabled && setIsActive(true)}
    on:touchstart={isEnabled &&
        (() => {
            setIsActive(true)();
            onHover();
        })}
    on:mouseup={isEnabled &&
        (() => {
            setIsActive(false)();
            onClick();
        })}
    on:mouseout={isEnabled && setIsActive(false)}
    on:mouseover={isEnabled && onHover}
    on:mouseleave={isEnabled && onMouseLeave}
    on:contextmenu|preventDefault={isEnabled &&
        (() => {
            onClick();
            setIsActive(false)();
        })}
    class:active={isActive}
    class:disabled={!isEnabled}
>
    {text}
</div>

<style src="./Button.scss"></style>
