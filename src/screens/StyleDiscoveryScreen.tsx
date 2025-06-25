import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { OutfitPhoto } from "../types";

// Mock outfit data - in a real app, this would come from an API
const mockOutfits: OutfitPhoto[] = [
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
];

export function StyleDiscoveryScreen() {
    const { state, dispatch } = useAppContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Initialize outfit photos if not already set
        if (state.outfitPhotos.length === 0) {
            dispatch({ type: "SET_OUTFIT_PHOTOS", photos: mockOutfits });
        }
    }, [dispatch, state.outfitPhotos.length]);

    const currentOutfit = state.outfitPhotos[currentIndex];
    const hasMoreOutfits = currentIndex < state.outfitPhotos.length - 1;

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setStartPos({ x: touch.clientX, y: touch.clientY });
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - startPos.x;
        const deltaY = touch.clientY - startPos.y;

        setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleTouchEnd = () => {
        const threshold = 100;

        if (Math.abs(dragOffset.x) > threshold) {
            if (dragOffset.x > 0) {
                handleLike();
            } else {
                handlePass();
            }
        }

        setDragOffset({ x: 0, y: 0 });
        setIsDragging(false);
    };

    const handleLike = () => {
        if (currentOutfit) {
            dispatch({ type: "LIKE_OUTFIT", outfit: currentOutfit });
            nextOutfit();
        }
    };

    const handlePass = () => {
        nextOutfit();
    };

    const nextOutfit = () => {
        if (hasMoreOutfits) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            // Navigate to recommendations when we've seen all outfits
            dispatch({ type: "NAVIGATE_TO", screen: "recommendations" });
        }
    };

    const getCardStyle = () => {
        const rotation = dragOffset.x * 0.1;
        const opacity = 1 - Math.abs(dragOffset.x) / 300;

        return {
            transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
            opacity: Math.max(0.5, opacity),
        };
    };

    const getLikeIndicatorOpacity = () => {
        return Math.max(0, dragOffset.x / 150);
    };

    const getPassIndicatorOpacity = () => {
        return Math.max(0, -dragOffset.x / 150);
    };

    if (!currentOutfit) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading outfits...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() =>
                            dispatch({ type: "NAVIGATE_TO", screen: "home" })
                        }
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold">Style Discovery</h1>
                    <button
                        onClick={() =>
                            dispatch({
                                type: "NAVIGATE_TO",
                                screen: "recommendations",
                            })
                        }
                        className="text-purple-600 text-sm font-medium"
                    >
                        Skip
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="absolute top-16 left-4 right-4 z-20">
                <div className="bg-gray-200 rounded-full h-1">
                    <div
                        className="bg-purple-600 h-1 rounded-full transition-all duration-300"
                        style={{
                            width: `${
                                ((currentIndex + 1) /
                                    state.outfitPhotos.length) *
                                100
                            }%`,
                        }}
                    ></div>
                </div>
            </div>

            {/* Card stack */}
            <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-32">
                <div className="relative w-full max-w-sm h-[600px]">
                    {/* Current card */}
                    <div
                        className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
                        style={getCardStyle()}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Like indicator */}
                        <div
                            className="absolute top-8 right-8 z-10 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg transform rotate-12"
                            style={{ opacity: getLikeIndicatorOpacity() }}
                        >
                            LIKE
                        </div>

                        {/* Pass indicator */}
                        <div
                            className="absolute top-8 left-8 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg transform -rotate-12"
                            style={{ opacity: getPassIndicatorOpacity() }}
                        >
                            PASS
                        </div>

                        {/* Outfit image */}
                        <div className="h-4/5 overflow-hidden">
                            <img
                                src={currentOutfit.imageUrl}
                                alt={currentOutfit.style}
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                        </div>

                        {/* Outfit info */}
                        <div className="p-4 bg-white">
                            <h3 className="text-xl font-bold mb-2">
                                {currentOutfit.style}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {currentOutfit.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Next card preview */}
                    {hasMoreOutfits && state.outfitPhotos[currentIndex + 1] && (
                        <div className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden -z-10 scale-95">
                            <div className="h-4/5 overflow-hidden">
                                <img
                                    src={
                                        state.outfitPhotos[currentIndex + 1]
                                            .imageUrl
                                    }
                                    alt={
                                        state.outfitPhotos[currentIndex + 1]
                                            .style
                                    }
                                    className="w-full h-full object-cover opacity-50"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-8">
                <button
                    onClick={handlePass}
                    className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 active:scale-95 transition-all"
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <button
                    onClick={handleLike}
                    className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 active:scale-95 transition-all"
                >
                    <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
            </div>

            {/* Stats */}
            <div className="absolute top-20 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <p className="text-sm text-gray-600">
                    {state.likedOutfits.length} liked
                </p>
            </div>
        </div>
    );
}
