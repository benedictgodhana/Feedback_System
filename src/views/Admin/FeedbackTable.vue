<template>
    <!-- Navigation bar -->
    <AdminNavbar></AdminNavbar>
  
    <!-- Sidebar -->
    <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />
  
  
    <v-dialog v-model="dialogVisible" max-width="600" landscape>
    
    <template v-slot:activator="{ on }"></template>
    <v-card width="800" style="max-width: 1900px;" elevation="4">
      <v-toolbar>
        <v-card-title style="margin-left: 20px;">View Details</v-card-title>
        <v-spacer></v-spacer>
        <v-btn color="black" @click="dialogVisible = false" icon="mdi-close"></v-btn>
  
      </v-toolbar>
      
      <v-card-text>
        <v-row>
          <v-col cols="12" >
            <v-text-field label="Category" variant="solo"   prepend-inner-icon="mdi-tag" v-model="selectedFeedback.category_id" readonly></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Subject"  variant="solo" v-model="selectedFeedback.subject" readonly  prepend-inner-icon="mdi-text"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Name"  variant="solo" prepend-inner-icon="mdi-account" v-model="selectedFeedback.name" readonly></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Email"  variant="solo" v-model="selectedFeedback.email" readonly   prepend-inner-icon="mdi-email"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea label="Feedback"   variant="solo" v-model="selectedFeedback.feedback" readonly  prepend-inner-icon="mdi-text"
                              ></v-textarea>
          </v-col>
          
          <!-- Edit form to change status -->
          <v-col cols="12">
            <v-select
              label="Status"
              v-model="selectedFeedback.status"
              :items="statusOptions"
              variant="outlined"
            ></v-select>
          </v-col>
          
          <!-- Reply button if email is submitted -->
         
        </v-row>
      </v-card-text>
      <v-card-actions style="margin:4px">
        <v-btn color="white" @click="updateFeedbackStatus" style="background: #385cad;width:100%;text-transform: capitalize;"><v-icon>mdi-check</v-icon>Update Status</v-btn>
  
      </v-card-actions>
      <v-col cols="12" v-if="selectedFeedback.email">
            <v-btn color="success" @click="replyByEmail(selectedFeedback.email)" style="text-transform: capitalize;width: 100%;"><v-icon>mdi-email</v-icon>Reply</v-btn>
          </v-col>
    </v-card>
  </v-dialog>
    <v-container  style="width:100%; max-width: 1400px;">
      
  
  
  <v-card variant="outlined" style="width:100%; margin: 20px auto;" elevation="0">
    <v-card-title style="background:#385cad;color:white" class="text-center">{{ selectedCategory }} Feedback</v-card-title>
  
    <v-container style="width: 100%;max-width: 1000;">
  
  
  <v-row justify="space-between" class="mb-4">
    <!-- Reset button -->
    
    <v-spacer></v-spacer>
  
    <!-- Download Report button -->
    <v-col cols="12" md="3">
      <v-btn color="green" block outlined @click="exportFeedback">
        <v-icon left>mdi-file-excel</v-icon>Download Report
      </v-btn>
    </v-col>
  </v-row>
      <v-row justify="space-between" class="mb-4">
    <!-- Search text field -->
    <v-col cols="12" md="">
      <v-text-field
        v-model="search"
        label="Search"
        hide-details
        class="text-field"
        outlined
        clearable
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
  
      ></v-text-field>
    </v-col>


    <v-col cols="12" md="5">
    <v-select
      v-model="filterSubCategory"
      :items="subcategories"
      item-text="name"
      item-value="id"
      label="Filter by SubCategory"
      clearable
      prepend-inner-icon="mdi-tag"

      class="text-field"
      variant="outlined"
    ></v-select>
  </v-col>
  
    <!-- Category select -->
    
  </v-row>
  
  <v-row justify="space-between" class="mb-4">
    <!-- Start date picker -->
    <v-col cols="12" md="5">
      <v-text-field
        v-model="startDate"
        label="Start Date"
        type="date"
        class="text-field"
        variant="outlined"
  
      ></v-text-field>
    </v-col>
  
    <!-- End date picker -->
    <v-col cols="12" md="5">
      <v-text-field
        v-model="endDate"
        label="End Date"
        type="date"
        class="text-field"
        variant="outlined"
  
      ></v-text-field>
    </v-col>
  </v-row>
  
  
  
  <br>
     
  <v-table  density="compact" style="text-transform: none;">
    <thead style="background-color: #385cad;height:60px;color: aliceblue;font-size: 16px;">
      <tr>
        <th class="text-left">Category</th>
        <th class="text-left">SubCategory</th>
        <th class="text-left">Subject</th>
        <th class="text-left">Name</th>
        <th class="text-left">Email</th>
        <th class="text-left">Feedback</th>
        <th class="text-left">Status</th>
        <th class="text-left">Action</th>
      </tr>
    </thead>
    <tbody style="font-size: 15px;">
    <tr v-for="item in paginatedFeedbacks" :key="item.id">
      <td>{{ item.category_id }}</td>
      <td>{{ item.subcategory_id }}</td>
      <td>{{ item.subject }}</td>
      <td>{{ item.name }}</td>
      <td>{{ item.email }}</td>
      <td>{{ item.feedback }}</td>
      <td>{{ item.status }}</td>
      <td>
        <v-btn icon @click="viewFeedback(item)" aria-label="View feedback" elevation="0">
          <v-icon color="#385cad">mdi-eye</v-icon>
        </v-btn>
      </td>
    </tr>
  
    <v-pagination
    v-model="currentPage"
    :length="totalPages"
    @input="onPageChange"
    class="my-4"
    elevation="2"
    color="primary"
    rounded="circle"
    prev-icon="mdi-chevron-left"
    next-icon="mdi-chevron-right"
  >
    
  </v-pagination>
  
  </tbody>
  
  
  
  </v-table>
  
  </v-container>
    
  </v-card>
  
  </v-container>
  
  <v-footer style="background-color: #385cad;">
        <!-- Your footer content here -->
        <p style="color:white;font-size: 15px;text-transform: none  ;">&copy; 2024 @iLabAfrica, Strathmore University. All rights reserved.</p>
      </v-footer>
  </template>
  
  <script>
  import AdminSidebar from '@/components/AdminSidebar.vue';
  import AdminNavbar from '@/components/AdminNavbar.vue';
  import axiosInstance from '@/service/api';
  
  export default {
    components: {
      AdminSidebar,
      AdminNavbar,
    },
    data() {
      return {
        selectedCategory: null, // Initialize selected category
        alert: {
        show: false,
        message: '',
        type: 'success' // Can be 'success', 'info', 'warning', 'error'
      },
        startDate: null,
        endDate: null,
        sidebar: true,
        dialogVisible: false,
        selectedFeedback: {},
        statusOptions: ['Pending', 'Resolved', 'In Progress', 'Closed'], // Status options for the select dropdown
        tableHeaders: [
          { title: 'Feedback Category', value: 'category_id' },
          { title: 'Category Specification(Other)', value: 'other_category' },
          { title: 'Subject', value: 'subject' },
          { title: 'Name', value: 'name' },
          { title: 'Email', value: 'email' },
          { title: 'Feedback', value: 'feedback' },
          { title: 'Status', value: 'status' },
          { title: 'Action', value: 'action' },
        ],
        feedbacks: [],
        categories: [], // Array to hold categories fetched from backend
        filterDate: null,
        filterCategory: null,
        search: '',
        currentPage:1,    
         itemsPerPage: 8, // Display 10 items per page
      };
    },
  
    mounted() {
      this.fetchCategories();
      this.fetchFeedbacks();
    },
    created() { 
      this.selectedCategory = this.$route.params.category;  
      this.fetchFeedbacks();
      this.fetchCategories(); // Fetch categories from backend on component creation
    },
  
    computed: {
  
      
  
      paginatedFeedbacks() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredFeedbacks.slice(startIndex, endIndex);
      },
      // Calculate total pages based on the number of items and itemsPerPage
      totalPages() {
        return Math.ceil(this.filteredFeedbacks.length / this.itemsPerPage);
      },
  
      formattedFeedbacks() {
        return this.feedbacks.map(feedback => {
          // Format the created_at timestamp to display time in either AM or PM format
          feedback.created_at = this.formatTime(feedback.created_at);
          return feedback;
        });
      },
      filteredFeedbacks() {
        let filteredFeedbacks = this.feedbacks;
  
        // Filter by search query
        if (this.search) {
          filteredFeedbacks = filteredFeedbacks.filter(feedback => {
            return Object.values(feedback).some(value =>
              typeof value === 'string' && value.toLowerCase().includes(this.search.toLowerCase())
            );
          });
        }
  
        if (this.selectedCategory) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => feedback.category_id === this.selectedCategory);
    }

  
        // Filter by start date
        if (this.startDate) {
          const startDate = new Date(this.startDate);
          filteredFeedbacks = filteredFeedbacks.filter(feedback => {
            const feedbackDate = new Date(feedback.created_at); // Assuming there's a 'date' property in your feedback object
            return feedbackDate >= startDate;
          });
        }
  
        // Filter by end date
        if (this.endDate) {
          const endDate = new Date(this.endDate);
          filteredFeedbacks = filteredFeedbacks.filter(feedback => {
            const feedbackDate = new Date(feedback.created_at); // Assuming there's a 'date' property in your feedback object
            return feedbackDate <= endDate;
          });
        }
  
        return filteredFeedbacks;
      },
    },
  
    methods: {
  
      onPageChange(page) {
        this.currentPage = page;
      },
      formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    },
      async updateFeedbackStatus() {
    if (!this.selectedFeedback || !this.selectedFeedback.id) {
      console.error("No feedback selected for updating status.");
      this.alert = { show: true, type: 'error', message: 'No feedback selected for updating status.' };
      return;
    }
  
    try {
      const feedbackId = this.selectedFeedback.id;
      const updatedStatus = { status: this.selectedFeedback.status }; // Assuming status is the only field being updated
  
      const response = await axiosInstance.put(`/feedback/update-status/${feedbackId}`, updatedStatus);
  
      if (response && response.data) {
        console.log("Feedback status updated successfully", response.data);
        this.alert = { show: true, type: 'success', message: 'Feedback status updated successfully.' };
        this.dialogVisible = false; // Assuming you have a dialog that should be closed upon success
        this.fetchFeedbacks(); // Assuming this method refreshes the list of feedback
      }
    } catch (error) {
      console.error("Error updating feedback status:", error);
      this.alert = { show: true, type: 'error', message: 'Error updating feedback status.' };
    }
  },
  
  
  
    async exportFeedback() {
      try {
        const response = await axiosInstance.get('/feedback/export', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'feedback.xlsx');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error exporting feedback:', error);
      }
    },
  
  
  
      applyDateFilter() {
      // Filter the feedbacks based on the date range
      this.feedbacks = this.feedbacks.filter(feedback => {
        const feedbackDate = new Date(feedback.date);
        return (!this.startDate || feedbackDate >= this.startDate) &&
               (!this.endDate || feedbackDate <= this.endDate);
      });
      // Close the date menu
      this.menuDate = false;
    },
    resetDateFilter() {
      // Reset the date filter and fetch the feedbacks again
      this.startDate = null;
      this.endDate = null;
      this.menuDate = false;
      this.fetchFeedbacks();
    },  
      async fetchCategories() {
    try {
      const response = await axiosInstance.get('/feedback-categories');
      // Assuming the response contains an array of category objects with a 'name' property
      this.categories = response.data.map(category => category.name);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },
  
     async fetchFeedbacks() {
    try {
      const response = await axiosInstance.get('/feedbacks');
      if (Array.isArray(response.data)) {
        // Sort feedbacks by createdAt date, newest first
        this.feedbacks = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        console.error('Error: Response data is not an array for feedbacks');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  },
  
      viewFeedback(item) {
        this.selectedFeedback = item;
        this.dialogVisible = true;
      },
      replyByEmail(email) {
        const senderEmail = 'bdhadho@strathmore.edu';
        const subject = 'Reply to Feedback';
        const body = 'Enter your reply here.';
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}&cc=${senderEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl);
      },
      // Filter feedbacks based on date, category, and search query
     
  
      
    }
  };
  </script>
  
  
  <style>
  .professional-table thead tr {
    background-color: #385cad;
    color: white;
    text-transform: capitalize;
  }
  
  .professional-table tbody tr:nth-child(odd) {
    background-color: #f2f2f2; /* Light grey background for odd rows */
  }
  
  .professional-table th,
  .professional-table td {
    padding: 8px; /* Adjust based on preference */
    text-align: left; /* Ensure consistent alignment */
  }
  .text-field {
    max-width: 100%;
  }
  
  /* Optional: Adjust spacing if needed */
  .mb-4 {
    margin-bottom: 1.5rem;
  }
  
  
  /* Responsive table styles */
  @media screen and (max-width: 600px) {
    .professional-table {
      display: block;
      overflow-x: auto; /* Allows table to scroll horizontally on small screens */
    }
  }
  
  </style>