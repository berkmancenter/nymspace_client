import { createRouter, createWebHistory } from 'vue-router'

import { VueCookieNext } from 'vue-cookie-next'

import PagesLayout from '@/layouts/Pages'
import TalkLayout from '@/layouts/Talk/Index'
import SideMenuTalk from '@/layouts/Talk/SideMenu'
import Login from '@/components/Login/Index'
import Home from '@/components/Home/Index'
import Talk from '@/components/Talk/Index'
import NewTopic from '@/components/Topics/NewTopic/Index'
import Topic from '@/components/Topics/Topic/Index'
import NewThread from '@/components/Threads/NewThread/Index'
import Thread from '@/components/Threads/Thread/Index'
import PageNotFound from '@/components/PageNotFound/Index'

const routes = [
  {
    path: '/',
    components: {
      layoutContent: PagesLayout,
    },
    children: [
      {
        path: '',
        name: 'home.index',
        component: Home,
      },
      {
        path: 'login',
        name: 'login.index',
        component: Login,
      },
    ],
  },
  {
    path: '/t',
    components: {
      layoutContent: TalkLayout,
      sidebar: SideMenuTalk,
    },
    children: [
      {
        path: '',
        name: 'talk.index',
        component: Talk,
      },
      {
        path: ':topicId',
        name: 'topic.index',
        component: Topic,
      },
      {
        path: 'new',
        name: 'topics.new.index',
        component: NewTopic,
      },
      {
        path: 't/:threadId',
        name: 'thread.index',
        component: Thread,
      },
      {
        path: 't/new/:topicId',
        name: 'threads.new.index',
        component: NewThread,
      },
    ],
  },
  {
    path: '/404',
    name: 'pagenotfound.index',
    component: PagesLayout,
    children: [
      {
        path: '/',
        name: '404.index',
        component: PageNotFound,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const allowedViews = ['home.index', 'login.index']
  const tokenExists = VueCookieNext.getCookie('user_access_token')

  if (tokenExists && to.name === 'login.index') {
    next({ name: 'talk.index' })
  }

  if (!allowedViews.includes(to.name) && !VueCookieNext.getCookie('user_access_token')) {
    next({ name: 'login.index' })
  } else {
    next()
  }
})

export default router
