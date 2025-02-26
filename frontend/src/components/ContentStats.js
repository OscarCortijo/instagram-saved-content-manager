import React from 'react';

const ContentStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-gray-500">Total guardados</p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.totalSaved}</h2>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-500">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-gray-500">Procesados</p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.processed}</h2>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${Math.round((stats.processed / stats.totalSaved) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((stats.processed / stats.totalSaved) * 100)}% del total
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-500">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-gray-500">Categorizados</p>
            <h2 className="text-3xl font-bold text-gray-800">{stats.categorized}</h2>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${Math.round((stats.categorized / stats.processed) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((stats.categorized / stats.processed) * 100)}% de los procesados
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentStats;
