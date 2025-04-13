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
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore()

const $q = useQuasar()
const router = useRouter()
const isPwd = ref(true)
const loading = ref(false)

const email = ref('')
const password = ref('')

const onSubmit = async () => {
  loading.value = true
  
  try {
    console.log('Login attempt with:', { email: email.value, password: password.value })
    
    // Check if credentials meet requirements (min 8 chars for password)
    if (password.value.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }
    
    // Don't assign to a variable if you don't use it
    await authStore.login({
      email: email.value,
      password: password.value
    })
    
    console.log('Login successful, redirecting to blogs')
    router.push('/blogs')
  } catch (error) {
    console.error('Login error:', error)
    
    let errorMessage = 'Login failed. Please check your credentials.'
    
    if (error.message && error.message.includes('Password must be')) {
      errorMessage = error.message
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.errors) {
      errorMessage = Array.isArray(error.response.data.errors) 
        ? error.response.data.errors[0] 
        : Object.values(error.response.data.errors)[0]
    }
    
    $q.notify({
      color: 'negative',
      message: errorMessage,
      icon: 'warning',
      position: 'top',
      timeout: 3000
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