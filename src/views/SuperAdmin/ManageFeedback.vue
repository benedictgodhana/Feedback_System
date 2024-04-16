<template>
  <!-- Navigation bar -->
  <SuperAdminNavbar></SuperAdminNavbar>

  <!-- Sidebar -->
  <SuperAdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

  <v-container  style="width:100%; max-width: 100%;">
    <v-dialog v-model="dialogVisible" max-width="600" landscape>
  <template v-slot:activator="{ on }"></template>
  <v-card style="width:100%;margin-top: 60px;" elevation="4">
    <v-card-title  class="text-center" style="background:#385cad;color:white">Feedback Details</v-card-title>
    
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field label="Category" variant="outlined" v-model="selectedFeedback.category_id" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="Subject"  variant="outlined" v-model="selectedFeedback.subject" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="Name"  variant="outlined" v-model="selectedFeedback.name" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field label="Email"  variant="outlined" v-model="selectedFeedback.email" readonly></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea label="Feedback"   variant="outlined" v-model="selectedFeedback.feedback" readonly></v-textarea>
        </v-col>
        
        <!-- Edit form to change status -->
        <v-col cols="12">
          <v-select
            label="Status"
            v-model="selectedFeedback.status"
            :items="statusOptions"
            outlined
          ></v-select>
        </v-col>
        
        <!-- Reply button if email is submitted -->
        <v-col cols="12" v-if="selectedFeedback.email">
          <v-btn color="success" @click="replyByEmail(selectedFeedback.email)" style="text-transform: capitalize;width: 100%;"><v-icon>mdi-email</v-icon>Reply</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="white" @click="updateFeedbackStatus" style="background: #385cad;width: 100%;text-transform: capitalize;"><v-icon>mdi-check</v-icon>Update Status</v-btn>
      <v-btn color="white" @click="dialogVisible = false" style="background: red;width: 100%;text-transform: capitalize;"><v-icon>mdi-window-close</v-icon>Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>



  <v-card variant="outlined"  style="width: 90%; margin-top: 20px;margin-left: 20px;" elevation="4">
    <v-card-title style="background:#385cad;color:white">Feedback table</v-card-title>

    <v-row class="px-4" align="center" justify="start">
  <v-col>
    <!-- Search text field -->
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      class="mx-2"
      variant="outlined"
      style="max-width:1000px;width:100%;"

    ></v-text-field>
  </v-col>

  <v-col>
    <!-- Category select -->
    <v-select
      v-model="filterCategory"
      :items="categories"
      item-text="name"
      item-value="id"
      label="Filter by Category"
      single-line
      clearable
      class="mx-2"
      style="max-width:700px;width:100%;margin-top: 20px;text-transform: none;"
      variant="outlined"
    ></v-select>
  </v-col>
  <br>
</v-row>


  <v-row class="px-4" align="center" justify="start">
            <v-col>
              <!-- Start date picker -->
              <v-text-field
                v-model="startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                style="max-width:1000px;width:100%;margin-left: 10px;"

              ></v-text-field>
            </v-col>
            <v-col>
              <!-- End date picker -->
              <v-text-field
                v-model="endDate"
                label="End Date"
                type="date"
                variant="outlined"
                style="max-width:1000px;width:100%;"


              ></v-text-field>
              
            </v-col>
            

           
          </v-row>

          
          <br>
          <!-- Reset button -->
          <v-btn @click="resetDateFilter" color="#EC7D30" width="100%" style="max-width: 1350px;margin-left: 20px;"><v-icon left>mdi-refresh</v-icon>Reset</v-btn>
          <br>
          <br>
          <v-btn color="green" @click="exportFeedback" width="100%" style="max-width: 1350px;margin-left: 20px;">
  <v-icon left>mdi-file-excel</v-icon>
  Print XLS
</v-btn>


 


    <v-card-text style="margin-top: 20px;">
     

       <v-data-table
    :headers="tableHeaders"
    :items="filteredFeedbacks" 
    item-key="id"
    class="custom-data-table"
    style="width: 100%;"

    

  >
  
        <template v-slot:item.action="{ item }">
          <v-btn color="transparent" elevation="0" @click="viewFeedback(item)" style="text-transform: lowercase;"><v-icon color="#385cad">mdi-eye</v-icon></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

</v-container>
<v-footer style="background-color: #385cad;">
      <!-- Your footer content here -->
      <p style="color:white;font-size: 15px;text-transform: none  ;">&copy; 2024 @iLabAfrica, Strathmore University. All rights reserved.</p>
    </v-footer>
</template>

<script>
import SuperAdminSidebar from '@/components/SuperAdminSidebar.vue';
import SuperAdminNavbar from '@/components/SuperAdminNavbar.vue';
import axiosInstance from '@/service/api';

export default {
  components: {
    SuperAdminSidebar,
    SuperAdminNavbar,
  },
  data() {
    return {
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
    };
  },

  mounted() {
    this.fetchCategories();
    this.fetchFeedbacks();
  },
  created() { 
    this.fetchFeedbacks();
    this.fetchCategories(); // Fetch categories from backend on component creation
  },

  computed: {

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

      // Filter by category
      if (this.filterCategory) {
        filteredFeedbacks = filteredFeedbacks.filter(feedback => feedback.category_id === this.filterCategory);
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


