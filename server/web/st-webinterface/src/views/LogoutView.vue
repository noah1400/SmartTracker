<template>
    <div>Logging out...</div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    created() {
      this.logout();
    },
    methods: {
      async logout() {
        try {
          await axios.post('http://localhost/auth/logout', {});
          localStorage.removeItem('isLoggedIn'); // Reset the localStorage item
          this.$router.push('/login'); // Redirect to login page
        } catch (error) {
          console.error('Logout Error:', error);
          // Handle logout error (e.g., show message or redirect to an error page)
        }
      }
    }
  };
  </script>
  