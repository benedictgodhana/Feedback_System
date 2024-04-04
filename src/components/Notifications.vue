<template>
    <v-card class="notifications-card">
      <!-- Notification list -->
      <v-list>
        <v-list-item v-for="notification in visibleNotifications" :key="notification.id" class="notification-item">
          <v-list-item-title>{{ notification.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
          <v-btn v-if="!notification.read" @click="markAsRead(notification.id)" style="text-transform: capitalize;margin-left: -14px;color:green;" elevation="0">Mark as Read</v-btn>
          <span v-else style="color:#385cad">Read</span>
        </v-list-item>
      </v-list>
      <v-btn v-if="showMoreButton" @click="showMoreNotifications" class="show-more-button">
        Show More
      </v-btn>
    </v-card>
  </template>
  
  <script>
  import axiosInstance from '@/service/api';
  
  export default {
    data() {
      return {
        notifications: [],
        visibleNotifications: [],
        showMoreButton: false,
        currentPage: 1,
        notificationsPerPage: 5
      };
    },
    mounted() {
      this.fetchNotifications();
    },
    computed: {
      totalPages() {
        return Math.ceil(this.notifications.length / this.notificationsPerPage);
      },
      reversedNotifications() {
        return this.notifications.slice().reverse();
      }
    },
    methods: {
      async markAsRead(notificationId) {
        try {
          await axiosInstance.post(`/notifications/${notificationId}/mark-as-read`);
          this.fetchNotifications();
          this.fetchNotificationCount();
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      },
      async fetchNotifications() {
        try {
          const response = await axiosInstance.get('/notifications');
          this.notifications = response.data;
          this.updateVisibleNotifications();
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      },
      updateVisibleNotifications() {
        const startIndex = (this.currentPage - 1) * this.notificationsPerPage;
        const endIndex = startIndex + this.notificationsPerPage;
        this.visibleNotifications = this.reversedNotifications.slice(startIndex, endIndex);
        this.showMoreButton = this.totalPages > this.currentPage;
      },
      showMoreNotifications() {
        this.currentPage++;
        this.updateVisibleNotifications();
      },
    },
  };
  </script>
  
  <style scoped>
  .notifications-card {
    width: 100%;
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .notification-item {
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0;
  }
  
  .notification-item:last-child {
    border-bottom: none;
  }
  
  .show-more-button {
    margin-top: 20px;
    background-color:#385cad;
    color:white;
    text-transform: capitalize;
  }
  </style>
  