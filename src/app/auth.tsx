import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY,
  type CountryCode,
} from "@/lib/countryCodes";
import { theme } from "@/lib/theme";
import { useAuthStore } from "@/store/authStore";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  Phone,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";

const MAX_PHONE_DIGITS = 11;

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
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phone, setPhone] = useState(""); // digits only
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === "signUp";
  const nationalNumber = phone.replace(/\D/g, "").replace(/^0/, "");
  const fullPhone = `${country.dial}${nationalNumber}`;

  const handlePhoneChange = (text: string) => {
    setPhone(text.replace(/\D/g, "").slice(0, MAX_PHONE_DIGITS));
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "";

    if (country.dial === "+60") {
      if (cleaned.length <= 2) return cleaned;
      const prefix = cleaned.slice(0, 2);
      const rest = cleaned.slice(2);
      if (rest.length <= 4) return `${prefix}-${rest}`;
      const splitAt = rest.length - 4;
      return `${prefix}-${rest.slice(0, splitAt)} ${rest.slice(splitAt)}`;
    }

    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const submit = async () => {
    setError(null);

    if (!nationalNumber || !password) {
      setError("Enter your phone number and password to continue.");
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
        await signUp(fullPhone, password);
      } else {
        await signIn(fullPhone, password);
      }
      router.replace("/(tabs)");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to complete that request.",
      );
    } finally {
      setBusy(false);
    }
  };

  const selectCountry = (c: CountryCode) => {
    setCountry(c);
    setShowCountryPicker(false);
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary[50], theme.colors.primary[900]]}
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
          <View style={styles.brand}>
            <Image
              style={styles.brandIcon}
              contentFit="contain"
              source={require("@/assets/images/respond-io.png")}
            />
            <Text style={styles.brandSubtitle}>Mobile Dev Assessment</Text>
          </View>

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

            <View style={styles.phoneRow}>
              <TouchableOpacity
                style={styles.countryButton}
                onPress={() => setShowCountryPicker(true)}
                activeOpacity={0.7}
              >
                <CountryFlag isoCode={country.code.toLowerCase()} size={8} />

                <Text style={styles.countryDial}>{country.dial}</Text>
                <ChevronDown
                  size={16}
                  color={theme.colors.textSecondary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <View style={styles.phoneInputWrap}>
                <Phone
                  size={19}
                  color={theme.colors.neutral[400]}
                  strokeWidth={2}
                />
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Phone number"
                  placeholderTextColor={theme.colors.neutral[400]}
                  value={formatPhoneNumber(phone)}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={16}
                />
              </View>
            </View>

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
              <Text style={styles.hintText}>Phone: +60 12-345 6789</Text>
              <Text style={styles.hintText}>Password: password123</Text>
            </View>

            <Text style={styles.legal}>
              By continuing, you agree to keep your conversations respectful and
              safe.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CountryPicker
        visible={showCountryPicker}
        selected={country}
        onSelect={selectCountry}
        onClose={() => setShowCountryPicker(false)}
      />
    </LinearGradient>
  );
}

function CountryPicker({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: CountryCode;
  onSelect: (c: CountryCode) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={pickerStyles.overlay} onPress={onClose}>
        <Pressable
          style={pickerStyles.sheet}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={pickerStyles.handle} />
          <Text style={pickerStyles.title}>Select country</Text>
          <FlatList
            data={COUNTRY_CODES}
            keyExtractor={(item) => item.code + item.dial}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  pickerStyles.row,
                  selected.code === item.code &&
                    selected.dial === item.dial &&
                    pickerStyles.rowSelected,
                ]}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
              >
                <CountryFlag
                  style={pickerStyles.rowFlag}
                  isoCode={item.code.toLowerCase()}
                  size={10}
                />
                <Text style={pickerStyles.rowName}>{item.name}</Text>
                <Text style={pickerStyles.rowDial}>{item.dial}</Text>
                {selected.code === item.code && selected.dial === item.dial ? (
                  <Check
                    size={18}
                    color={theme.colors.primary[500]}
                    strokeWidth={2.4}
                  />
                ) : null}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View style={pickerStyles.separator} />
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
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
  brand: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  brandIcon: {
    width: 120,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  brandSubtitle: {
    fontSize: theme.typography.caption,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.background,
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
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 50,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.neutral[50],
    borderWidth: 1,
    borderColor: theme.colors.neutral[100],
  },
  countryFlag: { fontSize: 20 },
  countryDial: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.textPrimary,
  },
  phoneInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    height: 50,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.neutral[50],
    borderWidth: 1,
    borderColor: theme.colors.neutral[100],
  },
  phoneInput: {
    flex: 1,
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textPrimary,
  },
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

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: theme.spacing.xl,
    maxHeight: "70%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.neutral[200],
    alignSelf: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.title,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
  },
  rowSelected: { backgroundColor: theme.colors.primary[50] },
  rowFlag: { fontSize: 22, marginRight: theme.spacing.md },
  rowName: {
    flex: 1,
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.textPrimary,
  },
  rowDial: {
    fontSize: theme.typography.body,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.neutral[100],
    marginHorizontal: theme.spacing.lg,
  },
});
