function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function getProfiles() {
    const profilesJSON = localStorage.getItem('userProfiles');
    return profilesJSON ? JSON.parse(profilesJSON) : [];
}

function saveProfiles(profiles) {
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
}

function addOrUpdateProfile(profile) {
    let profiles = getProfiles();
    
    profile.lastModified = new Date().toISOString(); 

    if (profile.id) {
        const index = profiles.findIndex(p => p.id === profile.id);
        if (index !== -1) {
            profiles[index] = profile;
        } else {
            profile.id = generateUniqueId();
            profiles.push(profile);
        }
    } else {
        profile.id = generateUniqueId();
        profiles.push(profile);
    }
    saveProfiles(profiles);
}

document.addEventListener('DOMContentLoaded', () => {
    const chooseAvatarBtn = document.getElementById('choose-avatar-btn');
    const avatarModal = document.getElementById('avatar-modal');
    const closeAvatarModal = document.getElementById('close-avatar-modal');
    const avatarGrid = document.getElementById('avatar-grid');
    const currentAvatarImg = document.getElementById('current-avatar-img');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const profileNameInput = document.getElementById('profileName');
    const editingProfileId = new URLSearchParams(window.location.search).get('id');


    const avatarData = [
        { path: '../ejlah.jpeg', name: 'Elliah' },
        { path: '../haylel.jpeg', name: 'Hayley' },
        { path: '../landon.jpeg', name: 'Landon' },
        { path: '../dracula.jpeg', name: 'Dracula' },
        { path: '../jacob.jpeg', name: 'Jacob' },
        { path: '../bella.jpeg', name: 'Bella' },
        { path: '../edward.jpeg', name: 'Edward' },
        { path: '../blade.jpeg', name: 'Blade' },
        { path: '../carlsie.jpeg', name: 'Carlsie' },
        { path: '../jane.jpeg', name: 'Jane' },
        { path: '../kol.jpeg', name: 'Kol' },
        { path: '../klaus.jpeg', name: 'Klaus' },
    ];

    let selectedAvatar = {
        path: '../defav.jpeg',
        name: 'Default Avatar'
    };

    if (currentAvatarImg) {
        selectedAvatar.path = currentAvatarImg.src.split('/').pop();
        selectedAvatar.name = currentAvatarImg.alt;
    }

    if (editingProfileId && currentAvatarImg && profileNameInput) {
        const profiles = getProfiles();
        const profileToEdit = profiles.find(p => p.id === editingProfileId);
        if (profileToEdit) {
            currentAvatarImg.src = profileToEdit.avatarPath;
            currentAvatarImg.alt = profileToEdit.avatarName;
            profileNameInput.value = profileToEdit.profileName;
            selectedAvatar.path = profileToEdit.avatarPath;
            selectedAvatar.name = profileToEdit.avatarName;
            document.querySelector('.page-title').textContent = 'EDIT PROFILE';
        } else {
            console.warn('Profile not found for editing:', editingProfileId);
        }
    }

    function openModal() {
        if (avatarModal) {
            avatarModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            populateAvatarGrid();
            markCurrentlySelectedAvatar();
        }
    }

    function closeModal() {
        if (avatarModal) {
            avatarModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function populateAvatarGrid() {
        if (!avatarGrid) return;
        avatarGrid.innerHTML = '';
        avatarData.forEach(avatar => {
            const avatarItem = document.createElement('div');
            avatarItem.classList.add('avatar-item');
            avatarItem.dataset.avatarPath = avatar.path;

            const avatarImageWrapper = document.createElement('div');
            avatarImageWrapper.classList.add('avatar-image-wrapper');
            
            const img = document.createElement('img');
            img.src = avatar.path;
            img.alt = avatar.name;

            avatarImageWrapper.appendChild(img);

            const nameSpan = document.createElement('span');
            nameSpan.classList.add('avatar-name');
            nameSpan.textContent = avatar.name;

            avatarItem.appendChild(avatarImageWrapper);
            avatarItem.appendChild(nameSpan);
            avatarGrid.appendChild(avatarItem);

            avatarItem.addEventListener('click', () => {
                selectedAvatar.path = avatar.path;
                selectedAvatar.name = avatar.name;

                if (currentAvatarImg) {
                    currentAvatarImg.src = selectedAvatar.path;
                    currentAvatarImg.alt = selectedAvatar.name;
                }
                if (profileNameInput) {
                    profileNameInput.value = selectedAvatar.name;
                }
                closeModal();
            });
        });
    }

    function markCurrentlySelectedAvatar() {
        if (!avatarGrid || !currentAvatarImg) return;
        const avatarItems = avatarGrid.querySelectorAll('.avatar-item');
        avatarItems.forEach(item => {
            if (item.dataset.avatarPath === currentAvatarImg.src.split('/').pop()) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    if (chooseAvatarBtn) {
      chooseAvatarBtn.addEventListener('click', openModal);
    }
    if (closeAvatarModal) {
      closeAvatarModal.addEventListener('click', closeModal);
    }
    if (avatarModal) {
        avatarModal.addEventListener('click', (event) => {
            if (event.target === avatarModal) {
                closeModal();
            }
        });
    }

    if (saveProfileBtn && profileNameInput) {
      saveProfileBtn.addEventListener('click', () => {
          const profileName = profileNameInput.value.trim();
          if (profileName) {
              const newProfile = {
                  id: editingProfileId || generateUniqueId(),
                  profileName: profileName,
                  avatarPath: selectedAvatar.path,
                  avatarName: selectedAvatar.name
              };
              addOrUpdateProfile(newProfile);
              alert(`Profile "${newProfile.profileName}" ${editingProfileId ? 'updated' : 'saved'}!`);
              window.location.href = 'mange.html';
          } else {
              alert('Please enter a profile name.');
          }
      });
    }
});