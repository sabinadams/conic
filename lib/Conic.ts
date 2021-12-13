import { BasePrismaClient, BasicClass } from 'models'

interface SnapshotContext {
    tenant: string;
    product: string;
    env: string;
}

export class Conic<PrismaClientInstance extends BasePrismaClient> {

    private CONNECTIONS: Record<string, PrismaClientInstance> = {}
    
    constructor( 
        private readonly client: BasicClass<PrismaClientInstance>,
        private readonly autoTenantStrategy: ((...args: any) => string) | null = null,
        private readonly customDatasourceUrlStrategy: ((url: string, tenant: string) => string) | null = null
    ) {}

    private generateClient(ctx: SnapshotContext): PrismaClientInstance {

        //@ts-ignore
        const client: PrismaClientInstance = new this.client({
            datasources: { db: { url: process.env.DATABASE_URL } },
        })

        client.$connect()
        client.$on('beforeExit', async () => {
            console.log(`Conic: Exiting ${ctx} db connections`);
            await client.$disconnect();
        })
        
        return client
    }

    public getTenant( instance: string ): PrismaClientInstance {
        if ( this.CONNECTIONS[instance] ) {
            return this.CONNECTIONS[instance]
        }  else {
            this.CONNECTIONS[instance] = this.generateClient( instance as unknown as SnapshotContext ) as PrismaClientInstance
            return this.CONNECTIONS[instance]
        }
    }

    public get prisma(): PrismaClientInstance | null {
        if ( !this.autoTenantStrategy ) throw Error(`Conic: You cannot use the prisma accessor if you have not set up an autoTenantStrategy`)
        const instance: string = this.autoTenantStrategy()
        return this.getTenant( instance )
    }
}