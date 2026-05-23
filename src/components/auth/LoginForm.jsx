import { useState } from 'react'
import { ValidarFormato } from '../../core/auth/ValidarFormato.js'
import { ValidarCredenciales } from '../../core/auth/ValidarCredenciales.js'
import { ValidarEstado } from '../../core/auth/ValidarEstado.js'
import { ValidarRol } from '../../core/auth/ValidarRol.js'
import { LocalStorageGateway } from '../../core/persistence/LocalStorageGateway.js'

/**
 * Construye la cadena de responsabilidad (logica 100% del /core).
 * formato -> credenciales -> estado -> rol
 */
function construirCadenaAuth() {
  const gateway = new LocalStorageGateway()
  const formato = new ValidarFormato()
  const credenciales = new ValidarCredenciales(gateway)
  const estado = new ValidarEstado()
  const rol = new ValidarRol(['admin', 'operador', 'supervisor'])

  formato.setSiguiente(credenciales).setSiguiente(estado).setSiguiente(rol)
  return formato
}

function LoginForm({ onLoginExitoso }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    // React solo INVOCA el dominio; no contiene reglas de negocio
    const cadena = construirCadenaAuth()
    const resultado = await cadena.manejar({ email: email.trim(), password })

    setCargando(false)
    if (resultado.exito) onLoginExitoso(resultado.data._usuario)
    else setError(resultado.mensaje)
  }

  return (
    <div className="min-h-screen bg-[#07130F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/40 flex items-center justify-center mb-3">
            <i className="fa-solid fa-leaf text-primary text-3xl"></i>
          </div>
          <h1 className="text-text text-2xl font-bold">FreshControl</h1>
          <p className="text-muted text-sm">Sistema de Gestion de Inventarios - SIGI</p>
        </div>

        <form onSubmit={handleSubmit} className="panel p-8 shadow-2xl">
          <h2 className="text-text text-lg font-semibold mb-1">Iniciar sesion</h2>
          <p className="text-muted text-sm mb-6">Ingresa tus credenciales</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-critico/10 border border-critico/40 text-critico text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-muted text-sm font-medium mb-1.5">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@restaurante.com"
              className="input-base"
            />
          </div>

          <div className="mb-6">
            <label className="block text-muted text-sm font-medium mb-1.5">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="input-base"
            />
          </div>

          <button type="submit" disabled={cargando} className="btn-primary w-full">
            {cargando ? 'Validando...' : 'Ingresar al sistema'}
          </button>

          <div className="mt-5 pt-5 border-t border-white/5 text-xs text-muted">
            <p className="font-semibold text-muted/80 mb-1">Cuentas de prueba:</p>
            <p>admin@sigi.com / 123456 (admin)</p>
            <p>operador@sigi.com / 123456 (operador)</p>
          </div>
        </form>

        <p className="text-center text-muted text-xs mt-6">
          Universidad de la Amazonia - Patrones de Diseno
        </p>
      </div>
    </div>
  )
}

export default LoginForm
