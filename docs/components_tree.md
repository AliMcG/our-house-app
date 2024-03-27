# Components Tree

All the project components designs and how they related to each other.

## The Folder Structure

- app/
  - RootLayout.tsx
  - page.tsx _LoginPage component_
  - _components/
    - AuthenticationButton.tsx
    - Button.tsx
    - SideNavigationBar.tsx
    - TopNavigationBar.tsx
    - AddItemArea.tsx
    - List.tsx
    - ListCard.tsx
    - ItemsList.tsx
    - ItemCard.tsx
  - (household) _protected route_
    - layout.tsx _shows menu for authd users_
    - home/ _ROUTE SEGMENT_
      - page.tsx
    - profile/ _ROUTE SEGMENT_
      - page.tsx
    - shoppingLists/ _ROUTE SEGMENT_
      - page.tsx
      - [slug]/ _dynamically displays the name of the shop in the url_
        - page.tsx
    - chores/ _ROUTE SEGMENT_
      - page.tsx
      - [slug]/ _dynamically displays the list name in the url_
        - page.tsx

## The Visual Tree

![Components tree](wireframes/components_tree.excalidraw.svg)