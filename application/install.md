# HOW TO: Build and run the project

## Project initialization

This project was bootstrapped via [Create React App](https://github.com/facebook/create-react-app).

Following is a list of commands I have used to initalize the project:

```bash
yarn create react-app vishub --template typescript
mv vishub/ application/
cd application/

# This step installs all dependencies - some of these are already handled by the create react-app step but are here listed for completeness
# create react-app installs these as dependencies instead of devDependencies which does not seem to matter, see https://github.com/facebook/create-react-app/issues/6180
yarn add typescript @types/node @types/react @types/react-dom @types/jest @types/d3 @types/react-router-dom @types/styled-components d3 react react-dom react-router-dom tslib ts-enum-util @types/json-stable-stringify json-stable-stringify @types/uuid uuid @types/react-css-grid react-css-grid @types/rebass rebass 3d-force-graph react-force-graph-3d

yarn add --dev eslint-config-airbnb eslint-config-prettier eslint-plugin-jsx-a11y eslint-plugin-prettier prettier gts husky lint-staged
```

## Available commands for development / deployment

### `yarn start`

Runs the app in the development mode.<br />
Automatically opens [http://localhost:3000](http://localhost:3000) in the browser in order to view it.
If not, simply type the URL yourself into the browser address bar.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production mode to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
VisHub is then ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn {dry}-lint`

Calls the linter to discover errors/warnings based on the following styleguides:

[Google's Typescript style guide](https://github.com/google/gts)
[Airbnb's React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react#naming)

Also formats all sources according to their styles + adjustments I made, see [./eslintrc](./.eslintrc).

### More commands

Most notable:

- `yarn clean`: cleans the built sources
- `yarn compile` compiles the sources

See [./package.json](./package.json) for more.

## Caveats during development

This project uses Husky and Lint-staged to automatically call ESLint and prettier on every commit.
Due to time constraints, I have abandoned tending to all errors/warnings found because they have mostly been about style decisions that do not impact the performance of this project _currently_.
I am therefore sorry, if somebody out there tries to use this repository and gets hit by an avalanche of errors.
Use `git commit --no-verify` to temporarily dismiss these errors.
