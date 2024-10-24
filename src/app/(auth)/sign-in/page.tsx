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
// import { toast } from "react-hot-toast";
import { signInSchema } from "@/schemas/signinschema";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as z from "zod";

// Define error messages for different scenarios
const ERROR_MESSAGES = {
  default: "An unexpected error occurred. Please try again.",
};

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useCustomToast();

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
    // Attempt to sign in using NextAuth
    const result = await signIn("credentials", {
      redirect: false,
      email_address: data.email_address,
      password: data.password,
    });

    if (result?.error) {
      // Handle error from backend
      const errorData = JSON.parse(result.error);
      toast.error({ message: errorData.message });
    } else if (result?.ok) {
      // Handle successful login
      toast.success({ message: "Logged in successfully!" });
      router.replace("/");
    }
    setIsLoading(false)
  };

  return (
    <section className="flex min-h-screen bg-gray-100">
      {/* Left side: Sign-in form */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white shadow-lg">
        <div className="max-w-md w-full mx-auto">
          {/* Header section */}
          <header className="mb-10">
            <Link href="#" className="flex items-center gap-2 mb-6">
              <Image
                src="/logo.png"
                width={48}
                height={48}
                alt="9sign logo"
                priority
              />
              <h1 className="text-2xl sm:text-4xl font-ibm-plex-serif font-extrabold tracking-tight text-gray-900">
                9 SIGN
              </h1>
            </Link>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-base sm:text-lg font-medium text-gray-600">
              Please sign in to your account
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
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="py-2 px-4 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
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
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="py-2 px-4 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                      />
                      {/* Toggle password visibility button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-500" />
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
                className="w-full bg-primary text-white hover:bg-primary/90 transition-colors font-semibold py-3 rounded-lg text-lg shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={24} className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          {/* Additional links */}
          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Decorative image */}
      <div className="hidden lg:block w-1/2 bg-primary relative">
        <div className="absolute inset-0 bg-opacity-70 bg-primary flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to 9 SIGN</h2>
            <p className="text-xl">Secure, fast, and reliable admin panel</p>
          </div>
        </div>
        <Image
          src="/signin-image.jpg"
          layout="fill"
          objectFit="cover"
          alt="Sign In Background"
          className="mix-blend-overlay"
        />
      </div>
    </section>
  );
};

export default SignInForm;
