import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { getRandomInt } from 'utils';

// We could of course use the function() syntax and this but that stuff is ultra implicit
let categoryName: string;

const getSearchItemHeading = () => {
  return cy.get('[class*="SearchedItems_root"]').getByTestId('heading');
};

const getCategory = () => cy.get('[class*="Submenu_link"]');

Given('the user visits {string}', (url: string) => {
  cy.visit(url);
  // Close the cookie dialog. In the reality, I'd either ensure it's not shown for tests programatically or check what and
  // where to put (e.g. cookies, session storage, etc.) to make the app think I've already acted on the dialog
  cy.get('#CybotCookiebotDialogBodyButtonDecline').click();
  cy.get('#CybotCookiebotDialog').should('not.be.visible');
});

When('the user inputs {string} in the search bar', (input: string) => {
  cy.getByTestId('blog-search-input').type(`${input}{Enter}`);
});

When('the user opens a searched article', () => {
  getSearchItemHeading().should('be.visible');
  getSearchItemHeading()
    .its('length')
    .then(articleCount => {
      const randomArticleIndex = getRandomInt(articleCount);

      getSearchItemHeading().eq(randomArticleIndex).click();
    });
});

When('the user selects a category', () => {
  getCategory().should('be.visible');
  getCategory()
    .its('length')
    .then(categoryCount => {
      const randomCategoryIndex = getRandomInt(categoryCount);

      getCategory().eq(randomCategoryIndex).click();
      getCategory()
        .eq(randomCategoryIndex)
        .then(category => {
          categoryName = category.text();
        });
    });
});

When('the user opens an article', () => {
  const getArticleImage = () => cy.get('[class*="BlogGridItem_image_"]');

  getArticleImage().should('be.visible');
  getArticleImage()
    .its('length')
    .then(articleImageCount => {
      const randomArticleImageIndex = getRandomInt(articleImageCount);

      getArticleImage().eq(randomArticleImageIndex).click();
    });
});

Then(
  'the user can see articles with the word {string} in the title',
  (input: string) => {
    getSearchItemHeading().should('be.visible');
    getSearchItemHeading()
      .its('length')
      .then(articleCount => {
        for (let i = 0; i < articleCount; i++) {
          getSearchItemHeading()
            .eq(i)
            .should(heading => {
              expect(heading).to.be.visible;
              expect(heading.text().toLowerCase()).to.contain(
                input.toLowerCase()
              );
            });
        }
      });
  }
);

Then('the user can see the phrase {string} in the article', (input: string) => {
  // Opening the article takes some time
  cy.contains(input, {
    timeout: Cypress.config('defaultCommandTimeout') * 2
  }).scrollIntoView();

  cy.contains(input).should('be.visible');
});

Then('the user sees only articles belonging to that category', () => {
  // We could do 2 things here:
  // 1) Hook into the class or make sure the previous first article is not the same as the first article
  // after switching the category but both are pretty bad: hooking into classes is not user-oriented and there's a small chance that
  // the first article before and after would match
  // 2) Wrap the assertion in a retriable block so it will try again and again until all articles match our expectations
  // which I did :)
  cy.getByTestId('blog-post-category').should(categories => {
    for (let i = 0; i < categories.length; i++) {
      expect(categories.eq(i).text()).to.contain(categoryName);
    }
  });
});

Then(
  'the user can see related articles belonging to the same category as the current one',
  () => {
    // Hook into something that doesn't exist on the blog page but exists in articles
    cy.get('[class*="PostInfo_column"]').should('be.visible');
    getCategory().then(categories => {
      const articleCategories = categories
        .map((_index, category) => category.textContent)
        .get();

      // The instructions say that related articles belong to the same category which is not the case with inlined
      // related articles that appear in the middle. That's why I made the search specific to the section after the article
      const getRelatedArticleCategory = () => {
        return cy
          .get('[class*="WidgetContainerr"]')
          .getByTestId('blog-post-category');
      };

      getRelatedArticleCategory().first().scrollIntoView();
      getRelatedArticleCategory().should('be.visible');
      getRelatedArticleCategory()
        .its('length')
        .then(relatedArticleCount => {
          for (let i = 0; i < relatedArticleCount; i++) {
            getRelatedArticleCategory()
              .eq(i)
              .should(relatedArticleCategories => {
                expect(
                  relatedArticleCategories.text().split(',')
                ).to.include.any.members(articleCategories);
              });
          }
        });
    });
  }
);
