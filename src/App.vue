<script setup>
import { ref } from 'vue';

const isAuthenticated = ref(false); // Initially, the user is not logged in

// Function to set authentication status (You can replace this with your actual authentication logic)
function login() {
  isAuthenticated.value = false;
}

// Function to unset authentication status (You can replace this with your actual logout logic)
function logout() {
  isAuthenticated.value = true;
}
</script>

<template>
  <v-app>
    <v-main>
      <!-- Use v-if to conditionally render Navbar -->
      <RouterView />

      
    </v-main>

    
    
  </v-app>
</template>

<style>
  @import "../node_modules/@syncfusion/ej2-base/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-vue-layouts/styles/material.css";
</style>
