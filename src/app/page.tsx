export default function HomePage() {
  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to LunarFlow</h1>
        <p className="text-lg text-muted">
          Your comprehensive project management and team collaboration platform
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-muted">Active Projects</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">🎫</div>
          <div className="text-2xl font-bold">48</div>
          <div className="text-sm text-muted">Open Tickets</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm text-muted">Team Members</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm text-muted">Completed Tasks</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
              <div className="text-2xl">🎫</div>
              <div>
                <div className="font-medium">New ticket created</div>
                <div className="text-sm text-muted">Fix login authentication issue</div>
                <div className="text-xs text-muted">2 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
              <div className="text-2xl">✅</div>
              <div>
                <div className="font-medium">Task completed</div>
                <div className="text-sm text-muted">Database optimization</div>
                <div className="text-xs text-muted">1 hour ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
              <div className="text-2xl">👤</div>
              <div>
                <div className="font-medium">New team member</div>
                <div className="text-sm text-muted">Sarah Johnson joined the team</div>
                <div className="text-xs text-muted">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-primary flex flex-col items-center p-6">
              <div className="text-3xl mb-2">➕</div>
              <div>Create Ticket</div>
            </button>
            <button className="btn btn-secondary flex flex-col items-center p-6">
              <div className="text-3xl mb-2">📁</div>
              <div>New Project</div>
            </button>
            <button className="btn btn-secondary flex flex-col items-center p-6">
              <div className="text-3xl mb-2">📅</div>
              <div>Schedule Meeting</div>
            </button>
            <button className="btn btn-secondary flex flex-col items-center p-6">
              <div className="text-3xl mb-2">📊</div>
              <div>View Reports</div>
            </button>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Website Redesign</h3>
              <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                Active
              </span>
            </div>
            <div className="text-sm text-muted mb-2">Progress: 75%</div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Mobile App</h3>
              <span className="text-sm bg-accent text-accent-foreground px-2 py-1 rounded">
                Planning
              </span>
            </div>
            <div className="text-sm text-muted mb-2">Progress: 25%</div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">API Integration</h3>
              <span className="text-sm bg-destructive text-destructive-foreground px-2 py-1 rounded">
                Blocked
              </span>
            </div>
            <div className="text-sm text-muted mb-2">Progress: 50%</div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
