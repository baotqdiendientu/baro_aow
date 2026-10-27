/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // A. Dynamic Theme UI Colors (Light Parchment / Dark Tactical RPG)
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-surface': 'var(--bg-surface)',
        'border-subtle': 'var(--border-subtle)',
        'border-gold': 'var(--border-gold)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-primary': 'var(--accent-primary)',
        'accent-crimson': 'var(--accent-crimson)',

        // B. Albion Item Tier Colors (T1 - T8)
        'tier-1': '#6D6D6D',
        'tier-2': '#8C7853',
        'tier-3': '#4A7A4C',
        'tier-4': '#3B7898',
        'tier-5': '#8E2822',
        'tier-6': '#D06B27',
        'tier-7': '#D9B834',
        'tier-8': '#EBEBEB',

        // C. Enchantment Glow Colors (.0 - .4)
        'enchant-0': 'transparent',
        'enchant-1': '#2ECC71',
        'enchant-2': '#3498DB',
        'enchant-3': '#9B59B6',
        'enchant-4': '#F1C40F',

        // D. Item Quality Borders (1 - 5)
        'quality-1-normal': '#555555',
        'quality-2-good': '#8A9BA8',
        'quality-3-outstanding': '#CD7F32',
        'quality-4-excellent': '#E2E8F0',
        'quality-5-masterpiece': '#FFD700',

        // E. Zone Safety Tags
        'zone-safe': '#2563EB',
        'zone-yellow': '#D97706',
        'zone-lethal': '#DC2626',
        'zone-avalon': '#0D9488',
      },
      fontFamily: {
        display: [
          'var(--font-display)',
          'var(--font-jakarta)',
          'Be Vietnam Pro',
          'Plus Jakarta Sans',
          'sans-serif',
        ],
        sans: [
          'var(--font-sans)',
          'var(--font-jakarta)',
          'Be Vietnam Pro',
          'Plus Jakarta Sans',
          'Inter',
          'sans-serif',
        ],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'enchant-1': '0 0 14px rgba(46, 204, 113, 0.45), inset 0 0 8px rgba(46, 204, 113, 0.25)',
        'enchant-2': '0 0 14px rgba(52, 152, 219, 0.45), inset 0 0 8px rgba(52, 152, 219, 0.25)',
        'enchant-3': '0 0 16px rgba(155, 89, 182, 0.5), inset 0 0 10px rgba(155, 89, 182, 0.3)',
        'enchant-4': '0 0 18px rgba(241, 196, 15, 0.6), inset 0 0 12px rgba(241, 196, 15, 0.35)',
        'rpg-gold': '0 0 15px rgba(197, 155, 39, 0.25)',
      },
    },
  },
  plugins: [],
};

