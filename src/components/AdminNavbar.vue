<template>
  <v-app-bar app height="100" style="background:#385cad; color: white;" elevation="0">
    <!-- Logo -->
    <v-header>
     <a href="/admin"><img src="/iLab white Logo-01.png" alt="Logo" height="230" style="margin-top: 30px;margin-left: 20px;"></a> 
    </v-header>

   <v-spacer></v-spacer>
    <!-- Profile and logout buttons -->
    <v-btn style="margin-left: auto; font-weight: 500; font-family: 'poppins'; text-transform:capitalize;" text to="/Admin_profile">
      <v-icon size="20" color="success" style="padding:17px;">mdi-account-circle</v-icon> Profile
    </v-btn>
    <v-btn style="margin-left: 10px; font-weight: 500; font-family: 'poppins'; text-transform:capitalize;" text @click="toggleNotifications" >
      <v-icon size="20" color="orange" style="padding:17px;">mdi-bell</v-icon> Notifications <span v-if="notificationCount > 0">({{ notificationCount }})</span>
    </v-btn>

    <v-btn style="margin-left: 10px; font-weight: 500; font-family: 'poppins'; text-transform:capitalize;" text @click="logout">
      <v-icon size="20" color="red" style="padding:17px;">mdi-logout</v-icon> Logout
    </v-btn>
  </v-app-bar>




  <v-dialog v-model="notificationsVisible" max-width="400">
     
      <!-- Notifications component -->
      <notifications></notifications>
    </v-dialog>
</template>

<script>
import axiosInstance from '@/service/api'; // Import Axios instance
import Notifications from '@/components/Notifications.vue'; // Import Notifications component


export default {
  components: {
    Notifications,
  },
  data() {
    return {
      notificationsVisible: false, // Flag to control visibility of notifications dropdown
      notificationCount: 0, // Store the count of unread notifications
    };
  },
  methods: {

    async markAsRead(notificationId) {
      try {
        await axiosInstance.post(`/notifications/${notificationId}/mark-as-read`);
        // After marking as read, refetch the notifications and unread notification count
        this.fetchNotifications();
        this.fetchUnreadNotificationCount();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },

   

    async fetchNotificationCount() {
      try {
        const response = await axiosInstance.get('/notifications/count'); // Endpoint to fetch notification count
        this.notificationCount = response.data.count; // Update the notification count in the component data
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    },

    toggleNotifications() {
  this.notificationsVisible = !this.notificationsVisible;
  // Fetch the notification count again after toggling the visibility of notifications
  this.fetchNotificationCount();
},

    navigateToProfile() {
    },
    async logout() {
      try {
        // Get the authentication token from localStorage
        const authToken = localStorage.getItem('token');

        // Make a POST request to the logout endpoint
        await axiosInstance.post('/logout', null, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Clear authentication tokens or user session
        localStorage.removeItem('token');
        localStorage.removeItem('userData'); // Clear any other user-related data

        // Redirect the user to the login page
        this.$router.push('/'); // Assuming '/login' is the login page route
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  },

  mounted() {
    // Fetch the notification count when the component is mounted
    this.fetchNotificationCount();
  }
};
</script>
