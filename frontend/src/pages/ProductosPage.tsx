import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { getProductos, createProducto, updateProducto, deleteProducto, getAlmacenes, type Producto, type Almacen } from '../api';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Producto | null>(null);

  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: 0, almacenId: 0, stock: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([getProductos(search || undefined), getAlmacenes()]);
      setProductos(p);
      setAlmacenes(a);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const resetForm = () => setForm({ nombre: '', descripcion: '', precio: 0, almacenId: 0, stock: 0 });

  const handleCreate = async () => {
    if (!form.nombre || !form.almacenId) return;
    try {
      await createProducto(form);
      setShowCreate(false);
      resetForm();
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error creando producto');
    }
  };

  const openEdit = (p: Producto) => {
    setForm({ nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio, almacenId: p.almacenId, stock: 0 });
    setEditingId(p.id);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      await updateProducto(editingId, { nombre: form.nombre, descripcion: form.descripcion, precio: form.precio });
      setEditingId(null);
      resetForm();
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error actualizando producto');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProducto(deleteConfirm.id);
      setDeleteConfirm(null);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error eliminando producto');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="header-row">
          <div>
            <h1>Catálogo de Productos</h1>
            <p>Gestión completa del inventario de productos.</p>
          </div>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowCreate(true); }}>
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="search-bar">
            <input
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Almacén</th>
                <th className="text-right">Precio</th>
                <th className="text-right">Stock</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }} className="text-muted">Cargando...</td></tr>
              )}
              {!loading && productos.length === 0 && (
                <tr><td colSpan={6} className="empty-state">
                  {search ? 'Sin resultados para tu búsqueda.' : 'No hay productos. Crea el primero.'}
                </td></tr>
              )}
              {productos.map(p => (
                <tr key={p.id}>
                  <td className="font-mono text-muted">#{p.id}</td>
                  <td>
                    <div className="font-bold">{p.nombre}</div>
                    {p.descripcion && <div className="text-muted" style={{ fontSize: '12px' }}>{p.descripcion}</div>}
                  </td>
                  <td><span className="badge badge-accent">{p.almacen?.nombre || `ID ${p.almacenId}`}</span></td>
                  <td className="text-right font-mono font-bold">${p.precio.toLocaleString()}</td>
                  <td className={`text-right ${p.stock <= 5 ? 'stock-low' : 'stock-ok'}`}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {p.stock <= 5 && <AlertTriangle size={13} />}
                      {p.stock}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Editar" onClick={() => openEdit(p)}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-ghost btn-icon btn-sm" title="Eliminar" onClick={() => setDeleteConfirm(p)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Nuevo Producto</h2>
                <p>Agrega un producto al catálogo.</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" placeholder="Ej. Monitor Gamer 24''" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <input className="form-input" placeholder="Características del producto" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio ($)</label>
                  <input className="form-input" type="number" min="0" value={form.precio || ''} onChange={e => setForm({...form, precio: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Inicial</label>
                  <input className="form-input" type="number" min="0" value={form.stock || ''} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Almacén</label>
                <select className="form-select" value={form.almacenId || ''} onChange={e => setForm({...form, almacenId: parseInt(e.target.value)})}>
                  <option value="" disabled>Seleccionar almacén...</option>
                  {almacenes.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!form.nombre || !form.almacenId}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {editingId && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Editar Producto</h2>
                <p>Modifica los datos del producto.</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditingId(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <input className="form-input" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Precio ($)</label>
                <input className="form-input" type="number" min="0" value={form.precio || ''} onChange={e => setForm({...form, precio: parseFloat(e.target.value) || 0})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setEditingId(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Actualizar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ color: 'var(--danger)' }}>Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de eliminar <strong>{deleteConfirm.nombre}</strong>?</p>
              <p className="text-muted" style={{ fontSize: '13px', marginTop: '8px' }}>Esta acción realiza un borrado lógico (soft delete).</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
