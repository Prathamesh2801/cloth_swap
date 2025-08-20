import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { motion } from 'framer-motion';
import { Edit, Trash2, RefreshCw, Filter, X, AlertTriangle } from 'lucide-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

const UserRecords = ({
  users,
  loading,
  onEdit,
  onDelete,
  onFilterChange,
  filters,
  onRefresh
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [deleteConfirm, setDeleteConfirm] = useState(null);


  // Action buttons renderer
  const ActionButtonsRenderer = useCallback((params) => {
    const handleEdit = () => onEdit(params.data);
    const handleDelete = () => {
      setDeleteConfirm(params.data);
    };

    return (
      <div className="flex items-center space-x-2 h-full">
        <motion.button
          onClick={handleEdit}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Edit user"
        >
          <Edit className="h-4 w-4" />
        </motion.button>
        <motion.button
          onClick={handleDelete}
          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Delete user"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>
    );
  }, [onEdit, onDelete]);

  // Role badge renderer
  const RoleBadgeRenderer = useCallback((params) => {
    const role = params.value;
    const getVariant = (role) => {
      switch (role) {
        case 'Super_Admin':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Admin':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Device':
          return 'bg-green-100 text-green-800 border-green-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getVariant(role)}`}>
        {role.replace('_', ' ')}
      </span>
    );
  }, []);

  // Column definitions
  const columnDefs = useMemo(() => [
    {
      headerName: 'Username',
      field: 'Username',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { fontWeight: '500' }
    },
    {
      headerName: 'Role',
      field: 'Role',
      sortable: true,
      filter: true,
      width: 140,
      cellRenderer: RoleBadgeRenderer
    },
    {
      headerName: 'Shop ID',
      field: 'Shop_ID',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.data.Shop_ID || 'N/A',
      cellStyle: (params) => ({
        color: params.data.Shop_ID ? '#374151' : '#9CA3AF',
        fontStyle: params.data.Shop_ID ? 'normal' : 'italic'
      })
    },
    {
      headerName: 'Shop Name',
      field: 'Shop_Name',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.data.Shop_Name || 'N/A',
      cellStyle: (params) => ({
        color: params.data.Shop_Name ? '#374151' : '#9CA3AF',
        fontStyle: params.data.Shop_Name ? 'normal' : 'italic'
      })
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionButtonsRenderer,
      width: 100,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ], [ActionButtonsRenderer, RoleBadgeRenderer]);

  // Grid options
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true
  }), []);

  const handleFilterApply = () => {
    onFilterChange(localFilters);
    setShowFilters(false);
  };

  const handleFilterReset = () => {
    const resetFilters = { Role: '', Shop_ID: '' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    setShowFilters(false);
  };

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-[#e8dabe] p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium">Total Users: {users.length}</span>
            {(filters.Role || filters.Shop_ID) && (
              <span className="text-[#8B7355]">
                (Filtered)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${showFilters
                ? 'bg-[#8B7355] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </motion.button>

            <motion.button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            className="mt-4 pt-4 border-t border-[#e8dabe] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={localFilters.Role}
                onChange={(e) => handleLocalFilterChange('Role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="Super_Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Device">Device</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop ID</label>
              <input
                type="text"
                value={localFilters.Shop_ID}
                onChange={(e) => handleLocalFilterChange('Shop_ID', e.target.value)}
                placeholder="Enter Shop ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              />
            </div>

            <div className="flex items-end space-x-2">
              <motion.button
                onClick={handleFilterApply}
                className="flex-1 bg-[#8B7355] text-white px-4 py-2 rounded-lg hover:bg-[#7A6249] transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply
              </motion.button>
              <motion.button
                onClick={handleFilterReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Data Grid */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-[#e8dabe] overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="h-[600px] w-full ag-theme-alpine">
          <AgGridReact
            rowData={users}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            rowHeight={60}
            headerHeight={50}
            animateRows={true}
            rowSelection={{ mode: "singleRow", enableClickSelection: false }}
            loading={loading}
            overlayLoadingTemplate='<span class="text-gray-600">Loading users...</span>'
            overlayNoRowsTemplate='<span class="text-gray-600">No users found</span>'
            className="text-sm"
            gridOptions={{
              domLayout: 'normal',
              suppressHorizontalScroll: false,
              alwaysShowHorizontalScroll: false,
              suppressColumnVirtualisation: false,
            }}
          />
        </div>
      </motion.div>

      {/* Delete Confirmation Modal (global) */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Delete
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete user "
                  <span className="font-medium">{deleteConfirm.Username}</span>"?
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDelete(deleteConfirm.Username); // ✅ call delete now
                  setDeleteConfirm(null); // close modal after
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default UserRecords;