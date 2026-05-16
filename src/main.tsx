import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router";
import App from "./App.tsx";
import LoadingScreen from "./components/loading/Loading.tsx";
import MainScreen from "./components/main/Main.tsx";
import RouteComponent from "./components/route/route.tsx"
import CargoComponent from "./components/cargo/cargo.tsx";
import DateComponent from "./components/date/date.tsx";
import PhoneComponent from "./components/phone/phone.tsx";
import FinalComponent from "./components/final/final.tsx";
import HomeScreen from "./components/home/Home.tsx";
import OrdersScreen from "./components/orders/Orders.tsx";
import ProfileScreen from "./components/profile/Profile.tsx";
import DocumentsScreen from "./components/documents/Documents.tsx";
import BranchesScreen from "./components/branches/Branches.tsx";
import "./index.css";
import { DisplayGate, SDKInitOptions, SDKProvider } from "@tma.js/sdk-react";
import { SDKProviderError } from "./components/sdk/SDKError.tsx";
import { SDKProviderLoading } from "./components/sdk/SDKLoading.tsx";
import { SDKInitialState } from "./components/sdk/SDKInit.tsx";


const options: SDKInitOptions = {
  acceptCustomStyles: true,
  cssVars: true,
  async: true,
};



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <BrowserRouter>
        <SDKProvider options={options}>
          <DisplayGate error={SDKProviderError} loading={SDKProviderLoading} initial={SDKInitialState}>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/loading" element={<LoadingScreen />} />
                <Route path="/main" element={<MainScreen />} />
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/orders" element={<OrdersScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/documents" element={<DocumentsScreen />} />
                <Route path="/branches" element={<BranchesScreen />} />
                <Route path="route" element={<RouteComponent />} />
                <Route path="/date" element={<DateComponent />} />
                <Route path="/cargo" element={<CargoComponent />} />
                <Route path="/phone" element={<PhoneComponent />} />
                <Route path="/final" element={<FinalComponent />} />
            </Routes>
          </DisplayGate>
        </SDKProvider>
      </BrowserRouter>
  </React.StrictMode>
);
