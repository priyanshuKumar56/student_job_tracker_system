"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import JobCard from "../components/JobCard";
import JobStats from "../components/JobStats";
import Spinner from "../components/Spinner";
import { getAllJobs, deleteJob, updateJobStatus } from "../services/jobService";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [jobs, activeTab, searchTerm, sortOrder]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterJobs = () => {
    let result = [...jobs];

    // Filter by status
    if (activeTab !== "all") {
      result = result.filter(
        (job) => job.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (job) =>
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.appliedDate);
      const dateB = new Date(b.appliedDate);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredJobs(result);
  };

  const handleDeleteJob = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this job application?")
    ) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter((job) => job._id !== id));
        toast.success("Job deleted successfully");
      } catch (error) {
        toast.error("Failed to delete job");
        console.error(error);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateJobStatus(id, newStatus);
      setJobs(
        jobs.map((job) =>
          job._id === id ? { ...job, status: newStatus } : job
        )
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Student Job Tracker</h1>
        <p className="text-muted-foreground mb-6">
          Keep track of your job applications in one place
        </p>
        <Link to="/add-job">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New Application
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <JobStats jobs={jobs} />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>
                Manage and track your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="applied">Applied</TabsTrigger>
                    <TabsTrigger value="interview">Interview</TabsTrigger>
                    <TabsTrigger value="offer">Offer</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by company or role..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Spinner />
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground mb-2">
                    No job applications found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || activeTab !== "all"
                      ? "Try adjusting your filters"
                      : "Add your first job application to get started"}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-4">
                    {currentJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onDelete={handleDeleteJob}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}

              {/* Pagination Controls */}
              {filteredJobs.length > jobsPerPage && (
                <div className="flex justify-between items-center mt-6 border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {indexOfFirstJob + 1}-
                    {Math.min(indexOfLastJob, filteredJobs.length)} of{" "}
                    {filteredJobs.length} applications
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (pageNum) =>
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 &&
                              pageNum <= currentPage + 1)
                        )
                        .map((pageNum, index, array) => (
                          <div key={pageNum} className="flex items-center">
                            {index > 0 && array[index - 1] !== pageNum - 1 && (
                              <span className="px-2 text-muted-foreground">
                                ...
                              </span>
                            )}
                            <Button
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => paginate(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          </div>
                        ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
