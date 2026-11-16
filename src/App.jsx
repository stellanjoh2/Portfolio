import { lazy, Suspense } from "react";
import { HoldingPage } from "./holding/HoldingPage.jsx";

/** Temporary public holding page. Flip to false to restore the TextFX editor/stage. */
const HOLDING_PAGE = true;

const Editor = lazy(() => import("./Editor.jsx").then((m) => ({ default: m.Editor })));

export function App() {
  if (HOLDING_PAGE) return <HoldingPage />;
  return (
    <Suspense fallback={null}>
      <Editor />
    </Suspense>
  );
}
