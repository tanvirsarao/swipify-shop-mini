export const API_ENDPOINTS = {
    FASHN_TRYON: "https://api.fashn.ai/v1/run",
} as const;

export const TRYON_CONFIG = {
    MODEL_NAME: "tryon-v1.6",
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_FORMATS: ["image/jpeg", "image/png", "image/webp"],
} as const;

export const SCREEN_NAMES = {
    HOME: "home",
    DISCOVERY: "discovery",
    RECOMMENDATIONS: "recommendations",
    TRY_ON: "tryOn",
    CART: "cart",
} as const;

export const MOCK_OUTFIT_PHOTOS = [
    {
        id: "1",
        imageUrl:
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop",
        tags: ["casual", "streetwear", "trendy"],
        style: "Urban Casual",
        season: "spring",
    },
    {
        id: "2",
        imageUrl:
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop",
        tags: ["elegant", "formal", "chic"],
        style: "Business Chic",
        season: "fall",
    },
    {
        id: "3",
        imageUrl:
            "https://images.unsplash.com/photo-1544957992-20327709a927?w=400&h=600&fit=crop",
        tags: ["boho", "relaxed", "vintage"],
        style: "Bohemian",
        season: "summer",
    },
    {
        id: "4",
        imageUrl:
            "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&h=600&fit=crop",
        tags: ["sporty", "athletic", "active"],
        style: "Athleisure",
        season: "spring",
    },
    {
        id: "5",
        imageUrl:
            "https://images.unsplash.com/photo-1542272454315-7ad9b6592e8d?w=400&h=600&fit=crop",
        tags: ["minimalist", "clean", "modern"],
        style: "Minimalist",
        season: "fall",
    },
] as const;
