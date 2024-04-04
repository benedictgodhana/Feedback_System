<template>
    <div>
      <Navbar></Navbar>
     <EmployeeSidebar/>
      
    </div>
  </template>
  
  <script>
  import axiosInstance from '@/service/api';
  import Navbar from '@/components/AdminNavbar.vue';
  import EmployeeSidebar from '@/components/EmployeeSidebar.vue';

  
  export default {
    components: {
      Navbar,
      EmployeeSidebar
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
  .activity-card .v-card-title {
    font-size: 18px;
    font-weight: bold;
  }
  .activity-card .v-card-text {
    font-size: 16px;
  }
  .about-section {
    padding: 20px;
    margin-top: 30px;
    border-radius: 10px;
  }
  .v-carousel__item img {
    border-radius: 10px;
  }
  .image {
    border-radius: 10px; /* Rounded corners */
    object-fit: cover; /* Ensure the image covers the entire space */
  }
  </style>
  