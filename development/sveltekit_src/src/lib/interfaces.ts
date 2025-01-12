export type Username = string


export interface NcAddressBook {
    url: string
    displayName: string
    ctag: unknown
    syncToken: string
}

export interface UserAddressBook {
    path: string
    displayName: string
    active: boolean
    ctag?: unknown
    syncToken?: string
}


export interface User {
    username: Username
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    sub?: string
    addressBooks?: UserAddressBook[]
}


export interface RefreshTokenResult {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
    user_id: string
}


