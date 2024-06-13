<template>
  
  <v-app-bar app height="100" style="background:#02338D;color:white; display: flex; align-items: center;" elevation="0">

<!-- Menu button for small screens -->
<v-btn class="menu-btn hidden-md-and-up" icon @click="sidebar = !sidebar">
  <v-icon size="16">mdi-menu</v-icon>
</v-btn>

<!-- Logo -->
<v-header>
</v-header>

<!-- Spacer to push buttons to the right -->
<v-spacer></v-spacer>

<!-- Navigation buttons for larger screens -->
<v-btn class="nav-btn hidden-sm-and-down" text to="/" style="text-transform: capitalize;">
  <v-icon size="16" class="btn-icon">mdi-home</v-icon>Home
</v-btn>
<v-btn class="nav-btn hidden-sm-and-down" text to="/feedback" style="text-transform: capitalize;">
  <v-icon size="13" class="btn-icon">mdi-email</v-icon>Give feedback
</v-btn>
<v-btn class="nav-btn hidden-sm-and-down" @click="showSignInModal" style="text-transform: capitalize;">
  <v-icon size="16" class="btn-icon">mdi-account</v-icon>Login
</v-btn>

</v-app-bar>

   <!-- Sidebar for small screens -->
   <v-navigation-drawer v-model="sidebar" app class="sidebar-drawer">
 <v-list nav>
   <v-list-item-group>
     <!-- Home -->
     <v-list-item to="/" prepend-icon="mdi-home" title="Home" class="sidebar-button" elevation="0" active-class="active-button">
     </v-list-item>

     <!-- About -->
     <v-list-item to="/feedback" prepend-icon="mdi-comment-quote" title="Create Feedback"  elevation="0" active-class="active-button">
     </v-list-item>

     

    

     <!-- Sign Up -->
    
     <!-- Login -->
     <v-list-item @click="showSignInModal" prepend-icon="mdi-account" title="Login" elevation="0" active-class="active-button">
     </v-list-item>
   </v-list-item-group>
 </v-list>
</v-navigation-drawer>
<v-alert ref="loginSuccessAlert" type="success" dismissible v-model="loginSuccessAlertVisible">
  Login Successful!
</v-alert>

<v-alert ref="registerSuccessAlert" type="success" dismissible v-model="registerSuccessAlertVisible">
  Registration Successful!
</v-alert>



<v-dialog v-model="signInModal" max-width="700px">
  <v-card style="border-radius:10px" elevation="4">
    <v-toolbar color="white">
      <v-spacer></v-spacer>
      <v-btn color="gray" text icon @click="signInModal = false" style="color:black">
        <v-icon color="grey-lighten">mdi-close</v-icon>
        <v-tooltip activator="parent" location="bottom">Close</v-tooltip>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <img src="/Images/LOGO_2.png" class="hidden-sm-and-down" alt="Logo" height="200" style="margin-top:0px; margin-left:70px" />
      <v-form @submit.prevent="signIn">
        <v-text-field v-model="signInData.email" label="Email" hint="For example, username@example.com" required :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']" prepend-inner-icon="mdi-email" variant="outlined"></v-text-field>
        <v-text-field v-model="signInData.password" label="Password" type="password" required :rules="[v => !!v || 'Password is required']" prepend-inner-icon="mdi-lock" variant="outlined"></v-text-field>
        <!-- Login button with loading state -->
        <v-btn :loading="loading" type="submit" style="border-radius: 2px; width: 100%; text-transform: lowercase; background:#02338D; color: white;">
          <v-icon left style="margin: 3px">mdi-login</v-icon>
          Login
        </v-btn>
        <div class="text-center mt-2">
          <a href="/forgot_password" style="text-decoration: none;color:#02338D" @click="forgotPassword">Forgot Password?</a>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-center">
      <span>&copy; {{ new Date().getFullYear() }} All Rights Reserved</span>
    </v-card-actions>
  </v-card>
</v-dialog>


 <!-- Sign Up Modal -->
 <v-dialog v-model="signUpModal" max-width="700px">
  <v-card style="border-radius: 20px;" elevation="4" height="100%">
    <v-card-title class="text-center" style="color:black;font-weight: 800;">Sign Up</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="signUp">
        <v-text-field v-model="signUpData.name" label="Name" required :rules="[v => !!v || 'Name is required']" variant="outlined"></v-text-field>
        <v-text-field v-model="signUpData.email" label="Email" required :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']" variant="outlined"></v-text-field>
        <v-text-field v-model="signUpData.password" label="Password" type="password" required :rules="[v => !!v || 'Password is required', v => (v && v.length >= 8) || 'Password must be at least 8 characters']" variant="outlined"></v-text-field>
        <v-text-field v-model="signUpData.passwordConfirmation" label="Confirm Password" type="password" required :rules="[v => !!v || 'Confirm Password is required', v => (v && v === signUpData.password) || 'Passwords do not match']" variant="outlined"></v-text-field>
        <v-btn :loading="loading" type="submit" color="success" style="border-radius: 10px; width: 100%;">
          <v-icon>mdi-account-plus</v-icon> Sign Up
        </v-btn>
      </v-form>
      <!-- Sign in with Google button -->
     
    </v-card-text>
  </v-card>
</v-dialog>


<v-snackbar v-model="errorSnackbar" color="error" top>
  {{ errorMessage }}
  <v-btn text @click="errorSnackbar = false" icon elevation="0" color="transparent"><v-icon>mdi-close</v-icon></v-btn>
</v-snackbar>




</template>

<script>
import axiosInstance from '../service/api';


export default {


 
name: 'App',
data() {
 return {
  errorSnackbar: false,
    errorMessage: '',
  recaptchaToken: null,
  showErrorAlert: false,
  loginSuccessAlertVisible: false, // Initially set to false
  registerSuccessAlertVisible: false, // Initially set to false
  loading: false, // Add loading state
   sidebar: false,
   scrolled: false,
   isAuthenticated: false,
   signInModal: false,
   signUpModal: false,
   signUpData: {
    name: '',
      email: '',
      password: '',
      passwordConfirmation: ''
   },
   signInData: {
     email: '',
     password: ''
   },
   currentLanguage: 'en' // Initialize with English
 };
},

mounted() {
 

 
   window.addEventListener('scroll', this.handleScroll);
 },
 beforeDestroy() {
   window.removeEventListener('scroll', this.handleScroll);
 },
methods: {

  async onClick(e) {
      e.preventDefault();
      try {
        this.recaptchaToken = await new Promise(resolve => {
          grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.execute('6Ldu864pAAAAAOjJqb6_RXEIZ5TxnA-kWkkxypZJ', { action: '/feedback' })
              .then(token => resolve(token));
          });
        });
        // Now you have the reCAPTCHA token in this.recaptchaToken
        // You can proceed with any actions you need, such as form submission
      } catch (error) {
        console.error('reCAPTCHA error:', error);
      }
    },
  

 

 handleScroll() {
     // Check if user has scrolled beyond a certain threshold
     this.scrolled = window.scrollY > 50; // Change '50' to the desired scroll threshold
   },
 showSignInModal() {
   this.signInModal = true;
 },
 showSignUpModal() {
   this.signUpModal = true;
 },
 toggleLanguage() {
 // Toggle between English and Pokomo
 this.currentLanguage = this.currentLanguage === 'english' ? 'pokomo' : 'english';
 // Use Languages.js to set the current language
 Languages.setLanguage(this.currentLanguage);
},

 signInWithGoogle() {
 // Load Google API library
 gapi.load('auth2', () => {
   // Initialize GoogleAuth object
   const auth2 = gapi.auth2.init({
     client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
     scope: 'profile email'
   });

   // Sign in the user with Google
   auth2.signIn().then(googleUser => {
     // Retrieve user details
     const profile = googleUser.getBasicProfile();
     const email = profile.getEmail();
     // Now you can handle the sign-in with Google user data as you like
     // For example, you can send the email to your backend for authentication
     this.signInData.email = email;
     // Optionally, close the sign-in dialog
     this.signInModal = false;
   }).catch(error => {
     console.error('Google sign-in error:', error);
   });
 });
},
signIn() {
  this.loading = true;
  axiosInstance.post('/login', this.signInData)
    .then(response => {
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      const role = response.data.role;
      const user = response.data.user; // Assuming the user object is returned in the response

      // Save user data in local storage
      localStorage.setItem('user', JSON.stringify(user));

       // Show v-alert for authentication failure
      

      // Redirect based on user's role
      if (role === 'superadmin') {
        this.$router.push('/superadmin');
      } else if (role === 'admin') {
        this.$router.push('/admin');
      }

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.signInModal = false;
    })
    .catch(error => {
      console.error('Authentication failed:', error.response.data.error);
      this.errorMessage = 'Invalid email or password';
      this.errorSnackbar = true;
      
     

// Hide the alert after 5 seconds
setTimeout(() => {
  this.showErrorAlert = false;
}, 5000);
    
    })
    .finally(() => {
      this.loading = false;
    });
},


    signUp() {
      this.loading = true; // Set loading to true during sign up
      axiosInstance.post('/register', this.signUpData)
        .then(response => {
          console.log('Sign-up successful:', response.data);
          // Show register success alert
          this.registerSuccessAlertVisible = true;

          // Hide the alert after 2 seconds
          setTimeout(() => {
            this.registerSuccessAlertVisible = false;
          }, 2000);
        })
        .catch(error => {
          console.error('Sign-up failed:', error.response.data);
        })
        .finally(() => {
          this.loading = false;
          this.signUpModal = false;
        });
    }

},
watch: {
 // Watch for changes in the router's current route
 '$route'(to, from) {
   // Hide modals when the route changes
   this.signInModal = false;
   this.signUpModal = false;
 }
}


};
</script>

<style>


.menu-btn {
    margin-left: 20px; /* Add margin to the left for menu button */
  }

  .nav-btn {
    margin-left: 10px; /* Add margin between navigation buttons */
    font-weight: 500; /* Button text weight */
    text-transform: capitalize; /* Capitalize button text */
    font-family: 'Poppins', sans-serif; /* Use custom font */
    color: white; /* Button text color */
  }

  .nav-btn:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Add hover effect */
  }

  .btn-icon {
    margin-right: 5px; /* Add margin to separate icon from text */
  }

  /* Logo */
  img {
    margin-top: 20px; /* Adjust logo margin */
  }

  /* Spacer */
  .spacer {
    flex-grow: 1; /* Allow spacer to grow and occupy remaining space */
  }
.sidebar-button {
   text-align: left;
   width: 97%;
   margin: 4px;
 }
 .active-button {
   color: blue !important;
   background:#385cad;
 }

.logo-title-container {
display: flex;
align-items: center;
}

.logo {
height: 50px; /* Adjust the height as needed */
margin-right: 10px; /* Add some margin between logo and title */
}
.lowercase {
text-transform: lowercase;
}

.sidebar-drawer {
 background-color: #282c34; /* Change to your desired background color */
}

.sidebar-item {
 color: black; /* Change to your desired text color */
}

.sidebar-item:hover {
 background-color: #3d4451; /* Change to your desired hover color */
}
.newsletter-subscribe {
 color:#313437;
 padding:50px 0;
 background:#313437;
 border-radius: 180px 180px 0px 0px;
}

.newsletter-subscribe p {
 color:#7d8285;
 line-height:1.5;
}

.newsletter-subscribe h2 {
 font-size:24px;
 font-weight:bold;
 margin-bottom:25px;
 line-height:1.5;
 padding-top:0;
 margin-top:0;
 color:inherit;
}

.newsletter-subscribe .intro {
 font-size:16px;
 max-width:500px;
 margin:0 auto 25px;
}

.newsletter-subscribe .intro p {
 margin-bottom:35px;
}

.newsletter-subscribe form {
 justify-content:center;
}

.newsletter-subscribe form .form-control {
 background:#eff1f4;
 border:none;
 border-radius:3px;
 box-shadow:none;
 outline:none;
 color:inherit;
 text-indent:9px;
 height:45px;
 margin-right:10px;
 min-width:250px;
}

.newsletter-subscribe form .btn {
 padding:16px 32px;
 border:none;
 background:none;
 box-shadow:none;
 text-shadow:none;
 opacity:0.9;
 text-transform:uppercase;
 font-weight:bold;
 font-size:13px;
 letter-spacing:0.4px;
 line-height:1;
}

.newsletter-subscribe form .btn:hover {
 opacity:1;
}

.newsletter-subscribe form .btn:active {
 transform:translateY(1px);
}

.newsletter-subscribe form .btn-primary {
 background-color:#055ada !important;
 color:#fff;
 outline:none !important;
}


.down-logo{
 margin-left:-82px;
} 
.header-info {
 font-size: 14px;
 color:black; /* Adjust color as needed */
 display: flex;
 align-items: center;
 padding-left: 20px;
 background: gold;
}



.custom-divider {
 width: 2px;
 height: 40px; /* Adjust height as needed */
 background-color: black;
 margin: 0 5px;
}
p{
 font-size: 19px;
 text-decoration: none;

}
@media (max-width: 880px) {
 .down-logo{
 margin-left:0px;
}
.newsletter-subscribe {
 color:#313437;
 padding:50px 0;
 background:#313437;
 border-radius: 18px 18px 0px 0px;
}
}


</style>
