import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { fetchShops } from "../../../../api/SuperAdmin/ShopAPI";

export default function ShopViewModal({ open, setOpen, shopId }) {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && shopId) {
      setLoading(true);
      fetchShops({ Shop_ID: shopId })
        .then((res) => {
          if (res?.Status && res.Data?.shops?.length > 0) {
            setShopData(res.Data.shops[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [open, shopId]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-2xl bg-[#f7f2e5] shadow-xl p-6">
          <DialogTitle className="text-lg font-bold text-gray-900 mb-4">
            Shop Details
          </DialogTitle>

          {loading ? (
            <div className="text-center py-6">Loading...</div>
          ) : shopData ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-3 text-sm"
            >
              {Object.entries(shopData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b border-[#e8dabe] pb-2"
                >
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="text-gray-900">{String(value)}</span>
                </div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-600">No details available</p>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#e8dabe] text-gray-900 font-medium hover:bg-[#d9c8a5] transition"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
