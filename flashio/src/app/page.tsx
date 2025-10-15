import { supabase } from "@/supabase/client";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No User Found");
  }

  return (
    <div>
      <pre>user: {user?.email}</pre>
    </div>
  );
}
