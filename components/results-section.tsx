"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, AlertTriangle, Download, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data
const scanHistory = [
  {
    date: "3.2.2026",
    username: "@maxmustermann",
    status: "Completed",
    scannedVideos: "129 / 129",
    foundHits: 53,
    id: 1,
  },
];

export default function ResultsSection() {
  const t = useTranslations("HomeResults");
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="mb-10">
        <h2 className="text-3xl text-center font-bold tracking-tight mb-2">
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-lg text-center">
          {t("subtitle")}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-100 bg-green-50/50 dark:bg-green-950/10 dark:border-green-900 border shadow-sm">
            <CardContent className="pt-6 flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-green-700 dark:text-green-400">88</span>
                </div>
                <div className="font-semibold text-foreground">{t("safeReels")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("safeDesc")}
                </div>
              </div>
            </CardContent>
        </Card>

        <Card className="border-red-100 bg-red-50/50 dark:bg-red-950/10 dark:border-red-900 border shadow-sm">
            <CardContent className="pt-6 flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-red-600 dark:text-red-400">53</span>
                </div>
                <div className="font-semibold text-foreground">{t("flaggedReels")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("flaggedDesc")}
                </div>
              </div>
            </CardContent>
        </Card>
      </div>

      {/* History Table Card */}
      <Card className="shadow-sm border !my-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{t("scanHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">{t("table.date")}</TableHead>
                <TableHead>{t("table.username")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.scannedVideos")}</TableHead>
                <TableHead>{t("table.hitsFound")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scanHistory.map((scan) => (
                <TableRow key={scan.id} className="bg-red-50/30 hover:bg-red-50/60 dark:bg-red-950/10 dark:hover:bg-red-950/20 border-b-0">
                  <TableCell className="font-medium">{scan.date}</TableCell>
                  <TableCell>{scan.username}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                      {scan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{scan.scannedVideos}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-red-600 font-bold dark:text-red-400">
                      {scan.foundHits}
                      <AlertTriangle className="ml-2 h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-9 border-purple-200 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/30">
                        {t("table.viewDetails")}
                      </Button>
                      <Button size="sm" className="h-9 w-9 p-0 bg-purple-600 hover:bg-purple-700 text-white">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
