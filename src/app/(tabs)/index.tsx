import { Avatar } from "@/components/Avatar";
import { ChatListSkeleton } from "@/components/ChatListSkeleton";
import { ConversationRow } from "@/components/ConversationRow";
import { EmptyState } from "@/components/EmptyState";
import { useContactsInfinite } from "@/hooks/queries";
import { theme } from "@/lib/theme";
import type { ApiUser } from "@/lib/types";
import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import { router } from "expo-router";
import { MessageSquareOff, RefreshCw, Search } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useContactsInfinite();
  const [search, setSearch] = useState("");

  const allContacts = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  const pinnedContacts = useMemo(() => allContacts.slice(0, 6), [allContacts]);

  const contacts = useMemo(() => {
    if (!search.trim()) return allContacts;
    const q = search.toLowerCase();
    return allContacts.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  }, [allContacts, search]);

  const handlePress = useCallback((user: ApiUser) => {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: String(user.id),
        name: user.name,
        avatar: user.avatar ?? "",
      },
    });
  }, []);

  const renderItem: ListRenderItem<ApiUser> = useCallback(
    ({ item }) => (
      <ConversationRow
        user={item}
        onPress={handlePress}
        lastMessage={lastMessageFor(item)}
        timestamp={lastTimestampFor(item)}
      />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: ApiUser) => String(item.id), []);

  const ListHeader = useCallback(() => {
    return (
      <>
        {!search.trim() && pinnedContacts.length > 0 ? (
          <View style={styles.pinnedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pinned Chats</Text>
              {/* <TouchableOpacity style={styles.seeAll} activeOpacity={0.6}>
                <Text style={styles.seeAllText}>See all</Text>
                <ChevronRight
                  size={15}
                  color={theme.colors.primary[500]}
                  strokeWidth={2}
                />
              </TouchableOpacity> */}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pinnedRow}
            >
              {pinnedContacts.map((user) => (
                <TouchableOpacity
                  key={`pinned-${user.id}`}
                  style={styles.pinnedItem}
                  onPress={() => handlePress(user)}
                  activeOpacity={0.7}
                >
                  <Avatar uri={user.avatar} name={user.name} size={56} />
                  <Text style={styles.pinnedName} numberOfLines={1}>
                    {user.name.split(" ")[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {contacts.length > 0 ? (
          <Text style={styles.listHeading}>Recent Conversations</Text>
        ) : null}
      </>
    );
  }, [pinnedContacts, search, handlePress, contacts.length]);

  const ListEmpty = useCallback(() => {
    return (
      <View style={styles.emptyWrap}>
        <EmptyState
          title={search ? "No contacts found" : "No conversations yet"}
          message={
            search
              ? "Try a different name."
              : "Contacts you message will appear here."
          }
          icon={
            <MessageSquareOff
              size={40}
              color={theme.colors.neutral[300]}
              strokeWidth={2}
            />
          }
        />
      </View>
    );
  }, [search]);

  const ListFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return <ChatListSkeleton count={3} />;
  }, [isFetchingNextPage]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View
          style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}
        >
          <Text style={styles.title}>Chats</Text>
          <View style={styles.searchWrap}>
            <Search
              size={18}
              color={theme.colors.neutral[400]}
              strokeWidth={2}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations"
              placeholderTextColor={theme.colors.neutral[400]}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
        <ChatListSkeleton count={10} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View
          style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}
        >
          <Text style={styles.title}>Chats</Text>
          <View style={styles.searchWrap}>
            <Search
              size={18}
              color={theme.colors.neutral[400]}
              strokeWidth={2}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations"
              placeholderTextColor={theme.colors.neutral[400]}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
        <EmptyState
          title="Couldn't load conversations"
          message="Pull down to try again."
          icon={
            <RefreshCw
              size={40}
              color={theme.colors.neutral[300]}
              strokeWidth={2}
            />
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}
      >
        <Text style={styles.title}>Chats</Text>
        <View style={styles.searchWrap}>
          <Search size={18} color={theme.colors.neutral[400]} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor={theme.colors.neutral[400]}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <FlashList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={ListFooter}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function lastMessageFor(_user: ApiUser): string {
  return "Tap to start chatting";
}

function lastTimestampFor(_user: ApiUser): string {
  return "12:30";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomColor: theme.colors.neutral[100],
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.neutral[50],
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  pinnedSection: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.primary[500],
  },
  pinnedRow: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  pinnedItem: {
    alignItems: "center",
    width: 64,
  },
  pinnedName: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  categoryBar: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  categoryPill: {
    paddingHorizontal: theme.spacing.md + 2,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.neutral[50],
  },
  categoryPillActive: {
    backgroundColor: theme.colors.primary[500],
  },
  categoryText: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.textSecondary,
  },
  categoryTextActive: {
    color: theme.colors.textInverse,
  },
  listSection: {
    paddingTop: theme.spacing.lg,
  },
  listHeading: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyWrap: {
    paddingTop: theme.spacing.xl,
  },
});
