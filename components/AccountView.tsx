"use client";

import {useAuth} from "@/components/auth/auth-provider";
import {useRouter} from "next/navigation";

export default function AccountView() {
  const {user, loading, signOut} = useAuth();
  console.log("User:", user)
  const router = useRouter();

  async function handleSignOut() {
    try {
      await signOut();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  if (loading) {
    return <span>Loading...</span>;
  }
  if (!user) {
    return (
      <button
        className={"rounded-lg border border-gray-200 p-2 hover:bg-gray-50"}
        onClick={() => {
          window.location.href = '/auth/sign-in'
        }}
      >Sign In</button>
    )
  }

  return (
    <div className={'flex justify-center items-center gap-2'}>
      <span>
        {user.email ?? user.id}
      </span>
      <button
        className={"rounded-lg border border-gray-200 p-2 hover:bg-gray-50"}
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}