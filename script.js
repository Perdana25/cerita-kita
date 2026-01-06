document.addEventListener('DOMContentLoaded', () => {

    /* =====================
       SCROLL REVEAL
    ====================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    /* =====================
       SORT STORIES BY DATE
    ====================== */
    const storiesSorted = (window.stories || []).slice().sort((a, b) => {
        if (!a.dateRaw || !b.dateRaw) return 0;
        return new Date(a.dateRaw) - new Date(b.dateRaw);
    });

    /* =====================
       COUNTER
    ====================== */
    const START_DATE = new Date("2024-12-22T00:00:00").getTime();
    const d = id => document.getElementById(id);

    d('start-date-disp').innerText =
        new Date(START_DATE).toLocaleDateString('id-ID');

    setInterval(() => {
        const diff = Date.now() - START_DATE;
        if (diff < 0) return;

        d('days').innerText = Math.floor(diff / 86400000);
        d('hours').innerText = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
        d('minutes').innerText = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
        d('seconds').innerText = String(Math.floor(diff / 1000) % 60).padStart(2, '0');
    }, 1000);

    /* =====================
       TIMELINE (FIXED ORDER)
    ====================== */
    const timeline = document.getElementById('timeline-container');
    if (timeline) {
        storiesSorted.forEach(story => {
            const card = document.createElement('div');
            card.className = 'glass-panel timeline-card scroll-reveal';
            card.innerHTML = `
                <span class="date">${story.date}</span>
                <h3>${story.title}</h3>
                <p>${story.shortText}</p>
            `;
            card.onclick = () => location.href = `story.html?id=${story.id}`;
            timeline.appendChild(card);
            observer.observe(card);
        });
    }

    /* =====================
       STORIES GRID (HOME)
    ====================== */
    const grid = document.getElementById('stories-grid');
    if (grid) {
        storiesSorted.slice(0, 3).forEach(story => {
            const card = document.createElement('div');
            card.className = 'glass-panel story-card scroll-reveal';

            let imgHTML = '';
            if (story.image) {
                imgHTML = `<img src="${story.image}" alt="${story.title}" loading="lazy" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">`;
            } else {
                imgHTML = `<div style="width:100%; height:200px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.05); border-radius:8px; margin-bottom:1rem; color: #fff;">Kisah Kita</div>`;
            }

            card.innerHTML = `
                ${imgHTML}
                <h3>${story.title}</h3>
                <span class="date">${story.date}</span>
                <p>${story.shortText}</p>
            `;
            card.onclick = () => location.href = `story.html?id=${story.id}`;
            grid.appendChild(card);
            observer.observe(card);
        });

        // "Lihat Semua" Button
        const btnContainer = document.createElement('div');
        btnContainer.style.textAlign = 'center';
        btnContainer.style.marginTop = '2rem';
        btnContainer.style.width = '100%';
        btnContainer.style.gridColumn = "1 / -1";
        btnContainer.className = "scroll-reveal";

        const btn = document.createElement('a');
        btn.href = 'stories-list.html';
        btn.className = 'primary-btn';
        btn.innerHTML = 'Lihat Semua Cerita <i class="fas fa-arrow-right"></i>';
        btn.style.textDecoration = 'none';
        btn.style.display = 'inline-block';

        btnContainer.appendChild(btn);
        grid.parentElement.appendChild(btnContainer);
        observer.observe(btnContainer);
    }

    /* =====================
       GALLERY LOGIC
    ====================== */
    window.toggleGallery = function () {
        const container = document.getElementById('gallery-container');
        const fade = document.getElementById('gallery-fade');
        const btn = fade.querySelector('.show-more-btn');
        if (!container) return;

        container.classList.toggle('expanded');

        if (container.classList.contains('expanded')) {
            fade.style.background = 'transparent';
            btn.innerText = "Tutup Galeri";
            fade.style.position = 'relative';
            fade.style.paddingTop = '2rem';
        } else {
            fade.style.background = 'linear-gradient(to bottom, transparent, #050510)';
            btn.innerText = "Lihat Lebih Banyak Foto";
            fade.style.position = 'absolute';
            fade.style.paddingTop = '0';
        }
    }

    /* =====================
       LIGHTBOX LOGIC
    ====================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    let isZoomed = false;

    if (lightbox) {
        // Open
        document.querySelectorAll('.gallery-img, .story-img').forEach(img => {
            // Optional: Enable lightbox for gallery images if clicked (unless .story-card img which is link)
            // If user added class gallery-img strictly to gallery, this works.
            img.addEventListener('click', (e) => {
                if (e.target.closest('.story-card')) return; // Ignore story card images as they are links
                lightboxImg.src = e.target.src;
                lightbox.classList.add('active');
                isZoomed = false;
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.classList.remove('zoomed');
            });
        });

        // Zoom
        lightboxImg.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isZoomed) {
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.classList.remove('zoomed');
                isZoomed = false;
            } else {
                lightboxImg.style.transform = 'scale(2)';
                lightboxImg.classList.add('zoomed');
                isZoomed = true;
            }
        });

        // Pan
        lightbox.addEventListener('mousemove', (e) => {
            if (isZoomed) {
                const x = e.clientX / window.innerWidth * 100;
                const y = e.clientY / window.innerHeight * 100;
                lightboxImg.style.transformOrigin = `${x}% ${y}%`;
            }
        });

        // Close
        window.closeLightbox = function (e) {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
                isZoomed = false;
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.classList.remove('zoomed');
            }
        }
    }

    /* =====================
       MUSIC
    ====================== */
    const music = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    const volBtn = document.getElementById('volume-btn');
    const sliderWrap = document.getElementById('volume-wrapper');
    const slider = document.getElementById('volume-slider');

    music.volume = 0.4;

    btn.onclick = () => {
        if (music.paused) {
            music.play();
            btn.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
        } else {
            music.pause();
            btn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    volBtn.onclick = () => sliderWrap.classList.toggle('active');
    slider.oninput = e => music.volume = e.target.value / 100;
});
