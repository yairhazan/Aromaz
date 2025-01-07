from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Create mock ingredients data
mock_ingredients = [
    {
        "name": "Lavender Essential Oil",
        "type": "Essential Oil",
        "description": "A versatile oil with a sweet, floral aroma",
        "properties": "Calming, relaxing, balancing. Good for skin care and sleep support.",
        "notes": "From Provence, France",
        "price_per_ml": 0.85,
        "stock_amount": 100,
        "measurement_type": "drops",
        "drops_per_ml": 20
    },
    {
        "name": "Tea Tree Essential Oil",
        "type": "Essential Oil",
        "description": "Fresh, medicinal aroma with powerful cleansing properties",
        "properties": "Antimicrobial, cleansing, purifying",
        "notes": "Australian sourced",
        "price_per_ml": 0.65,
        "stock_amount": 100,
        "measurement_type": "drops",
        "drops_per_ml": 20
    },
    {
        "name": "Sweet Almond Oil",
        "type": "Carrier Oil",
        "description": "Light, sweet, nutty carrier oil",
        "properties": "Moisturizing, nourishing, gentle",
        "notes": "Cold pressed",
        "price_per_ml": 0.15,
        "stock_amount": 500,
        "measurement_type": "ml",
        "drops_per_ml": None
    },
    {
        "name": "Rose Otto",
        "type": "Essential Oil",
        "description": "Deep, rich, floral aroma",
        "properties": "Nurturing, uplifting, balancing",
        "notes": "Steam distilled",
        "price_per_ml": 150.0,
        "stock_amount": 10,
        "measurement_type": "drops",
        "drops_per_ml": 20
    },
    {
        "name": "Frankincense",
        "type": "Essential Oil",
        "description": "Warm, spicy, woody aroma",
        "properties": "Grounding, meditative, rejuvenating",
        "notes": "Sourced from Oman",
        "price_per_ml": 8.50,
        "stock_amount": 50,
        "measurement_type": "drops",
        "drops_per_ml": 20
    },
    {
        "name": "Rose Hydrosol",
        "type": "Hydrosol",
        "description": "Gentle, floral water",
        "properties": "Hydrating, balancing, soothing",
        "notes": "Steam distilled",
        "price_per_ml": 0.45,
        "stock_amount": 250,
        "measurement_type": "ml",
        "drops_per_ml": None
    },
    {
        "name": "Jojoba Oil",
        "type": "Carrier Oil",
        "description": "Golden, liquid wax similar to skin's sebum",
        "properties": "Balancing, moisturizing, non-greasy",
        "notes": "Cold pressed",
        "price_per_ml": 0.35,
        "stock_amount": 500,
        "measurement_type": "ml",
        "drops_per_ml": None
    },
    {
        "name": "Jasmine Absolute",
        "type": "Absolute",
        "description": "Rich, exotic, floral aroma",
        "properties": "Uplifting, sensual, confidence-boosting",
        "notes": "Solvent extracted",
        "price_per_ml": 95.0,
        "stock_amount": 15,
        "measurement_type": "drops",
        "drops_per_ml": 20
    }
]

# Create mock packaging items data
mock_packaging_items = [
    {
        "name": "Amber Glass Bottle",
        "type": "Bottle",
        "description": "Dark amber glass bottle with dropper",
        "price": 2.50,
        "stock_amount": 100,
        "capacity": 30.0,
        "color": "Amber",
        "material": "Glass",
        "notes": "UV protective glass"
    },
    {
        "name": "Roll-on Cap",
        "type": "Cap",
        "description": "Stainless steel roll-on applicator",
        "price": 1.00,
        "stock_amount": 150,
        "capacity": None,
        "color": "Silver",
        "material": "Stainless Steel",
        "notes": "Fits 30ml bottles"
    },
    {
        "name": "Label",
        "type": "Label",
        "description": "Waterproof label with elegant design",
        "price": 0.50,
        "stock_amount": 200,
        "capacity": None,
        "color": "White",
        "material": "Vinyl",
        "notes": "Waterproof and oil-resistant"
    }
]

# Create mock package bundles data
mock_package_bundles = [
    {
        "name": "Standard 30ml Package",
        "description": "Complete packaging set for 30ml products",
        "capacity": 30.0,
        "notes": "Our most popular packaging option",
        "items": ["Amber Glass Bottle", "Roll-on Cap", "Label"]
    }
]

# Create mock recipes data
mock_recipes = [
    {
        "name": "Relaxing Sleep Blend",
        "description": "A calming blend to promote restful sleep",
        "total_volume_ml": 30.0,
        "retail_price": 45.0,
        "notes": "Best used before bedtime",
        "ingredients": [
            {"name": "Lavender Essential Oil", "amount_ml": 3.0},
            {"name": "Sweet Almond Oil", "amount_ml": 25.0},
            {"name": "Frankincense", "amount_ml": 2.0}
        ],
        "package_bundle": "Standard 30ml Package"
    },
    {
        "name": "Stress Relief Roll-on",
        "description": "An uplifting blend to ease tension and stress",
        "total_volume_ml": 30.0,
        "retail_price": 35.0,
        "notes": "Apply to pulse points",
        "ingredients": [
            {"name": "Lavender Essential Oil", "amount_ml": 2.0},
            {"name": "Rose Otto", "amount_ml": 1.0},
            {"name": "Jojoba Oil", "amount_ml": 27.0}
        ],
        "package_bundle": "Standard 30ml Package"
    },
    {
        "name": "Luxury Rose Facial Oil",
        "description": "A luxurious facial oil for glowing skin",
        "total_volume_ml": 30.0,
        "retail_price": 85.0,
        "notes": "Use morning and evening after cleansing",
        "ingredients": [
            {"name": "Rose Otto", "amount_ml": 1.5},
            {"name": "Jasmine Absolute", "amount_ml": 1.0},
            {"name": "Jojoba Oil", "amount_ml": 15.0},
            {"name": "Sweet Almond Oil", "amount_ml": 12.5}
        ],
        "package_bundle": "Standard 30ml Package"
    }
]

def seed_database():
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if we already have data for any of our entities
        has_ingredients = db.query(models.Ingredient).count() > 0
        has_packaging = db.query(models.PackagingItem).count() > 0
        has_bundles = db.query(models.PackageBundle).count() > 0
        has_recipes = db.query(models.Recipe).count() > 0
        
        if not any([has_ingredients, has_packaging, has_bundles, has_recipes]):
            # Add all ingredients
            for ingredient_data in mock_ingredients:
                ingredient = models.Ingredient(**ingredient_data)
                db.add(ingredient)
            db.commit()
            
            # Add packaging items
            packaging_items = {}
            for item_data in mock_packaging_items:
                item = models.PackagingItem(**item_data)
                db.add(item)
                db.flush()  # Flush to get the ID
                packaging_items[item.name] = item
            
            # Add package bundles
            for bundle_data in mock_package_bundles:
                items = [packaging_items[item_name] for item_name in bundle_data["items"]]
                bundle = models.PackageBundle(
                    name=bundle_data["name"],
                    description=bundle_data["description"],
                    capacity=bundle_data["capacity"],
                    notes=bundle_data["notes"],
                    total_price=sum(item.price for item in items),
                    items=items
                )
                db.add(bundle)
            db.commit()
            
            # Add recipes
            ingredients_dict = {i.name: i for i in db.query(models.Ingredient).all()}
            bundles_dict = {b.name: b for b in db.query(models.PackageBundle).all()}
            
            for recipe_data in mock_recipes:
                # Create the recipe
                recipe = models.Recipe(
                    name=recipe_data["name"],
                    description=recipe_data["description"],
                    total_volume_ml=recipe_data["total_volume_ml"],
                    retail_price=recipe_data["retail_price"],
                    notes=recipe_data["notes"],
                    package_bundle=bundles_dict[recipe_data["package_bundle"]]
                )
                
                # Calculate total cost
                ingredients_cost = sum(
                    ingredients_dict[ing["name"]].price_per_ml * ing["amount_ml"]
                    for ing in recipe_data["ingredients"]
                )
                recipe.total_cost = ingredients_cost + recipe.package_bundle.total_price
                
                db.add(recipe)
                db.flush()  # Get the recipe ID
                
                # Add recipe ingredients
                for ing_data in recipe_data["ingredients"]:
                    recipe_ingredient = models.RecipeIngredient(
                        recipe_id=recipe.id,
                        ingredient_id=ingredients_dict[ing_data["name"]].id,
                        amount_ml=ing_data["amount_ml"]
                    )
                    db.add(recipe_ingredient)
            
            db.commit()
            print("Database seeded successfully!")
        else:
            print("Database already contains data, skipping seed.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 