export type ClientConfig = {
    client: { new(): any },
    name: string,
    autoTenantStrategy?: ((...args: any) => string) | null,
    customDatasourceUrlStrategy?: ((url: string, tenant: string) => string) | null
}