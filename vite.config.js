import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
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
});
