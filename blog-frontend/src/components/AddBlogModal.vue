<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center">
        <div class="text-h6">Create New Blog</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.title"
            label="Title"
            :rules="[val => !!val || 'Title is required']"
            outlined
          />
          
          <q-editor
            v-model="form.content"
            min-height="250px"
            :rules="[val => !!val || 'Content is required']"
          />
          
          <q-select
            v-model="form.status"
            :options="statusOptions"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="Status"
            outlined
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn flat label="Save" color="primary" @click="onSubmit" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'blog-added'],
  
  setup(props, { emit }) {
    const $q = useQuasar();
    
    const loading = ref(false);
    
    const form = ref({
      title: '',
      content: '',
      status: 'hidden'
    });
    
    const statusOptions = [
      { label: 'Published', value: 'published' },
      { label: 'Hidden', value: 'hidden' }
    ];
    
    const isOpen = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    });
    
    const resetForm = () => {
      form.value = {
        title: '',
        content: '',
        status: 'hidden'
      };
    };
    
    const onSubmit = async () => {
      if (!form.value.title || !form.value.content) {
        $q.notify({
          color: 'negative',
          message: 'Please fill in all required fields',
          icon: 'warning'
        });
        return;
      }
      
      loading.value = true;
      
      // Create a request payload with proper format
      const payload = {
        title: form.value.title,
        content: form.value.content,
        status: form.value.status 
  };
  
  try {
    await api.post('/blogs', payload);
    $q.notify({
      color: 'positive',
      message: 'Blog created successfully',
      icon: 'check_circle'
    });
    
    resetForm();
    isOpen.value = false;
    
    emit('blog-added');
  } catch (error) {
    console.error('Failed to create blog:', error);
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Failed to create blog. Please try again.',
      icon: 'warning'
    });
  } finally {
    loading.value = false;
  }
};
    
    return {
      isOpen,
      form,
      loading,
      statusOptions,
      onSubmit
    };
  }
}
</script>