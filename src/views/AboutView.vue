<template>
  <div>
    <Navbar></Navbar>

    <v-container>
      
      <v-card variant="outlined" elevation="0" style="border-radius: 5px;">
        <v-sheet class="about-section" variant="outlined">
         
          <v-card-title class="text-center" style="background-color:#385cad;margin-top: -20px;color:white ;">My feedback</v-card-title>
          <br>


          <v-alert v-if="successMessage" type="success" outlined>
              {{ successMessage }}
            </v-alert>
            <br>

          <v-form @submit.prevent="submitFeedback">
            
            <v-select
              v-model="selectedCategory"
              :items="feedbackCategories"
              item-title="name"
              item-value="id"
              label="Feedback Category"
              variant="outlined"
              style="text-transform: capitalize;"
            ></v-select>
            
            <v-text-field
              v-model="subject"
              label="Subject"
              required
              variant="outlined"
              style="text-transform: capitalize;"

            ></v-text-field>
            
            <v-text-field
              v-model="name"
              label="Name (optional)"
              required
              variant="outlined"
              style="text-transform: capitalize;"

            ></v-text-field>
                    <v-text-field
          v-model="email"
          label="Email (optional)"
          type="email"
          required
          variant="outlined"
          :error-messages="emailErrors"
          style="text-transform: capitalize;"

        ></v-text-field>




            
            <v-textarea
              v-model="feedback"
              label="Feedback"
              required
              variant="outlined"
              style="text-transform: capitalize;"

            ></v-textarea>

            <div id="recaptchaContainer"></div>
            
            <v-btn
              type="submit"
              color="primary"
              class="mx-auto"
              style="text-transform:capitalize;width:100%;"
              :loading="loading"
            >
              Submit
            </v-btn>

          
          </v-form>
          
          <p class="text-center mt-2" style="font-size: 16px;text-transform: none;">
            By submitting this feedback, you acknowledge that your submissions are taken seriously!
          </p>
        </v-sheet>
      </v-card>
    </v-container>


    <v-footer style="background-color: #385cad;" height="120">
      <v-container>
        <v-row>
          <v-col cols="12">
            <p style="color: white; text-align: center; margin: 0;text-transform: none;">&copy; 2024 @iLabAfrica, Strathmore University. All rights reserved.</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer> 
  </div>

  
</template>

<script>
import axiosInstance from '../service/api';
import Navbar from '../components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      recaptchaWidget: null,
      rules: {
      email: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
    },
    email: '',
    emailErrors: [],
      selectedCategory: '',
      feedbackCategories: [],
      subject: '',
      name: '',
      email: '',
      feedback: '',
      loading: false,
      successMessage: ''
    };
  },

  computed: {
  emailErrors() {
    const errors = [];
    if (!this.rules.email[0](this.email)) {
      errors.push('Email is required');
    }
    if (!this.rules.email[1](this.email)) {
      errors.push('Email must be valid');
    }
    return errors;
  },
},

  mounted() {
  
    this.fetchFeedbackCategories();
    this.loadRecaptchaScript();
  },
  methods: {
    loadRecaptchaScript() {
  const script = document.createElement('script');
  script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6Lc3Da8pAAAAAKBHdGzsitOwjjUPh6ttkrkGbkTw';
  script.onload = () => {
    // reCAPTCHA script loaded successfully
    // Now you can execute reCAPTCHA verification programmatically
    this.initializeRecaptcha();
  };
  document.head.appendChild(script);
},

initializeRecaptcha() {
  // Execute reCAPTCHA verification programmatically
  grecaptcha.enterprise.execute('6Lc3Da8pAAAAAKBHdGzsitOwjjUPh6ttkrkGbkTw', { action: 'submit' })
    .then(token => {
      // Verification successful, submit the feedback form or perform other actions
      this.submitFeedback();
    })
    .catch(error => {
      console.error('reCAPTCHA verification error:', error);
      // Handle error if necessary
    });
},

    async fetchFeedbackCategories() {
      try {
        const response = await axiosInstance.get('/feedback-categories');
        this.feedbackCategories = response.data;
      } catch (error) {
        console.error('Error fetching feedback categories:', error);
      }
    },
    async submitFeedback() {
  this.loading = true;
  try {
    const response = await axiosInstance.post('/feedback', {
      category_id: this.selectedCategory,
      subject: this.subject,
      name: this.name,
      email: this.email,
      feedback: this.feedback
    });
    console.log('Response from server:', response); // Check the response from the server
    this.successMessage = response.data.message;
    console.log('Success message:', this.successMessage); // Check the success message
    // Optionally, reset form fields after successful submission
    this.selectedCategory = '';
    this.subject = '';
    this.name = '';
    this.email = '';
    this.feedback = '';
    // Set a timeout to clear the success message after 4 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 4000);
  } catch (error) {
    console.error('Error submitting feedback:', error);
  } finally {
    this.loading = false;
  }
}


  },
};
</script>

<style>
.about-section {
  padding: 20px;
  margin-top: 30px;
  border-radius: 10px;
}

.text-muted {
  color: #757575; /* Adjust the color to your preference */
}
</style>
