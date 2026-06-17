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
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.email("Must be a valid email"),
    password: z.string().nonempty("Password is required"),
});

type FormSchema = z.infer<typeof formSchema>;

function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormSchema) => {
        if (!form.formState.isValid) {
            return;
        }
        const response = await fetch('/api/auth/sign-in', {
            method: "POST",
            body: JSON.stringify({ email: data.email, password: data.password }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            toast.success("Logged in successfully");
            router.push("/");
            router.refresh();
        } else if (response.status === 401 || response.status === 403) {
            toast.error("Invalid email or password.");
        } else {
            toast.error("Failed to log in. Please try again.");
        }
    }

    return (
        <div className="flex justify-center items-center h-[68vh]">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Login form</CardTitle>
                    <CardDescription>Fill the form to log in</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                                                        type="button"
                                                    >
                                                        {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
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
                        form="sign-in-form"
                        type="submit"
                        disabled={form.formState.isSubmitting || !form.formState.isValid}
                        className={`w-full ${form.formState.isValid && !form.formState.isSubmitting ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                    >
                        {form.formState.isSubmitting ? "Logging in..." : "Log in"}
                    </Button>

                    <div className="flex flex-col gap-2 items-center">
                        <Link href="/register" className="underline">Don&apos;t have an account?</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login
