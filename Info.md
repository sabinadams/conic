## What it should do

- Pass it a Prisma client (`const client = Conic(...)`)
- Whenever you call `client.prisma` it should get a fresh client for the tenant and automatically figure out the tenant if provided a tenant resolver function
When you call `client.get(string)` it should try to get a tenant client for the provided string, othewise it will create one and return it
When you call `client.setTenantStrategy(string)` it will set the tenant strategy (also configurable in the constructor but defaults to null)
- This is what it would look like to go the `setTenantStrategy` route
    ```ts
    import { PrismaClient } from '@prisma/client'

    // Create manager
    const Conic = new Conic<PrismaClient>(
        PrismaClient,
        httpService.getTenant
    )
    
    // Pull out the prisma client (auto detected the one you want)
    const Prisma = Conic.prisma

    // Query DB
    Prisma.user.findFirst()
    ```
- This is what it would look like (in Nest) to go the `getTenant` route 
    ```ts
    import { PrismaClient } from '@prisma/client'

    // Create manager
    const Conic = new Conic<PrismaClient>(PrismaClient)

    //Pull out the prisma client you wnt
    const Prisma = Conic.get( httpService.getTenant )

    // Query DB
    Prisma.user.findFirst()
    ```

---

## Other Cool Things To Think About

```ts
import { CrmClient } from '@prisma/client'
import { EmmaClient } from '@prisma/client'
import { HttpService } from '@project/services'

const http = new HttpService()

const Conic = new Conic({
    'crm': CrmClient,
    'emma': {
        client: EmmaClient,
        autoTenantStrategy: http.getTenant,
        customDatasourceUrlStrategy: (url, tenant) => {
            return url.replace('<tenant-placeholder>', tenant)
        }
    } 
},{
    autoTenantStrategy: http.getTenant,
    customDatasourceUrlStrategy: (url, tenant) => {
        return url.replace('<tenant-placeholder>', tenant)
    }
})

const emma: EmmaClient = Conic.source('emma').prisma
const crm: CrmClient  = Conic.source('crm').prisma

const data = await crm.user.findFirst()
```