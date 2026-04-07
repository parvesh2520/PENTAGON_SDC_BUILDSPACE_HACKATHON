/*
  PageWrapper.jsx
  ---------------
  Layout wrapper with consistent styling and animated background.
  Provides max-width containment and responsive padding.
*/

export default function PageWrapper({ children, className = "" }) {
  return (
    <main className={`app-shell py-10 sm:py-14 min-h-[calc(100vh-64px)] relative ${className}`}>
      {/* Subtle background grid */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}
