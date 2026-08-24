import { createContext, useContext, useState } from "react";
import AlertModal from "./AlertMOdal";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("warning");

  const showAlert = (message, type = "warning") => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const hideAlert = () => {
    setAlertMessage("");
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertMessage && (
        <AlertModal message={alertMessage} type={alertType} onClose={hideAlert} />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}