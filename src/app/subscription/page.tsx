"use client"

import React, { useState, FormEvent } from 'react';
import { Bell, Calendar, CreditCard, Gift, Mail, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Define TypeScript interfaces
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TimelineItemProps {
  date: string;
  title: string;
  description: string;
  active?: boolean;
}

export default function SubscriptionComingSoon(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("You'll be notified when subscriptions launch!");
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Subscriptions Coming Soon
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're working hard to bring you premium subscription features that will enhance your experience.
            Be the first to know when we launch!
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Star className="h-8 w-8 text-yellow-500" />}
            title="Premium Content"
            description="Access exclusive content and features only available to subscribers."
          />
          <FeatureCard
            icon={<CreditCard className="h-8 w-8 text-green-500" />}
            title="Flexible Plans"
            description="Choose from monthly or annual subscription options that fit your needs."
          />
          <FeatureCard
            icon={<Gift className="h-8 w-8 text-purple-500" />}
            title="Exclusive Perks"
            description="Enjoy special perks and bonuses available only to our subscribers."
          />
          <FeatureCard
            icon={<Bell className="h-8 w-8 text-blue-500" />}
            title="Priority Support"
            description="Get priority access to our support team with faster response times."
          />
          <FeatureCard
            icon={<Calendar className="h-8 w-8 text-red-500" />}
            title="Early Access"
            description="Be the first to access new features before they're released to everyone."
          />
          <FeatureCard
            icon={<Mail className="h-8 w-8 text-indigo-500" />}
            title="No Ads"
            description="Enjoy an ad-free experience across our entire platform."
          />
        </div>

        {/* Notification Form */}
        <Card className="max-w-lg mx-auto backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-xl">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Get Notified When We Launch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="flex-grow bg-white dark:bg-gray-900"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Notify Me"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                We'll only notify you when subscriptions launch. No spam, ever.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="mt-20 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-800 dark:text-white">Launch Timeline</h2>
          <div className="space-y-8">
            <TimelineItem 
              date="Now" 
              title="Development Phase" 
              description="We're currently building and testing subscription features."
              active={true}
            />
            <TimelineItem 
              date="Coming Soon" 
              title="Beta Testing" 
              description="Selected users will get early access to try our subscription features."
            />
            <TimelineItem 
              date="Launch" 
              title="Official Release" 
              description="Subscriptions will be available to everyone with special early bird pricing."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function FeatureCard({ icon, title, description }: FeatureCardProps): React.ReactElement {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-3 text-gray-800 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function TimelineItem({ date, title, description, active = false }: TimelineItemProps): React.ReactElement {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-6">
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
          active 
            ? "bg-blue-600 text-white" 
            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
        }`}>
          {active ? "✓" : ""}
        </div>
        {/* Line */}
        <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="pb-8">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{date}</span>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-1">{title}</h4>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{description}</p>
      </div>
    </div>
  );
}