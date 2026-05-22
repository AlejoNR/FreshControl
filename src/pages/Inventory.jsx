import { useState, useEffect, useCallback } from 'react'
import { LocalStorageGateway } from '../core/persistence/LocalStorageGateway.js'
import { RepositorioInventario } from '../core/services/RepositorioInventario.js'
import InventoryTable from '../components/inventory/InventoryTable.jsx'
import AddFoodModal from '../components/inventory/AddFoodModal.jsx'
import Loader from '../components/common/Loader.jsx'

function Inventory() {
  const [alimentos, setAlimentos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAdd, setModalAdd] = useState(false)

  const repo = new RepositorioInventario(new LocalStorageGateway())

  const recargar = useCallback(async () => {
    setCargando(true)
    setAlimentos(await repo.listar())
    setCargando(false)
  }, [])

  useEffect(() => { recargar() }, [recargar])

  const handleAgregar = async (alimento) => {
    await repo.guardar(alimento)
    setModalAdd(false)
    recargar()
  }

  const handleEliminar = async (id) => {
    await repo.eliminar(id)
    recargar()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-textDark text-2xl font-bold">Inventario</h1>
          <p className="text-textMuted text-sm">Ordenado por FEFO (primero el que caduca antes)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModalAdd(true)} className="btn-primary text-sm shadow-sm">+ Registrar Alimento</button>
        </div>
      </div>

      <div className="card p-5">
        {cargando ? <Loader /> : <InventoryTable alimentos={alimentos} onEliminar={handleEliminar} />}
      </div>

      {modalAdd && <AddFoodModal onAgregar={handleAgregar} onCerrar={() => setModalAdd(false)} />}
    </div>
  )
}
export default Inventory
