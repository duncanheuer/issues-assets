// QR Codes Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('QR Codes page loaded');
    
    // Initialize QR codes functionality
    initializeQRCodesPage();
});

function initializeQRCodesPage() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Initialize QR code actions
    initializeQRCodeActions();
    
    // Initialize create QR code button
    initializeCreateQRCode();
    
    // Initialize filter functionality
    initializeFilters();
    
    // Check if table is empty and show/hide empty state
    updateEmptyState();
}

function initializeSearch() {
    const searchInput = document.getElementById('qrCodeSearch');
    const tableRows = document.querySelectorAll('.qrcode-row');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let visibleCount = 0;
        
        tableRows.forEach(row => {
            const qrcodeName = row.querySelector('.qrcode-title').textContent.toLowerCase();
            const qrcodeCreated = row.querySelector('.qrcode-created').textContent.toLowerCase();
            const qrcodeSite = row.querySelector('.qrcode-site').textContent.toLowerCase();
            const qrcodeAsset = row.querySelector('.qrcode-asset').textContent.toLowerCase();
            const qrcodeCategory = row.querySelector('.qrcode-category').textContent.toLowerCase();
            
            const isVisible = qrcodeName.includes(searchTerm) || 
                            qrcodeCreated.includes(searchTerm) || 
                            qrcodeSite.includes(searchTerm) || 
                            qrcodeAsset.includes(searchTerm) ||
                            qrcodeCategory.includes(searchTerm);
            
            if (isVisible) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        updateEmptyState(visibleCount === 0 && searchTerm !== '');
    });
    
    // Clear search functionality
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    });
}

function initializeTableSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortType = this.dataset.sort;
            const sortArrow = this.querySelector('.sort-arrow');
            const currentDirection = this.dataset.direction || 'desc';
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
            
            // Reset all other arrows
            sortableHeaders.forEach(h => {
                if (h !== this) {
                    const arrow = h.querySelector('.sort-arrow');
                    if (arrow) {
                        arrow.textContent = '';
                    }
                    h.removeAttribute('data-direction');
                }
            });
            
            // Update current arrow
            if (sortArrow) {
                sortArrow.textContent = newDirection === 'asc' ? '↑' : '↓';
            }
            this.dataset.direction = newDirection;
            
            // Sort the table
            sortTable(sortType, newDirection);
        });
    });
}

function sortTable(sortType, direction) {
    const tbody = document.getElementById('qrCodesTableBody');
    const rows = Array.from(tbody.querySelectorAll('.qrcode-row'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortType) {
            case 'name':
                aValue = a.querySelector('.qrcode-title').textContent.trim();
                bValue = b.querySelector('.qrcode-title').textContent.trim();
                break;
            case 'created':
                aValue = new Date(a.querySelector('.qrcode-created').textContent.trim());
                bValue = new Date(b.querySelector('.qrcode-created').textContent.trim());
                break;
            default:
                return 0;
        }
        
        let comparison;
        if (sortType === 'created') {
            comparison = aValue.getTime() - bValue.getTime();
        } else {
            comparison = aValue.localeCompare(bValue);
        }
        
        return direction === 'asc' ? comparison : -comparison;
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

function initializeQRCodeActions() {
    // Action menu buttons
    const actionMenuButtons = document.querySelectorAll('.action-menu-btn');
    actionMenuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const qrcodeId = this.dataset.id;
            showQRCodeActionMenu(this, qrcodeId);
        });
    });
}

function showQRCodeActionMenu(button, qrcodeId) {
    console.log(`Showing action menu for QR code ID: ${qrcodeId}`);
    
    // Get QR code details
    const row = button.closest('.qrcode-row');
    const qrcodeName = row.querySelector('.qrcode-title').textContent;
    
    // Simple action menu simulation
    const actions = ['View QR Code', 'Download', 'Edit', 'Duplicate', 'Delete'];
    const action = prompt(`Choose action for "${qrcodeName}":\n${actions.map((act, i) => `${i + 1}. ${act}`).join('\n')}\n\nEnter choice (1-${actions.length}):`);
    
    if (action && action >= 1 && action <= actions.length) {
        const selectedAction = actions[action - 1];
        handleQRCodeAction(selectedAction, qrcodeId, qrcodeName);
    }
}

function handleQRCodeAction(action, qrcodeId, qrcodeName) {
    switch (action) {
        case 'View QR Code':
            viewQRCode(qrcodeId, qrcodeName);
            break;
        case 'Download':
            downloadQRCode(qrcodeId, qrcodeName);
            break;
        case 'Edit':
            editQRCode(qrcodeId, qrcodeName);
            break;
        case 'Duplicate':
            duplicateQRCode(qrcodeId, qrcodeName);
            break;
        case 'Delete':
            deleteQRCode(qrcodeId, qrcodeName);
            break;
        default:
            console.log('Unknown action:', action);
    }
}

function viewQRCode(qrcodeId, qrcodeName) {
    console.log(`Viewing QR code: ${qrcodeName}`);
    alert(`QR Code Viewer\n\nName: ${qrcodeName}\nID: ${qrcodeId}\n\n[QR Code would be displayed here]`);
}

function downloadQRCode(qrcodeId, qrcodeName) {
    console.log(`Downloading QR code: ${qrcodeName}`);
    
    // Simulate download
    const link = document.createElement('a');
    link.download = `${qrcodeName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qrcode.png`;
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    link.click();
    
    console.log(`QR code downloaded: ${qrcodeName}`);
}

function editQRCode(qrcodeId, qrcodeName) {
    console.log(`Editing QR code: ${qrcodeName}`);
    
    const newName = prompt(`Edit QR code name:`, qrcodeName);
    if (newName && newName !== qrcodeName) {
        // Update the QR code name in the table
        const row = document.querySelector(`[data-id="${qrcodeId}"]`);
        if (row) {
            row.querySelector('.qrcode-title').textContent = newName;
            console.log(`QR code updated: ${qrcodeName} → ${newName}`);
        }
    }
}

function duplicateQRCode(qrcodeId, qrcodeName) {
    const originalRow = document.querySelector(`[data-id="${qrcodeId}"]`);
    if (!originalRow) return;
    
    const newName = `${qrcodeName} (Copy)`;
    const newId = `${qrcodeId}-copy-${Date.now()}`;
    
    // Create new row
    const newRow = originalRow.cloneNode(true);
    newRow.dataset.id = newId;
    newRow.querySelector('.qrcode-title').textContent = newName;
    newRow.querySelector('.action-menu-btn').dataset.id = newId;
    
    // Update created date to now
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    newRow.querySelector('.qrcode-created').textContent = formattedDate;
    
    // Insert after original row
    originalRow.parentNode.insertBefore(newRow, originalRow.nextSibling);
    
    // Re-initialize actions for the new row
    initializeQRCodeActions();
    updateEmptyState();
    
    console.log(`QR code duplicated: ${qrcodeName} → ${newName}`);
}

function deleteQRCode(qrcodeId, qrcodeName) {
    const row = document.querySelector(`[data-id="${qrcodeId}"]`);
    if (!row) return;
    
    const confirmed = confirm(`Are you sure you want to delete the QR code "${qrcodeName}"?`);
    
    if (confirmed) {
        row.remove();
        updateEmptyState();
        console.log(`QR code deleted: ${qrcodeName}`);
    }
}

function initializeCreateQRCode() {
    const createButton = document.getElementById('createQRBtn');
    const sidePanel = document.getElementById('createQRPanel');
    const overlay = document.getElementById('sidePanelOverlay');
    const closeBtn = document.getElementById('closePanelBtn');
    const cancelBtn = document.getElementById('cancelCreateBtn');
    const createForm = document.getElementById('createQRForm');
    
    // Open side panel
    createButton.addEventListener('click', function() {
        console.log('Create new QR code clicked');
        openSidePanel();
    });
    
    // Close side panel
    closeBtn.addEventListener('click', closeSidePanel);
    cancelBtn.addEventListener('click', closeSidePanel);
    overlay.addEventListener('click', closeSidePanel);
    
    // Handle form submission
    createForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleCreateQRCode();
    });
    
    // Initialize other side panel functionality
    initializeSidePanelFeatures();
}

function openSidePanel() {
    const sidePanel = document.getElementById('createQRPanel');
    const overlay = document.getElementById('sidePanelOverlay');
    
    // Show overlay
    overlay.style.display = 'block';
    
    // Trigger animations
    setTimeout(() => {
        overlay.classList.add('show');
        sidePanel.classList.add('show');
    }, 10);
    
    // Focus on name input
    setTimeout(() => {
        document.getElementById('qrCodeName').focus();
    }, 300);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeSidePanel() {
    const sidePanel = document.getElementById('createQRPanel');
    const overlay = document.getElementById('sidePanelOverlay');
    const form = document.getElementById('createQRForm');
    const siteTile = document.getElementById('siteTile');
    const assetTile = document.getElementById('assetTile');
    const addSiteFieldBtn = document.getElementById('addSiteFieldBtn');
    const addAssetFieldBtn = document.getElementById('addAssetFieldBtn');
    
    // Remove show classes
    overlay.classList.remove('show');
    sidePanel.classList.remove('show');
    
    // Hide overlay after animation
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
    
    // Reset form
    form.reset();
    
    // Reset tile visibility
    siteTile.style.display = 'none';
    assetTile.style.display = 'none';
    addSiteFieldBtn.style.display = 'flex';
    addAssetFieldBtn.style.display = 'flex';
    
    // Reset asset selector
    const assetSelectorContainer = document.getElementById('assetSelectorContainer');
    if (assetSelectorContainer) {
        assetSelectorContainer.style.display = 'none';
        resetAssetSelections();
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    console.log('Side panel closed');
}

function handleCreateQRCode() {
    const nameInput = document.getElementById('qrCodeName');
    const preFillCategory = document.getElementById('preFillCategory');
    const preFillAsset = document.getElementById('preFillAsset');
    
    const qrcodeName = nameInput.value.trim();
    
    if (!qrcodeName) {
        alert('Please enter a QR code name');
        nameInput.focus();
        return;
    }
    
    // Get selected assets
    let selectedAssets = [];
    if (preFillAsset && preFillAsset.checked) {
        const checkedBoxes = document.querySelectorAll('.asset-checkbox:checked');
        selectedAssets = Array.from(checkedBoxes).map(checkbox => {
            return {
                value: checkbox.closest('.asset-option').dataset.value,
                label: checkbox.nextElementSibling.textContent
            };
        });
    }
    
    // Create the QR code
    const qrcodeData = {
        name: qrcodeName,
        preFillCategory: preFillCategory.checked,
        preFillAsset: preFillAsset ? preFillAsset.checked : false,
        selectedAssets: selectedAssets
    };
    
    createQRCodeFromPanel(qrcodeData);
    closeSidePanel();
}

function createQRCodeFromPanel(data) {
    const tbody = document.getElementById('qrCodesTableBody');
    const newId = `qrcode-${Date.now()}`;
    
    // Create new row HTML
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Generate asset display HTML
    const assetDisplayHTML = generateAssetDisplayHTML(data.selectedAssets);
    
    const newRowHTML = `
        <tr class="qrcode-row" data-id="${newId}">
            <td class="qrcode-name">
                <div class="qrcode-info">
                    <span class="qrcode-icon">📱</span>
                    <span class="qrcode-title">${data.name}</span>
                </div>
            </td>
            <td class="qrcode-created">${formattedDate}</td>
            <td class="qrcode-site"></td>
            <td class="qrcode-asset">${assetDisplayHTML}</td>
            <td class="qrcode-category"></td>
            <td class="qrcode-actions">
                <button class="action-menu-btn" data-id="${newId}">⋯</button>
            </td>
        </tr>
    `;
    
    // Add to table (at the top since it's newest)
    tbody.insertAdjacentHTML('afterbegin', newRowHTML);
    
    // Re-initialize actions for the new row
    initializeQRCodeActions();
    updateEmptyState();
    
    console.log(`New QR code created: ${data.name} with ${data.selectedAssets.length} assets`);
    
    // Scroll to new QR code and highlight it
    const newRow = document.querySelector(`[data-id="${newId}"]`);
    if (newRow) {
        newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        newRow.style.backgroundColor = '#e8f4fd';
        setTimeout(() => {
            newRow.style.backgroundColor = '';
        }, 2000);
    }
}

function initializeSidePanelFeatures() {
    const addSiteFieldBtn = document.getElementById('addSiteFieldBtn');
    const addAssetFieldBtn = document.getElementById('addAssetFieldBtn');
    const preFillCategoryToggle = document.getElementById('preFillCategory');
    const preFillSiteToggle = document.getElementById('preFillSite');
    const preFillAssetToggle = document.getElementById('preFillAsset');
    const infoButtons = document.querySelectorAll('.info-btn');
    
    // Add site field functionality
    addSiteFieldBtn.addEventListener('click', function() {
        console.log('Add site field clicked');
        showSiteTile();
    });
    
    // Add asset field functionality
    addAssetFieldBtn.addEventListener('click', function() {
        console.log('Add asset field clicked');
        showAssetTile();
    });
    
    // Pre-fill toggle functionality for category
    preFillCategoryToggle.addEventListener('change', function() {
        console.log('Pre-fill category:', this.checked);
        // This would show/hide category selection
    });
    
    // Pre-fill toggle functionality for site
    if (preFillSiteToggle) {
        preFillSiteToggle.addEventListener('change', function() {
            console.log('Pre-fill site:', this.checked);
            // This would show/hide site selection
        });
    }
    
    // Pre-fill toggle functionality for asset
    if (preFillAssetToggle) {
        preFillAssetToggle.addEventListener('change', function() {
            console.log('Pre-fill asset:', this.checked);
            toggleAssetSelector(this.checked);
        });
    }
    
    // Initialize asset multi-select functionality
    initializeAssetMultiSelect();
    
    // Info button functionality
    infoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tile = this.closest('.field-tile');
            let fieldType = 'category';
            
            if (tile.id === 'siteTile') {
                fieldType = 'site';
            } else if (tile.id === 'assetTile') {
                fieldType = 'asset';
            }
            
            const pluralType = fieldType === 'category' ? 'categories' : fieldType === 'site' ? 'sites' : 'assets';
            
            alert(`Pre-fill information:\n\nWhen enabled, the ${fieldType} will be automatically selected when users scan this QR code. When disabled, users will be able to choose from all available ${pluralType}.`);
        });
    });
    
    // Escape key to close panel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidePanel = document.getElementById('createQRPanel');
            if (sidePanel.classList.contains('show')) {
                closeSidePanel();
            }
        }
    });
}

function showSiteTile() {
    const siteTile = document.getElementById('siteTile');
    const addSiteFieldBtn = document.getElementById('addSiteFieldBtn');
    
    // Show the site tile
    siteTile.style.display = 'block';
    
    // Hide the "Add site field" button
    addSiteFieldBtn.style.display = 'none';
    
    // Add a smooth animation
    siteTile.style.opacity = '0';
    siteTile.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        siteTile.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        siteTile.style.opacity = '1';
        siteTile.style.transform = 'translateY(0)';
    }, 10);
    
    console.log('Site tile shown');
}

function showAssetTile() {
    const assetTile = document.getElementById('assetTile');
    const addAssetFieldBtn = document.getElementById('addAssetFieldBtn');
    
    // Show the asset tile
    assetTile.style.display = 'block';
    
    // Hide the "Add asset field" button
    addAssetFieldBtn.style.display = 'none';
    
    // Add a smooth animation
    assetTile.style.opacity = '0';
    assetTile.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        assetTile.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        assetTile.style.opacity = '1';
        assetTile.style.transform = 'translateY(0)';
    }, 10);
    
    console.log('Asset tile shown');
}

function toggleAssetSelector(show) {
    const selectorContainer = document.getElementById('assetSelectorContainer');
    
    if (show) {
        // Show the selector with animation
        selectorContainer.style.display = 'block';
        selectorContainer.style.opacity = '0';
        selectorContainer.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            selectorContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            selectorContainer.style.opacity = '1';
            selectorContainer.style.transform = 'translateY(0)';
        }, 10);
        
        console.log('Asset selector shown');
    } else {
        // Hide the selector with animation
        selectorContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        selectorContainer.style.opacity = '0';
        selectorContainer.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            selectorContainer.style.display = 'none';
            // Reset all selections
            resetAssetSelections();
        }, 300);
        
        console.log('Asset selector hidden');
    }
}

function initializeAssetMultiSelect() {
    const searchInput = document.getElementById('assetSearchInput');
    const assetCheckboxes = document.querySelectorAll('.asset-checkbox');
    
    // Initialize search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterAssetOptions(this.value);
        });
    }
    
    // Initialize checkbox functionality
    assetCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedAssets();
        });
    });
}

function filterAssetOptions(searchTerm) {
    const assetOptions = document.querySelectorAll('.asset-option');
    const assetOptionsContainer = document.getElementById('assetOptions');
    let visibleCount = 0;
    
    searchTerm = searchTerm.toLowerCase().trim();
    
    assetOptions.forEach(option => {
        const label = option.querySelector('label').textContent.toLowerCase();
        const isVisible = label.includes(searchTerm);
        
        if (isVisible) {
            option.classList.remove('hidden');
            visibleCount++;
        } else {
            option.classList.add('hidden');
        }
    });
    
    // Show/hide no results message
    let noResultsMsg = assetOptionsContainer.querySelector('.no-results');
    if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.textContent = 'No assets found';
            assetOptionsContainer.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

function updateSelectedAssets() {
    const selectedAssetsContainer = document.getElementById('selectedAssets');
    const selectedAssetsList = document.getElementById('selectedAssetsList');
    const checkedBoxes = document.querySelectorAll('.asset-checkbox:checked');
    
    // Clear existing tags
    selectedAssetsList.innerHTML = '';
    
    if (checkedBoxes.length > 0) {
        selectedAssetsContainer.style.display = 'block';
        
        checkedBoxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent;
            const value = checkbox.closest('.asset-option').dataset.value;
            
            const tag = document.createElement('div');
            tag.className = 'selected-asset-tag';
            tag.innerHTML = `
                <span>${label}</span>
                <button type="button" class="remove-asset-btn" data-value="${value}">×</button>
            `;
            
            selectedAssetsList.appendChild(tag);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = selectedAssetsList.querySelectorAll('.remove-asset-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const value = this.dataset.value;
                const checkbox = document.querySelector(`#asset-${value}`);
                if (checkbox) {
                    checkbox.checked = false;
                    updateSelectedAssets();
                }
            });
        });
    } else {
        selectedAssetsContainer.style.display = 'none';
    }
    
    console.log(`Selected assets: ${checkedBoxes.length}`);
}

function resetAssetSelections() {
    // Uncheck all checkboxes
    const assetCheckboxes = document.querySelectorAll('.asset-checkbox');
    assetCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear search
    const searchInput = document.getElementById('assetSearchInput');
    if (searchInput) {
        searchInput.value = '';
        filterAssetOptions('');
    }
    
    // Hide selected assets
    const selectedAssetsContainer = document.getElementById('selectedAssets');
    if (selectedAssetsContainer) {
        selectedAssetsContainer.style.display = 'none';
    }
    
    console.log('Asset selections reset');
}

function generateAssetDisplayHTML(selectedAssets) {
    if (!selectedAssets || selectedAssets.length === 0) {
        return '';
    }
    
    const maxVisible = 2; // Show max 2 assets directly
    
    if (selectedAssets.length === 1) {
        // Single asset - show as simple tag
        return `<span class="asset-tag">${selectedAssets[0].label}</span>`;
    } else if (selectedAssets.length <= maxVisible) {
        // 2 assets - show both tags
        return selectedAssets.map(asset => 
            `<span class="asset-tag">${asset.label}</span>`
        ).join(' ');
    } else {
        // More than 2 assets - show first asset + count
        const firstAsset = selectedAssets[0];
        const remainingCount = selectedAssets.length - 1;
        
        const tooltip = selectedAssets.map(asset => asset.label).join('\n');
        
        return `
            <div class="asset-display-group" title="${tooltip}">
                <span class="asset-tag">${firstAsset.label}</span>
                <span class="asset-count-badge" onclick="showAssetTooltip(event, '${selectedAssets.map(a => a.label).join('|')}')">
                    +${remainingCount}
                </span>
            </div>
        `;
    }
}

function createNewQRCode() {
    const qrcodeName = prompt('Enter QR code name:');
    if (!qrcodeName || !qrcodeName.trim()) return;
    
    const category = prompt('Enter category (optional):') || '';
    const site = prompt('Enter site (optional):') || '';
    
    const tbody = document.getElementById('qrCodesTableBody');
    const newId = `qrcode-${Date.now()}`;
    
    // Create new row HTML
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const categoryTag = category ? `<span class="category-tag">${category}</span>` : '';
    
    const newRowHTML = `
        <tr class="qrcode-row" data-id="${newId}">
            <td class="qrcode-name">
                <div class="qrcode-info">
                    <span class="qrcode-icon">📱</span>
                    <span class="qrcode-title">${qrcodeName.trim()}</span>
                </div>
            </td>
            <td class="qrcode-created">${formattedDate}</td>
            <td class="qrcode-site">${site}</td>
            <td class="qrcode-asset"></td>
            <td class="qrcode-category">${categoryTag}</td>
            <td class="qrcode-actions">
                <button class="action-menu-btn" data-id="${newId}">⋯</button>
            </td>
        </tr>
    `;
    
    // Add to table (at the top since it's newest)
    tbody.insertAdjacentHTML('afterbegin', newRowHTML);
    
    // Re-initialize actions for the new row
    initializeQRCodeActions();
    updateEmptyState();
    
    console.log(`New QR code created: ${qrcodeName}`);
    
    // Scroll to new QR code
    const newRow = document.querySelector(`[data-id="${newId}"]`);
    if (newRow) {
        newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        newRow.style.backgroundColor = '#e8f4fd';
        setTimeout(() => {
            newRow.style.backgroundColor = '';
        }, 2000);
    }
}

function initializeFilters() {
    const addFilterBtn = document.getElementById('addFilterBtn');
    
    addFilterBtn.addEventListener('click', function() {
        console.log('Add filter clicked');
        showFilterOptions();
    });
}

function showFilterOptions() {
    // Simple filter simulation
    const filters = ['Category', 'Site', 'Created Date', 'Status'];
    const filter = prompt(`Add filter by:\n${filters.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nEnter choice (1-${filters.length}):`);
    
    if (filter && filter >= 1 && filter <= filters.length) {
        const selectedFilter = filters[filter - 1];
        applyFilter(selectedFilter);
    }
}

function applyFilter(filterType) {
    console.log(`Applying filter: ${filterType}`);
    
    // This would typically open a filter dropdown or modal
    // For now, just log the action
    alert(`Filter by ${filterType} would be applied here.\n\nThis would show a dropdown with available ${filterType.toLowerCase()} options.`);
}

function updateEmptyState(forceEmpty = false) {
    const tbody = document.getElementById('qrCodesTableBody');
    const emptyState = document.getElementById('emptyState');
    const table = document.querySelector('.qrcodes-table');
    
    const visibleRows = tbody.querySelectorAll('.qrcode-row:not([style*="display: none"])');
    const isEmpty = visibleRows.length === 0 || forceEmpty;
    
    if (isEmpty) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        table.style.display = 'block';
        emptyState.style.display = 'none';
    }
}

// Navigation functionality
function initializeNavigation() {
    // Handle tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.textContent.trim();
            
            switch (text) {
                case 'Issues':
                    window.location.href = 'index.html';
                    break;
                case 'Categories':
                    window.location.href = 'categories.html';
                    break;
                case 'QR codes':
                    // Already on QR codes page
                    break;
            }
        });
    });
}

// Initialize navigation when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

function showAssetTooltip(event, assetList) {
    event.stopPropagation();
    
    const assets = assetList.split('|');
    const tooltipText = `All selected assets:\n${assets.join('\n')}`;
    
    // Simple alert for now - could be enhanced with a proper tooltip
    alert(tooltipText);
}

// Export functions for potential use by other scripts
window.QRCodesPage = {
    createNewQRCode,
    editQRCode,
    deleteQRCode,
    duplicateQRCode,
    viewQRCode,
    downloadQRCode,
    updateEmptyState,
    generateAssetDisplayHTML,
    showAssetTooltip
};
