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
  '              papuSO :v               ',
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
  {
    id: 'snake',
    nombre: 'Snake Parser',
    descripcion: 'Recolecta bits de datos sin chocar con las paredes.',
  },
  {
    id: 'tetris',
    nombre: 'Tetris Grid',
    descripcion: 'Ordena bloques de codigo para liberar memoria.',
  },
  {
    id: 'missile',
    nombre: 'Missile Defense',
    descripcion: 'Protege la base de datos de ataques orbitales.',
  },
  {
    id: '2048',
    nombre: 'Binary 2048',
    descripcion: 'Combina potencias de 2 para optimizar el espacio.',
  },
]
