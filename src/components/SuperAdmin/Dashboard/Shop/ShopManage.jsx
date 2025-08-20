import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, RefreshCw } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import ShopRecord from './ShopRecord'
import ShopForm from './ShopForm'
import { fetchShops } from '../../../../api/SuperAdmin/ShopAPI'


export default function ShopManage() {
    const [currentView, setCurrentView] = useState('records') // 'records' or 'form'
    const [shops, setShops] = useState([])
    const [loading, setLoading] = useState(false)
    const [editingShop, setEditingShop] = useState(null)
    const [filters, setFilters] = useState({
        Shop_ID: '',
        City: '',
        State: ''
    })
    const [showFilters, setShowFilters] = useState(false)

    // Fetch shops data
    const loadShops = async (appliedFilters = {}) => {
        setLoading(true)
        try {
            const response = await fetchShops(appliedFilters)
            if (response.Status) {
                setShops(response.Data.shops || [])
                // toast.success(response.Message || 'Shops loaded successfully')
            } else {
                toast.error(response.Message || 'Failed to load shops')
            }
        } catch (error) {
            toast.error('Error loading shops: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    // Load shops on component mount
    useEffect(() => {
        loadShops()
    }, [])

    // Handle edit shop
    const handleEditShop = (shop) => {
        setEditingShop(shop)
        setCurrentView('form')
    }

    // Handle add new shop
    const handleAddShop = () => {
        setEditingShop(null)
        setCurrentView('form')
    }

    // Handle form success (add/update)
    const handleFormSuccess = () => {
        setCurrentView('records')
        setEditingShop(null)
        loadShops(filters) // Reload with current filters
    }

    // Handle form cancel
    const handleFormCancel = () => {
        setCurrentView('records')
        setEditingShop(null)
    }

    // Handle delete success
    const handleDeleteSuccess = () => {
        loadShops(filters) // Reload with current filters
    }

    // Handle filter change
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Apply filters
    const applyFilters = () => {
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value.trim() !== '')
        )
        loadShops(activeFilters)
    }

    // Clear filters
    const clearFilters = () => {
        setFilters({
            Shop_ID: '',
            City: '',
            State: ''
        })
        loadShops()
    }

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 }
    }

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.4
    }

    return (
        <div className="min-h-screen bg-[#f7f2e5]">
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#2d1810',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#059669',
                        },
                    },
                    error: {
                        style: {
                            background: '#dc2626',
                        },
                    },
                }}
            />
            
            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Shop Management
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Manage your shops, add new ones, and keep track of all locations
                                </p>
                            </div>
                            
                            {currentView === 'records' && (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 rounded-lg bg-[#e8dabe] px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-[#ddd1b3] transition-colors"
                                    >
                                        <Filter className="h-4 w-4" />
                                        Filters
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => loadShops(filters)}
                                        disabled={loading}
                                        className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddShop}
                                        className="flex items-center gap-2 rounded-lg bg-[#2d1810] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3d2420] transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Shop
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Filters Section */}
                        <AnimatePresence>
                            {showFilters && currentView === 'records' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-6 overflow-hidden"
                                >
                                    <div className="rounded-lg bg-white p-6 shadow-sm border border-[#e8dabe]">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Shops</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Shop ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={filters.Shop_ID}
                                                    onChange={(e) => handleFilterChange('Shop_ID', e.target.value)}
                                                    placeholder="Enter Shop ID"
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2d1810] focus:outline-none focus:ring-1 focus:ring-[#2d1810]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={filters.City}
                                                    onChange={(e) => handleFilterChange('City', e.target.value)}
                                                    placeholder="Enter City"
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2d1810] focus:outline-none focus:ring-1 focus:ring-[#2d1810]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    value={filters.State}
                                                    onChange={(e) => handleFilterChange('State', e.target.value)}
                                                    placeholder="Enter State"
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2d1810] focus:outline-none focus:ring-1 focus:ring-[#2d1810]"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={applyFilters}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-[#2d1810] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3d2420] transition-colors"
                                            >
                                                Apply Filters
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={clearFilters}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 transition-colors"
                                            >
                                                Clear Filters
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        {currentView === 'records' && (
                            <motion.div
                                key="records"
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                            >
                                <ShopRecord 
                                    shops={shops}
                                    loading={loading}
                                    onEdit={handleEditShop}
                                    onDeleteSuccess={handleDeleteSuccess}
                                    onRefresh={() => loadShops(filters)}
                                />
                            </motion.div>
                        )}
                        
                        {currentView === 'form' && (
                            <motion.div
                                key="form"
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                            >
                                <ShopForm 
                                    editingShop={editingShop}
                                    onSuccess={handleFormSuccess}
                                    onCancel={handleFormCancel}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}