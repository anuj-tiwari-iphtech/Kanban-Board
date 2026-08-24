import { useEffect } from "react";
import { HiX, HiOutlineExclamation } from "react-icons/hi";
import "./AlertModal.css";

export default function AlertModal({ message, onClose, type = "warning" }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);   // 3 second baad khud band ho jayega

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="alert-toast">
      <HiOutlineExclamation className={`alert-icon ${type}`} />
      <p className="alert-message">{message}</p>
      <HiX className="alert-close" onClick={onClose} />
    </div>
  );
}