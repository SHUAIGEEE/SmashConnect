"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  landingPageKeyFeatures,
  landingPageTestimonials
} from "@/constants/data";
import { Apple, Earth, Smartphone, Tv, Webhook } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <Earth className="h-6 w-6" />
          <span className="sr-only">SmashConnect</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium underline-offset-4 hover:underline"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium underline-offset-4 hover:underline"
            prefetch={false}
          >
            Testimonials
          </Link>
          <Link
            href="#platforms"
            className="text-sm font-medium underline-offset-4 hover:underline"
            prefetch={false}
          >
            Platforms
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium underline-offset-4 hover:underline"
            prefetch={false}
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full border-y pt-12 md:pt-24 lg:pt-32">
          <div className="space-y-10 px-4 md:px-6 xl:space-y-16">
            <div className="mx-auto grid max-w-[1300px] gap-4 px-4 sm:px-6 md:grid-cols-2 md:gap-16 md:px-10">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Elevate Your Badminton Experience
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover the ultimate badminton platform for finding game
                  buddies, exploring courts, tracking events, and more.
                </p>
                <div className="mt-6 space-x-4">
                  <Link
                    href="/auth/register"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Join Now
                  </Link>
                  <Link
                    href="/#features"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="aspect-video h-full w-full overflow-hidden rounded-t-xl" />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Unlock the Full Potential of Your Badminton Journey
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SmashConnect offers a comprehensive suite of features to enhance
                your badminton experience, from matchmaking to equipment
                reviews.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              {landingPageKeyFeatures.map((feature, index) => (
                <div key={index} className="grid gap-1">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="w-full bg-muted py-12 md:py-24 lg:py-32"
        >
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                What Our Users Say
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from our satisfied customers about their experience with
                SmashConnect.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {landingPageTestimonials.map((testimonial, index) => (
                <Card key={index} className="bg-background p-6 shadow-md">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {testimonial.quote}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="platforms" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Available Platforms
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Access SmashConnect Anywhere
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SmashConnect is available on a variety of platforms, so you
                  can stay connected to your badminton community no matter where
                  you are.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg bg-background p-6 shadow-md">
                  <Apple className="h-12 w-12 text-primary" />
                  <h3 className="mt-2 text-lg font-bold">iOS</h3>
                  <p className="text-sm text-muted-foreground">
                    Download on the App Store
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background p-6 shadow-md">
                  <Smartphone className="h-12 w-12 text-primary" />
                  <h3 className="mt-2 text-lg font-bold">Android</h3>
                  <p className="text-sm text-muted-foreground">
                    Get it on Google Play
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background p-6 shadow-md">
                  <Webhook className="h-12 w-12 text-primary" />
                  <h3 className="mt-2 text-lg font-bold">Web</h3>
                  <p className="text-sm text-muted-foreground">
                    Access on any device
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-background p-6 shadow-md">
                  <Tv className="h-12 w-12 text-primary" />
                  <h3 className="mt-2 text-lg font-bold">TV</h3>
                  <p className="text-sm text-muted-foreground">
                    Available on smart TVs
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  No matter where you are, you can stay connected to the
                  badminton community you love. Download SmashConnect on your
                  preferred platform and never miss a match.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Download Now
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 SmashConnect. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            href="#"
            className="text-xs underline-offset-4 hover:underline"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs underline-offset-4 hover:underline"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
