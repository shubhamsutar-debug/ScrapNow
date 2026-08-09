import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brand-card border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-bold text-brand-text text-xl mb-2">ScrapNow</div>
            <p className="text-brand-text-secondary text-sm">India's trusted scrap selling marketplace</p>
          </div>
          <div>
            <h3 className="font-semibold text-brand-text mb-4 text-sm">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">Home</a></li>
              <li><a href="#" className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">Scrap Prices</a></li>
              <li><a href="#" className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">For Collectors</a></li>
              <li><a href="#" className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-brand-text mb-4 text-sm">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-brand-text-secondary">Email: hello@scrapnow.in</p>
              <p className="text-sm text-brand-text-secondary">Phone: +91 98765 43210</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-brand-border mt-8 pt-6 text-center text-xs text-brand-text-secondary">
          © 2026 ScrapNow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
