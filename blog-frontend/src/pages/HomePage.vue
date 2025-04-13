<template>
    <q-page padding>
      <div class="text-center q-pt-lg">
        <h1 class="text-h3 q-mb-md">Test Exam Blogs</h1>
        <p class="text-body1">Manage your blogs</p>
        
        <q-card class="my-card q-mt-xl">
          <q-card-section>
            <div class="text-h6">Quick Stats</div>
          </q-card-section>
  
          <q-separator inset />
  
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-sm-4">
                <q-card class="bg-primary text-white">
                  <q-card-section>
                    <div class="text-h6">Total Blogs</div>
                    <div class="text-h3">{{ stats.totalBlogs }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-card class="bg-positive text-white">
                  <q-card-section>
                    <div class="text-h6">Published</div>
                    <div class="text-h3">{{ stats.published }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-card class="bg-secondary text-white">
                  <q-card-section>
                    <div class="text-h6">Draft</div>
                    <div class="text-h3">{{ stats.draft }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
  
        <div class="q-mt-xl">
          <q-btn 
            color="primary" 
            label="Manage Blogs" 
            icon="list" 
            to="/blogs" 
            size="lg" 
            class="q-mr-sm"
          />
          <q-btn 
            color="secondary" 
            label="Create New Blog" 
            icon="add" 
            to="/blogs?new=true" 
            size="lg"
          />
        </div>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const stats = ref({
    totalBlogs: 0,
    published: 0,
    draft: 0
  });
  
  onMounted(() => {
    // Using static data for now
    stats.value = {
      totalBlogs: 5,
      published: 3,
      draft: 2
    };
  });
  </script>
  
  <style scoped>
  .my-card {
    max-width: 800px;
    margin: 0 auto;
  }
  </style>