table User {
  id                String   [pk, default: auto(), id, note: "Mapped to _id"]
  name              String
  email             String  [unique]
  emailVerified     DateTime
  image             String

  accounts          Account[]
  sessions          Session[]
  shoppingLists     ShoppingList[]
  chores            Chores[]
  createdHouseholds Household[] [ref: < Household.createdById, note: "Relation defined on Household model"]
  householdMembers  HouseholdUser[] [ref: < HouseholdUser.userId, note: "Relation defined on HouseholdUser model"]
}

table ShoppingItem {
  id             String       [pk, default: auto(), id, note: "Mapped to _id"]
  name           String
  quantity       Int
  active         Boolean

  ShoppingList   ShoppingList? [fk, delete: cascade] // Relation to ShoppingList, onDelete: Cascade
  shoppingListId String      [note: "ObjectId"]
}

table ShoppingList {
  id          String   [pk, default: auto(), id, note: "Mapped to _id"]
  title       String
  items       ShoppingItem[] [ref: < ShoppingItem.shoppingListId, note: "Relation defined on ShoppingItem model"]
  createdAt   DateTime [default: now()]
  updatedAt   DateTime [updatedAt]

  createdBy     User     [fk] // Relation to User
  createdById String   [not null, ref: > User.id]

  // Relation to households through the join table
  householdEntries HouseholdShoppingList[] [ref: < HouseholdShoppingList.shoppingListId, note: "Relation defined on HouseholdShoppingList model"]

  indexes {
    title
  }
}

// Join table for many-to-many relationship between Household and ShoppingList
table HouseholdShoppingList {
  id             String   [pk, default: auto(), id, note: "Mapped to _id"]
  householdId    String   [not null, note: "ObjectId"]
  shoppingListId String   [not null, note: "ObjectId"]

  household    Household    [fk, onDelete: cascade, ref: < Household.id] // Relation to Household
  shoppingList ShoppingList [fk, onDelete: cascade, ref: < ShoppingList.id] // Relation to ShoppingList

  indexes {
    householdId
    shoppingListId
  }

  unique [householdId, shoppingListId] // Ensures unique pairings
}

// Chores model can be updated as the application grows
table Chores {
  id          String       [pk, default: auto(), id, note: "Mapped to _id"]
  title       String
  items       ChoresItem[] [ref: < ChoresItem.choresId, note: "Relation defined on ChoresItem model"]
  createdAt   DateTime     [default: now()]
  updatedAt   DateTime     [updatedAt]

  createdBy     User         [fk] // Relation to User
  createdById String       [not null, ref: > User.id]

  // Relation to households through the join table
  householdEntries HouseholdChores[] [ref: < HouseholdChores.choresId, note: "Relation defined on HouseholdChores model"]

  indexes {
    title
  }
}

// Join table for many-to-many relationship between Household and Chores
table HouseholdChores {
  id          String   [pk, default: auto(), id, note: "Mapped to _id"]
  householdId String   [not null, note: "ObjectId"]
  choresId    String   [not null, note: "ObjectId"]

  household Household [fk, onDelete: cascade, ref: < Household.id] // Relation to Household
  chores    Chores    [fk, onDelete: cascade, ref: < Chores.id] // Relation to Chores

  indexes {
    householdId
    choresId
  }

  unique [householdId, choresId] // Ensures unique pairings
}

table Household {
  id            String                  [pk, default: auto(), id, note: "Mapped to _id"]
  name          String
  createdById   String                  [not null, note: "ObjectId"]
  imageUrl      String

  createdBy     User                    [fk, note: "Defined by relation 'CreatedHouseholds' on User model"] // Relation to User
  members       HouseholdUser[]         [ref: < HouseholdUser.householdId, note: "Relation defined on HouseholdUser model"]
  shoppingLists HouseholdShoppingList[] [ref: < HouseholdShoppingList.householdId, note: "Relation defined on HouseholdShoppingList model"]
  chores        HouseholdChores[]       [ref: < HouseholdChores.householdId, note: "Relation defined on HouseholdChores model"]
}

table ChoresItem {
  id          String  [pk, default: auto(), id, note: "Mapped to _id"]
  name        String
  completedBy String // Nullable based on schema
  active      Boolean

  Chores      Chores [fk, onDelete: cascade] // Relation to Chores
  choresId    String [note: "ObjectId"]
}

table HouseholdUser {
  id          String   [pk, default: auto(), id, note: "Mapped to _id"]
  userId      String   [not null, note: "ObjectId"]
  householdId String   [not null, note: "ObjectId"]

  user      User      [fk, ref: < User.id] // Relation to User
  household Household [fk, onDelete: cascade, ref: < Household.id] // Relation to Household

  indexes {
    userId
    householdId
  }

  unique [userId, householdId] // Ensures unique pairs
}
