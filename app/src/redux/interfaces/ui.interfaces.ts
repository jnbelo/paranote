export interface UiState {
    selectedSource?: string;
    selectedNote?: number;
    orderNotesBy: OrderBy;
}

export type OrderBy = 'createdAt' | 'updatedAt' | 'title';
