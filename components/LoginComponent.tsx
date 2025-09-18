"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import React, { Suspense } from "react";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";

import { useSearchParams } from "next/navigation";

import InputFieldComponent from "@/component-login/InputFieldComponent";
import Image from "next/image";
import useIsMobile from "@/hook/useIsMobile";
import { ImageSpinner } from "@/hook/ImageSpinner";
import { GoogleIcon } from "@/component-login/GoogleIcon";
import { LoginValidationFormData } from "@/app/lib/validations/loginValidation";
import { getError } from "@/app/lib-true/error";

export default function LoginComponent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const isMobile = useIsMobile();

  /*  useEffect(() => {
    if (session?.user) {
      console.log({ youyou: session?.user });
      console.log("lolo");
      router.push(redirect || "/");
    }
  }, [router, session, redirect]); */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidationFormData>({
    //resolver: zodResolver(LoginValidationSchema),
  });

  const submitHandler = async ({
    email,
    password,
  }: LoginValidationFormData) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <div
      className={`h-screen w-screen ${
        isMobile ? "flex items-center justify-center p-2" : "grid grid-cols-2"
      }  bg-white`}
    >
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col w-full p-3 md:w-[500px] ">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-bold sm:text-2xl ">Se connecter</p>
            <p className="text-[12px] sm:text-[14px] ">
              Entrez vos coordonnées ci-dessous
            </p>
          </div>

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col w-full gap-2 mt-[20px] items-center"
          >
            <InputFieldComponent
              id="email"
              label="Email"
              type="email"
              register={register}
              errors={errors}
            />

            <InputFieldComponent
              id="password"
              label="Password"
              type="password"
              register={register}
              errors={errors}
            />

            <div className="flex flex-col gap-4 mt-[40px] items-center w-full">
              <button
                type="submit"
                className="bg-[#DB4444] text-center text-white text-[16px] sm:text-xl w-full border-none py-2 cursor-pointer "
              >
                Se connecter
              </button>
              <button
                type="button"
                className="bg-[white] text-center flex items-center justify-center gap-2 text-black text-[16px] sm:text-xl w-full border border-solid border-[#6969699f] py-2 cursor-pointer "
              >
                <GoogleIcon width={25} height={25} />{" "}
                <span>Se connecter avec Google</span>
              </button>
            </div>

            <div className="mt-4 w-full text-center">
              Tu n&apos;as pas encore un compte? &nbsp;
              <Link
                href={`/register?redirect=${redirect || "/"}`}
                className="text-[#DB4444] underline "
              >
                Inscrit-toi ici
              </Link>
            </div>
          </form>
        </div>
      </div>
      {!isMobile && (
        <ImageSpinner url="/image/login-image.jpg">
          <Image
            src="/image/login-image.jpg"
            alt=""
            width={640}
            height={426}
            className="object-contain w-full "
          />
        </ImageSpinner>
      )}
    </div>
  );
}
