# Firestore Data Structure for AromaDB

## Collections Overview

### Users Collection
```javascript
/users/{userId}
{
  "userId": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "createdAt": timestamp,
  "settings": {
    "defaultMeasurementUnit": "ml",
    "currency": "USD"
  }
}
```

### Ingredients Collection
```javascript
/ingredients/{ingredientId}
{
  "userId": "user123",              // Required for security rules
  "name": "Lavender Essential Oil",
  "type": "essential_oil",          // essential_oil, carrier_oil, other
  "measurementUnit": "ml",
  "stockQuantity": 100.0,
  "minimumStock": 20.0,
  "costPerUnit": 45.50,
  "supplier": "Supplier Name",
  "notes": "Organic, therapeutic grade",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Recipes Collection
```javascript
/recipes/{recipeId}
{
  "userId": "user123",
  "name": "Relaxing Blend",
  "description": "A calming blend for evening use",
  "totalVolume": 30.0,
  "measurementUnit": "ml",
  "ingredients": [
    {
      "ingredientId": "ing123",
      "quantity": 10.0,
      "measurementUnit": "ml"
    },
    {
      "ingredientId": "ing456",
      "quantity": 5.0,
      "measurementUnit": "ml"
    }
  ],
  "packagingBundleId": "bundle789",
  "retailPrice": 29.99,
  "notes": "Best seller",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Packaging Collection
```javascript
/packaging/{packagingId}
{
  "userId": "user123",
  "name": "Amber Glass Bottle",
  "type": "bottle",                 // bottle, cap, label, box
  "size": "30ml",
  "stockQuantity": 200,
  "minimumStock": 50,
  "costPerUnit": 1.25,
  "supplier": "Supplier Name",
  "notes": "With dropper",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Packaging Bundles Collection
```javascript
/packagingBundles/{bundleId}
{
  "userId": "user123",
  "name": "Standard 30ml Package",
  "components": [
    {
      "packagingId": "pkg123",
      "quantity": 1,
      "type": "bottle"
    },
    {
      "packagingId": "pkg456",
      "quantity": 1,
      "type": "cap"
    },
    {
      "packagingId": "pkg789",
      "quantity": 1,
      "type": "label"
    }
  ],
  "totalCost": 2.50,
  "notes": "Most common packaging combination",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

## Key Features of this Structure

1. **User Isolation**: Every document contains a `userId` field, ensuring security rules work properly
2. **Timestamps**: `createdAt` and `updatedAt` fields for tracking
3. **Flexible Measurements**: Support for different measurement units (ml, drops)
4. **Relationships**: 
   - Recipes reference ingredients via `ingredientId`
   - Recipes reference packaging bundles via `bundleId`
   - Packaging bundles reference individual packaging items via `packagingId`

## Best Practices

1. Always include the `userId` when creating new documents
2. Use batch writes when updating related documents
3. Keep ingredient and packaging references up to date
4. Use timestamps for all document creation and updates
5. Include proper type information for better data organization

## Querying Examples

```javascript
// Get all ingredients for current user
db.collection('ingredients')
  .where('userId', '==', currentUserId)
  .get()

// Get recipes with specific ingredient
db.collection('recipes')
  .where('userId', '==', currentUserId)
  .where('ingredients', 'array-contains', { ingredientId: 'ing123' })
  .get()

// Get low stock packaging items
db.collection('packaging')
  .where('userId', '==', currentUserId)
  .where('stockQuantity', '<=', 'minimumStock')
  .get()
``` 