<template>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add New Blog Post</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
  
        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.title"
              label="Title"
              :rules="[val => !!val || 'Title is required']"
            />
  
            <q-input
              v-model="form.content"
              type="textarea"
              label="Content"
              rows="6"
              :rules="[val => !!val || 'Content is required']"
            />
  
            <q-select
              v-model="form.status"
              :options="statusOptions"
              label="Status"
              :rules="[val => !!val || 'Status is required']"
            />
  
            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup />
              <q-btn 
                label="Create" 
                type="submit" 
                color="primary" 
                :loading="blogStore.loading"
                class="q-ml-sm" 
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useBlogStore } from 'src/stores/blog'
  import { useQuasar } from 'quasar'
  
  const $q = useQuasar()
  const blogStore = useBlogStore()
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const form = ref({
    title: '',
    content: '',
    status: 'hidden'
  })
  
  const statusOptions = [
    { label: 'Published', value: 'published' },
    { label: 'Hidden', value: 'hidden' }
  ]
  
  const showDialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const resetForm = () => {
    form.value = {
      title: '',
      content: '',
      status: 'hidden'
    }
  }
  
  const onSubmit = async () => {
    try {
      await blogStore.createBlog(form.value)
      showDialog.value = false
      resetForm()
      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Blog post created successfully',
        icon: 'check_circle'
      })
    } catch (error) {
      $q.notify({
        color: 'negative',
        position: 'top',
        message: error.response?.data?.message || 'Failed to create blog post',
        icon: 'warning'
      })
    }
  }
  </script>