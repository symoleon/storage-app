import { View, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Switch } from "react-native-paper";
import ItemForm from "@/components/ItemForm";

export default function ProductPage() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("item")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading || !product) {
    return <ActivityIndicator animating={true} size="large" color="#0000ff" />;
  }
  return (
    <View>
      <ItemForm id={product.id} name={product.name} stock={product.stock} send_notification={product.send_notification} />
    </View>
  )
}