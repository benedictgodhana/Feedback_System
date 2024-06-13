<template>
  <v-card style="margin: 8px;border-radius: 10px;" variant="outlined" elevation="3" width="300">
    <v-img src="/Images/review_8867013.png" style="margin-top: 10px;" height="50" contain></v-img>
    <v-card-title style="font-size: 14px;">Number of Feedback Categories</v-card-title>
    <v-card-text>{{ feedbackCategoriesCount }}</v-card-text>
    <v-card-actions>
      <v-btn color="white" style="background:#385cad;width: 100%;text-transform: lowercase;"><v-icon>mdi-briefcase</v-icon>Feedback Categories</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axiosInstance from '../service/api'; // Import the Axios instance

export default {
  data() {
    return {
      feedbackCategoriesCount: 0 // Initialize feedback categories count
    };
  },
  mounted() {
    this.fetchFeedbackCategoriesCount(); // Fetch feedback categories count when the component is mounted
  },
  methods: {
    fetchFeedbackCategoriesCount() {
      axiosInstance.get('/feedback/categories/count')
        .then(response => {
          this.feedbackCategoriesCount = response.data.count; // Update feedback categories count with the response data
        })
        .catch(error => {
          console.error('Error fetching feedback categories count:', error);
        });
    }
  }
};
</script>
