export interface SourcesState {
    loading: boolean;
    error?: string;
    byId: { [key: string]: Source };
    allIds: string[];
}

export interface Source {
    id: string;
    name: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SourceCreate {
    name: string;
    location: string;
    password: string;
}

export interface SourceLoad {
    location: string;
    password: string;
}
