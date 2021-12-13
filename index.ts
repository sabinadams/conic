import { PrismaClient } from '@prisma/client'
import { ConicManager } from './lib'

const Manager = new ConicManager([
    {
        client: PrismaClient,
        name: 'crm'
    }
])

Manager.client<PrismaClient>('crm').getTenant('slkdjf')