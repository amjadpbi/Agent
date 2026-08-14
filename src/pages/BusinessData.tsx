import React, { useState, useMemo } from 'react';
import { Download, Search, Filter } from 'lucide-react';
import { useAppContext } from '../lib/store';

export default function BusinessData() {
    const { mappedRecords, schemas, activeSchemaId } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const activeSchema = schemas.find(s => s.id === activeSchemaId);

    const filteredData = useMemo(() => {
        if (!activeSchema) return [];

        let result = mappedRecords.map(r => r.data);

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(r => {
                // Search across all values in the record
                return Object.values(r).some(val =>
                    val && val.toString().toLowerCase().includes(term)
                );
            });
        }

        return result;
        // In a real app we might sort by the date field if it exists, but the user structure is dynamic
    }, [mappedRecords, searchTerm, activeSchema]);

    const handleExportCSV = () => {
        if (filteredData.length === 0 || !activeSchema) return;
        const headers = activeSchema.fields.map(f => f.name);

        const rows = filteredData.map(row => {
            return headers.map(header => {
                const val = row[header];
                return val != null ? `"${val}"` : '""';
            }).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `shopagent_${activeSchema.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Business Data Directory</h2>
                    <p className="mt-1 text-slate-500">Your mapped ledger records.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={!activeSchema}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition flex items-center w-fit disabled:opacity-50"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV (Excel)
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search across all fields..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden auto-rows-max">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                {activeSchema?.fields.map(f => (
                                    <th key={f.id} className="p-4 border-b border-slate-200">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{f.name}</span>
                                            <span className="text-[10px] text-slate-400 uppercase">{f.type}</span>
                                        </div>
                                    </th>
                                ))}
                                {!activeSchema && (
                                    <th className="p-4 border-b border-slate-200">No Schema Active</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.length > 0 && activeSchema ? filteredData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    {activeSchema.fields.map(f => (
                                        <td key={f.id} className="p-4 text-slate-700">
                                            {typeof row[f.name] !== 'undefined' ? row[f.name] : <span className="text-slate-300 italic">empty</span>}
                                        </td>
                                    ))}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={activeSchema?.fields.length || 1} className="p-12 text-center text-slate-500">
                                        No records found in the current schema. Check your Ledger Schema.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
