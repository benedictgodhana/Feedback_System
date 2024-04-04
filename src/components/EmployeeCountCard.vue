<template>
    <v-card style="margin: 8px;border-radius: 10px;" variant="outlined" height="200" elevation="3" width="300">
        <v-img src="/employee_11802935.png" height="50" style="margin-top: 10px;" contain></v-img>

      <v-card-title style="font-size: 14px;">Number of Feedbacks</v-card-title>
      <v-card-text>{{ feedbackCount }}</v-card-text>

      <v-card-actions>
        <v-btn color="white" style="background:#385cad;width: 100%;text-transform: lowercase;"><v-icon>mdi-comment</v-icon>Feedback</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
import axiosInstance from '../service/api'; // Import the Axios instance

export default {
  data() {
    return {
      feedbackCount: 0 // Initialize user count
    };
  },
  mounted() {
    this.fetchUserCount(); // Fetch user count when the component is mounted
  },
  methods: {
    fetchUserCount() {
      axiosInstance.get('/feedback/count')
        .then(response => {
          this.feedbackCount = response.data.count; // Update user count with the response data
        })
        .catch(error => {
          console.error('Error fetching user count:', error);
        });
    }
  }
};
</script>