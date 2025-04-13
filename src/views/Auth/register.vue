<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light text-left">
    <motion.div
      class="bg-white p-4 p-md-5 rounded-4 shadow-lg w-100 max-w-400"
      :initial="{ opacity: 0, y: 40 }"
      :animate="{ opacity: 1, y: 0 }"
      transition="{ duration: 0.6, easing: 'ease-in-out' }"
    >
      <h2 class="text-primary mb-4">Create Account</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="form-control"
            placeholder="Enter your name"
            required
          />
        </div>
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
            placeholder="Create a password"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password_confirmation" class="form-label">Confirm Password</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            id="password_confirmation"
            class="form-control"
            placeholder="Confirm your password"
            required
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100 py-2 rounded-3 mt-4"
        >
          Register
        </button>
        <p v-if="error" class="text-danger mt-3">{{ error }}</p>
      </form>
    </motion.div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter()
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const error = ref(null)

const register = async () => {
  try {
    const response = await axios.post('http://localhost:8000/register', form.value)
    alert(response.data.message)
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  }
}
</script>

<style scoped>
/* Custom styles to make the page look cleaner */
body {
  background-color: #f8f9fa;
}
</style>
