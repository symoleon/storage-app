import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Modal, Portal, Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { fetchItemsByUserId } from "@/lib/item";
import { useUser } from "@/lib/context/UserContext";
import { addOrder, fetchAllOrders } from "@/lib/order";

export default function OrderPage() {
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState("1");
  const [quantity, setQuantity] = useState("0");
  const [items, setItems] = useState<Array<any>>([]);
  const user = useUser();
  const [orders, setOrders] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemsByUserId(user).then((data) => {
      setSelectedProduct(data[0].id);
      setItems(data);
    })
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAllOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return (
    <View>
      <Portal>
        <Modal 
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Text>Dodaj zamównienie</Text>
          <Picker
            selectedValue={selectedProduct}
            onValueChange={(itemValue) => setSelectedProduct(itemValue)}
          >
            {items.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} />
            ))}
          </Picker>
          <TextInput
            label="Ilość"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Button mode="contained" onPress={() => {
            addOrder(selectedProduct, parseInt(quantity)).then((data) => {
              setOrders((prev) => [...prev, data]);
              setModalVisible(false);
              setSelectedProduct(items[0].id);
              setQuantity("0");
            });
          }}>
            Dodaj
          </Button>
        </Modal>
      </Portal>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
            <Text>Przedmiot: {item.item.name}</Text>
            <Text>Ilość: {item.count}</Text>
          </View>
        )}
        refreshing={loading}
        onRefresh={() => {
          setLoading(true);
          fetchAllOrders().then((data) => {
            setOrders(data);
            setLoading(false);
          });
        }}
      />
      <Button mode="contained" onPress={() => setModalVisible(true)} style={{ margin: 20 }}>
        Dodaj zamówienie
      </Button>
    </View>
  );
}
