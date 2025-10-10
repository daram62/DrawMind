import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen paper-bg">
      {/* Header */}
      <header className="bg-white shadow-sketch border-b-2 border-sketch-brown/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="font-sketch text-3xl text-sketch-brown hover:text-sketch-orange transition-colors">
              ✏️ DrawMind
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-9rem)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-sketch-brown/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center font-hand text-sm text-sketch-brown/70">
            © 2025 DrawMind · 5th SKKU-AI Hackathon · Team 헉해톤
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
