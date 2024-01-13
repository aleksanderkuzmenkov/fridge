import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useCallback, useEffect, useRef, useState } from "react"; // Добавлено useRef
import { Login, Register, AccountSettings, ConfirmEmail } from "./screens";
import { UserProvider } from "./context/userContext";
import Home from "./screens/Home";
import SideMenu from "./screens/SideMenu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from "./utils/StorageUtil";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {

  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Sen-Regular.ttf"),
    bold: require("./assets/fonts/Sen-Bold.ttf"),
    extraBold: require("./assets/fonts/Sen-ExtraBold.ttf")
  });

  const navigationRef = useRef();

  const [userData, setUserData] = useState(null);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const loadData = async () => {
          const data = await getUserData();
          if (data) {
            setUserData(data);
          }
        };

        loadData();

        // Проверка наличия данных пользователя
        if (userData) {
          console.log(userData);
          // Если данные есть, перенаправление на экран Home
          // Перенаправление на экран Home во вложенном Drawer.Navigator
          navigationRef.current?.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                state: {
                  routes: [{ name: 'Home' }],
                }
              }
            ],
          });
        } else {
          console.log('Userdata empty');
          // Если данные отсутствуют, перенаправление на экран Login
          navigationRef.current?.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      } catch (error) {
        console.error('Error checking user login:', error);
        // В случае ошибки также перенаправляем на экран Login
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    // Вызываем checkUserLogin после монтирования навигации
    if (navigationRef.current) {
      checkUserLogin();
    }
  }, [fontsLoaded, navigationRef]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              options={{
                headerShown: false,
              }}
            >
              {() => (
                <Drawer.Navigator
                  initialRouteName="Home"
                  drawerContent={(props) => <SideMenu {...props} />}
                >
                  <Drawer.Screen name="Home" component={Home} />
                  <Drawer.Screen name="AccountSettings" component={AccountSettings} />
                  <Drawer.Screen name="ConfirmEmail" component={ConfirmEmail} />
                </Drawer.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettings}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ConfirmEmail"
              component={ConfirmEmail}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </UserProvider>
  );
}

export default App;
