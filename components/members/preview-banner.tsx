/**
 * DEV-only banner shown when previewing the portal as another member
 * (via the `?as=<email>` override). Makes it obvious the data isn't your own.
 */
export function PreviewBanner({ email }: { email: string }) {
  return (
    <div className="rounded-[10px] border border-gold-300 bg-gold-100 px-4 py-2.5 text-sm text-gold-700">
      <span className="font-semibold uppercase tracking-wider text-xs mr-2">Preview mode</span>
      Viewing as <span className="font-semibold">{email}</span> — dev only, not your account.
    </div>
  )
}
