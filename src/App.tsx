import { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  Eye,
  ShieldCheck,
  FileText,
  TrendingUp,
  Network,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import IMAGES from './config/images';

interface FormData {
  fullName: string;
  email: string;
  role: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    role: 'Helper (Donor/Volunteer)',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Scroll detection for navbar and reveal animations
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const scrollPosition = window.scrollY;
        // Check if scrolled past hero section
        setIsScrolled(scrollPosition > 100);
      }

      // Scroll reveal animations
      const reveals = document.querySelectorAll('.scroll-reveal');
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date('2026-05-01T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare submission data with timestamp
      const submissionData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        timestamp: new Date().toISOString(),
      };

      console.log('📤 Submitting form...', submissionData);

      // Get API endpoint from environment variable or use default
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '/api/signup';

      // Add timeout to prevent infinite loading (10 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - check your API endpoint and network connection')), 10000)
      );

      // Send to backend API
      const response = await Promise.race([
        fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        }),
        timeoutPromise
      ]) as Response;

      if (response.ok) {
        console.log('✅ Successfully submitted form!');
        setSubmitStatus('success');
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          role: 'Helper (Donor/Volunteer)',
        });
        setFormErrors({});
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
    } catch (error: any) {
      console.error('❌ Form submission error:', error);
      
      // Provide helpful error messages
      let errorMessage = 'Failed to submit form. ';
      
      if (error?.message?.includes('timeout')) {
        errorMessage += 'Request timed out. Please check your API endpoint and try again.';
      } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        errorMessage += 'Network error. Please check your internet connection and API endpoint.';
      } else if (error?.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please check your backend configuration. See BACKEND_GUIDE.md for setup instructions.';
      }
      
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack
      });
      
      setSubmitStatus('error');
      // Don't show alert, let the error message in the form display
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => scrollToSection('hero')}>
              <img src={IMAGES.logo} alt="PulseAid Logo" className="w-10 h-10 transition-transform duration-300 hover:rotate-12" />
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-white'
              }`}>PulseAid</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button 
                onClick={() => scrollToSection('hero')} 
                className={`transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about-us')} 
                className={`transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('team')} 
                className={`transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Team
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className={`transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('signup')} 
                className={`transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isScrolled 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700' 
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => scrollToSection('signup')}
                className={`px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:scale-105 btn-press ${
                  isScrolled 
                    ? 'bg-primary text-white hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400' 
                    : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30'
                }`}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isScrolled 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200' 
                    : 'bg-white/20 backdrop-blur-sm text-white'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className="transition-transform duration-300 hover:scale-110"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className={`w-6 h-6 transition-colors duration-300 ${isScrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'}`} />
                ) : (
                  <Menu className={`w-6 h-6 transition-colors duration-300 ${isScrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden pb-4 transition-all duration-300 ${
              isScrolled 
                ? 'bg-white dark:bg-gray-900' 
                : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md'
            }`}>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className="text-left text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-2 py-2"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('about-us')} 
                  className="text-left text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-2 py-2"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('team')} 
                  className="text-left text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-2 py-2"
                >
                  Team
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="text-left text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-2 py-2"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('signup')} 
                  className="text-left text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-300 transition-all duration-300 hover:translate-x-2 py-2"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => scrollToSection('signup')}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-400 transition-all duration-300 text-center shadow-md hover:scale-105 btn-press"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-16 bg-gradient-to-br from-primary to-primary-700 dark:from-primary-800 dark:to-primary-900 text-white overflow-hidden min-h-[85vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-primary-800/50 to-transparent z-10"></div>
          <img 
            src={IMAGES.hero.background} 
            alt="Helping hands"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 z-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in text-white">
              Bringing Help Where It's Needed Most
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-fade-in-delay leading-relaxed">
              Connecting verified institutions with donors and volunteers to make every act count.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2 mb-12">
              <button
                onClick={() => scrollToSection('signup')}
                className="w-full sm:w-auto bg-white text-primary px-8 py-3 rounded-lg font-semibold text-base hover:bg-gray-50 transition-colors duration-200 shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-white/10 transition-colors duration-200"
              >
                Learn More
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 md:gap-8 text-white/80 animate-fade-in-delay-2">
              <div className="text-sm md:text-base font-medium">100% Verified Institutions</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-sm md:text-base font-medium">Full Transparency</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-sm md:text-base font-medium">Real Impact Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Challenge We're Solving
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Too many institutions in need remain invisible, while willing helpers struggle to find trustworthy ways to make an impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 interactive-card scroll-reveal">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <Eye className="w-7 h-7 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lack of Visibility</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Orphanages, hospitals, and care centers struggle to reach potential donors and volunteers.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 interactive-card scroll-reveal">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <ShieldCheck className="w-7 h-7 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Trust Issues</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Donors and volunteers find it difficult to identify trusted and verified channels for their support.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 interactive-card scroll-reveal">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <TrendingUp className="w-7 h-7 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Unclear Impact</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Helpers often don't know if their contributions are making a real difference or reaching those in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              About PulseAid
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 mb-12 scroll-reveal">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              PulseAid connects verified institutions such as orphanages, hospitals, and care centers with donors and volunteers. Our mission is to make giving simple, transparent, and impactful, ensuring every act of support reaches the people who need it most.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Many institutions struggle to gain visibility, and donors often lack trusted channels to help. PulseAid solves this by providing a centralized platform where needs are posted, tracked, and fulfilled with full accountability.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our vision is a world where helping is easy, transparent, and meaningful. By connecting institutions and supporters, we build lasting impact and trust in the process of giving.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl interactive-card hover:glow scroll-reveal transition-all duration-300">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Integrity</h3>
              <p className="text-gray-600 dark:text-gray-300">Every institution is verified before joining.</p>
            </div>

            <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl interactive-card hover:glow scroll-reveal transition-all duration-300">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Transparency</h3>
              <p className="text-gray-600 dark:text-gray-300">Helpers can track the impact of their support.</p>
            </div>

            <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl interactive-card hover:glow scroll-reveal transition-all duration-300">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Empathy</h3>
              <p className="text-gray-600 dark:text-gray-300">We prioritize dignity and respect in all interactions.</p>
            </div>

            <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl interactive-card hover:glow scroll-reveal transition-all duration-300">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reliability</h3>
              <p className="text-gray-600 dark:text-gray-300">A secure, trustworthy platform for donors and institutions alike.</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => scrollToSection('signup')}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-primary-600 dark:hover:bg-primary-400 transition-colors duration-200 shadow-md"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section id="team" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The passionate team behind PulseAid, working to make helping simple, transparent, and meaningful.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Team Member 1 */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group interactive-card scroll-reveal transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden">
                <img 
                  src={IMAGES.team.richard} 
                  alt="Richard Elikem Amenorpe"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Richard Elikem Amenorpe</h3>
                <p className="text-primary dark:text-primary-300 font-semibold mb-3">Founder & CEO</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  "Passionate about creating platforms that directly impact lives and build trust between helpers and institutions."
                </p>
                <div className="flex space-x-3">
                  <a
                    href="https://www.linkedin.com/in/richard-elikem-292107309/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="mailto:richardelikem31@gmail.com"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm font-medium">Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group interactive-card scroll-reveal transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden">
                <img 
                  src={IMAGES.team.vanessa} 
                  alt="Dela Christlieb"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Dela Christlieb</h3>
                <p className="text-primary dark:text-primary-300 font-semibold mb-3">Development Lead</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  "Team lead for development and product execution at PulseAid."
                </p>
                <div className="flex space-x-3">
                  <a
                    href="https://www.linkedin.com/in/christlieb-d-776818253/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="mailto:christliebdela@gmail.com"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm font-medium">Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group interactive-card scroll-reveal transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden">
                <img 
                  src={IMAGES.team.kelvin} 
                  alt="Sylvester Ogbu"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Sylvester Ogbu</h3>
                <p className="text-primary dark:text-primary-300 font-semibold mb-3">Design Lead</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  "Designs intuitive interfaces that make helping simple, fast, and transparent."
                </p>
                <div className="flex space-x-3">
                  <a
                    href="https://www.linkedin.com/in/ogonna-sylvester-ogbu-b10680357/"
                    className="flex items-center space-x-2 text-primary dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                  <a
                    href="mailto:ogbuogonnasylvester@gmail.com"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm font-medium">Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center scroll-reveal">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Connect with our team on LinkedIn or reach out via email to learn more about PulseAid and get involved.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Vision & Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              PulseAid bridges the gap between verified institutions and compassionate helpers, creating a transparent ecosystem where every act of kindness counts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-xl hover:shadow-lg transition-all duration-300 interactive-card scroll-reveal transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-200 dark:bg-primary-700 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <ShieldCheck className="w-7 h-7 text-primary dark:text-primary-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Verified Institutions</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Every organization on our platform goes through a rigorous verification process to ensure authenticity and credibility.
              </p>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-xl hover:shadow-lg transition-all duration-300 interactive-card scroll-reveal transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-200 dark:bg-primary-700 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <FileText className="w-7 h-7 text-primary dark:text-primary-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Transparent Needs</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Institutions post real-time needs with complete transparency, so you know exactly where your help is going.
              </p>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-xl hover:shadow-lg transition-all duration-300 interactive-card scroll-reveal transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-200 dark:bg-primary-700 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <TrendingUp className="w-7 h-7 text-primary dark:text-primary-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Visible Impact</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Track the direct impact of your contributions and see how you're making a difference in real lives.
              </p>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 p-8 rounded-xl hover:shadow-lg transition-all duration-300 interactive-card scroll-reveal transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-200 dark:bg-primary-700 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <Network className="w-7 h-7 text-primary dark:text-primary-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Connected Community</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Join a growing community of compassionate individuals and organizations working together for positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How PulseAid Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A simple, transparent process that connects those who need help with those who want to help.
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center scroll-reveal">
              <div className="order-2 md:order-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold transition-transform duration-300 hover:scale-110 hover:rotate-12">
                    01
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-110">
                      <Users className="w-6 h-6 text-primary dark:text-primary-300" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Institutions Register</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Care centers, hospitals, and orphanages sign up and complete our verification process to join the platform.
                </p>
              </div>
              <div className="order-1 md:order-2 rounded-xl overflow-hidden h-64 shadow-lg interactive-card hover:scale-105 transition-all duration-300">
                <img 
                  src={IMAGES.howItWorks.step1} 
                  alt="Institutions Register"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center scroll-reveal">
              <div className="rounded-xl overflow-hidden h-64 shadow-lg interactive-card hover:scale-105 transition-all duration-300">
                <img 
                  src={IMAGES.howItWorks.step2} 
                  alt="Post Real Needs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold transition-transform duration-300 hover:scale-110 hover:rotate-12">
                    02
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-110">
                      <FileText className="w-6 h-6 text-primary dark:text-primary-300" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Post Real Needs</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Verified institutions share their specific needs, from medical supplies to volunteer support, with complete transparency.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center scroll-reveal">
              <div className="order-2 md:order-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold transition-transform duration-300 hover:scale-110 hover:rotate-12">
                    03
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-110">
                      <Heart className="w-6 h-6 text-primary dark:text-primary-300" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Helpers Make Impact</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Donors and volunteers pledge support, track their contributions, and see the real-world impact of their generosity.
                </p>
              </div>
              <div className="order-1 md:order-2 rounded-xl overflow-hidden h-64 shadow-lg interactive-card hover:scale-105 transition-all duration-300">
                <img 
                  src={IMAGES.howItWorks.step3} 
                  alt="Helpers Make Impact"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section id="signup" className="py-20 bg-gradient-to-br from-primary to-primary-700 dark:from-primary-800 dark:to-primary-900 text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Ready to Make Your Mark?
            </h2>
            <p className="text-xl md:text-2xl text-white/95 mb-2 font-medium">
              Join thousands of changemakers who are transforming lives through PulseAid.
            </p>
            <p className="text-lg text-white/85 max-w-2xl mx-auto">
              Be among the first to experience a platform where every contribution creates visible, lasting impact.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="text-center mb-12">
            <p className="text-lg mb-6">Launching in:</p>
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-sm text-white/80">Days</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-sm text-white/80">Hours</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-sm text-white/80">Minutes</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-white/80">Seconds</div>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-2xl max-w-2xl mx-auto scroll-reveal transition-colors duration-300">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3 animate-fade-in">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Success! You're on the list!</h4>
                  <p className="text-sm text-green-700">Thank you for signing up. We'll keep you updated on PulseAid's launch.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-fade-in">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Oops! Something went wrong</h4>
                  <p className="text-sm text-red-700">Please try again later or contact us directly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3.5 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    formErrors.fullName 
                      ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent'
                  } outline-none text-gray-900 dark:text-white transition-all duration-200 hover:border-primary/50`}
                  disabled={isSubmitting}
                />
                {formErrors.fullName && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3.5 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    formErrors.email 
                      ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent'
                  } outline-none text-gray-900 dark:text-white transition-all duration-200 hover:border-primary/50`}
                  disabled={isSubmitting}
                />
                {formErrors.email && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  I am a: *
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white cursor-pointer transition-all duration-200 hover:border-primary/50"
                  disabled={isSubmitting}
                >
                  <option>Helper (Donor/Volunteer)</option>
                  <option>Institution (Organization)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-primary-600 dark:hover:bg-primary-400 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  'Sign Up for Early Access'
                )}
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                By signing up, you agree to receive updates about PulseAid's launch and platform features.
              </p>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-sm text-white/90">Verified Organizations</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-sm text-white/90">Secure Platform</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mb-3">
                <Eye className="w-6 h-6" />
              </div>
              <p className="text-sm text-white/90">100% Transparent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={IMAGES.logo} alt="PulseAid Logo" className="w-10 h-10" />
                <span className="text-xl font-bold">PulseAid</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Connecting verified institutions with donors and volunteers to make every act count.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about-us')} className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('team')} className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    Our Team
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('signup')} className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href="mailto:hello.pulseaid@gmail.com" className="text-gray-400 hover:text-white transition">
                    hello.pulseaid@gmail.com
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">GCTU Main Campus, Accra-Ghana</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Global Platform</span>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/110814731/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 dark:bg-gray-700 hover:bg-primary dark:hover:bg-primary-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/pulseaid_hq"
                  target="_blank"
                  className="w-10 h-10 bg-gray-800 dark:bg-gray-700 hover:bg-primary dark:hover:bg-primary-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/pulseaid_hq/"
                  target="_blank"
                  className="w-10 h-10 bg-gray-800 dark:bg-gray-700 hover:bg-primary dark:hover:bg-primary-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 PulseAid. All rights reserved.
            </p>
            <a
              href="https://elitech-creatives.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Powered by EliTech CreaTives
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

