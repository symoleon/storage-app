import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { UserProvider } from "@/lib/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Lista dostępnych materiałów", headerShown: false, statusBarStyle: "dark" }} />
          <Stack.Screen name="product/[productId]" options={{ title: "Edytuj produkt", headerShown: true, statusBarStyle: "dark" }} />
          <Stack.Screen name="account" options={{ title: "Wybierz Konto", headerShown: true, statusBarStyle: "dark" }} />
          <Stack.Screen name="product/[productId]/access" options={{ title: "Edytuj dostęp", headerShown: true, statusBarStyle: "dark" }} />
          <Stack.Screen name="order" options={{ title: "Zamówienia", headerShown: true, statusBarStyle: "dark" }} />
          <Stack.Screen name="consumption" options={{ title: "Zużycia", headerShown: true, statusBarStyle: "dark" }} />
        </Stack>
      </PaperProvider>
    </UserProvider>
  );
}
