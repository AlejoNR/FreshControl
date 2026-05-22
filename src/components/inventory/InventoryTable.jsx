import Badge from '../common/Badge.jsx'
import { MotorFEFO } from '../../core/services/MotorFEFO.js'

/** Tabla de inventario ordenada por FEFO (primero el que caduca antes). */
function InventoryTable({ alimentos, onEliminar }) {
  const ordenados = MotorFEFO.ordenar(alimentos)

  if (ordenados.length === 0) {
    return <p className="text-textMuted text-sm py-8 text-center">No hay productos en el inventario.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-textMuted text-left border-b border-border">
            <th className="py-3 px-3 font-medium">Producto</th>
            <th className="py-3 px-3 font-medium">Categoria</th>
            <th className="py-3 px-3 font-medium">Cantidad</th>
            <th className="py-3 px-3 font-medium">Lote</th>
            <th className="py-3 px-3 font-medium">Caduca en</th>
            <th className="py-3 px-3 font-medium">Estado</th>
            <th className="py-3 px-3 font-medium text-right">Accion</th>
          </tr>
        </thead>
        <tbody>
          {ordenados.map((a) => {
            const horas = Math.round(a.horasParaCaducar())
            return (
              <tr key={a.id} className="border-b border-border/50 hover:bg-black/5 transition-colors">
                <td className="py-3 px-3 text-textDark font-medium">{a.nombre}</td>
                <td className="py-3 px-3 text-textMuted capitalize">{a.categoria}</td>
                <td className="py-3 px-3 text-textMuted">{a.cantidad} {a.unidad}</td>
                <td className="py-3 px-3 text-textMuted">{a.lote || '-'}</td>
                <td className="py-3 px-3 text-textMuted">{horas <= 0 ? 'Vencido' : `${horas}h`}</td>
                <td className="py-3 px-3"><Badge estado={a.estadoCaducidad()} /></td>
                <td className="py-3 px-3 text-right">
                  <button onClick={() => onEliminar(a.id)} className="text-critico/80 hover:text-critico text-xs font-medium">
                    Eliminar
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
export default InventoryTable
