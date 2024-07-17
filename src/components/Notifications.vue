<template>
  <v-card class="notifications-card" width="600">
    <v-toolbar style="background-color: #385cad;">
      <v-card-title style="margin-left: 100px;color:white">Notifications</v-card-title>
    </v-toolbar>
    <!-- Notification list -->
    <v-list style="max-height: 300px; overflow-y: auto;">
      <v-list-item 
        v-for="notification in notifications" 
        :key="notification.id" 
        :class="{'new-notification': !notification.read, 'read-notification': notification.read}"
        class="notification-item" 
        @click="navigateToFeedback(notification.feedback_id)"
      >
        <v-list-item-content>
          <v-list-item-title style="font-weight:500;">{{ notification.feedback.subject }}</v-list-item-title>
          <v-list-item-subtitle>{{ notification.feedback.feedback }}</v-list-item-subtitle> 

          <v-list-item-subtitle>{{ formatTime(notification.feedback.created_at) }}</v-list-item-subtitle> 
        </v-list-item-content>
        <v-list-item-action>
          <v-chip 
            v-if="!notification.read" 
            @click.stop="markAsRead(notification.id, notification.feedback_id)" 
            style="text-transform: capitalize; color: green;" 
            elevation="0"
          >
            Mark as Read
          </v-chip>
          <span v-else style="color:#385cad">Read</span>
        </v-list-item-action>
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

<style>
.notifications-card {
  width: 100%;
  max-width: 700px;
  margin: auto;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-item .v-list-item-content {
  flex: 1;
}

.notification-item .v-list-item-action {
  flex-shrink: 0;
}

.new-notification {
  background-color: #e0f7fa; /* Light cyan background for new notifications */
  font-weight: bold; /* Make unopened notifications thicker */
}

.read-notification {
  opacity: 0.6; /* Make opened notifications faded */
}
</style>
