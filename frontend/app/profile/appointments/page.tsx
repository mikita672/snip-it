"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bodoni_Moda } from "next/font/google";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { UserReservationsPage } from "@/types/reservation/UserReservationPreview";
import { useAuth } from "@/contexts/AuthContext";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: "400",
});

function AppointmentsView() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [data, setData] = useState<UserReservationsPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    const page = searchParams.get("page") ?? "0";
    const size = searchParams.get("size") ?? "5";
    const sort = searchParams.get("sort") ?? "reservationTime";
    const direction = searchParams.get("direction") ?? "desc";
    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status") ?? "";

    let url = `/api/reservation/my-appointments?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }

    fetch(url, { method: "GET" })
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          setData(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, searchParams]);

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">
        Loading appointments...
      </p>
    );
  }
  if (!data) {
    return (
      <p className="text-center font-bold text-destructive">
        Failed to load appointments
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className={`text-2xl ${bodoni.className}`}>My Appointments</h2>
        <p className="text-sm text-muted-foreground">
          Your past and upcoming bookings at Snip-it.
        </p>
      </div>
      <AppointmentsTable initialData={data} />
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-muted-foreground">
          Loading appointments...
        </p>
      }
    >
      <AppointmentsView />
    </Suspense>
  );
}
