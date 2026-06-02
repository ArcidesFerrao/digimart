"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-(--background)/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-teal" />
            <span className="font-bebas text-2xl tracking-wider text-foreground">
              DIGI<span className="text-teal">MART</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Produtos
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Sobre
            </Link>

            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Vender</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <Link
            href="/products"
            className="block text-sm text-muted hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Produtos
          </Link>
          <Link
            href="/about"
            className="block text-sm text-muted hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sobre
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="block text-sm text-teal"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setMobileMenuOpen(false);
                }}
                className="block text-sm text-danger"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block text-sm text-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="block text-sm text-teal"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vender
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
