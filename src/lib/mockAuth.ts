export type MockUser = {
  id: string;
  email: string;
  name: string;
};

type StoredAccount = {
  id: string;
  email: string;
  password: string;
  name: string;
};

const STORAGE_KEY = "respond_io_mock_accounts";
const SESSION_KEY = "respond_io_mock_session";

const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: "1",
    email: "test@respond.io",
    password: "password123",
    name: "Test User",
  },
  {
    id: "2",
    email: "demo@respond.io",
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
      (a) => !SEED_ACCOUNTS.some((s) => s.email === a.email),
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

export const mockAuth = {
  async getSession(): Promise<MockUser | null> {
    await delay(150);
    return loadSession();
  },

  async signIn(email: string, password: string): Promise<MockUser> {
    await delay(600);
    const accounts = loadAccounts();
    const account = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    );
    if (!account) throw new Error("No account found with that email.");
    if (account.password !== password)
      throw new Error("Incorrect password. Please try again.");
    const user: MockUser = {
      id: account.id,
      email: account.email,
      name: account.name,
    };
    saveSession(user);
    return user;
  },

  async signUp(email: string, password: string): Promise<MockUser> {
    await delay(600);
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with that email already exists.");
    }
    const newAccount: StoredAccount = {
      id: String(Date.now()),
      email,
      password,
      name: email.split("@")[0],
    };
    const all = [...accounts, newAccount];
    saveExtraAccounts(all);
    const user: MockUser = {
      id: newAccount.id,
      email: newAccount.email,
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
