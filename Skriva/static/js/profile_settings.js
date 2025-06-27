document.addEventListener('DOMContentLoaded', function () {
    const avatarEditBtn = document.getElementById('avatar-edit-btn');
    const bannerEditBtn = document.getElementById('banner-edit-btn');

    const profileImageInputId = document.body.dataset.profileImageId;
    const bannerImageInputId = document.body.dataset.bannerImageId;

    const profileImageInput = document.getElementById(profileImageInputId);
    const bannerImageInput = document.getElementById(bannerImageInputId);

    if (avatarEditBtn && profileImageInput) {
        avatarEditBtn.addEventListener('click', function () {
            profileImageInput.click();
        });

        profileImageInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                document.getElementById('profile-edit-form').submit();
            }
        });
    }

    if (bannerEditBtn && bannerImageInput) {
        bannerEditBtn.addEventListener('click', function () {
            bannerImageInput.click();
        });

        bannerImageInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                document.getElementById('profile-edit-form').submit();
            }
        });
    }
});