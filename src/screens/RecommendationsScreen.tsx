import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useRecommendedProducts, ProductCard } from "@shopify/shop-minis-react";

interface ProductWithActions {
    id: string;
    title: string;
    price: string;
    imageUrl: string;
    description?: string;
}

export function RecommendationsScreen() {
    const { state, dispatch } = useAppContext();
    const { products: shopifyProducts, loading } = useRecommendedProducts();
    const [products, setProducts] = useState<ProductWithActions[]>([]);

    // Mock product data based on liked outfits - in a real app this would be AI-generated
    useEffect(() => {
        if (state.likedOutfits.length > 0) {
            const mockProducts: ProductWithActions[] = [
                {
                    id: "prod_1",
                    title: "Cropped Puffer Jacket",
                    price: "$89.99",
                    imageUrl:
                        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop",
                    description: "Perfect for urban casual looks",
                },
                {
                    id: "prod_2",
                    title: "High-Waisted Straight Jeans",
                    price: "$79.99",
                    imageUrl:
                        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
                    description: "Versatile and comfortable",
                },
                {
                    id: "prod_3",
                    title: "Chunky Knit Sweater",
                    price: "$65.99",
                    imageUrl:
                        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop",
                    description: "Cozy and stylish",
                },
                {
                    id: "prod_4",
                    title: "Platform Sneakers",
                    price: "$129.99",
                    imageUrl:
                        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
                    description: "Statement footwear",
                },
                {
                    id: "prod_5",
                    title: "Oversized Blazer",
                    price: "$149.99",
                    imageUrl:
                        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
                    description: "Business chic essential",
                },
                {
                    id: "prod_6",
                    title: "Midi Slip Dress",
                    price: "$95.99",
                    imageUrl:
                        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
                    description: "Elegant and versatile",
                },
            ];
            setProducts(mockProducts);
        }
    }, [state.likedOutfits]);

    const handleTryOn = (productId: string) => {
        dispatch({ type: "START_TRY_ON", productId });
    };

    const handleAddToCart = (productId: string) => {
        dispatch({ type: "ADD_TO_CART", productId });
    };

    const getRecommendationReason = () => {
        if (state.likedOutfits.length === 0) {
            return "Based on popular trends";
        }

        const styles = state.likedOutfits.map(
            (outfit) => outfit.outfitPhoto.style
        );
        const uniqueStyles = [...new Set(styles)];

        if (uniqueStyles.length === 1) {
            return `Because you liked ${uniqueStyles[0]} style`;
        } else {
            return `Based on your ${uniqueStyles
                .slice(0, 2)
                .join(" and ")} preferences`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating your fit...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() =>
                            dispatch({
                                type: "NAVIGATE_TO",
                                screen: "discovery",
                            })
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
                    <h1 className="text-lg font-semibold">For You</h1>
                    <button
                        onClick={() =>
                            dispatch({ type: "NAVIGATE_TO", screen: "cart" })
                        }
                        className="relative p-2 rounded-full hover:bg-gray-100"
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
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6"
                            />
                        </svg>
                        {state.cartItems.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                    {state.cartItems.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                    )}
                                </span>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-lg">✨</span>
                    </div>
                    <h2 className="text-xl font-bold">Your AI Stylist</h2>
                </div>
                <p className="text-white/90">{getRecommendationReason()}</p>
                {state.likedOutfits.length > 0 && (
                    <p className="text-sm text-white/70 mt-1">
                        Based on {state.likedOutfits.length} outfit
                        {state.likedOutfits.length !== 1 ? "s" : ""} you liked
                    </p>
                )}
            </div>

            {/* Products grid */}
            <div className="px-4 py-6">
                <div className="grid grid-cols-2 gap-4">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >
                            {/* Product image */}
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Quick add overlay */}
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                                    <button
                                        onClick={() => handleTryOn(product.id)}
                                        className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-2 hover:translate-y-0 transition-all"
                                    >
                                        Quick Try On
                                    </button>
                                </div>
                            </div>

                            {/* Product info */}
                            <div className="p-3">
                                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">
                                        {product.price}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleTryOn(product.id)
                                            }
                                            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            Try On
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleAddToCart(product.id)
                                            }
                                            className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shopify products section */}
                {shopifyProducts && shopifyProducts.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">
                            More Recommendations
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {shopifyProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {products.length === 0 &&
                    (!shopifyProducts || shopifyProducts.length === 0) && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">👗</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Start Swiping to Get Recommendations
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Like some outfits to receive personalized
                                product suggestions
                            </p>
                            <button
                                onClick={() =>
                                    dispatch({
                                        type: "NAVIGATE_TO",
                                        screen: "discovery",
                                    })
                                }
                                className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
                            >
                                Start Discovering
                            </button>
                        </div>
                    )}
            </div>

            {/* Bottom navigation hint */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-4 py-2 border border-gray-200">
                <p className="text-sm text-gray-600">
                    Tap any item to try it on virtually
                </p>
            </div>
        </div>
    );
}
