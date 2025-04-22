// TON Connect implementation for wallet integration
class TonConnect {
    constructor() {
        this.connected = false;
        this.walletAddress = null;
        this.walletBalance = 0;
        this.connectedCallback = null;
        this.disconnectedCallback = null;
        
        // Initialize UI elements
        this.initUI();
    }
    
    initUI() {
        // Get UI elements
        this.connectButton = document.getElementById('connect-wallet');
        this.walletInfo = document.getElementById('wallet-info');
        this.walletAddressElement = document.getElementById('wallet-address');
        
        // Add event listeners
        if (this.connectButton) {
            this.connectButton.addEventListener('click', () => this.connect());
        }
        
        // Check if wallet warning exists on page
        this.walletWarning = document.querySelector('.wallet-warning');
        
        // Check if we have a dashboard that needs to be shown
        this.dashboardContent = document.getElementById('dashboard-content');
    }
    
    // Connect to wallet
    async connect() {
        try {
            // Simulate wallet connection
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate random wallet address (for simulation)
            const addr = 'EQ' + Array.from({length: 40}, () => 
                Math.floor(Math.random() * 16).toString(16)).join('');
            
            this.walletAddress = addr;
            this.walletBalance = 10.5; // Random TON balance
            this.connected = true;
            
            // Update UI
            this.updateUI();
            
            // Trigger callback if exists
            if (this.connectedCallback) {
                this.connectedCallback(this.walletAddress);
            }
            
            // Save wallet info to local storage for persistence
            localStorage.setItem('ton_wallet_connected', 'true');
            localStorage.setItem('ton_wallet_address', this.walletAddress);
            
            return true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            return false;
        }
    }
    
    // Disconnect wallet
    disconnect() {
        this.connected = false;
        this.walletAddress = null;
        this.walletBalance = 0;
        
        // Update UI
        this.updateUI();
        
        // Trigger callback if exists
        if (this.disconnectedCallback) {
            this.disconnectedCallback();
        }
        
        // Remove from local storage
        localStorage.removeItem('ton_wallet_connected');
        localStorage.removeItem('ton_wallet_address');
    }
    
    // Update UI elements based on connection status
    updateUI() {
        if (!this.connectButton) return;
        
        if (this.connected) {
            this.connectButton.classList.add('d-none');
            this.walletInfo.classList.remove('d-none');
            this.walletAddressElement.textContent = this.formatAddress(this.walletAddress);
            
            // Hide warning if exists
            if (this.walletWarning) {
                this.walletWarning.classList.add('d-none');
            }
            
            // Show dashboard if exists
            if (this.dashboardContent) {
                this.dashboardContent.classList.remove('d-none');
            }
        } else {
            this.connectButton.classList.remove('d-none');
            this.walletInfo.classList.add('d-none');
            
            // Show warning if exists
            if (this.walletWarning) {
                this.walletWarning.classList.remove('d-none');
            }
            
            // Hide dashboard if exists
            if (this.dashboardContent) {
                this.dashboardContent.classList.add('d-none');
            }
        }
    }
    
    // Check if wallet is connected
    isConnected() {
        return this.connected;
    }
    
    // Get wallet address
    getWalletAddress() {
        return this.walletAddress;
    }
    
    // Sign message with wallet (simulated)
    async signMessage(message) {
        if (!this.connected) {
            throw new Error('Wallet not connected');
        }
        
        // Simulate signing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return simulated signature
        return {
            signature: 'simulated_signature_' + Date.now(),
            message: message
        };
    }
    
    // Format address for display (first 6 and last 4 characters)
    formatAddress(address) {
        if (!address) return '';
        return address.substring(0, 6) + '...' + address.substring(address.length - 4);
    }
    
    // Set callback for when wallet is connected
    onConnected(callback) {
        this.connectedCallback = callback;
    }
    
    // Set callback for when wallet is disconnected
    onDisconnected(callback) {
        this.disconnectedCallback = callback;
    }
    
    // Check local storage for existing connection and restore
    checkExistingConnection() {
        const connected = localStorage.getItem('ton_wallet_connected');
        const address = localStorage.getItem('ton_wallet_address');
        
        if (connected === 'true' && address) {
            this.walletAddress = address;
            this.connected = true;
            this.updateUI();
            
            if (this.connectedCallback) {
                this.connectedCallback(this.walletAddress);
            }
        }
    }
}

// Initialize TON Connect instance
const tonConnect = new TonConnect();

// Check for existing connection on page load
document.addEventListener('DOMContentLoaded', () => {
    tonConnect.checkExistingConnection();
});