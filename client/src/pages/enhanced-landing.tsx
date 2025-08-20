import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Users, 
  Target, 
  BookOpen, 
  Heart, 
  CheckCircle,
  ArrowRight,
  Star,
  Building2,
  UserCheck,
  Shield,
  Zap,
  Award,
  Globe,
  TrendingUp,
  MessageCircle,
  Sparkles,
  Clock,
  ThumbsUp
} from "lucide-react";

export default function EnhancedLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">BrainBridge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50" asChild>
                <a href="/login" data-testid="button-login">Login</a>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700" asChild data-testid="button-signup">
                <a href="/register">Sign Up</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="relative px-8 py-16 lg:px-16 lg:py-24 max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100" data-testid="badge-platform">
              🧠 Neuro-Inclusive Platform
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6" data-testid="text-hero-title">
              Where Unique Minds Meet<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Inclusive Opportunities</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto" data-testid="text-hero-description">
              BrainBridge is the first comprehensive platform designed specifically for neurodivergent professionals and inclusive employers. Our AI-powered matching system, certification programs, and support network create meaningful connections that drive success for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-semibold px-8" asChild data-testid="button-find-talent">
                <a href="/register">Find Amazing Talent</a>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8" asChild data-testid="button-explore-opportunities">
                <a href="/register">Explore Opportunities</a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Verified Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Industry Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>10,000+ Professionals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900" data-testid="text-features-title">
            A Complete Ecosystem for Success
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto" data-testid="text-features-description">
            From discovery to long-term success, we provide everything needed for meaningful neurodivergent employment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="card-ai-matching">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">AI-Powered Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our intelligent system matches cognitive profiles with job requirements, considering strengths, preferences, and work environment needs for optimal fit.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="card-certification">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Certification Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Structured learning paths and skill certifications that showcase abilities and build confidence while meeting industry standards.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="card-support">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Ongoing Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Mentorship programs, guardian involvement, and continuous career support ensure long-term success for all participants.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="card-inclusive">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Inclusive Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Partner with verified companies committed to neurodivergent inclusion, offering accommodating environments and growth opportunities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="card-analytics">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Success Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Track progress, measure outcomes, and optimize matches with comprehensive analytics and feedback systems.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="card-community">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Community Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Connect with peers, share experiences, and build lasting professional relationships within our supportive community.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">How BrainBridge Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple steps to meaningful connections
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Share your strengths, preferences, and goals. Our system learns what makes you unique and what environments help you thrive.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Matched</h3>
              <p className="text-gray-600">
                Our AI analyzes your profile and connects you with opportunities or talent that align with your needs and values.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Grow Together</h3>
              <p className="text-gray-600">
                Access ongoing support, certification programs, and community resources to ensure long-term success and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Success Stories</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real people, real success, real impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "BrainBridge helped me find a company that truly understands and values my unique thinking style. I'm thriving in my new role!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">S</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-500">Software Developer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "As an employer, BrainBridge connected us with incredibly talented individuals who brought fresh perspectives to our team."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">M</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marcus R.</p>
                  <p className="text-sm text-gray-500">HR Director</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The support system and certification programs gave me the confidence and skills to advance my career beyond what I thought possible."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Alex T.</p>
                  <p className="text-sm text-gray-500">Data Analyst</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to Bridge the Gap?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of neurodivergent professionals and inclusive employers who are transforming the future of work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8" asChild data-testid="button-start-today">
              <a href="/register">Start Your Journey Today</a>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8" data-testid="button-learn-more">
              <a href="/register">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BrainBridge</span>
              </div>
              <p className="text-gray-400">
                Connecting neurodivergent talent with inclusive opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/register" className="hover:text-white">For Professionals</a></li>
                <li><a href="/register" className="hover:text-white">For Employers</a></li>
                <li><a href="/register" className="hover:text-white">For Guardians</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">Best Practices</a></li>
                <li><a href="#" className="hover:text-white">Support Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BrainBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}