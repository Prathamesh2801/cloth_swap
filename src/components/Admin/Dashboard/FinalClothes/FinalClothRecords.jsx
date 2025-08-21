
import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, RefreshCw, Filter, Image as ImageIcon } from 'lucide-react';
import { BASE_URL } from '../../../../../config';
import ConfirmModal from '../../../ui/ConfirmModal';
import ImageModal from '../../../ui/ImageModal';

const FinalClothRecords = ({
    types,
    loading,
    onView,
    onDelete,
    onRefresh
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        Cloth_Title: '',
        Cloth_Description: ''
    });
    const [imageModal, setImageModal] = useState({ show: false, src: '', title: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Image renderer with preview
    const ImageRenderer = useCallback((params) => {
        const imageUrl = BASE_URL + '/' + params.value;
        if (!params.value) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            );
        }
        const handleImageClick = () => {
            setImageModal({
                show: true,
                src: imageUrl,
                title: params.data.Cloth_Title
            });
        };
        return (
            <div className="flex items-center justify-center h-full">
                <motion.img
                    src={imageUrl}
                    alt={params.data.Cloth_Title}
                    className="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-[#8B7355]"
                    onClick={handleImageClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                />
            </div>
        );
    }, []);

    // Action buttons renderer
    const ActionButtonsRenderer = useCallback((params) => {
        const handleView = () => onView(params.data);

        const handleDelete = () => {
            setDeleteConfirm(params.data);
        };
        return (
            <div className="flex items-center space-x-1 h-full">
                <motion.button
                    onClick={handleView}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="View type"
                >
                    <Eye className="h-4 w-4" />
                </motion.button>

                <motion.button
                    onClick={handleDelete}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete type"
                >
                    <Trash2 className="h-4 w-4" />
                </motion.button>
            </div>
        );
    }, [onView]);

    const columnDefs = useMemo(() => [
        {
            headerName: 'Image',
            field: 'Image_URL',
            cellRenderer: ImageRenderer,
            width: 120,
            sortable: false,
            filter: false
        },
        {
            headerName: 'Cloths Title',
            field: 'Cloth_Title',
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 80,
            cellClass: "flex items-center justify-start font-medium",
        },
        {
            headerName: 'Cloth Description',
            field: 'Cloth_Description',
            sortable: true,
            filter: true,
            flex: 1,
            minWidth: 120,
            cellClass: "flex items-center justify-start text-gray-700 text-sm",
        },


        {
            headerName: 'Actions',
            cellRenderer: ActionButtonsRenderer,
            width: 120,
            sortable: false,
            filter: false,

        }
    ], [ImageRenderer, ActionButtonsRenderer]);

    const defaultColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true
    }), []);

    // Filtering logic (optional, can be expanded)
    const filteredTypes = useMemo(() => {
        return types.filter(type => {
            const titleMatch = type.Cloth_Title.toLowerCase().includes(filters.Cloth_Title.toLowerCase());
            const descMatch = type.Cloth_Description.toLowerCase().includes(filters.Cloth_Description.toLowerCase());
            return titleMatch && descMatch;
        });
    }, [types, filters]);

    // ...existing code...
    // Confirm Modal for delete
    const closeImageModal = () => {
        setImageModal({ show: false, src: '', title: '' });
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
                        <span className="font-medium">Total Types: {filteredTypes.length}</span>
                        {(filters.Cloth_Title || filters.Cloth_Description) && (
                            <span className="text-[#8B7355]">
                                (Filtered from {types.length})
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
                        className="mt-4 pt-4 border-t border-[#e8dabe] grid grid-cols-1 sm:grid-cols-2 gap-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type Title</label>
                            <input
                                type="text"
                                value={filters.Cloth_Title}
                                onChange={e => setFilters(f => ({ ...f, Cloth_Title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
                                placeholder="Enter Type Title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type Description</label>
                            <input
                                type="text"
                                value={filters.Cloth_Description}
                                onChange={e => setFilters(f => ({ ...f, Cloth_Description: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
                                placeholder="Enter Type Description"
                            />
                        </div>
                        <div className="flex items-end space-x-2">
                            <motion.button
                                onClick={() => setFilters({ Cloth_Title: '', Cloth_Description: '' })}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Reset Filters
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
                        rowData={filteredTypes}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        rowHeight={100}
                        headerHeight={50}
                        animateRows={true}
                        // rowSelection={{ type: "singleRow", enableClickSelection: false }}
                        loading={loading}
                        overlayLoadingTemplate='<span class="text-gray-600">Loading types...</span>'
                        overlayNoRowsTemplate='<span class="text-gray-600">No types found</span>'
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
            {/* Image Modal */}

            <ImageModal
                isOpen={imageModal.show}
                onClose={closeImageModal}
                imageSrc={imageModal.src}
                imageTitle={imageModal.title}
                imageAlt={imageModal.title || 'Type image'}
                showTitle={true}
                overlayOpacity={0.75}
                maxWidth="4xl"
            />


            {/* Confirm Modal for delete */}

            <ConfirmModal
                open={!!deleteConfirm}
                title="Confirm Delete"
                message={
                    deleteConfirm
                        ? `Are you sure you want to delete type "${deleteConfirm.Cloth_Title}"? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete"
                confirmColor="bg-red-600 hover:bg-red-700"
                onCancel={() => setDeleteConfirm(null)}
                onConfirm={() => {
                    if (deleteConfirm) {
                        onDelete(deleteConfirm.Cloth_ID);
                        setDeleteConfirm(null);
                    }
                }}
            />

        </div>
    );
};

export default FinalClothRecords;
