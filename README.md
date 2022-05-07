# Hookstand

Opinionated React state management with hooks 🪝

⚡ Powered by [Zustand](https://github.com/pmndrs/zustand) & [Immer](https://github.com/immerjs/immer)

> NOTE: This project is very 🚧 WIP 🚧, and was created out of passion to simplify my own development experience on React state management.
> Any feedback/help/advice is greatly appreciated!

![example of usage](/assets/demo.png)

## Installation

```bash
npm i hookstand
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true, // Required
    "strictNullChecks": true // Recommended
  }
}
```

## Usage

In its most basic form, Hookstand can be used to replace all `useState` & `useCallback` hooks.

```tsx
import {
  useAction,
  useInput,
  useStore,
  useSubstate,
  useWatch,
} from 'hookstand';

const Login = () => {
  // 👉 Create a store locally within a component
  const { store } = useStore({
    email: '',
    password: '',
    isLoggedIn: false,
  });

  // 👉 Listen to changes in certain properties & only update when necessary
  const { isLoggedIn, isLoading, error } = useSubstate(store, [
    'isLoggedIn',
    // ℹ️ Every Hookstand store comes with isLoading & error properties included
    'isLoading',
    'error',
  ]);

  // 👉 Create plug-and-play prop collections to make handling inputs easy
  const emailProps = useInput(store, 'email');
  const passwordProps = useInput(store, 'password');

  // 👉 Listen for changes in the built-in "error" value & alert the user if it changes
  useWatch(store, 'error', (error) => {
    if (error === null) return;
    alert(`An error occurred: ${error}`);
  });

  // 👉 Create an action that can effect state
  // ℹ️ If the action is asynchronous, isLoading will be true while the Promise is pending
  //    If the promise rejects, error will be set to "unexpected error"
  const handleLogin = useAction(store, (state) => async () => {
    const { email, password } = state;

    const response = await fetch('https://example.com/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then((response) => response.json());

    if (response.success) {
      // ℹ️ Every action is provided with an Immer draft of the current state,
      //    so its properties can be modified directly
      state.isLoggedIn = true;
    } else {
      state.error = 'invalid credentials';
    }
  });

  return (
    <article>
      <h1>Sign In</h1>

      {/* 👉 Switch content based on listened state properties */}
      {isLoggedIn && <p>You ARE currently logged in 🔓</p>}
      {!isLoggedIn && <p>You ARE NOT currently logged in 🔒</p>}

      <div>
        {/* 👉 Spread props to inputs */}
        <input type="email" label="Email" {...emailProps} />
        <input type="password" label="Password" {...passwordProps} />

        {/* 👉 Use the built-in error state to easily show error text when necessary */}
        {!!error && <b>Something went wrong, please try again…</b>}

        {/* 👉 Use the handleLogin action as an onClick listener */}
        {/* ℹ️ isLoading can be used to disable the button while the action is executing */}
        <button disabled={isLoading} onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </article>
  );
};
```

## Hooks

### useStore

🚧 TODO

### useSubstate

Allows picking & returning values from the store object. Only triggers an update when one of the picked values changes.
The returned value/object will have the correct TypeScript type.

Automatically displays all possbile paths to pick from in any IDE that supports TypeScript code completion.

NOTE: Nested path discovery works for most value types, but some are disabled due to performance reasons.  
Current disabled types:

- Class
- Date
- HTMLElement

#### Examples

```tsx
// Pick a single value
const foo = useSubstate(store, 'foo');

// Pick multiple values
const foo = useSubstate(store, ['foo', 'bar']);

// Pick a nested value
const bar = useSubstate(store, 'foo.bar');

// Pick a custom value using a selector function
const [foo, bar] = useSubstate(store, (state) => [state.foo, state.bar]);
```

### useInput

🚧 TODO

### useAction

🚧 WIP

Actions are functions that can directly update state. They can be used the same way a React `useCallback` hook is used,
but often do not require any dependencies to be specified.

An action receives an [immer draft](https://immerjs.github.io/immer/#how-immer-works) as the argument for the outer function.
This state can be modified directly without changing the immutable nature of the state elsewhere.

> NOTE: The state draft is essentially a snapshot of the state from when the async function was excecuted at.
> You can use the `store.getState()` function to get the current state inside an async action
> in case it was updated while the action was running, although this should be very rarely required.

> NOTE: An async action function will have the draft state applied to the actual state once it has finished executing.
> If you need to update the state "live" while the function is running, the outer function also gets a "set" function along the state draft
> that can be used to update the state immediately. An example of this is provided below.

> NOTE: If the action function is asynchronous, it will not have the "isLoading" property set to true in its state draft.

```tsx
// ℹ️ If the action is asynchronous, isLoading will be true while the Promise is pending
//    If the promise rejects, error will be set to "unexpected error"
const handleLogin = useAction(
  store,
  (state) => async () => {
    const { email, password } = state;

    const response = await fetch('https://example.com/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then((response) => response.json());

    if (response.success) {
      // ℹ️ Every action is provided with an Immer draft of the current state,
      //    so its properties can be modified directly
      state.isLoggedIn = true;
    } else {
      state.error = 'invalid credentials';
    }
  },
  // ℹ️ An action can have "outside" dependencies like the useCallback hook
  //    They can be specified as an array, just like for useCallback
  //    This array can be omitted if no dependencies are required
  //    You do not need to specify the store (or any parts of its state) as a dependency
  []
);

// ℹ️ An example of a asynchronous action that has to update state immediately to provide upload progress
const handleUpload = useAction(
  store,
  // ℹ️ An optional "set" function is also provided here that can be used to update state immediately
  (state, set) => async () => {
    let complete = false;
    do {
      const { progress, complete: isComplete } = await fetch('...', { ... });
      complete = isComplete;

      // ℹ️ Update the "progress" state value immediately
      set({ progress });
    } while (!complete)
  },
  []
);
```

### useWatch

🚧 TODO

## React Native

React Native is fully supported, and does not require any extra installation steps.

A special `useNativeInput` is also available to make binding React Native inputs to state easier.

### useNativeInput

Identical to `useInput`, but uses the `onChangeText` prop to listen to changes.

#### Examples

```tsx
import { useNativeInput, useStore } from 'hookstand';

// ...

const { store } = useStore({
  email: '',
});

// Swap the "useInput" hook for the "useNativeInput" hook
const emailProps = useNativeInput(store, 'email');

// Apply props to the input
return <TextInput {...emailProps} />;
```
