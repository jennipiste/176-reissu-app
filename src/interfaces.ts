export interface User {
    uid: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

export interface Post {
    uid: string;
    title: string;
    text: string;
    date: number;
    userUid: string;
    userName: string;
    createdAt: string;
    imageUrl?: string;
}
