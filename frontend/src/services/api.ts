import axios from 'axios';
import { Ingredient, IngredientFormData, PackagingItem, PackageBundle, Recipe, RecipeFormData } from '../types/types';

const API_URL = '/api';

export const api = {
    // Ingredient endpoints
    getIngredients: () => axios.get<Ingredient[]>(`${API_URL}/ingredients/`).then(res => res.data),

    getIngredient: (id: number) => axios.get<Ingredient>(`${API_URL}/ingredients/${id}`).then(res => res.data),

    createIngredient: (data: IngredientFormData) => axios.post<Ingredient>(`${API_URL}/ingredients/`, data).then(res => res.data),

    updateIngredient: (id: number, data: IngredientFormData) => axios.put<Ingredient>(`${API_URL}/ingredients/${id}`, data).then(res => res.data),

    deleteIngredient: (id: number) => axios.delete(`${API_URL}/ingredients/${id}`).then(res => res.data),

    // Packaging Item endpoints
    getPackagingItems: () => axios.get<PackagingItem[]>(`${API_URL}/packaging-items/`).then(res => res.data),

    getPackagingItem: (id: number) => axios.get<PackagingItem>(`${API_URL}/packaging-items/${id}`).then(res => res.data),

    createPackagingItem: (data: Omit<PackagingItem, 'id'>) => axios.post<PackagingItem>(`${API_URL}/packaging-items/`, data).then(res => res.data),

    updatePackagingItem: (id: number, data: Omit<PackagingItem, 'id'>) => axios.put<PackagingItem>(`${API_URL}/packaging-items/${id}`, data).then(res => res.data),

    deletePackagingItem: (id: number) => axios.delete(`${API_URL}/packaging-items/${id}`).then(res => res.data),

    // Package Bundle endpoints
    getPackageBundles: () => axios.get<PackageBundle[]>(`${API_URL}/package-bundles/`).then(res => res.data),

    getPackageBundle: (id: number) => axios.get<PackageBundle>(`${API_URL}/package-bundles/${id}`).then(res => res.data),

    createPackageBundle: (data: { name: string; description: string; capacity: number; notes: string; item_ids: number[] }) => 
        axios.post<PackageBundle>(`${API_URL}/package-bundles/`, data).then(res => res.data),

    updatePackageBundle: (id: number, data: { name: string; description: string; capacity: number; notes: string; item_ids: number[] }) => 
        axios.put<PackageBundle>(`${API_URL}/package-bundles/${id}`, data).then(res => res.data),

    deletePackageBundle: (id: number) => axios.delete(`${API_URL}/package-bundles/${id}`).then(res => res.data),

    // Recipe endpoints
    getRecipes: () => axios.get<Recipe[]>(`${API_URL}/recipes/`).then(res => res.data),

    getRecipe: (id: number) => axios.get<Recipe>(`${API_URL}/recipes/${id}`).then(res => res.data),

    createRecipe: (data: RecipeFormData) => axios.post<Recipe>(`${API_URL}/recipes/`, data).then(res => res.data),

    updateRecipe: (id: number, data: RecipeFormData) => axios.put<Recipe>(`${API_URL}/recipes/${id}`, data).then(res => res.data),

    deleteRecipe: (id: number) => axios.delete(`${API_URL}/recipes/${id}`).then(res => res.data),
};