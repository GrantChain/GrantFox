"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type LoaderAction =
  | "submitEvidence"
  | "submitFeedback"
  | "reject"
  | "approve"
  | "complete"
  | "release";

type MilestoneLoaders = Record<LoaderAction, boolean>;
type PayoutMilestoneLoaders = Record<number, MilestoneLoaders>;
type PayoutLoadersState = Record<string, PayoutMilestoneLoaders>;

interface PayoutLoadersContextType {
  getLoading: (
    payoutId: string | undefined,
    milestoneIdx: number | null | undefined,
    action: LoaderAction,
  ) => boolean;
  setLoading: (
    payoutId: string,
    milestoneIdx: number,
    action: LoaderAction,
    loading: boolean,
  ) => void;
  withLoading: <T>(
    payoutId: string,
    milestoneIdx: number,
    action: LoaderAction,
    fn: () => Promise<T>,
  ) => Promise<T>;
}

const defaultMilestoneLoaders: MilestoneLoaders = {
  submitEvidence: false,
  submitFeedback: false,
  reject: false,
  approve: false,
  complete: false,
  release: false,
};

const PayoutLoadersContext = createContext<
  PayoutLoadersContextType | undefined
>(undefined);

export const PayoutLoadersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<PayoutLoadersState>({});

  const setLoading = useCallback<PayoutLoadersContextType["setLoading"]>(
    (payoutId, milestoneIdx, action, loading) => {
      setState((prev) => {
        const payout = prev[payoutId] ? { ...prev[payoutId] } : {};
        const milestone = payout[milestoneIdx]
          ? { ...payout[milestoneIdx] }
          : { ...defaultMilestoneLoaders };
        milestone[action] = loading;
        const next: PayoutLoadersState = {
          ...prev,
          [payoutId]: { ...payout, [milestoneIdx]: milestone },
        };
        return next;
      });
    },
    [],
  );

  const getLoading = useCallback<PayoutLoadersContextType["getLoading"]>(
    (payoutId, milestoneIdx, action) => {
      if (!payoutId || milestoneIdx == null || milestoneIdx === undefined)
        return false;
      return Boolean(state[payoutId]?.[milestoneIdx]?.[action]);
    },
    [state],
  );

  const withLoading = useCallback<PayoutLoadersContextType["withLoading"]>(
    async (payoutId, milestoneIdx, action, fn) => {
      setLoading(payoutId, milestoneIdx, action, true);
      try {
        const result = await fn();
        return result;
      } finally {
        setLoading(payoutId, milestoneIdx, action, false);
      }
    },
    [setLoading],
  );

  const value = useMemo(
    () => ({ getLoading, setLoading, withLoading }),
    [getLoading, setLoading, withLoading],
  );

  return (
    <PayoutLoadersContext.Provider value={value}>
      {children}
    </PayoutLoadersContext.Provider>
  );
};

export const usePayoutLoaders = () => {
  const ctx = useContext(PayoutLoadersContext);
  if (!ctx)
    throw new Error(
      "usePayoutLoaders must be used within PayoutLoadersProvider",
    );
  return ctx;
};
