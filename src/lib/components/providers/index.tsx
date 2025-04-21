import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors={true} closeButton={true} />
        {children}
      </QueryClientProvider>
    </>
  );
};

export default Providers;
