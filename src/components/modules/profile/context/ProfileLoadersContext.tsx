"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type LoaderAction =
  | "updateGeneralInfo"
  | "updateGrantee"
  | "updateGrantProvider";

type ProfileLoadersState = Record<LoaderAction, boolean>;

interface ProfileLoadersContextType {
  getLoading: (action: LoaderAction) => boolean;
  setLoading: (action: LoaderAction, loading: boolean) => void;
  withLoading: <T>(action: LoaderAction, fn: () => Promise<T>) => Promise<T>;
}

const defaultState: ProfileLoadersState = {
  updateGeneralInfo: false,
  updateGrantee: false,
  updateGrantProvider: false,
};

const ProfileLoadersContext = createContext<
  ProfileLoadersContextType | undefined
>(undefined);

export const ProfileLoadersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<ProfileLoadersState>(defaultState);

  const setLoading = useCallback<ProfileLoadersContextType["setLoading"]>(
    (action, loading) => {
      setState((prev) => ({ ...prev, [action]: loading }));
    },
    [],
  );

  const getLoading = useCallback<ProfileLoadersContextType["getLoading"]>(
    (action) => {
      return Boolean(state[action]);
    },
    [state],
  );

  const withLoading = useCallback<ProfileLoadersContextType["withLoading"]>(
    async (action, fn) => {
      setLoading(action, true);
      try {
        const result = await fn();
        return result;
      } finally {
        setLoading(action, false);
      }
    },
    [setLoading],
  );

  const value = useMemo(
    () => ({ getLoading, setLoading, withLoading }),
    [getLoading, setLoading, withLoading],
  );

  return (
    <ProfileLoadersContext.Provider value={value}>
      {children}
    </ProfileLoadersContext.Provider>
  );
};

export const useProfileLoaders = () => {
  const ctx = useContext(ProfileLoadersContext);
  if (!ctx)
    throw new Error(
      "useProfileLoaders must be used within ProfileLoadersProvider",
    );
  return ctx;
};
