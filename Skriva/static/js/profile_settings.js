document.addEventListener('DOMContentLoaded', function () {
    const updateProfileBtn = document.getElementById('update-profile-btn');
    const updateBannerBtn = document.getElementById('update-banner-btn');
    const removeProfileBtn = document.getElementById('remove-profile-btn');
    const removeBannerBtn = document.getElementById('remove-banner-btn');
    const profileImageInputId = document.body.dataset.profileImageId;
    const bannerImageInputId = document.body.dataset.bannerImageId;
    const profileImageInput = document.getElementById(profileImageInputId);
    const bannerImageInput = document.getElementById(bannerImageInputId);

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
            let existingInput = document.querySelector('input[name="remove_profile_image"]');
            if (!existingInput) {
                const removeInput = document.createElement('input');
                removeInput.type = 'hidden';
                removeInput.name = 'remove_profile_image';
                removeInput.value = 'true';
                document.getElementById('profile-edit-form').appendChild(removeInput);
            }
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-check"></i> Will be removed';
        });
    }
    
    if (removeBannerBtn) {
        removeBannerBtn.addEventListener('click', function() {
            let existingInput = document.querySelector('input[name="remove_banner_image"]');
            if (!existingInput) {
                const removeInput = document.createElement('input');
                removeInput.type = 'hidden';
                removeInput.name = 'remove_banner_image';
                removeInput.value = 'true';
                document.getElementById('profile-edit-form').appendChild(removeInput);
            }
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-check"></i> Will be removed';
            
        });
    }
});