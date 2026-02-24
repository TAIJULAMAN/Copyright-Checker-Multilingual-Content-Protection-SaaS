"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, LogOut, User, Crown, History } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout } from "@/redux/slices/authSlice";
import { useLogoutMutation } from "@/redux/api/authApi";
import { baseApi } from "@/redux/api/baseApi";
import Cookies from "js-cookie";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { getImageUrl } from "@/redux/api/config";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Header');
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [lang, setLang] = useState<"EN" | "DE">("EN"); // Replaced by useLocale

  const user = useSelector(selectCurrentUser);
  const isLoggedIn = !!user;
  const displayName = user?.fullname || user?.name || user?.email?.split('@')[0] || "User";

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API failed", error);
    }

    // 1. Clear Redux State
    dispatch(logout());
    dispatch(baseApi.util.resetApiState()); // Clear RTK Query cache

    // 2. Clear Cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // 3. Clear Session Storage
    sessionStorage.clear();

    // 4. Clear Local Storage
    localStorage.clear();

    setMobileMenuOpen(false);
    router.push("/");
  };

  const handleLangChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const NavLinks = ({ variant = 'light' }: { variant?: 'light' | 'dark' }) => {
    const textColor = variant === 'dark' ? 'text-gray-900' : 'text-white';
    const hoverColor = variant === 'dark' ? 'hover:text-purple-600' : 'hover:text-purple-400';

    return (
      <div className="flex flex-col space-y-3">
        <Link
          href="/#how-it-works"
          className={`${textColor} ${hoverColor} text-sm transition-colors py-1.5`}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('howItWorks')}
        </Link>
        <Link
          href="/pricing"
          className={`${textColor} ${hoverColor} text-sm transition-colors py-1.5`}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('pricing')}
        </Link>
        <Link
          href="/faq"
          className={`${textColor} ${hoverColor} text-sm transition-colors py-1.5`}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('faq')}
        </Link>
        <Link
          href="/contact"
          className={`${textColor} ${hoverColor} text-sm transition-colors py-1.5`}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('contact')}
        </Link>
      </div>
    );
  };

  return (
    <header className="bg-[#1b2149] border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-5 md:px-0">
        <div className="relative flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 z-10">
            <Image
              src="/logo.svg"
              alt="logo"
              width={100}
              height={60}
              className="w-[100px] h-[60px] md:w-[150px] md:h-[60px]"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-8">
              {/* <Link href="/" className="text-white hover:text-red-500 transition-colors">
                Home
              </Link> */}
              <Link href="/#how-it-works" className="text-white hover:text-purple-400 transition-colors">
                {t('howItWorks')}
              </Link>
              <Link href="/pricing" className="text-white hover:text-purple-400 transition-colors">
                {t('pricing')}
              </Link>
              <Link href="/faq" className="text-white hover:text-purple-400 transition-colors">
                {t('faq')}
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors">
                {t('contact')}
              </Link>
            </div>
          </nav>

          {/* Desktop Actions - Hidden on tablet */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="inline-flex items-center rounded-full overflow-hidden bg-white cursor-pointer">
              <button
                onClick={() => handleLangChange("en")}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${locale === "en"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-[#1b2149]"
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLangChange("de")}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${locale === "de"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-[#1b2149]"
                  }`}
              >
                DE
              </button>
            </div>

            <Button
              onClick={() => {
                if (!isLoggedIn) {
                  const isReturningUser = localStorage.getItem("returningUser") === "true";
                  const targetPath = isReturningUser ? "/login" : "/signup";
                  router.push(`${targetPath}?callbackUrl=/scan`);
                } else {
                  router.push("/scan");
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer rounded-full "
            >
              {t('checkReels')}
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="size-8 cursor-pointer ring-2 ring-purple-600 ring-offset-2">
                    <AvatarImage
                      src={getImageUrl(user?.avatar || "")}
                      alt={displayName}
                    />
                    <AvatarFallback className="text-xs font-semibold text-[#1b2149] bg-white">
                      {displayName
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        ?.slice(0, 2)
                        .toUpperCase() || "CN"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-900 leading-none">
                        {displayName}
                      </span>
                      <span className="text-xs text-gray-500 leading-none">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('myProfile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mysubscription" className="cursor-pointer">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>{t('mySubscription')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/results" className="cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      <span>{t('scanHistory')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  {t('login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Tablet and Mobile Menu - Show language toggle and hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Language Toggle */}
            <div className="inline-flex items-center rounded-full overflow-hidden bg-white">
              <button
                onClick={() => handleLangChange("en")}
                className={`px-3 py-2 text-xs font-medium transition-colors ${locale === "en"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-[#1b2149]"
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLangChange("de")}
                className={`px-3 py-2 text-xs font-medium transition-colors ${locale === "de"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-[#1b2149]"
                  }`}
              >
                DE
              </button>
            </div>

            {/* Hamburger Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 ml-1">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] sm:h-[44vh] bg-white overflow-y-auto pb-0">
                <SheetHeader className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl font-bold text-gray-900">{t('menu')}</SheetTitle>
                  </div>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  {/* Main Navigation Links */}
                  <nav className="py-4 px-5">
                    <NavLinks variant="dark" />
                  </nav>

                  {/* Auth Buttons */}
                  <div className="border-t border-gray-200 p-4 space-y-3">
                    {isLoggedIn ? (
                      <>
                        <Link href="/mysubscription" onClick={() => setMobileMenuOpen(false)} className="block">
                          <Button variant="ghost" className="w-full justify-start">
                            <Crown className="mr-2 h-4 w-4" /> {t('mySubscription')}
                          </Button>
                        </Link>
                        <Link href="/results" onClick={() => setMobileMenuOpen(false)} className="block">
                          <Button variant="ghost" className="w-full justify-start">
                            <History className="mr-2 h-4 w-4" /> {t('scanHistory')}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" /> {t('logout')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                          <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                            {t('login')}
                          </Button>
                        </Link>
                      </>
                    )}

                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (!isLoggedIn) {
                          const isReturningUser = localStorage.getItem("returningUser") === "true";
                          const targetPath = isReturningUser ? "/login" : "/signup";
                          router.push(`${targetPath}?callbackUrl=/scan`);
                        } else {
                          router.push("/scan");
                        }
                      }}
                    >
                      {t('checkReels')}
                    </Button>
                  </div>

                  {/* User Profile Section - Removed from mobile/tablet as per request */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
