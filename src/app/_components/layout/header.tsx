'use client'

import React, { useState } from "react";
import { Button } from '../ui/button'
import { cn } from '@/app/utils/cn'
import {
  Menu,
  X,
} from 'lucide-react'


// Only the title prop is required to identify the header
interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Responsible for rendering the Header component for app pages
 * @param {string} title - the page main title
 * @param {string} description - optional short description under page title
 * @param {React.ReactNode} children - the quick menu options 
 * @returns React.Component
 */
export default function Header({ 
  title, 
  description, 
  children 
}: HeaderProps) {
  // resuse the description prop or use a default value
  const headerMsg = description ?? "Manage your household, lists, and tasks";

  return (
    <header className="grid grid-cols-[1fr_40px] grid-rows-2 w-screen h-20 pl-[60px] sm:grid-rows-[60%_40%] sm:grid-cols-[1fr_80px] md:px-4  bg-slate-50 border-b border-slate-200">
      <h1 className="col-span-1 text-2xl font-bold self-end text-slate-700">
          { title }
      </h1>
      <p className="row-start-2 col-start-1 col-span-1 text-sm self-center text-gray-500">
          { headerMsg }
      </p>
      { 
        children && (
          <section>
            {children}
          </section>
        ) 
      }
    </header>
  );
}
