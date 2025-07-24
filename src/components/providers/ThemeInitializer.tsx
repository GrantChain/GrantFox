"use client";

export function ThemeInitializer() {
  return (
    <script
      id="theme-init"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
        (function() {
          try {
            // 0. Reference elements
            var docEl = document.documentElement;
            var bodyEl = document.body;
            
            // 1. Remove any existing theme classes
            docEl.classList.remove('light', 'dark');
            
            // 2. Get theme preference with proper fallbacks
            var savedTheme = localStorage.getItem('theme');
            var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var theme = 'dark'; // Default fallback
            
            if (savedTheme === 'system' || !savedTheme) {
              theme = systemDark ? 'dark' : 'light';
            } else if (savedTheme === 'dark' || savedTheme === 'light') {
              theme = savedTheme;
            }
            
            // 3. Apply theme immediately
            docEl.classList.add(theme);
            docEl.style.colorScheme = theme;
            
            // 4. Set immediate background colors (prevents flash)
            docEl.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
            bodyEl.style.backgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
            bodyEl.style.opacity = '0';
            
            // 5. Set critical CSS variables for Tailwind
            docEl.style.setProperty('--background', theme === 'dark' ? '0 0% 0%' : '0 0% 100%');
            docEl.style.setProperty('--foreground', theme === 'dark' ? '210 40% 98%' : '222.2 84% 4.9%');
            docEl.style.setProperty('--border', theme === 'dark' ? '0 0% 15%' : '214.3 31.8% 91.4%');
            
            // 6. Fade in to prevent jarring transition
            requestAnimationFrame(function() {
              bodyEl.style.transition = 'opacity 150ms ease-out';
              bodyEl.style.opacity = '1';
            });
            
          } catch(e) {
            console.error('Theme initialization error:', e);
            // Nuclear fallback
            document.documentElement.classList.add('dark');
            document.documentElement.style.backgroundColor = '#000000';
            document.body.style.backgroundColor = '#000000';
          }
        })();
        `,
      }}
    />
  );
}
