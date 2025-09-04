// FinalMasonaryGrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import MasonryGrid from './MasonryGrid';
import {
  fetchClothByCategory,
  fetchClothByCategoryTypes,
  fetchAllFinalClothes
} from '../../api/Device/fetchDeviceClothes';

/**
 * FinalMasonaryGrid
 *
 * Props:
 * - gender
 * - initialCategoryId (optional)  // will NOT trigger immediate selection
 * - initialTypeId (optional)      // will NOT trigger immediate selection
 * - selectedSize (optional)
 * - onTypeSelected({ typeId, clothes, category, type })  // called only when user clicks a type
 * - onBack() // when user navigates back from the root
 * - className
 */
const FinalMasonaryGrid = ({
  gender,
  initialCategoryId = null,
  initialTypeId = null,
  selectedSize = null,
  onTypeSelected,
  onBack,
  className = ''
}) => {
  const [currentLevel, setCurrentLevel] = useState('categories'); // 'categories' | 'types' | 'completed'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [genderCategories, setGenderCategories] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [finalClothes, setFinalClothes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [breadcrumb, setBreadcrumb] = useState([]);

  // guard: don't call onTypeSelected unless user clicked the item
  const userInitiatedRef = useRef(false);

  useEffect(() => {
    // Always start by showing categories first (user wants to see categories)
    loadGenderCategories();
    // If parent passed initial props, keep them but don't auto-select/close.
    if (initialCategoryId) {
      setSelectedCategory(prev => prev || { id: initialCategoryId, name: prev?.name || null });
    }
    if (initialTypeId) {
      setSelectedType(prev => prev || { id: initialTypeId, name: prev?.name || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender]);

  // Load gender categories
  const loadGenderCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchClothByCategory(gender);
      if (res?.Status && Array.isArray(res.Data)) {
        setGenderCategories(res.Data);
        setBreadcrumb([{ label: `${gender || 'All'} Categories`, level: 'categories' }]);
      } else {
        throw new Error('Invalid categories response');
      }
    } catch (err) {
      console.error('loadGenderCategories error:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Load types for a category
  const loadCategoryTypes = async (categoryId, categoryName = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchClothByCategoryTypes(categoryId);
      if (res?.Status && Array.isArray(res.Data)) {
        setCategoryTypes(res.Data);
        setBreadcrumb([
          { label: `${gender || 'All'} Categories`, level: 'categories' },
          { label: categoryName || (res.Data[0]?.Category_Title || 'Category'), level: 'types' }
        ]);
        setCurrentLevel('types');
      } else {
        throw new Error('Invalid types response');
      }
    } catch (err) {
      console.error('loadCategoryTypes error:', err);
      setError('Failed to load types for this category');
    } finally {
      setIsLoading(false);
    }
  };

  // Load final clothes for a type (but do NOT call onTypeSelected unless userInitiatedRef.current === true)
  const loadFinalClothes = async (typeId, clothSize = null, userInitiated = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAllFinalClothes(typeId, clothSize);
      if (res?.Status && Array.isArray(res.Data)) {
        setFinalClothes(res.Data);
        setBreadcrumb(prev => {
          const base = prev.length ? prev : [{ label: `${gender || 'All'} Categories`, level: 'categories' }];
          return [
            base[0],
            base[1] || { label: selectedCategory?.name || 'Category', level: 'types' },
            { label: selectedType?.name || (res.Data[0]?.Type_Title || 'Selected Type'), level: 'completed' }
          ];
        });
        setCurrentLevel('completed');

        // Only call onTypeSelected for user-initiated events (i.e., the user clicked a type)
        if (userInitiated && typeof onTypeSelected === 'function') {
          onTypeSelected({
            typeId,
            clothes: res.Data,
            category: selectedCategory,
            type: selectedType
          });
        }
      } else {
        throw new Error('Invalid final clothes response');
      }
    } catch (err) {
      console.error('loadFinalClothes error:', err);
      setError('Failed to load clothes for this type');
    } finally {
      setIsLoading(false);
    }
  };

  // user clicks a category card
  const handleCategorySelect = (category) => {
    setSelectedCategory({
      id: category.Category_ID || category.id,
      name: category.Category_Title || category.name
    });
    // load its types (stay inside modal)
    loadCategoryTypes(category.Category_ID || category.id, category.Category_Title || category.name);
  };

  // user clicks a type card (this should close modal in parent)
  const handleTypeSelect = (type) => {
    const typeObj = {
      id: type.Type_ID || type.id,
      name: type.Type_Title || type.name
    };
    setSelectedType(typeObj);

    // mark that next fetch is user-initiated so callback fires
    userInitiatedRef.current = true;
    loadFinalClothes(typeObj.id, selectedSize, /* userInitiated = */ true);
    // Note: parent is expected to close modal in onTypeSelected handler.
  };

  // If user clicks back button
  const handleNavigateBack = () => {
    if (currentLevel === 'types') {
      setCurrentLevel('categories');
      setSelectedCategory(null);
      setCategoryTypes([]);
      setBreadcrumb([{ label: `${gender || 'All'} Categories`, level: 'categories' }]);
    } else if (currentLevel === 'completed') {
      // go back to types view
      setCurrentLevel('types');
      setSelectedType(null);
      setFinalClothes([]);
      setBreadcrumb([
        { label: `${gender || 'All'} Categories`, level: 'categories' },
        { label: selectedCategory?.name || 'Category', level: 'types' }
      ]);
    } else {
      // top level back means parent-level back
      if (onBack) onBack();
    }
  };

  // clicking a breadcrumb
  const handleBreadcrumbClick = (level) => {
    if (level === 'categories') {
      setCurrentLevel('categories');
      setSelectedCategory(null);
      setSelectedType(null);
      setCategoryTypes([]);
      setFinalClothes([]);
      loadGenderCategories();
    } else if (level === 'types') {
      setCurrentLevel('types');
      setSelectedType(null);
      setFinalClothes([]);
      if (selectedCategory?.id) loadCategoryTypes(selectedCategory.id);
    }
  };

  // helpers to map current item list for MasonryGrid
  const getCurrentItemList = () => {
    if (currentLevel === 'categories') {
      return (genderCategories || []).map(item => ({
        id: item.Category_ID || item.id,
        name: item.Category_Title || item.name,
        image: item.Image_URL || item.image,
        raw: item
      }));
    }
    if (currentLevel === 'types') {
      return (categoryTypes || []).map(item => ({
        id: item.Type_ID || item.id,
        name: item.Type_Title || item.name,
        image: item.Image_URL || item.image,
        raw: item
      }));
    }
    // completed
    return (finalClothes || []).map(item => ({
      id: item.Cloth_ID || item.id,
      name: item.Cloth_Title || item.name,
      image: item.Image_URL || item.image,
      raw: item
    }));
  };

  const getTitle = () => {
    if (currentLevel === 'categories') return `${gender || 'All'} Categories`;
    if (currentLevel === 'types') return selectedCategory?.name ? `${selectedCategory.name} - Types` : 'Types';
    return selectedType?.name ? `${selectedType.name}` : 'Results';
  };

  return (
    <div className={`${className} flex flex-col h-full`}>
      <div className="sticky top-0 bg-white/95 p-4 z-10 border-b">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleNavigateBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white rounded-full shadow"
            aria-label="Back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </motion.button>
          <div>
            <h3 className="text-lg font-semibold">{getTitle()}</h3>
            {breadcrumb && breadcrumb.length > 0 && (
              <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                {breadcrumb.map((b, i) => (
                  <React.Fragment key={i}>
                    {i !== 0 && <ChevronRightIcon className="w-4 h-4 text-gray-300" />}
                    <button
                      className={`text-xs ${i === breadcrumb.length - 1 ? 'font-medium' : 'underline'}`}
                      onClick={() => handleBreadcrumbClick(b.level)}
                    >
                      {b.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin h-10 w-10 border-b-2 rounded-full mb-3" />
                <div className="text-sm">Loading...</div>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center py-12">
                <div className="text-red-600 mb-3">{error}</div>
                <button
                  onClick={() => {
                    if (currentLevel === 'categories') loadGenderCategories();
                    else if (currentLevel === 'types' && selectedCategory?.id) loadCategoryTypes(selectedCategory.id);
                    else if (currentLevel === 'completed' && selectedType?.id) loadFinalClothes(selectedType.id, selectedSize, false);
                  }}
                  className="px-4 py-2 rounded-full bg-gray-800 text-white"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={currentLevel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              {getCurrentItemList().length > 0 ? (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    {currentLevel === 'categories' && 'Choose a category'}
                    {currentLevel === 'types' && 'Choose a type'}
                    {currentLevel === 'completed' && 'Choose a cloth to preview'}
                  </p>

                  <MasonryGrid
                    items={getCurrentItemList()}
                    onItemClick={(item) => {
                      if (currentLevel === 'categories') {
                        handleCategorySelect(item.raw);
                      } else if (currentLevel === 'types') {
                        handleTypeSelect(item.raw);
                      } else {
                        // completed -> optionally do something; do not auto-close
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-16 text-gray-600">No results found</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinalMasonaryGrid;
