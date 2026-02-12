import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Extracts pathname property from the current location
  const { pathname } = useLocation();

  useEffect(() => {
    // Automatically scrolls to top-left corner of the browser
    window.scrollTo(0, 0);
  }, [pathname]); // Triggered every time the route changes

  return null;
};

export default ScrollToTop;