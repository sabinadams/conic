interface SnapshotContext {
    tenant: string;
    product: string;
    env: string;
}

type BasePrismaClientInstance = {
    $on: Function;
    $disconnect: Function;
    $connect: Function;
} 

type BasicClass = {
    new(): any
}

export class Conic<PrismaClientInstance> {

    private CONNECTIONS: Record<string, PrismaClientInstance> = {}
    
    constructor(
        private readonly PrismaClient: BasicClass,
        private readonly contextFactory: Function,
    ) {}
    
    private generateClient(ctx: SnapshotContext): PrismaClientInstance {
        const client: PrismaClientInstance & BasePrismaClientInstance = new this.PrismaClient()

        client.$connect()
        client.$on('beforeExit', async () => {
            console.log(`Exiting ${ctx} db connections`);
            await client.$disconnect();
        })
        
        return client
    }

    public get prisma(): PrismaClientInstance {
        const ctx: SnapshotContext = this.contextFactory()
        
        if ( this.CONNECTIONS[ctx.tenant] ) {
            return this.CONNECTIONS[ctx.tenant]
        }  else {
            this.CONNECTIONS[ctx.tenant] = this.generateClient( ctx ) as PrismaClientInstance
            return this.CONNECTIONS[ctx.tenant]
        }

    }
}