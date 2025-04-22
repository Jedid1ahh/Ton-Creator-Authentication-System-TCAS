// Content Registry implementation for the TON Creator Authentication System
class ContentRegistry {
    constructor(tonConnect) {
        this.tonConnect = tonConnect;
        this.registeredContent = JSON.parse(localStorage.getItem('registered_content') || '[]');
        
        // Initialize UI elements based on current page
        this.initUI();
    }
    
    initUI() {
        // Registration page elements
        this.registerForm = document.getElementById('registration-form');
        this.registrationResult = document.getElementById('registration-result');
        
        // Verification page elements
        this.verifyBtn = document.getElementById('verify-btn');
        this.verificationResult = document.getElementById('verification-result');
        
        // Set up event listeners based on current page
        if (this.registerForm) {
            this.setupRegistrationForm();
        }
        
        if (this.verifyBtn) {
            this.setupVerificationForm();
        }
    }
    
    // Setup registration form event listeners
    setupRegistrationForm() {
        // Toggle between file upload and URL input
        const fileUploadRadio = document.getElementById('file-upload');
        const urlInputRadio = document.getElementById('url-input');
        const fileUploadSection = document.getElementById('file-upload-section');
        const urlInputSection = document.getElementById('url-input-section');
        
        if (fileUploadRadio && urlInputRadio) {
            fileUploadRadio.addEventListener('change', () => {
                fileUploadSection.classList.remove('d-none');
                urlInputSection.classList.add('d-none');
            });
            
            urlInputRadio.addEventListener('change', () => {
                fileUploadSection.classList.add('d-none');
                urlInputSection.classList.remove('d-none');
            });
        }
        
        // Handle form submission
        this.registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.tonConnect.isConnected()) {
                alert('Please connect your TON wallet first');
                return;
            }
            
            // Get form data
            const title = document.getElementById('content-title').value;
            const description = document.getElementById('content-description').value;
            const rightsLevel = document.getElementById('rights-level').value;
            const rightsDetails = document.getElementById('rights-details').value;
            
            // Determine content source
            let contentSource = '';
            if (fileUploadRadio.checked) {
                contentSource = document.getElementById('content-file').value;
            } else {
                contentSource = document.getElementById('content-url').value;
            }
            
            // Generate random content hash (simulated)
            const contentHash = this.generateContentHash();
            
            // Sign transaction (simulated)
            await this.simulateBlockchainTransaction();
            
            // Store content information
            const contentItem = {
                id: Date.now().toString(),
                title: title,
                description: description,
                hash: contentHash,
                dateRegistered: new Date().toISOString(),
                creator: this.tonConnect.getWalletAddress(),
                rightsLevel: rightsLevel,
                rightsDetails: rightsDetails,
                verificationCount: 0,
                usageCount: 0
            };
            
            // Add to registered content
            this.registeredContent.push(contentItem);
            this.saveRegisteredContent();
            
            // Show registration result
            this.showRegistrationResult(contentItem);
        });
        
        // Handle copy link button
        const copyLinkBtn = document.getElementById('copy-link-btn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                const verificationLink = document.getElementById('verification-link');
                verificationLink.select();
                document.execCommand('copy');
            });
        }
    }
    
    // Setup verification form event listeners
    setupVerificationForm() {
        this.verifyBtn.addEventListener('click', async () => {
            // Determine verification method
            const activeTab = document.querySelector('.tab-pane.active');
            let contentIdentifier = '';
            let method = '';
            
            if (activeTab.id === 'upload') {
                contentIdentifier = document.getElementById('verify-file').value;
                method = 'file';
            } else if (activeTab.id === 'url') {
                contentIdentifier = document.getElementById('verify-url').value;
                method = 'url';
            } else if (activeTab.id === 'hash') {
                contentIdentifier = document.getElementById('verify-hash').value;
                method = 'hash';
            }
            
            if (!contentIdentifier) {
                alert('Please provide content to verify');
                return;
            }
            
            // Simulate verification process
            await this.simulateVerification();
            
            // For hash method, try to find exact match
            let found = false;
            let contentItem = null;
            
            if (method === 'hash') {
                // Try to find an exact hash match
                contentItem = this.registeredContent.find(item => item.hash === contentIdentifier);
                found = !!contentItem;
            } else {
                // Simulate finding content by file or URL (random match for demo)
                if (this.registeredContent.length > 0) {
                    // 50% chance of finding a match for demonstration
                    found = Math.random() > 0.5;
                    if (found) {
                        // Pick a random content item
                        contentItem = this.registeredContent[
                            Math.floor(Math.random() * this.registeredContent.length)
                        ];
                        
                        // Increment verification count
                        contentItem.verificationCount++;
                        this.saveRegisteredContent();
                    }
                }
            }
            
            // Show verification result
            this.showVerificationResult(found, contentItem);
        });
    }
    
    // Generate random content hash (simulated)
    generateContentHash() {
        return '0x' + Array.from({length: 64}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
    }
    
    // Simulate blockchain transaction
    async simulateBlockchainTransaction() {
        // Show loading state
        if (this.registerForm) {
            const registerBtn = document.getElementById('register-btn');
            registerBtn.innerHTML = 'Registering...';
            registerBtn.disabled = true;
        }
        
        // Simulate delay for blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reset button
        if (this.registerForm) {
            const registerBtn = document.getElementById('register-btn');
            registerBtn.innerHTML = 'Register Content';
            registerBtn.disabled = false;
        }
    }
    
    // Simulate verification process
    async simulateVerification() {
        // Show loading state
        if (this.verifyBtn) {
            this.verifyBtn.innerHTML = 'Verifying...';
            this.verifyBtn.disabled = true;
        }
        
        // Simulate delay for verification process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Reset button
        if (this.verifyBtn) {
            this.verifyBtn.innerHTML = 'Verify Content';
            this.verifyBtn.disabled = false;
        }
    }
    
    // Show registration result
    showRegistrationResult(contentItem) {
        // Hide form
        this.registerForm.classList.add('d-none');
        
        // Show result
        this.registrationResult.classList.remove('d-none');
        
        // Set result details
        document.getElementById('content-hash').value = contentItem.hash;
        
        // Create verification link
        const verificationLink = `${window.location.origin}/verify.html?hash=${contentItem.hash}`;
        document.getElementById('verification-link').value = verificationLink;
    }
    
    // Show verification result
    showVerificationResult(found, contentItem) {
        const header = document.getElementById('verification-header');
        const details = document.getElementById('verification-details');
        
        // Show result container
        this.verificationResult.classList.remove('d-none');
        
        if (found && contentItem) {
            // Content is verified
            header.className = 'card-header bg-success text-white';
            header.textContent = 'Content Verified';
            
            // Format date
            const registeredDate = new Date(contentItem.dateRegistered).toLocaleDateString();
            
            // Map rights level to human-readable text
            const rightsText = this.getRightsLevelText(contentItem.rightsLevel);
            
            // Create details HTML
            details.innerHTML = `
                <h5 class="card-title">${contentItem.title}</h5>
                <p>${contentItem.description}</p>
                
                <dl class="row mt-3">
                    <dt class="col-sm-4">Created by</dt>
                    <dd class="col-sm-8">${this.formatAddress(contentItem.creator)}</dd>
                    
                    <dt class="col-sm-4">Registered on</dt>
                    <dd class="col-sm-8">${registeredDate}</dd>
                    
                    <dt class="col-sm-4">Content Hash</dt>
                    <dd class="col-sm-8">${contentItem.hash}</dd>
                    
                    <dt class="col-sm-4">Usage Rights</dt>
                    <dd class="col-sm-8">${rightsText}</dd>
                </dl>
                
                <p class="mt-3">This content is registered on the TON blockchain, confirming its authenticity and ownership.</p>
            `;
        } else {
            // Content not verified
            header.className = 'card-header bg-danger text-white';
            header.textContent = 'Content Not Verified';
            
            details.innerHTML = `
                <p>This content has not been registered on the TON blockchain.</p>
                <p>Possible reasons:</p>
                <ul>
                    <li>The content is original but not yet registered by its creator</li>
                    <li>The content has been modified from its registered version</li>
                    <li>You are checking a different version than what was registered</li>
                </ul>
                
                <div class="mt-3">
                    <p>Are you the creator of this content?</p>
                    <a href="register.html" class="btn btn-primary">Register This Content</a>
                </div>
            `;
        }
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
    
    // Format address for display
    formatAddress(address) {
        if (!address) return '';
        return address.substring(0, 6) + '...' + address.substring(address.length - 4);
    }
    
    // Save registered content to local storage
    saveRegisteredContent() {
        localStorage.setItem('registered_content', JSON.stringify(this.registeredContent));
    }
    
    // Get all registered content
    getRegisteredContent() {
        return this.registeredContent;
    }
    
    // Get registered content for a specific creator
    getContentByCreator(creatorAddress) {
        return this.registeredContent.filter(item => item.creator === creatorAddress);
    }
}

// Initialize ContentRegistry when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize content registry with TON Connect instance
    const contentRegistry = new ContentRegistry(tonConnect);
});