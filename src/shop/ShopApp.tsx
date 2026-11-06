import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider, useCart } from './CartContext';
import { FavouritesProvider } from './FavouritesContext';
import { OrdersProvider } from './OrdersContext';
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

const icon = (emoji: string) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

function Tabs() {
  const { totalCount } = useCart(); // red badge on the Cart tab

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563EB' }}
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

// LESSON: AUTH-BASED NAVIGATION
// Which screens exist depends on state. When `user` becomes null (logout)
// the app screens disappear and Login appears, with no manual navigate().
function Root() {
  const { user, restoring } = useAuth();

  if (restoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
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

export default function ShopApp() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <FavouritesProvider>
            <OrdersProvider>
              <Root />
            </OrdersProvider>
          </FavouritesProvider>
        </CartProvider>
      </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
