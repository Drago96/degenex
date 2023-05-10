'use client';

import { MdDarkMode, MdLightMode } from 'react-icons/md';

import IconButton from '../components/icon-button';
import { useTheme } from './theme-provider';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <IconButton onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
    </IconButton>
  );
}
