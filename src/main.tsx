import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import GoogleMapsProvider from "@/contexts/GoogleMapsProvider"; // Check if path is correct or adjusting
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <GoogleMapsProvider>
        <App />
    </GoogleMapsProvider>
);
