<template>
  <v-navigation-drawer app temporary v-model="drawer">
    <v-card color="transparent" flat>
      <v-card-text>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
  
  <v-app-bar height="100" style="background:#02338D; color: white;" elevation="0">
    <!-- Application title -->
    <v-header>
      <a href="/admin" class="hidden-sm-and-down">
        <img src="/Images/iLab white Logo-01.png" alt="Logo" height="230" style="margin-top: 30px;margin-left: 20px;">
      </a> 
    </v-header>
    
    <v-app-bar-title class="hidden-sm-and-down"></v-app-bar-title>

    <v-spacer></v-spacer> <!-- This spacer pushes the content to the right -->
    
    <!-- Language switch button -->
    
    <!-- Social media icons at top right -->
    
    <!-- Profile and logout buttons -->
    <v-btn icon style="font-weight: 500; font-family: 'poppins'; text-transform:capitalize;" text to="/Admin_profile" class="hidden-sm-and-down">
      <v-icon size="28"  style="padding:17px;">mdi-account-outline</v-icon>
    </v-btn>
   
    <v-btn icon style="margin-left: 10px; font-weight: 500; font-family: 'poppins'; text-transform:capitalize;" text @click="toggleNotifications" >
      <v-icon size="28"   style="padding:17px;">mdi-bell-outline</v-icon><span v-if="notificationCount > 0"  class="notification-count">{{ notificationCount }}</span>
    </v-btn>

    <v-btn icon class="ma-4" style="margin-left: 10px; font-weight: 500; font-family: 'poppins'; text-transform:capitalize;" text @click="logout">
      <v-icon size="28"  style="padding:17px;">mdi-logout</v-icon> 
    </v-btn>


    <!-- Navigation menu for small screens -->
    <v-btn icon @click.stop="drawer = !drawer" class="hidden-md-and-up">
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <!-- Display navigation drawer for small screens -->
    <v-navigation-drawer v-model="drawer" absolute right temporary>
      <v-list>
        <!-- Loop through the items and create a router link for each -->
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.route" 
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  </v-app-bar>
  <v-dialog v-model="notificationsVisible" max-width="400">
    
     <!-- Notifications component -->
     <notifications></notifications>
   </v-dialog>
</template>

<script>
import axiosInstance from '@/service/api';
import Notifications from '@/components/Notifications.vue'; // Import Notifications component

export default {
  components: {
    Notifications,
  },
  data() {
    return {
      notificationsVisible: false, // Flag to control visibility of notifications dropdown
      notificationCount: 0, // Store the count of unread notifications
      user: {
        initials: '',
        fullName: '',
        gender: ''
      },
     
      loading: false, // Control the visibility of the loading spinner
      drawer: false // Control the visibility of the navigation drawer
    };
  },
  computed: {
    // Computed properties to extract user information
    userInitials() {
      return this.user.initials;
    },
    userFullName() {
      return this.user.fullName;
    },
    userGender() {
      return this.user.gender;
    },
    userEmail() {
      return this.user.email;
    },
    
  },
  mounted() {
    // Fetch user data from the '/Authuser' endpoint using Axios
    axiosInstance.get('/Authuser', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Pass the authentication token from local storage
      }
    })
      .then(response => {
        const userData = response.data;
        if (userData.name) {
          this.user.initials = (userData.name.charAt(0).toUpperCase()) + (userData.user_details && userData.user_details.last_name ? userData.user_details.last_name.charAt(0).toUpperCase() : '');
          this.user.fullName = userData.name + ' ' + (userData.user_details && userData.user_details.last_name ? userData.user_details.last_name : '');
          this.user.gender = userData.user_details ? userData.user_details.gender : '';
          this.user.email = userData.email;
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    this.fetchNotificationCount();
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
    },
    switchLanguage(lang) {
      // Implement logic to switch language
      console.log('Switching language to:', lang);
    },
   
  }
};
</script>

<style scoped>
.center-align {
  justify-content: center;
}
.notification-count {
  position: absolute;
  top: 6px; /* Adjust the vertical position */
  right: 10px; /* Adjust the horizontal position */
  background-color: red;
  color: white;
  border-radius: 50%; /* Make it a circle */
  width: 20px; /* Adjust size as needed */
  height: 20px; /* Adjust size as needed */
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
