import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Plus,
  Settings,
  Store,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/products/new",
      label: "Novo Produto",
      icon: Plus,
    },
    {
      href: `/sellers/${session.user.username}`,
      label: "Loja Pública",
      icon: Store,
    },
    {
      href: "/dashboard/settings",
      label: "Configurações",
      icon: Settings,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-surface border border-border rounded-xl p-4 sticky top-24">
            <div className="mb-6 px-2">
              <p className="font-mono text-xs uppercase tracking-wider text-muted mb-1">
                Vendedor
              </p>
              <p className="font-semibold text-foreground truncate">
                {session.user.name}
              </p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted hover:text-foreground hover:bg-background"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
