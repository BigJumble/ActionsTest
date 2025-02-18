export interface Message {
    userName: string;
    message: string;
    // date: number;
}

export interface MetaMessage extends Message{
    date: number;
}