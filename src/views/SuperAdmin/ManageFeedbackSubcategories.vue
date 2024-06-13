<template>
    <!-- Navigation bar -->
    <SuperAdminNavbar></SuperAdminNavbar>

    <!-- Sidebar -->
    <SuperAdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

    <!-- Search form -->

    <!-- Success Alert for updating service -->
   

    <!-- Vuetify datatable to display service details -->
    <v-card variant="outlined"  style="width: 90%; margin-top: 20px;margin-left: 20px;" elevation="4">
      <v-card-title style="background: #385cad;color:white;">Feedback SubCategories</v-card-title>
      <v-card-text style="margin-top: 20px;">
        <v-text-field v-model="search" label="Search" variant="outlined"></v-text-field>
        <v-btn @click="clearSearch" color="success" style="border-radius: 5px;text-transform: capitalize;" class="mr-4"><span class="mdi mdi-backspace-reverse"></span>Clear</v-btn>
        <v-btn @click="openAddServiceDialog" color="primary" style="border-radius: 5px;text-transform: capitalize;"><span class="mdi mdi-tag"></span>Add Subcategory</v-btn>
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
            <v-text-field v-model="editedService.feedback_category_id" label="Category Title" required></v-text-field>
            <v-text-field v-model="editedService.name" label="SubCategory Title" required></v-text-field>
            <v-text-field v-model="editedService.description" label="Description" required></v-text-field>

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
          <p>Are you sure you want to delete this subcategory?</p>
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
            <v-card-title>Add SubCategory</v-card-title>
            <v-card-text>
                <v-form ref="addServiceForm">
                <v-select :items="categories" item-text="name" item-value="id" v-model="newService.feedback_category_id" label="Category"></v-select>      
                              <v-text-field v-model="newService.name" label="SubCategory Name" required></v-text-field>
                    <v-text-field v-model="newService.description" label="Description" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="submitAddService">Save</v-btn>
                <v-btn @click="cancelAddService">Cancel</v-btn>
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
      sidebar: true,
      services: [],
      categories: [], // Add categories array to store category data
      search: '',
      headers: [
        { title: 'Category Title', value: 'feedback_category_id' },
        { title: 'SubCategory Title', value: 'name' },
        { title: 'SubCategory Description', value: 'description' },
        { title: 'Action', value: 'action' },
      ],
      editServiceDialogVisible: false,
      deleteServiceDialogVisible: false,
      addServiceDialogVisible: false,
      selectedService: null,
      editedService: {
        id: null,
        name: '',
        description: '',
      },
      newService: {
        name: '',
        description: '',
        categoryId: null, // Add categoryId property to newService
      },
      updateSuccessAlertVisible: false,
      addSuccessSnackbarVisible: false,
    };
  },
  created() {
    this.fetchServices();
    this.fetchCategories(); // Fetch categories when component is created
  },
  computed: {
    filteredServices() {
      return this.services.filter(service =>
        service.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    async fetchServices() {
      try {
        const response = await axiosInstance.get('/subcategories');
        if (Array.isArray(response.data)) {
          this.services = response.data.map(service => ({
            id: service.id,
            name: service.name,
            feedback_category_id: service.feedback_category_id,
            description: service.description,
            price: parseFloat(service.price),
          }));
        } else {
          console.error('Unexpected API response format: services array not found');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
    async fetchCategories() {
  try {
    const response = await axiosInstance.get('/feedback-categories');
    if (Array.isArray(response.data)) {
      // Extract only the category names and populate the categories array
      this.categories = response.data.map(category => category.id);
    } else {
      console.error('Unexpected API response format: categories array not found');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
},

    openEditDialog(service) {
      this.editedService = { ...service };
      this.editServiceDialogVisible = true;
    },
    openAddServiceDialog() {
      this.addServiceDialogVisible = true;
    },
    cancelEditService() {
      this.editedService = {
        id: null,
        name: '',
        description: '',
      };
      this.editServiceDialogVisible = false;
    },
    toggleSidebar() {
      this.sidebar = !this.sidebar;
    },
    clearSearch() {
      this.search = '';
    },
    deleteServiceDialog(service) {
      this.selectedService = service;
      this.deleteServiceDialogVisible = true;
    },
    async submitEditService() {
      try {
        const response = await axiosInstance.put(`/feedback-categories/${this.editedService.id}`, this.editedService);
        console.log('Feedback category updated:', response.data);
        this.editServiceDialogVisible = false;
        this.fetchServices();
        this.updateSuccessAlertVisible = true;
        setTimeout(() => {
          this.updateSuccessAlertVisible = false;
        }, 4000);
      } catch (error) {
        console.error('Error updating feedback category:', error);
      }
    },
    async deleteService() {
      try {
        console.log('Delete service:', this.selectedService);
        this.deleteServiceDialogVisible = false;
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    },
    async submitAddService() {
  try {
    // Ensure that categoryId is set in newService
    if (!this.newService.feedback_category_id) {
      // Handle the case where categoryId is not set
      console.error('Feedback category id is required.');
      return;
    }
    
    const response = await axiosInstance.post('/feedback-subcategories', this.newService);
    console.log('Feedback category added:', response.data);
    this.$refs.addServiceForm.reset();
    this.addSuccessSnackbarVisible = true;
    setTimeout(() => {
      this.addSuccessSnackbarVisible = false;
    }, 4000);
    this.addServiceDialogVisible = false;
    this.fetchServices();
  } catch (error) {
    console.error('Error adding feedback category:', error);
  }
},



    cancelAddService() {
      this.newService = { 
        name: '',
        description: '',
      };
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
