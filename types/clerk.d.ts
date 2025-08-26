import '@clerk/clerk-expo';

declare module '@clerk/clerk-expo' {
  interface UserResource {
    publicMetadata?: {
      role?: string;
    };
  }

  interface SignIn {
    userData?: UserResource;
  }

  interface UseAuthReturn {
    user?: UserResource;
  }
}
