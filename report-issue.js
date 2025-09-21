// Report Issue Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('attachments');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    const issueDateInput = document.getElementById('issueDate');
    const assetDisplay = document.getElementById('assetDisplay');
    const assetDropdown = document.getElementById('assetDropdown');
    const assetSearch = document.getElementById('assetSearch');
    
    // Set current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
    issueDateInput.value = formattedDate;
    
    // Multi-select asset functionality
    let selectedAssets = [];
    
    // Toggle dropdown
    assetDisplay.addEventListener('click', function() {
        assetDropdown.classList.toggle('show');
        assetDisplay.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.multi-select-wrapper')) {
            assetDropdown.classList.remove('show');
            assetDisplay.classList.remove('active');
        }
    });
    
    // Prevent dropdown from closing when clicking on search input
    assetSearch.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Focus search input when dropdown opens
    assetDisplay.addEventListener('click', function() {
        setTimeout(() => {
            if (assetDropdown.classList.contains('show')) {
                assetSearch.focus();
            }
        }, 100);
    });
    
    // Handle asset selection
    const assetCheckboxes = assetDropdown.querySelectorAll('input[type="checkbox"]');
    assetCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const value = this.value;
            const label = this.nextElementSibling.textContent;
            
            if (this.checked) {
                if (!selectedAssets.find(asset => asset.value === value)) {
                    selectedAssets.push({ value, label });
                }
            } else {
                selectedAssets = selectedAssets.filter(asset => asset.value !== value);
            }
            
            updateAssetDisplay();
        });
    });
    
    function updateAssetDisplay() {
        const displayContainer = assetDisplay;
        
        if (selectedAssets.length === 0) {
            displayContainer.innerHTML = '<span class="placeholder">Select assets</span>';
        } else {
            const tagsHtml = selectedAssets.map(asset => 
                `<div class="selected-asset-tag">
                    ${asset.label}
                    <button type="button" class="remove-asset" onclick="removeAsset('${asset.value}')">×</button>
                </div>`
            ).join('');
            
            displayContainer.innerHTML = `<div class="selected-assets">${tagsHtml}</div>`;
        }
    }
    
    // Global function to remove asset
    window.removeAsset = function(value) {
        selectedAssets = selectedAssets.filter(asset => asset.value !== value);
        
        // Uncheck the corresponding checkbox
        const checkbox = document.querySelector(`input[value="${value}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
        
        updateAssetDisplay();
    };
    
    // Asset search functionality
    assetSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const assetOptions = assetDropdown.querySelectorAll('.multi-select-option');
        
        assetOptions.forEach(option => {
            const label = option.querySelector('label').textContent.toLowerCase();
            
            if (label.includes(searchTerm)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
        
        // Show "No results" message if no options are visible
        const visibleOptions = Array.from(assetOptions).filter(option => 
            option.style.display !== 'none'
        );
        
        // Remove existing no results message
        const existingNoResults = assetDropdown.querySelector('.no-results-message');
        if (existingNoResults) {
            existingNoResults.remove();
        }
        
        if (visibleOptions.length === 0 && searchTerm.trim() !== '') {
            const noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.textContent = 'No assets found';
            assetDropdown.appendChild(noResultsMsg);
        }
    });
    
    // Clear search when dropdown closes
    const originalToggle = assetDisplay.onclick;
    assetDisplay.addEventListener('click', function() {
        if (!assetDropdown.classList.contains('show')) {
            // Dropdown is about to open, clear search
            assetSearch.value = '';
            
            // Show all options
            const assetOptions = assetDropdown.querySelectorAll('.multi-select-option');
            assetOptions.forEach(option => {
                option.style.display = 'flex';
            });
            
            // Remove no results message
            const noResultsMsg = assetDropdown.querySelector('.no-results-message');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }
    });
    
    // File upload functionality
    let uploadedFiles = [];
    
    fileUploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
    
    fileInput.addEventListener('change', function() {
        const files = Array.from(this.files);
        handleFiles(files);
    });
    
    function handleFiles(files) {
        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
                return;
            }
            
            const fileId = Date.now() + Math.random();
            uploadedFiles.push({ id: fileId, file: file });
            displayUploadedFile(file, fileId);
        });
    }
    
    function displayUploadedFile(file, fileId) {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        fileElement.dataset.fileId = fileId;
        
        const fileIcon = getFileIcon(file.type);
        const fileSize = formatFileSize(file.size);
        
        fileElement.innerHTML = `
            <div class="file-info">
                <span class="file-icon">${fileIcon}</span>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${fileSize})</span>
            </div>
            <button type="button" class="remove-file" onclick="removeFile('${fileId}')">×</button>
        `;
        
        uploadedFilesContainer.appendChild(fileElement);
    }
    
    function getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType === 'application/pdf') return '📄';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        return '📎';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Global function to remove files
    window.removeFile = function(fileId) {
        uploadedFiles = uploadedFiles.filter(f => f.id != fileId);
        const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
        if (fileElement) {
            fileElement.remove();
        }
    };
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = ['issueType', 'issueTitle', 'issueDescription'];
        
        // Clear previous errors
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const formGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                isValid = false;
                formGroup.classList.add('error');
                
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                formGroup.appendChild(errorMsg);
            }
        });
        
        return isValid;
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        
        // Add selected assets
        selectedAssets.forEach(asset => {
            formData.append('issueAsset', asset.value);
        });
        
        // Add uploaded files
        uploadedFiles.forEach(fileObj => {
            formData.append('attachments', fileObj.file);
        });
        
        // Generate issue ID
        const issueId = 'IS-' + (Math.floor(Math.random() * 900) + 100);
        
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = `
                <strong>Issue submitted successfully!</strong><br>
                Issue ID: ${issueId}<br>
                You will be redirected to the issues list in 3 seconds...
            `;
            
            form.insertBefore(successMsg, form.firstChild);
            
            // Reset form
            form.reset();
            uploadedFiles = [];
            uploadedFilesContainer.innerHTML = '';
            
            // Store issue data for the profile page
            const issueData = {
                id: issueId,
                title: formData.get('issueTitle'),
                description: formData.get('issueDescription'),
                category: formData.get('issueType'),
                priority: formData.get('priority'),
                site: formData.get('issueSite'),
                assignedTo: formData.get('assignedTo'),
                assets: selectedAssets,
                dateCreated: new Date().toISOString(),
                createdBy: 'Duncan Heuer'
            };
            
            // Store in localStorage for the profile page
            localStorage.setItem('currentIssue', JSON.stringify(issueData));
            
            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = `issue-profile.html?id=${issueId}`;
            }, 3000);
            
        }, 2000);
    });
    
    // Priority selection styling
    const priorityOptions = document.querySelectorAll('.priority-option');
    priorityOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update visual state
            priorityOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Auto-resize textarea
    const textarea = document.getElementById('issueDescription');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 300) + 'px';
    });
    
    // Category change handler
    const categorySelect = document.getElementById('issueType');
    categorySelect.addEventListener('change', function() {
        const category = this.value;
        
        // Auto-suggest priority based on category
        if (category === 'car-crash' || category === 'safety-concern') {
            document.querySelector('input[name="priority"][value="high"]').checked = true;
        } else if (category === 'hazard') {
            document.querySelector('input[name="priority"][value="medium"]').checked = true;
        } else if (category === 'observation' || category === 'maintenance') {
            document.querySelector('input[name="priority"][value="low"]').checked = true;
        }
        
        // Update visual state
        priorityOptions.forEach(opt => opt.classList.remove('selected'));
        const selectedPriority = document.querySelector('input[name="priority"]:checked');
        if (selectedPriority) {
            selectedPriority.closest('.priority-option').classList.add('selected');
        }
    });
    
    console.log('Report Issue page loaded');
});
