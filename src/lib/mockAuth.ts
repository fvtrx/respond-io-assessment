export type MockUser = {
  id: string;
  phone: string;
  name: string;
};

type StoredAccount = {
  id: string;
  phone: string;
  password: string;
  name: string;
};

const STORAGE_KEY = "respond_io_assessment_mock_accounts";
const SESSION_KEY = "respond_io_assessment_mock_session";

const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: "1",
    phone: "+60123456789",
    password: "password123",
    name: "Test User",
  },
  {
    id: "2",
    phone: "+60198765432",
    password: "password123",
    name: "Demo User",
  },
];

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return [...SEED_ACCOUNTS, ...JSON.parse(raw)];
  } catch {}
  return SEED_ACCOUNTS;
}

function saveExtraAccounts(accounts: StoredAccount[]) {
  try {
    const extra = accounts.filter(
      (a) => !SEED_ACCOUNTS.some((s) => s.phone === a.phone),
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extra));
  } catch {}
}

function loadSession(): MockUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveSession(user: MockUser | null) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nameFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `User${digits.slice(-4)}`;
}

export const mockAuth = {
  async getSession(): Promise<MockUser | null> {
    await delay(150);
    return loadSession();
  },

  async signIn(phone: string, password: string): Promise<MockUser> {
    await delay(600);
    const accounts = loadAccounts();
    const account = accounts.find(
      (a) => a.phone.replace(/\s/g, "") === phone.replace(/\s/g, ""),
    );
    if (!account) throw new Error("No account found with that phone number.");
    if (account.password !== password)
      throw new Error("Incorrect password. Please try again.");
    const user: MockUser = {
      id: account.id,
      phone: account.phone,
      name: account.name,
    };
    saveSession(user);
    return user;
  },

  async signUp(phone: string, password: string): Promise<MockUser> {
    await delay(600);
    const accounts = loadAccounts();
    if (
      accounts.some(
        (a) => a.phone.replace(/\s/g, "") === phone.replace(/\s/g, ""),
      )
    ) {
      throw new Error("An account with that phone number already exists.");
    }
    const newAccount: StoredAccount = {
      id: String(Date.now()),
      phone,
      password,
      name: nameFromPhone(phone),
    };
    const all = [...accounts, newAccount];
    saveExtraAccounts(all);
    const user: MockUser = {
      id: newAccount.id,
      phone: newAccount.phone,
      name: newAccount.name,
    };
    saveSession(user);
    return user;
  },

  async signOut(): Promise<void> {
    await delay(100);
    saveSession(null);
  },
};
