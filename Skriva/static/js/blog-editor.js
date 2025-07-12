class BlogEditor {
    constructor() {
        this.form = document.getElementById('post-form');
        this.titleInput = document.getElementById('post-title');
        this.slugInput = document.getElementById('post-slug');
        this.excerptInput = document.getElementById('post-excerpt');
        this.statusSelect = document.getElementById('post-status');
        this.hasChanges = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCharCounter();
        this.setupAutoSave();
        this.updateSlugPreview();
        this.hideSlugPreview();
    }

    setupEventListeners() {
        if (this.titleInput) {
            this.titleInput.addEventListener('input', () => {
                this.generateSlug();
                this.updateSlugPreview();
            });
            this.titleInput.addEventListener('blur', () => {
                if (this.titleInput.value) {
                    this.generateSlug();
                }
            });
        }

        if (this.slugInput) {
            this.slugInput.addEventListener('input', () => this.updateSlugPreview());
            this.slugInput.addEventListener('blur', () => this.updateSlugPreview());
        }

        if (this.excerptInput) {
            this.excerptInput.addEventListener('input', () => {
                this.updateCharCounter();
                this.hasChanges = true;
            });
        }

        if (this.statusSelect) {
            this.statusSelect.addEventListener('change', () => this.handleStatusChange());
        }

        const quickPublishBtn = document.getElementById('quick-publish');
        if (quickPublishBtn) {
            quickPublishBtn.addEventListener('click', () => this.quickPublish());
        }

        if (this.form) {
            const inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.hasChanges = true);
            });
        }
    }

    generateSlug() {
        if (!this.titleInput || !this.titleInput.value) return;

        const title = this.titleInput.value;

        const tempSlug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        const slugPreview = document.getElementById('slug-preview');
        if (slugPreview) {
            slugPreview.textContent = `/blog/${tempSlug}/`;
        }

        if (this.slugInput) {
            this.slugInput.value = tempSlug;
        }

        // Local slug generation only - no AJAX call needed
    }

    updateSlugPreview() {
        const slugPreview = document.getElementById('slug-preview');
        if (!slugPreview) return;

        slugPreview.style.display = 'block';

        if (this.slugInput && this.slugInput.value) {
            slugPreview.textContent = `/blog/${this.slugInput.value}/`;
            slugPreview.classList.add('active');
        } else if (this.titleInput && this.titleInput.value) {
            const slug = this.titleInput.value
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            slugPreview.textContent = `/blog/${slug}/`;
            slugPreview.classList.add('active');
            if (this.slugInput) {
                this.slugInput.value = slug;
            }
        } else {
            slugPreview.textContent = '';
            slugPreview.style.display = 'none';
            slugPreview.classList.remove('active');
        }
    }

    hideSlugPreview() {
        const slugPreview = document.getElementById('slug-preview');
        if (slugPreview) {
            slugPreview.style.display = 'none';
        }
    }

    updateCharCounter() {
        const counter = document.getElementById('excerpt-count');
        if (this.excerptInput && counter) {
            counter.textContent = this.excerptInput.value.length;
        }
    }

    setupAutoSave() {
        setInterval(() => {
            if (this.hasChanges && this.isFormValid()) {
                this.autoSave();
            }
        }, 30000);
    }

    autoSave() {
        const formData = new FormData(this.form);
        formData.append('auto_save', 'true');

        fetch(this.form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': this.getCSRFToken()
            }
        }).then(response => response.json())
          .then(data => {
              if (data.success) this.hasChanges = false;
          });
    }

    quickPublish() {
        if (this.statusSelect) {
            this.statusSelect.value = 'published';
            this.handleStatusChange();
        }
        this.savePost();
    }

    handleStatusChange() {
        const status = this.statusSelect.value;
        const publishInfo = document.getElementById('publish-info');
        if (!publishInfo) return;
        if (status === 'published') {
            publishInfo.innerHTML = '<small class="text-info">This post will be published</small>';
        } else if (status === 'draft') {
            publishInfo.innerHTML = '<small class="text-muted">Saved as draft</small>';
        } else if (status === 'archived') {
            publishInfo.innerHTML = '<small class="text-warning">Archived post</small>';
        }
    }

    savePost() {
        if (this.form) this.form.submit();
    }

    isFormValid() {
        const title = this.titleInput?.value?.trim();
        const content = this.getCKEditorContent();
        return title && content;
    }

    getCKEditorContent() {
        try {
            const editorIds = ['id_content', 'post-content', 'content'];
            for (const id of editorIds) {
                if (window.CKEDITOR && CKEDITOR.instances[id]) {
                    return CKEDITOR.instances[id].getData();
                }
            }
            if (window.CKEDITOR && Object.keys(CKEDITOR.instances).length > 0) {
                const firstId = Object.keys(CKEDITOR.instances)[0];
                return CKEDITOR.instances[firstId].getData();
            }
        } catch {}
        return '';
    }

    getCSRFToken() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.blogEditor = new BlogEditor();
    window.blogEditor.hideSlugPreview();
});

if (window.CKEDITOR) {
    CKEDITOR.on('instanceReady', evt => {
        evt.editor.on('change', () => {
            if (window.blogEditor) window.blogEditor.hasChanges = true;
        });
        if (window.blogEditor) {
            window.blogEditor.updateSlugPreview();
        }
    });
}
