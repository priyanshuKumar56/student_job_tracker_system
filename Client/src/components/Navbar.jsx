"use client";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Code, Plus, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./theme-provider";

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <motion.nav
      className="border-b bg-background"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="font-bold text-xl">Job Tracker</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/add-job">
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Add Job</span>
              </Button>
            </Link>

            <Link to="/">
              <Button
                variant={location.pathname === "/" ? "default" : "ghost"}
                size="sm"
              >
                Dashboard
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
