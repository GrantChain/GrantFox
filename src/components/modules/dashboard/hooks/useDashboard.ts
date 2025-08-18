"use client";

import { useAuth } from "@/components/modules/auth/context/AuthContext";
import { usePayouts } from "@/components/modules/payouts/hooks/usePayouts";
import type { Payout } from "@/generated/prisma";
import { useMemo } from "react";

type MonthPoint = { label: string; value: number; amount: number };

type DashboardStats = {
  role: "GRANTEE" | "PAYOUT_PROVIDER" | "ADMIN" | "";
  totalPayouts: number;
  totalFunding: number;
  activePayouts: number;
  closedPayouts: number;
  canceledPayouts: number;
  draftPayouts: number;
  publishedPayouts: number;
  completionRate: number; // 0..100
  mineCount: number; // created by (provider) or assigned to (grantee)
  monthly: MonthPoint[]; // last 6 months
  statusDistribution: { label: string; value: number }[];
};

export const useDashboard = () => {
  const { user } = useAuth();

  const {
    data: payoutsData,
    isLoading,
    isFetching,
  } = usePayouts({ role: user?.role, userId: user?.user_id });

  const payouts = payoutsData?.data ?? ([] as Payout[]);

  const stats: DashboardStats = useMemo(() => {
    if (!user) {
      return {
        role: "",
        totalPayouts: 0,
        totalFunding: 0,
        activePayouts: 0,
        closedPayouts: 0,
        canceledPayouts: 0,
        draftPayouts: 0,
        publishedPayouts: 0,
        completionRate: 0,
        mineCount: 0,
        monthly: [],
        statusDistribution: [],
      };
    }

    // Base aggregations
    const totalPayouts = payouts.length;
    const byStatus = payouts.reduce(
      (acc, p) => {
        const status = (p.status as string) || "DRAFT";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalFunding = payouts.reduce((sum, p) => {
      const v =
        (
          p.total_funding as unknown as { toNumber: () => number }
        )?.toNumber?.() ?? 0;
      return sum + (Number.isFinite(v) ? v : 0);
    }, 0);

    const activePayouts = byStatus.PUBLISHED || 0;
    const closedPayouts = byStatus.CLOSED || 0;
    const canceledPayouts = byStatus.CANCELED || 0;
    const draftPayouts = byStatus.DRAFT || 0;
    const publishedPayouts = byStatus.PUBLISHED || 0;

    // Completion: closed over (closed + published) to avoid skew by drafts
    const denom = closedPayouts + canceledPayouts;
    const completionRate =
      denom > 0 ? Math.round((closedPayouts / denom) * 100) : 0;

    // Mine counter based on role
    const role = (user.role as DashboardStats["role"]) || "";
    let mineCount = 0;
    if (role === "GRANTEE") {
      mineCount = payouts.filter((p) => p.grantee_id === user.user_id).length;
    } else if (role === "PAYOUT_PROVIDER") {
      mineCount = payouts.filter((p) => p.created_by === user.user_id).length;
    } else if (role === "ADMIN") {
      mineCount = totalPayouts;
    }

    // Monthly aggregates for last 6 months
    const now = new Date();
    const months: MonthPoint[] = Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      const label = d.toLocaleString(undefined, { month: "short" });
      return { label, value: 0, amount: 0 };
    });

    const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
    const monthIndexMap = new Map<string, number>();
    months.forEach((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      monthIndexMap.set(monthKey(d), i);
    });

    for (const p of payouts) {
      const created = new Date(
        p.created_at as unknown as string | number | Date,
      );
      const key = monthKey(
        new Date(created.getFullYear(), created.getMonth(), 1),
      );
      const idx = monthIndexMap.get(key);
      if (idx == null) continue;
      const amount =
        (
          p.total_funding as unknown as { toNumber: () => number }
        )?.toNumber?.() ?? 0;
      months[idx].value += 1;
      months[idx].amount += Number.isFinite(amount) ? amount : 0;
    }

    const statusDistribution = [
      { label: "Draft", value: draftPayouts },
      { label: "Published", value: publishedPayouts },
      { label: "Closed", value: closedPayouts },
      { label: "Canceled", value: canceledPayouts },
    ];

    return {
      role,
      totalPayouts,
      totalFunding,
      activePayouts,
      closedPayouts,
      canceledPayouts,
      draftPayouts,
      publishedPayouts,
      completionRate,
      mineCount,
      monthly: months,
      statusDistribution,
    };
  }, [payouts, user]);

  return {
    isLoading: isLoading || isFetching,
    stats,
  };
};
