import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService, Project } from '../services/projectService';
import { Button, Card, LoadingSpinner } from '../components/ui';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getAll({ limit: 20 });
      setProjects(response.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectService.delete(id);
      success('Project deleted successfully');
      loadProjects();
    } catch (err) {
      showError('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading projects..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your hackathon projects</p>
        </div>
        <Link to="/projects/new">
          <Button variant="primary">Create Project</Button>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button variant="secondary" size="sm" onClick={loadProjects} className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <Link to="/projects/new">
            <Button variant="primary">Create Your First Project</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} hover className="flex flex-col">
              <Card.Header>
                <Card.Title>{project.title}</Card.Title>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status}
                </span>
              </Card.Header>
              <Card.Content className="flex-1">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {project.description || 'No description'}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                  {project.files && project.files.length > 0 && (
                    <p className="mt-1">{project.files.length} file(s)</p>
                  )}
                </div>
              </Card.Content>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Link to={`/projects/${project.id}`} className="flex-1">
                  <Button variant="primary" size="sm" fullWidth>
                    View
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
