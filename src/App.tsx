import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProcessBill from './pages/ProcessBill';
import Mapping from './pages/Mapping';
import BusinessData from './pages/BusinessData';
import ShopAgent from './pages/ShopAgent';
import LedgerSchema from './pages/LedgerSchema';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="process" element={<ProcessBill />} />
                    <Route path="mapping" element={<Mapping />} />
                    <Route path="schema" element={<LedgerSchema />} />
                    <Route path="data" element={<BusinessData />} />
                    <Route path="agent" element={<ShopAgent />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
