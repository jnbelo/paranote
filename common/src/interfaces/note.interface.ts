export interface CreateNote {
    title: string;
    content: string;
}

export interface UpdateNote {
    title: string;
    content: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
