
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/vue',
      name: 'home',
      component: HomeView
    },
    {
      path: '/vue/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/vue/workspace',
      name: 'workspace',
      component: () => import('../views/WorkspaceView.vue')
    },
    {
      path: '/vue/notes',
      name: 'notes',
      component: () => import('../views/NotesView.vue')
    },
    {
      path: '/vue/personal',
      name: 'personal',
      component: () => import('../views/PersonalView.vue')
    },
    {
      path: '/vue/todos',
      name: 'todos',
      component: () => import('../views/TodosView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router
