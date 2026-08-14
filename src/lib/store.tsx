import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, LedgerSchema, MappedRecord, SchemaField } from './types';
import { generateMockInvoices } from '../data/mockData';

interface AppContextType {
    invoices: Invoice[]; // Keeping for legacy reference, but mostly we use getNormalizedInvoices()
    schemas: LedgerSchema[];
    activeSchemaId: string | null;
    mappedRecords: MappedRecord[];

    addInvoice: (inv: Invoice) => void;
    addSchema: (schema: LedgerSchema) => void;
    setActiveSchemaId: (id: string) => void;
    addMappedRecord: (record: MappedRecord) => void;
    getNormalizedInvoices: () => Invoice[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default demo schema matching legacy invoices data
const getDefaultSchema = (): LedgerSchema => {
    return {
        id: 'default-schema-1',
        name: 'Standard Ledger',
        fields: [
            { id: 'f1', name: 'InvoiceDate', type: 'Date', required: true },
            { id: 'f2', name: 'SupplierName', type: 'Text', required: true },
            { id: 'f3', name: 'InvoiceNo', type: 'Text', required: true },
            { id: 'f4', name: 'ProductName', type: 'Text', required: true },
            { id: 'f5', name: 'Quantity', type: 'Integer', required: true },
            { id: 'f6', name: 'PurchaseRate', type: 'Decimal', required: true },
            { id: 'f7', name: 'TotalAmount', type: 'Currency', required: true },
        ]
    };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [schemas, setSchemas] = useState<LedgerSchema[]>([]);
    const [activeSchemaId, setActiveSchemaId] = useState<string | null>(null);
    const [mappedRecords, setMappedRecords] = useState<MappedRecord[]>([]);

    useEffect(() => {
        // Load data from local storage
        const storedInvoices = localStorage.getItem('shopagent_invoices');
        const storedSchemas = localStorage.getItem('shopagent_schemas');
        const storedActiveSchemaId = localStorage.getItem('shopagent_active_schema_id');
        const storedMappedRecords = localStorage.getItem('shopagent_mapped_records');

        let currentInvoices: Invoice[] = [];
        if (storedInvoices) {
            currentInvoices = JSON.parse(storedInvoices);
            setInvoices(currentInvoices);
        } else {
            currentInvoices = generateMockInvoices();
            setInvoices(currentInvoices);
            localStorage.setItem('shopagent_invoices', JSON.stringify(currentInvoices));
        }

        let defaultSchemas: LedgerSchema[] = [];
        if (storedSchemas) {
            defaultSchemas = JSON.parse(storedSchemas);
            setSchemas(defaultSchemas);
        } else {
            defaultSchemas = [getDefaultSchema()];
            setSchemas(defaultSchemas);
            localStorage.setItem('shopagent_schemas', JSON.stringify(defaultSchemas));
        }

        if (storedActiveSchemaId) {
            setActiveSchemaId(storedActiveSchemaId);
        } else {
            setActiveSchemaId(defaultSchemas[0].id);
            localStorage.setItem('shopagent_active_schema_id', defaultSchemas[0].id);
        }

        if (storedMappedRecords) {
            setMappedRecords(JSON.parse(storedMappedRecords));
        } else {
            // Transform mock invoices to mapped records according to default schema
            const initialRecords: MappedRecord[] = [];
            currentInvoices.forEach(inv => {
                inv.items.forEach(item => {
                    initialRecords.push({
                        id: `rec-${Math.random()}`,
                        sourceInvoiceId: inv.id,
                        data: {
                            'InvoiceDate': inv.date,
                            'SupplierName': inv.supplierName,
                            'InvoiceNo': inv.invoiceNumber,
                            'ProductName': item.productName,
                            'Quantity': item.quantity,
                            'PurchaseRate': item.unitPrice,
                            'TotalAmount': item.total
                        }
                    });
                });
            });
            setMappedRecords(initialRecords);
            localStorage.setItem('shopagent_mapped_records', JSON.stringify(initialRecords));
        }
    }, []);

    const addInvoice = (inv: Invoice) => {
        const updated = [inv, ...invoices];
        setInvoices(updated);
        localStorage.setItem('shopagent_invoices', JSON.stringify(updated));
    };

    const addSchema = (schema: LedgerSchema) => {
        const updated = [...schemas, schema];
        setSchemas(updated);
        localStorage.setItem('shopagent_schemas', JSON.stringify(updated));
        if (!activeSchemaId) {
            setActiveSchemaId(schema.id);
            localStorage.setItem('shopagent_active_schema_id', schema.id);
        }
    };

    const setActiveSchemaIdHandler = (id: string) => {
        setActiveSchemaId(id);
        localStorage.setItem('shopagent_active_schema_id', id);
    };

    const addMappedRecord = (record: MappedRecord) => {
        const updated = [record, ...mappedRecords];
        setMappedRecords(updated);
        localStorage.setItem('shopagent_mapped_records', JSON.stringify(updated));
    };

    // Normalization layer for ShopAgent to use destination-mapped records
    const getNormalizedInvoices = (): Invoice[] => {
        // We group mapped records by something that looks like an invoice ID or supplier+date combination
        const invoiceMap: Record<string, Invoice> = {};

        mappedRecords.forEach(rec => {
            const d = rec.data;

            // Try to find semantic concepts
            const getField = (regex: RegExp) => {
                const key = Object.keys(d).find(k => regex.test(k.toLowerCase()));
                return key ? d[key] : undefined;
            };

            const supplier = getField(/supplier|vendor/) || 'Unknown Supplier';
            const invoiceNo = getField(/invoice[\s_]*no|invoice[\s_]*number/) || `INV-${Math.floor(Math.random() * 1000)}`;
            const date = getField(/date|time/) || new Date().toISOString().split('T')[0];
            const product = getField(/product|item|description/) || 'Unknown Item';
            const qty = Number(getField(/qty|quantity/)) || 1;
            const rate = Number(getField(/rate|price|unit/)) || 0;
            const total = Number(getField(/amount|total|sum/)) || (qty * rate);

            const groupKey = `${supplier}-${invoiceNo}-${date}`;

            if (!invoiceMap[groupKey]) {
                invoiceMap[groupKey] = {
                    id: rec.sourceInvoiceId || `gen-${groupKey}`,
                    supplierId: `sup-${supplier}`,
                    supplierName: String(supplier),
                    invoiceNumber: String(invoiceNo),
                    date: String(date),
                    items: [],
                    totalAmount: 0
                };
            }

            invoiceMap[groupKey].items.push({
                productId: `prod-${product}`,
                productName: String(product),
                quantity: qty,
                unitPrice: rate,
                tax: 0,
                total: total
            });
            invoiceMap[groupKey].totalAmount += total;
        });

        return Object.values(invoiceMap);
    };

    return (
        <AppContext.Provider value={{
            invoices,
            schemas,
            activeSchemaId,
            mappedRecords,
            addInvoice,
            addSchema,
            setActiveSchemaId: setActiveSchemaIdHandler,
            addMappedRecord,
            getNormalizedInvoices
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
    return ctx;
};
