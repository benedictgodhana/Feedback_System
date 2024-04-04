<template>
    <div>
      <Navbar></Navbar>
  
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card width="100%" style="max-width: 600px" variant="outlined" elevation="4">
          <v-alert v-model="alert" :type="alertType" transition="scale-transition" dismissible>
            {{ alertMessage }}
          </v-alert>
          <v-card-title>Password Reset Form</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="resetPassword">
              <v-text-field v-model="email" label="Email" variant="outlined"></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" variant="outlined"></v-text-field>
              <v-text-field v-model="passwordConfirmation" label="Confirm Password" type="password" variant="outlined"></v-text-field>
              <v-btn color="#385cad"  style="width: 100%" type="submit" :loading="loading">Reset Password</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/Navbar.vue';
  import axiosInstance from '@/service/api';
  
  export default {
    components: {
      Navbar,
    },
    data() {
      return {
        email: '',
        password: '',
        passwordConfirmation: '',
        alert: false,
        alertType: '', // success, error, warning, info
        alertMessage: '',
        loading: false, // Flag to indicate loading state
      };
    },
    methods: {
      resetPassword() {
        this.loading = true; // Set loading state to true during request
  
        const payload = {
          token: this.$route.query.token,
          email: this.email, // Add the email to the payload
          password: this.password,
          password_confirmation: this.passwordConfirmation,
        };
  
        axiosInstance.post('/reset-password', payload)
          .then(() => {
            this.loading = false; // Reset loading state
            this.showAlert('success', 'Your password has been reset successfully.');
            this.$router.push('/');
          })
          .catch(error => {
            this.loading = false; // Reset loading state
  
            if (error.response) {
              const { data } = error.response;
              if (data && data.errors) {
                if (data.errors.email) {
                  this.showAlert('error', data.errors.email[0]);
                } else if (data.errors.password) {
                  this.showAlert('error', data.errors.password[0]);
                }
              } else if (data && data.message) {
                this.showAlert('error', data.message);
              } else {
                this.showAlert('error', 'An error occurred while resetting your password.');
              }
            } else {
              this.showAlert('error', 'An error occurred while resetting your password.');
            }
          });
      },
      showAlert(type, message) {
        this.alertType = type;
        this.alertMessage = message;
        this.alert = true;
      }
    }
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100%;
  }
  
  .align-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }
  </style>
  