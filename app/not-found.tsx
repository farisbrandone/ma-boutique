import Header from "@/component-home/HeaderHome";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" mx-auto flex flex-col w-screen xl:max-w-7xl min-h-screen p-0">
      <Header />
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center  bg-gray-100 text-black">
        <div className="flex flex-col gap-5">
          <p className="text-3xl sm:text-5xl font bold text-center">
            404 Not Found
          </p>
          <p className="text-[16px] text-center ">
            La page que vous recherchée n'a pas été trouvée. Vous pouvez aller à
            la page d'accueil.
          </p>
        </div>
        <Link
          href="/home"
          className="px-6 py-3 bg-[#bd4444] text-white rounded-lg mt-[20px] "
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
