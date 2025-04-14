<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center">
        <div class="text-h6">Edit Blog</div>
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
import { api } from 'src/boot/axios'

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    blogId: {
      type: Number,
      default: null
    },
    blogData: {
      type: Object,
      default: () => ({})
    }
  },
  
  data() {
    return {
      form: {
        title: '',
        content: '',
        status: ''
      },
      loading: false,
      statusOptions: [
        { label: 'Published', value: 'published' },
        { label: 'Hidden', value: 'hidden' }
      ]
    }
  },
  
  computed: {
    isOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  
  watch: {
    blogData: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.id) {
          this.form = {
            title: newVal.title || '',
            content: newVal.content || '',
            status: newVal.status || 'hidden'
          }
        }
      }
    }
  },
  
  methods: {
    async onSubmit() {
      // Validate form
      if (!this.form.title || !this.form.content) {
        this.$q.notify({
          color: 'negative',
          message: 'Please fill in all required fields',
          icon: 'warning'
        })
        return
      }
      
      this.loading = true
      
      try {
        // Make the actual API call to update the blog
        await api.put(`/blogs/${this.blogId}`, this.form)
        
        this.$q.notify({
          color: 'positive',
          message: 'Blog updated successfully',
          icon: 'check_circle',
          badgeColor: ''
        })
        

        this.isOpen = false
      } catch (error) {
        console.error('Failed to update blog:', error)
        
        this.$q.notify({
          color: 'negative',
          message: error.response?.data?.message || 'Failed to update blog',
          icon: 'warning'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>