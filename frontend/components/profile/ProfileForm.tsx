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
import { PencilIcon, XIcon, SaveIcon } from "lucide-react";

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

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  user: UserProfile;
}

export default function ProfileForm({ user }: Props) {
  const [loading, setLoading] = useState(false);
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

  async function onSubmit(values: ProfileFormValues) {
    setLoading(true);
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
      setLoading(false);
    }
  }

  const handleCancel = () => {
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      phone: user.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your personal details, email, and phone number."
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
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      {isEditing ? (
                        <Input
                          placeholder="john.doe@example.com"
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
                  onClick={handleCancel}
                  disabled={loading}
                  className="cursor-pointer border-input hover:bg-muted/50"
                >
                  <XIcon className="mr-2 h-4 w-4" />
                  Cancel
                </Button>{" "}
                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer"
                >
                  {loading ? (
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
      </CardContent>
    </Card>
  );
}
