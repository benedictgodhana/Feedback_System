  <template>
    <!-- Navigation bar -->
    <AdminNavbar></AdminNavbar>

    <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

    <!-- Sidebar -->



    <v-container style="width:100%;max-width: 100%;">
      <!-- Total number of feedback -->
      <v-row>
    

  <v-col cols="12" md="6" lg="">

  <v-card style="background-color:aliceblue;border-radius: 10px;color:black"  elevation="4">
        <v-card-title class="text-overline">
        TOTAL FEEDBACK

          <div class="text-green-darken-3 text-h5 font-weight-bold"></div>
        </v-card-title>
        
        <v-card-text>
          <div class="d-flex justify-space-between py-3">
            <span class="text-green-darken-3 font-weight-medium">
              Total Number of Feedback
            </span>

            <span style="color: black" class="text-h5 font-weight-bold">{{ totalFeedbacks}} </span>
            </div>
        </v-card-text>

      
      </v-card>
    </v-col>

  <v-col cols="12" md="6" lg="">

  <v-card style="background-color:aliceblue;border-radius: 10px;color:black"  elevation="4">
        <v-card-title class="text-overline">
        TODAY'S FEEDBACK

          <div class="text-green-darken-3 text-h5 font-weight-bold"></div>
        </v-card-title>
        
        <v-card-text>
          <div class="d-flex justify-space-between py-3">
            <span class="text-green-darken-3 font-weight-medium">
              Number of Feedback
            </span>

            <span style="color: black" class="text-h5 font-weight-bold">{{ todaysFeedback}} </span>
            </div>
        </v-card-text>


      
      </v-card>
    </v-col>

  <v-col cols="12" md="6" lg="">

  <v-card style="background-color:aliceblue;border-radius: 10px;color:black"  elevation="4">
        <v-card-title class="text-overline">
        THIS WEEK'S FEEDBACK

          <div class="text-green-darken-3 text-h5 font-weight-bold"></div>
        </v-card-title>
        
        <v-card-text>
          <div class="d-flex justify-space-between py-3">
            <span class="text-green-darken-3 font-weight-medium">
              Number of Feedback
            </span>

            <span style="color: black" class="text-h5 font-weight-bold">{{ thisWeekFeedback  }} </span>
            </div>
        </v-card-text>

        <v-divider></v-divider>

      
      </v-card>
    </v-col>

    <v-col cols="12" md="6" lg="">

  <v-card style="background-color:aliceblue;border-radius: 10px;color:black"  elevation="4">
        <v-card-title class="text-overline">
        THIS MONTH'S FEEDBACK

          <div class="text-green-darken-3 text-h5 font-weight-bold"></div>
        </v-card-title>
        
        <v-card-text>
          <div class="d-flex justify-space-between py-3">
            <span class="text-green-darken-3 font-weight-medium">
              Number of Feedback
            </span>

            <span style="color: black" class="text-h5 font-weight-bold">{{ thisMonthFeedback }} </span>
            </div>
        </v-card-text>

      
      </v-card>
    </v-col>

    





      
      </v-row>

      <!-- Feedback counts cards -->
      <v-row>
        <v-col v-for="(count, category) in feedbackCounts" :key="category" cols="12" md="6" lg="">
    <v-card class="feedback-card" outlined elevation="3">

      <v-card-title class="text-overline">{{ category }}</v-card-title>
      <v-card-text>
        <v-icon class="icon">mdi-email</v-icon>
        Number of Feedback: {{ count }}
      </v-card-text>
      <v-card-actions>
        <router-link :to="{ name: 'FeedbackTable', params: { category: category } }" class="view-feedback-link">
          <v-btn color="white" text class="view-feedback-btn">
            <v-icon class="icon">mdi-eye</v-icon>
            View Feedback
          </v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </v-col>

  </v-row>


      <!-- Charts -->
      <v-row >
    <v-col cols="12" md="6">
      <v-card class="chart-card" elevation="2">
        <highcharts :options="chartOptions"></highcharts>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="graph-card" elevation="2">
        <highcharts :options="graphOptions"></highcharts>
      </v-card>
    </v-col>
  </v-row>



    
    

    
      <!-- Footer -->
      
    </v-container>


  <v-footer style="background-color: #385cad;">
        <!-- Your footer content here -->
        <p style="color:white;font-size: 15px;text-transform: none  ;">&copy; 2024 @iLabAfrica, Strathmore University. All rights reserved.</p>
      </v-footer>

  </template>

  <script>
  import AdminSidebar from '@/components/AdminSidebar.vue';
  import AdminNavbar from '@/components/AdminNavbar.vue';
  import axiosInstance from '@/service/api';
  import HighchartsVue from 'highcharts-vue';
  import darkUnica from 'highcharts/themes/dark-unica'; // Import Highcharts dark theme


  export default {
    components: {
      AdminSidebar,
      AdminNavbar,
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

  .chart-card,
  .graph-card {
    border-radius: 15px;
    margin: 20px;
    padding: 20px;
    text-transform: none;
  }

  /* Add more styling as needed */

    .feedback-card {
      margin: 0;
      background-color: #f2f9f9; /* Change the background color */
      font-weight: 700;
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

    .view-feedback-btn {
      width: 100%;
      background-color: #385cad;
      text-transform: capitalize;
    }

    .view-feedback-link {
      width: 100%;
      text-decoration: none; /* Remove underline for router-link */
    }
  </style>
