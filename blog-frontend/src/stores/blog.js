import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    blogs: [],
    blog: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      lastPage: 1,
      perPage: 10,
      total: 0
    }
  }),

  getters: {
    getBlogs: (state) => state.blogs,
    getBlog: (state) => state.blog,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchBlogs(page = 1, search = '') {
      this.loading = true
      this.error = null
      
      try {
        const params = { page }
        if (search) params.search = search
        
        const response = await api.get('/blogs', { params })
        
        this.blogs = response.data.data
        this.pagination = {
          page: response.data.current_page,
          lastPage: response.data.last_page,
          perPage: response.data.per_page,
          total: response.data.total
        }
        
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch blogs'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchBlog(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get(`/blogs/${id}`)
        this.blog = response.data
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch blog'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async createBlog(blogData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/blogs', blogData)
        // Refresh the list after creating
        await this.fetchBlogs()
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create blog'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateBlog(id, blogData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.put(`/blogs/${id}`, blogData)
        // Update in the local state if in the list
        const index = this.blogs.findIndex(blog => blog.id === id)
        if (index !== -1) {
          this.blogs[index] = response.data
        }
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update blog'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateStatus(id, status) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.patch(`/blogs/${id}/status`, { status })
        // Update in the local state if in the list
        const index = this.blogs.findIndex(blog => blog.id === id)
        if (index !== -1) {
          this.blogs[index].status = status
        }
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update blog status'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async archiveBlog(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.delete(`/blogs/${id}`)
        // Remove from the local state if in the list
        this.blogs = this.blogs.filter(blog => blog.id !== id)
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to archive blog'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})