import axios from "axios";

const API_URL = import.meta.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all jobs
export const getAllJobs = async () => {
  try {
    const response = await api.get("/jobs");
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Get job by ID
export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    throw error;
  }
};

// Create new job
export const createJob = async (jobData) => {
  console.log(jobData);
  try {
    const response = await axios.post(
      "http://localhost:5000/api/jobs",
      jobData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Update job
export const updateJob = async (id, jobData) => {
  try {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    throw error;
  }
};

// Update job status
export const updateJobStatus = async (id, status) => {
  try {
    const response = await api.put(`/jobs/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for job with ID ${id}:`, error);
    throw error;
  }
};

// Delete job
export const deleteJob = async (id) => {
  try {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting job with ID ${id}:`, error);
    throw error;
  }
};
