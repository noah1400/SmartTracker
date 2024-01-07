<template>
    <div>
      <ProjectTable :projects="projectsData" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import ProjectTable from '../components/ProjectTable.vue';
  
  const projectsData = ref([]);
  
  function constructProjectsQuery() {
    return `
      query GetAllProjects {
        projects {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
    `;
  }
  
  async function fetchProjectsData() {
    const query = constructProjectsQuery();
    try {
      const response = await axios.post('http://localhost/graphql', {
        query
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Add any other necessary headers
        }
      });
      projectsData.value = response.data.data.projects;
    } catch (error) {
      console.error('Error fetching projects data:', error);
    }
  }
  
  onMounted(() => {
    fetchProjectsData();
  });
  </script>
  