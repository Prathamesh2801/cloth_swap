
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Package, Plus, ArrowLeft } from 'lucide-react';
import CategoryTypesRecords from './CategoryTypesRecords';
import CategoryTypesForm from './CategoryTypesForm';
import {
    getCategoriesTypes,
    createCategoryTypes,
    updateCategoryTypes,

    deleteCategoryTypes
} from '../../../../api/Client/CategoryTypesAPI';




const getHeaderSubtitle = (formMode) => {
    switch (formMode) {
        case 'view':
            return 'Type information and details';
        case 'edit':
            return 'Update type information';
        case 'create':
        default:
            return 'Add a new type to the system';
    }
};

const CategoryTypesManage = () => {
    const [currentView, setCurrentView] = useState('records');
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [viewingType, setViewingType] = useState(null);
    const [formMode, setFormMode] = useState('create');

    // const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const response = await getCategoriesTypes(null, null, null, null);
            if (response.Status) {
                setTypes(response.Data || []);

            } else {
                toast.error(response.Message || 'Failed to fetch types');
            }
        } catch (error) {
            toast.error('Error fetching types');
            console.error('Fetch types error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateType = async (typeData) => {
        const promise = createCategoryTypes(typeData);
        toast.promise(promise, {
            loading: 'Creating type...',
            success: (response) => {
                if (response.Status) {
                    fetchTypes();
                    setCurrentView('records');
                    return response.Message || 'Type created successfully!';
                }
                throw new Error(response.Message || 'Failed to create type');
            },
            error: (err) => err.message || 'Failed to create type'
        });
        return promise;
    };

    const handleUpdateType = async (updateData) => {

        const promise = updateCategoryTypes(updateData);

        toast.promise(promise, {
            loading: 'Updating type...',
            success: (response) => {
                if (response.Status) {
                    fetchTypes();
                    setCurrentView('records');
                    setEditingType(null);
                    return response.Message || 'Type updated successfully!';
                }
                throw new Error(response.Message || 'Failed to update type');
            },
            error: (err) => err.message || 'Failed to update type'
        });
        return promise;
    };

    const handleDeleteType = async (typeId) => {
        const promise = deleteCategoryTypes(typeId);
        toast.promise(promise, {
            loading: 'Deleting type...',
            success: (response) => {
                if (response.Status) {
                    fetchTypes();
                    return response.Message || 'Type deleted successfully!';
                }
                throw new Error(response.Message || 'Failed to delete type');
            },
            error: (err) => err.message || 'Failed to delete type'
        });
        return promise;
    };

    const handleEditType = (type) => {
        setEditingType(type);
        setFormMode('edit');
        setCurrentView('form');
    };
    const handleViewType = (type) => {
        setViewingType(type);
        setFormMode('view');
        setCurrentView('form');
    };
    const handleFormCancel = () => {
        setEditingType(null);
        setViewingType(null);
        setFormMode('create');
        setCurrentView('records');
    };
    const handleAddType = () => {
        setEditingType(null);
        setViewingType(null);
        setFormMode('create');
        setCurrentView('form');
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
                                    onClick={handleFormCancel}
                                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-[#f7f2e5] rounded-lg transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </motion.button>
                            )}
                            <Package className="h-6 w-6 md:h-7 md:w-7 text-[#8B7355]" />
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                                    Types Management
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {currentView === 'records' ? 'Manage category types' : getHeaderSubtitle(formMode)}
                                </p>
                            </div>
                        </div>
                        {currentView === 'records' && (
                            <motion.button
                                onClick={handleAddType}
                                className="bg-[#8B7355] text-white px-4 py-2 rounded-lg hover:bg-[#7A6249] transition-colors flex items-center space-x-2 text-sm md:text-base"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Add Type</span>
                                <span className="sm:hidden">Add</span>
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
                            <CategoryTypesRecords
                                types={types}
                                loading={loading}
                                onEdit={handleEditType}
                                onView={handleViewType}
                                onDelete={handleDeleteType}
                                onRefresh={fetchTypes}
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
                            <CategoryTypesForm
                                editingType={editingType}
                                viewingType={viewingType}
                                onSubmit={formMode === 'edit' ? handleUpdateType : handleCreateType}
                                onCancel={handleFormCancel}

                                mode={formMode}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategoryTypesManage;
