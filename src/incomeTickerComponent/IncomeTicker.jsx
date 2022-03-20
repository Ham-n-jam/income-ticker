import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IncomeScreen from "./IncomeScreen";
import SetupScreen from "./setup/SetupScreen";

export default function IncomeTicker() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IncomeScreen />} />
        <Route path="/setup" element={<SetupScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
