document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const taskCards = document.querySelectorAll('.task-card');
    const detectHardwareBtn = document.getElementById('detect-hardware-btn');
    const hardwareResults = document.getElementById('hardware-results');
    const nextStepBtn = document.getElementById('next-step-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const taskForm = document.getElementById('task-form');

    // Initially disable the detect hardware button and next step button
    // Initially disable the detect hardware button and next step button
    detectHardwareBtn.disabled = true;
    nextStepBtn.disabled = true;

    // Task selection handler
    taskCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active state from all cards
            taskCards.forEach(c => c.classList.remove('border-orange-500', 'bg-gray-700'));

            // Add active state to clicked card
            this.classList.add('border-orange-500', 'bg-gray-700');

            // Check the corresponding radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;

            // Reset entire interface
            hardwareResults.classList.add('hidden');
            document.getElementById('profile-display').textContent = '';
            document.getElementById('gpu-name-display').textContent = '';
            document.getElementById('gpu-memory-display').textContent = '';
            document.getElementById('ram-display').textContent = '';
            document.getElementById('disk-display').textContent = '';
            document.getElementById('cpu-cores-display').textContent = '';
            document.getElementById('model-recommendation-display').textContent = '';

            // Reset model dropdown
            const modelSelect = document.getElementById('model-select');
            modelSelect.innerHTML = '<option value="null" selected>-- Select a model --</option>';

            // Reset buttons state
            detectHardwareBtn.disabled = false;
            nextStepBtn.disabled = true;
        });
    });

    // Handle form submission
    taskForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        detectHardwareBtn.disabled = true;

        try {
            const formData = new FormData(this);

            const response = await fetch('/finetune/detect', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // Update hardware fields
            document.getElementById('profile-display').textContent = data.profile;
            document.getElementById('gpu-name-display').textContent = data.gpu_name;
            document.getElementById('gpu-memory-display').textContent = `${data.gpu_total_memory_gb} GB`;
            document.getElementById('ram-display').textContent = `${data.ram_total_gb} GB`;
            document.getElementById('disk-display').textContent = `${data.available_diskspace_gb} GB`;
            document.getElementById('cpu-cores-display').textContent = data.cpu_cores;
            document.getElementById('model-recommendation-display').textContent = data.model_recommendation;

            // Populate model select dropdown
            const modelSelect = document.getElementById('model-select');
            modelSelect.innerHTML = '';
            let option = document.createElement('option');
            option.value = "null";
            option.textContent = "-- Select a model --";
            option.selected = true;
            modelSelect.appendChild(option);
            data.possible_options.forEach(model => {
                option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });

            // Show results but keep next step disabled until model selection
            hardwareResults.classList.remove('hidden');
            // nextStepBtn will remain disabled until model is selected

        } catch (error) {
            console.error('Error:', error);
            alert('Error detecting hardware. Please try again.');
        } finally {
            // Hide loading indicator
            detectHardwareBtn.disabled = false;
        }
    });

    // Handle model selection form submission
    const modelSelect = document.getElementById('model-select');
    modelSelect.addEventListener('change', async () => {
        const selectedModel = modelSelect.value;

        // Check if a valid model is selected (not the placeholder)
        if (!selectedModel || selectedModel === "null") {
            nextStepBtn.disabled = true;
            return;
        }

        try {
            console.log("Selected model:", selectedModel);
            const response = await fetch('/finetune/set_model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selected_model: selectedModel })
            });

            if (!response.ok) throw new Error('Failed to set model');

            const data = await response.json();
            console.log('Model set successfully:', data);

            // Enable the next step button only after successful model selection
            nextStepBtn.disabled = false;
        } catch (error) {
            console.error('Error setting model:', error);
            alert('Error setting model. Please try again.');
            nextStepBtn.disabled = true;
        }
    });
});