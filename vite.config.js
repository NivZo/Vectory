import { defineConfig } from "vite";

import {svelte} from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    base: "/Vectory/",
    plugins: [svelte({
        onwarn: (warning, handler) => {
            if (warning.code.includes("a11y")) return
            handler(warning);
        }
    })],
})