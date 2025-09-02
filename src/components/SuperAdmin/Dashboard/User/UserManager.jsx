import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Users, Plus, ArrowLeft, EyeIcon } from 'lucide-react';
import UserRecords from './UserRecords';
import UserForm from './UserForm';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../api/SuperAdmin/Credentials';

const UserManage = () => {
    const [currentView, setCurrentView] = useState('records'); // 'records' or 'form'
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [filters, setFilters] = useState({
        Role: '',
        Shop_ID: ''
    });


    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );
            const response = await getUsers(activeFilters);
            if (response.Status) {
                setUsers(response.Data || []);
            } else {
                toast.error(response.Message || 'Failed to fetch users');
            }
        } catch (error) {
            toast.error('Error fetching users');
            console.error('Fetch users error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (userData) => {
        console.log("User Data",userData)
        const promise = createUser(userData);

        toast.promise(promise, {
            loading: 'Creating user...',
            success: (response) => {
                if (response.Status) {
                    fetchUsers(); // Refresh the list
                    setCurrentView('records');
                    return response.Message || 'User created successfully!';
                }
                throw new Error(response.Message || 'Failed to create user');
            },
            error: (err) => 'Failed to create user'
        });

        return promise;
    };

    const handleUpdateUser = async (userData) => {
        const promise = updateUser(userData);

        toast.promise(promise, {
            loading: 'Updating user...',
            success: (response) => {
                if (response.Status) {
                    fetchUsers(); // Refresh the list
                    setCurrentView('records');
                    setEditingUser(null);
                    return response.Message || 'User updated successfully!';
                }
                throw new Error(response.Message || 'Failed to update user');
            },
            error: (err) => err.message || 'Failed to update user'
        });

        return promise;
    };

    const handleDeleteUser = async (username) => {
        const promise = deleteUser(username);

        toast.promise(promise, {
            loading: 'Deleting user...',
            success: (response) => {
                if (response.Status) {
                    fetchUsers(); // Refresh the list
                    return response.Message || 'User deleted successfully!';
                }
                throw new Error(response.Message || 'Failed to delete user');
            },
            error: (err) => err.response.data.Message || err.message || 'Failed to delete user'
        });

        return promise;
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setCurrentView('form');
    };

    const handleNewUser = () => {
        setEditingUser(null);
        setCurrentView('form');
    };

    const handleBack = () => {
        setCurrentView('records');
        setEditingUser(null);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="min-h-screen bg-[#f7f2e5] p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 md:p-6 border border-[#e8dabe]">
                        <div className="flex items-center space-x-3">
                            {currentView === 'form' && (
                                <motion.button
                                    onClick={handleBack}
                                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-[#f7f2e5] rounded-lg transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </motion.button>
                            )}
                            <Users className="h-6 w-6 md:h-7 md:w-7 text-[#8B7355]" />
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                                    User Management
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {currentView === 'records' ? 'Manage user accounts' : editingUser ? 'Edit user details' : 'Create new user'}
                                </p>
                            </div>

                        </div>

                        {currentView === 'records' && (
                            <motion.button
                                onClick={handleNewUser}
                                className="bg-[#8B7355] text-white px-4 py-2 rounded-lg hover:bg-[#7A6249] transition-colors flex items-center space-x-2 text-sm md:text-base"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add User</span>
                                <span className="sm:hidden">Add</span>
                            </motion.button>
                        )}
                        {currentView === 'form' && (
                            <motion.button
                                onClick={handleBack}
                                className="bg-[#8B7355] text-white px-4 py-2 rounded-lg hover:bg-[#7A6249] transition-colors flex items-center space-x-2 text-sm md:text-base"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >

                                <span className="hidden sm:inline">Display Records</span>
                                <span className="sm:hidden">Records</span>
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {currentView === 'records' ? (
                        <motion.div
                            key="records"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <UserRecords
                                users={users}
                                loading={loading}
                                onEdit={handleEdit}
                                onDelete={handleDeleteUser}
                                onFilterChange={handleFilterChange}
                                filters={filters}
                                onRefresh={fetchUsers}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <UserForm
                                editingUser={editingUser}
                                onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                                onCancel={handleBack}
                                isEdit={!!editingUser}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserManage;