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

  const user = useSelector(selectCurrentUser);
  const isLoggedIn = !!user;
  const displayName = user?.fullname || user?.name || user?.email?.split('@')[0] || "User";

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API failed", error);
    }

    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    sessionStorage.clear();
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
          className={`${textColor} ${hoverColor} text-sm font-medium transition-colors py-1.5`}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('howItWorks')}
        </Link>
        <Link
          href="/pricing"
          className={`${textColor} ${hoverColor} text-sm font-medium transition-colors py-1.5`}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('pricing')}
        </Link>
        <Link
          href="/faq"
          className={`${textColor} ${hoverColor} text-sm font-medium transition-colors py-1.5`}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('faq')}
        </Link>
        <Link
          href="/contact"
          className={`${textColor} ${hoverColor} text-sm font-medium transition-colors py-1.5`}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('contact')}
        </Link>
      </div>
    );
  };

  return (
    <header className="bg-[#1b2149] border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              <Image
                src="/logo.svg"
                alt="logo"
                width={150}
                height={60}
                className="w-[110px] h-auto sm:w-[130px] md:w-[150px]"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered, visible from large screens */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center gap-4 xl:gap-8">
              <Link href="/#how-it-works" className="text-white hover:text-purple-400 transition-colors text-sm font-medium whitespace-nowrap">
                {t('howItWorks')}
              </Link>
              <Link href="/pricing" className="text-white hover:text-purple-400 transition-colors text-sm font-medium whitespace-nowrap">
                {t('pricing')}
              </Link>
              <Link href="/faq" className="text-white hover:text-purple-400 transition-colors text-sm font-medium whitespace-nowrap">
                {t('faq')}
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-colors text-sm font-medium whitespace-nowrap">
                {t('contact')}
              </Link>
            </div>
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-5">
              <div className="inline-flex items-center rounded-full overflow-hidden bg-white/10 p-1 border border-white/20">
                <button
                  onClick={() => handleLangChange("en")}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-full ${locale === "en"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-white/70 hover:text-white"
                    }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLangChange("de")}
                  className={`px-3 py-1.5 text-xs font-bold transition-all rounded-full ${locale === "de"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-white/70 hover:text-white"
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
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 xl:px-6 font-semibold whitespace-nowrap hidden lg:inline-flex"
              >
                {t('checkReels')}
              </Button>

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-purple-600 rounded-full transition-all">
                    <Avatar className="size-9 cursor-pointer ring-2 ring-purple-600 ring-offset-2 ring-offset-[#1b2149]">
                      <AvatarImage
                        src={getImageUrl(user?.avatar || "")}
                        alt={displayName}
                      />
                      <AvatarFallback className="text-xs font-bold text-[#1b2149] bg-white">
                        {displayName
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          ?.slice(0, 2)
                          .toUpperCase() || "CN"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 mt-2 p-1 border-white/10 bg-white shadow-xl rounded-xl">
                    <DropdownMenuLabel className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {displayName}
                        </span>
                        <span className="text-xs text-gray-500 font-medium truncate">
                          {user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-1">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center px-3 py-2 text-sm rounded-md transition-colors cursor-pointer">
                          <User className="mr-3 h-4 w-4 text-purple-600" />
                          <span>{t('myProfile')}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/mysubscription" className="flex items-center px-3 py-2 text-sm rounded-md transition-colors cursor-pointer">
                          <Crown className="mr-3 h-4 w-4 text-purple-600" />
                          <span>{t('mySubscription')}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/results" className="flex items-center px-3 py-2 text-sm rounded-md transition-colors cursor-pointer">
                          <History className="mr-3 h-4 w-4 text-purple-600" />
                          <span>{t('scanHistory')}</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-1">
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          handleLogout();
                        }}
                        className="flex items-center px-3 py-2 text-sm text-red-600 focus:text-red-700 focus:bg-red-50 rounded-md transition-colors cursor-pointer"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="font-medium">{t('logout')}</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2 xl:gap-3">
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full font-bold px-4">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-white text-[#1b2149] hover:bg-gray-100 rounded-full font-bold px-6">
                      {t('signup')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile & Tablet Actions */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Simplified Lang Toggle for mobile */}
              <div className="hidden sm:inline-flex items-center rounded-full overflow-hidden bg-white/10 p-1 border border-white/20">
                <button
                  onClick={() => handleLangChange("en")}
                  className={`px-3 py-1 text-[10px] font-bold transition-all rounded-full ${locale === "en" ? "bg-purple-600 text-white" : "text-white/70"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLangChange("de")}
                  className={`px-3 py-1 text-[10px] font-bold transition-all rounded-full ${locale === "de" ? "bg-purple-600 text-white" : "text-white/70"}`}
                >
                  DE
                </button>
              </div>

              {/* Hamburger Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-[360px] bg-white p-0 border-l-0">
                  <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 border-b text-left">
                      <SheetTitle className="text-2xl font-bold text-gray-900">{t('menu')}</SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto pt-4">
                      <nav className="px-6 pb-6">
                        <NavLinks variant="dark" />
                      </nav>

                      <div className="px-6">
                        <div className="h-px bg-gray-100 w-full mb-6" />

                        <div className="space-y-4">
                          {isLoggedIn ? (
                            <>
                              <div className="flex items-center gap-3 px-2 mb-6">
                                <Avatar className="size-10 ring-2 ring-purple-600 ring-offset-2">
                                  <AvatarImage src={getImageUrl(user?.avatar || "")} />
                                  <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                                    {displayName?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-900">{displayName}</span>
                                  <span className="text-xs text-gray-500 truncate max-w-[180px]">{user?.email}</span>
                                </div>
                              </div>
                              <Link href="/mysubscription" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-2 py-3 text-gray-700 hover:text-purple-600 transition-colors">
                                <Crown className="mr-3 h-5 w-5 text-purple-600" />
                                <span className="font-medium">{t('mySubscription')}</span>
                              </Link>
                              <Link href="/results" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-2 py-3 text-gray-700 hover:text-purple-600 transition-colors">
                                <History className="mr-3 h-5 w-5 text-purple-600" />
                                <span className="font-medium">{t('scanHistory')}</span>
                              </Link>
                              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-2 py-3 text-gray-700 hover:text-purple-600 transition-colors">
                                <User className="mr-3 h-5 w-5 text-purple-600" />
                                <span className="font-medium">{t('myProfile')}</span>
                              </Link>
                              <button
                                className="flex items-center w-full px-2 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={handleLogout}
                              >
                                <LogOut className="mr-3 h-5 w-5" />
                                <span className="font-medium">{t('logout')}</span>
                              </button>
                            </>
                          ) : (
                            <div className="grid grid-cols-2 gap-4">
                              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl h-12 font-bold">
                                  {t('login')}
                                </Button>
                              </Link>
                              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 font-bold">
                                  {t('signup')}
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 mt-auto border-t bg-gray-50/50">
                      <Button
                        className="w-full bg-[#1b2149] hover:bg-[#1b2149]/90 text-white h-14 rounded-xl font-bold shadow-lg shadow-purple-200"
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

                      {/* Language Toggle in Bottom of Mobile Menu for small phones */}
                      <div className="flex sm:hidden justify-center mt-6">
                        <div className="inline-flex items-center rounded-full overflow-hidden bg-white p-1 border border-gray-200">
                          <button
                            onClick={() => { handleLangChange("en"); setMobileMenuOpen(false); }}
                            className={`px-6 py-2 text-xs font-bold transition-all rounded-full ${locale === "en" ? "bg-purple-600 text-white" : "text-gray-500"}`}
                          >
                            EN
                          </button>
                          <button
                            onClick={() => { handleLangChange("de"); setMobileMenuOpen(false); }}
                            className={`px-6 py-2 text-xs font-bold transition-all rounded-full ${locale === "de" ? "bg-purple-600 text-white" : "text-gray-500"}`}
                          >
                            DE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
