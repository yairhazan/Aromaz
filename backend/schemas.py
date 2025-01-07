from pydantic import BaseModel
from typing import Optional, List, Dict
from enum import Enum

class MeasurementType(str, Enum):
    ML = "ml"
    DROPS = "drops"

class IngredientBase(BaseModel):
    name: str
    type: str
    description: str
    properties: str
    notes: Optional[str] = None
    price_per_ml: float
    stock_amount: float
    measurement_type: MeasurementType = MeasurementType.ML
    drops_per_ml: Optional[float] = None  # conversion rate for drops

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int

    class Config:
        from_attributes = True

class PackagingItemBase(BaseModel):
    name: str
    type: str
    description: str
    price: float
    stock_amount: int
    capacity: Optional[float] = None
    color: Optional[str] = None
    material: str
    notes: Optional[str] = None

class PackagingItemCreate(PackagingItemBase):
    pass

class PackagingItem(PackagingItemBase):
    id: int

    class Config:
        from_attributes = True

class PackageBundleBase(BaseModel):
    name: str
    description: str
    capacity: float
    notes: Optional[str] = None

class PackageBundleCreate(PackageBundleBase):
    item_ids: List[int]  # IDs of packaging items to include in the bundle

class PackageBundle(PackageBundleBase):
    id: int
    total_price: float
    items: List[PackagingItem]

    class Config:
        from_attributes = True

class RecipeIngredientBase(BaseModel):
    ingredient_id: int
    amount_ml: float

class RecipeIngredientCreate(RecipeIngredientBase):
    pass

class RecipeIngredientDetail(BaseModel):
    ingredient: Ingredient
    amount_ml: float

    class Config:
        from_attributes = True

class RecipeBase(BaseModel):
    name: str
    description: str
    total_volume_ml: float
    retail_price: Optional[float] = None
    notes: Optional[str] = None

class RecipeCreate(RecipeBase):
    ingredients: List[RecipeIngredientBase]  # List of ingredients with their amounts
    package_bundle_id: int  # ID of the package bundle to use

class Recipe(RecipeBase):
    id: int
    recipe_ingredients: List[RecipeIngredientDetail]  # Ingredients with their details and amounts
    package_bundle: PackageBundle
    total_cost: float

    class Config:
        from_attributes = True 