import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, ArrowLeftRight } from 'lucide-react';
import ProductosPage from './pages/ProductosPage';
import AlmacenesPage from './pages/AlmacenesPage';
import MovimientosPage from './pages/MovimientosPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/productos', label: 'Productos', icon: Package },
  { to: '/almacenes', label: 'Almacenes', icon: Warehouse },
  { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
];

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <Package className="logo-icon-svg" size={26} strokeWidth={2.5} />
            <span className="logo-text">Sistema de Inventario</span>
          </div>
          <nav className="nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <p>Sistema de Inventarios v1.0</p>
          </div>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/almacenes" element={<AlmacenesPage />} />
            <Route path="/movimientos" element={<MovimientosPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
