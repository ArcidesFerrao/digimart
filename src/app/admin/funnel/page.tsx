// src/app/admin/funnel/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db as prisma } from "@/lib/prisma";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function FunnelPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/dashboard");

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = await prisma.$queryRaw<
    {
      id: string;
      title: string;
      visitantes: number;
      cliques: number;
      links: number;
      downloads: number;
    }[]
  >`
    SELECT 
    p.id,   
        p.title,
      COUNT(DISTINCT e."sessionId") FILTER (WHERE e.type = 'VIEW')::int           AS visitantes,
      COUNT(DISTINCT e.ref)         FILTER (WHERE e.type = 'WHATSAPP_CLICK')::int AS cliques,
      COUNT(DISTINCT e.ref)         FILTER (WHERE e.type = 'LINK_GENERATED')::int AS links,
      COUNT(DISTINCT e.ref)         FILTER (WHERE e.type = 'DOWNLOAD')::int       AS downloads
    FROM "ProductEvent" e
    JOIN "Product" p ON p.id = e."productId"
    WHERE e."createdAt" > ${since}
    GROUP BY p.title, p.id
    ORDER BY visitantes DESC
  `;

  const pct = (a: number, b: number) =>
    b ? `${Math.round((a / b) * 100)}%` : "—";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-teal" />
          <Badge variant="teal">Admin</Badge>
        </div>
        <h1 className="font-bebas text-5xl tracking-wide">
          PAINEL DE <span className="text-teal">ADMINISTRAÇÃO</span>
        </h1>
      </div>

      {/* Users */}
      <div className="mb-10">
        <h2 className="font-bebas text-2xl tracking-wide mb-6">
          UTILIZADORES <span className="text-teal">RECENTES</span>
        </h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Produto
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Visitantes
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Cliques WhatsApp
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Links gerados
                  </th>
                  <th className="text-right font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Downloads
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/50 last:border-b-0 hover:bg-background/50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground text-sm">
                        {row.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {row.visitantes}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {row.cliques}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {row.links}
                    </td>
                    <td className="px-6 py-4">{row.downloads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
