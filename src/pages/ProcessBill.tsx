import React, { useState } from 'react';
import { UploadCloud, FileImage, CheckCircle, ArrowRight, Loader2, Database } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../lib/store';
import { Invoice } from '../lib/types';

export default function ProcessBill() {
    const { schemas, activeSchemaId, setActiveSchemaId } = useAppContext();
    const [isExtracting, setIsExtracting] = useState(false);
    const navigate = useNavigate();

    const handleUseDemo = () => {
        setIsExtracting(true);
        setTimeout(() => {
            const extractedData = {
                id: `inv-${Date.now()}`,
                supplierId: 'new-sup-1',
                supplierName: 'Faisal Distributors',
                invoiceNumber: `FD-${Math.floor(Math.random() * 10000)}`,
                date: new Date().toISOString().split('T')[0],
                items: [
                    { productId: 'prod-new-1', productName: 'Notebooks (A4)', quantity: 100, unitPrice: 200, tax: 0, total: 20000 },
                    { productId: 'prod-new-2', productName: 'Ballpoint Pens Box', quantity: 20, unitPrice: 150, tax: 0, total: 3000 },
                ],
                totalAmount: 23000
            };
            setIsExtracting(false);
            navigate('/mapping', { state: { extractedData } });
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-8">
                <span className="text-blue-600 font-medium">1. Upload</span>
                <ArrowRight className="w-4 h-4" />
                <span>2. Map Data</span>
                <ArrowRight className="w-4 h-4" />
                <span>3. Review & Save</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center shadow-sm animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                        <UploadCloud className="w-10 h-10 text-blue-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Upload Supplier Invoice</h2>
                <p className="mt-3 text-slate-500 max-w-md mx-auto">
                    Take a photo of your paper bill or upload a PDF. Our AI agent will extract all line items into structured data.
                </p>

                <div className="mt-8 max-w-sm mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                        <Database className="w-4 h-4 mr-1" /> Destination
                    </label>
                    {schemas.length === 0 ? (
                        <div className="text-red-500 text-sm font-medium">
                            Create a Ledger Schema before processing bills.{' '}
                            <Link to="/schema" className="underline hover:text-red-600 transition">Go to schema</Link>
                        </div>
                    ) : (
                        <select
                            value={activeSchemaId || ''}
                            onChange={(e) => setActiveSchemaId(e.target.value)}
                            className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
                        >
                            {schemas.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    )}
                </div>

                <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
                    <button
                        disabled={isExtracting || schemas.length === 0}
                        className="px-8 py-4 bg-slate-100 text-slate-400 rounded-xl font-medium flex items-center disabled:opacity-50 border border-slate-200"
                    >
                        <FileImage className="w-5 h-5 mr-2" />
                        Upload Image (WIP)
                    </button>

                    <div className="text-slate-400 font-medium">OR</div>

                    <button
                        onClick={handleUseDemo}
                        disabled={isExtracting || schemas.length === 0}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center transition shadow-sm disabled:opacity-50"
                    >
                        {isExtracting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Extracting with AI...
                            </>
                        ) : (
                            <>
                                <FileImage className="w-5 h-5 mr-2" />
                                Use Demo Invoice
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
