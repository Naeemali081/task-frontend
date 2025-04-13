<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">My Tasks</h2>

    <!-- Task creation/edit form -->
    <form @submit.prevent="editingTask ? updateTask() : createTask()" class="bg-white p-4 rounded shadow mb-5">
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
        {{ loading ? (editingTask ? 'Updating...' : 'Creating...') : (editingTask ? 'Update Task' : 'Add Task') }}
      </button>
      <button
        v-if="editingTask"
        type="button"
        @click="cancelEdit"
        class="btn btn-secondary w-100 py-2 mt-2"
      >
        Cancel Edit
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
              @click="editTask(task)"
              class="btn btn-warning btn-sm mb-2"
            >
              Edit
            </button>
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
const editingTask = ref(null)

const newTask = ref({
  title: '',
  description: '',
  image: null,
})

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
  resetForm()
  loading.value = false
}

const updateTask = async () => {
  if (!editingTask.value) return
  loading.value = true

  const formData = new FormData()
  formData.append('title', newTask.value.title)
  formData.append('description', newTask.value.description)
  if (newTask.value.image) {
    formData.append('image', newTask.value.image)
  }
  formData.append('_method', 'PUT')

  await axios.post(`/api/tasks/${editingTask.value}`, formData)
  editingTask.value = null
  resetForm()
  await fetchTasks()
  loading.value = false
}

const handleImage = (e) => {
  newTask.value.image = e.target.files[0]
}

const deleteTask = async (id) => {
  await axios.delete(`/api/tasks/${id}`)
  await fetchTasks()
}

const editTask = (task) => {
  editingTask.value = task.id
  newTask.value = {
    title: task.title,
    description: task.description,
    image: null,
  }
}

const cancelEdit = () => {
  editingTask.value = null
  resetForm()
}

const resetForm = () => {
  newTask.value = {
    title: '',
    description: '',
    image: null,
  }
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
