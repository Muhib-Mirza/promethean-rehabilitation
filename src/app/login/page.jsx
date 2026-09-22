import { LoginScreen } from "@/components/modules/auth/LoginScreen";

export const metadata = {
  title: "Sign In | Promethean Rehabilitation",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const from = params?.from;
  const redirectTo = typeof from === "string" && from.startsWith("/") ? from : "/";

  return <LoginScreen redirectTo={redirectTo} />;
}
