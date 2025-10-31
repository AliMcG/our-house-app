'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Home,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/app/utils/cn'
import { Button } from '../ui/button'
import Card from '../Card'
import { CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { navigation } from '@/app/utils/navbarLinks'
import AuthButton from '../AuthenticationButton'
import { useSession } from 'next-auth/react'
import Image from "next/image";
import HomePageImage from "@/public/home_logo_final.svg";
import { Household } from '@prisma/client'


export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const session = useSession();

  const households: Household[] = [
    // { id: '1', name: 'Our House', ownerId: 'user1', members: [{ id: 'user1' }, { id: 'user2' }] },
    // { id: '2', name: 'Vacation Home', ownerId: 'user2', members: [{ id: 'user2' }, { id: 'user3' }] },
  ];

  const currentHousehold: Household = { id: '1', name: 'Our House', createdById: 'user1', imageUrl: 'string' };

  const user = {
    name: session.data?.user?.name,
    email: session.data?.user?.email,
    image: session.data?.user?.image,
    id: session.data?.user?.id
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-48 h-screen transform bg-slate-50 border-r border-gray-200 transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-20 items-center border-b border-gray-200 px-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center">
                 <Image
                  src={HomePageImage}
                  alt="logo"
                  width={40}
                  height={40}
                  className="flex justify-center w-full h-auto"
                />
              </div>
              <span className="text-lg font-semibold text-gray-900">Our House</span>
            </div>
          </div>

          {/* User info */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100"> */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden">
                <Image
                  src={user.image ? user.image : HomePageImage}
                  alt="logo"
                  width={40}
                  height={40}
                  className="flex justify-center w-full h-auto"
                />

              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Household selector */}
          {households.length > 0 && (
            <div className="border-b border-gray-200 p-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Current Household
              </label>
              <div className="mt-2 space-y-2">
                {households.map((household) => (
                  <Card
                    key={household.id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      currentHousehold?.id === household.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => console.log(household)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {household.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {/* not sure how to access memebers via this type */}
                            0 members
                          </p>
                        </div>
                        {household.createdById === user?.id && (
                          <Badge variant="secondary" className="text-xs">
                            Owner
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4">
            <AuthButton size="small" />
          </div>
        </div>
      </div>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}