<template>
  <div class="min-h-screen bg-light d-flex justify-content-center align-items-center">
    <div class="bg-white p-4 rounded shadow-lg w-100" style="max-width: 400px;">
      <h3 class="text-center mb-4">Login</h3>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <div class="d-flex justify-content-between mb-3">
          <div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </div>
        </div>
        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          {{ error }}
        </div>
        <div class="text-center mt-4">
          <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
           <p><router-link to="/forgot-password">Forgot Password?</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';
const store = useStore();

const router = useRouter();
const form = ref({
  email: '',
  password: ''
});
const error = ref(null);

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8000/login', form.value);
     
     const token = response.data.data.access_token;
     const user = response.data.data.user;

    store.dispatch('login', { user, token });
    
    // Redirect to dashboard or home page
    router.push('/dashboard'); // Adjust the path based on your route
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.';
  }
};
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}

.form-label {
  font-weight: 600;
}

.alert {
  margin-top: 10px;
}
</style>
