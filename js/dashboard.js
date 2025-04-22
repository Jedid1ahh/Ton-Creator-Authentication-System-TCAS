// Dashboard functionality for TON Creator Authentication System
class Dashboard {
    constructor(tonConnect) {
        this.tonConnect = tonConnect;
        this.contentRegistry = JSON.parse(localStorage.getItem('registered_content') || '[]');
        
        // Initialize dashboard when wallet is connected
        this.tonConnect.onConnected(address => {
            this.initDashboard(address);
        });
        
        // Initialize if already connected
        if (this.tonConnect.isConnected()) {
            this.initDashboard(this.tonConnect.getWalletAddress());
        }
    }
    
    // Initialize dashboard with creator's content
    initDashboard(creatorAddress) {
        // Filter content for this creator
        this.creatorContent = this.contentRegistry.filter(item => 
            item.creator === creatorAddress);
        
        // Update dashboard stats
        this.updateStats();
        
        // Populate content table
        this.populateContentTable();
        
        // Set up search functionality
        this.setupSearch();
        
        // Add event listeners for dashboard actions
        this.setupEventListeners();
    }
    
    // Update dashboard statistics
    updateStats() {
        document.getElementById('registered-count').textContent = this.creatorContent.length;
        
        // Calculate total verification requests
        const totalVerifications = this.creatorContent.reduce(
            (sum, item) => sum + item.verificationCount, 0
        );
        document.getElementById('verification-count').textContent = totalVerifications;
        
        // Calculate total usage instances
        const totalUsage = this.creatorContent.reduce(
            (sum, item) => sum + item.usageCount, 0
        );
        document.getElementById('usage-count').textContent = totalUsage;
    }
    
    // Populate content table with creator's registered content
    populateContentTable() {
        const tableBody = document.getElementById('content-table-body');
        const noContentMessage = document.getElementById('no-content-message');
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        if (this.creatorContent.length === 0) {
            // Show message if no content
            if (noContentMessage) {
                noContentMessage.classList.remove('d-none');
            }
            return;
        }
        
        // Hide no content message
        if (noContentMessage) {
            noContentMessage.classList.add('d-none');
        }
        
        // Sort content by date (newest first)
        const sortedContent = [...this.creatorContent].sort(
            (a, b) => new Date(b.dateRegistered) - new Date(a.dateRegistered)
        );
        
        // Add each content item to table
        sortedContent.forEach(item => {
            const tr = document.createElement('tr');
            
            // Format date
            const date = new Date(item.dateRegistered).toLocaleDateString();
            
            // Get rights level text
            const rightsText = this.getRightsLevelText(item.rightsLevel);
            
            tr.innerHTML = `
                <td>${item.title}</td>
                <td>${date}</td>
                <td>${rightsText}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-details" data-id="${item.id}">
                        Details
                    </button>
                </td>
            `;
            
            tableBody.appendChild(tr);
        });
        
        // Add event listeners to view details buttons
        const detailButtons = document.querySelectorAll('.view-details');
        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.showContentDetails(button.getAttribute('data-id'));
            });
        });
    }
    
    // Set up search functionality
    setupSearch() {
        const searchInput = document.getElementById('content-search');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            // Filter content items based on search term
            const filteredContent = this.creatorContent.filter(item => 
                item.title.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm) ||
                item.hash.toLowerCase().includes(searchTerm)
            );
            
            // Update table with filtered content
            this.populateFilteredContentTable(filteredContent);
        });
    }
    
    // Populate table with filtered content
    populateFilteredContentTable(filteredContent) {
        const tableBody = document.getElementById('content-table-body');
        const noContentMessage = document.getElementById('no-content-message');
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        if (filteredContent.length === 0) {
            // Show no results message
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No content matches your search</td>
                </tr>
            `;
            return;
        }
        
        // Sort content by date (newest first)
        const sortedContent = [...filteredContent].sort(
            (a, b) => new Date(b.dateRegistered) - new Date(a.dateRegistered)
        );
        
        // Add each content item to table
        sortedContent.forEach(item => {
            const tr = document.createElement('tr');
            
            // Format date
            const date = new Date(item.dateRegistered).toLocaleDateString();
            
            // Get rights level text
            const rightsText = this.getRightsLevelText(item.rightsLevel);
            
            tr.innerHTML = `
                <td>${item.title}</td>
                <td>${date}</td>
                <td>${rightsText}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-details" data-id="${item.id}">
                        Details
                    </button>
                </td>
            `;
            
            tableBody.appendChild(tr);
        });
        
        // Add event listeners to view details buttons
        const detailButtons = document.querySelectorAll('.view-details');
        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.showContentDetails(button.getAttribute('data-id'));
            });
        });
    }
    
    // Show content details in modal
    showContentDetails(contentId) {
        // Find content item
        const contentItem = this.creatorContent.find(item => item.id === contentId);
        if (!contentItem) return;
        
        // Get modal elements
        const titleElement = document.getElementById('modal-content-title');
        const dateElement = document.getElementById('modal-register-date');
        const hashElement = document.getElementById('modal-content-hash');
        const rightsElement = document.getElementById('modal-rights-level');
        const verifyCountElement = document.getElementById('modal-verify-count');
        const usageCountElement = document.getElementById('modal-usage-count');
        const descElement = document.getElementById('modal-content-desc');
        const verifyLinkElement = document.getElementById('modal-verify-link');
        
        // Set modal content
        titleElement.textContent = contentItem.title;
        dateElement.textContent = new Date(contentItem.dateRegistered).toLocaleDateString();
        hashElement.textContent = contentItem.hash;
        rightsElement.textContent = this.getRightsLevelText(contentItem.rightsLevel);
        verifyCountElement.textContent = contentItem.verificationCount;
        usageCountElement.textContent = contentItem.usageCount;
        descElement.textContent = contentItem.description || 'No description provided';
        
        // Set verification link
        const verificationLink = `${window.location.origin}/verify.html?hash=${contentItem.hash}`;
        verifyLinkElement.value = verificationLink;
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('contentDetailsModal'));
        modal.show();
        
        // Setup copy button
        const copyButton = document.getElementById('modal-copy-link');
        copyButton.addEventListener('click', () => {
            verifyLinkElement.select();
            document.execCommand('copy');
        });
    }
    
    // Setup event listeners for dashboard actions
    setupEventListeners() {
        // Export data button
        const exportButton = document.getElementById('export-data');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportContentData();
            });
        }
    }
    
    // Export content data as JSON
    exportContentData() {
        if (this.creatorContent.length === 0) {
            alert('No content to export');
            return;
        }
        
        // Create JSON blob
        const dataStr = JSON.stringify(this.creatorContent, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ton_content_registry_${Date.now()}.json`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Get rights level text
    getRightsLevelText(level) {
        const rights = {
            '1': 'All Rights Reserved',
            '2': 'Attribution Required',
            '3': 'Attribution + Non-Commercial',
            '4': 'Creative Commons',
            '5': 'Public Domain'
        };
        
        return rights[level] || 'Unknown';
    }
}

// Initialize Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard with TON Connect instance
    const dashboard = new Dashboard(tonConnect);
});