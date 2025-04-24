export interface Item {
    id: number;
    name: string;
    stock: number;
    created_at?: string;
    send_notification: boolean;
}