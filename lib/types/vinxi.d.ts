import type { H3EventContext } from "vinxi/http";
import type { PlatformProxy } from "wrangler";

import type { CloudflareEnv } from "@/lib/cloudflare";

declare module "vinxi/http" {
  interface H3EventContext {
    cloudflare: PlatformProxy<CloudflareEnv>;
  }
}
