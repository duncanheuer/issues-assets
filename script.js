// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const navLinks = document.querySelectorAll('.nav-link');
const filterTabs = document.querySelectorAll('.filter-tab');
const filterTabAdd = document.querySelector('.filter-tab-add');
const reportIssueBtn = document.querySelector('.report-issue-btn');
const addFilterBtn = document.querySelector('.add-filter-btn');
const searchInput = document.querySelector('.search-input');
const sortBtn = document.querySelector('.sort-btn');
const issueRows = document.querySelectorAll('.issue-row');
const actionBtns = document.querySelectorAll('.action-btn');
const chatBtn = document.querySelector('.chat-btn');

// Navigation functionality
navItems.forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        // Add active class to clicked item
        this.classList.add('active');
        
        console.log(`Navigated to: ${this.textContent}`);
    });
});

// Sidebar navigation
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all nav links
        navLinks.forEach(nav => nav.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        const linkText = this.querySelector('.nav-text').textContent;
        console.log(`Sidebar navigation: ${linkText}`);
    });
});

// Filter tabs functionality
filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all filter tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        console.log(`Filter applied: ${this.textContent}`);
    });
});

// Add filter tab functionality
filterTabAdd.addEventListener('click', function() {
    // Create a default new filter
    const newFilterName = `Filter ${document.querySelectorAll('.filter-tab').length + 1}`;
    const newTab = document.createElement('button');
    newTab.className = 'filter-tab';
    newTab.textContent = newFilterName;
    
    // Add click functionality to new tab
    newTab.addEventListener('click', function() {
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        console.log(`Filter applied: ${this.textContent}`);
    });
    
    this.parentNode.insertBefore(newTab, this);
    console.log(`Added new filter: ${newFilterName}`);
});

// Report Issue button
reportIssueBtn.addEventListener('click', function() {
    console.log('Report Issue clicked');
    window.location.href = 'report-issue.html';
});

// Add Filter button
addFilterBtn.addEventListener('click', function() {
    console.log('Add Filter clicked');
});

// Search functionality
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    console.log(`Searching for: ${searchTerm}`);
    
    // Filter table rows based on search term
    issueRows.forEach(row => {
        const issueTitle = row.querySelector('.issue-title').textContent.toLowerCase();
        const issueId = row.querySelector('.issue-id').textContent.toLowerCase();
        
        if (issueTitle.includes(searchTerm) || issueId.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = searchTerm ? 'none' : '';
        }
    });
    
    // Update results count
    const visibleRows = Array.from(issueRows).filter(row => row.style.display !== 'none');
    document.querySelector('.results-info span').textContent = `${visibleRows.length} results`;
});

// Sort functionality
sortBtn.addEventListener('click', function() {
    console.log('Sort button clicked');
});

// Issue row clicks
issueRows.forEach(row => {
    row.addEventListener('click', function(e) {
        // Don't trigger if clicking on action button
        if (e.target.classList.contains('action-btn')) return;
        
        const issueId = this.dataset.id;
        const issueTitle = this.querySelector('.issue-title').textContent;
        
        console.log(`Issue clicked: ${issueId} - ${issueTitle}`);
        
        // Navigate to issue profile
        window.location.href = `issue-profile.html?id=${issueId}`;
    });
});

// Action button clicks
actionBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent row click
        
        const row = this.closest('.issue-row');
        const issueId = row.dataset.id;
        
        console.log(`Action menu for issue: ${issueId}`);
    });
});

// Chat button
chatBtn.addEventListener('click', function() {
    console.log('Chat button clicked');
});

// Table header sorting
const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const columnName = this.textContent.replace('⬇️', '').trim();
        console.log(`Sorting by column: ${columnName}`);
        
        // Add visual feedback
        tableHeaders.forEach(h => h.classList.remove('sorted'));
        this.classList.add('sorted');
    });
});

// Issue ID clicks (for direct navigation)
const issueIds = document.querySelectorAll('.issue-id');
issueIds.forEach(id => {
    id.addEventListener('click', function(e) {
        e.stopPropagation();
        const issueId = this.textContent;
        console.log(`Direct navigation to issue: ${issueId}`);
    });
});

// Category tag clicks
const categoryTags = document.querySelectorAll('.category-tag');
categoryTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.stopPropagation();
        const category = this.textContent;
        console.log(`Filter by category: ${category}`);
    });
});

// Status tag clicks
const statusTags = document.querySelectorAll('.status-tag');
statusTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
        e.stopPropagation();
        const status = this.textContent;
        console.log(`Filter by status: ${status}`);
    });
});

// Site links
const siteLinks = document.querySelectorAll('.site');
siteLinks.forEach(link => {
    if (link.textContent.trim()) {
        link.style.color = '#007aff';
        link.style.cursor = 'pointer';
        
        link.addEventListener('click', function(e) {
            e.stopPropagation();
            const site = this.textContent;
            console.log(`Navigate to site: ${site}`);
        });
    }
});


// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        console.log('Search focused (Ctrl/Cmd + K)');
    }
    
    // Escape to clear search
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
        console.log('Search cleared');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Issues Management Interface Loaded');
    
    // Column Settings functionality
    const columnSettingsBtn = document.getElementById('columnSettingsBtn');
    const columnSettingsDropdown = document.getElementById('columnSettingsDropdown');

    columnSettingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        columnSettingsDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.column-settings')) {
            columnSettingsDropdown.classList.remove('show');
        }
    });

    // Handle column visibility changes
    const columnCheckboxes = document.querySelectorAll('.column-setting-item input[type="checkbox"]');
    columnCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const columnName = this.dataset.column;
            const isVisible = this.checked;
            toggleColumnVisibility(columnName, isVisible);
            
            // Save preference to localStorage
            saveColumnPreferences();
        });
    });

    function toggleColumnVisibility(columnName, isVisible) {
        // Map column names to table indices
        const columnMap = {
            'unique-id': 0,
            'issue': 1,
            'category': 2,
            'status': 3,
            'priority': 4,
            'modified-date': 5,
            'assigned-to': 6,
            'site': 7,
            'assets': 8,
            'creation-date': -1, // Not currently in table
            'due-date': -1, // Not currently in table
            'date-occurred': -1, // Not currently in table
            'creator': -1, // Not currently in table
            'open-inspections': -1, // Not currently in table
            'open-actions': -1 // Not currently in table
        };
        
        const columnIndex = columnMap[columnName];
        if (columnIndex === undefined || columnIndex === -1) return;
        
        // Toggle header visibility
        const headerCells = document.querySelectorAll('thead th');
        if (headerCells[columnIndex]) {
            headerCells[columnIndex].classList.toggle('table-column-hidden', !isVisible);
        }
        
        // Toggle body cell visibility
        const bodyCells = document.querySelectorAll(`tbody td:nth-child(${columnIndex + 1})`);
        bodyCells.forEach(cell => {
            cell.classList.toggle('table-column-hidden', !isVisible);
        });
    }

    function saveColumnPreferences() {
        const preferences = {};
        columnCheckboxes.forEach(checkbox => {
            preferences[checkbox.dataset.column] = checkbox.checked;
        });
        localStorage.setItem('columnPreferences', JSON.stringify(preferences));
    }

    function loadColumnPreferences() {
        const savedPreferences = localStorage.getItem('columnPreferences');
        if (savedPreferences) {
            const preferences = JSON.parse(savedPreferences);
            
            columnCheckboxes.forEach(checkbox => {
                const columnName = checkbox.dataset.column;
                if (preferences.hasOwnProperty(columnName)) {
                    checkbox.checked = preferences[columnName];
                    toggleColumnVisibility(columnName, preferences[columnName]);
                }
            });
        }
    }

    // Load saved preferences on page load
    loadColumnPreferences();
});

// Simulate real-time updates
setInterval(() => {
    const randomRow = issueRows[Math.floor(Math.random() * issueRows.length)];
    if (randomRow && Math.random() < 0.1) { // 10% chance every 5 seconds
        const modifiedDate = randomRow.querySelector('.modified-date');
        if (modifiedDate) {
            modifiedDate.textContent = 'Just now';
            modifiedDate.style.color = '#007aff';
            setTimeout(() => {
                modifiedDate.style.color = '#666';
            }, 2000);
        }
    }
}, 5000);

console.log('Issues page loaded');
