<template>
  <div id="app">
    <NavBar v-if="isLoggedIn" />
    <RouterView />
    <ToastContainer />
    <div class="watermark">Universitas Dian Nusantara</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import NavBar         from './components/NavBar.vue'
import ToastContainer from './components/ToastContainer.vue'

const isLoggedIn = computed(() => !!localStorage.getItem('eco_token'))
</script>