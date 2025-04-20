type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  // Note: 'import {} from ""' syntax does not work in .d.ts files.
  interface Locals extends Runtime {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}
