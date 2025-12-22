import { extendTheme } from '@chakra-ui/react';

// ✅ WCAG 접근성 기준을 충족하는 커스텀 테마
const theme = extendTheme({
  colors: {
    // WCAG AA 기준 충족 (흰색 텍스트와 대비 4.5:1 이상)
    green: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#156315', // 기본 색상 (대비 약 7:1) ✅ WCAG AA 충족
      600: '#125212',
      700: '#0f420f',
      800: '#0b310b',
      900: '#072107',
    },
  },
});

export default theme;

