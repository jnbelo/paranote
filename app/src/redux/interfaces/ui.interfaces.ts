export interface UiState {
    selectedSource?: string | null | undefined;
    selectedNote?: number | null | undefined;
    sortNotesBy: SortBy;
}

export type SortBy = 'createdAt' | 'updatedAt' | 'title';
