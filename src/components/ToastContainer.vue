<template>
  <div id="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast-item', 'toast-' + toast.type]"
    >
      <span>{{ icons[toast.type] }}</span>{{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'
const { toasts } = useToast()
const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
</script>