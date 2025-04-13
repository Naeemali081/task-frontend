<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">My Tasks</h2>

    <!-- Task creation form -->
    <form @submit.prevent="createTask" class="bg-white p-4 rounded shadow mb-5">
      <div class="mb-3">
        <input
          v-model="newTask.title"
          class="form-control form-control-lg"
          placeholder="Task Title"
          required
        />
      </div>
      <div class="mb-3">
        <textarea
          v-model="newTask.description"
          class="form-control form-control-lg"
          placeholder="Description"
        ></textarea>
      </div>
      <div class="mb-3">
        <input
          type="file"
          @change="handleImage"
          class="form-control form-control-lg"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary w-100 py-2"
        :disabled="loading"
      >
        {{ loading ? 'Creating...' : 'Add Task' }}
      </button>
    </form>

    <!-- Loading spinner -->
    <div v-if="loadingTasks" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only"></span>
      </div>
    </div>

    <!-- Task list -->
    <div v-else>
    <h2>Task List</h2>
      <div
        v-for="task in tasks"
        :key="task.id"
        class="card mb-4 shadow-sm"
      >
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="card-title">{{ task.title }}</h5>
            <p class="card-text">{{ task.description }}</p>
          </div>
          <div class="d-flex flex-column align-items-end">
            <div v-if="task.image">
              <button
                @click="downloadImage(task.id)"
                class="btn btn-success btn-sm mb-2"
              >
                Download Image
              </button>
            </div>
            <button
              @click="deleteTask(task.id)"
              class="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tasks = ref([])
const loading = ref(false)
const loadingTasks = ref(true)

const newTask = ref({ title: '', description: '', image: null })

const fetchTasks = async () => {
  loadingTasks.value = true
  const res = await axios.get('/api/tasks')
  tasks.value = res.data.data
  loadingTasks.value = false
}

const createTask = async () => {
  loading.value = true
  const formData = new FormData()
  formData.append('title', newTask.value.title)
  formData.append('description', newTask.value.description)
  if (newTask.value.image) {
    formData.append('image', newTask.value.image)
  }

  await axios.post('/api/tasks', formData)
  await fetchTasks()
  newTask.value = { title: '', description: '', image: null }
  loading.value = false
}

const handleImage = (e) => {
  newTask.value.image = e.target.files[0]
}

const deleteTask = async (id) => {
  await axios.delete(`/api/tasks/${id}`)
  await fetchTasks()
}

const downloadImage = async (taskId) => {
  try {
    const response = await axios.get(`/api/tasks/${taskId}/download`, {
      responseType: 'blob',
    })

    const link = document.createElement('a')
    const url = window.URL.createObjectURL(response.data)
    link.href = url
    link.setAttribute('download', `task_${taskId}_image`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading the image:', error)
  }
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
/* You can add custom CSS if necessary, but this design is fully Bootstrap-based */
</style>
