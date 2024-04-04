<template>
    <v-card variant="outlined" height="200" elevation="3" style="margin: 8px;border-radius: 10px;" width="300">
      <!-- Image -->
      <v-img src="/multiple-users-silhouette_33308.png" style="margin-top: 10px;" height="50" contain></v-img>
  
      <!-- Title -->
      <v-card-title style="font-size: 14px;">Number of Superadmins</v-card-title>
  
      <!-- Count -->
      <v-card-text><span></span> {{ SuperAdminCount }}</v-card-text>
  
      <!-- Button -->
      <v-card-actions>
        <v-btn color="white" style="background:#385cad;width: 100%;text-transform: lowercase;"><v-icon>mdi-account</v-icon>SuperAdmins</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  
<script>
import axiosInstance from '../service/api'; // Import the Axios instance

export default {
  data() {
    return {
      SuperAdminCount: 0 // Initialize user count
    };
  },
  mounted() {
    this.fetchAdminCount(); // Fetch user count when the component is mounted
  },
  methods: {
    fetchAdminCount() {
      axiosInstance.get('/SuperAdmin/count')
        .then(response => {
          this.SuperAdminCount = response.data.count; // Update user count with the response data
        })
        .catch(error => {
          console.error('Error fetching user count:', error);
        });
    }
  }
};
</script>
  