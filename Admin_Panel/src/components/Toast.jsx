// Toast.jsx
import { toast } from 'react-toastify';

export default function useToast() {
  const show = (message, type = 'default') => {
    toast[type] ? toast[type](message) : toast(message);
  };
  return { show };
}
