const routes = [
  {
    path: '/MainLayout',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '/home', 
        name: 'home',
        component: () => import('pages/IndexPage.vue') 
      }
    ]
  },
  {
    path: '/',
    name: 'login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('pages/SignupPage.vue')
  },
  {
    path: '/blogs',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'blogs',
        component: () => import('pages/BlogsPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes