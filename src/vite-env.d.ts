/// <reference types="vite/client" />

interface Window {
  Clerk?: {
    session?: {
      getToken: (options?: { template?: string }) => Promise<string | null>;
    };
    redirectToSignIn: () => void;
    openSignIn: () => void;
  };
}
