document.addEventListener('DOMContentLoaded', () => {
    const profilesGrid = document.getElementById('profiles-grid');
    const deleteModal = document.getElementById('delete-modal');
    const closeDeleteModal = document.getElementById('close-delete-modal');
    const profileNameToDelete = document.getElementById('profile-name-to-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    let profileToDeleteId = null;

    function renderProfiles() {
        profilesGrid.innerHTML = '';
        const profiles = window.getProfiles();

        if (profiles.length === 0) {
            profilesGrid.innerHTML = '<p style="color:#aaa; text-align:center;">No profiles found. Click "ADD PROFILE" to create one!</p>';
            return;
        }

        profiles.forEach(profile => {
            const profileCard = document.createElement('div');
            profileCard.classList.add('profile-card');

            const avatarPreview = document.createElement('div');
            avatarPreview.classList.add('avatar-preview');
            const img = document.createElement('img');
            img.src = profile.avatarPath;
            img.alt = profile.avatarName;
            avatarPreview.appendChild(img);

            const profileName = document.createElement('span');
            profileName.classList.add('profile-name');
            profileName.textContent = profile.profileName;

            const profileActions = document.createElement('div');
            profileActions.classList.add('profile-actions');

            const editBtn = document.createElement('button');
            editBtn.classList.add('action-btn', 'edit-btn');
            editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            editBtn.title = `Edit ${profile.profileName}`;
            editBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                window.location.href = `addprof.html?id=${profile.id}`;
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('action-btn', 'delete-btn');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.title = `Delete ${profile.profileName}`;
            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                showDeleteConfirmation(profile.id, profile.profileName);
            });

            profileActions.appendChild(editBtn);
            profileActions.appendChild(deleteBtn);

            profileCard.appendChild(avatarPreview);
            profileCard.appendChild(profileName);
            profileCard.appendChild(profileActions);

            profilesGrid.appendChild(profileCard);
        });
    }

    function showDeleteConfirmation(profileId, name) {
        profileToDeleteId = profileId;
        profileNameToDelete.textContent = name;
        deleteModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hideDeleteConfirmation() {
        profileToDeleteId = null;
        deleteModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    confirmDeleteBtn.addEventListener('click', () => {
        if (profileToDeleteId) {
            let profiles = window.getProfiles();
            profiles = profiles.filter(p => p.id !== profileToDeleteId);
            window.saveProfiles(profiles);
            hideDeleteConfirmation();
            renderProfiles();
        }
    });

    cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);
    closeDeleteModal.addEventListener('click', hideDeleteConfirmation);
    deleteModal.addEventListener('click', (event) => {
        if (event.target === deleteModal) {
            hideDeleteConfirmation();
        }
    });

    renderProfiles();
})