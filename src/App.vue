<!-- src/App.vue -->
<template>
  <div class="w-100">
    <Header v-if="isLoggedIn" />  <!-- Show Header only if user is logged in -->
   <div class="innerBody">
    <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Header from './views/Components/header.vue'

const store = useStore()

const isLoggedIn = computed(() => store.getters.isLoggedIn)
</script>
