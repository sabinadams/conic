import type { ClientConfig } from './models'
import { Conic } from './Conic'

type ConicManagerConfigObject = {
    manager: Conic<any>,
    name: string
}

export class ConicManager {
    private clientConfigurations: ConicManagerConfigObject[] = []

    private DEFAULT_CONFIG = {
        autoTenantStrategy: null,
        customDatasourceUrlStrategy: null
    }

    constructor( readonly clients: ClientConfig[] ) {
        clients.forEach( ({ name, autoTenantStrategy, customDatasourceUrlStrategy, client  }) => this.clientConfigurations.push({
            name,
            manager: new Conic(
                client,
                autoTenantStrategy || this.DEFAULT_CONFIG.autoTenantStrategy,
                customDatasourceUrlStrategy || this.DEFAULT_CONFIG.customDatasourceUrlStrategy
            )
        }))
    }
    
    client<T>( name: string ): Conic<T> {
        const config = this.clientConfigurations.find( config => config.name === name )
        if ( !config ) throw Error(`Conic: Client named ${name} not found`)
        return config.manager
    }
}