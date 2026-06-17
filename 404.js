/* ============================================================
   404 PAGE – INTERACTIONS (Updated: Search removed)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── PARTICLES ───
    (function initParticles() {
        const canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let W, H;
        const particles = [];
        const PARTICLE_COUNT = 80;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 2.5 + 0.5,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.1,
                blue: Math.random() > 0.6
            });
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            particles.forEach(p => {
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                const color = p.blue ?
                    `rgba(0, 163, 255, ${p.opacity})` :
                    `rgba(30, 144, 255, ${p.opacity * 0.5})`;
                ctx.fillStyle = color;
                ctx.fill();

                // Move
                p.x += p.dx;
                p.y += p.dy;

                // Bounce
                if (p.x < 0 || p.x > W) p.dx *= -1;
                if (p.y < 0 || p.y > H) p.dy *= -1;
            });

            // Draw lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 163, 255, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        draw();
    })();

    // ─── PARALLAX ON CAR ───
    const carContainer = document.querySelector('.car-container');
    if (carContainer) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 5;
            carContainer.style.transform =
                `translateX(${x * 2}px) translateY(${y * 1}px)`;
            carContainer.style.transition = 'transform 0.1s ease';
        });
    }

    console.log('404 page initialized.');
});