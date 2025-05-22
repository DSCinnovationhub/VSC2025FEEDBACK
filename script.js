document.addEventListener('DOMContentLoaded', function() {
    // Camp schedule with end dates (all camps are 4 days)
    const campSchedule = {
        'Science Toy 2nd Batch': { endDate: new Date('2025-05-31'), time: '4PM to 6PM' },
        'Physics': { endDate: new Date('2025-05-31'), time: '10AM to 12PM' },
        'Life Science': { endDate: new Date('2025-05-19'), time: '10AM to 12PM' },
        'Chemistry': { endDate: new Date('2025-05-21'), time: '4PM to 6PM' },
        'Mathematics': { endDate: new Date('2025-05-27'), time: '10AM to 12PM' },
        'Arduino': { endDate: new Date('2025-05-23'), time: '10AM to 12PM' },
        'Electronics & Application': { endDate: new Date('2025-05-27'), time: '4PM to 6PM' },
        'Fantasticity Electricity': { endDate: new Date('2025-05-19'), time: '4PM to 6PM' },
        'Robotics': { endDate: new Date('2025-06-04'), time: '4PM to 6PM' },
        'Astronomy': { endDate: new Date('2025-06-04'), time: '10AM to 12PM' }
    };

    // Create stars for background
    function createStars() {
        const starsContainer = document.getElementById('stars');
        const starsCount = 100;
        for (let i = 0; i < starsCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            const duration = `${Math.random() * 3 + 2}s`;
            star.style.setProperty('--duration', duration);
            starsContainer.appendChild(star);
        }
    }

    createStars();

    const receiptInput = document.getElementById('receipt-no');
    const campSelect = document.getElementById('camp-name');
    const proceedBtn = document.getElementById('proceed-btn');
    const receiptError = document.getElementById('receipt-error');
    const campError = document.getElementById('camp-error');

    // Populate camps when receipt number is entered
    receiptInput.addEventListener('input', function() {
        const receiptNo = receiptInput.value.trim();
        receiptError.style.display = 'none';
        campSelect.innerHTML = '<option value="">Select Camp</option>';

        if (studentData[receiptNo]) {
            const camps = studentData[receiptNo].camps;
            const currentDate = new Date();

            camps.forEach(camp => {
                const option = document.createElement('option');
                option.value = camp;
                option.textContent = camp;
                if (campSchedule[camp] && campSchedule[camp].endDate > currentDate) {
                    option.disabled = true;
                    option.textContent += ` (You cam Submit Your Feedback after (MM/DD/YYYY) ${campSchedule[camp].endDate.toLocaleDateString()})`;
                }
                campSelect.appendChild(option);
            });
        } else if (receiptNo) {
            receiptError.textContent = 'Invalid receipt number';
            receiptError.style.display = 'block';
        }
    });

    // Handle proceed button click
    proceedBtn.addEventListener('click', function() {
        const receiptNo = receiptInput.value.trim();
        const campName = campSelect.value;

        receiptError.style.display = 'none';
        campError.style.display = 'none';

        let isValid = true;

        if (!receiptNo) {
            receiptError.textContent = 'Please enter a valid receipt number';
            receiptError.style.display = 'block';
            isValid = false;
        }

        if (!campName) {
            campError.style.display = 'block';
            isValid = false;
        }

        if (!isValid) return;

        if (studentData[receiptNo] && studentData[receiptNo].camps.includes(campName)) {
            if (campName === 'Chemistry') {
                window.open('https://docs.google.com/forms/d/1mKWGAqWFcA8OwsPZ5GGFaPmhv9BmqrRujQW0MCOxDmQ/edit?entry.RECEIPT_NO_FIELD_ID=' + encodeURIComponent(receiptNo), '_blank');
            } else {
                const feedbackUrl = `feedback.html?receiptNo=${encodeURIComponent(receiptNo)}&campName=${encodeURIComponent(campName)}`;
                window.open(feedbackUrl, '_blank');
            }
        } else {
            alert('Invalid receipt number or camp selection.');
        }
    });
});
