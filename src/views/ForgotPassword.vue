<template>
    <div>
      <Navbar></Navbar>
  
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card width="100%" variant="outlined" style="max-width: 800px;margin-top: 50px;">
          <v-alert v-model="alert" :type="alertType" transition="scale-transition" dismissible>
            {{ alertMessage }}
          </v-alert>
          <v-card-title>
            Forgot Password
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="requestPasswordReset">
              <v-text-field v-model="email" label="Email" placeholder="Enter Your Email" variant="outlined"></v-text-field>
              <v-btn color="#385cad" type="submit" style="text-transform: capitalize;"><v-icon>mdi-email</v-icon>Request Password Reset link</v-btn>
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
        alert: false,
        alertType: '', // Success, error, or warning
        alertMessage: '',
      };
    },
    methods: {
      requestPasswordReset() {
        const payload = {
          email: this.email,
        };
  
        axiosInstance.post('/forgot-password', payload)
          .then(response => {
            if (response.data.status === 'success') {
              this.showAlert('success', 'Check your email for the password reset link.');
            } else {
              this.showAlert('error', 'There was a problem sending the password reset link.');
            }
          })
          .catch(error => {
            console.error('There was an error: ', error);
            this.showAlert('error', 'Failed to send password reset link. Please try again later.');
          });
      },
      showAlert(type, message) {
        this.alertType = type;
        this.alertMessage = message;
        this.alert = true;
        setTimeout(() => {
          this.alert = false; // Hide the alert after 4 seconds
        }, 4000); // 4000 milliseconds = 4 seconds
      }
    }
  }
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
  