# Deployment Guide - CyberTech Solutions Website

## Overview
This guide will help you deploy the CyberTech Solutions website to GitHub Pages and then to Cloudflare for enhanced performance and features.

## Prerequisites
- GitHub account
- Cloudflare account
- Git installed on your local machine

## Step 1: GitHub Repository Setup

### 1. Create a new GitHub repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `cybertech-solutions` or similar
4. Make it public (required for GitHub Pages)
5. Don't initialize with README (we already have one)

### 2. Upload files to GitHub
```bash
# Clone the repository (replace with your username)
git clone https://github.com/YOUR_USERNAME/cybertech-solutions.git
cd cybertech-solutions

# Copy all website files to the repository
# (All the HTML, CSS, JS, and image files we created)

# Add all files
git add .

# Commit the changes
git commit -m "Initial website deployment"

# Push to GitHub
git push origin main
```

## Step 2: GitHub Pages Setup

### 1. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch
6. Click "Save"

### 2. Configure custom domain (optional)
1. In the Pages settings, enter your domain (e.g., `cybertechsolutions.com`)
2. Add a CNAME file to your repository:
   ```
   cybertechsolutions.com
   ```

## Step 3: Cloudflare Setup

### 1. Add your domain to Cloudflare
1. Go to [Cloudflare](https://cloudflare.com)
2. Click "Add a Site"
3. Enter your domain name
4. Select the Free plan
5. Follow the DNS setup instructions

### 2. Configure DNS
Add these DNS records:
- **Type**: CNAME
- **Name**: www
- **Target**: YOUR_USERNAME.github.io
- **Proxy status**: Proxied (orange cloud)

### 3. Configure Page Rules (optional)
Create page rules for better performance:
- `cybertechsolutions.com/*` → Cache Level: Cache Everything
- `cybertechsolutions.com/security/*` → Cache Level: Cache Everything

### 4. Enable Cloudflare features
- **SSL/TLS**: Set to "Full (strict)"
- **Speed**: Enable Auto Minify for HTML, CSS, and JS
- **Caching**: Enable Browser Cache TTL
- **Security**: Enable WAF and DDoS protection

## Step 4: Custom Domain Configuration

### 1. Update GitHub Pages settings
1. Go back to your GitHub repository settings
2. In the Pages section, enter your custom domain
3. Check "Enforce HTTPS"

### 2. Update website files
Update all internal links to use your custom domain instead of relative paths.

## Step 5: Performance Optimization

### 1. Enable Cloudflare optimizations
- **Auto Minify**: HTML, CSS, JavaScript
- **Brotli**: Enable for better compression
- **Early Hints**: Enable for faster loading
- **Rocket Loader**: Enable for JavaScript optimization

### 2. Configure caching
- **Browser Cache TTL**: 4 hours
- **Edge Cache TTL**: 2 hours

## Step 6: Security Configuration

### 1. Cloudflare Security settings
- **Security Level**: Medium
- **Challenge Passage**: 30 minutes
- **Browser Integrity Check**: On
- **WAF**: On

### 2. Add security headers
Create a `_headers` file in your repository:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Step 7: Monitoring and Analytics

### 1. Enable Cloudflare Analytics
1. Go to Cloudflare Analytics
2. Enable Web Analytics
3. Add the tracking code to your website

### 2. Set up monitoring
- **Uptime Monitoring**: Enable in Cloudflare
- **Performance Monitoring**: Enable Real User Monitoring

## Step 8: Testing

### 1. Test your website
- Visit your domain to ensure it loads
- Test all navigation links
- Verify the security section works
- Check mobile responsiveness
- Test contact form functionality

### 2. Performance testing
- Use Google PageSpeed Insights
- Use GTmetrix for performance analysis
- Test with WebPageTest

## Troubleshooting

### Common Issues

1. **Website not loading**
   - Check DNS propagation (can take up to 48 hours)
   - Verify GitHub Pages is enabled
   - Check Cloudflare proxy status

2. **SSL certificate issues**
   - Ensure Cloudflare SSL is set to "Full (strict)"
   - Check for mixed content warnings

3. **Images not loading**
   - Verify image paths are correct
   - Check file permissions
   - Ensure images are committed to GitHub

4. **Security section not working**
   - Check all file paths are correct
   - Verify CSS and JS files are loading
   - Check browser console for errors

## Maintenance

### Regular tasks
1. **Update content**: Regularly update the website with new security scenarios
2. **Monitor performance**: Check Cloudflare analytics monthly
3. **Security updates**: Keep dependencies updated
4. **Backup**: Regularly backup your repository

### Adding new content
1. Create new HTML files for additional security sections
2. Update navigation links
3. Test thoroughly before pushing to production
4. Update the README.md with new features

## Support

For issues with:
- **GitHub Pages**: Check GitHub documentation
- **Cloudflare**: Contact Cloudflare support
- **Website functionality**: Check browser console for errors

## Next Steps

Once deployed, you can:
1. Add more security scenarios and playbooks
2. Implement real authentication for the security section
3. Add interactive security tools and dashboards
4. Create additional training modules
5. Integrate with real security tools and APIs

---

**Note**: This is a fictional company website for cybersecurity practice purposes. All company information, users, and scenarios are fictional and created for educational use only. 