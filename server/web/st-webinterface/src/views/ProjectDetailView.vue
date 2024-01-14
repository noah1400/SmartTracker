<template>
    <div class="p-6">
      <h2 class="text-xl font-bold">{{ projectData.name }}</h2>
      <p class="mt-2 text-gray-600">{{ projectData.description }}</p>
      <div class="mt-6">
        <time-entry-chart :timeEntries="timeEntriesData"/>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import TimeEntryChart from '../components/TimeEntryChart.vue';
  
  const route = useRoute();
  const projectId = route.params.id;
  
  const projectData = ref({});
  const timeEntriesData = ref([]);
  
  function constructProjectQuery() {
    return `
      query GetProject($id: ID!) {
        project(id: $id) {
          id
          name
          description
          timeEntries {
            id
            description
            startTime
            endTime
          }
        }
      }
    `;
  }
  
  async function fetchProjectData() {
    const query = constructProjectQuery();
    try {
      const response = await axios.post('http://localhost/graphql', {
        query,
        variables: { id: projectId }
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      projectData.value = response.data.data.project;
      timeEntriesData.value = response.data.data.project.timeEntries;

    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  }
  
  onMounted(() => {
    fetchProjectData();
  });
  </script>
  