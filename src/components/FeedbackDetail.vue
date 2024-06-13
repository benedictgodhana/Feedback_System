<template>
    <AdminNavbar></AdminNavbar>
    <!-- Sidebar -->
    <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />
    <v-container>
        <v-card variant="outlined">
        <div class="feedback-details-container" >
        <!-- Feedback details -->
        <v-toolbar>
            <v-card-title class="text-center">FeedbackDetails</v-card-title>
        </v-toolbar>
        <br>
        <div v-if="feedback">
            <v-text-field label="Category" v-model="feedback.category_id" readonly variant="solo"></v-text-field>
            <v-text-field label="SubCategory" v-model="feedback.subcategory_id" readonly variant="solo"></v-text-field>
            <v-text-field label="Subject" v-model="feedback.subject" readonly variant="solo"></v-text-field>
            <v-text-field label="Name" v-model="feedback.name" readonly variant="solo"></v-text-field>
            <v-text-field label="Email" v-model="feedback.email" readonly variant="solo"></v-text-field>
            <v-text-field label="Feedback" v-model="feedback.feedback" readonly variant="solo"></v-text-field>

            <!-- Reply button if email exists -->
            <v-btn v-if="feedback.email" color="green" @click="replyByEmail" style="text-transform: none;"><v-icon>mdi-email</v-icon>Reply via Email</v-btn>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
    </v-card>
    </v-container>
  
  
</template>

<script>
import axiosInstance from '../service/api';
import AdminSidebar from '@/components/AdminSidebar.vue';
import AdminNavbar from '@/components/AdminNavbar.vue';

export default {
    components: {
        AdminSidebar,
        AdminNavbar,
    },
    data() {
        return {
            feedback: null,
        };
    },
    created() {
        this.fetchFeedbackDetails();
    },
    methods: {
        async fetchFeedbackDetails() {
            const feedback_id = this.$route.params.id;
            try {
                const response = await axiosInstance.get(`/feedbacks/${feedback_id}`);
                this.feedback = response.data;
            } catch (error) {
                console.error('Error fetching feedback details:', error);
            }
        },
        replyByEmail() {
            const recipientEmail = this.feedback.email;
            const subject = 'Reply to Your Feedback';
            const body = 'Enter your reply here.';
            const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
        },
    },
};
</script>
    
<style scoped>
.feedback-details-container {
    margin: 20px;
}
.feedback-details-container p {
    margin-bottom: 10px;
}
</style>
