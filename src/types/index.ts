export interface OutfitPhoto {
    id: string;
    imageUrl: string;
    tags: string[];
    style: string;
    season?: string;
}

export interface LikedOutfit {
    id: string;
    outfitPhoto: OutfitPhoto;
    likedAt: Date;
}

export interface TryOnSession {
    id: string;
    productId: string;
    userImageUrl: string;
    resultImageUrl?: string;
    status: "pending" | "processing" | "completed" | "failed";
    createdAt: Date;
}

export interface CartItem {
    productId: string;
    variantId?: string;
    quantity: number;
    addedAt: Date;
}

export type Screen =
    | "home"
    | "discovery"
    | "recommendations"
    | "tryOn"
    | "cart";

export interface NavigationState {
    currentScreen: Screen;
    history: Screen[];
}

export interface SwipeData {
    likedOutfits: LikedOutfit[];
    currentOutfitIndex: number;
    outfitPhotos: OutfitPhoto[];
}
