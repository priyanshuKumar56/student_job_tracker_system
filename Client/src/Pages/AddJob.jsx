"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import JobForm from "../components/JobForm";
import { createJob } from "../services/jobService";

const AddJob = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (jobData) => {
    setIsSubmitting(true);
    try {
      await createJob(jobData);
      toast.success("Job application added successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to add job application");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="icon"
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Add New Job Application</h1>
        </div>

        <JobForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </motion.div>
    </div>
  );
};

export default AddJob;
