import { createRoot } from "react-dom/client";
import { KeysApp } from "./KeysApp.jsx";
import "../editor.css";
import "./keys.css";

createRoot(document.getElementById("root")).render(<KeysApp />);
