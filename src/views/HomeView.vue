<template>

  <div>
    <Navbar></Navbar>

    <v-carousel cycle :show-arrows="false" hide-delimiter  height="500" style="margin-top: -40px;">
      <v-carousel-item v-for="(item, index) in carouselItems" :key="index" :src="item.image" cover>
        <!-- Overlay text and buttons -->
        <div class="overlay">
          <v-btn  large to="/feedback" class="btn-get-involved" style="text-transform: capitalize;  background:#385cad;color:white;width:200px;border-radius:0px;margin-top: 230px;margin-left: -0px;" elevation="4"><v-icon>mdi-comment-quote</v-icon>Give a feedback</v-btn>
        </div>
      </v-carousel-item>
    </v-carousel>

    <v-sheet style="background:#385cad;">
      <v-card-text class="text-center">
        <em style="font-size: 18px;color:white;text-transform:capitalize;font-weight: 600;">Changing Lives Through Research and Innovation </em>
      </v-card-text>
    </v-sheet>

    <v-container>
      

      <!-- Relevant cards with icons -->
      <v-row>
  <v-col cols="12" md="4">
    <v-card color="white" variant="outlined" style="border-radius:0 40px 0 40px;background-color:#385cad;" height="400px">
<v-card-title class="text-center" style="margin-top: 20px;"><v-icon size="108">mdi-comment-account</v-icon></v-card-title>
      <v-card-title class="text-center">User Feedback</v-card-title>
      <v-card-text>
        Provide valuable feedback on your experience with iLabAfrica's services, events, and projects. Your input helps us continually improve and innovate.
      </v-card-text>
    </v-card>
  </v-col>

  <v-col cols="12" md="4" >
    <v-card  color="white" variant="outlined" style="border-radius:0 40px 0 40px;background-color: green;" height="400px">
      <v-card-title class="text-center" style="margin-top: 20px;"><v-icon size="108">mdi-email</v-icon></v-card-title>
      <v-card-title class="text-center">Email Feedback</v-card-title>
      <v-card-text >
        Send your feedback directly to our team via email. We value your opinions and strive to address any concerns or suggestions promptly.
      </v-card-text>
    </v-card>
  </v-col>

  <v-col cols="12" md="4">
    <v-card  color="white" variant="outlined" style="border-radius:0 40px 0 40px;background-color:chocolate;" height="100%">
      <v-card-title class="text-center" style="margin-top: 20px;"><v-icon size="108">mdi-chat</v-icon></v-card-title>
      <v-card-title class="text-center">Live Chat</v-card-title>
      <v-card-text>
        Engage in real-time discussions with our support team through email. Get immediate assistance or share your feedback conveniently.
      </v-card-text>
    </v-card>
  </v-col>
</v-row>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    </v-container>

    
    <!-- Footer -->
    <v-footer style="background-color: #385cad;">
      <v-container>
        <v-row align="center">
          <!-- Logo -->
          <v-col cols="12" md="4" class="text-center">
            <img src="/iLab white Logo-01.png" alt="iLabAfrica Logo" style="max-width: 300px;">
          </v-col>
          
          <!-- Contact Column -->
          <v-col cols="12" md="4">
            <h3 style="color: white; text-transform: uppercase;">Contact</h3>
            <p style="color: white;font-size: 16px;text-transform: none;">Address: Strathmore University Student Centre, Keri Road</p>
            <p style="color: white;font-size: 16px;text-transform: none;">Phone: +254 703 034 616</p>
            <p style="color: white;font-size: 16px;text-transform: none;">Email: ilabafrica@strathmore.edu</p>
            <p style="color: white;font-size: 16px;text-transform: none;">Mon-Fri: 8:00AM - 5:00PM</p>
          </v-col>
          
          <!-- Quick Links Column -->
          <v-col cols="12" md="4">
            <h3 style="color: white; text-transform: uppercase;">Quick Links</h3>
            <ul style="list-style-type: none; padding: 0;">
              <li><a href="/" style="color: white; text-decoration: none;text-transform: none;">Home</a></li>
              <li><a href="/feedback" style="color: white; text-decoration: none;text-transform: none;">Give Feedback</a></li>
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
import Navbar from '../components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      carouselItems: [
        { image: '/wepik-export-20240415125155eqTS.jpeg' },
      ],
    };
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
  border-radius: 20px;
}
.v-footer {
  position: relative;
  bottom: 0;
  width: 100%;
  background-color: #385cad;
  color: white;
}

/* Footer content container */
.v-footer__content {
  padding: 20px 0; /* Adjust padding as needed */
}

/* Footer columns */
.v-footer__column {
  margin-bottom: 20px; /* Add some spacing between columns */
}

/* Footer links */
.v-footer__link {
  color: white;
  text-decoration: none;
}

/* Footer copyright text */
.v-footer__copyright {
  margin-top: 20px; /* Add some spacing above the copyright text */
  font-size: 14px; /* Reduce font size for smaller screens */
}

/* Media query for smaller screens */
@media screen and (max-width: 600px) {
  /* Adjust footer column layout for smaller screens */
  .v-footer__column {
    width: 100%;
    text-align: center;
  }
}
</style>
