<template>
  <div class="min-h-screen bg-light d-flex justify-content-center align-items-center">
    <div class="bg-white p-4 rounded shadow-lg w-100" style="max-width: 400px;">
      <h3 class="text-center mb-4">Forgot Password</h3>
      <form @submit.prevent="sendResetLink">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </div>
        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success mt-3" role="alert">
          A password reset link has been sent to your email.
        </div>
      </form>
      <div class="text-center mt-4">
        <p>Remembered your password? <router-link to="/login">Login here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const error = ref(null);
const success = ref(null);
const loading = ref(false);

const sendResetLink = async () => {
  loading.value = true;
  try {
    const response = await axios.post('http://localhost:8000/reset-password', {
      email: email.value,
    });

    success.value = response.data.message; // Success message from the backend
    error.value = null; // Reset error message
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send password reset link.';
    success.value = null;
  } finally {
    loading.value = false;
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
