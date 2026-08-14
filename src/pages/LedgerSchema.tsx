import React, { useState } from 'react';
import { Database, Plus, Trash2, Upload, GripVertical, CheckCircle, Save } from 'lucide-react';
import { useAppContext } from '../lib/store';
import { SchemaDataType, SchemaField, LedgerSchema } from '../lib/types';

export default function LedgerSchemaPage() {
    const { schemas, activeSchemaId, setActiveSchemaId, addSchema } = useAppContext();

    const activeSchema = schemas.find(s => s.id === activeSchemaId);

    const [isCreating, setIsCreating] = useState(false);
    const [newSchemaName, setNewSchemaName] = useState('My Custom Ledger');
    const [newFields, setNewFields] = useState<SchemaField[]>([
        { id: `f-${Date.now()}-1`, name: 'InvoiceDate', type: 'Date', required: true },
        { id: `f-${Date.now()}-2`, name: 'SupplierName', type: 'Text', required: true },
        { id: `f-${Date.now()}-3`, name: 'TotalAmount', type: 'Currency', required: true }
    ]);

    const dataTypes: SchemaDataType[] = ['Text', 'Date', 'Integer', 'Decimal', 'Currency', 'Boolean'];

    const handleAddField = () => {
        setNewFields([...newFields, { id: `f-${Date.now()}`, name: `Field${newFields.length + 1}`, type: 'Text', required: false }]);
    };

    const handleRemoveField = (id: string) => {
        setNewFields(newFields.filter(f => f.id !== id));
    };

    const handleUpdateField = (id: string, key: keyof SchemaField, value: any) => {
        setNewFields(newFields.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const handleSaveNewSchema = () => {
        if (!newSchemaName.trim() || newFields.length === 0) return;
        const schema: LedgerSchema = {
            id: `schema-${Date.now()}`,
            name: newSchemaName,
            fields: newFields
        };
        addSchema(schema);
        setIsCreating(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (text) {
                const lines = text.split('\n');
                if (lines.length > 0) {
                    const headers = lines[0].split(',').map(h => h.replace(/["\r]/g, '').trim()).filter(h => h);
                    const generatedFields: SchemaField[] = headers.map((header, idx) => {
                        let inferredType: SchemaDataType = 'Text';
                        const lower = header.toLowerCase();
                        if (lower.includes('date')) inferredType = 'Date';
                        else if (lower.includes('amount') || lower.includes('total') || lower.includes('price')) inferredType = 'Currency';
                        else if (lower.includes('qty') || lower.includes('quantity')) inferredType = 'Integer';
                        else if (lower.includes('rate') || lower.includes('tax')) inferredType = 'Decimal';

                        return {
                            id: `f-${Date.now()}-${idx}`,
                            name: header,
                            type: inferredType,
                            required: true
                        };
                    });
                    setNewFields(generatedFields);
                    setNewSchemaName(`${file.name.split('.')[0]} Schema`);
                    setIsCreating(true);
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Ledger Schema</h2>
                <p className="mt-1 text-slate-500">Tell ShopAgent how your existing ledger is structured.</p>
                <p className="text-sm text-slate-400 mt-1">Create your own fields or upload a CSV template. ShopAgent will map supplier bills into this structure.</p>
            </div>

            {!isCreating && (
                <>
                    <div className="bg-white p-6 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Active Ledger Schema</div>
                                <h3 className="text-xl font-bold text-slate-800">{activeSchema?.name || 'No Schema Selected'}</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {activeSchema?.fields.length || 0} fields &middot; {activeSchema?.fields.filter(f => f.required).length || 0} required
                                </p>
                            </div>
                        </div>

                        {activeSchema && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {activeSchema.fields.map(field => (
                                    <div key={field.id} className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center shadow-sm">
                                        <span className="font-semibold text-slate-700 mr-2">{field.name}</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold 
                                            ${field.type === 'Date' ? 'bg-orange-100 text-orange-700' :
                                                field.type === 'Currency' ? 'bg-green-100 text-green-700' :
                                                    field.type === 'Integer' || field.type === 'Decimal' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-slate-100 text-slate-600'}`
                                        }>
                                            {field.type}
                                        </span>
                                        {field.required && <span className="ml-1 text-red-500 font-bold">*</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => setIsCreating(true)} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition group text-left">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                                <Plus className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-800">Create New Schema</h3>
                            <p className="text-sm text-slate-500 mt-1">Manually define your column names and data types.</p>
                        </button>

                        <label className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition group text-left cursor-pointer relative">
                            <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition">
                                <Upload className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-slate-800">Import CSV Template</h3>
                            <p className="text-sm text-slate-500 mt-1">We'll read your column headers to automatically generate a schema.</p>
                        </label>
                    </div>

                    {schemas.length > 1 && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">Switch Active Schema</h3>
                            <select
                                value={activeSchemaId || ''}
                                onChange={(e) => setActiveSchemaId(e.target.value)}
                                className="w-full md:w-1/2 p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {schemas.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.fields.length} fields)</option>
                                ))}
                            </select>
                        </div>
                    )}
                </>
            )}

            {isCreating && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Schema Editor</h3>
                            <p className="text-sm text-slate-500">Define the exact structure of your destination ledger.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition">Cancel</button>
                            <button onClick={handleSaveNewSchema} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center hover:bg-blue-700 transition shadow-sm">
                                <Save className="w-4 h-4 mr-2" /> Save Schema
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Schema Name</label>
                            <input
                                type="text"
                                value={newSchemaName}
                                onChange={(e) => setNewSchemaName(e.target.value)}
                                className="w-full md:w-1/2 p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                                placeholder="e.g. Daily Purchase Ledger"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                                <div className="w-8"></div>
                                <div className="flex-1">Field Name</div>
                                <div className="w-32">Data Type</div>
                                <div className="w-24 text-center">Required</div>
                                <div className="w-10"></div>
                            </div>

                            {newFields.map((field, idx) => (
                                <div key={field.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-xl group hover:border-blue-300 transition-colors">
                                    <div className="text-slate-300 cursor-move pl-2">
                                        <GripVertical className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={field.name}
                                            onChange={(e) => handleUpdateField(field.id, 'name', e.target.value)}
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Column Name"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <select
                                            value={field.type}
                                            onChange={(e) => handleUpdateField(field.id, 'type', e.target.value as SchemaDataType)}
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            {dataTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-24 flex justify-center">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => handleUpdateField(field.id, 'required', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                            />
                                        </label>
                                    </div>
                                    <div className="w-10 flex justify-center">
                                        <button onClick={() => handleRemoveField(field.id)} className="text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-1">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleAddField} className="mt-4 flex items-center text-blue-600 font-medium text-sm hover:text-blue-700 transition p-2 rounded-lg hover:bg-blue-50">
                            <Plus className="w-4 h-4 mr-1" /> Add Field
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
