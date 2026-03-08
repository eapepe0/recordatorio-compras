import ReactDOM from "react-dom/client";
/* import { registerSW } from "virtual:pwa-register"; */
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

/* registerSW({ immediate: true }); */

ReactDOM.createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
);