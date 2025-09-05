export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-background">
      <div className="container py-10 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} KrishiSetu</p>
        <div className="flex gap-6">
          <a className="hover:text-foreground" href="#privacy">
            Privacy
          </a>
          <a className="hover:text-foreground" href="#terms">
            Terms
          </a>
          <a className="hover:text-foreground" href="#contact">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
