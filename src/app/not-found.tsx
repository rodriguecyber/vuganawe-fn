'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md p-8 text-center">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-9xl font-bold text-orange-500">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
                        <p className="text-gray-600">
                            Oops! The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                        <Link href="/" className="w-full sm:w-auto">
                            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                <Home className="h-4 w-4 mr-2" />
                                Return Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
} 