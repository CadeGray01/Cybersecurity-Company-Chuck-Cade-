// SIEM Dashboard JavaScript

class SIEMDashboard {
    constructor() {
        this.logs = [];
        this.alerts = [];
        this.metrics = {
            totalEvents: 0,
            criticalAlerts: 0,
            highAlerts: 0,
            blockedThreats: 0,
            activeThreats: 0,
            knownIPs: 0,
            malwareDetected: 0
        };
        this.activityChart = null;
        this.investigationData = {};
        this.init();
    }

    init() {
        this.initializeChart();
        this.loadSampleData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.updateMetrics();
        this.updateAlerts();
    }

    // Initialize Chart.js activity chart
    initializeChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        this.activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Security Events',
                    data: [],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e5e7eb'
                        }
                    },
                    x: {
                        grid: {
                            color: '#e5e7eb'
                        }
                    }
                }
            }
        });
    }

    // Load sample log data
    loadSampleData() {
        const sampleLogs = [
            {
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                source: 'Firewall',
                eventType: 'Blocked Connection',
                severity: 'high',
                message: 'Blocked suspicious connection from 192.168.1.100 to external server',
                ip: '192.168.1.100',
                port: 443,
                protocol: 'HTTPS'
            },
            {
                timestamp: new Date(Date.now() - 1000 * 60 * 3),
                source: 'IDS',
                eventType: 'Intrusion Attempt',
                severity: 'critical',
                message: 'Multiple failed login attempts detected from 10.0.0.50',
                ip: '10.0.0.50',
                attempts: 15,
                target: 'admin@cybertechsolutions.com'
            },
            {
                timestamp: new Date(Date.now() - 1000 * 60 * 2),
                source: 'EDR',
                eventType: 'Malware Detected',
                severity: 'critical',
                message: 'Suspicious file execution detected: malware.exe',
                file: 'malware.exe',
                hash: 'a1b2c3d4e5f6...',
                action: 'Quarantined'
            },
            {
                timestamp: new Date(Date.now() - 1000 * 60 * 1),
                source: 'Web Server',
                eventType: 'SQL Injection Attempt',
                severity: 'high',
                message: 'SQL injection attempt detected in login form',
                ip: '203.0.113.45',
                payload: 'SELECT * FROM users WHERE id = 1 OR 1=1',
                blocked: true
            },
            {
                timestamp: new Date(),
                source: 'Email Gateway',
                eventType: 'Phishing Email',
                severity: 'medium',
                message: 'Suspicious email detected with malicious attachment',
                sender: 'unknown@malicious.com',
                subject: 'Important Document',
                attachment: 'document.pdf'
            }
        ];

        this.logs = sampleLogs;
        this.updateLogTable();
        this.updateChart();
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            this.performSearch();
        });

        document.getElementById('searchQuery')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshDashboard();
        });

        // Time range and severity filters
        document.getElementById('timeRange')?.addEventListener('change', () => {
            this.updateLogTable();
        });

        document.getElementById('severityFilter')?.addEventListener('change', () => {
            this.updateLogTable();
        });

        // Investigation panel
        document.getElementById('closePanel')?.addEventListener('click', () => {
            this.closeInvestigationPanel();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Save notes
        document.getElementById('saveNotes')?.addEventListener('click', () => {
            this.saveInvestigationNotes();
        });
    }

    // Perform log search
    performSearch() {
        const query = document.getElementById('searchQuery').value.toLowerCase();
        const timeRange = document.getElementById('timeRange').value;
        const severityFilter = document.getElementById('severityFilter').value;

        let filteredLogs = this.logs.filter(log => {
            // Time range filter
            const logTime = log.timestamp.getTime();
            const now = Date.now();
            let timeLimit = now - (24 * 60 * 60 * 1000); // Default 24 hours

            switch (timeRange) {
                case '1h':
                    timeLimit = now - (60 * 60 * 1000);
                    break;
                case '7d':
                    timeLimit = now - (7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    timeLimit = now - (30 * 24 * 60 * 60 * 1000);
                    break;
            }

            if (logTime < timeLimit) return false;

            // Severity filter
            if (severityFilter !== 'all' && log.severity !== severityFilter) {
                return false;
            }

            // Text search
            if (query) {
                const searchText = `${log.source} ${log.eventType} ${log.message}`.toLowerCase();
                return searchText.includes(query);
            }

            return true;
        });

        this.updateLogTable(filteredLogs);
        this.updateResultCount(filteredLogs.length);
    }

    // Update log table
    updateLogTable(logs = this.logs) {
        const tbody = document.getElementById('logTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        logs.forEach(log => {
            const row = document.createElement('tr');
            row.className = 'log-entry';
            row.addEventListener('click', () => {
                this.openInvestigationPanel(log);
            });

            row.innerHTML = `
                <td>${this.formatTimestamp(log.timestamp)}</td>
                <td>${log.source}</td>
                <td>${log.eventType}</td>
                <td><span class="log-severity ${log.severity}">${log.severity}</span></td>
                <td>${log.message}</td>
                <td class="log-actions">
                    <button class="investigate-btn" onclick="event.stopPropagation(); siem.openInvestigationPanel(${JSON.stringify(log).replace(/"/g, '&quot;')})">Investigate</button>
                    <button class="export-btn" onclick="event.stopPropagation(); siem.exportLog(${JSON.stringify(log).replace(/"/g, '&quot;')})">Export</button>
                </td>
            `;

            tbody.appendChild(row);
        });
    }

    // Update result count
    updateResultCount(count) {
        const resultCount = document.getElementById('resultCount');
        if (resultCount) {
            resultCount.textContent = `${count} results`;
        }
    }

    // Update metrics
    updateMetrics() {
        const criticalCount = this.logs.filter(log => log.severity === 'critical').length;
        const highCount = this.logs.filter(log => log.severity === 'high').length;
        const totalEvents = this.logs.length;

        // Update metric displays
        document.getElementById('totalEvents').textContent = totalEvents;
        document.getElementById('criticalAlerts').textContent = criticalCount;
        document.getElementById('highAlerts').textContent = highCount;
        document.getElementById('blockedThreats').textContent = this.logs.filter(log => 
            log.message.includes('Blocked') || log.message.includes('Quarantined')
        ).length;

        // Update threat intelligence
        document.getElementById('activeThreats').textContent = criticalCount + highCount;
        document.getElementById('knownIPs').textContent = new Set(this.logs.map(log => log.ip).filter(Boolean)).size;
        document.getElementById('malwareDetected').textContent = this.logs.filter(log => 
            log.eventType.includes('Malware') || log.message.includes('malware')
        ).length;
    }

    // Update alerts
    updateAlerts() {
        const alertsContainer = document.getElementById('alertsContainer');
        if (!alertsContainer) return;

        const criticalLogs = this.logs.filter(log => log.severity === 'critical');
        const highLogs = this.logs.filter(log => log.severity === 'high');

        alertsContainer.innerHTML = '';

        [...criticalLogs, ...highLogs].slice(0, 5).forEach(log => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-item ${log.severity}`;
            alertDiv.innerHTML = `
                <div class="alert-header">
                    <div class="alert-title">${log.eventType}</div>
                    <div class="alert-time">${this.formatTimestamp(log.timestamp)}</div>
                </div>
                <div class="alert-description">${log.message}</div>
                <div class="alert-actions">
                    <button class="acknowledge-btn" onclick="siem.acknowledgeAlert('${log.timestamp.getTime()}')">Acknowledge</button>
                    <button class="investigate-btn" onclick="siem.openInvestigationPanel(${JSON.stringify(log).replace(/"/g, '&quot;')})">Investigate</button>
                </div>
            `;
            alertsContainer.appendChild(alertDiv);
        });
    }

    // Update activity chart
    updateChart() {
        if (!this.activityChart) return;

        const now = new Date();
        const labels = [];
        const data = [];

        // Generate last 24 hours of data
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.getHours() + ':00');
            
            // Count events in this hour
            const hourStart = new Date(time.getTime() - 60 * 60 * 1000);
            const hourEnd = time;
            const count = this.logs.filter(log => 
                log.timestamp >= hourStart && log.timestamp <= hourEnd
            ).length;
            
            data.push(count);
        }

        this.activityChart.data.labels = labels;
        this.activityChart.data.datasets[0].data = data;
        this.activityChart.update();
    }

    // Open investigation panel
    openInvestigationPanel(log) {
        this.investigationData = log;
        const panel = document.getElementById('investigationPanel');
        if (panel) {
            panel.classList.add('active');
            this.populateInvestigationPanel(log);
        }
    }

    // Close investigation panel
    closeInvestigationPanel() {
        const panel = document.getElementById('investigationPanel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    // Populate investigation panel
    populateInvestigationPanel(log) {
        // Timeline
        this.populateTimeline(log);
        
        // Evidence
        this.populateEvidence(log);
        
        // Correlation
        this.populateCorrelation(log);
        
        // Notes
        this.loadInvestigationNotes(log);
    }

    // Populate timeline
    populateTimeline(log) {
        const timelineContainer = document.getElementById('timelineContainer');
        if (!timelineContainer) return;

        const events = [
            {
                time: log.timestamp,
                title: 'Event Detected',
                description: log.message
            },
            {
                time: new Date(log.timestamp.getTime() - 1000 * 60 * 2),
                title: 'Precursor Activity',
                description: 'Suspicious activity detected from same source'
            },
            {
                time: new Date(log.timestamp.getTime() - 1000 * 60 * 5),
                title: 'Initial Reconnaissance',
                description: 'Network scanning activity detected'
            }
        ];

        timelineContainer.innerHTML = '';
        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'timeline-event';
            eventDiv.innerHTML = `
                <div class="timeline-time">${this.formatTimestamp(event.time)}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${event.title}</div>
                    <div class="timeline-description">${event.description}</div>
                </div>
            `;
            timelineContainer.appendChild(eventDiv);
        });
    }

    // Populate evidence
    populateEvidence(log) {
        const evidenceList = document.getElementById('evidenceList');
        if (!evidenceList) return;

        const evidence = [
            {
                title: 'Log Entry',
                description: `Source: ${log.source}, Event: ${log.eventType}, Severity: ${log.severity}`
            },
            {
                title: 'Network Traffic',
                description: log.ip ? `Source IP: ${log.ip}` : 'No IP information available'
            },
            {
                title: 'System Artifacts',
                description: log.file ? `File: ${log.file}` : 'No file artifacts'
            }
        ];

        evidenceList.innerHTML = '';
        evidence.forEach(item => {
            const evidenceDiv = document.createElement('div');
            evidenceDiv.className = 'evidence-item';
            evidenceDiv.innerHTML = `
                <div class="evidence-title">${item.title}</div>
                <div class="evidence-description">${item.description}</div>
            `;
            evidenceList.appendChild(evidenceDiv);
        });
    }

    // Populate correlation
    populateCorrelation(log) {
        const correlationList = document.getElementById('correlationList');
        if (!correlationList) return;

        // Find related events
        const relatedEvents = this.logs.filter(l => 
            l.ip === log.ip || 
            l.source === log.source || 
            l.eventType === log.eventType
        ).slice(0, 5);

        correlationList.innerHTML = '';
        relatedEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'timeline-event';
            eventDiv.innerHTML = `
                <div class="timeline-time">${this.formatTimestamp(event.timestamp)}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${event.eventType}</div>
                    <div class="timeline-description">${event.message}</div>
                </div>
            `;
            correlationList.appendChild(eventDiv);
        });
    }

    // Switch tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    // Save investigation notes
    saveInvestigationNotes() {
        const notes = document.getElementById('investigationNotes').value;
        const timestamp = this.investigationData.timestamp.getTime();
        
        // Save to localStorage (in real implementation, this would go to a database)
        localStorage.setItem(`investigation_notes_${timestamp}`, notes);
        
        // Show success message
        this.showNotification('Notes saved successfully', 'success');
    }

    // Load investigation notes
    loadInvestigationNotes(log) {
        const timestamp = log.timestamp.getTime();
        const notes = localStorage.getItem(`investigation_notes_${timestamp}`) || '';
        document.getElementById('investigationNotes').value = notes;
    }

    // Acknowledge alert
    acknowledgeAlert(timestamp) {
        // Remove alert from display
        this.showNotification('Alert acknowledged', 'success');
    }

    // Export log
    exportLog(log) {
        const dataStr = JSON.stringify(log, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `log_${log.timestamp.getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Refresh dashboard
    refreshDashboard() {
        this.updateMetrics();
        this.updateAlerts();
        this.updateChart();
        this.showNotification('Dashboard refreshed', 'info');
    }

    // Start real-time updates
    startRealTimeUpdates() {
        // Simulate real-time log generation
        setInterval(() => {
            this.generateRandomLog();
        }, 30000); // Every 30 seconds

        // Update metrics every 10 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 10000);

        // Update chart every minute
        setInterval(() => {
            this.updateChart();
        }, 60000);
    }

    // Generate random log entry
    generateRandomLog() {
        const sources = ['Firewall', 'IDS', 'EDR', 'Web Server', 'Email Gateway'];
        const eventTypes = ['Connection Blocked', 'Login Attempt', 'File Access', 'Email Filtered', 'System Alert'];
        const severities = ['low', 'medium', 'high', 'critical'];
        const messages = [
            'Suspicious network activity detected',
            'Multiple failed authentication attempts',
            'Unauthorized file access attempt',
            'Malicious email content detected',
            'System resource usage alert'
        ];

        const randomLog = {
            timestamp: new Date(),
            source: sources[Math.floor(Math.random() * sources.length)],
            eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            severity: severities[Math.floor(Math.random() * severities.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        };

        this.logs.unshift(randomLog);
        
        // Keep only last 100 logs
        if (this.logs.length > 100) {
            this.logs = this.logs.slice(0, 100);
        }

        this.updateLogTable();
        this.updateMetrics();
        this.updateAlerts();
    }

    // Format timestamp
    formatTimestamp(date) {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize SIEM Dashboard
let siem;
document.addEventListener('DOMContentLoaded', () => {
    siem = new SIEMDashboard();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 