import type { Route } from "../+types/root";
import AppLayout from "../components/layout/AppLayout";
import Input from "~/components/ui/Input";
import UserFormModal, { UserFormData } from "~/components/layout/UserModal";
import ConfirmationModal from "~/components/layout/ConfirmModal";
import { handleApiError } from "~/lib/utils/errorHandler";
import { Pencil, Trash2, UserRoundPlus } from "lucide-react";
import { useUser } from "~/lib/hooks/useUser";
import { useState } from "react";
import { User } from "~/lib/types/userTypes";
import { useSearch } from "~/lib/hooks/useSearch";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Management" },
    {
      name: "description",
      content: "This is the User Management Dashboard",
    },
  ];
}

export default function Users() {
  const { users, loading, deleteUser, createUser, updateUser, getUsers } =
    useUser();
  const {
    searchTerm,
    handleSearchChange,
    filteredItems: filteredUsers,
  } = useSearch(users, {
    searchableFields: ["name", "email"],
  });

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUserSubmit = async (userData: UserFormData) => {
    setIsModalLoading(true);
    try {
      let result;

      if (selectedUser) {
        // Update existing user
        result = await updateUser(selectedUser.id, {
          name: userData.name,
          email: userData.email,
          age: userData.age,
        });
      } else {
        // Create new user
        result = await createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password!,
          age: userData.age,
        });
      }

      await getUsers();
      closeModals();
      return null;
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    setIsModalLoading(true);
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModals = () => {
    setShowUserModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
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
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="mt-6 flex w-full justify-between items-center">
          <Input
            variant="search"
            placeholder="Search users..."
            className="w-2xl"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <button
            onClick={handleAddUser}
            className="px-6 py-3 bg-sky-800 text-white rounded-full hover:bg-sky-900 transition-colors inline-flex items-center gap-2 cursor-pointer uppercase font-semibold"
          >
            <UserRoundPlus size={20} />
            Add User
          </button>
        </div>
        <div>
          <div className="w-full rounded-lg border-1 overflow-hidden">
            <div className="grid grid-cols-20 px-4 py-2 bg-neutral-200 text-sm font-medium uppercase">
              <div className="col-span-2">ID</div>
              <div className="col-span-5">Name</div>
              <div className="col-span-7">Email</div>
              <div className="col-span-2">Age</div>
              <div className="col-span-4 text-end">Actions</div>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No users found
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`grid grid-cols-20 px-4 py-2 ${
                    index % 2 === 0 ? "bg-neutral-100" : "bg-neutral-200/70"
                  } items-center`}
                >
                  <div className="col-span-2">{user.id}</div>
                  <div className="col-span-5">{user.name}</div>
                  <div className="col-span-7">{user.email}</div>
                  <div className="col-span-2">{user.age || "N/A"}</div>
                  <div className="col-span-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="w-10 h-10 text-indigo-600 rounded-md border border-indigo-100 bg-violet-100 hover:bg-violet-200 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
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

      {/* User Form Modal */}
      <UserFormModal
        isOpen={showUserModal}
        onClose={closeModals}
        onSubmit={handleUserSubmit}
        user={selectedUser}
        title={selectedUser ? "Edit User" : "Add New User"}
        isLoading={isModalLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isModalLoading}
      />
    </AppLayout>
  );
}
