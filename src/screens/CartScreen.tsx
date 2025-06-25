import { useState } from "react";
import { useAppContext } from "../context/AppContext";
// import { useShopCartActions } from "@shopify/shop-minis-react";

interface CartProduct {
    id: string;
    title: string;
    price: string;
    imageUrl: string;
    description?: string;
}

export function CartScreen() {
    const { state, dispatch } = useAppContext();
    // const shopCartActions = useShopCartActions();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Mock product data - in a real app this would come from product API
    const getProductInfo = (productId: string): CartProduct => {
        const mockProducts: Record<string, CartProduct> = {
            prod_1: {
                id: "prod_1",
                title: "Cropped Puffer Jacket",
                price: "$89.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop",
                description: "Perfect for urban casual looks",
            },
            prod_2: {
                id: "prod_2",
                title: "High-Waisted Straight Jeans",
                price: "$79.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
                description: "Versatile and comfortable",
            },
            prod_3: {
                id: "prod_3",
                title: "Chunky Knit Sweater",
                price: "$65.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop",
                description: "Cozy and stylish",
            },
            prod_4: {
                id: "prod_4",
                title: "Platform Sneakers",
                price: "$129.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
                description: "Statement footwear",
            },
            prod_5: {
                id: "prod_5",
                title: "Oversized Blazer",
                price: "$149.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
                description: "Business chic essential",
            },
            prod_6: {
                id: "prod_6",
                title: "Midi Slip Dress",
                price: "$95.99",
                imageUrl:
                    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
                description: "Elegant and versatile",
            },
        };

        return (
            mockProducts[productId] || {
                id: productId,
                title: "Unknown Product",
                price: "$0.00",
                imageUrl:
                    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
            }
        );
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            dispatch({ type: "REMOVE_FROM_CART", productId });
        } else {
            // For simplicity, we'll remove and re-add with the new quantity
            dispatch({ type: "REMOVE_FROM_CART", productId });
            for (let i = 0; i < newQuantity; i++) {
                dispatch({ type: "ADD_TO_CART", productId });
            }
        }
    };

    const handleRemoveItem = (productId: string) => {
        dispatch({ type: "REMOVE_FROM_CART", productId });
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);

        try {
            // In a real app, this would use the Shopify Cart Actions
            // For now, we'll simulate the checkout process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Clear cart after successful checkout
            state.cartItems.forEach((item) => {
                dispatch({
                    type: "REMOVE_FROM_CART",
                    productId: item.productId,
                });
            });

            // Show success message or navigate to success screen
            alert("Order placed successfully!");
            dispatch({ type: "NAVIGATE_TO", screen: "home" });
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const calculateSubtotal = () => {
        return state.cartItems.reduce((total, item) => {
            const product = getProductInfo(item.productId);
            const price = parseFloat(product.price.replace("$", ""));
            return total + price * item.quantity;
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    const totalItems = state.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    if (state.cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() =>
                                dispatch({
                                    type: "NAVIGATE_TO",
                                    screen: "recommendations",
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
                        <h1 className="text-lg font-semibold">Shopping Cart</h1>
                        <div className="w-10"></div>
                    </div>
                </div>

                {/* Empty cart state */}
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="text-center max-w-sm">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-12 h-12 text-gray-400"
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
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Add some items from our recommendations to get
                            started!
                        </p>
                        <button
                            onClick={() =>
                                dispatch({
                                    type: "NAVIGATE_TO",
                                    screen: "recommendations",
                                })
                            }
                            className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
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
                                screen: "recommendations",
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
                    <h1 className="text-lg font-semibold">
                        Shopping Cart ({totalItems})
                    </h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="flex-1 pb-32">
                {/* Cart items */}
                <div className="px-4 py-4 space-y-4">
                    {state.cartItems.map((item) => {
                        const product = getProductInfo(item.productId);
                        return (
                            <div
                                key={item.productId}
                                className="bg-white rounded-xl p-4 shadow-sm"
                            >
                                <div className="flex space-x-4">
                                    {/* Product image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-20 h-24 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Product details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-lg text-gray-900">
                                                {product.price}
                                            </span>

                                            {/* Quantity controls */}
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.productId,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M20 12H4"
                                                        />
                                                    </svg>
                                                </button>
                                                <span className="font-medium text-gray-900 min-w-[20px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.productId,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        onClick={() =>
                                            handleRemoveItem(item.productId)
                                        }
                                        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue shopping */}
                <div className="px-4 py-4">
                    <button
                        onClick={() =>
                            dispatch({
                                type: "NAVIGATE_TO",
                                screen: "recommendations",
                            })
                        }
                        className="w-full text-purple-600 font-medium py-3 text-center border border-purple-600 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span>Continue Shopping</span>
                    </button>
                </div>
            </div>

            {/* Checkout section - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 space-y-4">
                {/* Order summary */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Checkout button */}
                <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isCheckingOut ? (
                        <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <span>Secure Checkout</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
