import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-display text-[8rem] text-cream-warm leading-none mb-2 select-none">404</div>
        <h1 className="font-display text-ink text-4xl font-light mb-4">Page not found</h1>
        <p className="text-ink-faint text-sm mb-8">The page you're looking for doesn't exist.</p>
        <Link href="/" className="btn-dark px-8 py-4">Back to Home</Link>
      </div>
    </div>
  );
}
