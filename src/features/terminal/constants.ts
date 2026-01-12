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

export const BANNER_LINES = [
  '======================================',
  '         PAPUSO TERMINAL v1           ',
  '======================================',
]

export const MINIGAMES: MinigameDefinition[] = [
  {
    id: 'asteroids',
    nombre: 'Asteroids ASCII',
    descripcion: 'Arcade rapido con wrap-around y disparos discretos.',
  },
  {
    id: 'breakout',
    nombre: 'Breakout',
    descripcion: 'Rebotes por zonas y bloques en grid.',
  },
  {
    id: 'pong',
    nombre: 'Pong',
    descripcion: 'Paletas verticales con rebote por zona.',
  },
  {
    id: 'dodge',
    nombre: 'Dodge',
    descripcion: 'Esquiva objetos que caen por filas.',
  },
  {
    id: 'invaders',
    nombre: 'Space Invaders',
    descripcion: 'Formacion descendente con disparos limitados.',
  },
]
