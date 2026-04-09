import { useEffect, useState } from 'react';
import { Plus, MapPin, X } from 'lucide-react';
import { getAlmacenes, createAlmacen, type Almacen } from '../api';

export default function AlmacenesPage() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ nombre: '', ubicacion: '' });

  const load = async () => {
    setLoading(true);
    try { setAlmacenes(await getAlmacenes()); }
    catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.nombre) return;
    try {
      await createAlmacen(form);
      setShowCreate(false);
      setForm({ nombre: '', ubicacion: '' });
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error creando almacén');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="header-row">
          <div>
            <h1>Almacenes</h1>
            <p>Ubicaciones físicas donde se almacena el inventario.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Nuevo Almacén
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Cargando almacenes...</p>
      ) : almacenes.length === 0 ? (
        <div className="empty-state">
          <p>No hay almacenes registrados.</p>
        </div>
      ) : (
        <div className="almacen-grid">
          {almacenes.map(a => (
            <div key={a.id} className="almacen-card">
              <h3>{a.nombre}</h3>
              <p className="location">
                <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                {a.ubicacion || 'Sin ubicación'}
              </p>
              <p className="almacen-id">ID: {a.id}</p>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Nuevo Almacén</h2>
                <p>Registra una nueva ubicación de almacenamiento.</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" placeholder="Ej. Almacén Central" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Ubicación</label>
                <input className="form-input" placeholder="Ej. CDMX, Col. Centro" value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!form.nombre}>Crear Almacén</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
