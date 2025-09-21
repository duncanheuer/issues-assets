// Categories Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Categories page loaded');
    
    // Initialize categories functionality
    initializeCategoriesPage();
});

function initializeCategoriesPage() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Initialize category actions
    initializeCategoryActions();
    
    // Initialize add category button
    initializeAddCategory();
    
    // Update results count
    updateResultsCount();
}

function initializeSearch() {
    const searchInput = document.getElementById('categorySearch');
    const tableRows = document.querySelectorAll('.category-row');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let visibleCount = 0;
        
        tableRows.forEach(row => {
            const categoryName = row.querySelector('.category-name').textContent.toLowerCase();
            const categoryAccess = row.querySelector('.category-access').textContent.toLowerCase();
            const categoryNotify = row.querySelector('.category-notify').textContent.toLowerCase();
            
            const isVisible = categoryName.includes(searchTerm) || 
                            categoryAccess.includes(searchTerm) || 
                            categoryNotify.includes(searchTerm);
            
            if (isVisible) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        updateResultsCount(visibleCount);
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
            const currentDirection = this.dataset.direction || 'asc';
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
            
            // Reset all other arrows
            sortableHeaders.forEach(h => {
                if (h !== this) {
                    h.querySelector('.sort-arrow').textContent = '↕';
                    h.removeAttribute('data-direction');
                }
            });
            
            // Update current arrow
            sortArrow.textContent = newDirection === 'asc' ? '↑' : '↓';
            this.dataset.direction = newDirection;
            
            // Sort the table
            sortTable(sortType, newDirection);
        });
    });
}

function sortTable(sortType, direction) {
    const tbody = document.getElementById('categoriesTableBody');
    const rows = Array.from(tbody.querySelectorAll('.category-row'));
    
    rows.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortType) {
            case 'name':
                aValue = a.querySelector('.category-name').textContent.trim();
                bValue = b.querySelector('.category-name').textContent.trim();
                break;
            default:
                return 0;
        }
        
        const comparison = aValue.localeCompare(bValue);
        return direction === 'asc' ? comparison : -comparison;
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

function initializeCategoryActions() {
    // Edit category buttons
    const editButtons = document.querySelectorAll('.edit-category-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.dataset.id;
            const categoryName = this.closest('.category-row').querySelector('.category-name').textContent;
            editCategory(categoryId, categoryName);
        });
    });
    
    // Action menu buttons
    const actionMenuButtons = document.querySelectorAll('.action-menu-btn');
    actionMenuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const categoryId = this.closest('.category-row').dataset.id;
            showActionMenu(this, categoryId);
        });
    });
}

function editCategory(categoryId, categoryName) {
    console.log(`Editing category: ${categoryName} (ID: ${categoryId})`);
    
    // Navigate to edit category page with category data
    window.location.href = `edit-category.html?mode=edit&id=${categoryId}&name=${encodeURIComponent(categoryName)}`;
}

function showActionMenu(button, categoryId) {
    console.log(`Showing action menu for category ID: ${categoryId}`);
    
    // Simple action menu simulation
    const actions = ['Edit', 'Duplicate', 'Delete'];
    const action = prompt(`Choose action for category:\n${actions.join('\n')}\n\nEnter: edit, duplicate, or delete`);
    
    switch (action?.toLowerCase()) {
        case 'edit':
            const row = button.closest('.category-row');
            const editBtn = row.querySelector('.edit-category-btn');
            editBtn.click();
            break;
        case 'duplicate':
            duplicateCategory(categoryId);
            break;
        case 'delete':
            deleteCategory(categoryId);
            break;
        default:
            console.log('Action cancelled or invalid');
    }
}

function duplicateCategory(categoryId) {
    const originalRow = document.querySelector(`[data-id="${categoryId}"]`);
    if (!originalRow) return;
    
    const categoryName = originalRow.querySelector('.category-name').textContent;
    const newName = `${categoryName} (Copy)`;
    const newId = `${categoryId}-copy-${Date.now()}`;
    
    // Create new row
    const newRow = originalRow.cloneNode(true);
    newRow.dataset.id = newId;
    newRow.querySelector('.category-name').textContent = newName;
    newRow.querySelector('.edit-category-btn').dataset.id = newId;
    
    // Insert after original row
    originalRow.parentNode.insertBefore(newRow, originalRow.nextSibling);
    
    // Re-initialize actions for the new row
    initializeCategoryActions();
    updateResultsCount();
    
    console.log(`Category duplicated: ${categoryName} → ${newName}`);
}

function deleteCategory(categoryId) {
    const row = document.querySelector(`[data-id="${categoryId}"]`);
    if (!row) return;
    
    const categoryName = row.querySelector('.category-name').textContent;
    const confirmed = confirm(`Are you sure you want to delete the category "${categoryName}"?`);
    
    if (confirmed) {
        row.remove();
        updateResultsCount();
        console.log(`Category deleted: ${categoryName}`);
    }
}

function initializeAddCategory() {
    const addButton = document.getElementById('addCategoryBtn');
    
    addButton.addEventListener('click', function() {
        console.log('Add new category clicked');
        
        // Navigate to edit category page for creating new category
        window.location.href = 'edit-category.html?mode=add';
    });
}

function addNewCategory(categoryName) {
    const tbody = document.getElementById('categoriesTableBody');
    const newId = `category-${Date.now()}`;
    
    // Create new row HTML
    const newRowHTML = `
        <tr class="category-row" data-id="${newId}">
            <td class="category-name">${categoryName}</td>
            <td class="category-access">All users</td>
            <td class="category-notify">None</td>
            <td class="category-actions">
                <button class="edit-category-btn" data-id="${newId}">Edit category</button>
                <button class="action-menu-btn">⋯</button>
            </td>
        </tr>
    `;
    
    // Add to table
    tbody.insertAdjacentHTML('beforeend', newRowHTML);
    
    // Re-initialize actions for the new row
    initializeCategoryActions();
    updateResultsCount();
    
    console.log(`New category added: ${categoryName}`);
    
    // Scroll to new category
    const newRow = document.querySelector(`[data-id="${newId}"]`);
    if (newRow) {
        newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        newRow.style.backgroundColor = '#e8f4fd';
        setTimeout(() => {
            newRow.style.backgroundColor = '';
        }, 2000);
    }
}

function updateResultsCount(count = null) {
    const resultsCountElement = document.getElementById('resultsCount');
    
    if (count === null) {
        // Count visible rows
        const visibleRows = document.querySelectorAll('.category-row:not([style*="display: none"])');
        count = visibleRows.length;
    }
    
    resultsCountElement.textContent = `${count} result${count !== 1 ? 's' : ''}`;
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
                    // Already on categories page
                    break;
                case 'QR codes':
                    console.log('QR codes page not implemented yet');
                    break;
            }
        });
    });
}

// Initialize navigation when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

// Export functions for potential use by other scripts
window.CategoriesPage = {
    addNewCategory,
    editCategory,
    deleteCategory,
    duplicateCategory,
    updateResultsCount
};
