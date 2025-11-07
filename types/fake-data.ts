import {  } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeUser() {
  return {
    name: undefined,
    email: undefined,
    emailVerified: undefined,
    image: undefined,
  };
}
export function fakeUserComplete() {
  return {
    id: faker.string.uuid(),
    name: undefined,
    email: undefined,
    emailVerified: undefined,
    image: undefined,
  };
}
export function fakeShoppingItem() {
  return {
    name: faker.person.fullName(),
    quantity: faker.number.int(),
    active: faker.datatype.boolean(),
  };
}
export function fakeShoppingItemComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    quantity: faker.number.int(),
    active: faker.datatype.boolean(),
    shoppingListId: undefined,
  };
}
export function fakeShoppingList() {
  return {
    title: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeShoppingListComplete() {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
    createdById: faker.string.uuid(),
  };
}
export function fakeHouseholdShoppingListComplete() {
  return {
    id: faker.string.uuid(),
    householdId: faker.string.uuid(),
    shoppingListId: faker.string.uuid(),
  };
}
export function fakeChores() {
  return {
    title: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeChoresComplete() {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words(5),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
    createdById: faker.string.uuid(),
  };
}
export function fakeHouseholdChoresComplete() {
  return {
    id: faker.string.uuid(),
    householdId: faker.string.uuid(),
    choresId: faker.string.uuid(),
  };
}
export function fakeHousehold() {
  return {
    name: faker.person.fullName(),
    imageUrl: faker.lorem.words(5),
  };
}
export function fakeHouseholdComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    createdById: faker.string.uuid(),
    imageUrl: faker.lorem.words(5),
  };
}
export function fakeChoresItem() {
  return {
    name: faker.person.fullName(),
    completedBy: undefined,
    active: faker.datatype.boolean(),
  };
}
export function fakeChoresItemComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    completedBy: undefined,
    active: faker.datatype.boolean(),
    choresId: undefined,
  };
}
export function fakeHouseholdUserComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    householdId: faker.string.uuid(),
  };
}
export function fakeVerificationToken() {
  return {
    identifier: faker.lorem.words(5),
    token: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeVerificationTokenComplete() {
  return {
    id: faker.string.uuid(),
    identifier: faker.lorem.words(5),
    token: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeAccount() {
  return {
    type: faker.lorem.words(5),
    provider: faker.lorem.words(5),
    providerAccountId: faker.lorem.words(5),
    refresh_token: undefined,
    access_token: undefined,
    expires_at: undefined,
    token_type: undefined,
    scope: undefined,
    id_token: undefined,
    session_state: undefined,
  };
}
export function fakeAccountComplete() {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    type: faker.lorem.words(5),
    provider: faker.lorem.words(5),
    providerAccountId: faker.lorem.words(5),
    refresh_token: undefined,
    access_token: undefined,
    expires_at: undefined,
    token_type: undefined,
    scope: undefined,
    id_token: undefined,
    session_state: undefined,
  };
}
export function fakeSession() {
  return {
    sessionToken: faker.lorem.words(5),
    expires: faker.date.anytime(),
  };
}
export function fakeSessionComplete() {
  return {
    id: faker.string.uuid(),
    sessionToken: faker.lorem.words(5),
    userId: faker.string.uuid(),
    expires: faker.date.anytime(),
  };
}
