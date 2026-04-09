import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api',
});

export default api;

// ---- Tipos ----
export interface Almacen {
  id: number;
  nombre: string;
  ubicacion: string | null;
  deletedAt: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  almacenId: number;
  almacen?: Almacen;
  deletedAt: string | null;
}

export interface Movimiento {
  id: number;
  productoId: number;
  producto?: Producto;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  fecha: string;
}

// ---- Productos ----
export const getProductos = (q?: string) =>
  api.get<Producto[]>('/productos', { params: q ? { q } : {} }).then(r => r.data);

export const getProducto = (id: number) =>
  api.get<Producto>(`/productos/${id}`).then(r => r.data);

export const createProducto = (data: { nombre: string; descripcion?: string; precio: number; almacenId: number; stock?: number }) =>
  api.post<Producto>('/productos', data).then(r => r.data);

export const updateProducto = (id: number, data: { nombre?: string; descripcion?: string; precio?: number }) =>
  api.patch<Producto>(`/productos/${id}`, data).then(r => r.data);

export const deleteProducto = (id: number) =>
  api.delete(`/productos/${id}`).then(r => r.data);

// ---- Almacenes ----
export const getAlmacenes = () =>
  api.get<Almacen[]>('/almacenes').then(r => r.data);

export const createAlmacen = (data: { nombre: string; ubicacion?: string }) =>
  api.post<Almacen>('/almacenes', data).then(r => r.data);

export const getValorTotal = () =>
  api.get<{ totalValor: number; moneda: string; productosContabilizados: number }>('/almacenes/valor-total').then(r => r.data);

// ---- Movimientos ----
export const getHistorial = () =>
  api.get<Movimiento[]>('/movimientos/historial').then(r => r.data);

export const registrarEntrada = (data: { productoId: number; cantidad: number }) =>
  api.post<Movimiento>('/movimientos/entrada', data).then(r => r.data);

export const registrarSalida = (data: { productoId: number; cantidad: number }) =>
  api.post<Movimiento>('/movimientos/salida', data).then(r => r.data);
