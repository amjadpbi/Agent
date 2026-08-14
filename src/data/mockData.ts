import { Invoice, Product, Supplier } from '../lib/types';

export const mockSuppliers: Supplier[] = [
    { id: 'sup-1', name: 'Zaman Textiles' },
    { id: 'sup-2', name: 'Ali Packaging Co' },
    { id: 'sup-3', name: 'Karachi Threads' },
    { id: 'sup-4', name: 'Punjab Electronics Wholesale' }
];

export const mockProducts: Product[] = [
    { id: 'prod-1', name: 'Cotton Fabric' },
    { id: 'prod-2', name: 'Polyester Blend' },
    { id: 'prod-3', name: 'Thread Box (100pcs)' },
    { id: 'prod-4', name: 'Buttons Pack' },
    { id: 'prod-5', name: 'Cardboard Box (Large)' },
    { id: 'prod-6', name: 'Tape Roll' }
];

export const generateMockInvoices = (): Invoice[] => {
    return [
        {
            id: 'inv-101',
            supplierId: 'sup-1',
            supplierName: 'Zaman Textiles',
            invoiceNumber: 'ZT-2023-08-01',
            date: '2023-08-01',
            items: [
                { productId: 'prod-1', productName: 'Cotton Fabric', quantity: 50, unitPrice: 820, tax: 0, total: 41000 },
            ],
            totalAmount: 41000
        },
        {
            id: 'inv-102',
            supplierId: 'sup-1',
            supplierName: 'Zaman Textiles',
            invoiceNumber: 'ZT-2023-08-15',
            date: '2023-08-15',
            items: [
                { productId: 'prod-1', productName: 'Cotton Fabric', quantity: 60, unitPrice: 875, tax: 0, total: 52500 },
            ],
            totalAmount: 52500
        },
        {
            id: 'inv-103',
            supplierId: 'sup-3',
            supplierName: 'Karachi Threads',
            invoiceNumber: 'KT-991',
            date: '2023-08-10',
            items: [
                { productId: 'prod-3', productName: 'Thread Box (100pcs)', quantity: 10, unitPrice: 120, tax: 0, total: 1200 },
                { productId: 'prod-4', productName: 'Buttons Pack', quantity: 5, unitPrice: 45, tax: 0, total: 225 }
            ],
            totalAmount: 1425
        },
        {
            id: 'inv-104',
            supplierId: 'sup-3',
            supplierName: 'Karachi Threads',
            invoiceNumber: 'KT-1002',
            date: '2023-09-01',
            items: [
                { productId: 'prod-3', productName: 'Thread Box (100pcs)', quantity: 15, unitPrice: 135, tax: 0, total: 2025 },
                { productId: 'prod-4', productName: 'Buttons Pack', quantity: 5, unitPrice: 48, tax: 0, total: 240 }
            ],
            totalAmount: 2265
        },
        {
            id: 'inv-105',
            supplierId: 'sup-2',
            supplierName: 'Ali Packaging Co',
            invoiceNumber: 'APC-4421',
            date: '2023-08-20',
            items: [
                { productId: 'prod-5', productName: 'Cardboard Box (Large)', quantity: 200, unitPrice: 65, tax: 0, total: 13000 },
                { productId: 'prod-6', productName: 'Tape Roll', quantity: 50, unitPrice: 80, tax: 0, total: 4000 }
            ],
            totalAmount: 17000
        }
    ];
};
