import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
    Screen,
    LikedOutfit,
    CartItem,
    TryOnSession,
    OutfitPhoto,
} from "../types";

interface AppState {
    currentScreen: Screen;
    likedOutfits: LikedOutfit[];
    cartItems: CartItem[];
    tryOnSessions: TryOnSession[];
    currentOutfitIndex: number;
    outfitPhotos: OutfitPhoto[];
    isLoading: boolean;
    selectedProductForTryOn?: string;
}

type AppAction =
    | { type: "NAVIGATE_TO"; screen: Screen }
    | { type: "LIKE_OUTFIT"; outfit: OutfitPhoto }
    | { type: "ADD_TO_CART"; productId: string; variantId?: string }
    | { type: "REMOVE_FROM_CART"; productId: string }
    | { type: "START_TRY_ON"; productId: string }
    | {
          type: "UPDATE_TRY_ON";
          sessionId: string;
          updates: Partial<TryOnSession>;
      }
    | { type: "SET_OUTFIT_PHOTOS"; photos: OutfitPhoto[] }
    | { type: "NEXT_OUTFIT" }
    | { type: "SET_LOADING"; isLoading: boolean };

const initialState: AppState = {
    currentScreen: "home",
    likedOutfits: [],
    cartItems: [],
    tryOnSessions: [],
    currentOutfitIndex: 0,
    outfitPhotos: [],
    isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case "NAVIGATE_TO":
            return { ...state, currentScreen: action.screen };

        case "LIKE_OUTFIT":
            const likedOutfit: LikedOutfit = {
                id: `liked_${Date.now()}`,
                outfitPhoto: action.outfit,
                likedAt: new Date(),
            };
            return {
                ...state,
                likedOutfits: [...state.likedOutfits, likedOutfit],
            };

        case "ADD_TO_CART":
            const existingItem = state.cartItems.find(
                (item) => item.productId === action.productId
            );
            if (existingItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((item) =>
                        item.productId === action.productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            const newCartItem: CartItem = {
                productId: action.productId,
                variantId: action.variantId,
                quantity: 1,
                addedAt: new Date(),
            };
            return {
                ...state,
                cartItems: [...state.cartItems, newCartItem],
            };

        case "REMOVE_FROM_CART":
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.productId !== action.productId
                ),
            };

        case "START_TRY_ON":
            return {
                ...state,
                selectedProductForTryOn: action.productId,
                currentScreen: "tryOn",
            };

        case "UPDATE_TRY_ON":
            return {
                ...state,
                tryOnSessions: state.tryOnSessions.map((session) =>
                    session.id === action.sessionId
                        ? { ...session, ...action.updates }
                        : session
                ),
            };

        case "SET_OUTFIT_PHOTOS":
            return { ...state, outfitPhotos: action.photos };

        case "NEXT_OUTFIT":
            return {
                ...state,
                currentOutfitIndex:
                    (state.currentOutfitIndex + 1) % state.outfitPhotos.length,
            };

        case "SET_LOADING":
            return { ...state, isLoading: action.isLoading };

        default:
            return state;
    }
}

const AppContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
