/**
 * Entities Management Page
 * Complete CRUD operations with search, filter, and responsive table
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  createEntitySchema,
  updateEntitySchema,
  type CreateEntityInput,
  type UpdateEntityInput,
} from "@/lib/validations";
import { Entity } from "@/types";

export default function EntitiesPage() {
  const { showSuccess, showError } = useToast();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEntities = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter) params.append("category", categoryFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (priorityFilter) params.append("priority", priorityFilter);

      const response = await fetch(`/api/entities?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setEntities(result.data);
      }
    } catch (error) {
      showError("Failed to fetch entities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, [searchQuery, categoryFilter, statusFilter, priorityFilter]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    return Array.from(new Set(entities.map((e) => e.category)));
  }, [entities]);

  const handleCreate = async (data: CreateEntityInput) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/entities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showSuccess("Entity created successfully");
        setIsCreateModalOpen(false);
        fetchEntities();
        createForm.reset();
      } else {
        const result = await response.json();
        showError(result.message || "Failed to create entity");
      }
    } catch (error) {
      showError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateEntityInput) => {
    if (!selectedEntity) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/entities/${selectedEntity.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showSuccess("Entity updated successfully");
        setIsEditModalOpen(false);
        fetchEntities();
        setSelectedEntity(null);
      } else {
        const result = await response.json();
        showError(result.message || "Failed to update entity");
      }
    } catch (error) {
      showError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEntity) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/entities/${selectedEntity.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        showSuccess("Entity deleted successfully");
        setIsDeleteModalOpen(false);
        fetchEntities();
        setSelectedEntity(null);
      } else {
        const result = await response.json();
        showError(result.message || "Failed to delete entity");
      }
    } catch (error) {
      showError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createForm = useForm<CreateEntityInput>({
    resolver: zodResolver(createEntitySchema),
  });

  const editForm = useForm<UpdateEntityInput>({
    resolver: zodResolver(updateEntitySchema),
  });

  const openEditModal = (entity: Entity) => {
    setSelectedEntity(entity);
    editForm.reset({
      title: entity.title,
      description: entity.description || "",
      category: entity.category,
      status: entity.status as any,
      priority: entity.priority as any,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (entity: Entity) => {
    setSelectedEntity(entity);
    setIsDeleteModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "archived":
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
      case "deleted":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading entities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Entities
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your entities with full CRUD operations
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="primary">
          <Plus className="w-5 h-5" />
          Create Entity
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search entities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="deleted">Deleted</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Entities Table/Grid */}
      {entities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No entities found. Create your first entity to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {entities.map((entity) => (
            <Card key={entity.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {entity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {entity.description || "No description"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(entity)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      aria-label="Edit entity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(entity)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Delete entity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {entity.category}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      entity.status
                    )}`}
                  >
                    {entity.status}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      entity.priority
                    )}`}
                  >
                    {entity.priority}
                  </span>
                </div>

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Created {new Date(entity.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Entity"
      >
        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
          <Input
            {...createForm.register("title")}
            label="Title"
            placeholder="Enter entity title"
            error={createForm.formState.errors.title?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              {...createForm.register("description")}
              placeholder="Enter entity description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {createForm.formState.errors.description && (
              <p className="mt-1.5 text-sm text-red-600">
                {createForm.formState.errors.description.message}
              </p>
            )}
          </div>

          <Input
            {...createForm.register("category")}
            label="Category"
            placeholder="e.g., work, personal, project"
            error={createForm.formState.errors.category?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Priority
            </label>
            <select
              {...createForm.register("priority")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create Entity
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Entity"
      >
        <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
          <Input
            {...editForm.register("title")}
            label="Title"
            placeholder="Enter entity title"
            error={editForm.formState.errors.title?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              {...editForm.register("description")}
              placeholder="Enter entity description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <Input
            {...editForm.register("category")}
            label="Category"
            placeholder="e.g., work, personal, project"
            error={editForm.formState.errors.category?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Status
            </label>
            <select
              {...editForm.register("status")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Priority
            </label>
            <select
              {...editForm.register("priority")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Update Entity
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Entity"
        message={`Are you sure you want to delete "${selectedEntity?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
}
