<template>

  <div>
    <Navbar></Navbar>

  <v-carousel cycle :show-arrows="false" hide-delimiter-background height="600" style="margin-top: -40px;">
      <v-carousel-item v-for="(item, index) in carouselItems" :key="index" :src="item.image" cover>
        <!-- Overlay text and buttons -->
        <div class="overlay">

          <span class="headline text-white" style="text-transform: none;font-weight: 900;">Welcome to @iLabAfrica Feedback System</span>
          <p class="subtext text-white">Research and Innovation Center</p>
          <v-btn  large to="/feedback" class="btn-get-involved" style="text-transform: capitalize;  background:#385cad;color:white;width:200px" elevation="4"><v-icon>mdi-comment-quote</v-icon>create a feedback</v-btn>
        </div>
      </v-carousel-item>
    </v-carousel>
    <v-sheet style="background:#385cad;">
      <v-card-text class="text-center">
        <em style="font-size: 18px;color:white;text-transform: lowercase;font-weight: 600;">Changing life </em>
      </v-card-text>
    </v-sheet>
  

   <!-- Carousel with interactive elements -->
   

    <!-- Cards displaying community activities -->
    <v-container>
  <v-sheet class="about-section">
  </v-sheet>
 
</v-container>
<v-footer style="background-color: #385cad;" height="150">
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
import BookingForm from '../components/BookingForm.vue'; // Import the booking form component

export default {
  components: {
    Navbar,
    BookingForm, // Register the booking form component
  },
  data() {
    return {
      showCookieModal: false,
      carouselItems: [
        { image: '/9848264.jpg' },
        // Add more carousel items as needed
      ],
      services: [],
      searchKeyword: '',
      showBookingForm: false, // Data property to toggle booking form visibility
    };
  },
  mounted() {
    this.fetchServices(); // Fetch services when the component is mounted
  },
  computed: {
    uniqueServices() {
      // Use a Set to store unique image URLs
      const uniqueImages = new Set();
      // Filter the services array to remove duplicates
      return this.services.filter(service => {
        if (!uniqueImages.has(service.image)) {
          uniqueImages.add(service.image);
          return true;
        }
        return false;
      });
    }
  },
  methods: {
    navigateToService(service) {
      // Set the selected service before showing the booking form
      this.selectedService = service.name;
      // Show booking form
      this.showBookingForm = true;
    },
    fetchServices() {
      axiosInstance.get('/services')
        .then(response => {
          this.services = response.data; // Update services with the response data
        })
        .catch(error => {
          console.error('Error fetching services:', error);
        });
    },
  },
};
</script>



<style>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-transform: capitalize;
}
.overlay .headline {
  font-size: 24px;
}
.overlay .subtext {
  margin-top: 10px;
  font-size: 16px;
}
.btn-get-involved {
  margin: 14px;
  border-radius: 20px;
  text-transform: lowercase;
}
.activity-card {
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
