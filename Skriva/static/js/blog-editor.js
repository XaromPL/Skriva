// Blog Editor JavaScript

class BlogEditor {
    constructor() {
        this.form = document.getElementById('post-form');
        this.titleInput = document.getElementById('post-title');
        this.slugInput = document.getElementById('post-slug');
        this.excerptInput = document.getElementById('post-excerpt');
        this.imageInput = document.getElementById('post-image');
        this.statusSelect = document.getElementById('post-status');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCharCounter();
        this.setupImagePreview();
        this.setupKeyboardShortcuts();
        this.setupAutoSave();
    }
    
    setupEventListeners() {
        // Auto-generate slug from title
        if (this.titleInput && this.slugInput) {
            this.titleInput.addEventListener('input', this.debounce(() => {
                if (!this.slugInput.value) {
                    this.generateSlug();
                }
            }, 500));
        }
        
        // Character counter for excerpt
        if (this.excerptInput) {
            this.excerptInput.addEventListener('input', () => {
                this.updateCharCounter();
            });
        }
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
        
        // Quick publish button
        const quickPublishBtn = document.getElementById('quick-publish');
        if (quickPublishBtn) {
            quickPublishBtn.addEventListener('click', () => {
                this.quickPublish();
            });
        }
        
        // Status change
        if (this.statusSelect) {
            this.statusSelect.addEventListener('change', () => {
                this.handleStatusChange();
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
                }
            })
            .catch(error => {
                console.error('Error generating slug:', error);
            });
    }
    
    updateCharCounter() {
        if (!this.excerptInput) return;
        
        const count = this.excerptInput.value.length;
        const maxLength = 300;
        const counter = document.getElementById('excerpt-count');
        
        if (counter) {
            counter.textContent = count;
            counter.className = 'char-counter';
            
            if (count > maxLength * 0.8) {
                counter.classList.add('warning');
            }
            if (count > maxLength) {
                counter.classList.add('danger');
            }
        }
    }
    
    setupImagePreview() {
        if (!this.imageInput) return;
        
        this.imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.showImagePreview(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                this.hideImagePreview();
            }
        });
    }
    
    showImagePreview(src) {
        let preview = document.getElementById('image-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'image-preview';
            preview.innerHTML = `
                <p class="form-help">New image preview:</p>
                <img id="preview-img" src="" alt="Preview" class="image-preview">
            `;
            this.imageInput.parentNode.appendChild(preview);
        }
        
        const img = preview.querySelector('#preview-img');
        img.src = src;
        preview.style.display = 'block';
    }
    
    hideImagePreview() {
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.style.display = 'none';
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S = Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.savePost();
            }
            
            // Ctrl+Shift+P = Quick publish
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.quickPublish();
            }
        });
    }
    
    setupAutoSave() {
        // Auto-save every 30 seconds if form has changes
        this.hasChanges = false;
        
        if (this.form) {
            const inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.hasChanges = true;
                });
            });
            
            setInterval(() => {
                if (this.hasChanges && this.isFormValid()) {
                    this.autoSave();
                }
            }, 30000);
        }
    }
    
    handleFormSubmit(e) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Saving...';
        }
    }
    
    handleStatusChange() {
        const status = this.statusSelect.value;
        const publishInfo = document.getElementById('publish-info');
        
        if (publishInfo) {
            if (status === 'published') {
                publishInfo.innerHTML = '<small class="text-info">✓ This post will be published</small>';
            } else if (status === 'draft') {
                publishInfo.innerHTML = '<small class="text-muted">📝 Saved as draft</small>';
            } else if (status === 'archived') {
                publishInfo.innerHTML = '<small class="text-warning">📦 Archived post</small>';
            }
        }
    }
    
    quickPublish() {
        if (this.statusSelect) {
            this.statusSelect.value = 'published';
            this.handleStatusChange();
        }
        this.savePost();
    }
    
    savePost() {
        if (this.form) {
            this.form.submit();
        }
    }
    
    autoSave() {
        if (!this.isFormValid()) return;
        
        const formData = new FormData(this.form);
        formData.append('auto_save', 'true');
        
        fetch(this.form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': this.getCSRFToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showNotification('Auto-saved', 'success');
                this.hasChanges = false;
            }
        })
        .catch(error => {
            console.error('Auto-save failed:', error);
        });
    }
    
    isFormValid() {
        if (!this.form) return false;
        
        const title = this.titleInput?.value?.trim();
        const content = this.getCKEditorContent();
        
        return title && content;
    }
    
    getCKEditorContent() {
        try {
            if (window.CKEDITOR && CKEDITOR.instances['id_content']) {
                return CKEDITOR.instances['id_content'].getData();
            }
        } catch (e) {
            console.error('Error getting CKEditor content:', e);
        }
        return '';
    }
    
    getCSRFToken() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        const container = document.querySelector('.editor-container');
        if (container) {
            container.insertBefore(notification, container.firstChild);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 3000);
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogEditor = new BlogEditor();
});

// Additional utility functions
function confirmDelete(message = 'Are you sure you want to delete this post?') {
    return confirm(message);
}

function previewPost(url) {
    window.open(url, '_blank');
}

// Handle CKEditor ready event
if (window.CKEDITOR) {
    CKEDITOR.on('instanceReady', function(evt) {
        const editor = evt.editor;
        
        // Track changes for auto-save
        editor.on('change', function() {
            if (window.blogEditor) {
                window.blogEditor.hasChanges = true;
            }
        });
    });
}
