import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { Switch } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ChangeAccessSwitch from "@/components/changeAccessSwitch";

export default function AccessPage() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUsers().then((data) => {
      const mapped = data.map((user) => {
        return {
          id: user.id,
          name: user.name,
          haveAccess: user.item.some((item) => Number(item.id) === Number(productId)),
        }
      })
      console.log("Mapped users:", mapped);
      setUsers(mapped);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });
  }, []);
  return (
    <View>
      <FlatList 
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text>{item.name}</Text>
            <ChangeAccessSwitch userId={item.id} productId={productId} haveAccess={item.haveAccess} />
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", padding: 20 }}>Brak użytkowników</Text>}
      />
    </View>
  );
}

async function fetchUsers() {
  const { data, error } = await supabase
    .from("user")
    .select("id, name, item (id, name, stock)")
    .order("id", { ascending: true });
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data;
}

