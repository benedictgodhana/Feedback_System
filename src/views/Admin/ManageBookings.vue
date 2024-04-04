<template>
    <v-container>
      <!-- Navigation bar -->
      <AdminNavbar></AdminNavbar>
  
      <!-- Sidebar -->
      <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />
  
      <!-- Search form -->
  
      <v-alert v-model="updateSuccessAlertVisible" type="success" dismissible>
      User data updated successfully!
    </v-alert>

    <!-- Snackbar for adding user -->
    <v-alert v-model="addSuccessSnackbarVisible" color="success">
      User added successfully!
    </v-alert>
    
      <!-- Vuetify datatable to display user details -->
      <v-card variant="outlined" style="width: 100%; margin-top: 20px;">
       

        <v-card-title style="background: yellow;">Bookings Table</v-card-title>
        <v-card-text style="margin-top: 20px;">
          <v-text-field v-model="search" label="Search" variant="outlined"></v-text-field>
          <v-btn @click="clearSearch" color="success" style="border-radius: 5px;text-transform: capitalize;" class="mr-4"><span class="mdi mdi-backspace-reverse"></span>Clear</v-btn>
          <v-btn @click="openAddUserDialog" color="primary" style="border-radius: 5px;text-transform: capitalize;"><span class="mdi mdi-account-plus-outline"></span>Add User</v-btn>
        </v-card-text>
        <v-card-text style="margin-top: 20px;">
          <v-data-table
            :headers="headers"
            :items="filteredUsers"
            item-key="id"
            style="text-transform:none; width: 100%;"
          >
            <template v-slot:item.action="{ item }">
              <v-btn color="primary" class="mr-4" @click="openEditDialog(item)" style="text-transform:capitalize;"><span class="mdi mdi-pencil"></span>Edit</v-btn>
              <v-btn color="error" @click="deleteUserDialog(item)"  style="text-transform:capitalize;"><span class="mdi mdi-delete"></span>Delete</v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
  
      <!-- Edit User Dialog -->
      <v-dialog v-model="editUserDialogVisible" max-width="600">
  <v-card>
    <v-card-title>Edit User</v-card-title>
    <v-card-text>
      <v-form ref="editForm" @submit.prevent="submitEditUser">
        <v-text-field v-model="editedUser.name" label="Name" required></v-text-field>
        <v-text-field v-model="editedUser.email" label="Email" required></v-text-field>
        <v-select
          v-model="editedUser.role"
          :items="roles"
          label="Role"
          item-text="name"
          item-value="id"
          required
        ></v-select>
        <v-text-field v-model="editedUser.password" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" :type="showPassword ? 'text' : 'password'" required></v-text-field>
        <v-text-field v-model="confirmPassword" label="Confirm Password" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showConfirmPassword = !showConfirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required></v-text-field>
        <!-- Add more text fields for other editable fields -->

        <!-- Add more text fields as needed -->
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="submitEditUser">Save</v-btn>
      <v-btn @click="cancelEditUser">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  
      <!-- Delete User Dialog -->
      <v-dialog v-model="deleteUserDialogVisible" max-width="600">
        <v-card>
          <v-card-title>Delete User</v-card-title>
          <v-card-text>
            <p>Are you sure you want to delete this user?</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteUser">Delete</v-btn>
            <v-btn @click="deleteUserDialogVisible = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addUserDialogVisible" max-width="600">
  <v-card>
    <v-card-title>Add User</v-card-title>
    <v-card-text>
      <v-form ref="addUserForm" >
        <v-text-field v-model="newUser.name" label="Name" required></v-text-field>
        <v-text-field v-model="newUser.email" label="Email" required></v-text-field>
        <v-select
          v-model="newUser.role"
          :items="roles"
          label="Role"
          item-text="name"
          item-value="id"
          required
        ></v-select>
        <v-text-field v-model="newUser.password" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" :type="showPassword ? 'text' : 'password'" required></v-text-field>
        <v-text-field v-model="confirmPassword" label="Confirm Password" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showConfirmPassword = !showConfirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required></v-text-field>

        <!-- Add more fields as needed -->
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="submitAddUser">Save</v-btn>
      <v-btn @click="cancelAddUser">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>



      <!-- Success Alert -->
      
    </v-container>
  </template>
  
  <script>
  import AdminSidebar from '@/components/AdminSidebar.vue';
  import AdminNavbar from '@/components/AdminNavbar.vue';
  import axiosInstance from '@/service/api'; // Corrected import path
  
  export default {
    components: {
      AdminSidebar,
      AdminNavbar,
    },
    data() {
      return {
        sidebar: true, // Initialize the sidebar as open
        users: [], // Initialize an empty array for user details
        roles: [], // Initialize an empty array for role options
        search: '', // Initialize search string
        headers: [
          { title: 'ID', value: 'id' },
          { title: 'Name', value: 'name' },
          { title: 'Email', value: 'email' },
          { title: 'Role', value: 'role' },
          { title: 'Action', value: 'action' },
          // Add more headers as needed
        ],
        editUserDialogVisible: false, // Whether edit user dialog is visible
        deleteUserDialogVisible: false, // Whether delete user dialog is visible
        addUserDialogVisible: false, // Whether add user dialog is visible
        selectedUser: null, // Currently selected user for editing or deleting  
        editedUser: {
          id: null,
          name: '',
          email: '',
          password:'',
          role: null, // Initialize to null
          // Other fields...
        },
        newUser: {
          name: '',
          email: '',
          password:'',
          role: '', // Initialize role properly        
          // Other fields...
        },

        confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      updateSuccessAlertVisible: false, // Whether update success alert is visible
      addSuccessSnackbarVisible: false, // Whether add success snackbar is visible
      };
    },
    created() {
      // Fetch user details from the backend when the component is created
      this.fetchUsers();

      // Fetch role options from the backend
      this.fetchRoles();
    },
    computed: {
      filteredUsers() {
        // Filter users based on search string
        return this.users.filter(user =>
          user.name.toLowerCase().includes(this.search.toLowerCase())
        );
      },
    },
    methods: {
      async fetchRoles() {
      try {
        // Fetch role options from the backend
        const response = await axiosInstance.get('/roles');

        // Extract role names from the response data
        this.roles = response.data.roles.map(role => role.name);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },
     
      openEditDialog(user) {
        // Set editedUser to the clicked user's data
        this.editedUser = { ...user };
        // Set edit dialog visibility to true
        this.editUserDialogVisible = true;
      },

      openAddUserDialog() {
        // Set add user dialog visibility to true
        this.addUserDialogVisible = true;
      },
      
      cancelEditUser() {
        // Reset editedUser
        this.editedUser = {
          id: null,
          name: '',
          email: '',
          password:null,
          role: null,
          // Other fields...
        };
        // Close edit dialog
        this.editUserDialogVisible = false;
      },
      
      toggleSidebar() {
        // Method to toggle the sidebar
        this.sidebar = !this.sidebar;
      },
      
      async fetchUsers() {
        try {
          const response = await axiosInstance.get('/users');
          console.log('API Response:', response.data); // Log the response data
          if (Array.isArray(response.data.users)) {
            // Map the users array to include the role information
            this.users = response.data.users.map(user => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.roles.map(role => role.name).join(', '), // Concatenate roles with comma
              // Add more properties as needed
            }));
          } else {
            console.error('Unexpected API response format: users array not found');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
      
      clearSearch() {
        // Method to clear the search string
        this.search = '';
      },
      
      deleteUserDialog(user) {
        // Method to open delete user dialog
        this.selectedUser = user;
        this.deleteUserDialogVisible = true;
      },
      
      async submitEditUser() {
    try {
      // Check if password and confirm password are non-empty and match
      if (this.editedUser.password !== '' && this.editedUser.password !== this.confirmPassword) {
        // Display error message
        return; // Stop further execution
      }

      // Make an API call to update user data
      const response = await axiosInstance.put(`/users/${this.editedUser.id}`, this.editedUser);
      console.log('User updated:', response.data);
      // Close edit dialog
      this.editUserDialogVisible = false;
      // Optionally, you can refresh the user list
      this.fetchUsers();
      // Show success alert
      this.updateSuccessAlertVisible = true;
      // Hide success alert after 4 seconds
      setTimeout(() => {
        this.updateSuccessAlertVisible = false;
      }, 4000);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  },
      
      deleteUser() {
        // Method to handle deleting user
        console.log('Delete user:', this.selectedUser);
        // Perform delete operation (e.g., send delete request to backend)
        // Close delete user dialog
        this.deleteUserDialogVisible = false;
      },

      async submitAddUser() {
      try {
        // Make an API call to add the new user
        const response = await axiosInstance.post('/users', this.newUser);
        console.log('User added:', response.data);
        // Display success alert
        this.addSuccessSnackbarVisible = true;
        setTimeout(() => {
          this.addSuccessSnackbarVisible = false;
        }, 4000);
        // Reset newUser
        this.newUser = {
          name: '',
          email: '',
          role: '',
          password: ''
          // Other fields...
        };
        // Close add user dialog
        this.addUserDialogVisible = false;
        // Refresh the user list
        this.fetchUsers();
      } catch (error) {
        console.error('Error adding user:', error);
      }
    },

      cancelAddUser() {
        // Reset newUser
        this.newUser = {
          name: '',
          email: '',
          role: '',
          password:''
          // Other fields...
        };
        // Close add user dialog
        this.addUserDialogVisible = false;
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
  