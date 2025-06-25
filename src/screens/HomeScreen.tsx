import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export function HomeScreen() {
    const { dispatch } = useAppContext();
    const [startY, setStartY] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY === null) return;

        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;

        // If swiped up more than 50px, navigate to discovery
        if (deltaY > 50) {
            dispatch({ type: "NAVIGATE_TO", screen: "discovery" });
            setStartY(null);
        }
    };

    const handleTouchEnd = () => {
        setStartY(null);
    };

    const handleGetStarted = () => {
        dispatch({ type: "NAVIGATE_TO", screen: "discovery" });
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 flex flex-col justify-center items-center px-6 relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
                <div className="absolute top-40 right-8 w-24 h-24 bg-white rounded-full blur-lg"></div>
                <div className="absolute bottom-32 left-6 w-28 h-28 bg-white rounded-full blur-xl"></div>
            </div>

            {/* Main content */}
            <div className="text-center z-10">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                        Swypify
                    </h1>
                    <p className="text-xl text-white/90 font-medium">
                        Build Your Next Fit
                    </p>
                </div>

                <div className="mb-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="text-4xl">👗</div>
                    </div>
                    <p className="text-lg text-white/80 mb-2">
                        Discover your style with AI-powered
                    </p>
                    <p className="text-lg text-white/80">
                        fashion recommendations
                    </p>
                </div>

                {/* Swipe up indicator */}
                <div className="flex flex-col items-center space-y-4">
                    <button
                        onClick={handleGetStarted}
                        className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                    >
                        Get Started
                    </button>

                    <div className="flex flex-col items-center space-y-2 text-white/70">
                        <p className="text-sm">or swipe up</p>
                        <div className="animate-bounce">
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
                                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
    );
}
