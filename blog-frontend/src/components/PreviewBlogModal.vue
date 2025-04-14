<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 350px; max-width: 800px;">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ blog.title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-mb-md">
          <q-badge 
            :color="blog.status === 'published' ? 'positive' : 'warning'"
            class="q-mr-sm"
          >
            {{ blog.status }}
          </q-badge>
          <span class="text-caption">
            By {{ blog.user ? blog.user.name : 'Unknown' }} 
            on {{ formatDate(blog.created_at) }}
          </span>
        </div>
        
        <div class="blog-content q-pa-md">
          {{ blog.content }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
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
    blogData: {
      type: Object,
      default: () => ({
        title: '',
        content: '',
        status: 'hidden',
        created_at: null,
        user: null
      })
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
    },
    blog() {
      return this.blogData
    }
  },
  
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Unknown date'
      
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.blog-content {
  white-space: pre-wrap;
  line-height: 1.6;
  background-color: #f8f9fa;
  border-radius: 4px;
  min-height: 150px;
  max-height: 400px;
  overflow-y: auto;
}
</style>