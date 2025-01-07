from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Association table for PackageBundle and PackagingItem
package_bundle_items = Table(
    'package_bundle_items',
    Base.metadata,
    Column('bundle_id', Integer, ForeignKey('package_bundles.id'), primary_key=True),
    Column('item_id', Integer, ForeignKey('packaging_items.id'), primary_key=True)
)

class RecipeIngredient(Base):
    __tablename__ = 'recipe_ingredients'
    
    recipe_id = Column(Integer, ForeignKey('recipes.id'), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey('ingredients.id'), primary_key=True)
    amount_ml = Column(Float, nullable=False)
    
    # Relationship
    ingredient = relationship("Ingredient")

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    type = Column(String)  # e.g., essential oil, carrier oil, hydrosol
    description = Column(Text)
    properties = Column(Text)  # therapeutic properties
    notes = Column(Text, nullable=True)
    price_per_ml = Column(Float, nullable=True)
    stock_amount = Column(Float, nullable=True)  # in milliliters
    measurement_type = Column(String, default='ml')  # 'ml' or 'drops'
    drops_per_ml = Column(Float, nullable=True)  # conversion rate for drops

    recipe_ingredients = relationship("RecipeIngredient", back_populates="ingredient")

class PackagingItem(Base):
    __tablename__ = "packaging_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    type = Column(String)  # e.g., bottle, cap, label, box
    description = Column(Text)
    price = Column(Float)
    stock_amount = Column(Integer)
    capacity = Column(Float, nullable=True)  # in ml, if applicable (e.g., for bottles)
    color = Column(String, nullable=True)
    material = Column(String)  # e.g., glass, plastic, paper
    notes = Column(Text, nullable=True)
    
    # Relationship with bundles
    bundles = relationship("PackageBundle", secondary=package_bundle_items, back_populates="items")

class PackageBundle(Base):
    __tablename__ = "package_bundles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    total_price = Column(Float)  # Calculated from items
    capacity = Column(Float)  # in ml
    notes = Column(Text, nullable=True)
    
    # Relationship with packaging items
    items = relationship("PackagingItem", secondary=package_bundle_items, back_populates="bundles")
    
    # Relationship with recipes
    recipes = relationship("Recipe", back_populates="package_bundle")

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    total_volume_ml = Column(Float)  # Total volume in milliliters
    retail_price = Column(Float, nullable=True)  # Suggested retail price
    notes = Column(Text, nullable=True)
    total_cost = Column(Float)  # Calculated from ingredients and packaging
    
    # Relationship with package bundle
    package_bundle_id = Column(Integer, ForeignKey('package_bundles.id'))
    package_bundle = relationship("PackageBundle", back_populates="recipes")
    
    # Relationship with ingredients through RecipeIngredient
    recipe_ingredients = relationship("RecipeIngredient") 