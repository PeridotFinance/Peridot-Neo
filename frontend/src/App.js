import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import LoadingSpinnerPage from "./components/common/loading/LoadingSpinnerPage.js";

const LandingContainer = lazy(() =>
  import("./components/content/landing/LandingContainer.js")
);
const PeridotSwapContainer = lazy(() =>
  import("./components/content/peridotSwap/PeridotSwapContainer.js")
);
const IFOContainer = lazy(() =>
  import("./components/content/ifo/IFOContainer.js")
);
const InventoryContainer = lazy(() =>
  import("./components/content/inventory/InventoryContainer.js")
);
const NotFoundContainer = lazy(() =>
  import("./components/content/notFound/NotFoundContainer.js")
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinnerPage />}>
        <Routes>
          <Route exact path="/" element={<LandingContainer />} />

          <Route
            exact
            path="/peridot-swap"
            element={<PeridotSwapContainer />}
          />
          <Route exact path="/ifo" element={<IFOContainer />} />
          <Route exact path="/inventory" element={<InventoryContainer />} />

          <Route path="*" element={<NotFoundContainer />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
