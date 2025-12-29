"use client";

import { articleContent } from "./article";

export default function Home() {
  return (
    <main>
      <div dangerouslySetInnerHTML={{ __html: articleContent }} />
    </main>
  );
}
