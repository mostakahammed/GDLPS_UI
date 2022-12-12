import { toast } from "react-toastify";
import { ToasterTypeConstants } from "./GlobalConstrants";

export class Toaster {
  static Notify = (option = ToasterOption) => {
    if (option.type === ToasterTypeConstants.Success) {
      toast.success(option.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (option.type === ToasterTypeConstants.Warning) {
      toast.warning(option.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (option.type === ToasterTypeConstants.Error) {
      toast.error(option.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.info(option.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
}

const ToasterOption = {
  type: "success" | "warning" | "error",
  message: "",
};
