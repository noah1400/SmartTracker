<template>
    <div>
      <UserTable :users="usersData" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import UserTable from '../components/UserTable.vue';
  
  const usersData = ref([]);
  
  function constructUsersQuery(withTimeEntries) {
    return `
      query GetAllUsers($withTimeEntries: Boolean!) {
        users {
          id
          username
          email
          timeEntries @include(if: $withTimeEntries) {
            id
            description
            startTime
            endTime
            createdAt
            updatedAt
            user {
              id
              username
            }
            project {
              id
              name
            }
          }
        }
      }
    `;
  }
  
  async function fetchUsersData() {
    const query = constructUsersQuery(false); // Set to true to include time entries
    try {
      const response = await axios.post('http://localhost/graphql', {
        query,
        variables: {
          withTimeEntries: false
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      usersData.value = response.data.data.users;
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  }
  
  onMounted(() => {
    fetchUsersData();
  });
  </script>
  