"use client";

import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  return <ProfileForm user={user} />;
}
