import NavBar from '@/components/NavBar';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import './globals.css';
import { exo2, orbitron } from './fonts';

// export const metadata: Metadata = {
//     title: 'Create Next App',
//     description: 'Generated by create next app',
// }

export const metadata: Metadata = {
    title: {
      default: 'Indie Gamer',
      template: '%s | Indie Gamer',
    },
  };

interface LayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en" className={`${exo2.variable} ${orbitron.variable}`}>
            <body className='bg-gray-200 flex flex-col px-8 py-2 min-h-screen'>
                <header>
                    <NavBar />
                </header>
                <main className='grow py-3'>
                    {children}
                </main>
                <footer className="border-t py-3 text-center text-slate-500 text-xs">
                    Game data and images courtesy
                    of{' '}
                    <a
                        href="https://rawg.io/"
                        target="_blank"
                        className='text-red-500'
                    >
                        RAWG
                    </a>
                </footer>
            </body>
        </html>
    );
};
