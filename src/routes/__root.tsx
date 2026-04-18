import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthProvider } from "@/lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Developmental Portfolio — Jaymes Merc Lebron Ramos" },
      {
        name: "description",
        content:
          "A developmental portfolio documenting growth across five institutional outcomes and sixteen indicators of teaching competence.",
      },
      { property: "og:title", content: "Developmental Portfolio — Jaymes Merc Lebron Ramos" },
      { name: "twitter:title", content: "Developmental Portfolio — Jaymes Merc Lebron Ramos" },
      { name: "description", content: "This application showcases a developmental portfolio with self-assessment, evidence, and reflection sections." },
      { property: "og:description", content: "This application showcases a developmental portfolio with self-assessment, evidence, and reflection sections." },
      { name: "twitter:description", content: "This application showcases a developmental portfolio with self-assessment, evidence, and reflection sections." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8ed71c3a-ab6b-4be6-803c-074dc62640d3/id-preview-468b2849--1616339b-6fcb-433f-afc3-4bfb3a8cb02c.lovable.app-1776530714023.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8ed71c3a-ab6b-4be6-803c-074dc62640d3/id-preview-468b2849--1616339b-6fcb-433f-afc3-4bfb3a8cb02c.lovable.app-1776530714023.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </AuthProvider>
  );
}
