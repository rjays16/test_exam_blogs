const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '/', 
        name: 'home',
        component: () => import('pages/HomePage.vue'),
        meta: { requiresAuth: true }, 
      }
    ]
  },
  {
    path: '/login',
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
  
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes