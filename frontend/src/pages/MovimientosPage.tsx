import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getProductos, getHistorial, registrarEntrada, registrarSalida, type Producto, type Movimiento } from '../api';

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const [tipo, setTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [productoId, setProductoId] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<number | ''>('');

  const load = async () => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([getHistorial(), getProductos()]);
      setMovimientos(m);
      setProductos(p);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productoId === '' || cantidad === '' || Number(cantidad) <= 0) return;

    try {
      if (tipo === 'ENTRADA') {
        await registrarEntrada({ productoId: Number(productoId), cantidad: Number(cantidad) });
      } else {
        await registrarSalida({ productoId: Number(productoId), cantidad: Number(cantidad) });
      }
      setCantidad('');
      setProductoId('');
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error registrando movimiento. Verifica el stock disponible.');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Movimientos de Inventario</h1>
        <p>Registra entradas y salidas, y consulta el historial completo.</p>
      </div>

      <div className="two-cols">
        {/* Formulario */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header"><strong>Registrar Movimiento</strong></div>
          <div className="card-body">
            <div className="toggle-group" style={{ marginBottom: '20px' }}>
              <button
                className={`toggle-btn ${tipo === 'ENTRADA' ? 'active-entrada' : ''}`}
                onClick={() => setTipo('ENTRADA')}
              >
                <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Entrada
              </button>
              <button
                className={`toggle-btn ${tipo === 'SALIDA' ? 'active-salida' : ''}`}
                onClick={() => setTipo('SALIDA')}
              >
                <ArrowDownRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Salida
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Producto</label>
                <select
                  className="form-select"
                  value={productoId}
                  onChange={e => setProductoId(Number(e.target.value))}
                  required
                >
                  <option value="" disabled>Seleccionar producto...</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cantidad</label>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  placeholder="Ej. 10"
                  value={cantidad}
                  onChange={e => setCantidad(Number(e.target.value))}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn ${tipo === 'ENTRADA' ? 'btn-success' : 'btn-danger'}`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Confirmar {tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}
              </button>
            </form>
          </div>
        </div>

        {/* Historial */}
        <div className="card">
          <div className="card-header"><strong>Historial de Movimientos</strong></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th className="text-right">Cantidad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="text-muted" style={{ textAlign: 'center', padding: '40px' }}>Cargando...</td></tr>
                )}
                {!loading && movimientos.length === 0 && (
                  <tr><td colSpan={5} className="empty-state">
                    Sin movimientos registrados.
                  </td></tr>
                )}
                {movimientos.map(m => (
                  <tr key={m.id}>
                    <td className="font-mono text-muted">#{m.id}</td>
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
      </div>
    </div>
  );
}
