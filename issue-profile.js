// Issue Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get issue ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');
    
    // Load issue data
    loadIssueData(issueId);
    
    // Initialize tab functionality
    initializeTabs();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize linked assets functionality
    initializeLinkedAssets();
    
    // Initialize activity functionality
    initializeActivity();
});

function loadIssueData(issueId) {
    // Try to get data from localStorage first (for newly created issues)
    let issueData = JSON.parse(localStorage.getItem('currentIssue'));
    
    // If not found, use sample data based on issue ID
    if (!issueData || issueData.id !== issueId) {
        issueData = getSampleIssueData(issueId);
    }
    
    // Populate the page with issue data
    populateIssueData(issueData);
}

function getSampleIssueData(issueId) {
    // Sample data for existing issues
    const sampleIssues = {
        'IS-1': {
            id: 'IS-1',
            title: 'Car is broken',
            description: 'The company vehicle has mechanical issues and needs immediate attention.',
            category: 'observation',
            priority: 'medium',
            site: 'Bondi Beach',
            assignedTo: '',
            assets: [
                { value: 'vehicle-001', label: 'Vehicle 001 - Toyota Hilux' }
            ],
            status: 'open',
            dateCreated: '2022-07-27T15:14:00Z',
            createdBy: 'Duncan Heuer',
            location: '19 Comber St, Paddington NSW 2021, Australia'
        },
        'IS-2': {
            id: 'IS-2',
            title: 'Signing on',
            description: 'Site sign-on process completed.',
            category: 'site-sign-on',
            priority: 'low',
            site: 'Bondi Beach',
            assignedTo: '',
            assets: [],
            status: 'resolved',
            dateCreated: '2022-07-27T15:14:00Z',
            createdBy: 'Duncan Heuer',
            location: 'Bondi Beach, NSW, Australia'
        }
    };
    
    return sampleIssues[issueId] || sampleIssues['IS-1'];
}

function populateIssueData(data) {
    // Update page title and header
    document.title = `${data.id} - ${data.title}`;
    document.getElementById('issueTitleBreadcrumb').textContent = data.title;
    document.getElementById('issueIdHeader').textContent = data.id;
    document.getElementById('issueTitleHeader').textContent = data.title;
    
    // Update status
    const statusTag = document.getElementById('issueStatusTag');
    statusTag.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
    statusTag.className = `status-tag ${data.status}`;
    
    // Update description
    document.getElementById('issueDescription').value = data.description || '';
    
    // Update category
    const categoryTag = document.getElementById('issueCategoryTag');
    categoryTag.textContent = getCategoryDisplayName(data.category);
    categoryTag.className = `category-tag ${data.category}`;
    
    // Update site
    document.getElementById('issueSite').textContent = data.site || 'No site assigned';
    
    // Update linked assets
    updateLinkedAssetsDisplay(data.assets || []);
    
    // Update priority
    document.getElementById('issuePriority').textContent = data.priority ? 
        data.priority.charAt(0).toUpperCase() + data.priority.slice(1) : 'None';
    
    // Update dates
    const dateOccurred = new Date(data.dateCreated);
    document.getElementById('dateOccurred').innerHTML = 
        `📅 ${dateOccurred.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    
    // Update created by
    document.getElementById('createdBy').textContent = 
        `Created by ${data.createdBy} • ${dateOccurred.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    
    // Update location
    document.getElementById('locationAddress').textContent = 
        data.location || '19 Comber St, Paddington NSW 2021, Australia';
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'car-crash': 'Car Crash',
        'hazard': 'Hazard',
        'observation': 'Observation',
        'site-sign-off': 'Site Sign Off',
        'site-sign-on': 'Site Sign On',
        'equipment-failure': 'Equipment Failure',
        'safety-concern': 'Safety Concern',
        'maintenance': 'Maintenance',
        'other': 'Other'
    };
    
    return categoryNames[category] || category;
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            document.getElementById(`${targetTab}-panel`).classList.add('active');
        });
    });
}

function initializeInteractiveElements() {
    // Add assignee button
    document.getElementById('addAssigneeBtn').addEventListener('click', function() {
        // Simulate assignee selection
        this.style.display = 'none';
        const assigneeSpan = document.createElement('span');
        assigneeSpan.textContent = 'Duncan Heuer';
        assigneeSpan.className = 'assignee-name';
        this.parentNode.appendChild(assigneeSpan);
    });
    
    // Add due date button
    document.getElementById('addDueDateBtn').addEventListener('click', function() {
        // Simulate due date selection
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // 7 days from now
        
        this.style.display = 'none';
        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = `📅 ${dueDate.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric'
        })}`;
        dueDateSpan.className = 'due-date';
        this.parentNode.appendChild(dueDateSpan);
    });
    
    // Start inspection button
    document.querySelector('.start-inspection-btn').addEventListener('click', function() {
        console.log('Starting inspection...');
        // Simulate starting inspection
        alert('Inspection started! This would open the inspection interface.');
    });
    
    // Edit location button
    document.querySelector('.edit-location-btn').addEventListener('click', function() {
        console.log('Editing location...');
        // Simulate location editing
        const newLocation = prompt('Enter new location:', document.getElementById('locationAddress').textContent);
        if (newLocation) {
            document.getElementById('locationAddress').textContent = newLocation;
        }
    });
    
    // Description auto-save simulation
    const descriptionInput = document.getElementById('issueDescription');
    let saveTimeout;
    
    descriptionInput.addEventListener('input', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            console.log('Auto-saving description...');
            // Simulate auto-save
        }, 1000);
    });
}

function initializeLinkedAssets() {
    let linkedAssets = [];
    
    // Load initial assets from issue data
    const currentIssue = JSON.parse(localStorage.getItem('currentIssue'));
    if (currentIssue && currentIssue.assets) {
        linkedAssets = currentIssue.assets;
        updateLinkedAssetsDisplay(linkedAssets);
    }
    
    // Add asset button functionality
    document.getElementById('addAssetBtn').addEventListener('click', function() {
        showAssetSelector(linkedAssets);
    });
    
    // Global function to remove asset
    window.removeLinkedAsset = function(assetValue) {
        const removedAsset = linkedAssets.find(asset => asset.value === assetValue);
        linkedAssets = linkedAssets.filter(asset => asset.value !== assetValue);
        updateLinkedAssetsDisplay(linkedAssets);
        
        // Track the asset unlinking activity
        if (removedAsset) {
            trackAssetUnlinked(removedAsset);
        }
    };
}

function updateLinkedAssetsDisplay(assets) {
    const container = document.getElementById('linkedAssets');
    
    if (assets.length === 0) {
        container.innerHTML = ''; // Empty when no assets
    } else {
        const assetsHtml = assets.map(asset => 
            `<div class="asset-tag">
                ${asset.label}
                <button type="button" class="remove-asset-tag" onclick="removeLinkedAsset('${asset.value}')">×</button>
            </div>`
        ).join('');
        
        container.innerHTML = assetsHtml;
    }
}

function showAssetSelector(currentAssets) {
    const modal = document.getElementById('assetModalOverlay');
    const searchInput = document.getElementById('assetModalSearch');
    const assetList = document.getElementById('assetModalList');
    const selectedCount = document.getElementById('selectedCount');
    const confirmBtn = document.getElementById('confirmAssetSelection');
    
    // Available assets with categories
    const availableAssets = [
        { value: 'vehicle-001', label: 'Vehicle 001 - Toyota Hilux', category: 'Vehicles' },
        { value: 'vehicle-002', label: 'Vehicle 002 - Ford Ranger', category: 'Vehicles' },
        { value: 'vehicle-003', label: 'Vehicle 003 - Isuzu D-Max', category: 'Vehicles' },
        { value: 'equipment-drill-01', label: 'Equipment - Drill 01', category: 'Equipment' },
        { value: 'equipment-crane-a1', label: 'Equipment - Crane A1', category: 'Equipment' },
        { value: 'equipment-generator-01', label: 'Equipment - Generator 01', category: 'Equipment' },
        { value: 'building-main', label: 'Building - Main Office', category: 'Buildings' },
        { value: 'building-warehouse', label: 'Building - Warehouse', category: 'Buildings' },
        { value: 'building-workshop', label: 'Building - Workshop', category: 'Buildings' },
        { value: 'machinery-excavator', label: 'Machinery - Excavator', category: 'Machinery' },
        { value: 'machinery-forklift', label: 'Machinery - Forklift', category: 'Machinery' },
        { value: 'machinery-bulldozer', label: 'Machinery - Bulldozer', category: 'Machinery' },
        { value: 'safety-equipment', label: 'Safety Equipment - PPE Kit', category: 'Safety' },
        { value: 'safety-harness', label: 'Safety Equipment - Harness Set', category: 'Safety' },
        { value: 'tools-power-01', label: 'Tools - Power Tool Set 01', category: 'Tools' },
        { value: 'tools-hand-01', label: 'Tools - Hand Tool Kit 01', category: 'Tools' }
    ];
    
    let selectedAssets = [];
    let filteredAssets = availableAssets;
    
    // Show modal
    modal.classList.add('show');
    searchInput.focus();
    
    // Render asset list
    function renderAssetList(assets) {
        if (assets.length === 0) {
            assetList.innerHTML = '<div class="no-results">No assets found matching your search.</div>';
            return;
        }
        
        assetList.innerHTML = assets.map(asset => {
            const isAlreadyLinked = currentAssets.find(linked => linked.value === asset.value);
            const isSelected = selectedAssets.find(selected => selected.value === asset.value);
            
            return `
                <button class="asset-option ${isSelected ? 'selected' : ''}" 
                        data-value="${asset.value}" 
                        ${isAlreadyLinked ? 'disabled' : ''}>
                    <div class="asset-checkbox"></div>
                    <div class="asset-info">
                        <div class="asset-name">${asset.label}${isAlreadyLinked ? ' (Already linked)' : ''}</div>
                        <div class="asset-category">${asset.category}</div>
                    </div>
                </button>
            `;
        }).join('');
        
        // Add click handlers
        assetList.querySelectorAll('.asset-option:not([disabled])').forEach(option => {
            option.addEventListener('click', function() {
                const value = this.dataset.value;
                const asset = availableAssets.find(a => a.value === value);
                
                if (this.classList.contains('selected')) {
                    // Deselect
                    selectedAssets = selectedAssets.filter(a => a.value !== value);
                    this.classList.remove('selected');
                } else {
                    // Select
                    selectedAssets.push(asset);
                    this.classList.add('selected');
                }
                
                updateSelectedCount();
            });
        });
    }
    
    function updateSelectedCount() {
        const count = selectedAssets.length;
        selectedCount.textContent = `${count} asset${count !== 1 ? 's' : ''} selected`;
        confirmBtn.disabled = count === 0;
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filteredAssets = availableAssets.filter(asset => 
            asset.label.toLowerCase().includes(searchTerm) ||
            asset.category.toLowerCase().includes(searchTerm)
        );
        renderAssetList(filteredAssets);
    });
    
    // Initial render
    renderAssetList(filteredAssets);
    updateSelectedCount();
    
    // Modal close handlers
    function closeModal() {
        modal.classList.remove('show');
        selectedAssets = [];
        searchInput.value = '';
        filteredAssets = availableAssets;
    }
    
    document.getElementById('closeAssetModal').onclick = closeModal;
    document.getElementById('cancelAssetSelection').onclick = closeModal;
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Confirm selection
    document.getElementById('confirmAssetSelection').onclick = function() {
        if (selectedAssets.length > 0) {
            // Add selected assets to current assets and track activity
            selectedAssets.forEach(asset => {
                if (!currentAssets.find(existing => existing.value === asset.value)) {
                    currentAssets.push(asset);
                    // Track the asset linking activity
                    trackAssetLinked(asset);
                }
            });
            
            updateLinkedAssetsDisplay(currentAssets);
            
            // Update localStorage
            const currentIssue = JSON.parse(localStorage.getItem('currentIssue'));
            if (currentIssue) {
                currentIssue.assets = currentAssets;
                localStorage.setItem('currentIssue', JSON.stringify(currentIssue));
            }
        }
        
        closeModal();
    };
}

function initializeActivity() {
    // Initialize activity filter tabs
    const filterBtns = document.querySelectorAll('.activity-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterActivityItems(filter);
        });
    });
    
    // Initialize update input
    const updateInput = document.getElementById('updateInput');
    const sendBtn = document.getElementById('sendUpdateBtn');
    
    updateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            addUserUpdate(this.value.trim());
            this.value = '';
        }
    });
    
    sendBtn.addEventListener('click', function() {
        const message = updateInput.value.trim();
        if (message) {
            addUserUpdate(message);
            updateInput.value = '';
        }
    });
    
    // Load and display activity
    loadActivityHistory();
}

function loadActivityHistory() {
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');
    
    // Get stored activity or create initial activity
    let activity = JSON.parse(localStorage.getItem(`activity_${issueId}`)) || [];
    
    // If no activity exists, create initial activity based on issue data
    if (activity.length === 0) {
        const currentIssue = JSON.parse(localStorage.getItem('currentIssue'));
        const issueData = currentIssue || getSampleIssueData(issueId);
        
        activity = [
            {
                id: 1,
                type: 'system',
                user: 'Duncan Heuer',
                action: 'reported an issue',
                timestamp: issueData.dateCreated || '2022-07-27T15:14:00Z',
                details: {
                    category: issueData.category || 'observation'
                }
            },
            {
                id: 2,
                type: 'system',
                user: 'Duncan Heuer',
                action: 'updated the site to',
                timestamp: '2022-07-27T15:14:00Z',
                details: {
                    site: issueData.site || 'Bondi Beach'
                }
            }
        ];
        
        // Add asset linking activity if assets exist
        if (issueData.assets && issueData.assets.length > 0) {
            issueData.assets.forEach((asset, index) => {
                activity.push({
                    id: activity.length + 1,
                    type: 'asset-change',
                    user: 'Duncan Heuer',
                    action: 'linked asset',
                    timestamp: '2022-07-27T15:15:00Z',
                    details: {
                        asset: asset.label,
                        assetValue: asset.value
                    }
                });
            });
        }
        
        localStorage.setItem(`activity_${issueId}`, JSON.stringify(activity));
    }
    
    renderActivityTimeline(activity);
}

function renderActivityTimeline(activities) {
    const timeline = document.getElementById('activityTimeline');
    
    if (activities.length === 0) {
        timeline.innerHTML = '<div class="no-activity">No activity yet</div>';
        return;
    }
    
    // Sort activities by timestamp (newest first)
    const sortedActivities = activities.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    timeline.innerHTML = sortedActivities.map(activity => {
        const date = new Date(activity.timestamp);
        const timeString = date.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let detailsHtml = '';
        if (activity.details) {
            if (activity.details.category) {
                detailsHtml = `<div class="activity-details">
                    <span class="activity-tag ${activity.details.category}">${getCategoryDisplayName(activity.details.category)}</span>
                </div>`;
            } else if (activity.details.site) {
                detailsHtml = `<div class="activity-details">
                    <span class="activity-tag site">📍 ${activity.details.site}</span>
                </div>`;
            } else if (activity.details.asset) {
                detailsHtml = `<div class="activity-details">
                    <span class="activity-tag asset">🔗 ${activity.details.asset}</span>
                </div>`;
            }
        }
        
        const userInitials = activity.user.split(' ').map(n => n[0]).join('');
        
        return `
            <div class="activity-item ${activity.type}" data-type="${activity.type}">
                <div class="activity-avatar">${userInitials}</div>
                <div class="activity-content">
                    <div class="activity-header">
                        <span class="activity-user">${activity.user}</span>
                        <span class="activity-action">${activity.action}</span>
                    </div>
                    <div class="activity-timestamp">${timeString}</div>
                    ${detailsHtml}
                </div>
            </div>
        `;
    }).join('');
}

function filterActivityItems(filter) {
    const items = document.querySelectorAll('.activity-item');
    
    items.forEach(item => {
        const type = item.dataset.type;
        
        if (filter === 'all') {
            item.style.display = 'flex';
        } else if (filter === 'comments' && type === 'user') {
            item.style.display = 'flex';
        } else if (filter === 'history' && (type === 'system' || type === 'asset-change')) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function addActivityItem(type, user, action, details = null) {
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');
    
    let activity = JSON.parse(localStorage.getItem(`activity_${issueId}`)) || [];
    
    const newActivity = {
        id: activity.length + 1,
        type: type,
        user: user,
        action: action,
        timestamp: new Date().toISOString(),
        details: details
    };
    
    activity.push(newActivity);
    localStorage.setItem(`activity_${issueId}`, JSON.stringify(activity));
    
    // Re-render timeline
    renderActivityTimeline(activity);
}

function addUserUpdate(message) {
    addActivityItem('user', 'Duncan Heuer', `commented: "${message}"`);
}

function trackAssetLinked(asset) {
    addActivityItem('asset-change', 'Duncan Heuer', 'linked asset', {
        asset: asset.label,
        assetValue: asset.value
    });
}

function trackAssetUnlinked(asset) {
    addActivityItem('asset-change', 'Duncan Heuer', 'unlinked asset', {
        asset: asset.label,
        assetValue: asset.value
    });
}

// Initialize page
console.log('Issue Profile page loaded');
