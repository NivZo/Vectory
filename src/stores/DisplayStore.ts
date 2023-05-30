import { derived, writable } from 'svelte/store';
import type { Display } from '../types/Display';

const createDisplay = () => {
    const { subscribe, set } = writable<Display>({
        height: 1,
        width: 1,
    });

    return {
        subscribe,
        set,
    };
}

export const display = createDisplay();
export const isPortrait = derived(
    display,
    $display => $display ? 
        ($display.height / 2) > $display.width : false,
)
export const halfHeight = derived(
    display,
    $display => $display ? $display.height / 2 : 0
)