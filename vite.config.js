import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Grouping components of home page on single file
            "home-page": [
              "./src/layout/HomePageLayout.vue",
              "./src/layout/LandingPageLayout.vue",
              "./src/components/Shared/Modal.vue",
              "./src/views/LandingPage.vue",
              "./src/components/Banner/LoggedInBanner.vue",
            ],
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    base: env.VITE_PATH ? env.VITE_PATH : "/",
  };
});
