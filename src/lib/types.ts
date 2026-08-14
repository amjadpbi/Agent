export interface Product {
    id: string;
    name: string;
}

export interface Supplier {
    id: string;
    name: string;
}

export interface InvoiceItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    total: number;
}

export interface Invoice {
    id: string;
    supplierId: string;
    supplierName: string;
    invoiceNumber: string;
    date: string;
    items: InvoiceItem[];
    totalAmount: number;
}

export type SchemaDataType = 'Text' | 'Date' | 'Integer' | 'Decimal' | 'Currency' | 'Boolean';

export interface SchemaField {
    id: string;
    name: string;
    type: SchemaDataType;
    required: boolean;
}

export interface LedgerSchema {
    id: string;
    name: string;
    fields: SchemaField[];
}

export interface MappedRecord {
    id: string;
    sourceInvoiceId?: string; // To link back to the original extraction
    data: Record<string, any>; // Key: SchemaField.name, Value: extracted val
}
