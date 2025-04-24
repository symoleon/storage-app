import { supabase } from "./supabase";

export async function fetchAllItems() {
    const { data, error } = await supabase
    .from("item")
    .select("*")
    .order("id", { ascending: true });
    if (error) {
        console.error("Error fetching items:", error);
        return [];
    }
    return data;
}

export async function fetchItemsByUserId(userId: string) {
    if (userId === "0") {
        return await fetchAllItems();
    }
    const { data, error } = await supabase
    .from("item")
    .select("*, user(id)")
    .order("id", { ascending: true });
    if (error) {
        console.error("Error fetching items by user ID:", error);
        return [];
    }
    return data
        .filter((item) => item.user.some((user: any) => user.id === userId))
        .map((item) => ({
            id: item.id,
            name: item.name,
            stock: item.stock,
            send_notification: item.send_notification,
    }));
}