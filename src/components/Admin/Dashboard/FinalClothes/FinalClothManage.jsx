
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Package, Plus, ArrowLeft } from 'lucide-react';
import { getFinalClothes, createFinalClothes, deleteFinalClothes } from '../../../../api/Client/FinalClothesAPI';
import FinalClothRecords from './FinalClothRecords';
import FinalClothForm from './FinalClothForm';

const FinalClothManage = () => {
    const [currentView, setCurrentView] = useState('records');
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewingType, setViewingType] = useState(null);
    const [formMode, setFormMode] = useState('create');

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const response = await getFinalClothes(null, null, null, null);
            if (response.Status) setTypes(response.Data || []);
            else toast.error(response.Message || 'Failed to fetch types');
        } catch (error) {
            toast.error('Error fetching types');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateType = async (typeData) => {
        const promise = createFinalClothes(typeData);
        toast.promise(promise, {
            loading: 'Creating type...',
            success: (response) => {
                if (response.Status) {
                    fetchTypes();
                    setCurrentView('records');
                    return 'Type created successfully!';
                }
                throw new Error(response.Message || 'Failed to create type');
            },
            error: (err) => err.message || 'Failed to create type'
        });
        return promise;
    };

    const handleDeleteType = async (typeId) => {
        const promise = deleteFinalClothes(typeId);
        toast.promise(promise, {
            loading: 'Deleting type...',
            success: (response) => {
                if (response.Status) {
                    fetchTypes();
                    return 'Type deleted successfully!';
                }
                throw new Error(response.Message || 'Failed to delete type');
            },
            error: (err) => err.message || 'Failed to delete type'
        });
        return promise;
    };

    const handleViewType = (type) => {
        setViewingType(type);
        setFormMode('view');
        setCurrentView('form');
    };

    const handleFormCancel = () => {
        setViewingType(null);
        setFormMode('create');
        setCurrentView('records');
    };

    const handleAddType = () => {
        setViewingType(null);
        setFormMode('create');
        setCurrentView('form');
    };

    return (
        <div className="min-h-screen bg-[#f7f2e5] p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <motion.div className="mb-6">
                    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 md:p-6 border border-[#e8dabe]">
                        <div className="flex items-center space-x-3">
                            {currentView === 'form' && (
                                <motion.button onClick={handleFormCancel} className="p-2 text-gray-600">
                                    <ArrowLeft className="h-5 w-5" />
                                </motion.button>
                            )}
                            <Package className="h-6 w-6 text-[#8B7355]" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Clothes Management</h1>
                                <p className="text-sm text-gray-600">
                                    {currentView === 'records' ? 'Manage category types' : (formMode === 'view' ? 'Type information' : 'Add new type')}
                                </p>
                            </div>
                        </div>
                        {currentView === 'records' && (
                            <motion.button onClick={handleAddType} className="bg-[#8B7355] text-white px-4 py-2 rounded-lg flex items-center">
                                <Plus className="h-4 w-4" /> Add
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {currentView === 'records' ? (
                        <FinalClothRecords types={types} loading={loading} onView={handleViewType} onDelete={handleDeleteType} onRefresh={fetchTypes} />
                    ) : (
                        <FinalClothForm viewingType={viewingType} onSubmit={handleCreateType} onCancel={handleFormCancel} mode={formMode} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FinalClothManage;


