<template>
    <q-page padding>
      <div class="row q-mb-md">
        <div class="col">
          <div class="text-h5">Blog Management</div>
        </div>
        <div class="col text-right">
          <q-btn color="primary" label="Add Blog" icon="add" @click="showAddModal = true" />
        </div>
      </div>
      
      <q-card>
        <q-card-section>
          <q-input
            v-model="search"
            debounce="300"
            filled
            placeholder="Search blogs by title"
            @update:model-value="onSearch"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>
        
        <q-separator />
        
        <q-table
          :rows="blogs"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="onRequest"
          binary-state-sort
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="title" :props="props">
                {{ props.row.title }}
              </q-td>
              <q-td key="status" :props="props">
                <q-chip 
                  :color="props.row.status === 'published' ? 'green' : 'grey'" 
                  text-color="white"
                  size="sm"
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
              <q-td key="created_by" :props="props">
                {{ props.row.user ? props.row.user.name : 'Unknown' }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ new Date(props.row.created_at).toLocaleDateString() }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn-dropdown flat color="primary" label="Actions">
                  <q-list>
                    <q-item clickable v-close-popup @click="editBlog(props.row)">
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                    
                    <q-item clickable v-close-popup @click="toggleStatus(props.row)">
                      <q-item-section avatar>
                        <q-icon :name="props.row.status === 'published' ? 'visibility_off' : 'visibility'" />
                      </q-item-section>
                      <q-item-section>
                        {{ props.row.status === 'published' ? 'Hide' : 'Publish' }}
                      </q-item-section>
                    </q-item>
                    
                    <q-item clickable v-close-popup @click="previewBlog(props.row)">
                      <q-item-section avatar>
                        <q-icon name="preview" />
                      </q-item-section>
                      <q-item-section>Preview</q-item-section>
                    </q-item>
                    
                    <q-item clickable v-close-popup @click="confirmArchive(props.row.id)">
                      <q-item-section avatar>
                        <q-icon name="archive" />
                      </q-item-section>
                      <q-item-section>Archive</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-td>
            </q-tr>
          </template>
          
          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey-8">
              <q-icon name="sentiment_dissatisfied" size="2em" />
              <span class="q-ml-sm">No blogs found</span>
            </div>
          </template>
        </q-table>
      </q-card>
      
      <!-- Modals -->
      <add-blog-modal 
      v-model="showAddModal" 
      @blog-added="loadBlogs"
      />
      
      <edit-blog-modal 
        v-model="showEditModal" 
        :blog-id="selectedBlog?.id" 
        :blog-data="selectedBlog" 
      />
      
      <preview-blog-modal 
        v-model="showPreviewModal" 
        :blog-id="selectedBlog?.id" 
        :blog-data="selectedBlog" 
      />
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useQuasar } from 'quasar'
  import { api } from 'src/boot/axios'
  import AddBlogModal from 'components/AddBlogModal.vue'
  import EditBlogModal from 'components/EditBlogModal.vue'
  import PreviewBlogModal from 'components/PreviewBlogModal.vue'
  
  const $q = useQuasar()
  const search = ref('')
  const blogs = ref([])
  const loading = ref(false)
  const showAddModal = ref(false)
  const showEditModal = ref(false)
  const showPreviewModal = ref(false)
  const selectedBlog = ref(null)
  
  const pagination = computed(() => ({
  sortBy: 'id',
  descending: true,
  page: blogs.value.length > 0 ? blogs.value[0].current_page : 1,
  rowsPerPage: 10,
  rowsNumber: blogs.value.length > 0 ? blogs.value[0].total : 0
}))
  
  const columns = [
    { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'left' },
    { name: 'title', label: 'Title', field: 'title', sortable: true, align: 'left' },
    { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
    { name: 'created_by', label: 'Created By', field: row => row.user?.name || 'Unknown', sortable: true, align: 'left' },
    { name: 'created_at', label: 'Created Date', field: 'created_at', sortable: true, align: 'left' },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
  ]
  
  onMounted(() => {
    loadBlogs()
  })
  
  const loadBlogs = async () => {
  loading.value = true
  try {
    const params = { 
      page: 1, // Always load the first page after adding a new blog
      search: search.value
    }
    
    const response = await api.get('/blogs', { params })
    blogs.value = response.data.data || response.data // Handle both paginated and non-paginated responses
    
    // Update pagination if using paginated response
    if (response.data.current_page) {
      pagination.value.page = response.data.current_page
      pagination.value.rowsNumber = response.data.total
      pagination.value.rowsPerPage = response.data.per_page
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load blogs',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
  
  const onRequest = (props) => {
    loadBlogs(props.pagination.page)
  }
  
  const onSearch = () => {
    loadBlogs(1) // Reset to first page when searching
  }
  
  const editBlog = (blog) => {
    selectedBlog.value = blog
    showEditModal.value = true
  }
  
  const previewBlog = (blog) => {
    selectedBlog.value = blog
    showPreviewModal.value = true
  }
  
  const toggleStatus = async (blog) => {
    const newStatus = blog.status === 'published' ? 'hidden' : 'published'
    try {
      await api.patch(`/blogs/${blog.id}/status`, { status: newStatus })
      
      // Update local state
      const index = blogs.value.findIndex(b => b.id === blog.id)
      if (index !== -1) {
        blogs.value[index].status = newStatus
      }
      
      $q.notify({
        color: 'positive',
        message: `Blog ${newStatus === 'published' ? 'published' : 'hidden'} successfully`,
        icon: 'check_circle'
      })
    } catch (error) {
        console.error('Failed to update status:', error) // Log the error
      $q.notify({
        color: 'negative',
        message: 'Failed to update blog status',
        icon: 'warning'
      })
    }
  }
  
  const confirmArchive = (blogId) => {
  // Use $q.dialog() method correctly
  $q.dialog({
    title: 'Confirm Archive',
    message: 'Are you sure you want to archive this blog post?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/blogs/${blogId}`)
      
      // Remove from local state
      blogs.value = blogs.value.filter(blog => blog.id !== blogId)
      
      $q.notify({
        color: 'positive',
        message: 'Blog archived successfully',
        icon: 'check_circle'
      })
    } catch (error) {
      console.error('Failed to archive blog:', error)
      $q.notify({
        color: 'negative',
        message: 'Failed to archive blog',
        icon: 'warning'
      })
    }
  })
}
  </script>