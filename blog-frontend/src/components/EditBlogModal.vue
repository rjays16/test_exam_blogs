<template>
    <q-dialog v-model="isOpen" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Edit Blog</div>
        </q-card-section>
  
        <q-separator />
  
        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.title"
              label="Title"
              :rules="[val => !!val || 'Title is required']"
            />
            
            <q-editor
              v-model="form.content"
              min-height="250px"
              :rules="[val => !!val || 'Content is required']"
            />
            
            <q-select
              v-model="form.status"
              :options="statusOptions"
              label="Status"
            />
          </q-form>
        </q-card-section>
  
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="onSubmit" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      blog: {
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
      blog: {
        immediate: true,
        handler(newVal) {
          if (newVal && newVal.id) {
            this.form = {
              title: newVal.title,
              content: newVal.content,
              status: newVal.status
            }
          }
        }
      }
    },
    
    methods: {
      onSubmit() {
        this.loading = true
        
        this.$emit('update', {
          id: this.blog.id,
          ...this.form
        })
        
        this.loading = false
        this.isOpen = false
      }
    }
  }
  </script>