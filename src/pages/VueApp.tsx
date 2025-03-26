
import React, { useEffect } from "react";

const VueApp = () => {
  useEffect(() => {
    // Redirect to Vue HTML page
    window.location.href = "/vue.html";
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Vue application...</p>
    </div>
  );
};

export default VueApp;
