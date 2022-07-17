import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

const assetFileNames = "game-assets/[name]-[hash]"

export default defineConfig({
	plugins: [viteSingleFile({})],
	build: {
		rollupOptions: {
			output: {
				assetFileNames: assetFileNames + "[extname]",
				chunkFileNames: assetFileNames + ".js",
				entryFileNames: assetFileNames + ".js",
			},
		},
	},
	envDir: "../common/env",
	envPrefix: "GAME_",
})
