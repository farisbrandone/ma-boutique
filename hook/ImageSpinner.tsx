"use client";

import { useEffect, useState } from "react";

export const ImageSpinner = ({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  //const session = useSession();

  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => setImageLoaded(true);
  }, []);

  if (!imageLoaded) {
    return (
      <div className="flex items-center justify-center bg-[#CBE4E8] p-5 w-full h-full  rounded-lg overflow-hidden animate-pulse">
        <div className="h-full w-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-[white] p-5 w-full  ">
      {children}
    </div>
  );
};
