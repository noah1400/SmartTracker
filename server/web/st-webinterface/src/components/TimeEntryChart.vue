<template>
  <div class="h-64">
    <Bar id="timeEntryChart" :options="chartOptions" :data="chartData" />
  </div>
</template>
  
<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import dayjs from 'dayjs' // Import dayjs for date manipulation

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'TimeEntryChart',
  components: { Bar },
  props: {
    timeEntries: Array,
  },
  computed: {
    chartData() {
      const groupedEntries = this.groupEntriesByDate(this.timeEntries);
      const sortedDates = Object.keys(groupedEntries).sort((a, b) => dayjs(a).isAfter(dayjs(b)) ? 1 : -1).slice(-10); // Sort and take last 10
      const labels = sortedDates.map(date => dayjs(date).format('DD.MM.YYYY'));
      const data = sortedDates.map(date => groupedEntries[date]);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Duration in Minutes',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };
    },
  },
  methods: {
    groupEntriesByDate(entries) {
      const grouped = {};

      entries.forEach(entry => {
        const date = dayjs(entry.startTime).format('YYYY-MM-DD'); // Extract the date

        if (!grouped[date]) {
          grouped[date] = 0;
        }

        const start = dayjs(entry.startTime);
        const end = dayjs(entry.endTime);
        const duration = end.diff(start, 'minute'); // Calculate duration in minutes
        grouped[date] += duration; // Sum up durations per date
      });

      return grouped;
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  }
}
</script>
