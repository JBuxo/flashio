import { supabaseClient } from "../client";

export const signOut = async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("Signed out successfully");
  }
};
