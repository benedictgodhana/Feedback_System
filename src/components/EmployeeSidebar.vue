<template>
     <v-navigation-drawer
        theme="light"
        permanent
      >
        <v-list nav>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="inbox" active-class="active-button"></v-list-item>
          <v-list-item prepend-icon="mdi-clock-time-five" title="Manage Shifts" value="supervisors" active-class="active-button"></v-list-item>
          <v-list-item prepend-icon="mdi-clock-start" title="Clock-in" value="clockin" active-class="active-button" elevation="0"></v-list-item>
        </v-list>
      </v-navigation-drawer>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sidebar: true, // Set sidebar to be open by default
      };
    },
  };
  </script>
  
  <style scoped>
  .sidebar-button {
    text-align: left;
    font-weight: 500;
    font-family: 'Poppins';
  }
  
  .active-button {
    color: blue; /* Customize active button color */
    background: yellow;
  }
  </style>
  