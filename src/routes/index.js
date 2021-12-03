import HomePageLayout from "../layout/HomePageLayout.vue";
import LoginPage from "../views/LoginPage.vue";
import CreateAccountPage from "../views/CreateAccountPage.vue";
import LandingPageLayout from "../layout/LandingPageLayout.vue";
import ChannelsPage from "../views/ChannelsPage.vue";
import ThreadsPage from "../views/ThreadsPage.vue";
import LandingPage from "../views/LandingPage.vue";

export default [
  {
    path: "/",
    name: "home.layout",
    component: HomePageLayout,
    children: [
      {
        path: "",
        name: "home.landing.layout",
        component: LandingPageLayout,
        children: [
          {
            path: "",
            name: "home.featured",
            component: LandingPage,
          },
          {
            path: "channels/:channel?",
            name: "home.channels",
            component: ChannelsPage,
          },
          {
            path: "threads/:channel?/:thread?",
            name: "home.threads",
            component: ThreadsPage,
          },
        ],
      },
      {
        path: "login",
        name: "home.login",
        component: LoginPage,
      },
      {
        path: "create-account",
        name: "home.createAccount",
        component: CreateAccountPage,
      },
    ],
  },
];
