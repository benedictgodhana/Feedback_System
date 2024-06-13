<template>
  <!-- Navigation bar -->
  <SuperAdminNavbar></SuperAdminNavbar>

  <!-- Sidebar -->
  <SuperAdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

  <v-container style="width:100%;max-width: 100%;">
    <!-- Total number of feedback -->
   <v-card-title style="background-color: #EC7D30;color:white" class="text-center">Total Feedback:{{ totalFeedbacks }}</v-card-title>
   <br>
    <v-row>
      <v-col cols="12" md="6" lg="">
  <v-card class="feedback-card" outlined elevation="3">
    <v-card-title class="category-title">{{ category }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-icon class="icon">mdi-calendar-today</v-icon>
      Today's Feedback: {{ todaysFeedback }}
    </v-card-text>
  </v-card>
</v-col>

      <v-col cols="12" md="6" lg="">
        <v-card style="margin:0px;border-radius: 10px;" variant="outlined" elevation="3" width="100%">
          <v-img src="/Images/schedule_3652191.png" style="margin-top: 10px;" height="50" contain></v-img>

          <v-card-title>{{ category }}</v-card-title>
          <v-card-text>
          </v-card-text>
          <v-card-actions>
            <v-btn color="white" style="background:#EC7D30;width: 100%;text-transform:capitalize;height: 50px;font-weight: 800;">This Week Feedback: {{ thisWeekFeedback  }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="">
        <v-card style="margin:0px;border-radius: 10px;" variant="outlined" elevation="3" width="100%">
          <v-img src="/Images/schedule_3652191.png" style="margin-top: 10px;" height="50" contain></v-img>

          <v-card-title>{{ category }}</v-card-title>
          <v-card-text>
          </v-card-text>
          <v-card-actions>
            <v-btn color="white" style="background:#EC7D30;width: 100%;text-transform:capitalize;height: 50px;font-weight: 800;">This Month Feedback: {{ thisMonthFeedback }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      
    </v-row>

     <!-- Charts -->
     <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="0">
          <highcharts :options="chartOptions" style="text-transform: none;" ></highcharts>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="0">
          <highcharts :options="graphOptions" style="text-transform: none;"></highcharts>
        </v-card>
      </v-col>
    </v-row>


    <!-- Feedback counts cards -->
    <v-row>
  <v-col v-for="(count, category) in feedbackCounts" :key="category" cols="12" md="6" lg="">
    <v-card style="margin:0px;border-radius: 10px;" variant="outlined" elevation="3" width="100%">
      <v-img src="/Images/feedback_11293675.png" style="margin-top: 20px;" height="50" contain></v-img>

      <v-card-title style="font-size: 17px;"> {{ category }}</v-card-title>
      <v-card-text>
        <strong>Number of Feedback:{{ count }}</strong>
      </v-card-text>
      <v-card-actions>
        <router-link :to="{ name: 'FeedbackDetails', params: { category: category } }" style="width: 100%">
          <v-btn color="white" text style="background:#385cad;text-transform:capitalize; width: 100%"><v-icon>mdi-eye</v-icon>View Feedback</v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </v-col>
</v-row>

    <br>
    <br>

   
    <!-- Footer -->
    
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
import HighchartsVue from 'highcharts-vue';

export default {
  components: {
    SuperAdminSidebar,
    SuperAdminNavbar,
    HighchartsVue,
  },
  data() {
    return {
      sidebar: true,
      feedbackCounts: {}, // Object to store feedback counts by category
      totalFeedbacks: 0, // Total number of feedbacks
      todaysFeedback: 0, // Today's feedback count
      thisWeekFeedback: 0, // This week's feedback count
      thisMonthFeedback: 0, // This month's feedback count
    
      chartOptions: {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Feedback Distribution'
        },
        series: [{
          name: 'Feedback Count',
          data: []
        }]
      },
      graphOptions: {
        chart: {
          type: 'area' // Change to 'line' for a line chart
        },
        title: {
          text: 'Feedback Trends Over Time'
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          title: {
            text: 'Number of Feedback'
          }
        },
        series: [{
          name: 'Feedback Count',
          data: [] // Placeholder for actual data
        }]
      }
    };
  },
  created() {
    this.fetchFeedbackCounts();
  },
  methods: {
    async fetchFeedbackCounts() {
      try {
        const response = await axiosInstance.get('/feedback/count');
        this.feedbackCounts = response.data;
        this.totalFeedbacks = Object.values(response.data).reduce((acc, val) => acc + val, 0);
        this.updateChartOptions();
        this.updateGraphOptions();
        // Fetch today's feedback count
        this.fetchTodaysFeedback();
      } catch (error) {
        console.error('Error fetching feedback counts:', error);
      }
    },
    updateChartOptions() {
      const chartData = Object.entries(this.feedbackCounts).map(([category, count]) => ({ name: category, y: count }));
      this.chartOptions.series[0].data = chartData;
    },
    updateGraphOptions() {
      const graphData = Object.values(this.feedbackCounts);
      this.graphOptions.series[0].data = graphData;
    },
    async fetchTodaysFeedback() {
    try {
        const response = await axiosInstance.get('/feedback/counts');
        this.todaysFeedback = response.data.today;
        this.thisWeekFeedback = response.data.this_week;
        this.thisMonthFeedback = response.data.this_month;
        // You can similarly extract this_week and this_month from the response data if needed
    } catch (error) {
        console.error('Error fetching today\'s feedback count:', error);
    }
}

  }
};
</script>
<style scoped>
  .feedback-card {
    border-radius: 10px;
    margin: 0;
    background-color: #f7f7f7; /* Change the background color */
  }

  .category-title {
    font-size: 18px; /* Adjust font size */
    color: #385cad; /* Change the title color */
    padding: 16px; /* Add padding */
  }

  .icon {
    margin-right: 8px; /* Add space between icon and text */
    color: #EC7D30; /* Adjust icon color */
  }
</style>
