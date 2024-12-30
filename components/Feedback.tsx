'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

export default function FeedbackPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();  
    const userName = user?.fullName || 'Guest';
    const userEmail = user?.emailAddresses[0]?.emailAddress || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = {
            name: userName, 
            email: userEmail, 
            feedback: (e.target as HTMLFormElement).feedback.value,
        };

        try {
            const response = await fetch('/api/user-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Something went wrong');

            toast({
                title: 'Success!',
                description: 'Thank you for your feedback.',
            });

            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Something went wrong!',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0c1329] to-[#0f1833] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-xl space-y-8">
                <div className="text-center space-y-2">
                    <MessageSquare className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                    <h1 className="text-3xl font-bold tracking-tight text-white">Share Your Thoughts</h1>
                    <p className="text-gray-400">Your feedback helps us improve and serve you better</p>
                </div>

                <Card className="border-0 shadow-2xl bg-[#0f1833]/50 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-white">Feedback Form</CardTitle>
                        <CardDescription className="text-gray-400">
                            Fill out the form below to submit your feedback
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={userName}
                                        placeholder="Your Name"
                                        required
                                        readOnly
                                        className="text-black bg-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={userEmail}
                                        placeholder="Your Email"
                                        required
                                        readOnly
                                        className="text-black bg-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="feedback" className="text-sm font-medium text-gray-300">Feedback</label>
                                    <Textarea
                                        id="feedback"
                                        name="feedback"
                                        placeholder="Share your thoughts with us..."
                                        required
                                        className="text-black bg-white border-gray-700 focus:border-blue-500 focus:ring-blue-500 min-h-[150px] placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 flex items-center justify-center gap-2 py-6"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit Feedback
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
