import { LocalStorageGateway } from '../persistence/LocalStorageGateway.js'

/**
 * Siembra datos iniciales (usuarios de prueba e inventario de ejemplo)
 * la primera vez que se abre la app. Permite probar el sistema de una vez.
 */
export async function sembrarDatos() {
  const gateway = new LocalStorageGateway()

  const usuarios = await gateway.obtener('usuarios')
  if (!usuarios) {
    const bcrypt = await import('bcryptjs');
    const defaultPassword = bcrypt.hashSync('123456', 10);

    await gateway.guardar('usuarios', [
      { id: '1', nombre: 'Administrador', email: 'admin@sigi.com', password: defaultPassword, rol: 'admin', estado: 'activo' },
      { id: '2', nombre: 'Operador Bodega', email: 'operador@sigi.com', password: defaultPassword, rol: 'operador', estado: 'activo' },
      { id: '3', nombre: 'Cuenta Suspendida', email: 'suspendido@sigi.com', password: defaultPassword, rol: 'operador', estado: 'inactivo' },
    ])
  } else {
    // Migración: Si hay usuarios existentes con contraseñas en texto plano, las hasheamos.
    let modificado = false
    const bcrypt = await import('bcryptjs');
    const usuariosMigrados = usuarios.map(u => {
      const esHash = typeof u.password === 'string' && u.password.startsWith('$2') && u.password.length === 60
      if (!esHash) {
        u.password = bcrypt.hashSync(u.password, 10)
        modificado = true
      }
      return u
    })
    if (modificado) {
      await gateway.guardar('usuarios', usuariosMigrados)
    }
  }

  const inventario = await gateway.obtener('inventario')
  if (!inventario) {
    const ahora = Date.now()
    const h = 1000 * 60 * 60
    const iso = (horas) => new Date(ahora + horas * h).toISOString()
    await gateway.guardar('inventario', [
      { id: crypto.randomUUID(), categoria: 'carnico', nombre: 'Lomo de res', cantidad: 12, unidad: 'kg', fechaIngreso: iso(-48), fechaCaducidad: iso(10), lote: 'CAR-001', temperaturaConservacion: -18, tipoCorte: 'lomo' },
      { id: crypto.randomUUID(), categoria: 'lacteo', nombre: 'Leche entera', cantidad: 30, unidad: 'L', fechaIngreso: iso(-24), fechaCaducidad: iso(40), lote: 'LAC-014', pasteurizado: true },
      { id: crypto.randomUUID(), categoria: 'vegetal', nombre: 'Lechuga', cantidad: 20, unidad: 'und', fechaIngreso: iso(-12), fechaCaducidad: iso(60), lote: 'VEG-220', organico: true },
      { id: crypto.randomUUID(), categoria: 'seco', nombre: 'Arroz', cantidad: 50, unidad: 'kg', fechaIngreso: iso(-72), fechaCaducidad: iso(2000), lote: 'SEC-007', humedad: 11, humedadMaxima: 14 },
      { id: crypto.randomUUID(), categoria: 'carnico', nombre: 'Pechuga pollo', cantidad: 8, unidad: 'kg', fechaIngreso: iso(-6), fechaCaducidad: iso(120), lote: 'CAR-002', temperaturaConservacion: -18, tipoCorte: 'pechuga' },
      { id: crypto.randomUUID(), categoria: 'lacteo', nombre: 'Queso fresco', cantidad: 15, unidad: 'kg', fechaIngreso: iso(-30), fechaCaducidad: iso(18), lote: 'LAC-031', pasteurizado: true },
    ])
  }
}
