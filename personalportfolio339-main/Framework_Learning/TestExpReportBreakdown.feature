
Feature: Expense Report Side Panel Feature - TEST

    I want to verify the accuracy of Side Panel on Expense Report Dashboard

Background:
    Given I navigate to Expense Report Dashboard

# Scenario: Respective Expense Breakdown modal should open after clicking on any expense report
#         When I open up Expense Breakdown modal for selected Expense from the list
#        Then I verify Respective side panel is visible

# Scenario: Expense table and Expense Breakdown modal data should match
#         When I grab one of the expense data from expense table
#         And I click on that specific expense on expense report to pull up side panel
#         Then I validate expense report table data and side panel data are matching

# Scenario: After navigating to side panel filtered result should remain
#         And grab employee number from Expense Report List
#         When I enter an employee number on column filter
#         When I click on any of the expense on expense report to pull up side panel
#         And click close button to close side panel
#         Then I validate filtered result still remain    

  #@smoke
#   Scenario: Main search filtered result should maintain when click next page button
#     And I grab a POS CODE from the Expense Report
#     When I enter the POS CODE on All filter modal window
#     And I click on Search button in the modal and wait for page to load
#     When I click on next button
#     Then I validate filtered POS CODE is still maintain for the main filter

# Scenario: Filtering main screen search result case-insensitive
#     And I search for a Base with lower case
#     Then I validate Base filtered successfully
# Scenario: Verify Main Screen filter trims the empty space in the front and end of the entry
#     When I search for Base with Empty space at the front
#     Then I validate Base filtered successfully
    @smoke
Scenario: Stand by value should be visible on Trip Information when the value is True
    When I filter all Stand By expenses
    Then I validate Stand By tag exist on Expense Breakdown modal
    @smoke
Scenario: Reserve value should be visible on Trip Information when the value is True
    When I filter all Reserve expenses
    Then I validate Reserve tag exist on Expense Breakdown modal
@smoke
    Scenario: Line Holder by value should be visible on Trip Information when the value is True
        When I filter all Lineholder expenses
        Then I validate Lineholder tag exist on Expense Breakdown modal
@smoke
    Scenario: Diversion chip should be visible on Trip Information section of Expense breakdown when its value is True
        When I filter all Diversion expenses
        Then I validate Diversion tag exist on Expense Breakdown modal
@smoke
    Scenario: Manual Override button should be visible in Expense Breakdown side panel for authorized user
        When I open up Expense Breakdown modal for selected Expense from the list
        Then I validate Manual Override button exist and enabled in Expense Breakdown side panel for authorized user
@smoke
    Scenario: Reprocess button should be visible and enabled in Expense Breakdown side panel for authorized user
        When I open up Expense Breakdown modal for selected Expense from the list
        Then I validate Reprocess button is visible and enabled in Expense Breakdown side panel for authorized user

@smoke
    Scenario: Equipment type should exist in Trip Information section as 'Equipment' on Expense breakdown and should value of either "787,320,737,777"
        When I open up Expense Breakdown modal for selected Expense from the list
        Then I validate Equipment type is exist and have one of the following value[787,320,737,777]        