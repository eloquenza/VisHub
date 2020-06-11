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
yarn add --dev typescript @types/node @types/react @types/react-dom @types/jest @types/d3

yarn add d3 react react-dom tslib
```

## Available commands for development / deployment

### `yarn start`

Runs the app in the development mode.<br />
Automatically opens [http://localhost:3000](http://localhost:3000) in the browser in order to view it.
If not, simply type the URL yourself into the browser address bar.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production mode to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
VisHub is then ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
