<template>
  <!-- Navigation bar -->
  <SuperAdminNavbar></SuperAdminNavbar>

  <!-- Sidebar -->
  <SuperAdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

  <v-container style="width:100%;max-width: 100%;">
    <v-card-title class="text-center" style="background-color: #385cad;color:white">Analytics</v-card-title>

    <div class="count-cards-container">
        <!-- Cards displaying the counts -->
        <user-count-card :userCount="userCount" />
        <payment-count-card :paymentCount="paymentCount" />
        <customer-count-card :customerCount="customerCount" />
        <service-count-card :serviceCount="serviceCount" />

      </div>
      <br>
    <!-- Total number of feedback -->
   <v-card-title style="background-color: #EC7D30;color:white" class="text-center">Total Feedback:{{ totalFeedbacks }}</v-card-title>
   <br>
    <v-row>
      <v-col cols="12" md="6" lg="">
        <v-card style="margin:0px;border-radius: 10px;" variant="outlined" elevation="3" width="100%">
          <v-img src="/schedule_3652191.png" style="margin-top: 10px;" height="50" contain></v-img>

          <v-card-title>{{ category }}</v-card-title>
          <v-card-text>
          </v-card-text>
          <v-card-actions>
            <v-btn color="white" style="background:#EC7D30;width: 100%;text-transform:capitalize;height: 50px;font-weight: 800;">Today's Feedback: {{ todaysFeedback }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="">
        <v-card style="margin:0px;border-radius: 10px;" variant="outlined" elevation="3" width="100%">
          <v-img src="/schedule_3652191.png" style="margin-top: 10px;" height="50" contain></v-img>

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
          <v-img src="/schedule_3652191.png" style="margin-top: 10px;" height="50" contain></v-img>

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
          <highcharts :options="chartOptions"></highcharts>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="0">
          <highcharts :options="graphOptions"></highcharts>
        </v-card>
      </v-col>
    </v-row>


    <!-- Feedback counts cards -->
    <v-row>
      <v-col v-for="(count, category) in feedbackCounts" :key="category" cols="12" md="6" lg="">
        <v-card style="margin:0px;border-radius: 10px;" variant="outlined" elevation="3" width="100%">
          <v-img src="/feedback_11293675.png" style="margin-top: 10px;" height="50" contain></v-img>

          <v-card-title> {{ category }}</v-card-title>
          <v-card-text>
            <div><strong style="font-size: 15px;">Number of Feedback:{{ count }}</strong> </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="white" text to="/admin/manage-feedback" style="background:#385cad;width: 100%;text-transform:capitalize;">View Feedback</v-btn>
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
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import UserCountCard from '@/components/UserCountCard.vue';
import EmployeeCountCard from '@/components/EmployeeCountCard.vue';
import CustomerCountCard from '@/components/CustomerCountCard.vue';
import ServiceCountCard from '@/components/ServiceCountCard.vue';
import PaymentCountCard from '@/components/PaymentCountCard.vue';


export default {
  components: {
    SuperAdminSidebar,
    SuperAdminNavbar,
    HighchartsVue,
    UserCountCard,
      EmployeeCountCard,
      CustomerCountCard,
      ServiceCountCard,
      PaymentCountCard,
      UserCountCard,
  },
  data() {
    return {
      sidebar: true,
      feedbackCounts: {}, // Object to store feedback counts by category
      totalFeedbacks: 0, // Total number of feedbacks
      todaysFeedback: 0, // Today's feedback count
      thisWeekFeedback: 0, // This week's feedback count
      thisMonthFeedback: 0, // This month's feedback count
      userCount: 100, // Example user count data
        employeeCount: 5, // Example employee count data
        customerCount: 200, // Example customer count data
        serviceCount: 10, // Example service count data
        paymentCount: 3, // Example service count data
    
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
            text: 'Number of Feedbacks'
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
/* Flex container for count cards */
.count-cards-container {
  display: flex;
  margin-left:10px;
  margin-top: 20px; /* Optional margin */
}
</style>