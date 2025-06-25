import React from "react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    message?: string;
    className?: string;
}

export function LoadingSpinner({
    size = "md",
    message,
    className = "",
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <div
            className={`flex flex-col items-center justify-center ${className}`}
        >
            <div
                className={`${sizeClasses[size]} border-2 border-purple-600 border-t-transparent rounded-full animate-spin`}
            />
            {message && (
                <p className="mt-3 text-gray-600 text-center">{message}</p>
            )}
        </div>
    );
}
