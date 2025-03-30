'use client';
import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from './utils';

export function ThemeToggle() {
  const [theme, setTheme] = useState(true);

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme'); //it ensures the data is accesed only on the client side ( localStorage is in the bvrowser , on rendering SSR the window object which is a browser obj is undefined)
    if (currentTheme && currentTheme === 'dark') {
      setTheme(true);
    } else {
      setTheme(false);
      localStorage.setItem('theme', 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme ? 'dark' : 'light');
    if (theme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div
      onClick={() => {
        theme ? setTheme(false) : setTheme(true);
      }}
      className={cn(
        'h-5  w-10 bg-black rounded-full hover:opacity-70 cursor-pointer transition-all flex items-center justify-between',
        [theme ? ' bg-white' : ' bg-black ']
      )}
    >
      <div
        className={cn('rounded-full  transition-all', [
          theme ? 'translate-x-[22px]  ' : ' translate-x-[1px]',
        ])}
      >
        <Moon
          width={15}
          height={15}
          className={cn('  text-white ', [theme ? ' hidden  ' : ' block '])}
        />
        <Sun
          width={15}
          height={15}
          className={cn(' text-black ', [theme ? '  block' : ' hidden '])}
        />
      </div>
    </div>
  );
}
