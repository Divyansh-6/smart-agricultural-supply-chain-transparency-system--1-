import React from 'react';

interface NutritionalInfoProps {
  productType: string;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ productType }) => {
  // Mock nutritional data based on product type
  const getNutritionalData = (type: string) => {
    const data: Record<string, any> = {
      'Strawberries': {
        calories: 32,
        protein: 0.7,
        carbs: 7.7,
        fiber: 2.0,
        sugar: 4.9,
        fat: 0.3,
        vitaminC: 59,
        potassium: 153
      },
      'Apples': {
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fiber: 2.4,
        sugar: 10.3,
        fat: 0.2,
        vitaminC: 4.6,
        potassium: 107
      },
      'Tomatoes': {
        calories: 18,
        protein: 0.9,
        carbs: 3.9,
        fiber: 1.2,
        sugar: 2.6,
        fat: 0.2,
        vitaminC: 13.7,
        potassium: 237
      }
    };
    
    return data[type] || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      fat: 0,
      vitaminC: 0,
      potassium: 0
    };
  };

  const nutritionalData = getNutritionalData(productType);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Nutritional Information</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Per 100g serving of {productType}
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
          <p className="font-medium text-gray-800 dark:text-white">{nutritionalData.calories} kcal</p>
        </div>
        
        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
          <p className="font-medium text-gray-800 dark:text-white">{nutritionalData.protein}g</p>
        </div>
        
        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Carbohydrates</p>
          <p className="font-medium text-gray-800 dark:text-white">{nutritionalData.carbs}g</p>
        </div>
        
        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Fiber</p>
          <p className="font-medium text-gray-800 dark:text-white">{nutritionalData.fiber}g</p>
        </div>
        
        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Sugar</p>
          <p className="font-medium text-gray-800 dark:text-white">{nutritionalData.sugar}g</p>
        </div>
        
        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Fat</p>
          <p className="font-medium text-gray-800 dark:text-white">{nutritionalData.fat}g</p>
        </div>
        
        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Vitamin C</p>
          <p className="font-medium text-gray-800 dark:text-white">{nutritionalData.vitaminC}% DV</p>
        </div>
        
        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Potassium</p>
          <p className="font-medium text-gray-800 dark:text-white">{nutritionalData.potassium}mg</p>
        </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          * Percent Daily Values (DV) are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
        </p>
      </div>
    </div>
  );
};

export default NutritionalInfo;