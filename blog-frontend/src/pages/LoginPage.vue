<template>
    <div class="fullscreen bg-blue-1 flex flex-center">
      <q-card class="login-card">
        <q-card-section class="text-center">
          <div class="text-h5 q-mb-md">Blog Management</div>
          <div class="text-subtitle2">Login to your account</div>
        </q-card-section>
  
        <q-separator />
  
        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-input
              v-model="email"
              label="Email"
              type="email"
              :rules="[val => !!val || 'Email is required']"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
  
            <q-input
              v-model="password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              :rules="[val => !!val || 'Password is required']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
  
            <div class="q-mt-lg">
              <q-btn 
                class="full-width" 
                color="primary" 
                label="Login" 
                type="submit" 
                :loading="loading"
              />
            </div>
            <div class="text-center q-mt-sm">
  Don't have an account? 
  <q-btn flat color="primary" label="Sign Up" to="/signup" />
</div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'
  import { api } from 'src/boot/axios'
  
  const $q = useQuasar()
  const router = useRouter()
  const isPwd = ref(true)
  const loading = ref(false)
  
  const email = ref('')
  const password = ref('')
  
  const onSubmit = async () => {
    loading.value = true
    
    try {
      const response = await api.post('/login', {
        email: email.value,
        password: password.value
      })
      
      // Store the token in localStorage
      localStorage.setItem('auth_token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      // Redirect to blogs page
      router.push('/blogs')
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
        icon: 'warning'
      })
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .login-card {
    width: 400px;
    max-width: 90vw;
  }
  </style>