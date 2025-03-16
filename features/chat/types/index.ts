type Chats = {
    id: string;
    createdAt: Date;
    messages: {
        content: string;
        createdAt: Date;
        sender: {
            displayName: string;
            id: string;
        };
    }[];
    listing: {
        title: string;
        ListingImage: {
            image: {
                url: string;
            };
        }[];
    };
}[]

type ChatUser = {
    displayName: string;
    photoUrl: string;
    id: string;
    createdAt: Date;
}

type ChatListing = {
    title: string;
    price: number;
    region: string;
    municipality: string;
    ListingImage: {
        image: {
            url: string;
        };
    }[];
}