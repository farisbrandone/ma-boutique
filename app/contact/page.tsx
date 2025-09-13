"use client";

import { LetterIcon } from "@/component-contact/LetterIcon";
import { PhoneIcon } from "@/component-contact/PhoneIcon";
import { ContactValidationFormData } from "../lib/validations/contactValidation";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { getError } from "../lib-true/error";
import InputFieldComponent from "@/component-login/InputFieldComponent";
import TextAreaFieldComponent from "@/component-login/TextAreaFieldComponent";
import Header from "@/component-home/HeaderHome";

export default function page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValidationFormData>({
    //resolver: zodResolver(LoginValidationSchema),
  });

  const submitHandler = async ({
    email,
    name,
    phone,
    message,
  }: ContactValidationFormData) => {
    try {
      console.log({ email, name, phone, message });
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <div className=" mx-auto flex flex-col w-screen xl:max-w-7xl min-h-screen p-0">
      <Header />
      <div className="flex-1 flex p-3   items-center w-full max-md:mt-[80px] ">
        <div className="flex flex-col gap-2 sm:flex-row w-full">
          <div className="flex flex-col gap-3 items-start">
            <div className="flex flex-col gap-2  sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#bd4444]  ">
                  <PhoneIcon color="white" className="text-[22px] " />
                </div>
                <p className="text-[16px] font-bold ">Appeler nous</p>
              </div>
              <div className="text-[16px] flex-col ">
                <p className="font-bold">
                  Nous sommes disponible 24/7, 7 jours de la semaines
                </p>
                <p>Telephone: +237 6 50 08 96 83</p>
              </div>
              <div className="h-[1px]  w-full bg-[#7c7a7ac4] " />
            </div>
            <div className="flex flex-col gap-2  sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#bd4444]  ">
                  <LetterIcon color="white" className="text-[22px] " />
                </div>
                <p className="text-[16px] font-bold ">Ecriver nous</p>
              </div>
              <div className="text-[16px] flex-col ">
                <p className="font-bold">
                  Remplissez notre formulaire et nous vous contacterons dans les
                  24 heures.
                </p>
                <p>Email: f.pamod@outlook.com</p>
                <p className="text-[16px]">Email: farisbrandone@yahoo.com</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex-col">
            <form
              className="flex flex-col "
              onSubmit={handleSubmit(submitHandler)}
            >
              <div className="flex items-center gap-1  md:gap-3  flex-col sm:flex-row">
                <InputFieldComponent
                  id="name"
                  label="Nom"
                  type="text"
                  register2={register}
                  errors={errors}
                />
                <InputFieldComponent
                  id="email"
                  label="Email"
                  type="email"
                  register2={register}
                  errors={errors}
                />

                <InputFieldComponent
                  id="phone"
                  label="Telephone"
                  type="text"
                  register2={register}
                  errors={errors}
                />
              </div>

              <TextAreaFieldComponent
                id="message"
                label="Message"
                type="text"
                register2={register}
                errors={errors}
              />

              <div className="w-full flex justify-end items-center mt-[20px] pr-2 ">
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#bd4444] text-white cursor-pointer "
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
