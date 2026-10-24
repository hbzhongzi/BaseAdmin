/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DEFAULT_LAYOUT?: string;
  readonly VITE_DEFAULT_PRIMARY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
