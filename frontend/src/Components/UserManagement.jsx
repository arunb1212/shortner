import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  MoreVertical, 
  X, 
  Check, 
  UserPlus, 
  ShieldAlert, 
  RotateCcw
} from 'lucide-react';

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Florence Shaw',
    email: 'florence@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    access: ['Admin', 'Data Export', 'Data Import'],
    lastActive: 'Mar 4, 2024',
    dateAdded: 'July 4, 2022'
  },
  {
    id: 2,
    name: 'Amélie Laurent',
    email: 'amelie@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    access: ['Admin', 'Data Export', 'Data Import'],
    lastActive: 'Mar 4, 2024',
    dateAdded: 'July 4, 2022'
  },
  {
    id: 3,
    name: 'Ammar Foley',
    email: 'ammar@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    access: ['Data Export', 'Data Import'],
    lastActive: 'Mar 2, 2024',
    dateAdded: 'July 4, 2022'
  },
  {
    id: 4,
    name: 'Caitlyn King',
    email: 'caitlyn@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    access: ['Data Export', 'Data Import'],
    lastActive: 'Mar 6, 2024',
    dateAdded: 'July 4, 2022'
  },
  {
    id: 5,
    name: 'Sienna Hewitt',
    email: 'sienna@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop',
    access: ['Data Export', 'Data Import'],
    lastActive: 'Mar 8, 2024',
    dateAdded: 'July 4, 2022'
  },
  {
    id: 6,
    name: 'Olly Schroeder',
    email: 'olly@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    access: ['Data Export', 'Data Import'],
    lastActive: 'Mar 6, 2024',
    dateAdded: 'July 4, 2022'
  },
  {
    id: 7,
    name: 'Mathilde Lewis',
    email: 'mathilde@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    access: ['Data Export', 'Data Import'],
    lastActive: 'Mar 4, 2024',
    dateAdded: 'July 4, 2022'
  },
  {
    id: 8,
    name: 'Jaya Willis',
    email: 'jaya@untitledui.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150&auto=format&fit=crop',
    access: ['Data Export', 'Data Import'],
    lastActive: 'Mar 4, 2024',
    dateAdded: 'July 4, 2022'
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [activePage, setActivePage] = useState(1);
  
  // Modals & Popovers
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  // Add Form fields
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAccess, setNewAccess] = useState({
    Admin: false,
    DataExport: true,
    DataImport: true
  });
  
  // Toast notifications
  const [toast, setToast] = useState(null); // { message: string, undoAction: () => void }
  const [lastAction, setLastAction] = useState(null); // Save last state for undo

  // Handle outside click to close menus and global event to open add modal
  useEffect(() => {
    const handleClose = () => setActiveMenuId(null);
    const handleOpenModal = () => setShowAddModal(true);
    window.addEventListener('click', handleClose);
    window.addEventListener('open-add-user-modal', handleOpenModal);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('open-add-user-modal', handleOpenModal);
    };
  }, []);

  // Filter logic
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Checkbox selections
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Toast display trigger
  const triggerToast = (message, undoFn = null) => {
    setToast({ message, undoFn });
    // Auto dismiss after 5s
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  };

  // Add User action
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const accessList = [];
    if (newAccess.Admin) accessList.push('Admin');
    if (newAccess.DataExport) accessList.push('Data Export');
    if (newAccess.DataImport) accessList.push('Data Import');

    const newUser = {
      id: Date.now(),
      name: newName,
      email: newEmail.toLowerCase(),
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?q=80&w=150&auto=format&fit=crop`,
      access: accessList,
      lastActive: 'Just now',
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setLastAction({ type: 'ADD', data: newUser });
    setUsers([newUser, ...users]);
    setShowAddModal(false);
    
    // Clear Form
    setNewName('');
    setNewEmail('');
    setNewAccess({ Admin: false, DataExport: true, DataImport: true });

    triggerToast(`“${newUser.name}” successfully added to organization`, () => {
      setUsers(prev => prev.filter(u => u.id !== newUser.id));
    });
  };

  // Toggle roles
  const handleToggleAdmin = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) return;

    const updatedAccess = targetUser.access.includes('Admin')
      ? targetUser.access.filter(a => a !== 'Admin')
      : ['Admin', ...targetUser.access];

    // Save previous state for undo
    setLastAction({ type: 'TOGGLE_ROLE', id, prevAccess: targetUser.access });

    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, access: updatedAccess };
      }
      return u;
    }));

    triggerToast(`“${targetUser.name}” details updated`, () => {
      setUsers(prev => prev.map(u => {
        if (u.id === id) {
          return { ...u, access: targetUser.access };
        }
        return u;
      }));
    });
  };

  // Delete User
  const handleDeleteUser = (id, e) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const targetUser = users.find(u => u.id === id);
    if (!targetUser) return;

    setLastAction({ type: 'DELETE', data: targetUser, index: users.findIndex(u => u.id === id) });
    setUsers(users.filter(u => u.id !== id));

    triggerToast(`“${targetUser.name}” removed from organization`, () => {
      setUsers(prev => {
        const restored = [...prev];
        restored.splice(users.findIndex(u => u.id === id), 0, targetUser);
        return restored;
      });
    });
  };

  const handleUndo = () => {
    if (toast && toast.undoFn) {
      toast.undoFn();
      setToast(null);
      triggerToast('Action successfully undone');
    }
  };

  return (
    <div className="space-y-6 relative animate-slide-up pb-12">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">User management</h1>
          <p className="text-xs text-zinc-500">
            Manage your team members and their account permissions here.
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 bg-white border px-3 py-1.5 rounded-lg shadow-sm w-fit self-end sm:self-start">
          <span>All users</span>
          <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-800 rounded font-bold font-mono">
            {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 border border-zinc-100 rounded-xl shadow-premium">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email or full name..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition-all"
          />
        </div>

        {/* Tool actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button className="flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-50 transition-all shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span>Filters</span>
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-all shadow-premium"
          >
            <Plus className="w-4 h-4" />
            <span>Add user</span>
          </button>
        </div>
      </div>

      {/* Users table Card */}
      <div className="bg-white border border-zinc-100 rounded-2xl shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
                    className="w-4 h-4 accent-zinc-950 cursor-pointer rounded border-zinc-300"
                  />
                </th>
                <th className="p-4">User name</th>
                <th className="p-4">Access</th>
                <th className="p-4">Last active</th>
                <th className="p-4">Date added</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-600">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center space-y-2">
                    <ShieldAlert className="w-6 h-6 text-zinc-400 mx-auto" />
                    <h4 className="font-bold text-zinc-900 text-sm">No members found</h4>
                    <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">Try refining your search keyword or invite a new team member above.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/50 transition-all font-medium">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => handleSelectOne(user.id)}
                        className="w-4 h-4 accent-zinc-950 cursor-pointer rounded border-zinc-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border shadow-sm object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-zinc-900 text-xs">{user.name}</h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {user.access.map((role, idx) => {
                          let badgeStyle = "bg-zinc-100 text-zinc-800";
                          if (role === 'Admin') badgeStyle = "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100";
                          if (role === 'Data Export') badgeStyle = "bg-blue-50 text-blue-700 font-bold border border-blue-100";
                          if (role === 'Data Import') badgeStyle = "bg-purple-50 text-purple-700 font-bold border border-purple-100";
                          
                          return (
                            <span key={idx} className={`px-2 py-0.5 rounded-full text-[9px] ${badgeStyle}`}>
                              {role}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 text-xs font-semibold">
                      {user.lastActive}
                    </td>
                    <td className="p-4 text-zinc-400 text-xs font-semibold">
                      {user.dateAdded}
                    </td>
                    <td className="p-4 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === user.id ? null : user.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-all shrink-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === user.id && (
                        <div
                          className="absolute right-4 top-12 w-40 bg-white border border-zinc-100 rounded-xl shadow-premium-lg z-20 py-1.5 divide-y divide-zinc-100 animate-fade-in text-left"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleToggleAdmin(user.id, e)}
                            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold hover:bg-zinc-50 text-zinc-850"
                          >
                            <span>Toggle Admin</span>
                            {user.access.includes('Admin') && <Check className="w-3.5 h-3.5 text-green-600" />}
                          </button>
                          <button
                            onClick={(e) => handleDeleteUser(user.id, e)}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-red-50 text-red-600"
                          >
                            Remove member
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
          <button
            onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
            disabled={activePage === 1}
            className="px-3 py-1.5 border rounded-lg bg-white text-[11px] font-bold shadow-sm hover:bg-zinc-50 transition-all disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(page => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`w-7 h-7 rounded-lg text-[11px] font-bold font-mono transition-all ${
                  page === activePage 
                    ? 'bg-zinc-100 text-zinc-950 font-bold border' 
                    : 'text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActivePage(prev => Math.min(prev + 1, 6))}
            disabled={activePage === 6}
            className="px-3 py-1.5 border rounded-lg bg-white text-[11px] font-bold shadow-sm hover:bg-zinc-50 transition-all disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Floating Bottom Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151515] border border-zinc-800 text-white p-3 rounded-xl shadow-premium-xl flex items-center gap-4 animate-toast max-w-sm">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-500 stroke-[3px]" />
            </span>
            <p className="text-xs font-semibold text-zinc-200">{toast.message}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 border-l border-zinc-800 pl-3">
            {toast.undoFn && (
              <button
                onClick={handleUndo}
                className="text-[10px] font-bold text-white hover:text-zinc-300 transition-colors uppercase tracking-wider"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => setToast(null)}
              className="text-zinc-500 hover:text-white p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 w-full max-w-md shadow-premium-xl animate-scale space-y-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-zinc-800" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">Add Team Member</h3>
                  <p className="text-[10px] text-zinc-400">Invite a new member to access organization dashboards.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddUser} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Florence Shaw"
                  className="w-full px-3 py-2 bg-zinc-50 border rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-zinc-50 border rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                />
              </div>

              {/* Checks */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Access Levels</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={newAccess.Admin}
                      onChange={(e) => setNewAccess({ ...newAccess, Admin: e.target.checked })}
                      className="w-4 h-4 accent-zinc-950 rounded border-zinc-300"
                    />
                    <span>Administrator role (Admin)</span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-xs cursor-pointer font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={newAccess.DataExport}
                      onChange={(e) => setNewAccess({ ...newAccess, DataExport: e.target.checked })}
                      className="w-4 h-4 accent-zinc-950 rounded border-zinc-300"
                    />
                    <span>Data Export permission</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={newAccess.DataImport}
                      onChange={(e) => setNewAccess({ ...newAccess, DataImport: e.target.checked })}
                      className="w-4 h-4 accent-zinc-950 rounded border-zinc-300"
                    />
                    <span>Data Import permission</span>
                  </label>
                </div>
              </div>

              {/* Submit Modal */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-premium transition-all"
                >
                  Invite Member
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
