"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Link2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Spinner from "./Spinner";

const JobForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    company: initialData?.company || "",
    role: initialData?.role || "",
    status: initialData?.status || "Applied",
    appliedDate: initialData?.appliedDate
      ? new Date(initialData.appliedDate)
      : new Date(),
    link: initialData?.link || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleStatusChange = (value) => {
    setFormData({
      ...formData,
      status: value,
    });

    if (errors.status) {
      setErrors({
        ...errors,
        status: "",
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      appliedDate: date,
    });

    if (errors.appliedDate) {
      setErrors({
        ...errors,
        appliedDate: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    if (!url.trim()) return true; // Empty URLs are valid (optional field)
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={handleChange}
                  className={errors.company ? "border-destructive" : ""}
                />
                {errors.company && (
                  <p className="text-destructive text-xs">{errors.company}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g. Software Engineer Intern"
                  value={formData.role}
                  onChange={handleChange}
                  className={errors.role ? "border-destructive" : ""}
                />
                {errors.role && (
                  <p className="text-destructive text-xs">{errors.role}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      className="text-sm font-medium"
                      placeholder="Select the value"
                    ></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="appliedDate" className="text-sm font-medium">
                  Date of Application
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.appliedDate}
                    onChange={handleDateChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    dateFormat="MMMM d, yyyy"
                    id="appliedDate"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium">
                Application Link (Optional)
              </label>
              <div className="relative">
                <Input
                  id="link"
                  name="link"
                  placeholder="https://careers.google.com/application/..."
                  value={formData.link}
                  onChange={handleChange}
                  className={`pl-8 ${errors.link ? "border-destructive" : ""}`}
                />
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
              {errors.link && (
                <p className="text-destructive text-xs">{errors.link}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-0 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  {isEditing ? "Updating..." : "Saving..."}
                </>
              ) : isEditing ? (
                "Update Application"
              ) : (
                "Add Application"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default JobForm;
