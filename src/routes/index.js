// Lazy loading of the components
const HomePageLayout = () => import('../layout/HomePageLayout.vue')
const LoginPage = () => import('../views/LoginPage.vue')
const ResetPassword = () => import('../views/ResetPassword.vue')
const ForgotPassword = () => import('../views/ForgotPassword.vue')
const CreateAccountPage = () => import('../views/CreateAccountPage.vue')
const LandingPageLayout = () => import('../layout/LandingPageLayout.vue')
const ChannelPage = () => import('../views/ChannelPage.vue')
const ThreadPage = () => import('../views/ThreadPage.vue')
const LandingPage = () => import('../views/LandingPage.vue')
const NotFound = () => import('../views/NotFound.vue')
const PollPage = () => import('../views/PollPage.vue')

export default [
  {
    path: import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : '',
    name: 'home.layout',
    component: HomePageLayout,
    children: [
      {
        path: '',
        name: 'home.landing.layout',
        component: LandingPageLayout,
        children: [
          {
            path: '',
            name: 'home.channelspage',
            component: LandingPage
          },
          {
            path: 'channels/:channelId?',
            name: 'home.channels',
            component: ChannelPage,
            children: [
              {
                path: 'threads/:threadId?',
                name: 'home.threads',
                component: ThreadPage
              },
              {
                path: 'polls/:pollId?',
                name: 'home.polls',
                component: PollPage
              }
            ]
          }
        ]
      },
      {
        path: 'login',
        name: 'home.login',
        component: LoginPage
      },
      {
        path: 'reset',
        name: 'home.reset',
        component: ForgotPassword
      },
      {
        path: 'reset-password',
        name: 'home.reset.password',
        component: ResetPassword,
        props: (route) => ({ token: route.query.token })
      },
      {
        path: 'create-account',
        name: 'home.createAccount',
        component: CreateAccountPage
      }
    ]
  },
  // will match everything and put it under `$route.params.pathMatch`
  {
    path: '/:pathMatch(.*)*',
    name: 'not.found.layout',
    component: HomePageLayout,
    children: [
      {
        path: '',
        name: 'not.found',
        component: NotFound
      }
    ]
  }
]
