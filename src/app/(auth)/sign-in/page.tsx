"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signInSchema } from "@/schemas/signinschema";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error(
          result.error === "CredentialsSignin"
            ? "Incorrect email or password"
            : result.error
        );
      } else if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <header className="mb-8">
            <Link href="/" className="flex items-center gap-1 mb-5">
              <Image
                src="/logo.png"
                width={34}
                height={34}
                alt="9sign logo"
                priority
              />
              <h1 className="text-2xl sm:text-[26px] font-ibm-plex-serif font-bold text-gray-900">
                9 SIGN
              </h1>
            </Link>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
              Sign In
            </h2>
            <p className="text-sm sm:text-base font-normal text-gray-600">
              Please enter your details
            </p>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white hover:bg-primary/90 transition-colors font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Right side: Image placeholder */}
      <div className="hidden lg:block w-1/2 bg-primary">
        {/* Image will be placed here later */}
      </div>
    </section>
  );
};

export default SignInForm;
