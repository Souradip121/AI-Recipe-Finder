"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";

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
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRecipes = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/recipes?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setRecipes(data.hits || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">
            Discover Delicious Recipes
          </h1>
          <div className="w-full max-w-2xl flex gap-2 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchRecipes()}
              placeholder="Search for recipes..."
              className="flex-1 p-4 pl-12 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-black placeholder-gray-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              onClick={searchRecipes}
              disabled={loading}
              className="px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 text-lg font-semibold flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {recipes.map((recipe, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
            >
              <div className="relative h-64">
                <Image
                  src={recipe.recipe.image}
                  alt={recipe.recipe.label}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-200 hover:opacity-90"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                  {recipe.recipe.label}
                </h2>
                <p className="text-gray-600 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 4a1 1 0 011 1v4.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V5a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {Math.round(recipe.recipe.calories)} calories
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.recipe.dietLabels.map((label, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <a
                  href={recipe.recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 text-center font-semibold"
                >
                  View Recipe →
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
