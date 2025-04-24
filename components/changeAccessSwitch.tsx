import { Switch } from "react-native-paper";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ChangeAccessSwitch({ userId, productId, haveAccess }: { userId: string; productId: string; haveAccess: boolean }) {
  const [isEnabled, setIsEnabled] = useState(haveAccess);

  const toggleSwitch = async (value: boolean) => {
    setIsEnabled(value);
    try {
      await userAccessChangeHandler(userId, productId, value);
    } catch (error) {
      console.error("Error changing access:", error);
    }
  };

  return (
    <Switch value={isEnabled} onValueChange={toggleSwitch} />
  );
}

async function userAccessChangeHandler(userId: string, productId: string, haveAccess: boolean) {
  let result;
  if (haveAccess) {
    result = await supabase.from("user_item").insert({ user_id: userId, item_id: productId });
  } else {
    result = await supabase.from("user_item").delete().match({ user_id: userId, item_id: productId });
  }
  if (result.error) {
    console.error("Error updating user access:", result.error);
  }
}