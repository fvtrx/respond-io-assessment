import { GlassTabBar } from "@/components/GlassTabBar";
import { theme } from "@/lib/theme";
import { Tabs } from "expo-router";
import { MessageCircle, Settings } from "lucide-react-native";

export default function TabLayout() {
  const tabs = [
    { name: "index", label: "Chats", icon: MessageCircle },
    { name: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.neutral[400],
        tabBarStyle: { display: "none" },
      }}
      tabBar={(props) => {
        const activeTab =
          props.state.routes[props.state.index]?.name ?? tabs[0].name;
        return (
          <GlassTabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabPress={(name) => {
              const route = props.state.routes.find((r) => r.name === name);
              if (route) {
                props.navigation.navigate(route.name as never);
              }
            }}
          />
        );
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
