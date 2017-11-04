# ngrx-undo 

Simple middleware for adding undo capability to @ngrx/store

## Install

```
npm install xes-ngrx-undo
```
## Usage

```typescript
import { undoBehavior } from 'xes-ngrx-undo';

@NgModule({
  imports: [
    // initialize buffor size on creation
    StoreModule.provideStore(rootReducer, { metaReducers: [undoBehavior(100)] })
  ]
})
export class AppModule { }
```
After initializing `StoreModule` you can use `undo` action factory like this:

```typescript
import { undo } from "ngrx-undo";

// create action
let action = { type: 'ADD', value: 10 }

// dispatch base action
this.store.dispatch(action);

// dispatch undo action
this.store.dispatch(undo(action));

```
This will undo last action that has similar object to structure to `action`.

Simple undo redo manager example

```typescript
export class UndoRedoManager<T> {
  redoActions: any[] = [];
  undoActions: any[] = [];

  constructor(private store: Store<T>) {}

  /**
   * To be safe all actions should pass by it.
   */
  dispatch(action) {
    // you can filter actions 
    this.undoActions.push(action);
    this.redoActions = [];
    this.store.dispatch(action);
  }

  undo(): boolean {
    if (this.undoActions.length > 0) {
      const action = this.undoActions.pop();
      this.redoActions.push(action);
      this.store.dispatch(undo(action));

      return true;
    }

    return false;
  }

  /**
   * This one pushes action to end of actions queue so its a bit ify if they were removed somewhere deeper down the queue
   */
  redo(): boolean {
    if (this.redoActions.length > 0) {
      const action = this.redoActions.pop();
      this.undoActions.push(action);
      this.store.dispatch(action);

      return true;
    }

    return false;
  }
}
```

## Contribution

### Features

 - Zero-setup. After running `npm install` things will be setup for you :wink:
 - **[RollupJS](https://rollupjs.org/)** for multiple optimized bundles following the [standard convention](http://2ality.com/2017/04/setting-up-multi-platform-packages.html) and [Tree-shaking](https://alexjoverm.github.io/2017/03/06/Tree-shaking-with-Webpack-2-TypeScript-and-Babel/).
 - Tests, coverage and interactive watch mode using **[Jest](http://facebook.github.io/jest/)**
 - **[Prettier](https://github.com/prettier/prettier)** and **[TSLint](https://palantir.github.io/tslint/)** for code formatting and consistency.
 - **Docs automatic generation and deployment** to `gh-pages`, using **[TypeDoc](http://typedoc.org/)**
 - Automatic types `(*.d.ts)` file generation
 - **[Travis](https://travis-ci.org)** integration and **[Coveralls](https://coveralls.io/)** report
 - (Optional) **Automatic releases and changelog**, using [Semantic release](https://github.com/semantic-release/semantic-release), [Commitizen](https://github.com/commitizen/cz-cli), [Conventional changelog](https://github.com/conventional-changelog/conventional-changelog) and [Husky](https://github.com/typicode/husky) (for the git hooks)

### NPM scripts

 - `npm t`: Run test suite
 - `npm start`: Runs `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run commit`: Commit using conventional commit style ([husky](https://github.com/typicode/husky) will tell you to use it if you haven't :wink:)

### Automatic releases

If you'd like to have automatic releases with Semantic Versioning, follow these simple steps.

_**Prerequisites**: you need to create/login accounts and add your project to:_
 - npm
 - Travis
 - Coveralls

Run the following command to prepare hooks and stuff:

```bash
npm run semantic-release-prepare
```

Follow the console instructions to install semantic release and run it (answer NO to "Generate travis.yml").

_Note: make sure you've setup `repository.url` in your `package.json` file_

```bash
npm install -g semantic-release-cli
semantic-release setup
# IMPORTANT!! Answer NO to "Generate travis.yml" question. It is already prepared for you :P
```

From now on, you'll need to use `npm run commit`, which is a convenient way to create conventional commits.

Automatic releases are possible thanks to [semantic release](https://github.com/semantic-release/semantic-release), which publishes your code automatically on Github and npm, plus generates a changelog automatically. This setup is highly influenced by [Kent C. Dodds course on egghead.io](https://egghead.io/courses/how-to-write-an-open-source-javascript-library)

## Resources

- [Write a library using TypeScript library starter](https://dev.to/alexjoverm/write-a-library-using-typescript-library-starter) by [@alexjoverm](https://github.com/alexjoverm/)
- [📺 Create a TypeScript Library using typescript-library-starter](https://egghead.io/lessons/typescript-create-a-typescript-library-using-typescript-library-starter) by [@alexjoverm](https://github.com/alexjoverm/)
- [Introducing TypeScript Library Starter Lite](https://blog.tonysneed.com/2017/09/15/introducing-typescript-library-starter-lite/) by [@tonysneed](https://github.com/tonysneed)

## Credits

Library made with use of [TypeScript library starter](https://github.com/alexjoverm/typescript-library-starter)
