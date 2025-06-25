import { AppProvider, useAppContext } from "./context/AppContext";
import { HomeScreen } from "./screens/HomeScreen";
import { StyleDiscoveryScreen } from "./screens/StyleDiscoveryScreen";
import { RecommendationsScreen } from "./screens/RecommendationsScreen";
import { TryOnScreen } from "./screens/TryOnScreen";
import { CartScreen } from "./screens/CartScreen";

function AppRouter() {
    const { state } = useAppContext();

    switch (state.currentScreen) {
        case "home":
            return <HomeScreen />;
        case "discovery":
            return <StyleDiscoveryScreen />;
        case "recommendations":
            return <RecommendationsScreen />;
        case "tryOn":
            return <TryOnScreen />;
        case "cart":
            return <CartScreen />;
        default:
            return <HomeScreen />;
    }
}

export function App() {
    return (
        <AppProvider>
            <div className="min-h-screen bg-gray-50">
                <AppRouter />
            </div>
        </AppProvider>
    );
}
