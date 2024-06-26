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
  status: 'list items found' | 'list not found' | 'strange, list id not found' | 'list items not found';
}