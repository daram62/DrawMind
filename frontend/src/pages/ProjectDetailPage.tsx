import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService, Project } from '../services/projectService';
import { Button, Card, LoadingSpinner } from '../components/ui';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true);
      const data = await projectService.getById(projectId);
      setProject(data);
    } catch (err) {
      error('Failed to load project');
      setTimeout(() => navigate('/projects'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project || !confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectService.delete(project.id);
      success('Project deleted successfully');
      setTimeout(() => navigate('/projects'), 1000);
    } catch (err) {
      error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading project..." />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <Link to="/projects">
          <Button variant="primary" className="mt-4">
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
      <div className="flex justify-between items-start">
        <div>
          <Link to="/projects" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <span
            className={`inline-block px-3 py-1 text-sm rounded-full mt-2 ${
              project.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {project.status}
          </span>
        </div>
        <Button variant="danger" onClick={handleDelete}>
          Delete Project
        </Button>
      </div>

      {/* Project Details */}
      <Card>
        <Card.Header>
          <Card.Title>Project Details</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <p className="mt-1 text-gray-900">
              {project.description || 'No description provided'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Created</h3>
              <p className="mt-1 text-gray-900">
                {new Date(project.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Last Updated</h3>
              <p className="mt-1 text-gray-900">
                {new Date(project.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {project.metadata && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Metadata</h3>
              <pre className="mt-1 text-sm bg-gray-50 p-3 rounded-lg overflow-auto">
                {JSON.stringify(project.metadata, null, 2)}
              </pre>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Files */}
      <Card>
        <Card.Header>
          <Card.Title>Files ({project.files?.length || 0})</Card.Title>
        </Card.Header>
        <Card.Content>
          {project.files && project.files.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.files.map((file: any) => (
                <div key={file.id} className="border rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.filename}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No files uploaded yet</p>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}

export default ProjectDetailPage;
