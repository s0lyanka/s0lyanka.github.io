// ===== ИНИЦИАЛИЗАЦИЯ ПЛЕЕРА =====
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressInput = document.getElementById('progressInput');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeInput = document.getElementById('volumeInput');
const volumeValue = document.getElementById('volumeValue');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const albumArt = document.getElementById('albumArt');
const playlist = document.getElementById('playlist');
const themeButtons = document.querySelectorAll('.theme-btn'); // или getElementById, смотря что в HTML
const albumArtImg = document.getElementById('albumArtImg');
const playerGlass = document.getElementById('playerGlass');
let currentTrackIndex = 0;
let isPlaying = false;

// Playlist с треками (API данные)
let tracks = [];

// ===== API ИНТЕГРАЦИЯ (используем Last.fm или другой API) =====
async function loadTracksFromAPI() {
    try {
        // Используем публичный API для получения популярных треков
        // В реальном приложении используйте Spotify API, Last.fm API и т.д.
        const response = await fetch('https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&limit=10&api_key=YOUR_API_KEY&format=json');
        
        if (!response.ok) throw new Error('Ошибка загрузки API');
        
        const data = await response.json();
        
        // Если API не доступен, загружаем локальные данные
        loadDefaultTracks();
    } catch (error) {
        console.log('API недоступен, загружаем локальные треки:', error);
        loadDefaultTracks();
    }
}

// Локальные треки по умолчанию
function loadDefaultTracks() {
    tracks = [
        {
            title: 'Summer Vibes',
            artist: 'The Beat Master',
            duration: 245,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop'
        },
        {
            title: 'Night Drive',
            artist: 'Neon Dreams',
            duration: 312,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'
        },
        {
            title: 'Electric Sunset',
            artist: 'Synth Wave',
            duration: 278,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop'
        },
        {
            title: 'Cosmic Journey',
            artist: 'Space Explorer',
            duration: 298,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            cover: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop'
        },
        {
            title: 'Urban Beats',
            artist: 'City Sounds',
            duration: 256,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
        },
        {
            title: 'Deep Ocean',
            artist: 'Wave Rider',
            duration: 334,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
            cover: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=crop'
        },
        {
            title: 'Mountain Echo',
            artist: 'Nature\'s Voice',
            duration: 287,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
            cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=300&fit=crop'
        },
        {
            title: 'Forest Rain',
            artist: 'Ambient Vibes',
            duration: 301,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
            cover: 'https://images.unsplash.com/photo-1429962714451-bb934e63e980?w=300&h=300&fit=crop'
        }
    ];

    renderPlaylist();
    loadTrack(0);
}

// ===== ЗАГРУЗКА ТРЕКА =====
function loadTrack(index) {
    const track = tracks[index];
    audioPlayer.src = track.url;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumArt.src = track.cover;
    
    // Анимация загрузки обложки
    animateAlbumCover();
    
    progressInput.max = track.duration;
    durationEl.textContent = formatTime(track.duration);
    progressInput.value = 0;
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    
    updatePlaylistActive();
    
    // Сохраняем в localStorage
    localStorage.setItem('currentTrack', index);
}

// ===== АНИМАЦИЯ ОБЛОЖКИ АЛЬБОМА =====
function animateAlbumCover() {
    albumArtImg.style.animation = 'none';
    setTimeout(() => {
        albumArtImg.style.animation = 'slideInScale 0.5s ease-out';
    }, 10);
}

// ===== УПРАВЛЕНИЕ ВОСПРОИЗВЕДЕНИЕМ =====
playBtn.addEventListener('click', togglePlay);

function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        playBtn.textContent = '▶️';
        albumArtImg.classList.remove('playing');
        animateButton(playBtn, 'shrink');
    } else {
        audioPlayer.play();
        playBtn.textContent = '⏸️';
        albumArtImg.classList.add('playing');
        animateButton(playBtn, 'pulse');
    }
    isPlaying = !isPlaying;
}

// ===== НАВИГАЦИЯ ПО ТРЕКАМ =====
prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audioPlayer.play();
    animateButton(prevBtn, 'bounce-left');
});

nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) audioPlayer.play();
    animateButton(nextBtn, 'bounce-right');
});

// ===== АВТОМАТИЧЕСКОЕ ПЕРЕКЛЮЧЕНИЕ ТРЕКА =====
audioPlayer.addEventListener('ended', () => {
    nextBtn.click();
});

// ===== ПРОГРЕСС БАР =====
audioPlayer.addEventListener('timeupdate', () => {
    const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = percentage + '%';
    progressInput.value = audioPlayer.currentTime;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    
    // Анимация мерцания прогресса при завершении
    if (audioPlayer.currentTime > audioPlayer.duration - 2) {
        progress.style.animation = 'pulse-glow 0.5s ease-in-out infinite';
    } else {
        progress.style.animation = 'none';
    }
});

progressInput.addEventListener('input', (e) => {
    audioPlayer.currentTime = e.target.value;
    
    // Анимация рипла при клике
    createRipple(e, progress.parentElement);
});

// ===== ГРОМКОСТЬ =====
volumeInput.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
    volumeValue.textContent = e.target.value + '%';
    
    // Анимация изменения громкости
    animateVolumeChange();
});

function animateVolumeChange() {
    volumeInput.style.animation = 'volumePulse 0.3s ease';
    setTimeout(() => {
        volumeInput.style.animation = 'none';
    }, 300);
}

// ===== ФОРМАТИРОВАНИЕ ВРЕМЕНИ =====
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== ОТРИСОВКА ПЛЕЙЛИСТА =====
function renderPlaylist() {
    playlist.innerHTML = '';
    tracks.forEach((track, index) => {
        const trackEl = document.createElement('div');
        trackEl.className = 'track-item';
        trackEl.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <span>${track.title}</span>
                <span style="opacity: 0.7; font-size: 12px;">${formatTime(track.duration)}</span>
            </div>
            <div style="opacity: 0.6; font-size: 12px; margin-top: 4px;">${track.artist}</div>
        `;
        trackEl.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(index);
            if (!isPlaying) togglePlay();
            animatePlaylistClick(trackEl);
        });
        playlist.appendChild(trackEl);
    });
}

// ===== ОБНОВЛЕНИЕ АКТИВНОГО ТРЕКА В ПЛЕЙЛИСТЕ =====
function updatePlaylistActive() {
    document.querySelectorAll('.track-item').forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

// ===== АНИМАЦИИ =====
function animateButton(button, type) {
    button.style.animation = 'none';
    setTimeout(() => {
        if (type === 'pulse') {
            button.style.animation = 'buttonPulse 0.4s ease';
        } else if (type === 'bounce-left') {
            button.style.animation = 'bounceLeft 0.4s ease';
        } else if (type === 'bounce-right') {
            button.style.animation = 'bounceRight 0.4s ease';
        } else if (type === 'shrink') {
            button.style.animation = 'buttonShrink 0.3s ease';
        }
    }, 10);
}

function animatePlaylistClick(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'playlistClick 0.4s ease';
    }, 10);
}

function createRipple(event, container) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `
        position: absolute;
        pointer-events: none;
        width: 20px;
        height: 20px;
        background: var(--accent);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
    `;
    
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = x - 10 + 'px';
    ripple.style.top = y - 10 + 'px';
    
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ===== ПЕРЕКЛЮЧЕНИЕ ТЕМ =====
themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const theme = e.target.dataset.theme;
        switchTheme(theme);
        animateThemeSwitch(btn);
    });
});

function switchTheme(theme) {
    document.body.className = '';
    
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (theme === 'neon') {
        document.body.classList.add('neon-theme');
    }
    
    // Обновляем активную кнопку
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    // Сохраняем в localStorage
    localStorage.setItem('theme', theme);
}

function animateThemeSwitch(button) {
    button.style.animation = 'none';
    setTimeout(() => {
        button.style.animation = 'themeSpin 0.6s ease';
    }, 10);
}

// ===== ЗАГРУЗКА СОХРАНЕННОЙ ТЕМЫ =====
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const btn = document.querySelector(`[data-theme="${savedTheme}"]`);
    if (btn) {
        btn.classList.add('active');
        if (savedTheme !== 'dark') {
            switchTheme(savedTheme);
        }
    }
}

// ===== ДОБАВЛЯЕМ CSS АНИМАЦИИ ДИНАМИЧЕСКИ =====
function addAnimationStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideInScale {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes buttonPulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.15);
            }
        }

        @keyframes buttonShrink {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(0.9);
            }
        }

        @keyframes bounceLeft {
            0%, 100% {
                transform: translateX(0);
            }
            50% {
                transform: translateX
