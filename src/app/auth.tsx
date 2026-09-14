import { theme } from "@/lib/theme";
import { useAuthStore } from "@/store/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === "signUp";

  const submit = async () => {
    const cleanEmail = email.trim();
    setError(null);

    if (!cleanEmail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Your password should be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      if (isSignUp) {
        await signUp(cleanEmail, password);
      } else {
        await signIn(cleanEmail, password);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to complete that request.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary[500], theme.colors.primary[700]]}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <MessageCircle
                size={28}
                color={theme.colors.primary[600]}
                strokeWidth={2.4}
              />
            </View>
            <Text style={styles.brandName}>Chatly</Text>
          </View> */}

          <View style={styles.card}>
            <Text style={styles.eyebrow}>
              {isSignUp ? "WELCOME ABOARD" : "WELCOME BACK"}
            </Text>
            <Text style={styles.title}>
              {isSignUp ? "Create your account" : "Stay connected"}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? "Start meaningful conversations with your people."
                : "Your conversations are waiting for you."}
            </Text>

            <View style={styles.switcher}>
              <TouchableOpacity
                style={[styles.switch, !isSignUp && styles.switchActive]}
                onPress={() => {
                  setMode("signIn");
                  setError(null);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.switchText,
                    !isSignUp && styles.switchTextActive,
                  ]}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switch, isSignUp && styles.switchActive]}
                onPress={() => {
                  setMode("signUp");
                  setError(null);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.switchText,
                    isSignUp && styles.switchTextActive,
                  ]}
                >
                  Create account
                </Text>
              </TouchableOpacity>
            </View>

            <Field
              icon={
                <Mail
                  size={19}
                  color={theme.colors.neutral[400]}
                  strokeWidth={2}
                />
              }
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View style={styles.passwordWrap}>
              <Field
                icon={
                  <LockKeyhole
                    size={19}
                    color={theme.colors.neutral[400]}
                    strokeWidth={2}
                  />
                }
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eye}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={19} color={theme.colors.neutral[400]} />
                ) : (
                  <Eye size={19} color={theme.colors.neutral[400]} />
                )}
              </TouchableOpacity>
            </View>
            {isSignUp ? (
              <Field
                icon={
                  <LockKeyhole
                    size={19}
                    color={theme.colors.neutral[400]}
                    strokeWidth={2}
                  />
                }
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            ) : null}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.submit, busy && styles.submitDisabled]}
              onPress={submit}
              disabled={busy}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>
                {busy
                  ? "Please wait..."
                  : isSignUp
                    ? "Create account"
                    : "Sign in"}
              </Text>
              {!busy ? (
                <ArrowRight
                  size={19}
                  color={theme.colors.textInverse}
                  strokeWidth={2.2}
                />
              ) : null}
            </TouchableOpacity>

            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>Test Account</Text>
              <Text style={styles.hintText}>Email: test@respond.io</Text>
              <Text style={styles.hintText}>Password: password123</Text>
            </View>

            <Text style={styles.legal}>
              By continuing, you agree to keep your conversations respectful and
              safe.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "email-address" | "default";
}) {
  return (
    <View style={styles.field}>
      {icon}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.neutral[400]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: theme.spacing.lg },
  brand: { alignItems: "center", marginBottom: theme.spacing.lg },
  brandIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.title,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textInverse,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.primary[500],
  },
  title: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.headline,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.body,
    lineHeight: 22,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
  },
  switcher: {
    flexDirection: "row",
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.radius.md,
    padding: 4,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  switch: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
  },
  switchActive: {
    backgroundColor: theme.colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  switchText: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.textSecondary,
  },
  switchTextActive: { color: theme.colors.primary[600] },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    height: 50,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.neutral[50],
    borderWidth: 1,
    borderColor: theme.colors.neutral[100],
  },
  input: {
    flex: 1,
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textPrimary,
  },
  passwordWrap: { position: "relative" },
  eye: {
    position: "absolute",
    right: theme.spacing.md,
    top: theme.spacing.sm + 15,
    padding: 2,
  },
  error: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.error,
  },
  submit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: 50,
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary[500],
  },
  submitDisabled: { opacity: 0.6 },
  submitText: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textInverse,
  },
  hintBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary[50],
  },
  hintTitle: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.primary[600],
  },
  hintText: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  legal: {
    marginTop: theme.spacing.md,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
