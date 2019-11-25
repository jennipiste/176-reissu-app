export interface User {
    uid: string;
    username: string;
    email: string;
    avatarUrl: string;
    description: string;
}

export interface Post {
    uid: string;
    text: string;
    destination: string;
    date: string;
    userUid: string;
    createdAt: string;
    imageUrls?: string[];
}

export interface Destination {
    name: string;
    startTime: string;
    endTime: string;
}

export interface Packing {
    id: number;
    name: string;
    category: Category;
    completed: boolean;
}

export enum Category {
    important = 'Tärkeät',
    clothes = 'Vaatteet ja kengät',
    accessories = 'Asusteet',
    hygiene = 'Toilettilaukkuun',
    firstaid = 'Ensiapulaukkuun',
    phone = 'Puhelimeen',
    other = 'Muuta',
}
