import { Navigate, Route } from "react-router-dom";

export default function IncomeScreenGuardRoute({ path, element }) {
  const isSetup = localStorage.getItem("paymentFreq");
  return isSetup !== null ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/setup" />
  );
}
