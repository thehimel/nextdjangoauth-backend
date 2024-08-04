# Client

## Install

### Init React App with Vite

* `npm create vite@latest client -- --template react-ts`

> Extra double-dash is needed

### Install Dependencies

```shell
npm i --save-dev @types/node
```

### Configure

* Configure `vite.config.ts` by adding `build` and `server` configurations.
* Clean up client: Update `./src/index.css`, `./src/App.css`, `./src/App.tsx`.

### Install Tailwind CSS with Vite

[Guide](https://tailwindcss.com/docs/guides/vite#react)

* Installation: `npm install -D tailwindcss postcss autoprefixer`, `npx tailwindcss init -p`.
* Configure template paths: Update `tailwind.config.js`.
* Add the Tailwind directives: Update `./src/index.css`.

### Install NextUI

[Guide](https://nextui.org/docs/frameworks/vite)

* Installation: `npm i @nextui-org/react framer-motion`.
* Tailwind CSS Setup: Update `tailwind.config.js`.
* Provider Setup: Update `main.tsx`.

#### Install NextUI Pro

[Guide](https://nextui.pro/documentation)

* `npm install --save-dev @iconify/react`
* `npm install usehooks-ts`
* `npm install clsx tailwind-merge`
* Add the `cn` utility function in `src/lib/utils.ts`

### Dark Mode

[Guide](https://nextui.org/docs/customization/dark-mode)

* Install Next Themes: `npm install next-themes`

> Configuration is on the next step.

### Extensions

* Redux Toolkit: `npm install @reduxjs/toolkit`
  * React Bindings: `npm install react-redux`
  * [Guide](https://redux-toolkit.js.org/introduction/getting-started#an-existing-app)
* Redux Persist: `npm install redux-persist`
* React Router Dom: `npm install react-router-dom`
* Radix Icons: `npm install @radix-ui/react-icons`
* Install Axios: `npm install axios`
* Toast: `npm install sonner`

### Configure Dark Mode with NextUI

### Configure `@` for imports

[Guide](https://ui.shadcn.com/docs/installation/vite)

* Edit `tsconfig.json`
* Edit `tsconfig.app.json`
* Update `vite.config.ts`
* That's it, do not install shadcn-ui if you do not want to.

### Internationalization

[Guide](https://react.i18next.com/guides/quick-start)

* `npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector`
* Created `src/lib/i18n.ts`
* Imported `i18n.ts` in `main.tsx`
* Configured `Suspense` in `main.tsx`
* Created `translation.json` files in `/public/static/locales/{languageCode}/`

> `main.tsx` is equivalent to `index.tsx`

### Install LDRS

[Guide](https://uiball.com/ldrs/)

* `npm install ldrs`
* Add to `src/vite-env.d.ts`: `/// <reference types="ldrs" />`
* You must register the type of loader you are using in App.tsx. This can be added anywhere, but we are registering at
the app level as we want to register this once globally.

```javascript
import {quantum} from "ldrs";
import {useEffect} from "react";

const App = () => {
  useEffect(() => {
    quantum.register(); // Register quantum once when App mounts
  }, []);

  return (
    <></>
  );
};

export default App;
```

* Now you can use in the component:

```javascript
import 'ldrs/quantum'

const Loader = () => {
  return (
    // Certically centered. Negative margin is to subtract the space taken by the header and footer. 
    <div className="flex items-center justify-center min-h-screen -mt-36">
      <l-waveform size="35" stroke="3.5" speed="1" color="black"></l-waveform>
    </div>
  );
}

export default Loader;
```
