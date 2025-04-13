<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <!-- Left Side Logo (Text) -->
      <a class="navbar-brand" href="#">Task Management</a>

      <div class="d-flex align-items-center">
        <!-- User Profile & Logout (Right Side) -->
        <div v-if="user" class="d-flex align-items-center">
          <img :src="`http://localhost:8000/storage/${user.avatar}`" alt="Profile Picture" class="rounded-circle" width="40" height="40" @click="goToProfile" style="cursor: pointer;">
          <span class="ms-2">{{ user.name }}</span>
          <button @click="logout" class="btn btn-outline-danger ms-3">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { onMounted, computed } from 'vue';
import axios from 'axios';

// Initialize store and router
const store = useStore();
const router = useRouter();

// Fetch user data when the component is mounted
onMounted(() => {
  // Only fetch user if it's not already in the store
  if (!store.getters.isLoggedIn) {
    store.dispatch('fetchUser');
  }
});

// Get the logged-in user's data from Vuex
const user = computed(() => store.getters.getUser);

// Handle logout
const logout = async () => {
  try {
    await axios.post('http://localhost:8000/api/logout'); // Ensure the correct URL for logout
    store.dispatch('logout'); // Clear user from Vuex store
    localStorage.removeItem('token'); // Remove token from localStorage
    router.push('/login'); // Redirect to login page
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// Navigate to the profile page when the user clicks on their profile
const goToProfile = () => {
  router.push('/profile');
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
