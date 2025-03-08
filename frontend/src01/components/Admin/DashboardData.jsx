/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { FaClipboardList, FaUsers, FaThLarge, FaListAlt, FaQuestionCircle, FaClock, FaFolderOpen, FaFileAlt } from "react-icons/fa"; // Import icons
import Service from "../../service/Service";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("24h"); // Default to 24 hours

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await Service.get("/admin_dashboardData");
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to fetch Dashboard Data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  const {
    GraphData = [],
    TotalExams,
    TotalCandidates,
    DomainCount,
    SectionCount,
    QuestionCount,
  } = dashboardData;

  // // Filter function to filter GraphData based on time range
  // const filterDataByTimeRange = (data, range) => {
  //   const currentTime = new Date();
  //   const filteredData = data.filter((item) => {
  //     const examDate = new Date(item.dateConducted);
  //     const diffInMilliseconds = currentTime - examDate;
  //     switch (range) {
  //       case "24h":
  //         return diffInMilliseconds <= 24 * 60 * 60 * 1000; // 24 hours
  //       case "week":
  //         return diffInMilliseconds <= 7 * 24 * 60 * 60 * 1000; // 7 days
  //       case "month":
  //         return diffInMilliseconds <= 30 * 24 * 60 * 60 * 1000; // 30 days
  //       default:
  //         return true;
  //     }
  //   });
  //   return filteredData;
  // };

  // // Prepare data for the chart based on selected time range
  // const filteredGraphData = filterDataByTimeRange(GraphData, timeRange);
  const aggregateDataByDate = (data) => {
    const dateMap = {};

    // Aggregate the data by date
    data.forEach((item) => {
      const date = item.dateConducted.split("T")[0]; // Extract only the date part (YYYY-MM-DD)
      if (dateMap[date]) {
        dateMap[date] += 1; // Increment the count of exams on this date
      } else {
        dateMap[date] = 1; // Initialize the count for this date
      }
    });

    // Convert the aggregated data to an array of labels (dates) and data (number of exams)
    const labels = Object.keys(dateMap);
    const dataValues = Object.values(dateMap);

    return { labels, dataValues };
  };

  const { labels, dataValues } = aggregateDataByDate(GraphData);

  const chartData = {
    labels, // Dates of exams
    datasets: [
      {
        label: "Exams Conducted",
        data: dataValues, // Number of exams for each date
        backgroundColor: "#2e2c28", // Bar color
        borderColor: "#f2eded",
        borderWidth: 1,
        fontWeight: "bolder",
        maxBarThickness: 50,
        marginTop: "100px"
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            weight: "bold", // Set font weight to bold
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates",
          font: {
            weight: "bold", // Make title font bold
          },
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          font: {
            weight: "bold", // Make tick labels bold
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Exams Conducted",
          font: {
            weight: "bold", // Make title font bold
          },
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number(value).toFixed(0);
          },
          font: {
            weight: "bold", // Make tick labels bold
          },
        },
      },
    },
  };

  const cards = [
    {
      title: "Total Exams",
      value: TotalExams || 0,
      icon: <FaClipboardList size={30} color="black" style={{ marginBottom: "20px" }} />,
    },
    {
      title: "Total Candidates",
      value: TotalCandidates || 0,
      icon: <FaUsers size={30} color="black" style={{ marginBottom: "20px" }} />,
    },
    {
      title: "Total Domains",
      value: DomainCount || 0,
      icon: <FaThLarge size={30} color="black" style={{ marginBottom: "20px" }} />,
    },
    {
      title: "Total Sections",
      value: SectionCount || 0,
      icon: <FaListAlt size={30} color="black" style={{ marginBottom: "20px" }} />,
    },
    {
      title: "Total Questions",
      value: QuestionCount || 0,
      icon: <FaQuestionCircle size={30} color="black" style={{ marginBottom: "20px" }} />,
    },
  ];

  // const cards = [
  //   {
  //     title: "Total Exams",
  //     value: TotalExams || 0,
  //     icon: <FaClock size={30} color="black" style={{ marginBottom: "20px" }} />,
  //   },
  //   {
  //     title: "Total Candidates",
  //     value: TotalCandidates || 0,
  //     icon: <FaUsers size={30} color="black" style={{ marginBottom: "20px" }} />,
  //   },
  //   {
  //     title: "Total Domains",
  //     value: DomainCount || 0,
  //     icon: <FaThLarge size={30} color="black" style={{ marginBottom: "20px" }} />,
  //   },
  //   {
  //     title: "Total Sections",
  //     value: SectionCount || 0,
  //     icon: <FaFolderOpen size={30} color="black" style={{ marginBottom: "20px" }} />,
  //   },
  //   {
  //     title: "Total Questions",
  //     value: QuestionCount || 0,
  //     icon: <FaFileAlt size={30} color="black" style={{ marginBottom: "20px" }} />,
  //   },
  // ];
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: "#f2eded",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            }}
          >
            <CardContent>
              <Typography style={{ alignItems: "center", fontWeight: "bolder", fontSize: "18px", fontFamily: "Helvetica, sans-serif" }}>
                Exams Taken
              </Typography>
              {/*<FormControl fullWidth style={{ marginBottom: "20px" }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="24h">Last 24 hours</MenuItem>
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                </Select>
              </FormControl>
 */}
              {GraphData.length > 0 ? (
                <Bar data={chartData} options={chartOptions} style={{ marginTop: "60px" }} />
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: "center", marginTop: "20px" }}
                >
                  Data are not available for the selected time range.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Cards */}
        <Grid item xs={12} md={4} >
          <Grid container spacing={3}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    borderRadius: 2,
                    background: "#f2eded",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  <CardContent style={{ color: "black" }}>
                    <div style={{ color: "black" }}>{card.icon}</div>
                    <Typography style={{ color: "black", fontWeight: "bolder", fontFamily: "Helvetica, sans-serif" }}>
                      {card.title}
                    </Typography>
                    <span>
                      {card.value}
                    </span>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardData;
