import { TableRequest } from "./table_request";

export interface Table {
    id?: string;
    qr_code?: string;
    status: number;
    name: string;
    table_requests?: TableRequest[];
    orders?: any;
}