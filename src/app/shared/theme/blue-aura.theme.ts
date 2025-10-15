import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

/**
 * 🎨 Blue Aura Theme — โทนฟ้า พาสเทล นุ่มตา
 */
const BlueAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
    },
    surface: {
      0: '#f9fafb',   // background พื้นขาวนวล
      50: '#e0f2fe',  // พื้นหลังรอง (ฟ้าอ่อน)
      100: '#bae6fd', // สี hover หรือพื้นคอนเทนต์
    },
    text: {
      color: '#1e3a8a', // ตัวอักษรน้ำเงินเข้ม
    },
  },
});

export default BlueAura;
