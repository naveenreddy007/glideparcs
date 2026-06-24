set -e

SRC="$HOME/Development/premiumparking/inventory"
ROOT="$HOME/Development/premiumparking/glideparcs"
FRONT="$ROOT/frontend"

if [ ! -d "$SRC/app" ]; then
  echo "ERROR: Source project not found at: $SRC"
  echo "Check your old inventory project path."
  exit 1
fi

mkdir -p "$ROOT"

if [ -d "$FRONT" ]; then
  BACKUP="$ROOT/frontend_backup_$(date +%Y%m%d_%H%M%S)"
  echo "Existing frontend found. Moving it to: $BACKUP"
  mv "$FRONT" "$BACKUP"
fi

mkdir -p "$FRONT/app/login"
mkdir -p "$FRONT/app/dashboard"
mkdir -p "$FRONT/app/components"
mkdir -p "$FRONT/public"
mkdir -p "$ROOT/backend"
mkdir -p "$ROOT/infra"

echo "Copying only required frontend files..."

cp "$SRC/app/layout.tsx" "$FRONT/app/layout.tsx"
cp "$SRC/app/globals.css" "$FRONT/app/globals.css"

if [ -f "$SRC/app/favicon.ico" ]; then
  cp "$SRC/app/favicon.ico" "$FRONT/app/favicon.ico"
fi

if [ -d "$SRC/public" ]; then
  cp -a "$SRC/public/." "$FRONT/public/"
fi

cp "$SRC/app/page.tsx" "$FRONT/app/login/page.tsx"
cp "$SRC/app/dashboard/page.tsx" "$FRONT/app/dashboard/page.tsx"

for f in \
  AppShell.tsx \
  TopNav.tsx \
  ThemeProvider.tsx \
  ThemeToggle.tsx \
  SplashWrapper.tsx \
  SplashScreen.tsx \
  FloatingParticles.tsx \
  TiltCard.tsx \
  AnimatedCounter.tsx
do
  if [ -f "$SRC/app/components/$f" ]; then
    cp "$SRC/app/components/$f" "$FRONT/app/components/$f"
  fi
done

cat > "$FRONT/package.json" <<'EOF'
{
  "name": "glideparcs-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "framer-motion": "^12.40.0",
    "lucide-react": "^1.18.0",
    "next": "16.2.9",
    "next-themes": "^0.4.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "sonner": "^2.0.7"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
EOF

cat > "$FRONT/next.config.ts" <<'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
EOF

cat > "$FRONT/postcss.config.mjs" <<'EOF'
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
EOF

cat > "$FRONT/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
EOF

cat > "$FRONT/eslint.config.mjs" <<'EOF'
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
EOF

cat > "$FRONT/.gitignore" <<'EOF'
node_modules
.next
out
.env
.env.local
.DS_Store
*.log
EOF

cat > "$FRONT/app/page.tsx" <<'EOF'
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, LayoutDashboard, Sparkles } from 'lucide-react';
import FloatingParticles from './components/FloatingParticles';
import { ThemeToggle } from './components/ThemeToggle';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#24638F] text-white selection:bg-white/20">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
      <FloatingParticles />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-black text-[#24638F] shadow-inner">
            G
          </div>
          <div>
            <div className="text-lg font-bold tracking-[-0.5px]">GLIDE PARCS</div>
            <div className="text-[10px] uppercase tracking-[3px] text-white/70">Premium Parking</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-[#24638F] shadow-lg transition hover:scale-[1.02]"
          >
            Staff Login
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-white/80 backdrop-blur"
        >
          <Sparkles size={15} /> Internal Operations Portal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="max-w-5xl text-5xl font-semibold tracking-[-2px] md:text-7xl"
        >
          Great Places deserve a clean control center.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 max-w-2xl text-lg leading-8 text-white/75 md:text-xl"
        >
          Glideparcs staff portal for dashboard visibility, operational control, and internal team workflows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-[#24638F] shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:scale-[1.03]"
          >
            Enter Staff Portal <ArrowRight size={18} />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/15"
          >
            Preview Dashboard <LayoutDashboard size={18} />
          </Link>
        </motion.div>

        <div className="mt-16 grid w-full max-w-3xl gap-4 md:grid-cols-3">
          {[
            { title: 'Secure Entry', icon: Shield },
            { title: 'Dashboard First', icon: LayoutDashboard },
            { title: 'Backend Ready', icon: Sparkles },
          ].map(({ title, icon: Icon }) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <Icon className="mx-auto mb-3 text-white" size={26} />
              <div className="font-semibold">{title}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
EOF

cat > "$FRONT/app/components/TopNav.tsx" <<'EOF'
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function TopNav() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('glideparcs_user');
    window.location.href = '/login';
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#1C5075] bg-[#24638F] px-6 py-4 shadow-md">
      <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white shadow-inner">
          <span className="text-lg font-bold tracking-[-1px] text-[#24638F]">G</span>
        </div>
        <span className="hidden text-xl font-semibold tracking-[-0.5px] text-white sm:block">
          GLIDE PARCS
        </span>
      </Link>

      <nav className="hidden items-center gap-2 md:flex">
        <Link
          href="/dashboard"
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            pathname === '/dashboard'
              ? 'border-white/20 bg-white/20 text-white'
              : 'border-transparent text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
EOF

python3 - <<PY
from pathlib import Path

login = Path("$FRONT/app/login/page.tsx")
s = login.read_text()
s = s.replace("'./components/FloatingParticles'", "'../components/FloatingParticles'")
s = s.replace("'./components/ThemeToggle'", "'../components/ThemeToggle'")

try:
    start = s.index("  const handleSubmit = async")
    end = s.index("\\n\\n  return (", start)
    new = '''  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Temporary frontend-only login.
    // Later this will call Go Fiber API: POST /api/v1/auth/login
    localStorage.setItem('glideparcs_user', JSON.stringify({
      id: 'demo-user',
      email,
      fullName: email.split('@')[0] || 'Glideparcs User',
      role: 'admin'
    }));

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  };'''
    s = s[:start] + new + s[end:]
except ValueError:
    print("WARNING: Could not auto-patch login submit function.")

login.write_text(s)

dash = Path("$FRONT/app/dashboard/page.tsx")
s = dash.read_text()

try:
    start = s.index('  useEffect(() => {\\n    fetch("/api/auth/me")')
    end = s.index("\\n\\n  // Welcome or unauthorized toast", start)
    new_user_effect = '''  useEffect(() => {
    const rawUser = localStorage.getItem('glideparcs_user');

    if (!rawUser) {
      window.location.href = '/login';
      return;
    }

    try {
      const data = JSON.parse(rawUser) as UserInfo;
      setUser(data);
      setRole((data.role as Role) || 'staff');
    } catch {
      localStorage.removeItem('glideparcs_user');
      window.location.href = '/login';
    }
  }, []);'''
    s = s[:start] + new_user_effect + s[end:]
except ValueError:
    print("WARNING: Could not auto-patch dashboard user auth.")

try:
    start = s.index("  useEffect(() => {\\n    let active = true;\\n\\n    fetch('/api/inventory/summary')")
    end = s.index("\\n\\n  const changeRole", start)
    new_summary_effect = '''  useEffect(() => {
    // Temporary frontend-only dashboard numbers.
    // Later this will come from Go Fiber API: GET /api/v1/dashboard/summary
    setInventorySummary({
      totalAssets: 10,
      readyAssets: 7,
      missingDataAssets: 2,
      repairAssets: 1,
    });
  }, []);'''
    s = s[:start] + new_summary_effect + s[end:]
except ValueError:
    print("WARNING: Could not auto-patch dashboard summary fetch.")

s = s.replace('href="/inventory"', 'href="/dashboard"')
s = s.replace('Open Inventory', 'Inventory Coming Later')

dash.write_text(s)
PY

cat > "$ROOT/README.md" <<'EOF'
# Glideparcs

Clean rebuild structure.

## Current scope

Only frontend pages:

- `/`
- `/login`
- `/dashboard`

## Architecture

- `frontend/` = Next.js UI only
- `backend/` = Go Fiber API later
- `infra/` = Docker/PostgreSQL later

No Next.js API routes. Backend will be Go Fiber.
EOF

cat > "$ROOT/backend/README.md" <<'EOF'
# Backend

Go Fiber + GORM + PostgreSQL will be created here later.
EOF

cat > "$ROOT/infra/README.md" <<'EOF'
# Infra

Docker Compose and PostgreSQL setup will be created here later.
EOF

echo ""
echo "DONE."
echo "Created clean project at:"
echo "$ROOT"
echo ""
echo "Next steps:"
echo "cd $FRONT"
echo "npm install"
echo "npm run dev"
