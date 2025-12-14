'use client'

import React, { useState } from "react";
import { Button } from '../ui/button'
import { cn } from '@/app/utils/cn'
import {
  EllipsisVertical as Menu,
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

  // state to manage mobile menu toggle
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="grid grid-cols-[1fr_40px] grid-rows-2 w-screen h-20 pl-[60px] sm:grid-rows-[60%_40%] sm:grid-cols-[1fr_80px] md:w-full md:px-4 md:grid-cols-[max(360px)_1fr] bg-slate-50 border-b border-slate-200">
      <h1 className="col-span-1 text-2xl font-bold self-end text-slate-700">
          { title }
      </h1>
      <p className="row-start-2 col-start-1 col-span-1 text-sm self-center text-gray-500">
          { headerMsg }
      </p>
      { 
        children && (
          <section className="fixed top-0 right-0 h-screen w-[0px] z-[999] md:relative md:w-full md:h-full md:row-span-2 md:col-start-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "fixed top-[20px] right-[8px] transition-transform duration-200 ease-in-out z-50 md:hidden"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            {/* Sidebar */}
            <div className={cn(
              "fixed right-0 w-[220px] h-screen z-40 overflow-hidden transform bg-slate-50 border-l border-gray-200 transition-transform duration-200 ease-in-out md:relative md:w-full md:h-full md:border-none md:translate-x-0",
              isOpen ? "translate-x-0" : "translate-x-[220px]"
            )}>
              <div className="flex flex-col h-full pt-[100px] px-2 md:py-2 md:items-end md:justify-center">
                {children}
              </div>
            </div>
            {/* Mobile overlay */}
            {isOpen && (
              <div
                className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 md:hidden"
                onClick={() => setIsOpen(false)}
              />
            )}
          </section>
        ) 
      }
    </header>
  );
}
