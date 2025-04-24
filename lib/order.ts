import { supabase } from "./supabase";

export async function fetchAllOrders() {
    const { data, error } = await supabase
        .from("order")
        .select("*, item(*)")
        .order("id", { ascending: true });
    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
    return data;
}

export async function addOrder(productId: string, quantity: number) {
    const { data, error } = await supabase
        .from("order")
        .insert([
            { item: productId, count: quantity }
        ])
        .select()
        .single();
    const { data: orderData, error: orderError } = await supabase
        .from("order")
        .select("*, item(*)")
        .eq("id", data.id)
        .single();
    if (error) {
        console.error("Error adding order:", error);
        return null;
    }
    return orderData;
}