import { ManejadorBase } from './ManejadorBase.js'

/**
 * Eslabon 2: verifica que el usuario exista y la contrasena coincida.
 * Recibe el gateway por inyeccion de dependencias (no lo crea el mismo).
 */
export class ValidarCredenciales extends ManejadorBase {
  constructor(gateway) {
    super()
    this.gateway = gateway
  }

  async manejar(solicitud) {
    const usuarios = (await this.gateway.obtener('usuarios')) || []
    const usuario = usuarios.find((u) => u.email === solicitud.email)

    if (!usuario || usuario.password !== solicitud.password) {
      return this._fallar('ValidarCredenciales', 'Correo o contrasena incorrectos.')
    }

    solicitud._usuario = usuario
    return await super.manejar(solicitud)
  }
}
