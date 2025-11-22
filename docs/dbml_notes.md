https://dbdiagram.io/d/669ac6f48b4bb5230ed6c967 used to model prisma database schema written in DBML syntax:

The following tables are in DBML syntax which can be modaled and downloaded via https://dbdiagram.io

```tsx

table User {
  id                String   [pk, note: "Mapped to _id"]
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
  id             String       [pk,  note: "Mapped to _id"]
  name           String
  quantity       Int
  active         Boolean

  ShoppingList   ShoppingList 
  shoppingListId String     [ref: > ShoppingList.id]
}

table ShoppingList {
  id          String   [pk, note: "Mapped to _id"]
  title       String
  items       ShoppingItem[] [ref: < ShoppingItem.shoppingListId, note: "Relation defined on ShoppingItem model"]
  createdAt   DateTime [default: `now()`]
  updatedAt   DateTime [default: `updatedAt`]

  createdBy     User     [pk] // Relation to User
  createdById String   [not null, ref: > User.id]

  // Relation to households through the join table
  householdEntries HouseholdShoppingList[] [ref: < HouseholdShoppingList.shoppingListId, note: "Relation defined on HouseholdShoppingList model"]

  indexes {
    title
  }
}

// Join table for many-to-many relationship between Household and ShoppingList
table HouseholdShoppingList {
  id             String   [pk, note: "Mapped to _id"]
  householdId    String   [not null, note: "ObjectId"]
  shoppingListId String   [not null, note: "ObjectId"]

  household    Household    [pk, ref: < Household.id] 
  shoppingList ShoppingList [pk, ref: < ShoppingList.id] 


     Indexes {
    (shoppingListId, householdId) [unique]
  }
}

// Chores model can be updated as the application grows
table Chores {
  id          String       [pk, note: "Mapped to _id"]
  title       String
  items       ChoresItem[] [ref: < ChoresItem.choresId, note: "Relation defined on ChoresItem model"]
createdAt DateTime [default: `now()`]
  updatedAt DateTime [default: `updatedAt`]

  createdBy     User         [pk] 
  createdById String       [not null, ref: > User.id]

 
  householdEntries HouseholdChores[] [ref: < HouseholdChores.choresId, note: "Relation defined on HouseholdChores model"]

  indexes {
    title
  }
}

// Join table for many-to-many relationship between Household and Chores
table HouseholdChores {
  id          String   [pk, note: "Mapped to _id"]
  householdId String   [not null, note: "ObjectId"]
  choresId    String   [not null, note: "ObjectId"]

  household Household [pk, ref: < Household.id] // Relation to Household
  chores    Chores    [pk, ref: < Chores.id] // Relation to Chores

    Indexes {
    (choresId, householdId) [unique]
  }
}

table Household {
  id            String                  [pk, note: "Mapped to _id"]
  name          String
  createdById   String                  [not null, note: "ObjectId"]
  imageUrl      String

  createdBy     User                    [pk, note: "Defined by relation 'CreatedHouseholds' on User model"] // Relation to User
  members       HouseholdUser[]         [ref: < HouseholdUser.householdId, note: "Relation defined on HouseholdUser model"]
  shoppingLists HouseholdShoppingList[] [ref: < HouseholdShoppingList.householdId, note: "Relation defined on HouseholdShoppingList model"]
  chores        HouseholdChores[]       [ref: < HouseholdChores.householdId, note: "Relation defined on HouseholdChores model"]
}

table ChoresItem {
  id          String  [pk, note: "Mapped to _id"]
  name        String
  completedBy String // Nullable based on schema
  active      Boolean

  Chores      Chores [pk] // Relation to Chores
  choresId    String [note: "ObjectId"]
}

table HouseholdUser {
  id          String   [pk, note: "Mapped to _id"]
  userId      String   [not null, note: "ObjectId"]
  householdId String   [not null, note: "ObjectId"]

  user      User      [pk, ref: < User.id] 
  household Household [pk, ref: < Household.id]

   Indexes {
    (userId, householdId) [unique]
  }
}

table HouseholdInvite {
  id            String       [pk, note: "Mapped to _id"]
  householdId   String      [not null, note: "ObjectId"]
  inviterUserId String      [not null, note: "ObjectId"]
  invitedEmail  String
  invitedUserId String?      [not null, note: "ObjectId"] 
  token         String      [unique]
  status        InviteStatus  [default: PENDING]
  expiresAt     DateTime
  createdAt     DateTime     [default: `now()`]
  updatedAt     DateTime     [default: `updatedAt`]
  acceptedAt    DateTime?

  inviterUser User  [ref: < User.id, note: "Relation defined on User model"]
   // To access the user who was invited (if registered)
  invitedUser User?[ref: < User.id, note: "Relation defined on User model"]

  household Household  [pk, ref: < Household.id]
}

enum InviteStatus {
  PENDING
  ACCEPTED
  DECLINED
  EXPIRED
}

```