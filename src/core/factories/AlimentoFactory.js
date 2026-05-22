import { ProductoCarnico } from '../models/ProductoCarnico.js'
import { ProductoSeco } from '../models/ProductoSeco.js'
import { ProductoLacteo } from '../models/ProductoLacteo.js'
import { ProductoVegetal } from '../models/ProductoVegetal.js'

/**
 * Fabrica que centraliza la creacion polimorfica de alimentos.
 * El cliente (React o el Adapter del CSV) no conoce las clases concretas:
 * solo pide una "categoria" y recibe el objeto correcto, ya validado.
 */
export class AlimentoFactory {
  static #registro = {
    carnico: ProductoCarnico,
    seco: ProductoSeco,
    lacteo: ProductoLacteo,
    vegetal: ProductoVegetal,
  }

  static crearAlimento(categoria, datos) {
    const clave = String(categoria || '').toLowerCase().trim()
    const Clase = AlimentoFactory.#registro[clave]

    if (!Clase) {
      throw new Error(
        `Categoria no soportada: "${categoria}". ` +
        `Validas: ${AlimentoFactory.categoriasDisponibles().join(', ')}.`
      )
    }

    const alimento = new Clase(datos)
    alimento.validar()
    return alimento
  }

  static categoriasDisponibles() {
    return Object.keys(AlimentoFactory.#registro)
  }
}
