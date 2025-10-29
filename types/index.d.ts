export type listItemType = { 
  id: string;
  name: string;
  quantity: number;
  active: boolean;
  shoppingListId: string | null;
}

export type ListItemResponseType = {
  items?: listItemType[];
  listID?: string;
  // status: 'list items found' | 'list not found' | 'strange, list id not found' | 'list items not found';
}

// TODO: we can get the type from the prisma schema, do we need this?
export type ChoresItemType = { 
  id: string;
  name: string;
  completedBy: string | null;
  active: boolean;
  choresId: string | null;
}

export type ChoresListItemResponseType = {
  items?: ChoresItemType[];
  listID?: string;
  // status: 'list items found' | 'list not found' | 'strange, list id not found' | 'list items not found';
}