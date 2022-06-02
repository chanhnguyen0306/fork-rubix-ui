import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import "./style.css";
import App from "./App";


import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
