export default function TicketsPage() {
  const tickets = [
    {
      id: 'T-001',
      title: 'Fix login authentication issue',
      status: 'Open',
      priority: 'High',
      assignee: 'John Doe',
      created: '2025-01-10',
    },
    {
      id: 'T-002',
      title: 'Update user profile page',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'Jane Smith',
      created: '2025-01-09',
    },
    {
      id: 'T-003',
      title: 'Database optimization',
      status: 'Completed',
      priority: 'Low',
      assignee: 'Mike Johnson',
      created: '2025-01-08',
    },
    {
      id: 'T-004',
      title: 'Mobile app responsive design',
      status: 'Open',
      priority: 'High',
      assignee: 'Sarah Wilson',
      created: '2025-01-07',
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (status) {
      case 'Open':
        return `${baseClasses} bg-destructive text-destructive-foreground`;
      case 'In Progress':
        return `${baseClasses} bg-primary text-primary-foreground`;
      case 'Completed':
        return `${baseClasses} bg-accent text-accent-foreground`;
      default:
        return `${baseClasses} bg-secondary text-secondary-foreground`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (priority) {
      case 'High':
        return `${baseClasses} bg-destructive text-destructive-foreground`;
      case 'Medium':
        return `${baseClasses} bg-primary text-primary-foreground`;
      case 'Low':
        return `${baseClasses} bg-secondary text-secondary-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Tickets</h1>
          <p className="text-muted">Manage and track support tickets and issues</p>
        </div>
        <button className="btn btn-primary">
          ➕ Create New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <select className="input">
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <select className="input">
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Assignee</label>
            <select className="input">
              <option>All</option>
              <option>John Doe</option>
              <option>Jane Smith</option>
              <option>Mike Johnson</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn btn-secondary">Apply Filters</button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Priority</th>
                <th className="text-left p-4 font-medium">Assignee</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-border">
                  <td className="p-4 font-medium text-primary">{ticket.id}</td>
                  <td className="p-4">{ticket.title}</td>
                  <td className="p-4">
                    <span className={getStatusBadge(ticket.status)}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={getPriorityBadge(ticket.priority)}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">{ticket.assignee}</td>
                  <td className="p-4 text-muted">{ticket.created}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="btn btn-secondary text-sm">View</button>
                      <button className="btn btn-primary text-sm">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 