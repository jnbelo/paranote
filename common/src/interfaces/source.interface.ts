export interface CreateSource {
    location: string;
    password?: string;
    name: string;
}

export interface LoadSource {
    location: string;
    password?: string;
}

export interface Source {
    id: string;
    location: string;
    name: string;
    version: string;
}
