document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupSidebar();

    const snippetsContainer = document.getElementById('snippets-container');
    const searchInput = document.getElementById('search-input');
    let snippetsData = [];

    async function loadSnippets(searchQuery = '') {
        try {
            const url = searchQuery ? `/snippets?search=${encodeURIComponent(searchQuery)}` : '/snippets';
            const data = await apiFetch(url);
            snippetsData = data;
            renderSnippets();
        } catch (error) {
            snippetsContainer.innerHTML = `<div style="text-align:center; color: var(--danger);">Failed to load snippets</div>`;
        }
    }

    function renderSnippets() {
        if (snippetsData.length === 0) {
            snippetsContainer.innerHTML = `
                <div class="glass-panel" style="text-align: center; margin-top: 3rem; color: var(--text-muted); padding: 3rem; border: 1px dashed var(--panel-border);">
                    <h3>No snippets found.</h3>
                    <p style="margin-top: 10px;">Create your first snippet to get started!</p>
                </div>
            `;
            return;
        }

        snippetsContainer.innerHTML = '';

        snippetsData.forEach(snippet => {
            const card = document.createElement('div');
            card.className = 'glass-panel snippet-card';

            const tagsHtml = (snippet.tags || []).map(t => `<span class="tag-custom">#${t}</span>`).join('');

            card.innerHTML = `
                <div class="snippet-header">
                    <h3 style="font-size: 1.25rem; margin: 0;">${escapeHtml(snippet.title)}</h3>
                    <div class="snippet-actions">
                        <button onclick="copySnippet('${snippet._id}')" class="btn-secondary" title="Copy">Copy</button>
                        <a href="/editor.html?id=${snippet._id}" class="btn-secondary" style="padding: 6px 10px; border-radius: 6px;" title="Edit">Edit</a>
                        <button onclick="deleteSnippet('${snippet._id}')" class="btn-danger" title="Delete">Del</button>
                    </div>
                </div>
                <div class="snippet-tags">
                    <span class="tag-lang">${escapeHtml(snippet.language)}</span>
                    ${tagsHtml}
                </div>
                <div class="code-container">
                    <pre><code class="language-${escapeHtml(snippet.language)}" id="code-${snippet._id}">${escapeHtml(snippet.code)}</code></pre>
                </div>
            `;
            
            snippetsContainer.appendChild(card);
        });

        // Trigger Prism formatting
        if (window.Prism) {
            window.Prism.highlightAll();
        }
    }

    // Debounce search
    let timeoutId;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            loadSnippets(e.target.value);
        }, 300);
    });

    window.copySnippet = function(id) {
        const codeElement = document.getElementById(`code-${id}`);
        if (codeElement) {
            navigator.clipboard.writeText(codeElement.textContent);
            showToast('Code copied to clipboard!');
        }
    };

    window.deleteSnippet = async function(id) {
        if (confirm('Delete this snippet?')) {
            try {
                await apiFetch(`/snippets/${id}`, { method: 'DELETE' });
                showToast('Snippet deleted');
                snippetsData = snippetsData.filter(s => s._id !== id);
                renderSnippets();
            } catch (err) {
                // Handled in api.js
            }
        }
    };

    function escapeHtml(unsafe) {
        return (unsafe || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // Initial load
    loadSnippets();
});
