import {
  ChakraProvider,
  extendTheme,
  type ThemeConfig,
  baseTheme
} from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { MultiSelectTheme } from "./components/multi-select";
import { StepperTheme } from "./components/stepper";
import { SaasProvider, theme as sassTheme } from '@saas-ui/react'

// const config: ThemeConfig = {
//   initialColorMode: "dark",
//   useSystemColorMode: false
// }

// const theme = extendTheme({config})

const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme,
    Stepper: StepperTheme
  },
  colors: {
    primary: baseTheme.colors.cyan,
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
  sassTheme
});


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <ChakraProvider theme={theme}>
    <SaasProvider>
      <App />
    </SaasProvider>
  </ChakraProvider>
  // </React.StrictMode>
);
