"use client";

import CarouselDashboard from "@/components/CarouselDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full flex flex-col items-center ">
        <CarouselDashboard />
      </div>
    </QueryClientProvider>
  );
}
