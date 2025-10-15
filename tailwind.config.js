/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
  content: ['./src/**/*.{html,ts,scss,css}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#93C5FD',    // ฟ้าหลัก
        secondary: '#BFDBFE',  // ฟ้าอ่อน
        accent: '#E0F2FE',     // ฟ้าใส
        background: '#F9FAFB', // พื้นหลัง
        text: '#003f5c',       // ตัวอักษร
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1920px',
      },
    },
  },
  plugins: [PrimeUI],
};
