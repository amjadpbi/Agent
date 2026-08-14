import React, { useState, useEffect } from 'react';
import { ArrowRight, Save, LayoutTemplate, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../lib/store';
import { MappedRecord } from '../lib/types';

export default function Mapping() {
    const navigate = useNavigate();
    const location = useLocation();
    const extractedData = location.state?.extractedData;
    const { schemas, activeSchemaId, addMappedRecord } = useAppContext();
    const activeSchema = schemas.find(s => s.id === activeSchemaId);

    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [step, setStep] = useState<1 | 2>(1); // 1 = Map Fields, 2 = Review Data
    const [previewData, setPreviewData] = useState<any[]>([]);

    const sourceFields = [
        { id: 'supplierName', label: 'Supplier Name', category: 'Header' },
        { id: 'date', label: 'Invoice Date', category: 'Header' },
        { id: 'invoiceNumber', label: 'Invoice Number', category: 'Header' },
        { id: 'totalAmount', label: 'Total Amount', category: 'Header' },
        { id: 'items.productName', label: 'Product Name', category: 'Line Item' },
        { id: 'items.quantity', label: 'Quantity', category: 'Line Item' },
        { id: 'items.unitPrice', label: 'Unit Price', category: 'Line Item' },
        { id: 'items.tax', label: 'Tax', category: 'Line Item' },
        { id: 'items.total', label: 'Line Total', category: 'Line Item' },
    ];

    useEffect(() => {
        if (!activeSchema) return;
        // Auto-map based on similar names
        const initialMapping: Record<string, string> = {};
        activeSchema.fields.forEach(destField => {
            const lowerDest = destField.name.toLowerCase();
            const match = sourceFields.find(sf => {
                const lowerSrc = sf.label.toLowerCase();
                if (lowerSrc === lowerDest) return true;
                if (lowerDest.includes('date') && lowerSrc.includes('date')) return true;
                if (lowerDest.includes('supplier') && lowerSrc.includes('supplier')) return true;
                if (lowerDest.includes('qty') && lowerSrc.includes('quantity')) return true;
                if (lowerDest.includes('product') && lowerSrc.includes('product')) return true;
                if ((lowerDest.includes('rate') || lowerDest.includes('price')) && lowerSrc.includes('price')) return true;
                if (lowerDest === 'amount' || lowerDest === 'total') return false; // Too generic, could be line total or main total
                return false;
            });
            if (match) {
                initialMapping[destField.id] = match.id;
            }
        });

        // Custom overrides for Total based on types
        const totalLineAmountDest = activeSchema.fields.find(f => f.name.toLowerCase().includes('total') || f.name.toLowerCase().includes('amount'));
        if (totalLineAmountDest && !initialMapping[totalLineAmountDest.id]) {
            initialMapping[totalLineAmountDest.id] = 'items.total';
        }

        setMapping(initialMapping);
    }, [activeSchema]);

    if (!extractedData || !activeSchema) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">Missing Data</h2>
                <p className="text-slate-500 mt-2">Cannot map data without extracted invoice and a destination schema.</p>
                <button onClick={() => navigate('/process')} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
            </div>
        );
    }

    const unmappedRequired = activeSchema.fields.filter(f => f.required && !mapping[f.id]);

    const handleGeneratePreview = () => {
        if (unmappedRequired.length > 0) {
            alert(`Please map the following required fields: ${unmappedRequired.map(f => f.name).join(', ')}`);
            return;
        }

        // Flatten data
        const rows: any[] = [];
        const items = extractedData.items || [];

        if (items.length === 0) {
            // Handle header only
            const row: any = {};
            activeSchema.fields.forEach(f => {
                const srcId = mapping[f.id];
                if (srcId && !srcId.startsWith('items.')) {
                    row[f.name] = (extractedData as any)[srcId];
                } else {
                    row[f.name] = '';
                }
            });
            rows.push(row);
        } else {
            items.forEach((item: any) => {
                const row: any = {};
                activeSchema.fields.forEach(f => {
                    const srcId = mapping[f.id];
                    if (!srcId) {
                        row[f.name] = '';
                    } else if (srcId.startsWith('items.')) {
                        const key = srcId.split('.')[1];
                        row[f.name] = item[key];
                    } else {
                        row[f.name] = (extractedData as any)[srcId];
                    }

                    // Simple type casting preview
                    if (f.type === 'Integer' && row[f.name]) row[f.name] = parseInt(row[f.name], 10) || 0;
                    if ((f.type === 'Decimal' || f.type === 'Currency') && row[f.name]) row[f.name] = parseFloat(row[f.name]) || 0;
                });
                rows.push(row);
            });
        }

        setPreviewData(rows);
        setStep(2);
    };

    const handleRowEdit = (rowIndex: number, fieldName: string, value: string) => {
        const newData = [...previewData];
        newData[rowIndex][fieldName] = value;
        setPreviewData(newData);
    };

    const handleSave = () => {
        previewData.forEach(row => {
            const mappedRecord: MappedRecord = {
                id: `rec-${Date.now()}-${Math.random()}`,
                sourceInvoiceId: extractedData.id,
                data: { ...row }
            };
            addMappedRecord(mappedRecord);
        });
        // Remove standard addInvoice since we use mappedRecords
        navigate('/data');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-8">
                <span className="text-blue-600 font-medium cursor-pointer" onClick={() => navigate('/process')}>1. Upload</span>
                <ArrowRight className="w-4 h-4" />
                <span className={step >= 1 ? "text-blue-600 font-medium" : ""}>2. Map Data</span>
                <ArrowRight className="w-4 h-4" />
                <span className={step >= 2 ? "text-blue-600 font-medium" : ""}>3. Review & Save</span>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{step === 1 ? 'Field Mapping' : 'Review Data'}</h2>
                    <p className="mt-1 text-slate-500">
                        {step === 1
                            ? 'Map extracted invoice fields to your ledger structure.'
                            : 'Review the mapped data before saving to the ledger.'}
                    </p>
                </div>
                {step === 1 ? (
                    <button onClick={handleGeneratePreview} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition flex items-center">
                        Review Preview <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                ) : (
                    <button onClick={handleSave} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium shadow-sm hover:bg-emerald-700 transition flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        Confirm & Save
                    </button>
                )}
            </div>

            {step === 1 && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in">
                    <div className="mb-6 flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <LayoutTemplate className="w-5 h-5 text-blue-600" />
                        <div>
                            <span className="font-bold text-slate-800 text-sm">Active Schema: </span>
                            <span className="text-blue-700 font-medium text-sm">{activeSchema.name}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                            <div className="w-1/2 md:w-5/12">Extracted From Bill</div>
                            <div className="hidden md:flex w-2/12 justify-center"></div>
                            <div className="w-1/2 md:w-5/12">Destination Field ({activeSchema.name})</div>
                        </div>

                        {activeSchema.fields.map(destField => (
                            <div key={destField.id} className="flex flex-col md:flex-row items-center gap-4 py-3 border-b border-slate-50 group">
                                <div className="w-full md:w-5/12 order-2 md:order-1">
                                    <div className="relative">
                                        <Database className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                        <select
                                            value={mapping[destField.id] || ''}
                                            onChange={(e) => setMapping({ ...mapping, [destField.id]: e.target.value })}
                                            className={`w-full pl-9 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm
                                                ${!mapping[destField.id] && destField.required ? 'border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 bg-white text-slate-700'}`}
                                        >
                                            <option value="">-- Select Source Field --</option>
                                            {sourceFields.map(sf => (
                                                <option key={sf.id} value={sf.id}>{sf.label} ({sf.category})</option>
                                            ))}
                                        </select>
                                    </div>
                                    {!mapping[destField.id] && destField.required && (
                                        <p className="text-red-500 text-xs font-medium mt-1 ml-1">Required field not mapped</p>
                                    )}
                                </div>
                                <div className="hidden md:flex w-2/12 justify-center order-2 text-slate-300">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                                <div className="w-full md:w-5/12 order-1 md:order-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700">
                                        <span>{destField.name}</span>
                                        <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase">{destField.type}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4">
                    <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span className="font-bold text-emerald-800 text-sm">Ready to save</span>
                        </div>
                        <button onClick={() => setStep(1)} className="text-sm font-medium text-slate-500 hover:text-slate-800">Edit Mapping</button>
                    </div>

                    <div className="overflow-x-auto p-4">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {activeSchema.fields.map(f => (
                                        <th key={f.id} className="p-3">{f.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-sm border-b border-slate-100">
                                {previewData.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-blue-50/50 transition border-b border-slate-50">
                                        {activeSchema.fields.map(f => (
                                            <td key={f.id} className="p-0 border-r border-slate-100 last:border-r-0">
                                                <input
                                                    type="text"
                                                    value={row[f.name]?.toString() || ''}
                                                    onChange={(e) => handleRowEdit(rIdx, f.name, e.target.value)}
                                                    className="w-full p-3 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500 whitespace-nowrap"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
