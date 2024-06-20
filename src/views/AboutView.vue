<template>
  <div>
    <Navbar></Navbar>

    <v-container>
      <v-card elevation="3" style="border-radius: 5px;" width="100%">
        <v-sheet class="about-section" variant="outlined">
          <v-card-title class="text-center" style="background-color:#02338D; color: white;">My Feedback</v-card-title>
          <br>

          <v-alert v-if="successMessage" type="success" outlined dense>
            Feedback Submitted Successfully
          </v-alert>
          <br>

          <v-form @submit.prevent="submitFeedback" class="px-3 py-2">
            <v-select
              v-model="selectedCategory"
              :items="feedbackCategories"
              item-title="name"
              item-value="id"
              label="Feedback Category*"
              required
              variant="underlined"
              prepend-inner-icon="mdi-arrow-up-down"
              dense
              :rules="[v => !!v || 'Category is required']"
              style="text-transform: capitalize;"
            ></v-select>

            <v-text-field
              v-if="showOtherCategoryField"
              v-model="otherCategory"
              label="Specify Other Category"
              variant="underlined"
              dense
              style="text-transform: capitalize;"
            ></v-text-field>

            <v-select
              v-model="selectedSubcategory"
              :items="subcategories"
              item-title="name"
              item-value="id"
              label="Subcategory*"
              required
              variant="underlined"
              prepend-inner-icon="mdi-arrow-up-down"
              dense
              :rules="[v => !!v || 'Subcategory is required']"
              style="text-transform: capitalize;"
            ></v-select>

            <v-text-field
              v-model="subject"
              label="Subject*"
              style="text-transform: capitalize;"
              required
              :rules="[v => !!v || 'Subject is required']"
              variant="underlined"
              prepend-inner-icon="mdi-text-long"
              dense
            ></v-text-field>

            <v-text-field
              v-model="name"
              label="Name (optional)"
              variant="underlined"
              prepend-inner-icon="mdi-account"
              dense
              style="text-transform: capitalize;"
            ></v-text-field>

            <v-text-field
              v-model="email"
              label="Email (optional)"
              type="email"
              style="text-transform: capitalize;"
              variant="underlined"
              prepend-inner-icon="mdi-email"
              dense
            ></v-text-field>

            <v-textarea
              v-model="feedback"
              label="Feedback*"
              style="text-transform: capitalize;"
              required
              :rules="[v => !!v || 'Feedback is required']"
              variant="underlined"
              prepend-inner-icon="mdi-text"
              dense
            ></v-textarea>


            <v-btn
              type="submit"
              color="#02338D"
              class="mx-auto"
              :loading="loading"
              dense
              style="width: 100%;"
            >
              <v-icon class="mr-4">mdi-send</v-icon>
              Submit
            </v-btn>

            <p class="text-center mt-2" style="font-size: 12px;text-transform: capitalize;">
              Your feedback will be treated with utmost urgency
            </p>
          </v-form>
        </v-sheet>
      </v-card>
    </v-container>

    

    <v-footer style="background-color:#02338D;">
      <v-container>
        <v-row align="center">
          <!-- Logo -->
          <v-col cols="12" md="4" class="text-center">
            <img src="/Images/iLab white Logo-01.png" alt="iLabAfrica Logo" style="max-width: 300px;">
          </v-col>

          <!-- Contact Column -->
          <v-col cols="12" md="4">
            <h3 style="color: white; text-transform: uppercase;">Contact</h3>
            <p style="color: white; font-size: 16px; text-transform: none;">Address: Strathmore University Student Centre, Keri Road</p>
            <p style="color: white; font-size: 16px; text-transform: none;">Phone: +254 703 034 616</p>
            <p style="color: white; font-size: 16px; text-transform: none;">Email: ilabafrica@strathmore.edu</p>
            <p style="color: white; font-size: 16px; text-transform: none;">Mon-Fri: 8:00AM - 5:00PM</p>
          </v-col>

          <!-- Quick Links Column -->
          <v-col cols="12" md="4">
            <h3 style="color: white; text-transform: uppercase;">Quick Links</h3>
            <ul style="list-style-type: none; padding: 0;">
              <li><a href="/" style="color: white; text-decoration: none; text-transform: none;">Home</a></li>
              <li><a href="/feedback" style="color: white; text-decoration: none; text-transform: none;">Give Feedback</a></li>
              <!-- Add more quick links as needed -->
            </ul>
          </v-col>
        </v-row>

        <!-- Copyright Text -->
        <v-row>
          <v-col cols="12">
            <p style="color: white; text-align: center; margin: 0; text-transform: none; font-size: 17px;">
              &copy; 2024 @iLabAfrica, Strathmore University. All rights reserved.
            </p>
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
      errorSnackbar: false,
      selectedSubcategory: '',
      subcategories: [],
      otherCategory: '',
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
      feedback: '',
      loading: false,
      successMessage: ''
    };
  },

  computed: {
    showSubcategoryField() {
      return this.subcategories.length > 0;
    },
    showOtherCategoryField() {
      const selectedCategory = this.feedbackCategories.find(category => category.id === this.selectedCategory);
      return selectedCategory && selectedCategory.name === 'Other';
    },
    subjectErrors() {
      const errors = [];
      if (!this.subject) {
        errors.push('Subject is required');
      }
      return errors;
    },
    feedbackErrors() {
      const errors = [];
      if (!this.feedback) {
        errors.push('Feedback is required');
      }
      return errors;
    },
    categoryErrors() {
      const errors = [];
      if (!this.selectedCategory) {
        errors.push('Feedback Category is required');
      }
      return errors;
    },
    subcategoryErrors() {
      const errors = [];
      if (!this.selectedSubcategory) {
        errors.push('Subcategory is required');
      }
      return errors;
    },
  },

  mounted() {
    this.fetchFeedbackCategories();
    this.loadRecaptchaScript();
    this.fetchSubcategories(); // Fetch subcategories when the component is mounted
  },
  methods: {
    async fetchSubcategories() {
      try {
        if (!this.selectedCategory) {
          console.error('Selected category is empty');
          return;
        }

        const response = await axiosInstance.get(`/feedback-categories/${this.selectedCategory}/feedback_sub_categories`);
        this.subcategories = response.data;
        console.log('Subcategories:', this.subcategories); // Add this line to check the fetched subcategories
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    },

    loadRecaptchaScript() {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6Lc3Da8pAAAAAKBHdGzsitOwjjUPh6ttkrkGbkTw';
      script.onload = () => {
        this.initializeRecaptcha();
      };
      document.head.appendChild(script);
    },

    initializeRecaptcha() {
      grecaptcha.enterprise.execute('6Lc3Da8pAAAAAKBHdGzsitOwjjUPh6ttkrkGbkTw', { action: 'submit' })
        .then(token => {
          this.submitFeedback();
        })
        .catch(error => {
          console.error('reCAPTCHA verification error:', error);
        });
    },

    async fetchFeedbackCategories() {
      try {
        const response = await axiosInstance.get('/feedback-categories');
        this.feedbackCategories = response.data;
        console.log('Feedback categories:', this.feedbackCategories); // Add this line
      } catch (error) {
        console.error('Error fetching feedback categories:', error);
      }
    },

    async submitFeedback() {
      if (!this.selectedCategory || !this.selectedSubcategory || !this.subject || !this.feedback) {
        this.errorSnackbar = true;
        return;
      }

      this.loading = true;
      try {
        const response = await axiosInstance.post('/feedback', {
          category_id: this.selectedCategory,
          subcategory_id: this.selectedSubcategory,
          subject: this.subject,
          name: this.name,
          email: this.email,
          feedback: this.feedback,
          other_category: this.otherCategory,
        });
        console.log('Response from server:', response);
        this.successMessage = response.data.message;
        console.log('Success message:', this.successMessage);

        this.selectedCategory = '';
        this.selectedSubcategory = '';
        this.subject = '';
        this.name = '';
        this.email = '';
        this.feedback = '';
        this.otherCategory = '';



        setTimeout(() => {
          this.successMessage = true;
        }, 4000);
      } catch (error) {
        console.error('Error submitting feedback:', error);
      } finally {
        this.loading = false;
      }
    }
  },

  watch: {
    selectedCategory(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.fetchSubcategories();
      }
    }
  }
};
</script>
<style>
.about-section {
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
}

.text-muted {
  color: #757575;
}
</style>
