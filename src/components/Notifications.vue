<template>
  <v-card class="notifications-card">
    <v-toolbar>
      <v-card-title style="margin-left: 100px;">Notifications</v-card-title>
    </v-toolbar>
    <!-- Notification list -->
    <v-list style="max-height: 300px; overflow-y: auto;">
      <v-list-item v-for="notification in notifications" :key="notification.id" prepend-icon="mdi-email"  class="notification-item" @click="navigateToFeedback(notification.feedback_id)">
        <v-list-item-title style="font-weight:500;">{{ notification.feedback.subject }}</v-list-item-title>
        <v-list-item-subtitle>{{ notification.feedback.feedback }}</v-list-item-subtitle>
        <v-list-item-subtitle>{{ formatTime(notification.created_at) }}</v-list-item-subtitle> 
        <v-chip v-if="!notification.read" @click="markAsRead(notification.id, notification.feedback_id)" style="text-transform: capitalize;color:green;" elevation="0">Mark as Read</v-chip>
        <span v-else style="color:#385cad">Read</span>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import axiosInstance from '@/service/api';
export default {
  data() {
    return {
      notifications: [],
    };
  },
  mounted() {
    this.fetchNotifications();
  },
  methods: {
    async markAsRead(notificationId, feedback_id) {
      try {
        await axiosInstance.post(`/notifications/${notificationId}/mark-as-read`);
        this.fetchNotifications();
        this.fetchNotificationCount();
        // Navigate to the feedback page
        this.navigateToFeedback(feedback_id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    async fetchNotifications() {
      try {
        const response = await axiosInstance.get('/notifications');
        // Assuming the API response includes a 'created_at' field for each notification
        this.notifications = response.data.map(notification => ({
          ...notification,
          created_at: new Date(notification.created_at) // Convert timestamp to Date object
        }));
        // Sort notifications by creation time in descending order
        this.notifications.sort((a, b) => b.created_at - a.created_at);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    navigateToFeedback(feedback_id) {
      // Navigate to the feedback page using Vue Router or any other navigation method
      this.$router.push(`/feedback/${feedback_id}`);
    },
    formatTime(timestamp) {
      const now = new Date(); // Current time
      const date = new Date(timestamp);
      const diff = now - date; // Time difference in milliseconds

      const minutes = Math.floor(diff / (1000 * 60)); // Calculate minutes difference

      // Return formatted time based on time difference
      if (minutes < 1) {
        return 'Just now';
      } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
          return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
          const days = Math.floor(hours / 24);
          return `${days} day${days > 1 ? 's' : ''} ago`;
        }
      }
    }
  }
};
</script>
