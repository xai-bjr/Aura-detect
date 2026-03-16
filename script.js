// ===== AURA: Authenticity Scan - Main JavaScript =====

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ===== GLOBAL VARIABLES =====
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const videoPreview = document.getElementById('videoPreview');
    const resultsPanel = document.getElementById('resultsPanel');
    const meterDial = document.getElementById('meterDial');
    const meterPercentage = document.getElementById('meterPercentage');
    const resultBadge = document.getElementById('resultBadge');
    const probability = document.getElementById('probability');
    const timelineBars = document.getElementById('timelineBars');
    const findings = document.getElementById('findings');
    const pasteLinkBtn = document.getElementById('pasteLinkBtn');
    
    // Toggle between fake and real for demo (you can modify this)
    let isFake = true; // Set to false for real demo

    // ===== FLOATING PARTICLES GENERATION =====
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // ===== 3D BACKGROUND CANVAS =====
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Wireframe Globe Class
    class WireframeGlobe {
        constructor() {
            this.radius = 150;
            this.segments = 20;
            this.rotation = 0;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
        }

        update() {
            this.rotation += 0.005;
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.strokeStyle = 'rgba(64, 224, 208, 0.15)';
            ctx.lineWidth = 1;

            // Draw wireframe sphere
            for (let i = 0; i <= this.segments; i++) {
                const lat = (i / this.segments) * Math.PI;
                const y = Math.cos(lat) * this.radius;
                const r = Math.sin(lat) * this.radius;

                ctx.beginPath();
                for (let j = 0; j <= this.segments; j++) {
                    const lng = (j / this.segments) * Math.PI * 2;
                    const x = Math.cos(lng) * r;
                    const z = Math.sin(lng) * r;
                    
                    if (j === 0) ctx.moveTo(x, y - z * 0.3);
                    else ctx.lineTo(x, y - z * 0.3);
                }
                ctx.strokeStyle = 'rgba(64, 224, 208, 0.1)';
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    // Create multiple globes
    const globes = [];
    for (let i = 0; i < 5; i++) {
        globes.push(new WireframeGlobe());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        globes.forEach(globe => {
            globe.update();
            globe.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();

    // Mouse interaction for globes
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / canvas.width - 0.5;
        const mouseY = e.clientY / canvas.height - 0.5;
        
        globes.forEach(globe => {
            globe.x += mouseX * 0.5;
            globe.y += mouseY * 0.5;
        });
    });

    // ===== UPLOAD ZONE HANDLING =====
    
    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop effects
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.transform = 'scale(1.02)';
        uploadZone.style.borderColor = '#0AEBA8';
    });

    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.transform = 'scale(1)';
        uploadZone.style.borderColor = 'transparent';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.transform = 'scale(1)';
        uploadZone.style.borderColor = 'transparent';
        
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    // Paste link functionality
    if (pasteLinkBtn) {
        pasteLinkBtn.addEventListener('click', () => {
            const url = prompt('Enter video URL (YouTube, TikTok, Instagram):');
            if (url) {
                alert('URL processing simulated for: ' + url);
                // In a real app, you would fetch and process the URL here
            }
        });
    }

    // ===== FILE HANDLING FUNCTION =====
    function handleFile(file) {
        // Check if it's a video file
        if (file && file.type.startsWith('video/')) {
            // Check file size (500MB max)
            if (file.size > 500 * 1024 * 1024) {
                alert('File too large. Maximum size is 500MB.');
                return;
            }

            const url = URL.createObjectURL(file);
            videoPreview.src = url;
            
            // Hide upload zone, show preview
            uploadZone.style.display = 'none';
            previewContainer.style.display = 'block';
            
            // Simulate scanning and analysis
            simulateAnalysis();
        } else {
            alert('Please upload a valid video file (MP4, MOV, WebM)');
        }
    }

    // ===== SIMULATE ANALYSIS =====
    function simulateAnalysis() {
        // Show scanning modules animation
        const modules = document.querySelectorAll('.module');
        modules.forEach((module, index) => {
            setTimeout(() => {
                module.classList.add('active');
            }, index * 500);
        });

        // After 3 seconds, show results
        setTimeout(() => {
            // Hide scanning modules
            const scanningModules = document.querySelector('.scanning-modules');
            if (scanningModules) {
                scanningModules.style.display = 'none';
            }
            
            // Show results panel
            resultsPanel.style.display = 'grid';
            
            // Animate meter
            animateMeter();
            
            // Generate timeline bars
            generateTimelineBars();
            
            // Update findings based on result
            updateFindings();
        }, 3000);
    }

    // ===== ANIMATE METER =====
    function animateMeter() {
        let percentage = 0;
        const targetPercentage = isFake ? 98 : 12;
        
        const interval = setInterval(() => {
            if (percentage < targetPercentage) {
                percentage++;
                const rotation = (percentage / 100) * 180;
                meterDial.style.transform = `rotate(${rotation}deg)`;
                meterPercentage.textContent = percentage + '%';
                
                // Update meter color based on percentage
                if (percentage > 70) {
                    meterDial.style.boxShadow = '0 0 30px rgba(240, 37, 92, 0.5)';
                } else if (percentage < 30) {
                    meterDial.style.boxShadow = '0 0 30px rgba(10, 235, 168, 0.5)';
                }
            } else {
                clearInterval(interval);
                
                // Display final result
                if (isFake) {
                    resultBadge.className = 'result-badge fake';
                    resultBadge.textContent = 'FAKE';
                    probability.textContent = '98% Probability of Synthesis';
                    
                    // Trigger glitch effect
                    triggerGlitchEffect();
                } else {
                    resultBadge.className = 'result-badge real';
                    resultBadge.textContent = 'VERIFIED';
                    probability.textContent = '98% Probability of Authenticity';
                }
            }
        }, 30);
    }

    // ===== GENERATE TIMELINE BARS =====
    function generateTimelineBars() {
        timelineBars.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.className = 'timeline-bar';
            
            // Generate random heights based on fake/real
            const height = isFake ? 
                Math.random() * 0.8 + 0.2 : 
                Math.random() * 0.3 + 0.1;
            
            bar.style.setProperty('--height', height);
            timelineBars.appendChild(bar);
        }
    }

    // ===== UPDATE FINDINGS =====
    function updateFindings() {
        if (isFake) {
            findings.innerHTML = `
                <li>Eye reflection mismatch detected</li>
                <li>Upscaled GAN artifacts found</li>
                <li>Biological pulse not detected</li>
                <li>Frame interpolation artifacts</li>
                <li>Audio-visual sync mismatch</li>
                <li>Inconsistent lighting across frames</li>
            `;
        } else {
            findings.innerHTML = `
                <li>Natural eye micro-movements present</li>
                <li>Consistent lighting across frames</li>
                <li>Biological pulse detected</li>
                <li>Authentic sensor noise pattern</li>
                <li>Natural motion blur consistent</li>
                <li>Continuous metadata chain verified</li>
            `;
        }
    }

    // ===== GLITCH EFFECT =====
    function triggerGlitchEffect() {
        document.body.style.animation = 'glitch 0.1s infinite';
        
        // Create RGB split overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9999';
        overlay.style.mixBlendMode = 'screen';
        overlay.style.background = 'linear-gradient(90deg, rgba(255,0,0,0.3), rgba(0,255,0,0.3), rgba(0,0,255,0.3))';
        overlay.style.animation = 'rgbSplit 0.3s infinite';
        document.body.appendChild(overlay);
        
        // Remove after 1 second
        setTimeout(() => {
            document.body.style.animation = '';
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 1000);
    }

    // ===== ADD CSS ANIMATION FOR RGB SPLIT =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rgbSplit {
            0% { transform: translate(0px, 0px); }
            25% { transform: translate(-5px, 2px); }
            50% { transform: translate(5px, -2px); }
            75% { transform: translate(-3px, -1px); }
            100% { transform: translate(0px, 0px); }
        }
    `;
    document.head.appendChild(style);

    // ===== TOGGLE BETWEEN FAKE AND REAL FOR DEMO (Press 'D' key) =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            isFake = !isFake;
            console.log('Demo mode switched to:', isFake ? 'FAKE' : 'REAL');
            
            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `Demo Mode: ${isFake ? 'FAKE' : 'REAL'} videos`;
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.background = isFake ? '#F0255C' : '#0AEBA8';
            notification.style.color = '#fff';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '50px';
            notification.style.zIndex = '10000';
            notification.style.fontFamily = 'JetBrains Mono, monospace';
            notification.style.fontSize = '14px';
            notification.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 2000);
        }
    });

    // ===== INITIALIZE ANY ADDITIONAL FEATURES =====
    console.log('AURA: Authenticity Scan initialized');
    console.log('Press D key to toggle between FAKE and REAL demo mode');
});