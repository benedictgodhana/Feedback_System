<template>
  <div>
    <AdminNavbar></AdminNavbar>
    <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

    <v-container>
      <v-card variant="outlined">
        <v-card-title class="text-center" style="background-color:#385cad;color:white;text-transform: capitalize;">Profile</v-card-title>

        <v-card-text style="margin-top: 20px;">
          <v-text-field v-model="user.name" label="Username" outlined variant="outlined"></v-text-field>
          <v-text-field v-model="user.email" label="Email" outlined variant="outlined"></v-text-field>
          <input type="hidden" v-model="user.role" /> <!-- Hidden role field -->
          <!-- Add more profile fields as needed -->
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" @click="updateUserProfile" style="background: green;margin-left: 20px;text-transform: capitalize;"><v-icon>mdi-lock</v-icon>Update Profile</v-btn>
          <v-btn color="white" @click="openChangePasswordDialog" style="background: green;margin-left: 20px;text-transform: capitalize;"><v-icon>mdi-lock</v-icon>Change Password</v-btn>
        </v-card-actions>
      </v-card>

      <!-- Change Password Dialog -->
      <v-dialog v-model="changePasswordDialog" max-width="500">
        <v-card>
          <v-card-title class="text-center" style="background-color:#385cad;color:white">Change Password</v-card-title>
          <v-card-text>
            <!-- Form fields for changing password -->
            <v-text-field v-model="oldPassword" label="Old Password" type="password" outlined></v-text-field>
            <v-text-field v-model="newPassword" label="New Password" type="password" outlined></v-text-field>
            <v-text-field v-model="confirmPassword" label="Confirm New Password" type="password" outlined></v-text-field>
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
import AdminSidebar from '@/components/AdminSidebar.vue';
import AdminNavbar from '@/components/AdminNavbar.vue';

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
    // Fetch user profile data from local storage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      this.user = userData;
    } else {
      // If user data is not found in local storage, fetch it from the server
      this.fetchUserProfile();
    }
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
    async updateUserProfile() {
      try {
        const authToken = localStorage.getItem('token');
        await axiosInstance.put('/users/update-profile', this.user, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        // Optionally, you can update the user data in local storage after successful update
        localStorage.setItem('user', JSON.stringify(this.user));
        console.log('User profile updated successfully');
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    },
    openChangePasswordDialog() {
      this.changePasswordDialog = true;
    },
    closeChangePasswordDialog() {
      this.changePasswordDialog = false;
    },
    async changePassword() {
      try {
        // Validate the new password and confirm password
        if (this.newPassword !== this.confirmPassword) {
          // Display an error message or toast indicating password mismatch
          console.error('Password confirmation does not match');
          return;
        }

        const authToken = localStorage.getItem('token');
        const requestData = {
          old_password: this.oldPassword,
          new_password: this.newPassword,
          confirm_password: this.confirmPassword
        };

        // Send a PUT request to the backend API to change the password
        await axiosInstance.put('/users/change-password', requestData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Optionally, display a success message or toast
        console.log('Password changed successfully');
      } catch (error) {
        console.error('Error changing password:', error);
        // Optionally, display an error message or toast
      }
    },
  },
};
</script>
