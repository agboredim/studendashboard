// store/slices/educationalDataAnalysisSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Sample Educational Data
const generateEducationalData = () => {
  // Sample assignments for students
  const assignments = [
    {
      id: 1,
      title: "Q3 Sales Performance Analysis",
      description:
        "Analyze quarterly sales data and create visualizations showing department performance, trends, and insights.",
      instructor: "Dr. Sarah Johnson",
      dueDate: "2024-12-15",
      status: "active", // active, submitted, graded
      difficulty: "intermediate",
      dataSource: "sales_q3_2024.csv",
      requirements: [
        "Create a bar chart showing sales by department",
        "Build a trend line for monthly performance",
        "Generate summary KPIs dashboard",
        "Write analysis report with insights",
      ],
      submissionFormat: ["dashboard", "report"],
      grade: null,
      feedback: null,
      progress: 65, // percentage completion
    },
    {
      id: 2,
      title: "Customer Demographics Study",
      description:
        "Model customer data relationships and create demographic analysis dashboards.",
      instructor: "Prof. Michael Chen",
      dueDate: "2024-12-20",
      status: "not_started",
      difficulty: "beginner",
      dataSource: "customer_demographics.json",
      requirements: [
        "Clean and model customer data",
        "Create age group distributions",
        "Analyze geographic patterns",
        "Build customer persona profiles",
      ],
      submissionFormat: ["data_model", "dashboard"],
      grade: null,
      feedback: null,
      progress: 0,
    },
  ];

  // Available data sources (instructor-provided)
  const dataSources = [
    {
      id: "sales_q3_2024",
      name: "Q3 2024 Sales Data",
      type: "CSV",
      instructor: "Dr. Sarah Johnson",
      description: "Quarterly sales performance data across departments",
      size: "2.4 MB",
      records: 15420,
      columns: [
        "date",
        "department",
        "product",
        "sales_amount",
        "quantity",
        "region",
      ],
      lastUpdated: "2024-11-15",
      assignmentIds: [1],
      complexity: "intermediate",
    },
    {
      id: "customer_demographics",
      name: "Customer Demographics",
      type: "JSON",
      instructor: "Prof. Michael Chen",
      description: "Customer profile and demographic information",
      size: "1.8 MB",
      records: 8500,
      columns: [
        "customer_id",
        "age",
        "gender",
        "location",
        "income",
        "purchase_history",
      ],
      lastUpdated: "2024-11-20",
      assignmentIds: [2],
      complexity: "beginner",
    },
  ];

  // Sample student progress data
  const studentProgress = {
    completedAssignments: 3,
    totalAssignments: 8,
    averageGrade: 87.5,
    skillsLearned: ["Data Cleaning", "Chart Creation", "Dashboard Design"],
    currentStreak: 5, // days
    timeSpent: 24.5, // hours
  };

  return { assignments, dataSources, studentProgress };
};

const initialState = {
  // User role context
  userRole: "student", // 'student' | 'instructor' | 'admin'
  currentUser: {
    id: 1,
    name: "Alex Thompson",
    email: "alex.thompson@university.edu",
    course: "Data Analytics 101",
    semester: "Fall 2024",
  },

  // Educational content
  ...generateEducationalData(),

  // Current work state
  activeAssignment: null,
  connectedDataSource: null,
  studentWork: {
    dataModel: null,
    visualizations: [],
    reports: [],
    lastSaved: null,
  },

  // UI state
  activeTab: "assignments",
  isLoading: false,

  // Filters for student view
  filters: {
    assignmentStatus: "all", // all, active, submitted, graded
    difficulty: "all", // all, beginner, intermediate, advanced
    instructor: "all",
  },
};

const educationalDataAnalysisSlice = createSlice({
  name: "educationalDataAnalysis",
  initialState,
  reducers: {
    // Assignment management
    setActiveAssignment: (state, action) => {
      state.activeAssignment = action.payload;
      // Auto-connect to assignment's data source
      const assignment = state.assignments.find((a) => a.id === action.payload);
      if (assignment) {
        const dataSource = state.dataSources.find((ds) =>
          ds.assignmentIds.includes(assignment.id)
        );
        state.connectedDataSource = dataSource?.id || null;
      }
    },

    updateAssignmentProgress: (state, action) => {
      const { assignmentId, progress } = action.payload;
      const assignment = state.assignments.find((a) => a.id === assignmentId);
      if (assignment) {
        assignment.progress = progress;
        assignment.status = progress === 100 ? "completed" : "active";
      }
    },

    submitAssignment: (state, action) => {
      const { assignmentId, submission } = action.payload;
      const assignment = state.assignments.find((a) => a.id === assignmentId);
      if (assignment) {
        assignment.status = "submitted";
        assignment.progress = 100;
        state.studentWork = {
          ...state.studentWork,
          ...submission,
          lastSaved: new Date().toISOString(),
        };
      }
    },

    // Data source management
    connectDataSource: (state, action) => {
      state.connectedDataSource = action.payload;
    },

    disconnectDataSource: (state) => {
      state.connectedDataSource = null;
    },

    // Student work management
    saveDataModel: (state, action) => {
      state.studentWork.dataModel = action.payload;
      state.studentWork.lastSaved = new Date().toISOString();
    },

    saveVisualization: (state, action) => {
      const visualization = action.payload;
      const existingIndex = state.studentWork.visualizations.findIndex(
        (v) => v.id === visualization.id
      );

      if (existingIndex >= 0) {
        state.studentWork.visualizations[existingIndex] = visualization;
      } else {
        state.studentWork.visualizations.push(visualization);
      }
      state.studentWork.lastSaved = new Date().toISOString();
    },

    saveReport: (state, action) => {
      state.studentWork.reports.push(action.payload);
      state.studentWork.lastSaved = new Date().toISOString();
    },

    // UI state management
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },

    clearFilters: (state) => {
      state.filters = {
        assignmentStatus: "all",
        difficulty: "all",
        instructor: "all",
      };
    },

    // Role switching (for demo purposes)
    switchRole: (state, action) => {
      state.userRole = action.payload;
      state.activeTab =
        action.payload === "instructor" ? "manage_assignments" : "assignments";
    },

    // Auto-save functionality
    autoSave: (state) => {
      state.studentWork.lastSaved = new Date().toISOString();
    },
  },
});

export const {
  setActiveAssignment,
  updateAssignmentProgress,
  submitAssignment,
  connectDataSource,
  disconnectDataSource,
  saveDataModel,
  saveVisualization,
  saveReport,
  setActiveTab,
  updateFilter,
  clearFilters,
  switchRole,
  autoSave,
} = educationalDataAnalysisSlice.actions;

// Selectors
export const selectUserRole = (state) => state.educationalDataAnalysis.userRole;
export const selectCurrentUser = (state) =>
  state.educationalDataAnalysis.currentUser;
export const selectAssignments = (state) =>
  state.educationalDataAnalysis.assignments;
export const selectDataSources = (state) =>
  state.educationalDataAnalysis.dataSources;
export const selectActiveAssignment = (state) =>
  state.educationalDataAnalysis.activeAssignment;
export const selectConnectedDataSource = (state) =>
  state.educationalDataAnalysis.connectedDataSource;
export const selectStudentWork = (state) =>
  state.educationalDataAnalysis.studentWork;
export const selectStudentProgress = (state) =>
  state.educationalDataAnalysis.studentProgress;
export const selectActiveTab = (state) =>
  state.educationalDataAnalysis.activeTab;
export const selectFilters = (state) => state.educationalDataAnalysis.filters;

// Filtered assignments selector
export const selectFilteredAssignments = (state) => {
  const { assignments, filters } = state.educationalDataAnalysis;

  let filtered = assignments;

  if (filters.assignmentStatus !== "all") {
    filtered = filtered.filter((a) => a.status === filters.assignmentStatus);
  }
  if (filters.difficulty !== "all") {
    filtered = filtered.filter((a) => a.difficulty === filters.difficulty);
  }
  if (filters.instructor !== "all") {
    filtered = filtered.filter((a) => a.instructor === filters.instructor);
  }

  return filtered;
};

// Assignment statistics selector
export const selectAssignmentStats = (state) => {
  const assignments = state.educationalDataAnalysis.assignments;

  return {
    total: assignments.length,
    active: assignments.filter((a) => a.status === "active").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
    averageProgress:
      assignments.reduce((sum, a) => sum + a.progress, 0) / assignments.length,
  };
};

// Current assignment data source selector
export const selectCurrentAssignmentDataSource = (state) => {
  const { activeAssignment, assignments, dataSources } =
    state.educationalDataAnalysis;

  if (!activeAssignment) return null;

  const assignment = assignments.find((a) => a.id === activeAssignment);
  if (!assignment) return null;

  return dataSources.find((ds) => ds.assignmentIds.includes(assignment.id));
};

export default educationalDataAnalysisSlice.reducer;
