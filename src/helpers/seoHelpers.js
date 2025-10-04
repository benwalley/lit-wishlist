/**
 * SEO helpers for dynamic meta tag management in SPA
 */

export class SEOManager {
    constructor() {
        this.defaultTitle = "Free Online Wishlist Maker | Share Gift Lists with Family & Friends";
        this.defaultDescription = "Create and share wishlists for birthdays, Christmas, weddings & more. Free online wishlist maker with group sharing, gift coordination, and privacy controls.";
        this.siteName = "Wishlist Website";
        this.baseUrl = window.location.origin;
    }

    /**
     * Update page meta tags dynamically
     * @param {Object} seoData - SEO data for the page
     * @param {string} seoData.title - Page title
     * @param {string} seoData.description - Page description  
     * @param {string} seoData.keywords - Page keywords
     * @param {string} seoData.canonical - Canonical URL
     * @param {string} seoData.ogImage - Open Graph image URL
     */
    updatePageSEO(seoData = {}) {
        const {
            title = this.defaultTitle,
            description = this.defaultDescription,
            keywords = "",
            canonical = window.location.href,
            ogImage = `${this.baseUrl}/og-image.png`
        } = seoData;

        // Update document title
        document.title = title;

        // Update or create meta tags
        this.updateMetaTag('description', description);
        this.updateMetaTag('keywords', keywords);
        
        // Update canonical link
        this.updateLink('canonical', canonical);

        // Update Open Graph tags
        this.updateMetaProperty('og:title', title);
        this.updateMetaProperty('og:description', description);
        this.updateMetaProperty('og:url', canonical);
        this.updateMetaProperty('og:image', ogImage);

        // Update Twitter tags
        this.updateMetaName('twitter:title', title);
        this.updateMetaName('twitter:description', description);
        this.updateMetaName('twitter:image', ogImage);
    }

    /**
     * Update or create a meta tag with name attribute
     */
    updateMetaTag(name, content) {
        if (!content) return;
        
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    /**
     * Update or create a meta tag with property attribute (for Open Graph)
     */
    updateMetaProperty(property, content) {
        if (!content) return;
        
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    /**
     * Update or create a meta tag with name attribute (for Twitter)
     */
    updateMetaName(name, content) {
        if (!content) return;
        
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    /**
     * Update or create a link tag
     */
    updateLink(rel, href) {
        if (!href) return;
        
        let link = document.querySelector(`link[rel="${rel}"]`);
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', rel);
            document.head.appendChild(link);
        }
        link.setAttribute('href', href);
    }

    /**
     * Get SEO data for different page types
     */
    getPageSEO(path, params = {}) {
        // Home/Landing page
        if (path === '/') {
            return {
                title: this.defaultTitle,
                description: this.defaultDescription,
                keywords: "wishlist maker, online wishlist, free wishlist, gift list, christmas wishlist, birthday wishlist, wedding registry, share wishlist, gift coordination, family wishlist",
                canonical: this.baseUrl + '/'
            };
        }

        // Public pages (not SEO optimized - blocked by robots.txt)
        if (path.startsWith('/public/')) {
            return {
                title: `${params.listName || params.userName || 'Page'} | Wishlist Website`,
                description: this.defaultDescription,
                keywords: "",
                canonical: this.baseUrl + path
            };
        }

        // How-to/Help pages
        if (path === '/how-to-use') {
            return {
                title: "How to Create and Share Wishlists | Complete Guide | Wishlist Website",
                description: "Learn how to create wishlists, share with family & friends, import from Amazon, organize events, and coordinate gifts. Complete wishlist guide with tips and tricks.",
                keywords: "how to create wishlist, wishlist tutorial, share wishlist, amazon import, gift coordination guide",
                canonical: this.baseUrl + '/how-to-use'
            };
        }

        // Default for authenticated pages
        return {
            title: `${this.getPageTitle(path)} | Wishlist Website`,
            description: this.defaultDescription,
            keywords: "",
            canonical: this.baseUrl + path
        };
    }

    /**
     * Get simple page titles for different routes
     */
    getPageTitle(path) {
        const titles = {
            '/account': 'Dashboard',
            '/lists': 'All Lists',
            '/my-lists': 'My Lists', 
            '/users': 'All Users',
            '/groups': 'Groups',
            '/events': 'Events',
            '/proposals': 'Gift Proposals',
            '/import': 'Import Wishlist',
            '/bulk-actions': 'Bulk Actions',
            '/subusers': 'Subusers',
            '/money-tracking': 'Money Tracking',
            '/qa': 'Questions & Answers',
            '/add-item': 'Add Item',
        };

        // Handle dynamic routes with better fallbacks
        if (path.startsWith('/user/')) return 'User Profile';
        if (path.startsWith('/group/')) return 'Group';
        if (path.startsWith('/list/') && path.includes('/item/')) return 'Item Details';
        if (path.startsWith('/list/')) return 'List';
        if (path.startsWith('/item/')) return 'Item Details';
        if (path.startsWith('/events/')) return 'Event Details';
        if (path.startsWith('/how-to-use')) return 'How to Use';

        return titles[path] || 'Page';
    }

    /**
     * Generate structured data for the page
     */
    updateStructuredData(data) {
        // Remove existing structured data
        const existing = document.querySelector('script[type="application/ld+json"]');
        if (existing) {
            existing.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    /**
     * Generate organization schema
     */
    getOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Wishlist Website",
            "description": "Free online wishlist maker for sharing gift lists with family and friends",
            "url": this.baseUrl,
            "logo": `${this.baseUrl}/logo.svg`,
            "sameAs": [
                // Add social media profiles when available
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "benwalleyorigami@gmail.com"
            }
        };
    }

    /**
     * Generate WebApplication schema
     */
    getWebApplicationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Wishlist Website",
            "description": "Create and share wishlists for birthdays, Christmas, weddings and more",
            "url": this.baseUrl,
            "applicationCategory": "Lifestyle",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "featureList": [
                "Create unlimited wishlists",
                "Share with family and friends", 
                "Import from Amazon",
                "Group gift coordination",
                "Event organization",
                "Privacy controls"
            ]
        };
    }
}

// Create global SEO manager instance
export const seoManager = new SEOManager();