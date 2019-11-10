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
    userName: string;
    createdAt: string;
    imageUrl?: string;
}

export interface Destination {
    name: string;
    startTime: string;
    endTime: string;
}
