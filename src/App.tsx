import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import DashboardOverview from '@/pages/DashboardOverview';
import AdminPage from '@/pages/AdminPage';
import FoobarDebugPage from '@/pages/FoobarDebugPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="foobar-debug" element={<FoobarDebugPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}