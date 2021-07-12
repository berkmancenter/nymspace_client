import { createRouter, createWebHistory } from 'vue-router'

import PagesLayout from '@/layouts/Pages'
import TalkLayout from '@/layouts/Talk/Index'
import SideMenuTalk from '@/layouts/Talk/SideMenu'
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
        name: 'app.index',
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

export default router
