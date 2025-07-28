// Importing from Urils
import { logout } from "./auth";

export const LogoutPage = (navigate) => {
  logout();
  navigate("/login-BukuTamu");
};
