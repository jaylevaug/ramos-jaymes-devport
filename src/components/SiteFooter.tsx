export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 py-10">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
        <p className="font-display text-base text-foreground">
          Jaymes Merc Lebron Ramos · Developmental Portfolio
        </p>
        <p className="mt-2">
          A documentation of growth across five institutional outcomes and sixteen indicators.
        </p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
