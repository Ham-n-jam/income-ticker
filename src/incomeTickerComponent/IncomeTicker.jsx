import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import IncomeScreen from "./IncomeScreen";
import SetupScreen from "./setup/SetupScreen";

export default function IncomeTicker() {
  return (
    <HashRouter basename={"/income-ticker"}>
      <Routes>
        <Route path="/" element={<IncomeScreen />} />
        <Route path="/setup" element={<SetupScreen />} />
      </Routes>
    </HashRouter>
  );
}
