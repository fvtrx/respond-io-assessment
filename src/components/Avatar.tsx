import { theme } from "@/lib/theme";
import { initials as getInitials } from "@/utils/format";
import { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
};

export function Avatar({ uri, name, size = 44 }: AvatarProps) {
  const dim = size;
  const fontSize = Math.round(size * 0.38);
  const placeholderColor = useMemo(() => shadeFromString(name), [name]);

  const styles = StyleSheet.create({
    container: {
      width: dim,
      height: dim,
      borderRadius: dim / 2,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: placeholderColor,
    },
    image: { width: "100%", height: "100%" },
    text: {
      color: theme.colors.textInverse,
      fontSize,
      fontFamily: theme.typography.fontFamilySemiBold,
    },
  });

  if (uri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri }} style={styles.image} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{getInitials(name)}</Text>
    </View>
  );
}

function shadeFromString(str: string): string {
  const palette = [
    theme.colors.primary[500],
    theme.colors.accent[500],
    theme.colors.primary[700],
    theme.colors.accent[700],
    theme.colors.primary[400],
    theme.colors.accent[400],
  ];
  const hash = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return palette[hash % palette.length];
}
