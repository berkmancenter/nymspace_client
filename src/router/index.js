import { createRouter, createWebHistory } from 'vue-router'

import PagesLayout from '@/layouts/Pages'
import TalkLayout from '@/layouts/Talk/Index'
import Home from '@/components/Home/Index'
import Talk from '@/components/Talk/Index'
import NewTopic from '@/components/Topics/NewTopic/Index'
import PageNotFound from '@/components/PageNotFound/Index'

const routes = [
  {
    path: '/',
    component: PagesLayout,
    children: [
      {
        path: '',
        name: 'home.index',
        meta: {
          title: 'Nymity - simple, anonymous discussion tool',
          metaTags: [
            {
              name: 'description',
              content: 'home description',
            },
            {
              property: 'og:description',
              content: 'home description',
            },
          ],
        },
        component: Home,
      },
    ],
  },
  {
    path: '/t',
    component: TalkLayout,
    children: [
      {
        path: '',
        name: 'app.index',
        meta: {
          title: 'Nymity - simple, anonymous discussion tool',
          metaTags: [
            {
              name: 'description',
              content: 'home description',
            },
            {
              property: 'og:description',
              content: 'home description',
            },
          ],
        },
        component: Talk,
      },
    ],
  },
  {
    path: '/topics',
    component: TalkLayout,
    children: [
      {
        path: 'new',
        name: 'topics.new.index',
        meta: {
          title: 'Nymity - simple, anonymous discussion tool',
          metaTags: [
            {
              name: 'description',
              content: 'home description',
            },
            {
              property: 'og:description',
              content: 'home description',
            },
          ],
        },
        component: NewTopic,
      },
    ],
  },
  {
    path: '/404',
    name: 'pagenotfound.index',
    meta: {
      title: 'Nymity - 404',
      metaTags: [
        {
          name: 'description',
          content: 'page not found',
        },
        {
          property: 'og:description',
          content: 'page not found',
        },
      ],
    },
    component: PagesLayout,
    children: [
      {
        path: '/',
        name: '404.index',
        meta: {
          title: 'Nymity - simple, anonymous discussion tool',
          metaTags: [
            {
              name: 'description',
              content: 'home description',
            },
            {
              property: 'og:description',
              content: 'home description',
            },
          ],
        },
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
