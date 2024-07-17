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
          <v-col cols="12" >
            <v-text-field label="Subcategory" variant="solo"   prepend-inner-icon="mdi-tag" v-model="selectedFeedback.subcategory_id" readonly></v-text-field>
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
              label="Status of Resolution"
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
      
  
  
  <v-card  style="width:100%; margin: 20px auto;" elevation="4">
  
    <v-container style="width: 100%;max-width: 1400;">
      <v-card-title style="background:#02338D;color:white" class="text-center">{{ selectedCategory }} Feedback</v-card-title>
<br>
  
  
  <v-row >
<!-- Search text field -->
<v-col cols="12" md="3">
<v-text-field
  v-model="search"
  label="Search"
  hide-details
  outlined
  clearable
  variant="outlined"
  style="tex"
  prepend-inner-icon="mdi-magnify"
  
></v-text-field>
</v-col>

<!-- Category select -->
<!-- Category select -->
<!-- <v-col cols="12" md="2">
  <v-select
  v-model="selectedSubcategory"
  :items="subcategories"
  item-text="name"
  item-value="id"
  label="Filter by Sub-Category"
  clearable
  variant="outlined"
  prepend-inner-icon="mdi-tag"
/>


          </v-col> -->
<!-- Start date picker -->
<v-col cols="12" md="2">
<v-text-field
  v-model="startDate"
  label="Start Date"
  type="date"
  outlined
  variant="outlined"

></v-text-field>
</v-col>

<!-- End date picker -->
<v-col cols="12" md="2">
<v-text-field
  v-model="endDate"
  label="End Date"
  type="date"
  outlined
  variant="outlined"

></v-text-field>
</v-col>
<v-col cols="12" md="2" class="d-flex align-center">

<v-btn color="green" style="text-transform: capitalize;margin-top: -36px;" class="mr-4" @click="exportFilteredFeedback">
  <v-icon left>mdi-file-excel</v-icon>Export
</v-btn>

    <v-btn @click="resetFilters" style="margin-top: -36px;" color="red">
      <v-icon>mdi-undo</v-icon>Reset
    </v-btn>
  </v-col>
</v-row>
  
  
    <v-data-table
      :headers="tableHeaders"
      :items="filteredFeedbacks" 
      :page="currentPage"
      item-key="id"
      class="professional-table"
      hide-default-footer
    >
      <template v-slot:item.action="{ item }">
        <v-btn icon @click="viewFeedback(item)" aria-label="View feedback" elevation="0">
          <v-icon color="#385cad">mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  
  </v-container>
    
  </v-card>
  
  </v-container>
  
 
  </template>
  
  <script>
  import AdminSidebar from '@/components/AdminSidebar.vue';
  import AdminNavbar from '@/components/AdminNavbar.vue';
  import axiosInstance from '@/service/api';
  
  export default {


    props: ['category'],
  watch: {
    '$route.params.category': {
      handler(newCategory) {
        this.fetchFeedback(newCategory);
      },
      immediate: true,
    },},
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
        selectedSubcategory: null, // Add selected subcategory
        dialogVisible: false,
        selectedFeedback: {},
        statusOptions: ['Pending', 'Resolved', 'In Progress', 'Closed'], // Status options for the select dropdown
        tableHeaders: [
          { title: 'Feedback Category', value: 'category_id' },
          { title: 'Feedback SubCategory', value: 'subcategory_id' },
          { title: 'Subject', value: 'subject' },
          { title: 'Name', value: 'name' },
          { title: 'Email', value: 'email' },
          { title: 'Feedback', value: 'feedback' },
          { title: 'Status', value: 'status' },
          { title: 'Date Created', value: 'created_at' },
          { title: 'Action', value: 'action' },
        ],
        feedbacks: [],
        categories: [], // Array to hold categories fetched from backend
        filterDate: null,
        filterCategory: null,
        subcategories: [], // Added data property to hold subcategories
        filterSubCategory: null,
        search: '',
        currentPage:1,    
        itemsPerPage: 6, // Display 10 items per page
      };
    },
  
    mounted() {
      this.fetchCategories();
      this.fetchFeedbacks();
      
    },
    created() {
  this.selectedCategory = this.$route.params.category;
  this.fetchCategories();
  this.fetchFeedbacks();
  if (this.selectedCategory) {
    this.fetchSubcategories(this.selectedCategory); // Fetch subcategories based on the selected category
  }
},

    watch: {
// Watch for changes in the selected subcategory
filterSubCategory(subcategoryId) {
    // Refetch feedbacks when selected subcategory changes
    this.fetchFeedbacks();
},

selectedSubcategory(newVal) {
    this.fetchFeedbacks(); // Ensure this method handles cases when newVal is null
  }
},
  
computed: {
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

    // Filter by selected category
    if (this.selectedCategory) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => feedback.category_id === this.selectedCategory);
    }

    // Filter by selected subcategory
    if (this.selectedSubcategory) {
      filteredFeedbacks = filteredFeedbacks.filter(feedback => feedback.subcategory_id === this.selectedSubcategory);
    }

    // Filter by start date
    if (this.startDate) {
      const startDate = new Date(this.startDate);
      filteredFeedbacks = filteredFeedbacks.filter(feedback => {
        const feedbackDate = new Date(feedback.created_at);
        return feedbackDate >= startDate;
      });
    }

    // Filter by end date
    if (this.endDate) {
      const endDate = new Date(this.endDate);
      filteredFeedbacks = filteredFeedbacks.filter(feedback => {
        const feedbackDate = new Date(feedback.created_at);
        return feedbackDate <= endDate;
      });
    }

    return filteredFeedbacks;
  }
},

    methods: {


      onCategoryChange(category) {
    this.selectedCategory = category;
    this.fetchSubcategories(category); // Fetch subcategories when category changes
  },
  async fetchSubcategories(category) {
  try {
    const response = await axiosInstance.get(`/categories/${category}/feedback_sub_categories`);
    this.subcategories = response.data || []; // Fallback to empty array
  } catch (error) {
    console.error('Error fetching subcategories:', error);
  }
},


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
  
  
  
  async exportFilteredFeedback() {
  try {
    // Construct request payload with filter parameters
    const filters = {
      search: this.search,
      category: this.selectedCategory,
      subcategory: this.selectedSubcategory,
      startDate: this.startDate,
      endDate: this.endDate
    };

    // Send request to backend to fetch filtered feedback
    const response = await axiosInstance.post('/feedback/filter/export', filters, {
      responseType: 'blob' // Ensure the response is treated as a blob (e.g., file)
    });

    // Create a blob object from the response data
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a temporary URL for the blob object
    const url = window.URL.createObjectURL(blob);

    // Create a link element and set its attributes for downloading
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filtered_feedback.xlsx');

    // Append the link to the document body and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the temporary URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting filtered feedback:', error);
    // Handle error (e.g., show error message to the user)
  }
},

formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    
    const day = date.getDate();
    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${date.toLocaleDateString('en-US', options).replace(/(\d+)/, `$&${suffix(day)}`)}`;
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
    async resetFilters() {
    // Reset filter-related data properties
    this.search = '';
    this.selectedSubcategory = null;
    this.startDate = null;
    this.endDate = null;

    // Refetch feedback data to reflect the reset state
    await this.fetchFeedbacks();
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
    async exportFilteredFeedback() {
      const filteredData = this.filteredFeedbacks.map(feedback => {
        return {
          category: feedback.category_id,
          subcategory: feedback.subcategory_id,
          subject: feedback.subject,
          name: feedback.name,
          email: feedback.email,
          feedback: feedback.feedback,
          status: feedback.status,
        };
      });

      try {
        const response = await axiosInstance.post('/export', { feedback: filteredData }, { responseType: 'blob' });

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
    async fetchFeedbacks() {
  try {
    // Construct the URL based on the selected subcategory
    let url = '/feedbacks';
    if (this.filterSubCategory) {
      url += `?subcategory_id=${this.filterSubCategory}`;
    }

    const response = await axiosInstance.get(url);
    if (Array.isArray(response.data)) {
      // Format and sort feedbacks by created_at date, newest first
      this.feedbacks = response.data
        .map(feedback => ({
          ...feedback,
          created_at: this.formatDate(feedback.created_at), // Format the date
        }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by formatted date
    } else {
      console.error('Error: Response data is not an array for feedbacks');
    }
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    this.alert = { show: true, type: 'error', message: 'Failed to fetch feedbacks.' }; // Show error alert
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
    background-color:#02338D;
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

  /* Responsive table styles */
  @media screen and (max-width: 600px) {
    .professional-table {
      display: block;
      overflow-x: auto; /* Allows table to scroll horizontally on small screens */
    }
  }
  
  </style>