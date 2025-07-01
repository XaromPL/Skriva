class BlogEditor {
    constructor() {
        this.form = document.getElementById('post-form');
        this.titleInput = document.getElementById('id_title');
        this.slugInput = document.getElementById('id_slug');
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
    }

    setupEventListeners() {
        if (this.titleInput && this.slugInput) {
            this.titleInput.addEventListener('input', this.debounce(() => {
                if (!this.slugInput.value) {
                    this.generateSlug();
                }
                this.updateSlugPreview();
            }, 500));
        }

        if (this.slugInput) {
            this.slugInput.addEventListener('input', () => this.updateSlugPreview());
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
        if (!this.titleInput.value) return;
        const title = this.titleInput.value;
        fetch(`/blog/ajax/generate-slug/?title=${encodeURIComponent(title)}`)
            .then(response => response.json())
            .then(data => {
                if (data.slug && this.slugInput) {
                    this.slugInput.value = data.slug;
                    this.updateSlugPreview();
                }
            });
    }

    updateSlugPreview() {
        const slugPreview = document.getElementById('slug-preview');
        if (this.slugInput && slugPreview) {
            if (this.slugInput.value) {
                slugPreview.textContent = `URL twojego wpisu: /blog/${this.slugInput.value}/`;
            } else if (this.titleInput && this.titleInput.value) {
                const slug = this.titleInput.value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
                slugPreview.textContent = `URL twojego wpisu: /blog/${slug}/`;
            } else {
                slugPreview.textContent = '';
            }
        }
    }

    updateCharCounter() {
        const counter = document.getElementById('excerpt-count');
        if (this.excerptInput && counter) {
            const count = this.excerptInput.value.length;
            counter.textContent = count;
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
              if (data.success) {
                  this.hasChanges = false;
              }
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
        if (publishInfo) {
            if (status === 'published') {
                publishInfo.innerHTML = '<small class="text-info">This post will be published</small>';
            } else if (status === 'draft') {
                publishInfo.innerHTML = '<small class="text-muted">Saved as draft</small>';
            } else if (status === 'archived') {
                publishInfo.innerHTML = '<small class="text-warning">Archived post</small>';
            }
        }
    }

    savePost() {
        if (this.form) {
            this.form.submit();
        }
    }

    isFormValid() {
        const title = this.titleInput?.value?.trim();
        const content = this.getCKEditorContent();
        return title && content;
    }

    getCKEditorContent() {
        try {
            if (window.CKEDITOR && CKEDITOR.instances['id_content']) {
                return CKEDITOR.instances['id_content'].getData();
            }
        } catch (_) {}
        return '';
    }

    getCSRFToken() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.blogEditor = new BlogEditor();
});

if (window.CKEDITOR) {
    CKEDITOR.on('instanceReady', function(evt) {
        const editor = evt.editor;
        editor.on('change', function() {
            if (window.blogEditor) {
                window.blogEditor.hasChanges = true;
            }
        });
    });
}
