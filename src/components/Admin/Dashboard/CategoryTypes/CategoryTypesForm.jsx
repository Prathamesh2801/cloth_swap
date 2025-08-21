import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Upload, Image as ImageIcon, Eye, Edit3, Package, ChevronDown, Search } from 'lucide-react';
import { BASE_URL } from '../../../../../config';
import { getCategoriesTypes } from '../../../../api/Client/CategoryTypesAPI';

const CategoryTypesForm = ({
  editingType,
  viewingType,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    Type_Title: '',
    Type_Description: '',
    image: null,
    Category_ID: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Category dropdown state
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const categoryDropdownRef = useRef(null);

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Handle clicks outside category dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getCategoriesTypes('', null, null, null);
      if (response.Status && response.Data) {
        // Extract unique categories from the response
        const uniqueCategories = response.Data.reduce((acc, item) => {
          const existingCategory = acc.find(cat => cat.Category_ID === item.Category_ID);
          if (!existingCategory) {
            acc.push({
              Category_ID: item.Category_ID,
              Category_Title: item.Category_Title,
              Shop_Name: item.Shop_Name
            });
          }
          return acc;
        }, []);
        setCategories(uniqueCategories);
        setFilteredCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Simple fuzzy search implementation
  const fuzzySearch = (items, searchTerm) => {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      const title = item.Category_Title.toLowerCase();
      const id = item.Category_ID.toLowerCase();
      
      // Exact match gets highest priority
      if (title.includes(term) || id.includes(term)) {
        return true;
      }
      
      // Character-by-character fuzzy match
      let termIndex = 0;
      for (let i = 0; i < title.length && termIndex < term.length; i++) {
        if (title[i] === term[termIndex]) {
          termIndex++;
        }
      }
      return termIndex === term.length;
    }).sort((a, b) => {
      // Sort by relevance
      const aTitle = a.Category_Title.toLowerCase();
      const bTitle = b.Category_Title.toLowerCase();
      const aExact = aTitle.includes(term);
      const bExact = bTitle.includes(term);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return aTitle.localeCompare(bTitle);
    });
  };

  // Handle category search
  const handleCategorySearch = (searchTerm) => {
    setCategorySearchTerm(searchTerm);
    const filtered = fuzzySearch(categories, searchTerm);
    setFilteredCategories(filtered);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      Category_ID: category.Category_ID
    }));
    setCategorySearchTerm(category.Category_Title);
    setShowCategoryDropdown(false);
    
    // Clear category error
    if (errors.Category_ID) {
      setErrors(prev => ({ ...prev, Category_ID: '' }));
    }
  };

  // Pre-fill form when editing or viewing
  useEffect(() => {
    const typeData = editingType || viewingType;

    if ((isEditMode || isViewMode) && typeData) {
      setFormData({
        Type_Title: typeData.Type_Title || '',
        Type_Description: typeData.Type_Description || '',
        image: null,
        Category_ID: typeData.Category_ID || ''
      });

      // Set selected category if available
      if (typeData.Category_ID) {
        const category = categories.find(cat => cat.Category_ID === typeData.Category_ID);
        if (category) {
          setSelectedCategory(category);
          setCategorySearchTerm(category.Category_Title);
        } else {
          // If category not found in the list, create a temporary one
          const tempCategory = {
            Category_ID: typeData.Category_ID,
            Category_Title: typeData.Category_Title || typeData.Category_ID
          };
          setSelectedCategory(tempCategory);
          setCategorySearchTerm(tempCategory.Category_Title);
        }
      }

      // Set image preview if exists
      if (typeData.Image_URL) {
        setImagePreview(BASE_URL + '/' + typeData.Image_URL);
      }
    } else if (isCreateMode) {
      setFormData({
        Type_Title: '',
        Type_Description: '',
        image: null,
        Category_ID: ''
      });
      setSelectedCategory(null);
      setCategorySearchTerm('');
      setImagePreview(null);
    }
    setErrors({});
  }, [editingType, viewingType, mode, categories]);

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

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear image error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Type_Title.trim()) {
      newErrors.Type_Title = 'Type title is required';
    } else if (formData.Type_Title.length < 2) {
      newErrors.Type_Title = 'Type title must be at least 2 characters';
    }

    if (!formData.Category_ID) {
      newErrors.Category_ID = 'Category is required';
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
      if (isEditMode) {
        const editData = {
          Type_ID: editingType.Type_ID,
          Type_Title: formData.Type_Title,
          Type_Description: formData.Type_Description,
          Category_ID: formData.Category_ID
        };

        // If there's a new image, include it
        if (formData.image) {
          editData.image = formData.image;
        }

        await onSubmit(editData);
      } else if (isCreateMode) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormIcon = () => {
    switch (mode) {
      case 'view':
        return <Eye className="h-6 w-6 text-[#8B7355]" />;
      case 'edit':
        return <Edit3 className="h-6 w-6 text-[#8B7355]" />;
      default:
        return <Package className="h-6 w-6 text-[#8B7355]" />;
    }
  };

  const getFormTitle = () => {
    switch (mode) {
      case 'view':
        return 'Category Type Details';
      case 'edit':
        return 'Edit Category Type';
      default:
        return 'Create New Category Type';
    }
  };

  const getFormSubtitle = () => {
    switch (mode) {
      case 'view':
        return 'View category type information and image';
      case 'edit':
        return 'Update category type information and image';
      default:
        return 'Add a new category type with image';
    }
  };

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
              {getFormIcon()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {getFormTitle()}
              </h2>
              <p className="text-sm text-gray-600">
                {getFormSubtitle()}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Search className="h-4 w-4" />
              <span>Category *</span>
            </label>
            <div className="relative" ref={categoryDropdownRef}>
              <div
                className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                  errors.Category_ID ? 'border-red-500' : 'border-gray-300'
                } ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-[#8B7355] focus-within:ring-2 focus-within:ring-[#8B7355] focus-within:border-transparent'}`}
                onClick={() => !isViewMode && setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={categorySearchTerm}
                    onChange={(e) => handleCategorySearch(e.target.value)}
                    onFocus={() => !isViewMode && setShowCategoryDropdown(true)}
                    placeholder="Search and select category..."
                    className="flex-1 outline-none bg-transparent"
                    disabled={isViewMode}
                  />
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Dropdown */}
              {showCategoryDropdown && !isViewMode && (
                <motion.div
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {loadingCategories ? (
                    <div className="p-3 text-center text-gray-500">Loading categories...</div>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div
                        key={category.Category_ID}
                        className="p-3 hover:bg-[#f7f2e5] cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div className="font-medium text-gray-800">{category.Category_Title}</div>
                        <div className="text-sm text-gray-500">ID: {category.Category_ID}</div>
                        {category.Shop_Name && (
                          <div className="text-xs text-gray-400">Shop: {category.Shop_Name}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">No categories found</div>
                  )}
                </motion.div>
              )}
            </div>
            {errors.Category_ID && (
              <motion.p
                className="text-red-500 text-sm flex items-center space-x-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{errors.Category_ID}</span>
              </motion.p>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-4 w-full">
            {/* Label */}
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <ImageIcon className="h-4 w-4" />
              <span>Type Image </span>
            </label>

            {/* Image Preview + Upload */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {imagePreview && (
                <motion.div
                  className="relative inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img
                    src={imagePreview}
                    alt="Type preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                  />
                  {!isViewMode && (
                    <motion.button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕
                    </motion.button>
                  )}
                </motion.div>
              )}

              {!isViewMode && (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 w-full max-w-xs text-center transition-colors
          ${dragActive
                      ? 'border-[#8B7355] bg-[#f7f2e5]'
                      : errors.image
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-[#8B7355] hover:bg-[#f7f2e5]'
                    }`}
                  onDrop={handleDrop}
                  onDragOver={handleDrag}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#8B7355] hover:text-[#7A6249] font-medium"
                      >
                        Click to upload
                      </button>
                      <span> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {errors.image && (
              <motion.p
                className="text-red-500 text-sm flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{errors.image}</span>
              </motion.p>
            )}
          </div>

          {/* Type Title Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Package className="h-4 w-4" />
              <span>Type Title *</span>
            </label>
            <input
              type="text"
              name="Type_Title"
              value={formData.Type_Title}
              onChange={handleInputChange}
              disabled={isViewMode}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-colors ${
                errors.Type_Title ? 'border-red-500' : 'border-gray-300'
              } ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="Enter type title"
            />
            {errors.Type_Title && (
              <motion.p
                className="text-red-500 text-sm flex items-center space-x-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{errors.Type_Title}</span>
              </motion.p>
            )}
          </div>

          {/* Type Description Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Edit3 className="h-4 w-4" />
              <span>Type Description</span>
            </label>
            <textarea
              name="Type_Description"
              value={formData.Type_Description}
              onChange={handleInputChange}
              disabled={isViewMode}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-colors resize-none ${
                errors.Type_Description ? 'border-red-500' : 'border-gray-300'
              } ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              placeholder="Enter type description (optional)"
            />
            {errors.Type_Description && (
              <motion.p
                className="text-red-500 text-sm flex items-center space-x-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{errors.Type_Description}</span>
              </motion.p>
            )}
          </div>

          {/* Type ID Field (View/Edit Mode Only) */}
          {(isViewMode || isEditMode) && (editingType || viewingType) && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span>Type ID</span>
              </label>
              <input
                type="text"
                value={(editingType || viewingType)?.Type_ID || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
              />
            </div>
          )}

          {/* Form Actions */}
          {!isViewMode && (
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
                    ? (isEditMode ? 'Updating...' : 'Creating...')
                    : (isEditMode ? 'Update Type' : 'Create Type')
                  }
                </span>
              </motion.button>
            </div>
          )}

          {/* View Mode Actions */}
          {isViewMode && (
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="h-4 w-4" />
                <span>Close</span>
              </motion.button>
            </div>
          )}
        </form>
      </div>

      {/* Help Text */}
      {!isViewMode && (
        <motion.div
          className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-sm font-medium text-blue-800 mb-2">Guidelines:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Select a category from the dropdown using fuzzy search</li>
            <li>• Type in the category search box to filter results</li>
            <li>• Use high-quality images with good lighting</li>
            <li>• Recommended size: 500x500px or larger</li>
            <li>• Supported formats: JPG, PNG, GIF</li>
            <li>• Maximum file size: 10MB</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryTypesForm;