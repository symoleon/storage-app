import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Switch, Button, TextInput, Text } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

type Props = {
  id: string;
  name: string;
  stock: number;
  send_notification: boolean;
};

export default function ItemForm(props: Props) {
  const router = useRouter();
  const [name, setName] = useState(props.name);
  const [stock, setStock] = useState(props.stock.toString());
  const [sendNotification, setSendNotification] = useState(props.send_notification);

  function updateProduct() {
    supabase.from("item").update({ name, stock: parseInt(stock), send_notification: sendNotification }).eq("id", props.id).then(({ error }) => {
      if (error) {
        console.error("Error updating product:", error);
      } else {
        console.log("Product updated successfully");
        router.navigate("/");
        router.reload();
      }
    });
  }

  return (
    <View style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <TextInput label="Nazwa" mode="flat" value={name} onChangeText={setName} />
      <TextInput label="Stan magazynowy" mode="flat" value={stock} onChangeText={setStock} keyboardType="numeric" />
      <View style={styles.switchContainter}>
        <Text style={styles.switchLabel} variant="labelLarge">Powiadomienie o niskim stanie</Text>
        <Switch value={sendNotification} onValueChange={setSendNotification} />
      </View>
      <Button mode="contained" onPress={() => router.navigate(`/product/${props.id}/access`)}>
        Edytuj dostęp
      </Button>
      <Button mode="contained" onPress={() => updateProduct()}>
        Zapisz
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  switchContainter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  switchLabel: {
    color: "#000",
  },
});