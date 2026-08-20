import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./app.css";
import { Layout } from "./layout";
import Home from "./pages/home";
import AntragNachweiseV1 from "./pages/v1/antrag-nachweise";
import AntragNachweiseV2 from "./pages/v2/antrag-nachweise";
import AntragNachweiseV3 from "./pages/v3/antrag-nachweise";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/v1/antrag/nachweise" element={<AntragNachweiseV1 />} />
        <Route path="/v2/antrag/nachweise" element={<AntragNachweiseV2 />} />
        <Route path="/v3/antrag/nachweise" element={<AntragNachweiseV3 />} />
        <Route
          path="/antrag/nachweise"
          element={<Navigate to="/v1/antrag/nachweise" replace />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
