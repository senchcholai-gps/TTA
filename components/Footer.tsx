'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function Footer() {
  const shouldReduceMotion = useReducedMotion()

  // Social icon hover: lift 3px, rotate 2°. Very subtle.
  const socialHover = shouldReduceMotion
    ? undefined
    : { y: -3, rotate: 2, transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } }

  return (
    <footer className="bg-[#0f0f12] text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Column 1: Company Description & Social Links */}
          <div>
            <img src="/TTA_Logo_Landscape_White.png" alt="The Three Amigos" className="h-8 w-auto mb-4 object-contain" />
            <p className="text-sm text-gray-400 mb-6">AI-powered marketing for brands that grow fast.</p>
            <div className="flex gap-4">
              {/* LinkedIn */}
              <motion.a
                href="https://www.linkedin.com/in/thethreeamigosdm/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={socialHover}
                className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-brand-purple text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                </svg>
              </motion.a>
              {/* Instagram */}
              <motion.a
                href="https://www.instagram.com/thethreeamigos_dm/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={socialHover}
                className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center hover:bg-brand-magenta text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#services" className="hover:text-white transition-colors duration-300">AI Marketing</a></li>
              <li><a href="/#services" className="hover:text-white transition-colors duration-300">Social Media</a></li>
              <li><a href="/#services" className="hover:text-white transition-colors duration-300">Content</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#about" className="hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="/#portfolio" className="hover:text-white transition-colors duration-300">Portfolio</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors duration-300">Blog</a></li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#faq" className="hover:text-white transition-colors duration-300">FAQ</a></li>
              <li><a href="/#contact" className="hover:text-white transition-colors duration-300">Free Audit</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors duration-300">Insights</a></li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Contact</h4>
            <div className="space-y-3 text-sm">
              <div>
                <a
                  href="https://wa.me/918526462969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {/* Official WhatsApp Brand Icon */}
                  <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12.031 2c-5.516 0-9.987 4.471-9.987 9.987 0 1.763.459 3.481 1.332 5.006L2 22l5.129-1.343c1.472.802 3.136 1.224 4.896 1.224 5.516 0 9.987-4.471 9.987-9.987C22.012 6.471 17.547 2 12.031 2zm5.955 14.187c-.254.717-1.254 1.312-1.733 1.406-.44.086-1.002.122-2.871-.649-2.385-.983-3.916-3.407-4.037-3.567-.121-.16-.977-1.298-.977-2.476 0-1.178.613-1.751.831-1.98.217-.229.475-.286.634-.286.158 0 .317.001.455.008.146.007.344-.055.54.42.202.493.689 1.681.748 1.802.06.12.099.261.019.42-.08.16-.12.261-.238.4-.12.14-.252.313-.36.433-.121.134-.247.28-.106.522.141.242.628 1.037 1.348 1.677.926.825 1.708 1.08 1.949 1.201.241.12.383.101.524-.06.141-.161.603-.703.764-.944.161-.241.322-.201.543-.12.221.08 1.405.663 1.646.784.241.12.402.181.462.282.06.101.06.583-.194 1.300z" />
                  </svg>
                  <span>+91 85264 62969</span>
                </a>
              </div>
              <div>
                <a
                  href="mailto:thethreeamigosdm@gmail.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  {/* Mail icon */}
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>thethreeamigosdm@gmail.com</span>
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-400">Chennai, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} The Three Amigos. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
