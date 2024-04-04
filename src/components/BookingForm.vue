<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card style="width:100%;">
      <v-card-title class="headline text-center">Book Service: {{ selectedService }}</v-card-title>       
      <v-card-text>
        <!-- Form fields for selecting date, time, location, and service provider -->
        <v-form ref="form">
          <v-text-field v-model="date" label="Select Date" type="date"></v-text-field>
          <v-text-field v-model="time" label="Select Time" type="time"></v-text-field>
          <v-text-field v-model="location" label="Location" placeholder="Enter Location"></v-text-field>
          <v-select v-model="selectedProvider" :items="availableEmployees" label="Select Service Provider"></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <!-- Buttons for submitting the form and closing the dialog -->
        <v-btn color="primary" @click="submitForm">Submit</v-btn>
        <v-btn color="primary" @click="closeForm">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axiosInstance from '@/service/api'; // Import Axios instance

export default {
  props: {
    user: Object, // User information object
    selectedService: String, // Selected service name
  },
  data() {
    return {
      dialog: true, // Controls the visibility of the dialog
      date: null, // Selected date
      time: null, // Selected time
      location: '', // Selected location
      selectedProvider: null, // Selected service provider
      availableEmployees: [], // List of available employees for the selected service
      authToken: null, // Authentication token retrieved from local storage
    };
  },
  created() {
    // Retrieve the authentication token from local storage
    this.authToken = localStorage.getItem('token');
    // Fetch available employees for the selected service
    this.fetchAvailableEmployees();
  },
  methods: {
    async fetchAvailableEmployees() {
      try {
        // Make a GET request to fetch available employees for the selected service
        const response = await axiosInstance.get(`/available-employees?service=${this.selectedService}`, {
          headers: {
            Authorization: `Bearer ${this.authToken}`, // Pass the authentication token in the request headers
          },
        });
        // Assuming response data is an array of employee names
        this.availableEmployees = response.data;
      } catch (error) {
        console.error('Error fetching available employees:', error);
      }
    },
    async submitForm() {
      try {
        // Prepare booking data
        const bookingData = {
          date: this.date,
          time: this.time,
          location: this.location,
          selectedProvider: this.selectedProvider,
        };
        // Make a POST request to book the service
        await axiosInstance.post('/bookings', bookingData, {
          headers: {
            Authorization: `Bearer ${this.authToken}`, // Pass the authentication token in the request headers
          },
        });
        // Close the dialog after successful booking
        this.closeForm();
      } catch (error) {
        console.error('Error booking service:', error);
      }
    },
    closeForm() {
      // Close the dialog by emitting a 'close' event
      this.$emit('close');
    },
  },
};
</script>


<style scoped>
/* Add scoped styles for the component */
</style>
