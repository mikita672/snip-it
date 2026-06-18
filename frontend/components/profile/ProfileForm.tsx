"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserProfile } from "@/types/user/UserProfile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PencilIcon, XIcon, SaveIcon, KeyRoundIcon } from "lucide-react";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, { error: "First name must be at least 2 characters" })
    .max(50, { error: "First name is too long" }),
  lastName: z
    .string()
    .min(2, { error: "Last name must be at least 2 characters" })
    .max(50, { error: "Last name is too long" }),
  email: z.email({ error: "Invalid email address" }),
  phone: z
    .string()
    .min(1, { error: "Phone number is required" })
    .refine((val) => /^\+?[0-9\s-]{7,15}$/.test(val), {
      error: "Invalid phone number format",
    }),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { error: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .regex(/[A-Za-z]/, { error: "Password must contain a letter" })
      .regex(/\d/, { error: "Password must contain a digit" })
      .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, {
        error: "Password must contain a special character",
      }),
    confirmNewPassword: z
      .string()
      .min(1, { error: "Please confirm your new password" }),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

interface Props {
  user: UserProfile;
}

const EMPTY_PASSWORD_VALUES: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function ProfileForm({ user }: Props) {
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      phone: user.phone || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: EMPTY_PASSWORD_VALUES,
  });

  async function onSubmitProfile(values: ProfileFormValues) {
    setProfileLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (!response.ok) {
        throw new Error();
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  }

  async function onSubmitPassword(values: PasswordFormValues) {
    setPasswordLoading(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 401) {
        passwordForm.setError("currentPassword", {
          type: "server",
          message: "Current password is incorrect",
        });
        return;
      }
      if (!response.ok) {
        let message = "Failed to update password";
        try {
          const body = await response.json();
          if (body?.message) message = body.message;
        } catch {}
        toast.error(message);
        return;
      }

      passwordForm.reset(EMPTY_PASSWORD_VALUES);
      toast.success("Password updated successfully");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  }

  const handleCancel = () => {
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      phone: user.phone || "",
    });
    passwordForm.reset(EMPTY_PASSWORD_VALUES);
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your personal details, phone number, or password."
              : "View your personal details and account information."}
          </CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitProfile)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      {isEditing ? (
                        <Input
                          placeholder="John"
                          {...field}
                          className="border-primary/20"
                        />
                      ) : (
                        <div className="h-9 px-3 py-2 rounded-4xl border border-input bg-muted/30 flex items-center text-sm">
                          {field.value}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      {isEditing ? (
                        <Input
                          placeholder="Doe"
                          {...field}
                          className="border-primary/20"
                        />
                      ) : (
                        <div className="h-9 px-3 py-2 rounded-4xl border border-input bg-muted/30 flex items-center text-sm">
                          {field.value}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="h-9 px-3 py-2 rounded-4xl border border-input bg-muted/30 flex items-center text-sm">
                  {user.email}
                </div>
              </FormItem>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      {isEditing ? (
                        <Input
                          placeholder="234 567 890"
                          {...field}
                          value={field.value || ""}
                          className="border-primary/20"
                        />
                      ) : (
                        <div className="h-9 px-3 py-2 rounded-4xl border border-input bg-muted/30 flex items-center text-sm">
                          {field.value}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {isEditing && (
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={profileLoading}
                  className="cursor-pointer"
                >
                  <XIcon className="mr-2 h-4 w-4" />
                  Cancel
                </Button>{" "}
                <Button
                  type="submit"
                  size="sm"
                  disabled={profileLoading}
                  className="cursor-pointer"
                >
                  {profileLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>

        {isEditing && (
          <>
            <Separator />
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">Change Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Use at least 8 characters, including a letter, a digit, and
                    a special character.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...field}
                            className="border-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            {...field}
                            className="border-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div />
                  <FormField
                    control={passwordForm.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            {...field}
                            className="border-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={passwordLoading}
                    className="cursor-pointer"
                  >
                    {passwordLoading ? (
                      "Updating..."
                    ) : (
                      <>
                        <KeyRoundIcon className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
