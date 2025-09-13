import React from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";

interface InputFieldComponentProps {
  id: string;
  label: string;
  type?: string;

  errors: FieldErrors<{
    email: string;
    password: string;
    name?: string;
    confirmPassword?: string;
    message?: string;
    phone?: string;
  }>;

  register?: UseFormRegister<{
    email: string;
    password: string;
  }>;
  register1?: UseFormRegister<{
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
  }>;
  register2?: UseFormRegister<{
    email: string;
    message?: string | undefined;
    name: string;
    phone: string;
  }>;
  getValues?: UseFormGetValues<{
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
  }>;
}

const InputFieldComponent: React.FC<InputFieldComponentProps> = ({
  id,
  label,
  type = "text",
  errors,
  register,
  register1,
  register2,
  getValues,
}) => {
  let val: any;
  if (!!register) {
    val =
      type === "email"
        ? {
            ...register("email", {
              required: "Please enter email",

              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            }),
          }
        : {
            ...register("password", {
              required: "Please enter password",
              minLength: {
                value: 6,
                message: "Password is more than 5 chars",
              },
            }),
          };
  } else if (register1 && getValues) {
    val =
      id === "email"
        ? {
            ...register1("email", {
              required: "Please enter email",

              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            }),
          }
        : id === "password"
        ? {
            ...register1("password", {
              required: "Please enter password",
              minLength: {
                value: 6,
                message: "Password is more than 5 chars",
              },
            }),
          }
        : id === "name"
        ? {
            ...register1("name", {
              required: "Please enter name",
            }),
          }
        : {
            ...register1("confirmPassword", {
              required: "Please enter confirmPassword",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "confirm password is more than 5 chars",
              },
            }),
          };
  } else if (register2) {
    val =
      id === "email"
        ? {
            ...register2("email", {
              required: "Please enter email",

              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            }),
          }
        : id === "password"
        ? {
            ...register2("phone", {
              required: "Please enter phone number",
            }),
          }
        : id === "name"
        ? {
            ...register2("name", {
              required: "Please enter name",
            }),
          }
        : {
            ...register2("message", {
              required: "Please enter confirmPassword",
            }),
          };
  }

  return (
    <div className="relative mt-6 w-full">
      <input
        id={id}
        type={type}
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-2 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
        placeholder=" "
        {...val}
      />
      <label
        htmlFor={id}
        className="absolute cursor-text top-3 left-2 z-10 origin-[0] -translate-y-8 scale-65 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-95 peer-focus:text-blue-500"
      >
        {label}
      </label>
      {id === "email"
        ? errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )
        : id === "name"
        ? errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )
        : id === "confirmPassword"
        ? errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )
        : id === "message"
        ? errors.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.message.message}
            </p>
          )
        : id === "phone"
        ? errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )
        : errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
    </div>
  );
};

export default InputFieldComponent;
