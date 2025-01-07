export interface Ingredient {
    id: number;
    name: string;
    type: string;
    description: string;
    properties: string;
    notes?: string;
    price_per_ml?: number;
    stock_amount?: number;
    measurement_type: 'ml' | 'drops';
    drops_per_ml?: number;
}

export interface IngredientFormData {
    name: string;
    type: string;
    description: string;
    properties: string;
    notes?: string;
    price_per_ml?: number;
    stock_amount?: number;
    measurement_type: 'ml' | 'drops';
}

export interface PackagingItem {
    id: number;
    name: string;
    type: string;
    description: string;
    price: number;
    stock_amount: number;
    capacity?: number;
    color?: string;
    material: string;
    notes?: string;
}

export interface PackageBundle {
    id: number;
    name: string;
    description: string;
    capacity: number;
    notes?: string;
    total_price: number;
    items: PackagingItem[];
}

export interface PackageBundleCreate {
    name: string;
    description: string;
    capacity: number;
    notes?: string;
    item_ids: number[];
}

export interface RecipeIngredient {
    ingredient: Ingredient;
    amount_ml: number;
}

export interface Recipe {
    id: number;
    name: string;
    description: string;
    total_volume_ml: number;
    retail_price?: number;
    notes?: string;
    total_cost: number;
    package_bundle: PackageBundle;
    recipe_ingredients: RecipeIngredient[];
}

export interface RecipeFormData {
    name: string;
    description: string;
    total_volume_ml: number;
    retail_price: number;
    notes: string;
    ingredients: {
        ingredient_id: number;
        amount_ml: number;
    }[];
    package_bundle_id: number;
} 