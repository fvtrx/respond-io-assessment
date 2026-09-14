import { theme } from "@/lib/theme";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import type { LucideIcon } from "lucide-react-native";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type GlassTabConfig = {
  name: string;
  label: string;
  icon: LucideIcon;
};

type GlassTabBarProps = {
  tabs: GlassTabConfig[];
  activeTab: string;
  onTabPress: (tabName: string) => void;
};

export function GlassTabBar({ tabs, activeTab, onTabPress }: GlassTabBarProps) {
  const insets = useSafeAreaInsets();

  const handlePress = (name: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onTabPress(name);
  };

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <BlurView
        tint="light"
        intensity={40}
        blurMethod="dimezisBlurView"
        style={styles.blurContainer}
      >
        <View style={styles.pillInner}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const focused = activeTab === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabItem}
                onPress={() => handlePress(tab.name)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
              >
                <View
                  style={[styles.iconWrap, focused && styles.iconWrapActive]}
                >
                  <Icon
                    size={21}
                    color={
                      focused
                        ? theme.colors.primary[500]
                        : theme.colors.neutral[400]
                    }
                    strokeWidth={focused ? 2.3 : 2}
                  />
                </View>
                <Text
                  style={[styles.label, focused && styles.labelActive]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.6)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
    }),
  },
  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor:
      Platform.OS === "web" ? "rgba(255,255,255,0.72)" : "transparent",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    paddingVertical: 2,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 48,
    borderRadius: 15,
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primary[50],
  },
  label: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.neutral[400],
  },
  labelActive: {
    color: theme.colors.primary[500],
    fontFamily: theme.typography.fontFamilySemiBold,
  },
});
