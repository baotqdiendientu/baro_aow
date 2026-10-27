import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 rounded-2xl bg-bg-secondary border border-border-gold/40 shadow-rpg-gold max-w-md w-full space-y-4">
        <span className="px-2.5 py-1 rounded bg-accent-primary/20 text-accent-primary text-xs font-mono font-bold">
          ERROR 404
        </span>
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Không Tìm Thấy Trang
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Trang hoặc vật phẩm bạn đang tra cứu không tồn tại hoặc đường dẫn đã thay đổi.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 rounded-lg bg-accent-primary text-bg-primary font-bold text-xs hover:bg-accent-primary/90 transition-all shadow-rpg-gold"
        >
          Quay lại Trang Chủ
        </Link>
      </div>
    </div>
  );
}

