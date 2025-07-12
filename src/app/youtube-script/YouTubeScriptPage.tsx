"use client";

import { Suspense } from "react";
import { YoutubeScriptGeneratorPage } from "./YoutubeScriptGenerator";

export default function YouTubeScriptPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <YoutubeScriptGeneratorPage />
    </Suspense>
  );
}
