/*
  PageWrapper.jsx
  ---------------
  Simple layout wrapper — centers content, adds consistent padding,
  and sets a max-width so pages don't stretch on ultra-wide monitors.
*/

export default function PageWrapper({ children, className = "" }) {
  return (
    <main className={`app-shell py-8 sm:py-10 ${className}`}>
      {children}
    </main>
  );
}
