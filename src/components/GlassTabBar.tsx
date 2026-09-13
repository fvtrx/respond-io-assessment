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
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <BlurView
        tint={theme.colors.background === "#f4f2fc" ? "light" : "dark"}
        intensity={65}
        experimentalBlurMethod="dimezisBlurView"
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
                    size={focused ? 24 : 22}
                    color={
                      focused
                        ? theme.colors.primary[500]
                        : theme.colors.neutral[400]
                    }
                    strokeWidth={focused ? 2.4 : 2}
                  />
                </View>
                <Text
                  style={[styles.label, focused && styles.labelActive]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
                {focused ? (
                  <View style={styles.activeIndicator} />
                ) : (
                  <View style={styles.inactiveIndicator} />
                )}
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
    borderRadius: 28,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
    }),
  },
  pillInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor:
      Platform.OS === "web" ? "rgba(255,255,255,0.82)" : "transparent",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    width: 56,
    borderRadius: 16,
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primary[50],
  },
  label: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.neutral[400],
  },
  labelActive: {
    color: theme.colors.primary[500],
    fontFamily: theme.typography.fontFamilySemiBold,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary[500],
    marginTop: 2,
  },
  inactiveIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "transparent",
    marginTop: 2,
  },
});
