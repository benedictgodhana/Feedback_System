<template>
    <v-navigation-drawer v-model="sidebar" app class="sidebar-drawer" style="background-color:white;">
      <v-list nav>
        <!-- Dashboard -->
        <v-list-item to="/superadmin" prepend-icon="mdi-view-dashboard" title="Dashboard" color="white"  elevation="0" active-class="active-button">
        </v-list-item>
  
        <!-- Manage Users -->
        <v-list-item to="/superadmin/manage-users" prepend-icon="mdi-account-group" title="Manage Users" color="white"  elevation="0" active-class="active-button">
        </v-list-item>
        <v-list-item to="/superadmin/manage-feedback" prepend-icon="mdi-comment-quote" title="Manage Feedback" color="white"  elevation="0" active-class="active-button">
          
        </v-list-item>
  
        <!-- Manage Services -->
        <v-list-item to="/superadmin/manage-categories" prepend-icon="mdi-briefcase" title="Feedback Categories"  color="white" elevation="0" active-class="active-button">
          
        </v-list-item>
  
        <!-- Manage Bookings -->
      
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
    background:#385cad;
  }
  </style>
  