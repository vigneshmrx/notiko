export type Note = {
    id: string;
    text: string | null;
    content: string | null;
    updatedAt: string;
};

export const noteCache = new Map<string, Note>();