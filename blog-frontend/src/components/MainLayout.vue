<template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
  
          <q-toolbar-title>
            Blog Management
          </q-toolbar-title>
  
          <div v-if="authStore.isAuthenticated">
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar.png">
            </q-avatar>
            <q-btn flat dense icon="logout" @click="logout" label="Logout" />
          </div>
        </q-toolbar>
      </q-header>
  
      <q-drawer
        v-if="authStore.isAuthenticated"
        v-model="leftDrawerOpen"
        show-if-above
        bordered
      >
        <q-list>
          <q-item-label
            header
          >
            Navigation
          </q-item-label>
  
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-drawer>
  
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from 'src/stores/auth'
  import EssentialLink from 'components/EssentialLink.vue'
  
  const linksList = [
    {
      title: 'Dashboard',
      caption: 'Overview',
      icon: 'dashboard',
      link: '/'
    },
    {
      title: 'Blogs',
      caption: 'Manage blog posts',
      icon: 'article',
      link: '/blogs'
    }
  ]
  
  export default defineComponent({
    name: 'MainLayout',
  
    components: {
      EssentialLink
    },
  
    setup () {
      const leftDrawerOpen = ref(false)
      const router = useRouter()
      const authStore = useAuthStore()
  
      const toggleLeftDrawer = () => {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
  
      const logout = async () => {
        await authStore.logout()
        router.push('/login')
      }
  
      return {
        essentialLinks: linksList,
        leftDrawerOpen,
        toggleLeftDrawer,
        authStore,
        logout
      }
    }
  })
  </script>