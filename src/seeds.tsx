export type Role = 'Admin' | 'Support'

export type Env = 'staging' | 'prod'

export const perms = [
    {id: 'users.read', label: 'Read Users', help: 'View users in the directory'},
    {id: 'billing.refund', label: 'Refund', help: 'Issue refunds to a customer'},
    {id: 'users.impersonate', label: 'Impersonate', help: 'Login as another user (dangerous)'},
] as const

export type PermId = (typeof perms)[number]['id']