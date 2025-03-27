import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SO Inventory",
  description: "Product Management",
};

export default function SignIn() {
  return <SignInForm />;
}
