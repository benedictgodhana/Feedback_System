<template>
  <div>
    <AdminNavbar></AdminNavbar>
    <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

    <v-container>
      <v-card variant="outlined">
        <v-card-title class="text-center" style="background-color:#385cad;color:white">Profile</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Username:</v-list-item-title>
                <v-list-item-subtitle>{{ user.username }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Email:</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <!-- Add more profile fields as needed -->
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" @click="openChangePasswordDialog" style="background: green;margin-left: 20px;text-transform: capitalize;"><v-icon>mdi-lock</v-icon>Change Password</v-btn>
        </v-card-actions>
      </v-card>

      <!-- Change Password Dialog -->
      <v-dialog v-model="changePasswordDialog" max-width="500">
        <v-card>
          <v-card-title class="text-center" style="background-color:#385cad;color:white">Change Password</v-card-title>
          <v-card-text>
            <!-- Form fields for changing password -->
            <!-- Example: -->
            <v-text-field v-model="oldPassword" label="Old Password" type="password" variant="outlined"></v-text-field>
            <v-text-field v-model="newPassword" label="New Password" type="password" variant="outlined"></v-text-field>
            <v-text-field v-model="confirmPassword" label="Confirm New Password" type="password" variant="outlined"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="white" @click="changePassword" style="background: green;margin-left: 20px;text-transform: capitalize;">Submit</v-btn>
            <v-btn color="white" @click="closeChangePasswordDialog" style="background:red;margin-left: 20px;text-transform: capitalize;">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import axiosInstance from '@/service/api';
import AdminSidebar from '@/components/SuperAdminSidebar.vue';
import AdminNavbar from '@/components/SuperAdminNavbar.vue';

export default {
  components: {
    AdminSidebar,
    AdminNavbar,
  },
  data() {
    return {
      user: {},
      changePasswordDialog: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const authToken = localStorage.getItem('token');
        const response = await axiosInstance.get('/profile', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    openChangePasswordDialog() {
      this.changePasswordDialog = true;
    },
    closeChangePasswordDialog() {
      this.changePasswordDialog = false;
    },
    async changePassword() {
      // Implement logic to change password here
      // Example: send a POST request to your backend API
      // with old password, new password, and confirm password
    },
  },
};
</script>
