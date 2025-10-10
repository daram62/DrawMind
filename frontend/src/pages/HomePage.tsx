function HomePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Hackathon Infrastructure
        </h1>
        <p className="text-gray-600">
          This is a pre-built infrastructure for AI hackathon projects featuring:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            React + Vite + TypeScript
          </li>
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            Tailwind CSS for styling
          </li>
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            React Router for navigation
          </li>
          <li className="flex items-center">
            <span className="mr-2">✓</span>
            API client utilities
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
