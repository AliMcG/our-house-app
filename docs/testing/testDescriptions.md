# Feature: Shopping Item Management

## List
###  Scenario: Successfully retrieve all items for a specific shopping list
    Given the user is authenticated
    And a shopping list with a known Id exists
    And shopping items exist within that shopping list
    When the "list" query is executed with the shopping list's Id
    Then the response should contain all shopping items associated with the specified shopping list

###  Scenario: Attempt to retrieve items for a non-existent shopping list
    Given the user is authenticated
    And a non-existent shopping list Id is provided
    When the "list" query is executed with the non-existent shopping list Id
    Then an error should be returned indicating that the shopping list was not found

## Create
###  Scenario: Successfully create a new shopping item
    Given the user is authenticated
    And a shopping list with a known Id exists
    When the "create" mutation is executed with a valid item name, quantity, and the list Id
    Then a new shopping item should be created and associated with the specified shopping list
    And the new item should have the provided name and quantity
    And the item should be marked as active by default

###  Scenario: Attempt to create a shopping item with a blank name
    Given the user is authenticated
    And a shopping list with a known Id exists
    When the "create" mutation is executed with a blank item name, a valid quantity, and the list Id
    Then an error should be returned indicating that the item name cannot be blank

###  Scenario: Attempt to create a shopping item with an invalid quantity (zero)
    Given the user is authenticated
    And a shopping list with a known Id exists
    When the "create" mutation is executed with a valid item name, a quantity of 0, and the list Id
    Then an error should be returned indicating that the quantity must be at least 1

###  Scenario: Attempt to create a shopping item with an invalid quantity (too high)
    Given the user is authenticated
    And a shopping list with a known Id exists
    When the "create" mutation is executed with a valid item name, a quantity of 100, and the list Id
    Then an error should be returned indicating that the quantity cannot exceed 99

## Delete
###  Scenario: Successfully delete a shopping item
    Given the user is authenticated
    And a shopping item with a known Id exists
    When the "delete" mutation is executed with the shopping item's Id
    Then the shopping item should be successfully deleted

###  Scenario: Attempt to delete a non-existent shopping item
    Given the user is authenticated
    And a non-existent shopping item Id is provided
    When the "delete" mutation is executed with the non-existent shopping item Id
    Then an error should be returned indicating that the shopping item was not found (or a similar appropriate error)

## Active / inactive
###  Scenario: Successfully mark a shopping item as inactive
    Given the user is authenticated
    And a shopping item with a known Id exists and is currently active
    When the "updateActive" mutation is executed with the item Id and 'active: false'
    Then the shopping item should be marked as inactive

###  Scenario: Successfully mark a shopping item as active
    Given the user is authenticated
    And a shopping item with a known Id exists and is currently inactive
    When the "updateActive" mutation is executed with the item Id and 'active: true'
    Then the shopping item should be marked as active

###  Scenario: Attempt to update the active status of a non-existent shopping item
    Given the user is authenticated
    And a non-existent shopping item Id is provided
    When the "updateActive" mutation is executed with the non-existent item Id and 'active: false'
    Then an error should be returned indicating that the shopping item was not found (or a similar appropriate error)