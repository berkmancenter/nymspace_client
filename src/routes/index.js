import HomePageLayout from "../layout/HomePageLayout.vue";
import LoginPage from "../views/LoginPage.vue";
import ResetPassword from "../views/ResetPassword.vue";
import CreateAccountPage from "../views/CreateAccountPage.vue";
import LandingPageLayout from "../layout/LandingPageLayout.vue";
import ThreadsPage from "../views/ThreadsPage.vue";
import MessagesPage from "../views/MessagesPage.vue";
import LandingPage from "../views/LandingPage.vue";
import NotFound from "../views/NotFound.vue";

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
            path: "channels/:channelId?",
            name: "home.channels",
            component: ThreadsPage,
            children: [
              {
                path: "threads/:threadId?",
                name: "home.threads",
                component: MessagesPage,
              },
            ],
          },
        ],
      },
      {
        path: "login",
        name: "home.login",
        component: LoginPage,
      },
      {
        path: "reset",
        name: "home.reset",
        component: ResetPassword,
      },
      {
        path: "create-account",
        name: "home.createAccount",
        component: CreateAccountPage,
      },
    ],
  },
  // will match everything and put it under `$route.params.pathMatch`
  {
    path: "/:pathMatch(.*)*",
    name: "not.found.layout",
    component: HomePageLayout,
    children: [
      {
        path: "",
        name: "not.found",
        component: NotFound,
      },
    ],
  },
];
