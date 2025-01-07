from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AromaDB API")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:4173",  # Vite preview
    "http://localhost:3000",  # Alternative dev port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Ingredient endpoints
@app.post("/ingredients/", response_model=schemas.Ingredient)
def create_ingredient(ingredient: schemas.IngredientCreate, db: Session = Depends(get_db)):
    db_ingredient = models.Ingredient(**ingredient.dict())
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

@app.get("/ingredients/", response_model=List[schemas.Ingredient])
def read_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ingredients = db.query(models.Ingredient).offset(skip).limit(limit).all()
    return ingredients

@app.get("/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def read_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    ingredient = db.query(models.Ingredient).filter(models.Ingredient.id == ingredient_id).first()
    if ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ingredient

@app.put("/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def update_ingredient(ingredient_id: int, ingredient: schemas.IngredientCreate, db: Session = Depends(get_db)):
    db_ingredient = db.query(models.Ingredient).filter(models.Ingredient.id == ingredient_id).first()
    if db_ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    
    for key, value in ingredient.dict().items():
        setattr(db_ingredient, key, value)
    
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

@app.delete("/ingredients/{ingredient_id}")
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    ingredient = db.query(models.Ingredient).filter(models.Ingredient.id == ingredient_id).first()
    if ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    
    db.delete(ingredient)
    db.commit()
    return {"message": "Ingredient deleted successfully"}

# Packaging Item endpoints
@app.post("/packaging-items/", response_model=schemas.PackagingItem)
def create_packaging_item(item: schemas.PackagingItemCreate, db: Session = Depends(get_db)):
    db_item = models.PackagingItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/packaging-items/", response_model=List[schemas.PackagingItem])
def read_packaging_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.PackagingItem).offset(skip).limit(limit).all()
    return items

@app.get("/packaging-items/{item_id}", response_model=schemas.PackagingItem)
def read_packaging_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.PackagingItem).filter(models.PackagingItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Packaging item not found")
    return item

@app.put("/packaging-items/{item_id}", response_model=schemas.PackagingItem)
def update_packaging_item(item_id: int, item: schemas.PackagingItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.PackagingItem).filter(models.PackagingItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Packaging item not found")
    
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/packaging-items/{item_id}")
def delete_packaging_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.PackagingItem).filter(models.PackagingItem.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Packaging item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Packaging item deleted successfully"}

# Package Bundle endpoints
@app.post("/package-bundles/", response_model=schemas.PackageBundle)
def create_package_bundle(bundle: schemas.PackageBundleCreate, db: Session = Depends(get_db)):
    # Get all items for the bundle
    items = db.query(models.PackagingItem).filter(models.PackagingItem.id.in_(bundle.item_ids)).all()
    if len(items) != len(bundle.item_ids):
        raise HTTPException(status_code=400, detail="Some packaging items not found")
    
    # Calculate total price
    total_price = sum(item.price for item in items)
    
    # Create bundle
    db_bundle = models.PackageBundle(
        name=bundle.name,
        description=bundle.description,
        capacity=bundle.capacity,
        notes=bundle.notes,
        total_price=total_price,
        items=items
    )
    
    db.add(db_bundle)
    db.commit()
    db.refresh(db_bundle)
    return db_bundle

@app.get("/package-bundles/", response_model=List[schemas.PackageBundle])
def read_package_bundles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    bundles = db.query(models.PackageBundle).offset(skip).limit(limit).all()
    return bundles

@app.get("/package-bundles/{bundle_id}", response_model=schemas.PackageBundle)
def read_package_bundle(bundle_id: int, db: Session = Depends(get_db)):
    bundle = db.query(models.PackageBundle).filter(models.PackageBundle.id == bundle_id).first()
    if bundle is None:
        raise HTTPException(status_code=404, detail="Package bundle not found")
    return bundle

@app.put("/package-bundles/{bundle_id}", response_model=schemas.PackageBundle)
def update_package_bundle(bundle_id: int, bundle: schemas.PackageBundleCreate, db: Session = Depends(get_db)):
    db_bundle = db.query(models.PackageBundle).filter(models.PackageBundle.id == bundle_id).first()
    if db_bundle is None:
        raise HTTPException(status_code=404, detail="Package bundle not found")
    
    # Get all items for the bundle
    items = db.query(models.PackagingItem).filter(models.PackagingItem.id.in_(bundle.item_ids)).all()
    if len(items) != len(bundle.item_ids):
        raise HTTPException(status_code=400, detail="Some packaging items not found")
    
    # Update bundle
    db_bundle.name = bundle.name
    db_bundle.description = bundle.description
    db_bundle.capacity = bundle.capacity
    db_bundle.notes = bundle.notes
    db_bundle.total_price = sum(item.price for item in items)
    db_bundle.items = items
    
    db.commit()
    db.refresh(db_bundle)
    return db_bundle

@app.delete("/package-bundles/{bundle_id}")
def delete_package_bundle(bundle_id: int, db: Session = Depends(get_db)):
    bundle = db.query(models.PackageBundle).filter(models.PackageBundle.id == bundle_id).first()
    if bundle is None:
        raise HTTPException(status_code=404, detail="Package bundle not found")
    
    db.delete(bundle)
    db.commit()
    return {"message": "Package bundle deleted successfully"}

# Recipe endpoints
@app.post("/recipes/", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    try:
        # Get package bundle
        package_bundle = db.query(models.PackageBundle).filter(models.PackageBundle.id == recipe.package_bundle_id).first()
        if not package_bundle:
            raise HTTPException(status_code=404, detail="Package bundle not found")
        
        # Get all ingredients and calculate total cost
        ingredients_cost = 0
        recipe_ingredients = []
        
        for recipe_ingredient in recipe.ingredients:
            ingredient = db.query(models.Ingredient).filter(models.Ingredient.id == recipe_ingredient.ingredient_id).first()
            if not ingredient:
                raise HTTPException(status_code=404, detail=f"Ingredient with id {recipe_ingredient.ingredient_id} not found")
            
            # Check if we have enough stock
            if ingredient.stock_amount and ingredient.stock_amount < recipe_ingredient.amount_ml:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough stock for {ingredient.name}. Need {recipe_ingredient.amount_ml}ml but only have {ingredient.stock_amount}ml"
                )
            
            ingredients_cost += (ingredient.price_per_ml or 0) * recipe_ingredient.amount_ml
            recipe_ingredients.append((ingredient, recipe_ingredient.amount_ml))
        
        # Calculate total cost (ingredients + packaging)
        total_cost = ingredients_cost + package_bundle.total_price
        
        # Create recipe
        db_recipe = models.Recipe(
            name=recipe.name,
            description=recipe.description,
            total_volume_ml=recipe.total_volume_ml,
            retail_price=recipe.retail_price,
            notes=recipe.notes,
            total_cost=total_cost,
            package_bundle=package_bundle
        )
        
        db.add(db_recipe)
        db.commit()  # Commit to get recipe ID
        
        # Add recipe ingredients with amounts
        for ingredient, amount_ml in recipe_ingredients:
            recipe_ingredient = models.RecipeIngredient(
                recipe_id=db_recipe.id,
                ingredient_id=ingredient.id,
                amount_ml=amount_ml
            )
            db.add(recipe_ingredient)
        
        db.commit()
        db.refresh(db_recipe)
        return db_recipe
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recipes/", response_model=List[schemas.Recipe])
def read_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    recipes = db.query(models.Recipe).offset(skip).limit(limit).all()
    return recipes

@app.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@app.put("/recipes/{recipe_id}", response_model=schemas.Recipe)
def update_recipe(recipe_id: int, recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    try:
        db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
        if db_recipe is None:
            raise HTTPException(status_code=404, detail="Recipe not found")
        
        # Get package bundle
        package_bundle = db.query(models.PackageBundle).filter(models.PackageBundle.id == recipe.package_bundle_id).first()
        if not package_bundle:
            raise HTTPException(status_code=404, detail="Package bundle not found")
        
        # Calculate new total cost
        ingredients_cost = 0
        recipe_ingredients = []
        
        for recipe_ingredient in recipe.ingredients:
            ingredient = db.query(models.Ingredient).filter(models.Ingredient.id == recipe_ingredient.ingredient_id).first()
            if not ingredient:
                raise HTTPException(status_code=404, detail=f"Ingredient with id {recipe_ingredient.ingredient_id} not found")
            
            # Check if we have enough stock
            if ingredient.stock_amount and ingredient.stock_amount < recipe_ingredient.amount_ml:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough stock for {ingredient.name}. Need {recipe_ingredient.amount_ml}ml but only have {ingredient.stock_amount}ml"
                )
            
            ingredients_cost += (ingredient.price_per_ml or 0) * recipe_ingredient.amount_ml
            recipe_ingredients.append((ingredient, recipe_ingredient.amount_ml))
        
        # Update recipe
        db_recipe.name = recipe.name
        db_recipe.description = recipe.description
        db_recipe.total_volume_ml = recipe.total_volume_ml
        db_recipe.retail_price = recipe.retail_price
        db_recipe.notes = recipe.notes
        db_recipe.total_cost = ingredients_cost + package_bundle.total_price
        db_recipe.package_bundle = package_bundle
        
        # Update ingredients
        # First, remove all existing recipe ingredients
        db.query(models.RecipeIngredient).filter(models.RecipeIngredient.recipe_id == recipe_id).delete()
        
        # Add new recipe ingredients
        for ingredient, amount_ml in recipe_ingredients:
            recipe_ingredient = models.RecipeIngredient(
                recipe_id=recipe_id,
                ingredient_id=ingredient.id,
                amount_ml=amount_ml
            )
            db.add(recipe_ingredient)
        
        db.commit()
        db.refresh(db_recipe)
        return db_recipe
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    db.delete(recipe)
    db.commit()
    return {"message": "Recipe deleted successfully"} 