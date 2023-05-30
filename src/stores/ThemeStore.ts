import { writable } from 'svelte/store';
import type { Theme } from '../types/Theme';

const createTheme = () => {
    const { subscribe, set } = writable<Theme>();

    return {
        subscribe,
        set,
    };
};

export const theme = createTheme();