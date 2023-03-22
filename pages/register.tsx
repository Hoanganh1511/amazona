import Layout from "@/components/Layout";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
type FormValues = {
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
};
function RegisterScreen() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  useEffect(() => {
    if (session?.user) {
      router.push(redirect ? redirect.toString() : "/");
    }
  }, [router, session, redirect]);
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, email, password } = data;
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (err: any) {
      toast.error(getError(err));
    }
  };
  if (session) {
    return (
      <>
        Signed in as {session.user!.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <Layout title="Login">
      <form className="mx-auto w-500" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="mb-5 mt-5 text-2xl inline-block"> Create Account</h1>
        <div className="flex flex-col gap-3 mb-5">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="w-1/4 px-2 border-black-500 border-2"
            autoFocus
            {...register("name", { required: "Please enter name" })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className=" flex flex-col gap-3 mb-5">
          <label className="w-20" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
                message: "Vui lòng nhập cú pháp hợp lệ",
              },
            })}
            className="w-1/4 px-2 border-black-500 border-2"
            id="email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4 flex-col flex gap-3">
          <label className="w-20" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter password",
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
            className="w-1/4 px-2 border-black-500 border-2"
            id="password"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="mb-4 flex-col flex gap-3">
          <label className="w-20" htmlFor="password">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("password"),
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
            className="w-1/4 px-2 border-black-500 border-2"
            id="confirmPassword"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <p className="text-red-500">Password do not match</p>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Register</button>
        </div>
        <div className="mb-4">
          Do not have an account ?{" "}
          <Link href={`/register?redirect=${redirect || "/"}`}>
            <p className="font-semibold inline-block underline hover:text-blue-400">
              Register
            </p>
          </Link>
        </div>
      </form>
    </Layout>
  );
}

export default RegisterScreen;
