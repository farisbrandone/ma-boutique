import LoginComponent from "@/components/LoginComponent";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div> Lodaing...</div>}>
      <LoginComponent />{" "}
    </Suspense>
  );
}
