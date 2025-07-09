import React, { useState } from "react";
import type { Route } from "../+types/root";
import AppLayout from "../components/layout/AppLayout";
import Input from "~/components/ui/Input";
import { useProject, Project } from "~/lib/hooks/useProject";
import { useUser } from "~/lib/hooks/useUser";
import { useSearch } from "~/lib/hooks/useSearch";
import { handleApiError, showSuccess } from "~/lib/utils/errorHandler";
import { Pencil, Trash2 } from "lucide-react";
import ProjectFormModal, {
  ProjectFormData,
} from "~/components/layout/ProjectModal";
import ConfirmationModal from "~/components/layout/ConfirmModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Project Management" },
    {
      name: "description",
      content: "This is the Project Management Dashboard",
    },
  ];
}

export default function Projects() {
  const {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getProjects,
  } = useProject();
  const { users, getUsers } = useUser();
  const {
    searchTerm,
    handleSearchChange,
    filteredItems: filteredProjects,
  } = useSearch(projects, {
    searchableFields: ["title", "description", "status"],
  });

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Handle project form actions
  const handleAddProject = () => {
    setSelectedProject(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleProjectSubmit = async (projectData: ProjectFormData) => {
    setIsModalLoading(true);
    try {
      // Convert string IDs to numbers
      const userIdAsNumbers = projectData.userId.map((id) => parseInt(id, 10));

      if (selectedProject) {
        // Update existing project
        await updateProject(selectedProject.id, {
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          userId: userIdAsNumbers, // Send as numbers
        });
      } else {
        // Create new project
        await createProject({
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          userId: userIdAsNumbers, // Send as numbers
        });
      }
      // Refresh the projects list
      await getProjects();
      closeModals();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;

    setIsModalLoading(true);
    try {
      await deleteProject(selectedProject.id);
      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModals = () => {
    setShowProjectModal(false);
    setShowDeleteModal(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-800"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8 space-y-4">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <div className="mt-6 flex w-full justify-between items-center">
          <Input
            variant="search"
            placeholder="Search projects..."
            className="w-2xl"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <button
            onClick={handleAddProject}
            className="px-4 py-2 bg-violet-800 text-white rounded-lg hover:bg-violet-900 transition-colors"
          >
            Add Project
          </button>
        </div>
        <div>
          <div className="w-full rounded-lg border-1 overflow-hidden">
            <div className="grid grid-cols-20 px-4 py-2 bg-neutral-200 text-sm font-medium uppercase">
              <div className="col-span-2">ID</div>
              <div className="col-span-8">Title</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Members</div>
              <div className="col-span-4 text-end">Actions</div>
            </div>
            {filteredProjects.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No projects found
              </div>
            ) : (
              filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`grid grid-cols-20 px-4 py-2 ${
                    index % 2 === 0 ? "bg-neutral-100" : "bg-neutral-200/70"
                  } items-center`}
                >
                  <div className="col-span-2">{project.id}</div>
                  <div className="col-span-8">{project.title}</div>
                  <div className="col-span-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        project.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <span className="bg-violet-100 text-violet-800 px-2 py-1 rounded-full text-xs">
                      {project.users.length}{" "}
                      {project.users.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="w-10 h-10 text-indigo-600 rounded-md border border-indigo-100 bg-violet-100 hover:bg-violet-200 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="w-10 h-10 text-rose-600 rounded-md border border-rose-100 bg-red-100 hover:bg-red-200 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={showProjectModal}
        onClose={closeModals}
        onSubmit={handleProjectSubmit}
        project={selectedProject}
        title={selectedProject ? "Edit Project" : "Add New Project"}
        users={users}
        isLoading={isModalLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isModalLoading}
      />
    </AppLayout>
  );
}
