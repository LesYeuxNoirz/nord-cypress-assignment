beforeEach(() => {
  // Ignore uncaught React exceptions from the app we cannot control
  Cypress.on(
    'uncaught:exception',
    err => !err.message.toLowerCase().includes('react')
  );
});

declare namespace Cypress {
  interface Chainable<Subject> {
    getByTestId(id: string): Chainable<JQuery>;
  }
}

Cypress.Commands.addQuery('getByTestId', function (id: string) {
  return (subject?: JQuery) => {
    let el: JQuery;

    if (subject) {
      el = subject.find(`[data-testId=${id}]`);
    } else {
      el = Cypress.$(`[data-testId=${id}]`);
    }

    if (!el || !Cypress.dom.isElement(el)) {
      throw new Error(`Failed to find an element with the test id "${id}"`);
    }

    return el;
  };
});
