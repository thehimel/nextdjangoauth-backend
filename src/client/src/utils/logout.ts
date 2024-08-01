import {logout} from "@/store/auth/actions/logout.ts";
import {AppDispatch} from "@/store/store.ts";
import {toast} from "sonner";

export const handleLogout = async (dispatch: AppDispatch) => {
  try {
    const response = await dispatch(logout());

    if (response.success) {
      toast.success("Logged out successfully.");
    } else {
      toast.error(response.errors?.message || "An error occurred during logout.");
    }
  } catch (error) {
    toast.error("An unexpected error occurred.");
  }
};
