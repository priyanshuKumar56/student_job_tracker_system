"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Edit, Trash2, ExternalLink, Calendar, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu"

const JobCard = ({ job, onDelete, onStatusUpdate }) => {
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "status-applied"
      case "interview":
        return "status-interview"
      case "offer":
        return "status-offer"
      case "rejected":
        return "status-rejected"
      default:
        return ""
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-semibold">{job.company}</h3>
              <p className="text-muted-foreground">{job.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusBadgeClass(job.status)} variant="outline">
                  {job.status}
                </Badge>
                <span className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1" size={12} />
                  {formatDate(job.appliedDate)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              {job.link && (
                <a href={job.link} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button variant="outline" size="icon" title="View Application">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to={`/edit-job/${job._id}`}>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => onDelete(job._id)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Update Status:</p>
            <div className="flex flex-wrap gap-2">
              {["Applied", "Interview", "Offer", "Rejected"].map((status) => (
                <Button
                  key={status}
                  onClick={() => onStatusUpdate(job._id, status)}
                  disabled={job.status === status}
                  variant={job.status === status ? "default" : "outline"}
                  size="sm"
                  className={job.status === status ? "" : "hover:bg-muted"}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default JobCard
