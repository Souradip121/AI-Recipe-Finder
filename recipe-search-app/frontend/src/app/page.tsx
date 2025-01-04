'use client';
import { useState } from 'react';
import Image from 'next/image';

interface Recipe {
  recipe: {
    label: string;
    image: string;
    url: string;
    ingredientLines: string[];
    calories: number;
    dietLabels: string[];
    healthLabels: string[];
  };
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/recipes?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setRecipes(data.hits || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Recipe Search</h1>
          <div className="w-full max-w-xl flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchRecipes()}
              placeholder="Search for recipes..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={searchRecipes}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={recipe.recipe.image}
                alt={recipe.recipe.label}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{recipe.recipe.label}</h2>
                <p className="text-gray-600 mb-2">
                  {Math.round(recipe.recipe.calories)} calories
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.recipe.dietLabels.map((label, i) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                      {label}
                    </span>
                  ))}
                </div>
                <a
                  href={recipe.recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  View Recipe →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
