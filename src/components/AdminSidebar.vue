<template>
  <v-navigation-drawer v-model="sidebar" app class="sidebar-drawer hidden-sm-and-down" style="background-color:white;" elevation="4">
    <v-list nav>
      <!-- Dashboard -->
      <v-list-item to="/admin" prepend-icon="mdi-view-dashboard" title="Dashboard" color="white" elevation="0" active-class="active-button"></v-list-item>

      <!-- Manage Feedback -->

      <!-- Categories -->
      <v-list-group value="Categories">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Feedback Categories" prepend-icon="mdi-tag" color="white" active-class="active-button"></v-list-item>
        </template>
        <v-list-item to="/admin/manage-feedback" prepend-icon="mdi-email" title="All Feedback" color="white" elevation="0" active-class="active-button"></v-list-item>

        <v-list-item prepend-icon="mdi-tag" v-for="(category, index) in categories" :key="index" @click="navigateToCategory(category.name)">
          <v-list-item-content>
            <v-list-item-title >{{ category.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <!-- Logout -->
      <v-list-item @click="logout" prepend-icon="mdi-logout" title="Logout" style="background-color:#02338D;color:white" elevation="0"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import axiosInstance from '../service/api';

export default {
  data() {
    return {
      sidebar: true, // Set sidebar to be open by default
      categories: [],
      categoryOpen: false,
    };
  },
  created() {
    this.fetchCategories(); // Fetch categories when component is created
  },
  methods: {
    async navigateToCategory(categoryName) {
      this.$router.push({ name: 'FeedbackTable', params: { category: categoryName } });
    },
    async fetchCategories() {
      try {
        const response = await axiosInstance.get('/feedback-categories');
        this.categories = response.data; // Assuming response contains category objects with 'name' and 'slug' properties
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async logout() {
      try {
        const authToken = localStorage.getItem('token');
        await axiosInstance.post('/logout', null, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        this.$router.push('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    },
  },
};
</script>

<style scoped>
.sidebar-button {
  text-align: left;
  font-weight: 500;
  font-family: 'Poppins';
}

.active-button {
  background:#02338D;
}
</style>
