import { PrismaClient } from '@prisma/client'
import { Conic, ConicManager } from './lib'

const test = new Conic(PrismaClient).getTenant('lskdf')