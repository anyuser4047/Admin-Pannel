// Sidebar Toggle
const sidebarToggle = document.querySelector('.sidebar-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');

sidebarToggle?.addEventListener('click', () => {
    adminSidebar?.classList.toggle('active');
});

// Admin Profile Dropdown
const adminProfile = document.querySelector('.admin-profile');
const profileDropdown = document.querySelector('.admin-profile .dropdown-menu');

adminProfile?.addEventListener('click', e => {
    e.stopPropagation();
    profileDropdown?.classList.toggle('active');
});

document.addEventListener('click', () => {
    profileDropdown?.classList.remove('active');
});

// Navigation between sections
const menuItems = document.querySelectorAll('.sidebar-menu li');
const contentSections = document.querySelectorAll('.content-section');

menuItems.forEach(item => {
    item.addEventListener('click', function () {
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        const sectionId = this.getAttribute('data-section');
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionId}-section`)?.classList.add('active');

        document.querySelector('.page-title').textContent = this.querySelector('span').textContent;

        if (window.innerWidth < 992) {
            adminSidebar?.classList.remove('active');
        }
    });
});

// Settings Tabs
const settingsTabs = document.querySelectorAll('.settings-sidebar .tab');
const settingsContents = document.querySelectorAll('.settings-content .tab-content');

settingsTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        settingsTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const tabId = this.getAttribute('data-tab');
        settingsContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`)?.classList.add('active');
    });
});

// Messages Toggle
document.querySelectorAll('.message-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.message-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Chart Initialization
document.addEventListener('DOMContentLoaded', () => {
    const enrollmentCtx = document.getElementById('enrollmentChart')?.getContext('2d');
    if (enrollmentCtx) {
        new Chart(enrollmentCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Students',
                    data: [45, 60, 75, 90, 110, 130],
                    borderColor: 'rgba(42, 157, 143, 1)',
                    backgroundColor: 'rgba(42, 157, 143, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    const coursesCtx = document.getElementById('coursesChart')?.getContext('2d');
    if (coursesCtx) {
        new Chart(coursesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Tajweed', 'Hifz', 'Translation', 'Kids Program', 'Ijazah'],
                datasets: [{
                    data: [45, 32, 18, 42, 12],
                    backgroundColor: [
                        'rgba(42, 157, 143, 0.8)',
                        'rgba(233, 196, 106, 0.8)',
                        'rgba(231, 111, 81, 0.8)',
                        'rgba(76, 201, 240, 0.8)',
                        'rgba(108, 117, 125, 0.8)'
                    ],
                    borderColor: [
                        'rgba(42, 157, 143, 1)',
                        'rgba(233, 196, 106, 1)',
                        'rgba(231, 111, 81, 1)',
                        'rgba(76, 201, 240, 1)',
                        'rgba(108, 117, 125, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'right' } }
            }
        });
    }
});

// Add Student Modal
const addStudentBtn = document.querySelector('#students-section .btn-primary');
if (!document.getElementById('addStudentModal')) {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal" id="addStudentModal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Add New Student</h3>
                <form id="addStudentForm">
                    <div class="form-group">
                        <label>ID Number</label>
                        <input type="text" name="idNumber" required>
                    </div>
                    <div class="form-group">
                        <label>Student</label>
                        <input type="text" name="student" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Courses</label>
                        <input type="text" name="course" required>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select name="status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Profile Image</label>
                        <input type="file" name="image" accept="image/*">
                    </div>
                    <button type="submit" class="btn btn-primary">Save</button>
                </form>
            </div>
        </div>
    `);
}

const modal = document.getElementById('addStudentModal');
const closeBtn = modal?.querySelector('.close');

addStudentBtn?.addEventListener('click', () => modal?.classList.add('active'));
closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));
modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

// Handle form submission
document.getElementById('addStudentForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const idNumber = formData.get('idNumber')?.trim();
    const student = formData.get('student')?.trim();
    const email = formData.get('email');
    const course = formData.get('course');
    const status = formData.get('status');
    const image = formData.get('image');

    if (!student || !idNumber) {
        alert("ID Number and Student Name are required.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const imageUrl = event.target.result;
        appendStudentToTable(idNumber, student, email, course, status, imageUrl);
    };
    if (image && image.name) {
        reader.readAsDataURL(image);
    } else {
        appendStudentToTable(idNumber, student, email, course, status, null);
    }

    this.reset();
    modal.classList.remove('active');
});

// Append student to table
function appendStudentToTable(idNumber, student, email, course, status, imageUrl) {
    const tbody = document.querySelector('#students-section table tbody');
    const newRow = document.createElement('tr');
    const randomId = Math.floor(Math.random() * 1000000);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }); // Format: 07 May 2025

    newRow.innerHTML = `
        <td>${idNumber}</td>
        <td>
            ${imageUrl ? `<img src="${imageUrl}" class="student-img" alt="Profile">` : ''}
            ${student}
        </td>
        <td>${email}</td>
        <td>${course}</td>
        <td><span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
        <td>${formattedDate}</td>
        <td>
            <button class="action-btn view" data-id="${randomId}" title="View"><i class="fas fa-eye"></i></button>
            <button class="action-btn edit" data-id="${randomId}" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" data-id="${randomId}" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
    `;
    tbody.appendChild(newRow);
}

// Action buttons
document.querySelector('#students-section table tbody')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const row = btn.closest('tr');
    const studentId = row.querySelector('td:first-child').textContent;

    if (btn.classList.contains('view')) {
        alert(`Viewing student ID: ${studentId}`);
    } else if (btn.classList.contains('edit')) {
        alert(`Editing student ID: ${studentId}`);
    } else if (btn.classList.contains('delete')) {
        if (confirm('Are you sure you want to delete this student?')) {
            row.remove();
        }
    }
});

// Search and filter
const studentSearchInput = document.querySelector('#students-section .search-box input');
const studentFilterSelect = document.querySelector('#students-section .filter-group select');

studentSearchInput?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('#students-section table tbody tr').forEach(row => {
        const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) ? '' : 'none';
    });
});

studentFilterSelect?.addEventListener('change', (e) => {
    const filterValue = e.target.value;
    document.querySelectorAll('#students-section table tbody tr').forEach(row => {
        const status = row.querySelector('td:nth-child(5) .status-badge').textContent;
        row.style.display = (filterValue === 'All Students' || status === filterValue) ? '' : 'none';
    });
});

// Teacher filter
document.addEventListener("DOMContentLoaded", () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const teacherCards = document.querySelectorAll(".tutor-card");

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.textContent.trim();
            teacherCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");
                card.style.display = (category === "All" || cardCategory === category) ? "block" : "none";
            });
        });
    });
});

// Responsive
window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        adminSidebar?.classList.remove('active');
    }
});

// Logout
document.querySelectorAll('.logout').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        alert('Logout functionality would be implemented here');
        window.location.href = '../index.html';
    });
});
