export function Footer() {
  return (
    <footer id="about-us" className="bg-[#A14646] text-white pt-16 pb-12 border-t border-[#DA6556]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-[#DA6556]/60">
          
          {/* Left Column: Company & Address */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg tracking-wide text-[#FDB773]">
              MASLOW SA SDN BHD
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              No. 7 &amp; 9, Jalan PJS 7/17,<br />
              Bandar Sunway, 46150 Petaling Jaya,<br />
              Selangor
            </p>
            <p className="text-sm font-medium text-white/90">
              <span className="text-[#FDB773]">Contact No :</span> 012 668 7300
            </p>
          </div>

          {/* Middle Column: Mission Statement */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg tracking-wide text-[#FDB773]">
              Our Mission
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Our mission is to help every person to reach Self-Actualisation. We believe self-actualisation propel learning ability to ultimate level, thus developing a mechanism for acquiring micro skills and knowledge conveniently, fast and affordable.
            </p>
          </div>

          {/* Right Column: Contact Inquiry */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg tracking-wide text-[#FDB773]">
              Get in Touch
            </h3>
            <p className="text-sm text-white/90">
              Interested? Contact us today at:
            </p>
            <a 
              href="mailto:sales@maslowsa.com" 
              className="inline-block px-4 py-2.5 rounded-xl bg-[#FDB773] text-slate-900 font-bold text-sm shadow-md hover:bg-white transition"
            >
              sales@maslowsa.com
            </a>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/80 gap-4">
          <p>© 2026 Maslow SA Sdn Bhd. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[#FDB773] font-medium">
            <span>Certified Professional Training Marketplace</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
