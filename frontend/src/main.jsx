import React from "react";
import ReactDOM from "react-dom/client";
import WalletComponent from "./Wallet";

const App = () => {
  return (
    <div>
      <WalletComponent />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
