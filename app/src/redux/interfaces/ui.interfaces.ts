export interface UiState {
    selectedSource?: string;
    selectedNote?: number;
    sortNotesBy: SortBy;
}

export type SortBy = 'createdAt' | 'updatedAt' | 'title';
