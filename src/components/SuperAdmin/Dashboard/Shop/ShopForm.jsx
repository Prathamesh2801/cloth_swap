import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, X, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { addShop, updateShop, fetchShops, getFormFields } from '../../../../api/ShopApi'

/**
 * ShopForm
 * Props:
 *  - editingShop: null | shop object (when truthy -> edit mode)
 *  - onSuccess: () => void (called after successful create/update)
 *  - onCancel: () => void (navigate back to records view)
 */
export default function ShopForm({ editingShop, onSuccess, onCancel }) {
  const [fields, setFields] = useState([])
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  const isEditing = Boolean(editingShop)

  // Known field metadata (labels, types, validation). Anything not listed defaults to text input
  const fieldMeta = useMemo(() => ({
    Shop_Name: { label: 'Shop Name', required: true, placeholder: 'e.g., Acme Super Store' },
    Address_1: { label: 'Address Line 1', placeholder: 'Building / Street' },
    Address_2: { label: 'Address Line 2', placeholder: 'Area / Landmark' },
    City: { label: 'City', required: true },
    State: { label: 'State', required: true },
    Pincode: { label: 'Pincode', inputMode: 'numeric', pattern: '^\\d{6}$', placeholder: '6-digit code' },
    Status: { label: 'Status', type: 'select', options: ['Active', 'Pending', 'Inactive', 'Suspended'], required: true },
  }), [])

  // Fetch fields (structure) on mount and hydrate initial values
  useEffect(() => {
    const init = async () => {
      try {
        // Fetch shops once to infer the structure of fields from API helper
        const response = await fetchShops()
        const inferred = getFormFields(response)
        setFields(inferred)

        // Initialize values
        const base = {}
        inferred.forEach((f) => {
          base[f] = isEditing ? (editingShop?.[f] ?? '') : ''
        })

        // Some sensible defaults for new record
        if (!isEditing) {
          if (inferred.includes('Status') && !base.Status) base.Status = 'Active'
        }

        setFormData(base)
      } catch (err) {
        toast.error('Failed to initialize form: ' + (err?.message || 'Unknown error'))
      } finally {
        setInitializing(false)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    // minimal required checks based on fieldMeta
    for (const key of Object.keys(fieldMeta)) {
      const meta = fieldMeta[key]
      if (meta?.required && fields.includes(key)) {
        const v = String(formData[key] ?? '').trim()
        if (!v) {
          toast.error(`${meta.label || key} is required`)
          return false
        }
      }
      // Pattern check (e.g., pincode)
      if (fields.includes(key) && fieldMeta[key]?.pattern) {
        const re = new RegExp(fieldMeta[key].pattern)
        const v = String(formData[key] ?? '')
        if (v && !re.test(v)) {
          toast.error(`${fieldMeta[key].label || key} format is invalid`)
          return false
        }
      }
    }
    return true
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = { ...formData }
    if (isEditing) payload.Shop_ID = editingShop.Shop_ID

    setLoading(true)

    const promise = isEditing ? updateShop(payload) : addShop(payload)

    await toast.promise(promise, {
      loading: isEditing ? 'Updating shop…' : 'Creating shop…',
      success: (res) => {
        onSuccess?.()
        return res?.Message || (isEditing ? 'Shop updated' : 'Shop created')
      },
      error: (err) => err?.response?.data?.Message || err?.message || 'Operation failed',
    })
    setLoading(false)
  }

  const container = 'rounded-xl border border-[#e8dabe] bg-white shadow-sm'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'
  const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2d1810] focus:outline-none focus:ring-1 focus:ring-[#2d1810]'
  const selectCls = inputCls

  return (
    <div className="min-h-[70vh]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg border border-[#e8dabe] bg-[#f7f2e5] px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-[#efe7d3]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </motion.button>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Shop' : 'Add New Shop'}
          </h2>
        </div>
        <p className="mt-2 text-gray-600">Fill in the shop details below. Fields adapt to your API schema.</p>
      </div>

      {/* Card */}
      <div className={container}>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#e8dabe] bg-[#f7f2e5] px-4 py-3 rounded-t-xl">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Shop Details</h3>
            <p className="text-xs text-gray-600">Theme: light (#f7f2e5) · secondary (#e8dabe)</p>
          </div>
          <AnimatePresence>{loading ? (
            <motion.div
              key="saving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-600"
            >Saving…</motion.div>
          ) : null}</AnimatePresence>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-4 sm:p-6">
          {initializing ? (
            <div className="py-16 text-center text-gray-700">Loading form…</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((name) => {
                  const meta = fieldMeta[name] || { label: name.replaceAll('_', ' ') }
                  const value = formData[name] ?? ''

                  // Render select for Status
                  if (meta.type === 'select') {
                    return (
                      <div key={name}>
                        <label className={labelCls}>
                          {meta.label}
                          {meta.required && <span className="text-red-600"> *</span>}
                        </label>
                        <select
                          className={selectCls}
                          value={value}
                          onChange={(e) => handleChange(name, e.target.value)}
                        >
                          {meta.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )
                  }

                  // Default input
                  return (
                    <div key={name}>
                      <label className={labelCls}>
                        {meta.label}
                        {meta.required && <span className="text-red-600"> *</span>}
                      </label>
                      <input
                        type={meta.type || 'text'}
                        inputMode={meta.inputMode}
                        pattern={meta.pattern}
                        placeholder={meta.placeholder}
                        className={inputCls}
                        value={value}
                        onChange={(e) => handleChange(name, e.target.value)}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 disabled:opacity-60"
                >
                  <X className="h-4 w-4 mr-2" /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg bg-[#2d1810] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3d2420] disabled:opacity-60"
                >
                  <Save className="h-4 w-4 mr-2" /> {isEditing ? 'Update Shop' : 'Create Shop'}
                </motion.button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
