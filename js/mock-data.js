// Mock data for TON Creator Authentication System
class MockDataGenerator {
    constructor() {
        // Generate some example content if none exists
        this.ensureExampleContent();
    }
    
    // Ensure some example content exists in local storage
    ensureExampleContent() {
        const existingContent = JSON.parse(localStorage.getItem('registered_content') || '[]');
        
        // Only generate example content if none exists
        if (existingContent.length === 0) {
            const exampleContent = this.generateExampleContent();
            localStorage.setItem('registered_content', JSON.stringify(exampleContent));
        }
    }
    
    // Generate example content items
    generateExampleContent() {
        const creatorAddress = 'EQ' + Array.from({length: 40}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
            
        return [
            {
                id: '1650123456789',
                title: 'Digital Artwork: Abstract Fusion',
                description: 'A vibrant digital painting exploring color theory and geometric shapes.',
                hash: '0x7a24d5f8c3b1e9a6d2f0c8b7e5a3d1c9f8e7d6a5b4c3d2e1f0a9b8c7d6e5f4a3',
                dateRegistered: '2025-04-10T15:32:10.789Z',
                creator: creatorAddress,
                rightsLevel: '2',
                rightsDetails: 'Attribution required for commercial and non-commercial use.',
                verificationCount: 12,
                usageCount: 5
            },
            {
                id: '1650123456790',
                title: 'Photography: Urban Shadows',
                description: 'Black and white photography series capturing architectural contrasts.',
                hash: '0x2b1c7a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c',
                dateRegistered: '2025-04-05T09:15:43.123Z',
                creator: creatorAddress,
                rightsLevel: '3',
                rightsDetails: 'Attribution required, no commercial use without explicit permission.',
                verificationCount: 7,
                usageCount: 2
            },
            {
                id: '1650123456791',
                title: 'Music Track: Ambient Waves',
                description: 'An ambient electronic music track with layered synths and field recordings.',
                hash: '0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4',
                dateRegistered: '2025-03-28T14:45:22.456Z',
                creator: creatorAddress,
                rightsLevel: '1',
                rightsDetails: 'All rights reserved. Contact for licensing.',
                verificationCount: 18,
                usageCount: 3
            }
        ];
    }
    
    // Get random content for verification demo
    getRandomContentForVerification() {
        const content = JSON.parse(localStorage.getItem('registered_content') || '[]');
        if (content.length === 0) return null;
        
        return content[Math.floor(Math.random() * content.length)];
    }
}

// Initialize mock data generator
const mockData = new MockDataGenerator();