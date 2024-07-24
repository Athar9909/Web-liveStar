import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { state } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state]);

  return null;
}
