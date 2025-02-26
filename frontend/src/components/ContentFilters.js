import React, { useState } from 'react';

const ContentFilters = ({ onFilterChange, categories = [] }) => {
  const [mediaType, setMediaType] = useState('');
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (newFilters) => {
    onFilterChange({
      mediaType,
      category,
      searchTerm,
      ...newFilters
    });
  };

  const handleMediaTypeChange = (e) => {
    const newMediaType = e.target.value;
    setMediaType(newMediaType);
    handleFilterChange({ mediaType: newMediaType });
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    handleFilterChange({ category: newCategory });
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange({ searchTerm });
  };

  const clearFilters = () => {
    setMediaType('');
    setCategory('');
    setSearchTerm('');
    onFilterChange({
      mediaType: '',
      category: '',
      searchTerm: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtros</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de medio
          </label>
          <select
            id="mediaType"
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={mediaType}
            onChange={handleMediaTypeChange}
          >
            <option value="">Todos</option>
            <option value="IMAGE">Imagen</option>
            <option value="VIDEO">Video</option>
            <option value="CAROUSEL_ALBUM">Álbum</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="category"
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">Todas</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="flex">
              <input
                type="text"
                id="search"
                className="flex-grow rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Palabras clave..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default ContentFilters;
