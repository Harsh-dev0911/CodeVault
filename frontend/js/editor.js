document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupSidebar();

    const form = document.getElementById('editor-form');
    const titleInput = document.getElementById('title');
    const langSelect = document.getElementById('language');
    const tagsInput = document.getElementById('tags');
    const codeArea = document.getElementById('code');
    const pageTitle = document.getElementById('page-title');
    const submitBtn = document.getElementById('submit-btn');

    // Check if editing
    const urlParams = new URLSearchParams(window.location.search);
    const snippetId = urlParams.get('id');
    const isEdit = Boolean(snippetId);

    if (isEdit) {
        pageTitle.textContent = 'Edit Snippet';
        submitBtn.textContent = 'Save Changes';
        loadSnippet(snippetId);
    }

    async function loadSnippet(id) {
        try {
            const data = await apiFetch(`/snippets/${id}`);
            titleInput.value = data.title;
            langSelect.value = data.language;
            tagsInput.value = (data.tags || []).join(', ');
            codeArea.value = data.code;
        } catch (error) {
            showToast('Failed to load snippet details', 'error');
            setTimeout(() => window.location.href = '/dashboard.html', 2000);
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            title: titleInput.value,
            code: codeArea.value,
            language: langSelect.value,
            tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            if (isEdit) {
                await apiFetch(`/snippets/${snippetId}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                showToast('Snippet updated!', 'success');
            } else {
                await apiFetch('/snippets', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                showToast('Snippet created!', 'success');
            }
            setTimeout(() => window.location.href = '/dashboard.html', 800);
        } catch (err) {
            // Handled in api.js
        }
    });

    // Simple tab spacing support in textarea
    codeArea.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 4;
        }
    });
});
