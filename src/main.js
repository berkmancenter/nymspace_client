import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import routes from "./routes";
import { createRouter, createWebHistory } from "vue-router";
import { VueCookieNext } from "vue-cookie-next";

const app = createApp(App);

VueCookieNext.config({ expire: "1y" });
app.use(VueCookieNext);

const router = createRouter({
  history: createWebHistory(),
  routes,
});
app.use(router);

app.mount("#app");
