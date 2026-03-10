import { defineConfig } from "vite";

import { assetpackPlugin } from "./scripts/assetpack-vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [assetpackPlugin()],
  server: {
    port: 8080,
    open: true,
  },
  resolve:{
    alias:{
      "@": "/src",
    }
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
