import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Bot, Tag, GraduationCap, Users, Shield, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-gray-900">BrainBridge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50" asChild>
                <a href="/auth" data-testid="button-login">Login</a>
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" asChild data-testid="button-signup">
                <a href="/auth">Sign Up</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        <div 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1
          }}
          className="absolute inset-0"
        />
        <div className="relative px-8 py-16 lg:px-16 lg:py-24 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
              Unlock Neurodivergent Talent,<br />
              <span className="text-blue-100">Transform Your Workplace</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl" data-testid="text-hero-description">
              BrainBridge connects neurodivergent professionals with inclusive employers through AI-powered matching, comprehensive certification, and ongoing support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold" asChild data-testid="button-start-job-seeker">
                <a href="/auth">Start as Job Seeker</a>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 font-semibold" asChild data-testid="button-register-employer">
                <a href="/auth">Register as Employer</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900" data-testid="text-features-title">
            Comprehensive Neuro-Inclusion Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-testid="text-features-description">
            Our ecosystem supports the entire journey from talent discovery to successful employment and retention.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="card-hover" data-testid="card-feature-ai-matcher">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI Task Matcher</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced algorithms match cognitive profiles with job requirements for optimal fit.</p>
            </CardContent>
          </Card>

          <Card className="card-hover" data-testid="card-feature-certification">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Tag className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Corporate Certification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Verify and showcase your company's commitment to neuro-inclusive practices.</p>
            </CardContent>
          </Card>

          <Card className="card-hover" data-testid="card-feature-learning">
            <CardHeader>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Microlearning modules designed specifically for neurodivergent learning styles.</p>
            </CardContent>
          </Card>

          <Card className="card-hover" data-testid="card-feature-mentoring">
            <CardHeader>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-warning" />
              </div>
              <CardTitle>Mentor Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Connect with experienced professionals and peer mentors for guidance.</p>
            </CardContent>
          </Card>

          <Card className="card-hover" data-testid="card-feature-privacy">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your data is protected with granular consent controls and privacy by design.</p>
            </CardContent>
          </Card>

          <Card className="card-hover" data-testid="card-feature-analytics">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Impact Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Track diversity outcomes and measure the success of inclusion initiatives.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8" data-testid="text-cta-title">
            Ready to Transform Your Talent Strategy?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 font-semibold" asChild data-testid="button-get-started">
              <a href="/auth">Get Started Today</a>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold" data-testid="button-schedule-demo">
              <a href="/auth">Schedule Demo</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">BrainBridge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 BrainBridge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
