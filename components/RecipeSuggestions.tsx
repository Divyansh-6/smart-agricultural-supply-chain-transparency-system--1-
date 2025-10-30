import React from 'react';
import { FiClock, FiUsers } from 'react-icons/fi';

interface RecipeSuggestionsProps {
  productType: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  servings: number;
  difficulty: string;
  imageUrl: string;
}

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ productType }) => {
  // Mock recipe data based on product type
  const getRecipes = (type: string): Recipe[] => {
    const recipesByType: Record<string, Recipe[]> = {
      'Strawberries': [
        {
          id: 'recipe-1',
          title: 'Strawberry Spinach Salad',
          description: 'Fresh strawberries and spinach tossed with a light vinaigrette dressing.',
          prepTime: '15 min',
          servings: 4,
          difficulty: 'Easy',
          imageUrl: 'https://via.placeholder.com/150'
        },
        {
          id: 'recipe-2',
          title: 'Strawberry Smoothie Bowl',
          description: 'Creamy strawberry smoothie topped with granola and fresh fruit.',
          prepTime: '10 min',
          servings: 2,
          difficulty: 'Easy',
          imageUrl: 'https://via.placeholder.com/150'
        },
        {
          id: 'recipe-3',
          title: 'Strawberry Shortcake',
          description: 'Classic dessert with layers of cake, fresh strawberries, and whipped cream.',
          prepTime: '30 min',
          servings: 6,
          difficulty: 'Medium',
          imageUrl: 'https://via.placeholder.com/150'
        }
      ],
      'Tomatoes': [
        {
          id: 'recipe-4',
          title: 'Fresh Tomato Pasta',
          description: 'Simple pasta dish with fresh tomatoes, garlic, and basil.',
          prepTime: '20 min',
          servings: 4,
          difficulty: 'Easy',
          imageUrl: 'https://via.placeholder.com/150'
        },
        {
          id: 'recipe-5',
          title: 'Tomato Bruschetta',
          description: 'Toasted bread topped with diced tomatoes, basil, and olive oil.',
          prepTime: '15 min',
          servings: 6,
          difficulty: 'Easy',
          imageUrl: 'https://via.placeholder.com/150'
        }
      ],
      'Apples': [
        {
          id: 'recipe-6',
          title: 'Apple Cinnamon Oatmeal',
          description: 'Warm oatmeal with diced apples and cinnamon.',
          prepTime: '10 min',
          servings: 2,
          difficulty: 'Easy',
          imageUrl: 'https://via.placeholder.com/150'
        },
        {
          id: 'recipe-7',
          title: 'Apple Crumble',
          description: 'Sweet and tart apples topped with a crispy oat topping.',
          prepTime: '45 min',
          servings: 8,
          difficulty: 'Medium',
          imageUrl: 'https://via.placeholder.com/150'
        }
      ]
    };
    
    return recipesByType[type] || [];
  };

  const recipes = getRecipes(productType);

  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recipe Suggestions</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Try these delicious recipes using {productType}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-40 bg-gray-200 dark:bg-gray-700">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800 dark:text-white mb-1">{recipe.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{recipe.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{recipe.prepTime}</span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" />
                  <span>Serves {recipe.servings}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  recipe.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSuggestions;