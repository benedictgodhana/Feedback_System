<template>
    <!-- Navigation bar -->
    <SuperAdminNavbar></SuperAdminNavbar>

    <!-- Sidebar -->
    <SuperAdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

    <!-- Search form -->

    <!-- Success Alert for updating service -->
   

    <!-- Vuetify datatable to display service details -->
    <v-card variant="outlined"  style="width: 90%; margin-top: 20px;margin-left: 20px;" elevation="4">
      <v-card-title style="background: #385cad;color:white;">Feedback Categories Table</v-card-title>
      <v-card-text style="margin-top: 20px;">
        <v-text-field v-model="search" label="Search" variant="outlined"></v-text-field>
        <v-btn @click="clearSearch" color="success" style="border-radius: 5px;text-transform: capitalize;" class="mr-4"><span class="mdi mdi-backspace-reverse"></span>Clear</v-btn>
        <v-btn @click="openAddServiceDialog" color="primary" style="border-radius: 5px;text-transform: capitalize;"><span class="mdi mdi-comment"></span>Add Feedback Categories</v-btn>
      </v-card-text>
      <v-card-text style="margin-top: 20px;">
        <v-alert v-model="updateSuccessAlertVisible" type="success" dismissible>
      Feedback category data updated successfully!
    </v-alert>

    <!-- Snackbar for adding service -->
    <v-alert v-model="addSuccessSnackbarVisible" color="success">
      Feedback category added successfully!
    </v-alert>
    <br>
        <v-data-table
          :headers="headers"
          :items="filteredServices"
          item-key="id"
          style="text-transform:none; width: 100%;"
        >
          <template v-slot:item.action="{ item }">
            <v-btn elevation="0" color="transparent"  @click="openEditDialog(item)" style="text-transform:capitalize;"><v-icon color="green">mdi-pen</v-icon></v-btn>
            <v-btn elevation="0" color="transparent" @click="deleteServiceDialog(item)"  style="text-transform:capitalize;"><v-icon color="red">mdi-delete</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Edit Service Dialog -->
    <v-dialog v-model="editServiceDialogVisible" max-width="600">
      <v-card>
        <v-card-title class="text-center" style="background:#385cad;color:white">Edit Feedback Categories</v-card-title>
        <v-card-text>
          <v-form ref="editForm" @submit.prevent="submitEditService">
            <v-text-field v-model="editedService.name" label="Feedback Title" required></v-text-field>
            <v-text-field v-model="editedService.description" label="Feedback Description" required></v-text-field>

            <!-- Add more text fields for other editable fields -->

            <!-- Add more text fields as needed -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" @click="submitEditService" style="background:green;text-transform: capitalize;">Save</v-btn>
          <v-btn  color="white" @click="cancelEditService" style="background: red;text-transform: capitalize;" >Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Service Dialog -->
    <v-dialog v-model="deleteServiceDialogVisible" max-width="600">
      <v-card>
        <v-card-title class="text-center" style="background:#385cad;color:white">Delete Feedback Category</v-card-title>
        <v-card-text>
          <p>Are you sure you want to delete this service?</p>
        </v-card-text>
        <v-card-actions>
          <v-btn  color="error" @click="deleteService">Delete</v-btn>
          <v-btn @click="deleteServiceDialogVisible = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Service Dialog -->
    <v-dialog v-model="addServiceDialogVisible" max-width="600">
      <v-card>
        <v-card-title class="text-center" style="background:#385cad;color:white">Add Feedback Category</v-card-title>
        <v-card-text>
          <v-form ref="addServiceForm">
            <v-text-field v-model="newService.name" label="Feedback Title" required variant="outlined"></v-text-field>
            <v-text-field v-model="newService.description" label="Feedback Description" required variant="outlined"></v-text-field>

            <!-- Add more fields as needed -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="white" @click="submitAddService" style="background:green;text-transform: capitalize;">Save</v-btn>
          <v-btn color="white" @click="cancelAddService" style="background: red;text-transform: capitalize;">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
import SuperAdminSidebar from '@/components/SuperAdminSidebar.vue';
import SuperAdminNavbar from '@/components/SuperAdminNavbar.vue';
import axiosInstance from '@/service/api'; // Corrected import path

export default {
  components: {
    SuperAdminSidebar,
    SuperAdminNavbar,
  },
  data() {
    return {
      sidebar: true, // Initialize the sidebar as open
      services: [], // Initialize an empty array for service details
      search: '', // Initialize search string
      headers: [
      { title: 'Category Title', value: 'name' },
        { title: 'Category Description', value: 'description' },
        
        { title: 'Action', value: 'action' },
        // Add more headers as needed
      ],
      editServiceDialogVisible: false, // Whether edit service dialog is visible
      deleteServiceDialogVisible: false, // Whether delete service dialog is visible
      addServiceDialogVisible: false, // Whether add service dialog is visible
      selectedService: null, // Currently selected service for editing or deleting
      editedService: {
        id: null,
        name: '',
        description: '',
        price:'',
        // Other fields...
      },
      newService: {
        name: '',
        description: '',
        price:'',
        // Other fields...
      },
      updateSuccessAlertVisible: false, // Whether update success alert is visible
      addSuccessSnackbarVisible: false, // Whether add success snackbar is visible
    };
  },
  created() {
    // Fetch service details from the backend when the component is created
    this.fetchServices();
  },
  computed: {
    filteredServices() {
      // Filter services based on search string
      return this.services.filter(service =>
        service.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {

    replyByEmail(email) {
    const senderEmail = 'bdhadho@strathmore.edu';
    const subject = 'Reply to Feedback';
    const body = 'Enter your reply here.';

    // Construct the Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}&cc=${senderEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the Gmail compose URL in a new tab
    window.open(gmailUrl);
  },
    async fetchServices() {
  try {
    // Fetch service details from the backend
    const response = await axiosInstance.get('/feedback-categories');
    console.log('API Response:', response.data); // Log the response data
    if (Array.isArray(response.data)) {
      // Use the response data directly
      this.services = response.data.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
          price: parseFloat(service.price), // Parse price as float
        // Add more properties as needed
      }));
    } else {
      console.error('Unexpected API response format: services array not found');
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
},



    openEditDialog(service) {
      // Set editedService to the clicked service's data
      this.editedService = { ...service };
      // Set edit dialog visibility to true
      this.editServiceDialogVisible = true;
    },

    openAddServiceDialog() {
      // Set add service dialog visibility to true
      this.addServiceDialogVisible = true;
    },

    cancelEditService() {
      // Reset editedService
      this.editedService = {
        id: null,
        name: '',
        description: '',
        // Other fields...
      };
      // Close edit dialog
      this.editServiceDialogVisible = false;
    },

    toggleSidebar() {
      // Method to toggle the sidebar
      this.sidebar = !this.sidebar;
    },

    clearSearch() {
      // Method to clear the search string
      this.search = '';
    },

    deleteServiceDialog(service) {
      // Method to open delete service dialog
      this.selectedService = service;
      this.deleteServiceDialogVisible = true;
    },

    async submitEditService() {
      try {
        // Make an API call to update service data
        const response = await axiosInstance.put(`/feedback-categories/${this.editedService.id}`, this.editedService);
        console.log('Feedback category updated:', response.data);
        // Close edit dialog
        this.editServiceDialogVisible = false;
        // Optionally, you can refresh the service list
        this.fetchServices();
        // Show success alert
        this.updateSuccessAlertVisible = true;
        // Hide success alert after 4 seconds
        setTimeout(() => {
          this.updateSuccessAlertVisible = false;
        }, 4000);
      } catch (error) {
        console.error('Error updating feedback category:', error);
      }
    },
    async deleteService() {
      // Method to handle deleting service
      try {
        console.log('Delete service:', this.selectedService);
        // Perform delete operation (e.g., send delete request to backend)
        // Close delete service dialog
        this.deleteServiceDialogVisible = false;
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    },

    async submitAddService() {
  try {
    // Make an API call to add the new feedback category
    const response = await axiosInstance.post('/feedback-categories', this.newService);
    console.log('Feedback category added:', response.data);
    // Display success message using a snackbar or an alert
    this.$refs.addServiceForm.reset(); // Reset the form
    this.addSuccessSnackbarVisible = true; // Show success snackbar
    setTimeout(() => {
      this.addSuccessSnackbarVisible = false;
    }, 4000); // Hide success snackbar after 4 seconds
    // Close the dialog
    this.addServiceDialogVisible = false;
    // Refresh the feedback categories list
    this.fetchServices();
  } catch (error) {
    console.error('Error adding feedback category:', error);
  }
},

    cancelAddService() {
      // Reset newService
      this.newService = { 
        name: '',
        description: '',
        // Other fields...
      };
      // Close add service dialog
      this.addServiceDialogVisible = false;
    },
  },
};
</script>

<style scoped>
.search-card {
  margin-top: 20px;
  width: 100%;
}
</style>
