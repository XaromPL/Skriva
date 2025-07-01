document.addEventListener('DOMContentLoaded', function () {
    // Uzyskaj odwołania do przycisków
    const updateProfileBtn = document.getElementById('update-profile-btn');
    const updateBannerBtn = document.getElementById('update-banner-btn');
    const removeProfileBtn = document.getElementById('remove-profile-btn');
    const removeBannerBtn = document.getElementById('remove-banner-btn');
    
    // Uzyskaj identyfikatory pól input z atrybutów data
    const profileImageInputId = document.body.dataset.profileImageId;
    const bannerImageInputId = document.body.dataset.bannerImageId;
    
    // Uzyskaj odwołania do pól input
    const profileImageInput = document.getElementById(profileImageInputId);
    const bannerImageInput = document.getElementById(bannerImageInputId);
    
    // Debugowanie - dodajemy komunikaty do konsoli, aby sprawdzić czy elementy zostały znalezione
    console.log('Update Profile button:', updateProfileBtn);
    console.log('Update Banner button:', updateBannerBtn);
    console.log('Remove Profile button:', removeProfileBtn);
    console.log('Remove Banner button:', removeBannerBtn);
    console.log('Profile Image Input ID:', profileImageInputId);
    console.log('Banner Image Input ID:', bannerImageInputId);
    console.log('Profile Image Input:', profileImageInput);
    console.log('Banner Image Input:', bannerImageInput);
    if (updateProfileBtn && profileImageInput) {
        updateProfileBtn.addEventListener('click', function() {
            profileImageInput.click();
        });
    }

    if (updateBannerBtn && bannerImageInput) {
        updateBannerBtn.addEventListener('click', function() {
            bannerImageInput.click();
        });
    }

    if (removeProfileBtn) {
        removeProfileBtn.addEventListener('click', function() {
            const removeInput = document.createElement('input');
            removeInput.type = 'hidden';
            removeInput.name = 'remove_profile_image';
            removeInput.value = 'true';
            document.getElementById('profile-edit-form').appendChild(removeInput);
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-check"></i> Will be removed';
        });
    }
    
    if (removeBannerBtn) {
        removeBannerBtn.addEventListener('click', function() {
            const removeInput = document.createElement('input');
            removeInput.type = 'hidden';
            removeInput.name = 'remove_banner_image';
            removeInput.value = 'true';
            document.getElementById('profile-edit-form').appendChild(removeInput);
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-check"></i> Will be removed';
        });
    }
});