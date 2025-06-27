// Climate Action Hub - Optimized JavaScript Implementation

class ClimateActionHub {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentSlide = 0;
        this.quizData = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.isTransitioning = false;
        this.autoSlideInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.loadWeatherData();
        this.loadQuizData();
        this.setupCarousel();
        this.loadClimateStats();
        this.generateTips();
        this.setupThemeToggle();
        this.setupCarbonCalculator();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
            }
        });

        // Weather location button
        const locationBtn = document.getElementById('locationBtn');
        if (locationBtn) {
            locationBtn.addEventListener('click', () => this.getCurrentLocation());
        }

        // Quiz controls
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const restartBtn = document.getElementById('restartQuiz');

        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartQuiz());

        // Carousel controls
        const prevSlide = document.getElementById('prevSlide');
        const nextSlide = document.getElementById('nextSlide');

        if (prevSlide) prevSlide.addEventListener('click', () => this.changeSlide(-1));
        if (nextSlide) nextSlide.addEventListener('click', () => this.changeSlide(1));

        // Tip refresh
        const refreshTip = document.getElementById('refreshTip');
        if (refreshTip) refreshTip.addEventListener('click', () => this.refreshDailyTip());

        // Carbon calculator
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) calculateBtn.addEventListener('click', () => this.calculateCarbonFootprint());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.currentSection === 'gallery') {
                if (e.key === 'ArrowLeft') this.changeSlide(-1);
                if (e.key === 'ArrowRight') this.changeSlide(1);
            }
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showSection(sectionName) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const sections = document.querySelectorAll('.section');
        
        // Hide current section
        sections.forEach(section => {
            if (section.classList.contains('active')) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    section.classList.remove('active');
                }, 150);
            }
        });

        // Show target section
        setTimeout(() => {
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                    this.currentSection = sectionName;
                    this.isTransitioning = false;

                    // Initialize section-specific features
                    if (sectionName === 'quiz' && this.quizData.length > 0) {
                        this.displayQuestion();
                    } else if (sectionName === 'gallery') {
                        this.startAutoSlide();
                    } else {
                        this.stopAutoSlide();
                    }
                }, 50);
            } else {
                this.isTransitioning = false;
            }
        }, 200);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    async loadWeatherData(lat = 40.7128, lon = -74.0060) {
        try {
            const weatherData = this.generateMockWeatherData();
            this.displayWeatherData(weatherData);
        } catch (error) {
            console.error('Weather data loading failed:', error);
            this.displayWeatherError();
        }
    }

    generateMockWeatherData() {
        const conditions = ['Clear', 'Cloudy', 'Partly Cloudy', 'Light Rain', 'Sunny'];
        const temps = [18, 22, 15, 8, 25, 19, 12];
        
        return {
            main: {
                temp: temps[Math.floor(Math.random() * temps.length)],
                feels_like: temps[Math.floor(Math.random() * temps.length)] + 2,
                humidity: Math.floor(Math.random() * 40) + 40
            },
            weather: [{
                description: conditions[Math.floor(Math.random() * conditions.length)]
            }],
            wind: {
                speed: Math.floor(Math.random() * 20) + 5
            },
            name: "New York"
        };
    }

    displayWeatherData(data) {
        const elements = {
            temperature: document.getElementById('temperature'),
            weatherDescription: document.getElementById('weatherDescription'),
            feelsLike: document.getElementById('feelsLike'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            location: document.getElementById('location')
        };

        if (elements.temperature) elements.temperature.textContent = `${Math.round(data.main.temp)}°`;
        if (elements.weatherDescription) elements.weatherDescription.textContent = data.weather[0].description;
        if (elements.feelsLike) elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
        if (elements.humidity) elements.humidity.textContent = `${data.main.humidity}%`;
        if (elements.windSpeed) elements.windSpeed.textContent = `${Math.round(data.wind.speed)} km/h`;
        if (elements.location) elements.location.textContent = data.name;
    }

    displayWeatherError() {
        const elements = {
            temperature: document.getElementById('temperature'),
            weatherDescription: document.getElementById('weatherDescription'),
            location: document.getElementById('location')
        };

        if (elements.temperature) elements.temperature.textContent = '--°';
        if (elements.weatherDescription) elements.weatherDescription.textContent = 'Unable to load weather data';
        if (elements.location) elements.location.textContent = 'Location unavailable';
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        const locationBtn = document.getElementById('locationBtn');
        if (!locationBtn) return;

        locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
        locationBtn.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.loadWeatherData(latitude, longitude);
                locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Location Updated';
                setTimeout(() => {
                    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Get Location';
                    locationBtn.disabled = false;
                }, 2000);
            },
            (error) => {
                console.error('Geolocation error:', error);
                locationBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Location Error';
                setTimeout(() => {
                    locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Get Location';
                    locationBtn.disabled = false;
                }, 2000);
            }
        );
    }

    loadClimateStats() {
        const stats = [
            { id: 'co2Level', value: 421 },
            { id: 'temp-anomaly', value: 1.2 },
            { id: 'deforestation', value: 10.2 },
            { id: 'renewable-energy', value: 31 }
        ];

        stats.forEach((stat, index) => {
            setTimeout(() => {
                const element = document.getElementById(stat.id);
                if (element && typeof stat.value === 'number') {
                    this.animateValue(element, 0, stat.value, 2000);
                }
            }, index * 200);
        });
    }

    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * progress;
            
            if (element.id === 'temp-anomaly') {
                element.textContent = `+${current.toFixed(1)}`;
            } else if (element.id === 'deforestation') {
                element.textContent = `${current.toFixed(1)}M`;
            } else if (element.id === 'renewable-energy') {
                element.textContent = `${Math.round(current)}%`;
            } else {
                element.textContent = Math.round(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    loadQuizData() {
        this.quizData = [
            {
                question: "What is the primary cause of current climate change?",
                options: [
                    "Natural climate variations",
                    "Solar radiation changes",
                    "Human activities and greenhouse gas emissions",
                    "Volcanic eruptions"
                ],
                correct: 2,
                explanation: "Human activities, particularly burning fossil fuels, are the primary driver of current climate change."
            },
            {
                question: "Which greenhouse gas is most abundant in the atmosphere?",
                options: [
                    "Carbon dioxide (CO₂)",
                    "Methane (CH₄)",
                    "Nitrous oxide (N₂O)",
                    "Water vapor (H₂O)"
                ],
                correct: 3,
                explanation: "Water vapor is the most abundant greenhouse gas, though CO₂ is the most significant human-caused contributor."
            },
            {
                question: "What percentage of global CO₂ emissions comes from burning fossil fuels?",
                options: [
                    "About 50%",
                    "About 65%",
                    "About 75%",
                    "About 90%"
                ],
                correct: 2,
                explanation: "Approximately 75% of global CO₂ emissions come from burning fossil fuels for energy and transportation."
            },
            {
                question: "Which renewable energy source has grown the fastest globally?",
                options: [
                    "Hydroelectric power",
                    "Wind power",
                    "Solar power",
                    "Geothermal power"
                ],
                correct: 2,
                explanation: "Solar power has experienced the fastest growth rate among renewable energy sources in recent years."
            },
            {
                question: "What is the Paris Agreement's main temperature target?",
                options: [
                    "Limit warming to 1.0°C above pre-industrial levels",
                    "Limit warming to 1.5°C above pre-industrial levels",
                    "Limit warming to 2.0°C above pre-industrial levels",
                    "Limit warming to 2.5°C above pre-industrial levels"
                ],
                correct: 1,
                explanation: "The Paris Agreement aims to limit global warming to well below 2°C, preferably to 1.5°C above pre-industrial levels."
            },
            {
                question: "Which sector is responsible for the largest share of global greenhouse gas emissions?",
                options: [
                    "Transportation",
                    "Agriculture",
                    "Energy production",
                    "Buildings"
                ],
                correct: 2,
                explanation: "Energy production (electricity and heat) is responsible for about 25% of global greenhouse gas emissions."
            },
            {
                question: "What is ocean acidification caused by?",
                options: [
                    "Plastic pollution",
                    "CO₂ absorption by seawater",
                    "Industrial waste discharge",
                    "Overfishing"
                ],
                correct: 1,
                explanation: "Ocean acidification occurs when seawater absorbs CO₂ from the atmosphere, forming carbonic acid."
            },
            {
                question: "Which country currently produces the most renewable energy?",
                options: [
                    "United States",
                    "Germany",
                    "China",
                    "India"
                ],
                correct: 2,
                explanation: "China leads the world in renewable energy production, particularly in solar and wind power capacity."
            },
            {
                question: "What is the most effective individual action to reduce carbon footprint?",
                options: [
                    "Recycling more",
                    "Using LED light bulbs",
                    "Reducing air travel",
                    "Eating less meat"
                ],
                correct: 2,
                explanation: "Reducing air travel has one of the highest impacts on personal carbon footprint reduction."
            },
            {
                question: "By what year do scientists say we need to reach net-zero emissions?",
                options: [
                    "2030",
                    "2040",
                    "2050",
                    "2060"
                ],
                correct: 2,
                explanation: "Climate scientists emphasize the need to reach net-zero emissions by 2050 to limit warming to 1.5°C."
            }
        ];

        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.quizData.length).fill(-1);
        this.score = 0;
    }

    displayQuestion() {
        if (this.quizData.length === 0) return;

        const question = this.quizData[this.currentQuestionIndex];
        const elements = {
            question: document.getElementById('question'),
            options: document.getElementById('options'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText')
        };

        if (!elements.question || !elements.options) return;

        // Update question
        elements.question.textContent = question.question;

        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.quizData.length) * 100;
        if (elements.progressFill) elements.progressFill.style.width = `${progress}%`;
        if (elements.progressText) elements.progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.quizData.length}`;

        // Clear and populate options
        elements.options.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option';
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => this.selectAnswer(index));
            
            // Show previous selection if exists
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionButton.classList.add('selected');
            }
            
            elements.options.appendChild(optionButton);
        });

        // Update navigation buttons
        this.updateQuizNavigation();
    }

    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        // Update UI
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.classList.remove('selected');
            if (index === answerIndex) {
                option.classList.add('selected');
            }
        });
        
        this.updateQuizNavigation();
    }

    updateQuizNavigation() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        if (!nextBtn || !prevBtn) return;

        // Enable/disable previous button
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        // Update next button based on current state
        const hasAnswer = this.userAnswers[this.currentQuestionIndex] !== -1;
        const isLastQuestion = this.currentQuestionIndex === this.quizData.length - 1;
        
        nextBtn.disabled = !hasAnswer;
        nextBtn.textContent = isLastQuestion ? 'Finish Quiz' : 'Next Question';
    }

    nextQuestion() {
        if (this.userAnswers[this.currentQuestionIndex] === -1) return;
        
        if (this.currentQuestionIndex < this.quizData.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.finishQuiz();
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    finishQuiz() {
        // Calculate score
        this.score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.quizData[index].correct) {
                this.score++;
            }
        });

        // Show results
        this.showQuizResults();
    }

    showQuizResults() {
        const elements = {
            quizContent: document.getElementById('quizContent'),
            quizControls: document.querySelector('.quiz-controls'),
            quizResults: document.getElementById('quizResults'),
            finalScore: document.getElementById('finalScore'),
            resultsTitle: document.getElementById('resultsTitle'),
            resultsMessage: document.getElementById('resultsMessage')
        };
        
        if (elements.quizContent) elements.quizContent.style.display = 'none';
        if (elements.quizControls) elements.quizControls.style.display = 'none';
        if (elements.quizResults) elements.quizResults.style.display = 'block';
        
        // Update results content
        if (elements.finalScore) elements.finalScore.textContent = this.score;
        
        // Determine results message based on score
        let title, message;
        const percentage = (this.score / this.quizData.length) * 100;
        
        if (percentage >= 90) {
            title = "Climate Expert! 🌟";
            message = "Outstanding! You have excellent knowledge of climate science and environmental issues.";
        } else if (percentage >= 70) {
            title = "Climate Advocate! 🌱";
            message = "Great job! You have a solid understanding of climate change and its impacts.";
        } else if (percentage >= 50) {
            title = "Climate Learner! 📚";
            message = "Good effort! Keep learning about climate science to become a better environmental advocate.";
        } else {
            title = "Climate Beginner 🌍";
            message = "There's room for improvement! Consider reading more about climate change and environmental science.";
        }
        
        if (elements.resultsTitle) elements.resultsTitle.textContent = title;
        if (elements.resultsMessage) elements.resultsMessage.textContent = message;
        
        // Animate score
        this.animateScore();
    }

    animateScore() {
        const scoreElement = document.getElementById('finalScore');
        if (!scoreElement) return;

        let currentScore = 0;
        const targetScore = this.score;
        const duration = 1500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            currentScore = Math.round(targetScore * progress);
            scoreElement.textContent = currentScore;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.quizData.length).fill(-1);
        this.score = 0;
        
        // Reset UI
        const elements = {
            quizContent: document.getElementById('quizContent'),
            quizControls: document.querySelector('.quiz-controls'),
            quizResults: document.getElementById('quizResults')
        };
        
        if (elements.quizContent) elements.quizContent.style.display = 'block';
        if (elements.quizControls) elements.quizControls.style.display = 'flex';
        if (elements.quizResults) elements.quizResults.style.display = 'none';
        
        this.displayQuestion();
    }

    setupCarousel() {
        const images = [
            {
                url: 'images/arctic.jpg',
                title: 'Arctic Ice Melting',
                description: 'Dramatic reduction in Arctic sea ice due to rising global temperatures affects polar ecosystems and contributes to sea level rise.'
            },
            {
                url: 'images/def.jpg',
                title: 'Deforestation Impact',
                description: 'Forest destruction eliminates carbon sinks and destroys biodiversity, accelerating climate change effects worldwide.'
            },
            {
                url: 'images/extreme.jpg',
                title: 'Extreme Weather Events',
                description: 'Increasing frequency of hurricanes, floods, and droughts demonstrates the immediate impacts of climate change on communities.'
            },
            {
                url: 'images/ocean.webp',
                title: 'Ocean Pollution',
                description: 'Marine ecosystems face threats from plastic pollution and ocean acidification caused by increased CO₂ absorption.'
            },
            {
                url: 'images/renewable.jpg',
                title: 'Renewable Energy Solutions',
                description: 'Solar and wind power installations demonstrate promising pathways toward sustainable energy and reduced emissions.'
            },
            {
                url: 'images/urban.jpeg',
                title: 'Urban Air Quality',
                description: 'City air pollution affects millions of people daily and contributes significantly to global greenhouse gas emissions.'
            }
        ];

        this.carouselImages = images;
        this.currentSlide = 0;
        
        this.renderCarousel();
    }

    renderCarousel() {
        const carouselTrack = document.getElementById('carouselTrack');
        const indicators = document.getElementById('carouselIndicators');
        
        if (!carouselTrack || !indicators) return;
        
        // Clear existing content
        carouselTrack.innerHTML = '';
        indicators.innerHTML = '';
        
        // Create slides
        this.carouselImages.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.style.backgroundImage = `url(${image.url})`;
            
            const slideContent = document.createElement('div');
            slideContent.className = 'slide-content';
            slideContent.innerHTML = `
                <h3 class="slide-title">${image.title}</h3>
                <p class="slide-description">${image.description}</p>
            `;
            
            slide.appendChild(slideContent);
            carouselTrack.appendChild(slide);
            
            // Create indicator
            const indicator = document.createElement('button');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(indicator);
        });
        
        this.updateCarousel();
        this.updateImageInfo();
    }

    changeSlide(direction) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSlide += direction;
        
        if (this.currentSlide >= this.carouselImages.length) {
            this.currentSlide = 0;
        } else if (this.currentSlide < 0) {
            this.currentSlide = this.carouselImages.length - 1;
        }
        
        this.updateCarousel();
        this.updateImageInfo();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSlide = index;
        this.updateCarousel();
        this.updateImageInfo();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    updateCarousel() {
        const carouselTrack = document.getElementById('carouselTrack');
        const indicators = document.querySelectorAll('.indicator');
        
        if (carouselTrack) {
            const translateX = -this.currentSlide * 100;
            carouselTrack.style.transform = `translateX(${translateX}%)`;
        }
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    updateImageInfo() {
        const imageTitle = document.getElementById('imageTitle');
        const imageDescription = document.getElementById('imageDescription');
        
        if (imageTitle && imageDescription && this.carouselImages[this.currentSlide]) {
            const currentImage = this.carouselImages[this.currentSlide];
            imageTitle.textContent = currentImage.title;
            imageDescription.textContent = currentImage.description;
        }
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            if (this.currentSection === 'gallery') {
                this.changeSlide(1);
            }
        }, 5000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    generateTips() {
        const tips = [
            {
                icon: '💡',
                title: 'Switch to LED Lighting',
                description: 'LED bulbs use 75% less energy and last 25 times longer than incandescent bulbs.',
                impact: 'medium'
            },
            {
                icon: '🚗',
                title: 'Use Public Transportation',
                description: 'Taking public transit, biking, or walking reduces your carbon footprint significantly.',
                impact: 'high'
            },
            {
                icon: '🌡️',
                title: 'Adjust Your Thermostat',
                description: 'Lowering heating by 2°C can reduce energy consumption by up to 10%.',
                impact: 'medium'
            },
            {
                icon: '🥗',
                title: 'Eat More Plant-Based Meals',
                description: 'Reducing meat consumption by one day per week can save 1,900 lbs of CO₂ annually.',
                impact: 'high'
            },
            {
                icon: '💧',
                title: 'Fix Water Leaks',
                description: 'A dripping faucet can waste over 3,000 gallons of water per year.',
                impact: 'low'
            },
            {
                icon: '♻️',
                title: 'Recycle Properly',
                description: 'Proper recycling reduces waste and conserves natural resources and energy.',
                impact: 'medium'
            },
            {
                icon: '🏠',
                title: 'Improve Home Insulation',
                description: 'Better insulation can reduce heating and cooling costs by up to 40%.',
                impact: 'high'
            },
            {
                icon: '🌞',
                title: 'Use Solar Power',
                description: 'Solar panels can reduce or eliminate electricity bills while cutting emissions.',
                impact: 'high'
            },
            {
                icon: '👕',
                title: 'Buy Less, Choose Better',
                description: 'Fast fashion contributes 10% of global emissions. Buy quality, durable clothing.',
                impact: 'medium'
            }
        ];

        const tipsGrid = document.getElementById('tipsGrid');
        if (!tipsGrid) return;

        tipsGrid.innerHTML = '';
        
        tips.forEach((tip, index) => {
            const tipCard = document.createElement('div');
            tipCard.className = 'tip-card fade-in';
            tipCard.style.animationDelay = `${index * 0.1}s`;
            tipCard.innerHTML = `
                <div class="tip-icon">${tip.icon}</div>
                <h3>${tip.title}</h3>
                <p>${tip.description}</p>
                <span class="impact-level ${tip.impact}">${tip.impact} impact</span>
            `;
            tipsGrid.appendChild(tipCard);
        });
    }

    refreshDailyTip() {
        const tips = [
            "🌱 Switch to LED light bulbs - they use 75% less energy and last 25 times longer than incandescent bulbs.",
            "🚗 Walk, bike, or use public transport instead of driving alone to reduce emissions.",
            "💧 Take shorter showers - reducing shower time by 2 minutes can save 1,750 gallons per year.",
            "🌡️ Lower your thermostat by 2°C to reduce energy consumption by up to 10%.",
            "♻️ Recycle one aluminum can to save enough energy to run a TV for 3 hours.",
            "🥗 Try Meatless Monday - skipping meat one day per week saves 1,900 lbs of CO₂ annually.",
            "🏠 Unplug electronics when not in use - they consume energy even when turned off.",
            "🌞 Air-dry clothes instead of using the dryer to save energy and money.",
            "💻 Use power strips to easily turn off multiple devices and prevent phantom energy use.",
            "🌿 Plant a tree - one tree absorbs 48 lbs of CO₂ per year when fully grown."
        ];

        const dailyTip = document.getElementById('dailyTip');
        const refreshButton = document.getElementById('refreshTip');
        
        if (dailyTip && refreshButton) {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            
            // Add loading state
            refreshButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            refreshButton.disabled = true;
            
            setTimeout(() => {
                dailyTip.textContent = randomTip;
                dailyTip.style.opacity = '0';
                setTimeout(() => {
                    dailyTip.style.opacity = '1';
                }, 100);
                
                refreshButton.innerHTML = '<i class="fas fa-refresh"></i> New Tip';
                refreshButton.disabled = false;
            }, 800);
        }
    }

    setupCarbonCalculator() {
        const inputs = document.querySelectorAll('#transport, #electricity, #flights');
        inputs.forEach(input => {
            input.addEventListener('input', this.validateCalculatorInputs.bind(this));
        });
    }

    validateCalculatorInputs() {
        const calculateBtn = document.getElementById('calculateBtn');
        const transport = document.getElementById('transport')?.value;
        const electricity = document.getElementById('electricity')?.value;
        const flights = document.getElementById('flights')?.value;
        
        const hasAllInputs = transport && electricity && flights;
        if (calculateBtn) calculateBtn.disabled = !hasAllInputs;
    }

    calculateCarbonFootprint() {
        const transport = parseFloat(document.getElementById('transport')?.value) || 0;
        const electricity = parseFloat(document.getElementById('electricity')?.value) || 0;
        const flights = parseFloat(document.getElementById('flights')?.value) || 0;
        
        // Carbon footprint calculations (simplified)
        const transportEmissions = (transport * 52 * 0.404) / 1000; // kg CO2 per mile -> tons per year
        const electricityEmissions = (electricity * 12 * 0.0005); // kWh -> tons CO2 per year
        const flightEmissions = flights * 0.9; // rough estimate: 0.9 tons CO2 per flight
        
        const totalEmissions = transportEmissions + electricityEmissions + flightEmissions;
        
        this.displayCarbonResults(totalEmissions);
    }

    displayCarbonResults(totalEmissions) {
        const elements = {
            calculatorResult: document.getElementById('calculatorResult'),
            carbonResult: document.getElementById('carbonResult'),
            resultComparison: document.getElementById('resultComparison')
        };
        
        if (elements.calculatorResult) elements.calculatorResult.style.display = 'block';
        if (elements.carbonResult) elements.carbonResult.textContent = totalEmissions.toFixed(1);
        
        // Add comparison context
        const globalAverage = 4.8; // tons CO2 per person per year globally
        let comparison;
        
        if (totalEmissions > globalAverage * 1.5) {
            comparison = "Your footprint is significantly above the global average. Consider reducing emissions in high-impact areas.";
        } else if (totalEmissions > globalAverage) {
            comparison = "Your footprint is above the global average. There's room for improvement!";
        } else if (totalEmissions > globalAverage * 0.5) {
            comparison = "Your footprint is close to the global average. Good progress toward sustainability!";
        } else {
            comparison = "Your footprint is below the global average. Excellent work on reducing emissions!";
        }
        
        if (elements.resultComparison) elements.resultComparison.textContent = comparison;
        
        // Animate the result
        if (elements.carbonResult) {
            this.animateValue(elements.carbonResult, 0, totalEmissions, 1500);
        }
    }

    initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.card, .tip-card, .stat-item').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ClimateActionHub();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ClimateActionHub, debounce };
}