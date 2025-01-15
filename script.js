        function updateCountdown() {
            const targetDate = new Date('2025-01-29T00:00:00');
            const now = new Date();
            const timeDiff = targetDate - now;

            if (timeDiff > 0) {
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                document.getElementById('days').textContent = days;
                document.getElementById('hours').textContent = hours;
                document.getElementById('minutes').textContent = minutes;
                document.getElementById('seconds').textContent = seconds;
            } else {
                document.querySelector('.countdown-container').innerHTML = '<h1>The date has arrived!</h1>';
            }
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();


        const canvas = document.getElementById('fireworksCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Firework {
            constructor(x, y, type) {
                this.x = x;
                this.y = y;
                this.type = type;
                this.radius = Math.random() * 3 + 1;
                this.dy = -(Math.random() * 4 + 4);
                this.gravity = 0.1;
                this.opacity = 1;
                this.exploded = false;
                this.particles = [];
                this.colors = this.generateColors();
            }

            generateColors() {
                const baseColors = [
                    `255,69,0`, `255,215,0`, `173,216,230`, 
                    `144,238,144`, `238,130,238`, `255,182,193`, 
                    `0,191,255`, `50,205,50`, `219,112,147`
                ];
                const numColors = Math.floor(Math.random() * 3) + 1; // 1 to 3 colors
                return Array.from({ length: numColors }, () => baseColors[Math.floor(Math.random() * baseColors.length)]);
            }

            update() {
                if (!this.exploded) {
                    this.y += this.dy;
                    this.dy += this.gravity;
                    if (this.dy > 0) {
                        this.explode();
                    }
                } else {
                    this.particles.forEach(p => p.update());
                }
            }

            draw() {
                if (!this.exploded) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,255, ${this.opacity})`;
                    ctx.fill();
                } else {
                    this.particles.forEach(p => p.draw());
                }
            }

            explode() {
                this.exploded = true;

                switch (this.type) {
                    case 'circle':
                        for (let i = 0; i < 50; i++) {
                            this.particles.push(new Particle(this.x, this.y, this.randomColor(), 'circle'));
                        }
                        break;
                    case 'spiral':
                        for (let i = 0; i < 50; i++) {
                            this.particles.push(new Particle(this.x, this.y, this.randomColor(), 'spiral'));
                        }
                        break;
                    case 'burst':
                        for (let i = 0; i < 50; i++) {
                            this.particles.push(new Particle(this.x, this.y, this.randomColor(), 'burst'));
                        }
                        break;
                    case 'fountain':
                        for (let i = 0; i < 70; i++) {
                            this.particles.push(new Particle(this.x, this.y, this.randomColor(), 'fountain'));
                        }
                        break;
                    case 'star':
                        for (let i = 0; i < 50; i++) {
                            this.particles.push(new Particle(this.x, this.y, this.randomColor(), 'star'));
                        }
                        break;
                }
            }

            randomColor() {
                return this.colors[Math.floor(Math.random() * this.colors.length)];
            }
        }

        class Particle {
            constructor(x, y, color, type) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.type = type;
                this.radius = Math.random() * 2 + 1;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 3 + 1;
                this.dx = Math.cos(this.angle) * this.speed;
                this.dy = Math.sin(this.angle) * this.speed;
                this.gravity = 0.05;
                this.opacity = 1;
                this.rotation = 0;
            }

            update() {
                this.x += this.dx;
                this.y += this.dy;
                this.dy += this.gravity;
                this.opacity -= 0.02;
                if (this.type === 'spiral' || this.type === 'fountain') {
                    this.rotation += 0.1;
                }
            }

            draw() {
                if (this.opacity > 0) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    if (this.type === 'spiral' || this.type === 'fountain') {
                        ctx.rotate(this.rotation);
                    }
                    ctx.beginPath();
                    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                    ctx.fill();
                    ctx.restore();
                }
            }
        }

        const fireworks = [];
        let lastFireworkTime = 0;

        function animate(timestamp) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (timestamp - lastFireworkTime > 2000) { // Every 2 seconds
                const types = ['circle', 'spiral', 'burst', 'fountain', 'star'];
                const fireworkCount = Math.floor(Math.random() * 8) + 3; // 3 to 10 fireworks
                for (let i = 0; i < fireworkCount; i++) {
                    const type = types[Math.floor(Math.random() * types.length)];
                    fireworks.push(new Firework(Math.random() * canvas.width, canvas.height / 2 + Math.random() * canvas.height / 2, type));
                }
                lastFireworkTime = timestamp;
            }

            fireworks.forEach((f, index) => {
                f.update();
                f.draw();
                if (f.exploded && f.particles.every(p => p.opacity <= 0)) {
                    fireworks.splice(index, 1);
                }
            });

            requestAnimationFrame(animate);
        }

        animate(0);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });