<template>
  <div>
    <AdminNavbar></AdminNavbar>
    <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

    <v-container>
      <v-card variant="outlined">
        <v-card-title class="text-center" style="background-color:#02338D;color:white;text-transform: capitalize;">Profile</v-card-title>

        <v-alert v-if="snackbar.show" :type="snackbar.color" dismissible @click="snackbar.show = false">
          {{ snackbar.message }}
        </v-alert>

        <v-card-text style="margin-top: 20px;">
          <v-text-field 
            v-model="user.name" 
            label="Username" 
            outlined 
            variant="outlined"
            :error-messages="errors.name"
          ></v-text-field>
          <v-text-field 
            v-model="user.email" 
            label="Email" 
            outlined 
            variant="outlined"
            :error-messages="errors.email"
          ></v-text-field>
          <input type="hidden" v-model="user.role" />
          
          <!-- Form fields for changing password -->
          <v-text-field 
            v-model="oldPassword" 
            label="Old Password" 
            type="password" 
            variant="outlined" 
            autocomplete="off"
            :error-messages="errors.oldPassword"
          ></v-text-field>
          <v-text-field 
            v-model="newPassword" 
            label="New Password" 
            type="password" 
            variant="outlined" 
            autocomplete="off"
            :error-messages="errors.newPassword"
          ></v-text-field>
          <v-text-field 
            v-model="confirmPassword" 
            label="Confirm New Password" 
            type="password" 
            variant="outlined" 
            autocomplete="off"
            :error-messages="errors.confirmPassword"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn 
            color="white" 
            @click="updateUserProfile" 
            style="background:#02338D;margin-left: 20px;text-transform: capitalize;"
            width="100%"
          >
            <v-icon>mdi-lock</v-icon>Update Profile
          </v-btn>
        </v-card-actions>
      </v-card>
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
      user: {
        name: '',
        email: '',
        role: '',
      },
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      snackbar: {
        show: false,
        message: '',
        color: ''
      },
      errors: {
        name: [],
        email: [],
        role: [],
        oldPassword: [],
        newPassword: [],
        confirmPassword: []
      }
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
      this.clearErrors();
      try {
        const authToken = localStorage.getItem('token');

        // Combine profile data and password change data if available
        const requestData = {
          name: this.user.name || undefined,
          email: this.user.email || undefined,
          role: this.user.role || undefined,
          old_password: this.oldPassword || undefined,
          new_password: this.newPassword || undefined,
          confirm_password: this.confirmPassword || undefined,
        };

        await axiosInstance.put('/users/update-profile', requestData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Optionally, update the user data in local storage after successful update
        localStorage.setItem('user', JSON.stringify(this.user));
        this.showSnackbar('User profile updated successfully', 'success');
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        }
        this.showSnackbar('Error updating user profile', 'error');
      }
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    clearErrors() {
      this.errors = {
        name: [],
        email: [],
        role: [],
        oldPassword: [],
        newPassword: [],
        confirmPassword: []
      };
    }
  },
};
</script>
