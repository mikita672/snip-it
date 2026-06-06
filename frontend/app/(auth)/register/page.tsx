"use client"

import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.email("Must be a valid email"),
    password: z.string()
        .nonempty("Password is required")
        .min(8, "Password should be at least 8 characters long")
        .max(24, "Password should be no longer than 24 characters")
        .regex(/[a-z]/, "Password must include at least 1 lowercase character")
        .regex(/[A-Z]/, "Password must include at least 1 uppercase character")
        .regex(/[0-9]/, "Password must include at least 1 digit")
        .regex(/[^a-zA-Z0-9]/, "Password must include at least 1 special character"),
    confirmPassword: z.string(),
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["passwordConfirmation"],
        })
    }
});

type FormSchema = z.infer<typeof formSchema>;

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: FormSchema) => {
        if (!form.formState.isValid) {
            return;
        }
        const response = await fetch('/api/auth/sign-up', {
            method: "POST",
            body: JSON.stringify({ email: data.email, password: data.password }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            toast.success("Registered successfully");
        } else {
            console.log(response);
            toast.error("Failed to register");
        }
    }

    return (
        <div className="flex justify-center items-center h-[68vh]">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Registration form</CardTitle>
                    <CardDescription>Fill the form to sign up</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldSet className="flex flex-col gap-6">
                            <FieldGroup>
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
                                                autoFocus
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                            <InputGroup
                                                className="bg-background"
                                            >
                                                <InputGroupInput
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Your password goes here"
                                                    autoComplete="off"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    autoFocus
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        size="icon-sm"
                                                        className="cursor-pointer"
                                                        onClick={() => setShowPassword(prev => !prev)}
                                                    >
                                                        {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Password confirmation</FieldLabel>
                                            <InputGroup
                                                className="bg-background"
                                            >
                                                <InputGroupInput
                                                    {...field}
                                                    id={field.name}
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Enter the password again"
                                                    autoComplete="off"
                                                    type={showPasswordConfirmation ? "text" : "password"}
                                                    required
                                                    autoFocus
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        size="icon-sm"
                                                        className="cursor-pointer"
                                                        onClick={() => setShowPasswordConfirmation(prev => !prev)}
                                                    >
                                                        {showPasswordConfirmation ? <EyeClosedIcon /> : <EyeIcon />}
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button
                        form="sign-up-form"
                        type="submit"
                        className={`w-full ${form.formState.isValid ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                    >Sign up</Button>

                    <div className="flex flex-col gap-2 items-center">
                        <Link href="/login" className="underline">Already have an account?</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register