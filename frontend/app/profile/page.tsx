"use client";

import ProfileForm from "@/components/profile/ProfileForm";
import ManagementTab from "@/components/management/ManagementTab";
import StatisticsTab from "@/components/statistics/StatisticsTab";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { UserProfile } from "@/types/user/UserProfile";
import { UserReservationsPage } from "@/types/reservation/UserReservationPreview";
import { useRouter } from "next/navigation";
import { Bodoni_Moda } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function ProfilePage({ searchParams }: Props) {
  const paramsObj = use(searchParams);
  const activeTab = (paramsObj.tab as string) || "profile";
  const router = useRouter();

  const { user, loading: loadingProfile, error: profileError } = useAuth();
  const [appointmentsData, setAppointmentsData] = useState<UserReservationsPage | null>(null);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    if (!loadingProfile && !user) {
      router.push("/login");
    }
  }, [loadingProfile, user, router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const page = paramsObj.page ? parseInt(paramsObj.page as string) : 0;
    const size = paramsObj.size ? parseInt(paramsObj.size as string) : 5;
    const sort = paramsObj.sort ? (paramsObj.sort as string) : "reservationTime";
    const direction = paramsObj.direction ? (paramsObj.direction as string) : "desc";
    const search = paramsObj.search ? (paramsObj.search as string) : "";
    const status = paramsObj.status ? (paramsObj.status as string) : "";

    let appointmentsUrl = `/api/reservation/my-appointments?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
    if (search) {
      appointmentsUrl += `&search=${encodeURIComponent(search)}`;
    }
    if (status) {
      appointmentsUrl += `&status=${encodeURIComponent(status)}`;
    }

    fetch(appointmentsUrl, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) {
          setAppointmentsData(data);
        }
        setLoadingAppointments(false);
      })
      .catch(() => { setLoadingAppointments(false); });
  }, [user, paramsObj]);

  if (loadingProfile) {
    return (
      <div className="flex flex-col gap-6 md:px-24 md:py-12 py-6 px-4">
        <p className="text-center text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (profileError || !user) {
    return (
      <div className="flex flex-col gap-6 md:px-24 md:py-12 py-6 px-4">
        <p className="text-center font-bold text-destructive">
          Failed to load profile
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:px-24 md:py-12 py-6 px-4 max-w-8xl mx-auto">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className={`text-4xl ${bodoni.className}`}>Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className={`grid w-full bg-muted/50 ${user.isAdmin ? "md:w-[800px] grid-cols-4" : "md:w-[400px] grid-cols-2"}`}>
          <TabsTrigger value="profile" asChild>
            <Link href="/profile?tab=profile">Profile</Link>
          </TabsTrigger>
          <TabsTrigger value="appointments" asChild>
            <Link href="/profile?tab=appointments">Appointments</Link>
          </TabsTrigger>
          {user.isAdmin && (
            <TabsTrigger value="management" asChild>
              <Link href="/profile?tab=management">Management</Link>
            </TabsTrigger>
          )}
          {user.isAdmin && (
            <TabsTrigger value="statistics" asChild>
              <Link href="/profile?tab=statistics">Statistics</Link>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm user={user} />
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          {loadingAppointments ? (
            <p className="text-center text-muted-foreground">Loading appointments...</p>
          ) : appointmentsData ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className={`text-2xl ${bodoni.className}`}>
                  My Appointments
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your past and upcoming bookings at Snip-it.
                </p>
              </div>
              <AppointmentsTable initialData={appointmentsData} />
            </div>
          ) : (
            <p className="text-center font-bold text-destructive">
              Failed to load appointments
            </p>
          )}
        </TabsContent>

        {user.isAdmin && (
          <TabsContent value="management" className="mt-6">
            <ManagementTab />
          </TabsContent>
        )}

        {user.isAdmin && (
          <TabsContent value="statistics" className="mt-6">
            <StatisticsTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
