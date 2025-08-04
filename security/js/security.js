// Security Dashboard JavaScript

// Real-time system status updates
function updateSystemStatus() {
    const statusItems = document.querySelectorAll('.status-item');
    
    statusItems.forEach(item => {
        // Simulate random status changes
        if (Math.random() < 0.1) { // 10% chance of status change
            const statusDot = item.querySelector('.status-dot');
            const isOnline = Math.random() > 0.2; // 80% chance of being online
            
            if (isOnline) {
                item.classList.remove('offline');
                statusDot.style.background = '#10b981';
            } else {
                item.classList.add('offline');
                statusDot.style.background = '#ef4444';
            }
        }
    });
}

// Update threat metrics
function updateThreatMetrics() {
    const activeThreats = document.querySelector('.metric-value.high');
    const blockedAttacks = document.querySelector('.metric-value:not(.high):not(.good)');
    const securityScore = document.querySelector('.metric-value.good');
    
    if (activeThreats) {
        const currentThreats = parseInt(activeThreats.textContent);
        const newThreats = Math.max(0, currentThreats + Math.floor(Math.random() * 3) - 1);
        activeThreats.textContent = newThreats;
    }
    
    if (blockedAttacks) {
        const currentBlocked = parseInt(blockedAttacks.textContent.replace(',', ''));
        const newBlocked = currentBlocked + Math.floor(Math.random() * 5);
        blockedAttacks.textContent = newBlocked.toLocaleString();
    }
    
    if (securityScore) {
        const currentScore = parseInt(securityScore.textContent);
        const newScore = Math.max(85, Math.min(98, currentScore + Math.floor(Math.random() * 3) - 1));
        securityScore.textContent = newScore + '%';
    }
}

// Add new activity items
function addActivityItem() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    const activities = [
        {
            type: 'warning',
            icon: 'fas fa-exclamation-triangle',
            title: 'Suspicious Login Attempt',
            description: 'Multiple failed login attempts detected from unknown IP',
            time: '5 minutes ago'
        },
        {
            type: 'info',
            icon: 'fas fa-info-circle',
            title: 'Security Update Installed',
            description: 'Latest security patches applied to all systems',
            time: '15 minutes ago'
        },
        {
            type: 'success',
            icon: 'fas fa-check-circle',
            title: 'Backup Completed',
            description: 'Daily backup process completed successfully',
            time: '1 hour ago'
        },
        {
            type: 'warning',
            icon: 'fas fa-shield-alt',
            title: 'Malware Detected',
            description: 'Suspicious file quarantined by EDR system',
            time: '2 hours ago'
        }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div class="activity-icon ${randomActivity.type}">
            <i class="${randomActivity.icon}"></i>
        </div>
        <div class="activity-content">
            <h4>${randomActivity.title}</h4>
            <p>${randomActivity.description}</p>
            <span class="activity-time">${randomActivity.time}</span>
        </div>
    `;
    
    // Add to the beginning of the list
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Remove oldest item if more than 5 items
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
}

// Initialize dashboard
function initDashboard() {
    // Update system status every 30 seconds
    setInterval(updateSystemStatus, 30000);
    
    // Update threat metrics every 60 seconds
    setInterval(updateThreatMetrics, 60000);
    
    // Add new activity every 2-5 minutes
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance
            addActivityItem();
        }
    }, 120000 + Math.random() * 180000);
}

// Quick access link animations
document.addEventListener('DOMContentLoaded', () => {
    const quickLinks = document.querySelectorAll('.quick-link');
    
    quickLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Section card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const sectionCards = document.querySelectorAll('.section-card');
    
    sectionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item');
            statItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const securityStats = document.querySelector('.security-stats');
    if (securityStats) {
        const statItems = securityStats.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        statsObserver.observe(securityStats);
    }
});

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initDashboard);

// Add loading animation for dashboard cards
document.addEventListener('DOMContentLoaded', () => {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add click handlers for quick links (placeholder for future functionality)
document.addEventListener('DOMContentLoaded', () => {
    const quickLinks = document.querySelectorAll('.quick-link');
    
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add loading state
            const originalContent = link.innerHTML;
            link.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';
            
            // Simulate loading delay
            setTimeout(() => {
                link.innerHTML = originalContent;
                // In a real implementation, this would navigate to the actual page
                console.log('Navigating to:', link.getAttribute('href'));
            }, 1000);
        });
    });
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Add focus styles for keyboard navigation
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid #2563eb';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
    }
}); 