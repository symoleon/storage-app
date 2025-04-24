import { supabase } from "./supabase";

export async function fetchAllConsumptions() {
    const { data, error } = await supabase
        .from("consumption")
        .select("*, item(*)")
        .order("id", { ascending: true });
    if (error) {
        console.error("Error fetching consumptions:", error);
        return [];
    }
    return data;
}

export async function addConsumption(productId: string, quantity: number) {
    const { data, error } = await supabase
        .from("consumption")
        .insert([
            { item: productId, count: quantity }
        ])
        .select()
        .single();
    const { data: consumptionData, error: consumptionError } = await supabase
        .from("consumption")
        .select("*, item(*)")
        .eq("id", data.id)
        .single();
    if (error) {
        console.error("Error adding consumption:", error);
        return null;
    }
    return consumptionData;
}