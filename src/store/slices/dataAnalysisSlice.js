import { createSlice } from "@reduxjs/toolkit";

// Sample Data Generation
const generateSampleData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const departments = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Operations",
    "Finance",
  ];
  const positions = [
    "Software Engineer",
    "Sales Manager",
    "Marketing Specialist",
    "HR Business Partner",
    "Operations Analyst",
    "Financial Analyst",
  ];
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
  ];

  // Monthly data for trends
  const monthlyData = months.map((month, index) => ({
    month,
    applications: Math.floor(Math.random() * 500) + 1800 + index * 50,
    hired: Math.floor(Math.random() * 150) + 400 + index * 20,
    interviews: Math.floor(Math.random() * 300) + 800 + index * 30,
    rejected: Math.floor(Math.random() * 200) + 600,
    pending: Math.floor(Math.random() * 100) + 200,
  }));

  // Department data
  const departmentData = departments.map((dept) => ({
    department: dept,
    applications: Math.floor(Math.random() * 800) + 400,
    hired: Math.floor(Math.random() * 120) + 30,
    interviews: Math.floor(Math.random() * 200) + 100,
    avgTimeToHire: Math.floor(Math.random() * 20) + 15,
    successRate: Math.floor(Math.random() * 30) + 60,
  }));

  // Industry distribution
  const industryData = industries.map((industry, index) => ({
    name: industry,
    value: Math.floor(Math.random() * 25) + 10,
    color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"][
      index
    ],
  }));

  // Individual applications data
  const applicationData = [];
  for (let i = 0; i < 1000; i++) {
    applicationData.push({
      id: i + 1,
      candidateName: `Candidate ${i + 1}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      applicationDate: new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ),
      status: [
        "Applied",
        "Screening",
        "Interview",
        "Offer",
        "Hired",
        "Rejected",
      ][Math.floor(Math.random() * 6)],
      experience: Math.floor(Math.random() * 15) + 1,
      salary: Math.floor(Math.random() * 80000) + 50000,
      source: [
        "LinkedIn",
        "Indeed",
        "Company Website",
        "Referral",
        "Recruiter",
      ][Math.floor(Math.random() * 5)],
    });
  }

  return { monthlyData, departmentData, industryData, applicationData };
};

const initialState = {
  ...generateSampleData(),
  filters: {
    department: "all",
    dateRange: "all",
    status: "all",
    position: "all",
  },
  activeTab: "dashboard",
  isLoading: false,
};

const dataAnalysisSlice = createSlice({
  name: "dataAnalysis",
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },

    clearFilters: (state) => {
      state.filters = {
        department: "all",
        dateRange: "all",
        status: "all",
        position: "all",
      };
    },

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    refreshData: (state) => {
      const newData = generateSampleData();
      state.monthlyData = newData.monthlyData;
      state.departmentData = newData.departmentData;
      state.industryData = newData.industryData;
      state.applicationData = newData.applicationData;
    },
  },
});

export const { updateFilter, clearFilters, setActiveTab, refreshData } =
  dataAnalysisSlice.actions;

// Selectors
export const selectApplicationData = (state) =>
  state.dataAnalysis.applicationData;
export const selectMonthlyData = (state) => state.dataAnalysis.monthlyData;
export const selectDepartmentData = (state) =>
  state.dataAnalysis.departmentData;
export const selectIndustryData = (state) => state.dataAnalysis.industryData;
export const selectFilters = (state) => state.dataAnalysis.filters;
export const selectActiveTab = (state) => state.dataAnalysis.activeTab;

// Filtered data selector
export const selectFilteredData = (state) => {
  const { applicationData, filters } = state.dataAnalysis;

  let filtered = applicationData;

  if (filters.department !== "all") {
    filtered = filtered.filter(
      (item) => item.department === filters.department
    );
  }
  if (filters.status !== "all") {
    filtered = filtered.filter((item) => item.status === filters.status);
  }
  if (filters.position !== "all") {
    filtered = filtered.filter((item) => item.position === filters.position);
  }

  return filtered;
};

// KPIs selector
export const selectKPIs = (state) => {
  const filteredData = selectFilteredData(state);
  const totalApplications = filteredData.length;
  const hired = filteredData.filter((app) => app.status === "Hired").length;
  const interviews = filteredData.filter(
    (app) => app.status === "Interview"
  ).length;
  const avgTimeToHire =
    filteredData.length > 0
      ? filteredData.reduce(
          (sum, app) => sum + (Math.floor(Math.random() * 30) + 10),
          0
        ) / filteredData.length
      : 0;

  return {
    totalApplications,
    hired,
    successRate:
      totalApplications > 0
        ? ((hired / totalApplications) * 100).toFixed(1)
        : 0,
    avgTimeToHire: Math.round(avgTimeToHire),
  };
};

export default dataAnalysisSlice.reducer;
