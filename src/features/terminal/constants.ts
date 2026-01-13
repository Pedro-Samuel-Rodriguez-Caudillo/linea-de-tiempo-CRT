import type { MinigameDefinition } from './types'

export const BOOT_LINES = [
  'PapuSO BIOS v0.4.1',
  'Chequeando memoria ... OK',
  'Dispositivos detectados: teclado, audio, CRT',
  'Montando unidad /data ... OK',
  'Cargando kernel grafico ... OK',
  'Modo terminal: activo',
  'Sincronizando reloj interno ... OK',
  'Sistema listo para iniciar',
]

export const INSTRUCTION_LINES = [
  'SISTEMA DE RECUPERACION DE DATOS: ACTIVO',
  'DETECTADOS EVENTOS HISTORICOS ENCRIPTADOS.',
  '',
  'PROTOCOLO DE USUARIO:',
  '1. ANALIZAR los fragmentos de datos visibles.',
  '2. EJECUTAR subrutinas de desencriptacion.',
  '',
  'INICIANDO INTERFAZ DE NAVEGACION...',
]

export const BANNER_LINES = [
  '======================================',
  '              papuSO :v               ',
  '             Hecho por: Pedro         ',
  '======================================',
]

export const MINIGAMES: MinigameDefinition[] = [
  {
    id: 'asteroids',
    nombre: 'Asteroids',
    descripcion: 'Dipara a esos meteoros.',
    baseTarget: 12,
  },
  {
    id: 'breakout',
    nombre: 'Breakout',
    descripcion: 'Destruye bloques.',
    baseTarget: 20,
  },
  {
    id: 'pong',
    nombre: 'Pong',
    descripcion: 'No permitas que llegue a tu zona.',
    baseTarget: 15,
  },
  {
    id: 'dodge',
    nombre: 'Dodge',
    descripcion: 'Esquiva objetos que caen.',
    baseTarget: 20,
  },
  {
    id: 'invaders',
    nombre: 'Space Invaders',
    descripcion: 'Formacion descendente.',
    baseTarget: 15,
  },
  {
    id: 'snake',
    nombre: 'Snake',
    descripcion: 'Recolecta puntos.',
    baseTarget: 12,
  },
  {
    id: 'missile',
    nombre: 'Missile Defense',
    descripcion: 'Protegete de ataques orbitales.',
    baseTarget: 15,
  },
  {
    id: '2048',
    nombre: '2048',
    descripcion: 'Combina potencias de 2.',
    baseTarget: 20,
  },
]

const MIN_WORDS_PER_POINT = 2
const MAX_WORDS_PER_POINT = 5
const MIN_BASE_TARGET = Math.min(...MINIGAMES.map((minigame) => minigame.baseTarget))
const MAX_BASE_TARGET = Math.max(...MINIGAMES.map((minigame) => minigame.baseTarget))

export const getWordsPerPoint = (baseTarget: number) => {
  if (MAX_BASE_TARGET === MIN_BASE_TARGET) return MIN_WORDS_PER_POINT
  const normalized = (MAX_BASE_TARGET - baseTarget) / (MAX_BASE_TARGET - MIN_BASE_TARGET)
  const scaled = MIN_WORDS_PER_POINT + normalized * (MAX_WORDS_PER_POINT - MIN_WORDS_PER_POINT)
  const rounded = Math.round(scaled)
  return Math.min(MAX_WORDS_PER_POINT, Math.max(MIN_WORDS_PER_POINT, rounded))
}
