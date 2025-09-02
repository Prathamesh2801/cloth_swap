import { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { motion } from "framer-motion";
import { Edit, Trash2, RefreshCw, Eye, SquareArrowOutUpRight } from "lucide-react";
import toast from "react-hot-toast";

import { deleteShop } from "../../../../api/SuperAdmin/ShopAPI";
import ShopViewModal from "./ShopViewModal";
import ConfirmModal from "../../../ui/ConfirmModal";
import { useNavigate } from "react-router-dom";

export default function ShopRecord({
  shops,
  loading,
  onEdit,
  onDeleteSuccess,
  onRefresh,
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedShopId, setSelectedShopId] = useState(null);
  const navigate = useNavigate();
  const handleView = (shop) => {
    setSelectedShopId(shop.Shop_ID);
    setViewModalOpen(true);
  };

  // Custom cell renderer for actions
  const ActionCellRenderer = useCallback(
    (params) => {

      const handleViewClick = () => {
        handleView(params.data);
      };
      const handleEdit = () => {
        onEdit(params.data);
      };

      const showDeleteConfirm = () => {
        setDeleteConfirm(params.data); // store whole shop object
      };
      const redirectToAdmin = () => {
        const shopId = params.data.Shop_ID;
        if (!shopId) {
          toast.error("Shop ID not found");
          return;

        }
        localStorage.setItem("shopId", shopId);
        navigate('/client/dashboard');
      };
      const redirectToUserFlow = () => {
        const shopId = params.data.Shop_ID;
        if (!shopId) {
          toast.error("Shop ID not found");
          return;
        }

        localStorage.setItem("shopId", shopId);

        // Open in new tab
        window.open('http://localhost:5174/#/startup', '_blank');
      };


      return (
        <div className="flex items-center gap-2 h-full">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleViewClick}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="View Shop"
          >
            <Eye className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEdit}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
            title="Edit Shop"
          >
            <Edit className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={showDeleteConfirm}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            title="Delete Shop"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={redirectToAdmin}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            title="Redirect Shop Dashboard"
          >
            <SquareArrowOutUpRight className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={redirectToUserFlow}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
            title="Redirect UserFlow"
          >
            <SquareArrowOutUpRight className="h-4 w-4" />
          </motion.button>
        </div>
      );
    },
    [onEdit]
  );

  // Status cell renderer with badges
  const StatusCellRenderer = useCallback((params) => {
    const status = params.value;
    const statusColors = {
      Active: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Inactive: "bg-red-100 text-red-800",
      Suspended: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || "bg-gray-100 text-gray-800"
          }`}
      >
        {status}
      </span>
    );
  }, []);

  // Column definitions
  const columnDefs = useMemo(
    () => [
      {
        field: "Shop_ID",
        headerName: "Shop ID",
        pinned: "left",
        cellClass: "font-medium",
      },
      {
        field: "Shop_Name",
        headerName: "Shop Name",
        cellClass: "font-medium",
      },
      {
        field: "Status",
        headerName: "Status",
        cellRenderer: StatusCellRenderer,
      },
      {
        field: "Created_AT",
        headerName: "Created At",
        valueFormatter: (params) => {
          if (params.value) {
            return new Date(params.value).toLocaleDateString();
          }
          return "";
        },
      },
      // {
      //   field: "Updated_AT",
      //   headerName: "Updated At",
      //   valueFormatter: (params) => {
      //     if (params.value) {
      //       return new Date(params.value).toLocaleDateString();
      //     }
      //     return "";
      //   },
      // },
      {
        field: "actions",
        headerName: "Actions",
        pinned: "right",
        cellRenderer: ActionCellRenderer,
        sortable: false,
        filter: false,
        resizable: false,
      },
    ],
    [ActionCellRenderer, StatusCellRenderer]
  );

  // Grid options
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    }),
    []
  );

  const gridOptions = useMemo(
    () => ({
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector:
        window.innerWidth < 640 ? [5, 10, 20] : [10, 20, 50, 100],
      animateRows: true,
      rowHeight: 60,
    }),
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto h-12 w-12 text-[#2d1810]"
          >
            <RefreshCw className="h-12 w-12" />
          </motion.div>
          <p className="mt-4 text-lg font-medium text-gray-900">
            Loading shops...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm border border-[#e8dabe] overflow-x-auto">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-[#e8dabe] bg-[#f7f2e5]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Shop Records
            </h2>
            <p className="text-sm text-gray-600">Total: {shops.length} shops</p>
          </div>
        </div>
      </div>

      {/* AG Grid Table */}
      <div className="h-[600px] w-full">
        <div className="ag-theme-alpine h-full min-w-[500px]">
          <AgGridReact
            rowData={shops}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            rowSelection={{ mode: "multiRow", enableClickSelection: false }}
            suppressMenuHide={true}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
          />
        </div>
      </div>

      {/* Empty state */}
      {shops.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No shops found
          </h3>
          <p className="mt-2 text-gray-600">
            Get started by adding your first shop.
          </p>
        </div>
      )}

      {/*   View Modal  */}
      <ShopViewModal
        open={viewModalOpen}
        setOpen={setViewModalOpen}
        shopId={selectedShopId}
      />

      {/* Delete Confirmation Modal (global) */}

      <ConfirmModal
        open={!!deleteConfirm}
        title="Confirm Delete"
        message={
          deleteConfirm
            ? `Are you sure you want to delete category "${deleteConfirm.Shop_Name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={async () => {
          if (deleteConfirm) {
            const deletePromise = deleteShop(deleteConfirm.Shop_ID); // your API call
            toast.promise(deletePromise, {
              loading: "Deleting shop...",
              success: (response) => {
                onRefresh(); // refresh table
                setDeleteConfirm(null);
                return response.Message || "Category deleted successfully";
              },
              error: (error) => {
                return "Failed to delete category: " + error.message;
              },
            });
          }
        }}
      />

    </div>
  );
}
