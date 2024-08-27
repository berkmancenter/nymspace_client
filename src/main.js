import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import routes from "./routes";
import { createRouter, createWebHistory } from "vue-router";
import { VueCookieNext } from "vue-cookie-next";
import navigationGuard from "./plugins/navigationGuard";
import linkify from "vue-linkify";

const app = createApp(App);
app.directive("linkified", linkify);

VueCookieNext.config({ expire: "30d" });
app.use(VueCookieNext);

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach(navigationGuard);
app.use(router);

app.mount("#app");
