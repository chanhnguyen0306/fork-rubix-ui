import { Outlet, useLocation } from "react-router-dom";

function ConnectionPage() {
  const location = useLocation();

  return <Outlet key={location.pathname} />;
}

export default ConnectionPage;
