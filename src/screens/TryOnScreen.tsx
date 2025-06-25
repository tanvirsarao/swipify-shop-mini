import React, { useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";

interface TryOnResult {
    id: string;
    originalImage: string;
    resultImage: string;
    productId: string;
}

export function TryOnScreen() {
    const { state, dispatch } = useAppContext();
    const [userImage, setUserImage] = useState<string | null>(null);
    const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<"upload" | "processing" | "result">(
        "upload"
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedProductId = state.selectedProductForTryOn;

    // Mock product data - in a real app this would come from product API
    const getProductInfo = (productId: string) => {
        const mockProducts = {
            prod_1: {
                title: "Cropped Puffer Jacket",
                price: "$89.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop",
            },
            prod_2: {
                title: "High-Waisted Straight Jeans",
                price: "$79.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
            },
        };
        return (
            mockProducts[productId as keyof typeof mockProducts] || {
                title: "Selected Item",
                price: "$99.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
            }
        );
    };

    const productInfo = selectedProductId
        ? getProductInfo(selectedProductId)
        : null;

    const handleImageUpload = async (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setUserImage(imageUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleTakePhoto = async () => {
        // In a real app, this would use the device camera
        // For now, we'll just trigger the file input
        fileInputRef.current?.click();
    };

    const handleStartTryOn = async () => {
        if (!userImage || !selectedProductId || !productInfo) return;

        setIsProcessing(true);
        setStep("processing");

        try {
            // Mock API call to Fashn AI or similar service
            // In a real app, this would call the actual try-on API
            const mockTryOnCall = async () => {
                return new Promise<string>((resolve) => {
                    setTimeout(() => {
                        // Return a mock result image (in reality this would be from the API)
                        resolve(
                            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop"
                        );
                    }, 3000);
                });
            };

            const resultImageUrl = await mockTryOnCall();

            const result: TryOnResult = {
                id: `tryon_${Date.now()}`,
                originalImage: userImage,
                resultImage: resultImageUrl,
                productId: selectedProductId,
            };

            setTryOnResult(result);
            setStep("result");
        } catch (error) {
            console.error("Try-on failed:", error);
            // Handle error state
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddToCart = () => {
        if (selectedProductId) {
            dispatch({ type: "ADD_TO_CART", productId: selectedProductId });
            // Show success feedback
        }
    };

    const handleStartOver = () => {
        setUserImage(null);
        setTryOnResult(null);
        setStep("upload");
    };

    const handleGoBack = () => {
        dispatch({ type: "NAVIGATE_TO", screen: "recommendations" });
    };

    // Upload step
    if (step === "upload") {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={handleGoBack}
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
                        <h1 className="text-lg font-semibold">
                            Virtual Try-On
                        </h1>
                        <div className="w-10"></div>
                    </div>
                </div>

                {/* Product info */}
                {productInfo && (
                    <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-4">
                            <img
                                src={productInfo.imageUrl}
                                alt={productInfo.title}
                                className="w-16 h-20 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {productInfo.title}
                                </h3>
                                <p className="text-purple-600 font-semibold">
                                    {productInfo.price}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {userImage ? (
                    /* Preview uploaded image */
                    <div className="px-4 py-6">
                        <div className="bg-white rounded-xl p-4 mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-center">
                                Your Photo
                            </h3>
                            <div className="aspect-[3/4] max-w-xs mx-auto overflow-hidden rounded-xl">
                                <img
                                    src={userImage}
                                    alt="User upload"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleStartTryOn}
                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors"
                            >
                                Try On This Item
                            </button>
                            <button
                                onClick={handleStartOver}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Choose Different Photo
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Upload options */
                    <div className="px-4 py-8">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-12 h-12 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Upload Your Photo
                            </h2>
                            <p className="text-gray-600">
                                Take or upload a full-body photo to see how this
                                item looks on you
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleTakePhoto}
                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-3"
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
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span>Take Photo</span>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-white border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-colors flex items-center justify-center space-x-3"
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
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <span>Upload from Gallery</span>
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                            <h4 className="font-medium text-blue-900 mb-2">
                                📸 Photo Tips
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Use good lighting</li>
                                <li>• Stand in front of a plain background</li>
                                <li>• Make sure your full body is visible</li>
                                <li>• Face the camera directly</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Processing step
    if (step === "processing") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Generating Your Fit...
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Our AI is creating your virtual try-on
                    </p>
                    <div className="flex justify-center">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                            <div
                                className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                                className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Result step
    if (step === "result" && tryOnResult) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={handleGoBack}
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
                        <h1 className="text-lg font-semibold">
                            Your Virtual Try-On
                        </h1>
                        <button
                            onClick={handleStartOver}
                            className="text-purple-600 text-sm font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>

                <div className="px-4 py-6">
                    {/* Before/After comparison */}
                    <div className="bg-white rounded-xl p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            See the difference
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2 text-center">
                                    Before
                                </p>
                                <div className="aspect-[3/4] overflow-hidden rounded-lg">
                                    <img
                                        src={tryOnResult.originalImage}
                                        alt="Original"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2 text-center">
                                    After
                                </p>
                                <div className="aspect-[3/4] overflow-hidden rounded-lg">
                                    <img
                                        src={tryOnResult.resultImage}
                                        alt="Try-on result"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors"
                        >
                            Add to Cart - {productInfo?.price}
                        </button>
                        <button
                            onClick={() => {
                                /* Share functionality */
                            }}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            Share Your Look
                        </button>
                        <button
                            onClick={handleStartOver}
                            className="w-full border border-gray-300 bg-white text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Try Different Photo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
