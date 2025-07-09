import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import { handleApiError, showSuccess } from "../utils/errorHandler";

// Define Project type based on the API response
export interface ProjectUser {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
  users: ProjectUser[];
}

export function useProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Get all projects
  const getProjects = useCallback(async (): Promise<Project[] | null> => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.get<Project[]>("/projects");
      const fetchedProjects = response.data;
      setProjects(fetchedProjects);
      return fetchedProjects;
    } catch (error: any) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectById = async (
    id: number | string
  ): Promise<Project | null> => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.get<Project>(`/projects/${id}`);
      const fetchedProject = response.data;
      setSelectedProject(fetchedProject);
      return fetchedProject;
    } catch (error: any) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: {
    title: string;
    description?: string;
    status?: "pending" | "in_progress" | "completed";
    userId: number[];
  }): Promise<Project | null> => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.post<Project>("/projects", projectData);
      showSuccess("Project created successfully!");
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (
    id: number | string,
    projectData: {
      title?: string;
      description?: string;
      status?: "pending" | "in_progress" | "completed";
      userId?: number[];
    }
  ): Promise<Project | null> => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.put<Project>(`/projects/${id}`, projectData);
      showSuccess("Project updated successfully!");
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number | string): Promise<boolean> => {
    setLoading(true);
    clearErrors();
    try {
      await axios.delete(`/projects/${id}`);
      // After successful deletion, filter out the project from state
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
      showSuccess("Project deleted successfully!");
      return true;
    } catch (error: any) {
      handleApiError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear validation errors only (toast errors are handled by errorHandler)
  const clearErrors = (): void => {
    setValidationErrors([]);
  };

  // Load projects on initial mount
  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return {
    projects,
    selectedProject,
    loading,
    validationErrors,
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    clearErrors,
  };
}
