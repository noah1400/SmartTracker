import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// axios
import axios from 'axios'
axios.defaults.withCredentials = true;

// Set up a response interceptor
axios.interceptors.response.use(response => {
    // Always return the response
    return response;
  }, error => {
    // Check if it's a 401 response
    if (error.response && error.response.status === 401) {
      // Redirect to /login
      localStorage.removeItem('isLoggedIn');
      router.push('/login');
    }
    // Return any error which is not due to authentication
    return Promise.reject(error);
  });

const app = createApp(App)

app.use(router)

app.mount('#app')