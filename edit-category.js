// Edit Category Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Edit Category page loaded');
    
    // Initialize edit category functionality
    initializeEditCategoryPage();
});

function initializeEditCategoryPage() {
    // Initialize tab functionality
    initializeTabs();
    
    // Initialize category name editing
    initializeCategoryNameEditing();
    
    // Initialize notification settings
    initializeNotificationSettings();
    
    // Initialize issue fields
    initializeIssueFields();
    
    // Initialize custom questions
    initializeCustomQuestions();
    
    // Initialize form submission
    initializeFormSubmission();
    
    // Load category data if editing existing category
    loadCategoryData();
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Handle tab content switching
            switchTabContent(targetTab);
        });
    });
}

function switchTabContent(tabName) {
    console.log(`Switching to ${tabName} tab`);
    
    // In a real implementation, you would show/hide different content sections
    // For now, we'll just log the tab switch
    if (tabName === 'access') {
        console.log('Access tab content would be shown here');
        // You could hide workflow-specific sections and show access-specific ones
    } else if (tabName === 'workflow') {
        console.log('Workflow tab content is shown');
    }
}

function initializeCategoryNameEditing() {
    const editNameBtn = document.querySelector('.edit-name-btn');
    const nameDisplay = document.getElementById('categoryNameDisplay');
    const nameEdit = document.getElementById('categoryNameEdit');
    const nameInput = document.getElementById('categoryNameInput');
    const nameText = document.getElementById('categoryNameText');
    const cancelBtn = document.getElementById('cancelNameEdit');
    const saveBtn = document.getElementById('saveNameEdit');
    
    editNameBtn.addEventListener('click', function() {
        nameDisplay.style.display = 'none';
        nameEdit.style.display = 'block';
        nameInput.focus();
        nameInput.select();
    });
    
    cancelBtn.addEventListener('click', function() {
        nameInput.value = nameText.textContent;
        nameDisplay.style.display = 'block';
        nameEdit.style.display = 'none';
    });
    
    saveBtn.addEventListener('click', function() {
        const newName = nameInput.value.trim();
        if (newName && newName !== nameText.textContent) {
            nameText.textContent = newName;
            console.log(`Category name updated to: ${newName}`);
        }
        nameDisplay.style.display = 'block';
        nameEdit.style.display = 'none';
    });
    
    // Handle Enter and Escape keys
    nameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveBtn.click();
        } else if (e.key === 'Escape') {
            cancelBtn.click();
        }
    });
}

function initializeNotificationSettings() {
    const editNotificationsBtn = document.getElementById('editNotifications');
    const editCriticalNotificationsBtn = document.getElementById('editCriticalNotifications');
    
    editNotificationsBtn.addEventListener('click', function() {
        console.log('Opening notification settings modal');
        showNotificationModal('regular');
    });
    
    editCriticalNotificationsBtn.addEventListener('click', function() {
        console.log('Opening critical notification settings modal');
        showNotificationModal('critical');
    });
}

function showNotificationModal(type) {
    // Simulate notification settings modal
    const message = type === 'critical' 
        ? 'Configure Critical Alert notifications:\n\n1. Add email addresses\n2. Set notification preferences\n3. Configure escalation rules'
        : 'Configure regular notifications:\n\n1. Add email addresses\n2. Set notification preferences\n3. Choose notification timing';
    
    const result = prompt(message + '\n\nEnter email addresses (comma-separated):');
    
    if (result) {
        const emails = result.split(',').map(email => email.trim()).filter(email => email);
        if (emails.length > 0) {
            updateNotificationStatus(type, emails);
        }
    }
}

function updateNotificationStatus(type, emails) {
    const statusBadges = document.querySelectorAll('.status-badge');
    const targetBadge = type === 'critical' ? statusBadges[1] : statusBadges[0];
    
    if (targetBadge) {
        const count = emails.length;
        targetBadge.textContent = `${count} user${count !== 1 ? 's' : ''} will be notified`;
        targetBadge.style.backgroundColor = '#e8f4fd';
        targetBadge.style.color = '#007aff';
    }
    
    console.log(`${type} notifications updated for:`, emails);
}

function toggleFieldConfigPanel(fieldId) {
    // Close all other config panels
    const allPanels = document.querySelectorAll('.field-config-panel');
    allPanels.forEach(panel => {
        if (panel.id !== `config-${fieldId}`) {
            panel.style.display = 'none';
        }
    });
    
    // Toggle the target panel
    const targetPanel = document.getElementById(`config-${fieldId}`);
    if (targetPanel) {
        const isVisible = targetPanel.style.display !== 'none';
        targetPanel.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            // Load current field state
            loadFieldConfigState(fieldId);
        }
    }
}

function initializeConfigPanels() {
    // Initialize save buttons
    const saveButtons = document.querySelectorAll('.config-save');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.closest('.field-config-panel');
            const fieldId = panel.id.replace('config-', '');
            saveFieldConfig(fieldId, panel);
        });
    });
    
    // Initialize cancel buttons
    const cancelButtons = document.querySelectorAll('.config-cancel');
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.closest('.field-config-panel');
            const fieldId = panel.id.replace('config-', '');
            cancelFieldConfig(fieldId, panel);
        });
    });
    
    // Close panels when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.field-config-panel') && !e.target.closest('.field-action-btn')) {
            const allPanels = document.querySelectorAll('.field-config-panel');
            allPanels.forEach(panel => {
                panel.style.display = 'none';
            });
        }
    });
}

function loadFieldConfigState(fieldId) {
    const panel = document.getElementById(`config-${fieldId}`);
    if (!panel) return;
    
    const fieldItem = panel.closest('.field-item');
    const fieldName = fieldItem.querySelector('.field-name').textContent;
    
    // Get current field state
    const isDisabled = fieldName.includes('(disabled)');
    const isRequired = fieldName.includes('(required)');
    const isEnabled = !isDisabled;
    
    // Update toggles
    const enableToggle = panel.querySelector('.enable-field-toggle');
    const requiredToggle = panel.querySelector('.required-field-toggle');
    
    if (enableToggle) {
        enableToggle.checked = isEnabled;
    }
    
    if (requiredToggle) {
        requiredToggle.checked = isRequired;
        // Disable required toggle if field is disabled
        requiredToggle.disabled = !isEnabled;
    }
    
    // Update required toggle when enable toggle changes
    if (enableToggle && requiredToggle) {
        enableToggle.addEventListener('change', function() {
            requiredToggle.disabled = !this.checked;
            if (!this.checked) {
                requiredToggle.checked = false;
            }
        });
    }
}

function saveFieldConfig(fieldId, panel) {
    const enableToggle = panel.querySelector('.enable-field-toggle');
    const requiredToggle = panel.querySelector('.required-field-toggle');
    
    const isEnabled = enableToggle ? enableToggle.checked : true;
    const isRequired = requiredToggle ? requiredToggle.checked : false;
    
    // Update field display
    updateFieldDisplay(fieldId, isEnabled, isRequired);
    
    // Hide panel
    panel.style.display = 'none';
    
    console.log(`Field ${fieldId} updated: enabled=${isEnabled}, required=${isRequired}`);
}

function cancelFieldConfig(fieldId, panel) {
    // Reload the current state
    loadFieldConfigState(fieldId);
    
    // Hide panel
    panel.style.display = 'none';
    
    console.log(`Field ${fieldId} config cancelled`);
}

function updateFieldDisplay(fieldId, isEnabled, isRequired) {
    const panel = document.getElementById(`config-${fieldId}`);
    if (!panel) return;
    
    const fieldItem = panel.closest('.field-item');
    const fieldNameElement = fieldItem.querySelector('.field-name');
    
    if (!fieldNameElement) return;
    
    // Get base field name (remove existing status indicators)
    let baseName = fieldNameElement.textContent
        .replace(' (required)', '')
        .replace(' (disabled)', '')
        .trim();
    
    // Update field name with new status
    let newName = baseName;
    if (!isEnabled) {
        newName += ' (disabled)';
        fieldNameElement.classList.add('disabled');
        fieldItem.style.opacity = '0.6';
    } else {
        fieldNameElement.classList.remove('disabled');
        fieldItem.style.opacity = '1';
        
        if (isRequired) {
            newName += ' (required)';
        }
    }
    
    fieldNameElement.textContent = newName;
}

function initializeIssueFields() {
    const fieldActionBtns = document.querySelectorAll('.field-action-btn:not(:disabled)');
    
    fieldActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const fieldId = this.dataset.field;
            if (fieldId) {
                toggleFieldConfigPanel(fieldId);
            }
        });
    });
    
    // Initialize config panel actions
    initializeConfigPanels();
}

function editIssueField(fieldName, fieldElement) {
    // Simulate field editing
    const options = {
        'Description': ['Required', 'Optional', 'Hidden'],
        'Site': ['Required', 'Optional', 'Hidden'],
        'Images and videos': ['Required', 'Optional', 'Hidden'],
        'Location': ['Required', 'Optional', 'Hidden'],
        'Date Occurred (required)': ['Required', 'Optional']
    };
    
    const fieldOptions = options[fieldName] || ['Required', 'Optional', 'Hidden'];
    const choice = prompt(`Configure "${fieldName}" field:\n\n${fieldOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nEnter choice (1-${fieldOptions.length}):`);
    
    if (choice && choice >= 1 && choice <= fieldOptions.length) {
        const selectedOption = fieldOptions[choice - 1];
        console.log(`Field "${fieldName}" set to: ${selectedOption}`);
        
        // Update field display
        const fieldNameElement = fieldElement.querySelector('.field-name');
        const isRequired = selectedOption === 'Required';
        const isHidden = selectedOption === 'Hidden';
        
        if (isRequired && !fieldName.includes('(required)')) {
            fieldNameElement.textContent = `${fieldName} (required)`;
        } else if (!isRequired && fieldName.includes('(required)')) {
            fieldNameElement.textContent = fieldName.replace(' (required)', '');
        }
        
        if (isHidden) {
            fieldElement.style.opacity = '0.5';
        } else {
            fieldElement.style.opacity = '1';
        }
    }
}

function initializeCustomQuestions() {
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionActionBtns = document.querySelectorAll('.question-action-btn');
    
    addQuestionBtn.addEventListener('click', function() {
        console.log('Adding new custom question');
        addCustomQuestion();
    });
    
    questionActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const questionItem = this.closest('.question-item');
            const questionText = questionItem.querySelector('.question-text').textContent;
            const isEdit = this.querySelector('.edit-icon');
            
            if (isEdit) {
                editCustomQuestion(questionText, questionItem);
            } else {
                deleteCustomQuestion(questionText, questionItem);
            }
        });
    });
}

function addCustomQuestion() {
    const questionText = prompt('Enter your custom question:');
    
    if (questionText && questionText.trim()) {
        const questionsList = document.querySelector('.custom-questions-list');
        const questionId = `question-${Date.now()}`;
        
        const questionHTML = `
            <div class="question-item" data-id="${questionId}">
                <div class="question-info">
                    <span class="question-icon">📝</span>
                    <span class="question-text">${questionText.trim()}</span>
                </div>
                <div class="question-actions">
                    <button class="question-action-btn">
                        <span class="edit-icon">✏️</span>
                    </button>
                    <button class="question-action-btn">
                        <span class="delete-icon">🗑️</span>
                    </button>
                </div>
            </div>
        `;
        
        questionsList.insertAdjacentHTML('beforeend', questionHTML);
        
        // Re-initialize event listeners for new question
        initializeCustomQuestions();
        
        console.log(`Custom question added: ${questionText}`);
    }
}

function editCustomQuestion(currentText, questionElement) {
    const newText = prompt('Edit question:', currentText);
    
    if (newText && newText.trim() && newText !== currentText) {
        questionElement.querySelector('.question-text').textContent = newText.trim();
        console.log(`Question updated: "${currentText}" → "${newText}"`);
    }
}

function deleteCustomQuestion(questionText, questionElement) {
    const confirmed = confirm(`Are you sure you want to delete this question?\n\n"${questionText}"`);
    
    if (confirmed) {
        questionElement.remove();
        console.log(`Question deleted: "${questionText}"`);
    }
}

function initializeFormSubmission() {
    const form = document.getElementById('categoryForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Saving category...');
        
        // Collect form data
        const formData = collectFormData();
        
        // Simulate saving
        setTimeout(() => {
            console.log('Category saved successfully:', formData);
            alert('Category saved successfully!');
            
            // Redirect back to categories page
            window.location.href = 'categories.html';
        }, 1000);
    });
}

function collectFormData() {
    const categoryName = document.getElementById('categoryNameText').textContent;
    const notificationSettings = collectNotificationSettings();
    const issueFields = collectIssueFields();
    const customQuestions = collectCustomQuestions();
    
    return {
        name: categoryName,
        notifications: notificationSettings,
        issueFields: issueFields,
        customQuestions: customQuestions,
        timestamp: new Date().toISOString()
    };
}

function collectNotificationSettings() {
    const notificationType = document.querySelector('input[name="notification-type"]:checked').value;
    const statusBadges = document.querySelectorAll('.status-badge');
    
    return {
        type: notificationType,
        regularNotifications: statusBadges[0].textContent,
        criticalNotifications: statusBadges[1].textContent
    };
}

function collectIssueFields() {
    const fieldItems = document.querySelectorAll('.field-item');
    const fields = [];
    
    fieldItems.forEach(item => {
        const name = item.querySelector('.field-name').textContent;
        const isRequired = name.includes('(required)');
        const isHidden = item.style.opacity === '0.5';
        
        fields.push({
            name: name.replace(' (required)', ''),
            required: isRequired,
            hidden: isHidden
        });
    });
    
    return fields;
}

function collectCustomQuestions() {
    const questionItems = document.querySelectorAll('.question-item');
    const questions = [];
    
    questionItems.forEach(item => {
        const text = item.querySelector('.question-text').textContent;
        questions.push({
            text: text,
            id: item.dataset.id || `question-${questions.length}`
        });
    });
    
    return questions;
}

function loadCategoryData() {
    // Check if we're editing an existing category
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    const categoryName = urlParams.get('name');
    
    if (categoryName) {
        document.getElementById('categoryNameText').textContent = categoryName;
        document.getElementById('categoryNameInput').value = categoryName;
        console.log(`Loading category: ${categoryName}`);
    }
    
    if (categoryId) {
        console.log(`Editing category ID: ${categoryId}`);
        // In a real app, you would load the category data from an API
        loadCategoryFromStorage(categoryId);
    }
}

function loadCategoryFromStorage(categoryId) {
    // Simulate loading category data
    const savedCategories = JSON.parse(localStorage.getItem('categories') || '{}');
    const categoryData = savedCategories[categoryId];
    
    if (categoryData) {
        console.log('Loaded category data:', categoryData);
        // Populate form with saved data
        populateFormWithData(categoryData);
    }
}

function populateFormWithData(data) {
    // This would populate the form with existing category data
    console.log('Populating form with data:', data);
    
    // Update category name
    if (data.name) {
        document.getElementById('categoryNameText').textContent = data.name;
        document.getElementById('categoryNameInput').value = data.name;
    }
    
    // Update other fields as needed
    // This is where you'd restore notification settings, custom questions, etc.
}

// Export functions for potential use by other scripts
window.EditCategoryPage = {
    collectFormData,
    addCustomQuestion,
    editCustomQuestion,
    deleteCustomQuestion,
    updateNotificationStatus
};
