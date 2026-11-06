import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider, useCart } from './CartContext';
import { FavouritesProvider } from './FavouritesContext';
import { OrdersProvider } from './OrdersContext';
import { ThemeProvider, useTheme } from './theme';
import { ToastProvider } from './ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import FavouritesScreen from './screens/FavouritesScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import { RootStackParamList, TabParamList } from './types';

// One QueryClient holds the server-data cache for the whole app.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // data counts as fresh for 1 minute
      retry: 2, // retry failed requests twice
    },
  },
});

// LESSON: NAVIGATION
// Stack = screens pushed on top of each other (back button goes back).
// Tabs  = switch between top-level sections with a bottom bar.
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const tabIconStyle = StyleSheet.create({ emoji: { fontSize: 20 } });
const icon = (emoji: string) => () => (
  <Text style={tabIconStyle.emoji}>{emoji}</Text>
);

function Tabs() {
  const { totalCount } = useCart(); // red badge on the Cart tab
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Shop"
        component={ProductListScreen}
        options={{ tabBarIcon: icon('🛍') }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ tabBarIcon: icon('❤️') }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: totalCount > 0 ? totalCount : undefined,
          tabBarIcon: icon('🛒'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: icon('👤') }}
      />
    </Tab.Navigator>
  );
}

const splashStyle = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

// LESSON: AUTH-BASED NAVIGATION
// Which screens exist depends on state. When `user` becomes null (logout)
// the app screens disappear and Login appears, with no manual navigate().
function Root() {
  const { user, restoring } = useAuth();
  const { colors, isDark } = useTheme();

  // Teach React Navigation our colours (headers, tab bar, backgrounds).
  const navTheme: Theme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.surface,
    },
  };

  if (restoring) {
    return (
      <View style={[splashStyle.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Detail"
              component={ProductDetailScreen}
              options={{ title: 'Product' }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ title: 'Checkout' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// LESSON: PROVIDER ORDER MATTERS
// A component can only use contexts that wrap it. Theme is outermost
// (everything needs colours); the error boundary sits inside it so its
// fallback screen is themed too.
export default function ShopApp() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <CartProvider>
                <FavouritesProvider>
                  <OrdersProvider>
                    <ToastProvider>
                      <Root />
                    </ToastProvider>
                  </OrdersProvider>
                </FavouritesProvider>
              </CartProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
