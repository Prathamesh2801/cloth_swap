import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Eye, EyeOff, User, Shield, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import Select from 'react-select'
import { fetchShops } from '../../../../api/SuperAdmin/ShopAPI';

const UserForm = ({ editingUser, onSubmit, onCancel, isEdit = false }) => {
    const [formData, setFormData] = useState({
        Username: '',
        Password: '',
        Role: '',
        Shop_ID: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [shopOptions, setShopOptions] = useState([]);
    const [loadingShops, setLoadingShops] = useState(false);

    // ⬅ Fetch shops on mount
    useEffect(() => {
        const fetchAllShops = async () => {
            setLoadingShops(true);
            try {
                const res = await fetchShops();
                if (res.Status && res.Data?.shops) {
                    const options = res.Data.shops.map((shop) => ({
                        value: shop.Shop_ID,
                        label: `${shop.Shop_Name} (${shop.Shop_ID})`,
                    }));
                    setShopOptions(options);
                }
            } catch (err) {
                console.error("Error loading shops:", err);
            } finally {
                setLoadingShops(false);
            }
        };
        fetchAllShops();
    }, []);

    // Pre-fill form when editing
    useEffect(() => {
        if (isEdit && editingUser) {
            setFormData({
                Username: editingUser.Username || '',
                Password: '', // Don't pre-fill password for security
                Role: editingUser.Role || '',
                Shop_ID: editingUser.Shop_ID || ''
            });
        } else {
            setFormData({
                Username: '',
                Password: '',
                Role: '',
                Shop_ID: ''
            });
        }
        setErrors({});
    }, [editingUser, isEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    const handleShopChange = (selected) => {
        setFormData((prev) => ({ ...prev, Shop_ID: selected ? selected.value : "" }));
        if (errors.Shop_ID) setErrors((prev) => ({ ...prev, Shop_ID: "" }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.Username.trim()) {
            newErrors.Username = 'Username is required';
        } else if (formData.Username.length < 3) {
            newErrors.Username = 'Username must be at least 3 characters';
        }

        if (!isEdit && !formData.Password) {
            newErrors.Password = 'Password is required';
        }

        if (!formData.Role) {
            newErrors.Role = 'Role is required';
        }

        if ((formData.Role === 'Admin' || formData.Role === 'Device') && !formData.Shop_ID.trim()) {
            newErrors.Shop_ID = 'Shop ID is required for Admin and Device roles';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data - don't include empty Shop_ID for Super_Admin
            const submitData = { ...formData };
            if (formData.Role === 'Super_Admin') {
                delete submitData.Shop_ID;
            }

            // For edit, only include fields that have values
            if (isEdit) {
                const editData = { Username: formData.Username };
                if (formData.Password) editData.Password = formData.Password;
                if (formData.Role) editData.Role = formData.Role;
                if (formData.Shop_ID && formData.Role !== 'Super_Admin') editData.Shop_ID = formData.Shop_ID;

                await onSubmit(editData);
            } else {
                await onSubmit(submitData);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(error.response.data.Message || "Failed To Create Credentials")
        } finally {
            setIsSubmitting(false);
        }
    };

    const shouldShowShopID = formData.Role === 'Admin' || formData.Role === 'Device';

    return (
        <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white rounded-lg shadow-sm border border-[#e8dabe] overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-[#f7f2e5] to-[#e8dabe] px-6 py-4 border-b border-[#e8dabe]">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                            <User className="h-6 w-6 text-[#8B7355]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {isEdit ? 'Edit User' : 'Create New User'}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {isEdit
                                    ? 'Update user information and permissions'
                                    : 'Add a new user to the system'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <User className="h-4 w-4" />
                            <span>Username</span>
                        </label>
                        <input
                            type="text"
                            name="Username"
                            value={formData.Username}
                            onChange={handleInputChange}
                            disabled={isEdit} // Username shouldn't be editable
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-colors ${errors.Username ? 'border-red-500' : 'border-gray-300'
                                } ${isEdit ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            placeholder="Enter username"
                        />
                        {errors.Username && (
                            <motion.p
                                className="text-red-500 text-sm flex items-center space-x-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span>{errors.Username}</span>
                            </motion.p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Shield className="h-4 w-4" />
                            <span>{isEdit ? 'New Password (optional)' : 'Password'}</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="Password"
                                value={formData.Password}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-colors ${errors.Password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.Password && (
                            <motion.p
                                className="text-red-500 text-sm flex items-center space-x-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span>{errors.Password}</span>
                            </motion.p>
                        )}
                    </div>

                    {/* Role Field */}
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Shield className="h-4 w-4" />
                            <span>Role</span>
                        </label>
                        <select
                            name="Role"
                            value={formData.Role}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-colors ${errors.Role ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select a role</option>
                            <option value="Super_Admin">Super Admin</option>
                            <option value="Admin">Admin</option>
                            <option value="Device">Device</option>
                        </select>
                        {errors.Role && (
                            <motion.p
                                className="text-red-500 text-sm flex items-center space-x-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span>{errors.Role}</span>
                            </motion.p>
                        )}
                    </div>

                    {/* Shop ID Field - Conditional */}
                    {shouldShowShopID && <motion.div
                        className="space-y-2"
                        initial={{ opacity: shouldShowShopID ? 1 : 0.5 }}
                        animate={{ opacity: shouldShowShopID ? 1 : 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Building className="h-4 w-4" />
                            <span>Shop ID {shouldShowShopID && '*'}</span>
                        </label>
                        <Select
                            isClearable
                            isSearchable
                            isLoading={loadingShops}
                            options={shopOptions}
                            value={shopOptions.find((opt) => opt.value === formData.Shop_ID) || null}
                            onChange={handleShopChange}
                            placeholder="Search or select a shop..."
                            classNamePrefix="react-select"
                        />
                        {errors.Shop_ID && (
                            <motion.p
                                className="text-red-500 text-sm flex items-center space-x-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span>{errors.Shop_ID}</span>
                            </motion.p>
                        )}
                        {!shouldShowShopID && (
                            <p className="text-xs text-gray-500">
                                Shop ID is only required for Admin and Device roles
                            </p>
                        )}
                    </motion.div>}

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                        <motion.button
                            type="button"
                            onClick={onCancel}
                            className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                        </motion.button>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-6 py-3 bg-[#8B7355] text-white hover:bg-[#7A6249] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center space-x-2"
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        >
                            <Save className="h-4 w-4" />
                            <span>
                                {isSubmitting
                                    ? (isEdit ? 'Updating...' : 'Creating...')
                                    : (isEdit ? 'Update User' : 'Create User')
                                }
                            </span>
                        </motion.button>
                    </div>
                </form>
            </div>


        </motion.div>
    );
};

export default UserForm;