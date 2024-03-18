Feature: Browsing articles
  Scenario: Searching by the article title
    Given the user visits '/'
    When the user inputs 'security' in the search bar
    Then the user can see articles with the word 'security' in the title

  Scenario: Searching by the article content
    Given the user visits '/'
    When the user inputs 'mobile security' in the search bar
    When the user opens a searched article
    Then the user can see the phrase 'mobile security' in the article

  Scenario: Browsing by categories
    Given the user visits '/'
    When the user selects a category
    Then the user sees only articles belonging to that category

  Scenario: Related articles
    Given the user visits '/'
    When the user opens an article
    Then the user can see related articles belonging to the same category as the current one