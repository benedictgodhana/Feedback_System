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
          <v-text-field label="Category" variant="solo"   prepend-inner-icon="mdi-tag" v-model="selectedFeedback.category_name" readonly></v-text-field>
        </v-col>
        <v-col cols="12" >
          <v-text-field label="SubCategory" variant="solo"   prepend-inner-icon="mdi-tag" v-model="selectedFeedback.subcategory_name" readonly></v-text-field>
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
          <v-btn color="success" @click="replyByEmail(selectedFeedback.email)" style="text-transform:none;width: 100%;"><v-icon>mdi-email</v-icon>Reply to the sender</v-btn>
        </v-col>
  </v-card>
</v-dialog>

  <v-container  style="width:100%; max-width: 1400px;">
    

<v-card width="100%" style="margin-top: -0px;border-radius: 20px 20px 0 0;">
  <v-container>

  
    <v-row>
  <!-- Search text field -->
  <v-col cols="12" md="2">
    <v-text-field
      v-model="search"
      label="Search"
      hide-details
      outlined
      clearable
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      @input="filterFeedback"
    ></v-text-field>
  </v-col>

  <!-- Category select -->
<v-col cols="12" md="2">
  <v-select
    v-model="selectedCategory"
    :items="feedbackCategories"
    item-title="name"
    item-value="id"
    label="Category"
    variant="outlined"
    clearable
    prepend-inner-icon="mdi-arrow-up-down"
    dense
    @change="filterFeedback" 
  ></v-select>
</v-col>


  <!-- Subcategory select -->
  <v-col cols="12" md="2">
    <v-select
      v-model="selectedSubcategory"
      :items="subcategories"
      item-title="name"
      clearable
      item-value="id"
      label="Subcategory"
      variant="outlined"
      prepend-inner-icon="mdi-arrow-up-down"
      dense
      @change="filterFeedback" 
    ></v-select>
  </v-col>

  <!-- Start Date picker -->
  <v-col cols="12" md="2">
    <v-text-field
      v-model="startDate"
      label="Start Date"
      type="date"
      outlined
      variant="outlined"
      @change="filterFeedback"
    ></v-text-field>
  </v-col>

  <!-- End Date picker -->
  <v-col cols="12" md="2">
    <v-text-field
      v-model="endDate"
      label="End Date"
      type="date"
      outlined
      variant="outlined"
      @change="filterFeedback" 
    ></v-text-field>
  </v-col>

  <!-- Export and Reset buttons -->
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
    :search="search"
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
  components: {
    AdminSidebar,
    AdminNavbar,
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
  { title: 'Feedback Category', value: 'category_name' }, // Display category name instead of category_id
  { title: 'Feedback SubCategory', value: 'subcategory_name' }, // Display subcategory name instead of subcategory_id
  { title: 'Subject', value: 'subject' },
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Feedback', value: 'feedback' },
  { title: 'Status', value: 'status' },
  { title: 'Action', value: 'action' },
],

      subcategories: [], // Array to hold subcategories fetched from backend
      feedbacks: [],
      categories: [], // Array to hold categories fetched from backend
      filterDate: null,
      selectedCategory: null,
      selectedSubcategory: null,
      search: '',
      currentPage: 1,
      itemsPerPage: 8, // Display 10 items per page
    };
  },

  mounted() {
    this.fetchCategories();
    this.fetchSubcategories();
    this.fetchFeedbacks();
    this.fetchFilteredFeedback();
  },
  created() {
    this.fetchFeedbacks();
    this.fetchCategories(); // Fetch categories from backend on component creation
    this.fetchSubcategories();

  },

  computed: {
    
    paginatedFeedbacks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredFeedbacks.slice(startIndex, endIndex);
  },
  totalPages() {
    return Math.ceil(this.filteredFeedbacks.length / this.itemsPerPage);
  },

    formattedFeedbacks() {
      return this.feedbacks.map(feedback => {
        feedback.created_at = this.formatTime(feedback.created_at);
        return feedback;
      });
    },
    filteredFeedbacks() {
  let filteredFeedbacks = this.feedbacks;

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

  if (this.selectedSubcategory) {
    filteredFeedbacks = filteredFeedbacks.filter(feedback => feedback.subcategory_id === this.selectedSubcategory);
  }

  if (this.startDate) {
    const startDate = new Date(this.startDate);
    filteredFeedbacks = filteredFeedbacks.filter(feedback => {
      const feedbackDate = new Date(feedback.created_at);
      return feedbackDate >= startDate;
    });
  }

  if (this.endDate) {
    const endDate = new Date(this.endDate);
    filteredFeedbacks = filteredFeedbacks.filter(feedback => {
      const feedbackDate = new Date(feedback.created_at);
      return feedbackDate <= endDate;
    });
  }

  return filteredFeedbacks;
},

  },
 
  watch: {
  selectedCategory(newValue, oldValue) {
    console.log('Selected category changed:', newValue); // Add this line
    if (newValue !== oldValue) {
      this.fetchSubcategories(); // Fetch subcategories when the selected category changes
      this.fetchFilteredFeedback(); // Fetch filtered feedback when the selected category changes
    }
  }
},




  methods: {


    resetFilters() {
    // Reset all filter variables to their initial state
    this.search = '';
    this.selectedCategory = null;
    this.selectedSubcategory = null;
    this.startDate = null;
    this.endDate = null;

    // Refetch feedbacks after resetting filters
    this.fetchFeedbacks();
  },

  async filterFeedback() {
  try {
    // Construct request payload with filter parameters
    const filters = {
      search: this.search,
      category: this.selectedCategory, // Include selected category
      subcategory: this.selectedSubcategory,
      startDate: this.startDate,
      endDate: this.endDate
    };

    // Send request to backend to fetch filtered feedback
    const response = await axiosInstance.post('/feedback/filter', filters);

    // Assuming response.data contains filtered feedback items
    this.filteredFeedbacks = response.data;
  } catch (error) {
    console.error('Error filtering feedback:', error);
    // Handle error (e.g., show error message to the user)
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
        const updatedStatus = { status: this.selectedFeedback.status };

        const response = await axiosInstance.put(`/feedback/update-status/${feedbackId}`, updatedStatus);

        if (response && response.data) {
          console.log("Feedback status updated successfully", response.data);
          this.alert = { show: true, type: 'success', message: 'Feedback status updated successfully.' };
          this.dialogVisible = false;
          this.fetchFeedbacks();
        }
      } catch (error) {
        console.error("Error updating feedback status:", error);
        this.alert = { show: true, type: 'error', message: 'Error updating feedback status.' };
      }
    },
    async exportFeedback(filteredFeedback) {
      try {
        // If there are no filtered feedback items, show a message to the user
        if (filteredFeedback.length === 0) {
          console.log("No filtered feedback to export");
          // Show a message or notification to the user indicating no filtered feedback to export
          return;
        }

        // Perform export operation
        const formData = new FormData();
        formData.append('filteredFeedback', JSON.stringify(filteredFeedback));

        const response = await axiosInstance.post('/filteredfeedback/export', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'filtered_feedback.xlsx');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error exporting filtered feedback:', error);
        // Handle error (e.g., show error message to the user)
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



    
async fetchCategories() {
  try {
    const response = await axiosInstance.get('/feedback-categories');
    this.feedbackCategories = response.data;
    console.log('Feedback categories:', this.feedbackCategories); // Add this line
  } catch (error) {
    console.error('Error fetching feedback categories:', error);
  }
},
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

async fetchFilteredFeedback() {
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
    const response = await axiosInstance.post('/feedback/filter', filters);

    // Transform the data to include category and subcategory names
    const transformedData = response.data.map(item => ({
      ...item,
      category_name: item.category ? item.category.name : '', // Assuming category contains a 'name' field
      subcategory_name: item.subcategory ? item.subcategory.name : '' // Assuming subcategory contains a 'name' field
    }));

    // Update the feedbacks data property with the transformed data
    this.feedbacks = transformedData;
  } catch (error) {
    console.error('Error fetching filtered feedback:', error);
    // Handle error (e.g., show error message to the user)
  }
},





async fetchFeedbacks() {
  try {
    const response = await axiosInstance.get('/feedbacks');
    if (Array.isArray(response.data)) {
      // Update feedbacks data property with the fetched data
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


  },


  
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