import { defineConfig } from "vite"

const assetFileNames = "game-assets/[name]-[hash]"

export default defineConfig({
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
	envPrefix: "WS_",
})
