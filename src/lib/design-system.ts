export const COLORS = {
    cyber: {
        primary: '#00ff41', // Matrix Green
        secondary: '#00b8ff', // Cyber Blue
        alert: '#ff003c', // Cyberpunk Red
        background: '#0a0a0a', // Deep Black
        surface: '#121212', // Dark Grey
        text: '#e0e0e0', // Off-White
    },
    status: {
        safe: '#00ff41',
        warning: '#fcee0a', // Cyber Yellow
        danger: '#ff003c',
        offline: '#555555',
    },
};

export const ANIMATIONS = {
    pulse: {
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
        transition: { duration: 1.5, repeat: Infinity },
    },
    glitch: {
        x: [0, -2, 2, -1, 1, 0],
        y: [0, 1, -1, 0],
        transition: { duration: 0.2, repeat: Infinity, repeatDelay: 3 },
    },
};
