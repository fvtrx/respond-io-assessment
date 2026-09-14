import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { MessageBubble } from "@/components/MessageBubble";
import { MessageSkeleton } from "@/components/MessageSkeleton";
import { useMessages, useSendMessage } from "@/hooks/queries";
import { theme } from "@/lib/theme";
import type { Message } from "@/lib/types";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  MessageSquareOff,
  Mic,
  Paperclip,
  Phone,
  RefreshCw,
  Send,
  Smile,
  Video,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const userId = Number(params.id);
  const contactName = params.name ?? "Contact";
  const contactAvatar = params.avatar || undefined;
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useMessages(userId);
  const sendMessage = useSendMessage(userId);
  const [draft, setDraft] = useState("");

  const messages: Message[] = useMemo(() => {
    return (posts ?? []).map((p) => ({
      ...p,
      direction: p.isOutgoing ? ("outgoing" as const) : ("incoming" as const),
    }));
  }, [posts]);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isLoading]);

  const handleSend = useCallback(() => {
    const body = draft.trim();
    if (!body || sendMessage.isPending) return;
    setDraft("");
    sendMessage.mutate(body);
  }, [draft, sendMessage]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.6}
        >
          <ArrowLeft
            size={22}
            color={theme.colors.textPrimary}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfo}
          activeOpacity={0.6}
          onPress={() =>
            router.push({
              pathname: "/profile/[id]",
              params: {
                id: String(userId),
                name: contactName,
                avatar: contactAvatar ?? "",
              },
            })
          }
        >
          <Avatar uri={contactAvatar} name={contactName} size={38} />
          <View style={styles.headerText}>
            <Text style={styles.headerName} numberOfLines={1}>
              {contactName}
            </Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6}>
            <Video
              size={20}
              color={theme.colors.textSecondary}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6}>
            <Phone
              size={20}
              color={theme.colors.textSecondary}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ScrollView
          style={styles.messageList}
          contentContainerStyle={{ paddingVertical: theme.spacing.md }}
          showsVerticalScrollIndicator={false}
        >
          <MessageSkeleton />
        </ScrollView>
      ) : isError ? (
        <EmptyState
          title="Couldn't load messages"
          message="Pull down to retry."
          icon={
            <RefreshCw
              size={40}
              color={theme.colors.neutral[300]}
              strokeWidth={2}
            />
          }
        />
      ) : messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          message="Send the first message below."
          icon={
            <MessageSquareOff
              size={40}
              color={theme.colors.neutral[300]}
              strokeWidth={2}
            />
          }
        />
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={{
            paddingVertical: theme.spacing.md,
            paddingBottom: insets.bottom + 90,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary[500]}
              colors={[theme.colors.primary[500]]}
            />
          }
        >
          {messages.map((msg, index) => (
            <MessageBubble
              key={`${msg.id}-${msg.createdAt ?? "no-date"}-${index}`}
              body={msg.body}
              direction={msg.direction}
              createdAt={msg.createdAt}
            />
          ))}
        </ScrollView>
      )}

      {sendMessage.isError ? (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>Failed to send — try again</Text>
        </View>
      ) : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.inputBar,
            {
              paddingBottom:
                insets.bottom > 0 ? insets.bottom : theme.spacing.sm,
            },
          ]}
        >
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.6}>
            <Paperclip
              size={22}
              color={theme.colors.neutral[400]}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.neutral[400]}
              value={draft}
              onChangeText={setDraft}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity style={styles.emojiBtn} activeOpacity={0.6}>
              <Smile
                size={20}
                color={theme.colors.neutral[400]}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
          {draft.trim() ? (
            <TouchableOpacity
              style={[
                styles.sendBtn,
                sendMessage.isPending && styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={sendMessage.isPending}
              activeOpacity={0.7}
            >
              <Send
                size={20}
                color={theme.colors.textInverse}
                strokeWidth={2}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micBtn} activeOpacity={0.6}>
              <Mic
                size={22}
                color={theme.colors.neutral[400]}
                strokeWidth={2}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomColor: theme.colors.neutral[100],
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: theme.spacing.sm,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  headerText: {
    marginLeft: theme.spacing.sm,
  },
  headerName: {
    fontSize: theme.typography.bodyLarge,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textPrimary,
  },
  headerStatus: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.accent[500],
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    flex: 1,
  },
  errorBar: {
    backgroundColor: theme.colors.error + "1a",
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.error,
    textAlign: "center",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.neutral[100],
    borderTopWidth: 1,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 42,
    maxHeight: 120,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.neutral[50],
  },
  input: {
    flex: 1,
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textPrimary,
    paddingVertical: 8,
  },
  emojiBtn: {
    padding: theme.spacing.xs,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary[500],
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
