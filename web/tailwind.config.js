/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                'accent-primary': '#6366f1',
                'accent-secondary': '#a855f7',
                'dark-bg': '#020617',
                'dark-card': '#0f172a',
                'dark-border': 'rgba(255, 255, 255, 0.08)',
            },
        },
    },
    plugins: [],
}
