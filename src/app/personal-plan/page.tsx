import React, { Suspense } from "react";
import PersonalPlanClient from "./PersonalPlanClient";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Suspense fallback={<div className="p-6 text-center text-lg text-gray-300">Зареждане...</div>}>
        <PersonalPlanClient />
      </Suspense>
    </div>
  );
}
