const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Farmer Management System</h3>
          <p>Empowering farmers with data-driven insights and direct market access</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Modules</h4>
          <ul>
            <li><a href="/crop-planning">Crop Planning</a></li>
            <li><a href="/analytics">Analytics</a></li>
            <li><a href="/marketplace">Marketplace</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 support@farmermanagement.com</p>
          <p>📞 +91 1800-XXX-XXXX</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Farmer Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
