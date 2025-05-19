export interface AuthenticationStore {
  email: string;

  setEmail: (email: string) => void;
  clearEmail: () => void;
}
