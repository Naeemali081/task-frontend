<template>
  <div class="container py-4">
    <h2>Edit Profile</h2>
    <!-- Ensure user is loaded before rendering form -->
    <form v-if="user" @submit.prevent="updateProfile">
      <div class="mb-3">
        <label for="name" class="form-label text-start">Name</label>
        <input v-model="user.name" type="text" id="name" class="form-control" placeholder="Enter your name" />
      </div>

      <div class="mb-3">
        <label for="profile_picture" class="form-label">Profile Picture</label>
        <input type="file" id="profile_picture" @change="handleImageChange" class="form-control" />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Updating...' : 'Save Changes' }}
      </button>
    </form>
    <p v-else>Loading user data...</p> <!-- Loading message until user is available -->
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { ref, onMounted, computed } from 'vue'; // Import computed
import axios from 'axios';

const store = useStore();
const loading = ref(false);

// Use computed property for reactive user data
const user = computed(() => store.getters.getUser); // Use a getter for the user

// Handle profile image upload
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    user.value.profile_picture = URL.createObjectURL(file);
    user.value.imageFile = file;
  }
};

// Update profile information
const updateProfile = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append('name', user.value.name);

  if (user.value.imageFile) {
    formData.append('profile_picture', user.value.imageFile);
  }

  try {
    await store.dispatch('updateUser', formData); // Dispatch the update action
  } catch (error) {
    console.error('Error updating profile:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch user data when the component is mounted
onMounted(() => {
  store.dispatch('fetchUser');
});
</script>

<style scoped>
/* Add custom styles here */
</style>
