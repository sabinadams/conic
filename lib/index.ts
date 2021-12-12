import { PrismaClient } from '@prisma/client'
import { Conic } from './Conic'

// This would be like NestJS or Express's req object
const requestFactory = () => {
    return {
        tenant: Math.random().toString(),
        product: Math.random().toString(),
        env: 'dev'
    }
}

const MultiTenantPrisma = new Conic<PrismaClient>(
    PrismaClient,
    requestFactory
)

const TestClient = MultiTenantPrisma.prisma

console.log(TestClient)