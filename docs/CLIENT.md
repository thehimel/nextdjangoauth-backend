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

* Configure `vite.config.ts`
  * Added `build` and `server` configuration.
* Clean up client.

### Install Tailwind CSS with Vite

* [Guide](https://tailwindcss.com/docs/guides/vite#react)
* Installation: `npm install -D tailwindcss postcss autoprefixer`, `npx tailwindcss init -p`.
* Configure template paths: Update `tailwind.config.js`.
* Add the Tailwind directives: Update `./src/index.css`.

### Install NextUI

* [Guide](https://nextui.org/docs/frameworks/vite)
* Installation: `npm i @nextui-org/react framer-motion`.
* Tailwind CSS Setup: Update `tailwind.config.js`.
* Provider Setup: Update `main.tsx`.

### Install shadcn/ui
