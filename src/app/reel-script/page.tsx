'use client';

import { Suspense } from "react";
import ReelScriptGeneratorPage from "./ReelScriptGeneratorPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReelScriptGeneratorPage />
    </Suspense>
  );
}
