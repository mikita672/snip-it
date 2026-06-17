"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { error: "First name must be at least 2 characters" })
      .max(50, { error: "First name is too long" }),
    lastName: z
      .string()
      .min(2, { error: "Last name must be at least 2 characters" })
      .max(50, { error: "Last name is too long" }),
    phone: z
      .string()
      .refine((val) => !val || /^\+?[0-9\s-]{7,15}$/.test(val), {
        error: "Invalid phone number format",
      })
      .optional(),
    email: z.email({ error: "Must be a valid email" }),
    password: z
      .string()
      .min(1, { error: "Password is required" })
      .min(8, { error: "Password should be at least 8 characters long" })
      .max(24, { error: "Password should be no longer than 24 characters" })
      .regex(/[a-z]/, {
        error: "Password must include at least 1 lowercase character",
      })
      .regex(/[A-Z]/, {
        error: "Password must include at least 1 uppercase character",
      })
      .regex(/[0-9]/, { error: "Password must include at least 1 digit" })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Password must include at least 1 special character",
      }),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        error: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type FormSchema = z.infer<typeof formSchema>;

function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    if (!form.formState.isValid) {
      return;
    }
    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success("Registered successfully");
      router.push("/");
      router.refresh();
    } else if (response.status === 409) {
      toast.error("This email is already registered. Please log in instead.");
    } else {
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-150">
        <CardHeader>
          <CardTitle>Registration form</CardTitle>
          <CardDescription>Fill the form to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet className="flex flex-col gap-6">
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="John"
                          className="bg-background"
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Doe"
                          className="bg-background"
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="example@mail.com"
                          className="bg-background"
                          autoComplete="on"
                          type="email"
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Phone Number
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="+1 234 567 890"
                          className="bg-background"
                          type="tel"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <InputGroup className="bg-background">
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Your password"
                            autoComplete="off"
                            type={showPassword ? "text" : "password"}
                            required
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              size="icon-sm"
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowPassword((prev) => !prev);
                              }}
                            >
                              {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Confirm Password
                        </FieldLabel>
                        <InputGroup className="bg-background">
                          <InputGroupInput
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Confirm password"
                            autoComplete="off"
                            type={
                              showPasswordConfirmation ? "text" : "password"
                            }
                            required
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupButton
                              size="icon-sm"
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowPasswordConfirmation((prev) => !prev);
                              }}
                            >
                              {showPasswordConfirmation ? (
                                <EyeClosedIcon />
                              ) : (
                                <EyeIcon />
                              )}
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button
            form="sign-up-form"
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            className={`w-full ${form.formState.isValid && !form.formState.isSubmitting ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
          >
            {form.formState.isSubmitting ? "Signing up..." : "Sign up"}
          </Button>

          <div className="flex flex-col gap-2 items-center">
            <Link href="/login" className="underline">
              Already have an account?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
