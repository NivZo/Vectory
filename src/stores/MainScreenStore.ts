import { writable } from 'svelte/store';
import type { MainScreenMode } from '../types/MainScreen';

const createMainScreen = () => {
    const { subscribe, set, update } = writable<MainScreenMode>("menu");

    return {
        subscribe,
        toNextScreen: () => update(curr => {
            switch (curr) {
                case "menu":
                    return "graph";
                case "graph":
                    return "victory";
                case "victory":
                    return "menu";
            }
        }),
        toMenu: () => set("menu"),
        toGraph: () => set("graph"),
        toVictory: () => set("victory"),
        set,
    };
};

export const mainScreen = createMainScreen();