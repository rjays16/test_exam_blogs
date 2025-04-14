<template>
    <div class="fullscreen bg-blue-1 flex flex-center">
      <q-card class="signup-card">
        <q-card-section class="text-center">
          <div class="text-h5 q-mb-md">Blog Management</div>
          <div class="text-subtitle2">Create a new account</div>
        </q-card-section>
  
        <q-separator />
  
        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-input
              v-model="name"
              label="Full Name"
              :rules="[val => !!val || 'Full name is required']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
  
            <q-input
              v-model="email"
              label="Email"
              type="email"
              :rules="[
                val => !!val || 'Email is required',
                val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Please enter a valid email'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
  
            <q-input
              v-model="password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
                val => !!val || 'Password is required',
                val => val.length >= 8 || 'Password must be at least 8 characters'
              ]"
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
  
            <q-input
              v-model="passwordConfirmation"
              label="Confirm Password"
              :type="isPwdConfirm ? 'password' : 'text'"
              :rules="[
                val => !!val || 'Password confirmation is required',
                val => val === password || 'Passwords do not match'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdConfirm = !isPwdConfirm"
                />
              </template>
            </q-input>
  
            <div class="q-mt-lg">
              <q-btn 
                class="full-width" 
                color="primary" 
                label="Sign Up" 
                type="submit" 
                :loading="loading"
              />
            </div>
  
            <div class="text-center q-mt-sm">
              Already have an account? 
              <q-btn flat color="primary" label="Login" to="/login" />
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
  const loading = ref(false)
  const isPwd = ref(true)
  const isPwdConfirm = ref(true)
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  
  const onSubmit = async () => {
  loading.value = true
  
  console.log('Submitting form with data:', {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value
  })
  
  try {
    const response = await api.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    
    console.log('Registration successful:', response.data)
    
    // Store the token in localStorage
    localStorage.setItem('auth_token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    $q.notify({
      color: 'positive',
      message: 'Account created successfully!',
      icon: 'check_circle'
    })
    
    // Redirect to blogs page
    router.push('/blogs')
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    
    const errorMessage = error.response?.data?.errors 
      ? Object.values(error.response.data.errors).flat().join('\n') 
      : error.response?.data?.message || 'Registration failed'
      
      if ($q.notify) {
        $q.notify({
          color: 'negative',
          message: errorMessage,
          icon: 'warning'
        })
      } else {
        // Fallback if notify isn't available
        alert(errorMessage)
        console.error('Notification error: $q.notify is not available')
      }
    } finally {
      loading.value = false
  }
}
  </script>
  
  <style scoped>
  .signup-card {
    width: 400px;
    max-width: 90vw;
  }
  </style>