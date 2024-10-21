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
import { toast } from "react-hot-toast";
import { signInSchema } from "@/schemas/signinschema";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";

// Define error messages for different status codes
const ERROR_MESSAGES = {
  default: "An unexpected error occurred. Please try again.",
};

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form with zod resolver and default values
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email_address: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email_address: data.email_address,
        password: data.password,
      });

      if (result?.error) {
        // Handle error from backend
        const errorData = JSON.parse(result.error);
        toast.error(errorData.message);
      } else if (result?.ok) {
        // Handle successful login
        toast.success("Logged in successfully!");
        router.replace("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(ERROR_MESSAGES.default);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Header section */}
          <header className="mb-8">
            <Link href="#" className="flex items-center gap-1 mb-5">
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt="9sign logo"
                priority
              />
              <h1 className="text-2xl sm:text-[26px] font-ibm-plex-serif font-extrabold tracking-tight text-gray-900">
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

          {/* Sign-in form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email input field */}
              <FormField
                control={form.control}
                name="email_address"
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

              {/* Password input field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      {/* Toggle password visibility */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button */}
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
