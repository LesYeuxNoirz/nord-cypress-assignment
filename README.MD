## Nord Security E2e Testing Assignment

### Usage
To run tests locally, follow the instructions below:
1. Clone the repo
2. Run `npm ci`
3. Run `npm run test:ui` to open the test runner or `npm run test` to run tests headlessly

### CI
The repository has CI, please refer to the open test PR to see run results, there're both
failed runs with saved artifacts (a video) and a success run

Each run also prints a neat report in the dedicated PR

_Note_: the CI workflow is triggered only for non-master branches

### Notes
- Please read comments, I comment on solutions and some bugs found there
- Implementations are very simple, not using the page object pattern
- Some selectors are weird but I haven't found anything better to hook into in some cases. In reality, I'd just go ahead
and add good selectors to the source code
- All checks are as user-oriented as possible
- One definitely needs to think re-usability through when using BDD but it requires much more time :)