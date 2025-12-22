import { extendTheme } from '@chakra-ui/react';

// ✅ WCAG 접근성 기준을 충족하는 커스텀 테마
const theme = extendTheme({
  colors: {
    // 기본 green보다 더 어두운 green (WCAG AA 기준 충족)
    green: {
      50: '#e6f7e6',
      100: '#c3ebc3',
      200: '#9cde9c',
      300: '#72d072',
      400: '#4ec34e',
      500: '#2e8b2e', // 기본 색상 (더 어두움, 대비 4.5:1 이상)
      600: '#267326',
      700: '#1e5c1e',
      800: '#164516',
      900: '#0e2e0e',
    },
  },
});

export default theme;

