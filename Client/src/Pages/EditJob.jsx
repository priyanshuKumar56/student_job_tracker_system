"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/button";
import JobForm from "../components/JobForm";
import Spinner from "../components/Spinner";
import { getJobById, updateJob } from "../services/jobService";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (error) {
        toast.error("Failed to fetch job details");
        console.error(error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleSubmit = async (jobData) => {
    setIsSubmitting(true);
    try {
      await updateJob(id, jobData);
      toast.success("Job application updated successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to update job application");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Edit Job Application</h1>
        </div>

        <JobForm
          initialData={job}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditing={true}
        />
      </motion.div>
    </div>
  );
};

export default EditJob;
