document.addEventListener('DOMContentLoaded', () => {
    const dynamicProfilesGrid = document.getElementById('dynamic-profiles-grid');

    // FIX 3: Prevent crash if this script runs on a page without the grid
    if (!dynamicProfilesGrid) return;

    if (typeof getProfiles === 'undefined') {
        console.error("Error: getProfiles function is not available. Ensure script.js is loaded correctly before whoswatch.js.");
        return;
    }

    // ── PROFILE SELECTION LOGIC ──
    function selectProfile(profileId, avatarSrc) {
        // Save chosen avatar and ID
        localStorage.setItem('vw_active_avatar', avatarSrc);
        localStorage.setItem('vw_active_profile', profileId);

        // FIX 1: Redirect to index.html instead of the empty movieinfo.html
        window.location.href = 'movieinfo.html';
    }

    // ── RENDER PROFILES ──
    function renderWhoIsWatchingProfiles() {
        dynamicProfilesGrid.innerHTML = '';

        // FIX 2: Default to an empty array if getProfiles() returns null/undefined
        let profiles = getProfiles() || [];

        profiles = profiles.filter(
            p => p.lastModified && !isNaN(new Date(p.lastModified))
        );

        profiles.sort((a, b) => {
            const dateA = new Date(a.lastModified);
            const dateB = new Date(b.lastModified);
            return dateB.getTime() - dateA.getTime();
        });

        const recentProfiles = profiles.slice(0, 3);

        recentProfiles.forEach(profile => {
            const profileCard = document.createElement('a');
            profileCard.href = "#";
            profileCard.classList.add('profile-card');

            profileCard.onclick = (event) => {
                event.preventDefault();
                selectProfile(profile.id, profile.avatarPath);
            };

            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('profile-avatar');

            const img = document.createElement('img');
            img.src = profile.avatarPath;
            
            // Added fallback to profileName if avatarName is missing
            img.alt = profile.avatarName || profile.profileName; 

            avatarDiv.appendChild(img);

            const profileNameSpan = document.createElement('span');
            profileNameSpan.classList.add('profile-name');
            profileNameSpan.textContent = profile.profileName;

            profileCard.appendChild(avatarDiv);
            profileCard.appendChild(profileNameSpan);

            dynamicProfilesGrid.appendChild(profileCard);
        });
    }

    // ── STATIC PROFILE SUPPORT ──
    document.querySelectorAll('.static-profiles .profile-card').forEach(card => {
        card.onclick = (e) => {
            e.preventDefault();

            const img = card.querySelector('img');

            if (img) {
                selectProfile('static', img.getAttribute('src'));
            }
        };
    });

    renderWhoIsWatchingProfiles();
});