<p align="center">
<img src="https://www.konomi.network/img/logo-blue.fa248662.png" with="100" height="100" /> 
</p>
<br>
<h1 align="center">Konomi Network Frontend</h1>

## Getting start

1. Install `yarn` if you have not do so: `npm install -g yarn`.
2. Run `yarn ci` to init `node_modules`
3. Run `yarn dev` to start development mode

<br>

## Branch name

| Name format                |                      Description                       |                            Example |
| :------------------------- | :----------------------------------------------------: | ---------------------------------: |
| feature/KON-JIRA-ID-\*\*\* |              For new feature, enhancement              |     feature/KON-111-add-new-button |
| bug/KON-JIRA-ID-\*\*\*     |                     For bug fixing                     |        bug/KON-222-fix-button-size |
| chore/KON-JIRA-ID-\*\*\*   | For refactoring, improvement or upgrading any packages | refactor/KON-333-clean-code-button |

<br>

## Available Scripts

In the project directory, you can run:

| Command       |                                                     Description                                                      |
| :------------ | :------------------------------------------------------------------------------------------------------------------: |
| yarn dev      | Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. |
| yarn build    |                                 Builds the app for production to the `build` folder                                  |
| yarn test     |                                Launches the test runner in the interactive watch mode                                |
| yarn ci       |       Install packages from `yarn.lock`, use for CI process and recommend for first time initializing project        |
| yarn lint     |                                             Check `eslint` syntax error                                              |
| yarn lint:fix |                                              Fix `eslint` syntax error                                               |
| yarn deploy   |                                                Deploy to github page                                                 |

<br>

**_NOTE:_**

- Use `rebase` instead of back `merge` in case you want to sync `develop` branch to feature branch (for making clean git history).
- We are using `redux-toolkit` to handle update redux store data
- If you encounter certain type issue that not reproducible by others, ensure that you have updated `@konomi-network/client` by running `npx install-peerdeps @konomi-network/client`

<br>

## Reference

- Styling: [Tailwind Style](https://tailwindcss.com/docs)
- Design system: [Ant Design](https://ant.design/components/overview/)

<br>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
