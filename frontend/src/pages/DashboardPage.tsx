import { useEffect, useState } from 'react';
import { Package, Layers, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getProductos, getValorTotal, getHistorial, type Producto, type Movimiento } from '../api';

export default function DashboardPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [valor, setValor] = useState<{ totalValor: number; productosContabilizados: number } | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  useEffect(() => {
    getProductos().then(setProductos).catch(console.error);
    getValorTotal().then(setValor).catch(console.error);
    getHistorial().then(m => setMovimientos(m.slice(0, 5))).catch(console.error);
  }, []);

  const totalStock = productos.reduce((s, p) => s + p.stock, 0);
  const lowStock = productos.filter(p => p.stock <= 5).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Panel de Control</h1>
        <p>Resumen general del inventario en tiempo real.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card accent">
          <div className="stat-icon-row">
            <div className="stat-icon accent-bg"><Package size={20} /></div>
          </div>
          <div className="stat-label">Productos Activos</div>
          <div className="stat-value">{productos.length}</div>
          <div className="stat-sub">Referencias en catálogo</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon-row">
            <div className="stat-icon success-bg"><Layers size={20} /></div>
          </div>
          <div className="stat-label">Stock Total</div>
          <div className="stat-value">{totalStock.toLocaleString()}</div>
          <div className="stat-sub">Unidades en inventario</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon-row">
            <div className="stat-icon warning-bg"><DollarSign size={20} /></div>
          </div>
          <div className="stat-label">Valor del Inventario</div>
          <div className="stat-value">${valor?.totalValor.toLocaleString() || '0'}</div>
          <div className="stat-sub">{valor?.productosContabilizados || 0} productos contabilizados</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon-row">
            <div className="stat-icon danger-bg"><AlertTriangle size={20} /></div>
          </div>
          <div className="stat-label">Stock Bajo</div>
          <div className="stat-value">{lowStock}</div>
          <div className="stat-sub">Productos con ≤5 unidades</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header"><strong>Últimos Movimientos</strong></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th className="text-right">Cantidad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.length === 0 && (
                  <tr><td colSpan={4} className="text-muted" style={{ textAlign: 'center', padding: '40px' }}>Sin movimientos registrados</td></tr>
                )}
                {movimientos.map(m => (
                  <tr key={m.id}>
                    <td className="font-bold">{m.producto?.nombre || `ID ${m.productoId}`}</td>
                    <td><span className={`badge ${m.tipo === 'ENTRADA' ? 'badge-success' : 'badge-danger'}`}>{m.tipo}</span></td>
                    <td className={`text-right font-bold ${m.tipo === 'ENTRADA' ? 'text-success' : 'text-danger'}`}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {m.tipo === 'ENTRADA' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {m.cantidad}
                      </span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '12px' }}>{new Date(m.fecha).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><strong>Productos con Menor Stock</strong></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-right">Stock</th>
                  <th className="text-right">Precio</th>
                </tr>
              </thead>
              <tbody>
                {[...productos].sort((a, b) => a.stock - b.stock).slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td className="font-bold">{p.nombre}</td>
                    <td className={`text-right ${p.stock <= 5 ? 'stock-low' : 'stock-ok'}`}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {p.stock <= 5 && <AlertTriangle size={13} />}
                        {p.stock}
                      </span>
                    </td>
                    <td className="text-right font-mono">${p.precio.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
