// Lazy loading of the components
const HomePageLayout = () => import("../layout/HomePageLayout.vue");
const LoginPage = () => import("../views/LoginPage.vue");
const ResetPassword = () => import("../views/ResetPassword.vue");
const ForgotPassword = () => import("../views/ForgotPassword.vue");
const CreateAccountPage = () => import("../views/CreateAccountPage.vue");
const LandingPageLayout = () => import("../layout/LandingPageLayout.vue");
const ThreadsPage = () => import("../views/ThreadsPage.vue");
const MessagesPage = () => import("../views/MessagesPage.vue");
const LandingPage = () => import("../views/LandingPage.vue");
const NotFound = () => import("../views/NotFound.vue");

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
        component: ForgotPassword,
      },
      {
        path: "reset-password",
        name: "home.reset.password",
        component: ResetPassword,
        props: (route) => ({ token: route.query.token }),
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
