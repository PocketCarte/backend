export interface Order {
    id: string;
    table_id: string;
    table_name?: string;
    waiter_id?: string;
    description: string;
    category_id: string;
    product_id: string;
    product_name: string;
    product_quantity: number;
    price_unity: number;
    price_total: number;
    created_at: string;
    status: string;
}