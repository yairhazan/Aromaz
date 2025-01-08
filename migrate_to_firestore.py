import firebase_admin
from firebase_admin import credentials, firestore, auth
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from backend.models import Base, Ingredient, Recipe, PackagingItem, PackageBundle, RecipeIngredient
import json

def init_firestore():
    """Initialize Firestore connection"""
    cred = credentials.Certificate('/Users/yairhazan/Downloads/aromatherapy-3241a-firebase-adminsdk-2jhqk-3b54711366.json')
    firebase_admin.initialize_app(cred)
    return firestore.client()

def init_sqlite():
    """Initialize SQLite connection"""
    engine = create_engine('sqlite:///./backend/sql_app.db')
    Session = sessionmaker(bind=engine)
    return Session()

def create_firebase_user(email, password, display_name):
    """Create a new user in Firebase Authentication"""
    try:
        user = auth.create_user(
            email=email,
            password=password,
            display_name=display_name
        )
        return user.uid
    except auth.EmailAlreadyExistsError:
        # If user exists, get their UID
        user = auth.get_user_by_email(email)
        return user.uid

def migrate_ingredients(db, sqlite_session, user_id):
    """Migrate ingredients to Firestore"""
    ingredients_ref = db.collection('ingredients')
    ingredients_map = {}  # To store old_id -> new_id mapping
    
    for ingredient in sqlite_session.query(Ingredient).all():
        doc_ref = ingredients_ref.document()
        ingredients_map[ingredient.id] = doc_ref.id
        
        doc_ref.set({
            'userId': user_id,
            'name': ingredient.name,
            'type': ingredient.type,
            'measurementUnit': ingredient.measurement_type or 'ml',
            'stockQuantity': ingredient.stock_amount or 0.0,
            'minimumStock': 0.0,  # Set a default
            'costPerUnit': ingredient.price_per_ml or 0.0,
            'notes': ingredient.notes or '',
            'description': ingredient.description or '',
            'properties': ingredient.properties or '',
            'dropsPerMl': ingredient.drops_per_ml,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
    
    return ingredients_map

def migrate_packaging(db, sqlite_session, user_id):
    """Migrate packaging items to Firestore"""
    packaging_ref = db.collection('packaging')
    packaging_map = {}  # To store old_id -> new_id mapping
    
    for item in sqlite_session.query(PackagingItem).all():
        doc_ref = packaging_ref.document()
        packaging_map[item.id] = doc_ref.id
        
        doc_ref.set({
            'userId': user_id,
            'name': item.name,
            'type': item.type,
            'size': f"{item.capacity}ml" if item.capacity else None,
            'stockQuantity': item.stock_amount or 0,
            'minimumStock': 10,  # Set a default
            'costPerUnit': item.price or 0.0,
            'notes': item.notes or '',
            'description': item.description or '',
            'color': item.color,
            'material': item.material,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
    
    return packaging_map

def migrate_packaging_bundles(db, sqlite_session, user_id, packaging_map):
    """Migrate packaging bundles to Firestore"""
    bundles_ref = db.collection('packagingBundles')
    bundles_map = {}  # To store old_id -> new_id mapping
    
    for bundle in sqlite_session.query(PackageBundle).all():
        doc_ref = bundles_ref.document()
        bundles_map[bundle.id] = doc_ref.id
        
        components = []
        for item in bundle.items:
            components.append({
                'packagingId': packaging_map[item.id],
                'quantity': 1,  # Default since original schema doesn't store quantity
                'type': item.type
            })
        
        doc_ref.set({
            'userId': user_id,
            'name': bundle.name,
            'components': components,
            'totalCost': bundle.total_price or 0.0,
            'notes': bundle.notes or '',
            'description': bundle.description or '',
            'capacity': bundle.capacity,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
    
    return bundles_map

def migrate_recipes(db, sqlite_session, user_id, ingredients_map, bundles_map):
    """Migrate recipes to Firestore"""
    recipes_ref = db.collection('recipes')
    
    for recipe in sqlite_session.query(Recipe).all():
        doc_ref = recipes_ref.document()
        
        ingredients = []
        for recipe_ingredient in recipe.recipe_ingredients:
            ingredients.append({
                'ingredientId': ingredients_map[recipe_ingredient.ingredient_id],
                'quantity': recipe_ingredient.amount_ml,
                'measurementUnit': 'ml'
            })
        
        doc_ref.set({
            'userId': user_id,
            'name': recipe.name,
            'description': recipe.description or '',
            'totalVolume': recipe.total_volume_ml,
            'measurementUnit': 'ml',
            'ingredients': ingredients,
            'packagingBundleId': bundles_map.get(recipe.package_bundle_id),
            'retailPrice': recipe.retail_price or 0.0,
            'notes': recipe.notes or '',
            'totalCost': recipe.total_cost or 0.0,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        })

def create_user_profile(db, user_id, email, display_name):
    """Create a user profile in Firestore"""
    users_ref = db.collection('users')
    users_ref.document(user_id).set({
        'userId': user_id,
        'email': email,
        'displayName': display_name,
        'settings': {
            'defaultMeasurementUnit': 'ml',
            'currency': 'USD'
        },
        'createdAt': firestore.SERVER_TIMESTAMP
    })

def main():
    # Initialize connections
    db = init_firestore()
    sqlite_session = init_sqlite()
    
    # List of users to create and migrate data for
    users = [
        {
            'email': 'user1@example.com',
            'password': 'temppass123',  # They can reset this later
            'display_name': 'User 1'
        },
        # Add more users as needed
    ]
    
    try:
        for user_data in users:
            print(f"\nProcessing user: {user_data['email']}")
            
            # Create or get Firebase user
            user_id = create_firebase_user(
                user_data['email'],
                user_data['password'],
                user_data['display_name']
            )
            
            # Create user profile
            create_user_profile(db, user_id, user_data['email'], user_data['display_name'])
            
            # Migrate all data for this user
            print("Migrating ingredients...")
            ingredients_map = migrate_ingredients(db, sqlite_session, user_id)
            
            print("Migrating packaging items...")
            packaging_map = migrate_packaging(db, sqlite_session, user_id)
            
            print("Migrating packaging bundles...")
            bundles_map = migrate_packaging_bundles(db, sqlite_session, user_id, packaging_map)
            
            print("Migrating recipes...")
            migrate_recipes(db, sqlite_session, user_id, ingredients_map, bundles_map)
            
            print(f"Migration completed for user: {user_data['email']}")
            print(f"User ID: {user_id}")
            print("Temporary password: {user_data['password']} (user should change this)")
        
        print("\nMigration completed successfully for all users!")
        
    except Exception as e:
        print(f"Error during migration: {str(e)}")
    finally:
        sqlite_session.close()

if __name__ == "__main__":
    main() 