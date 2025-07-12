export interface Messages{
    id: number;
    senderId: number;
    senderUserName: string;
    senderPhotoUrl : string;
    recipientId: number;
    recipientUserName: string;
    recipientPhotoUrl: string;
    content : string;
    dateRed?: Date;
    messageSent: Date;
}