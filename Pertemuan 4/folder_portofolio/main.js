
"use strict";

// Data awal proyek
let projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

// Mengambil elemen HTML
const projectForm = document.getElementById("project-form");
const titleInput = document.getElementById("project-title");
const categoryInput = document.getElementById("project-category");
const budgetInput = document.getElementById("project-budget");
const completedInput = document.getElementById("project-completed");

const searchInput = document.getElementById("search-project");
const filterInput = document.getElementById("filter-category");

const projectList = document.getElementById("project-list");
const projectCount = document.getElementById("project-count");
const formMessage = document.getElementById("form-message");

// Format angka menjadi Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// Mencegah teks input ditafsirkan sebagai HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Memperbarui statistik dari seluruh data proyek
function updateStats() {
    const totalProjects = projects.length;

    const totalBudget = projects.reduce(
        (total, project) => total + project.budget,
        0
    );

    const completedProjects = projects.filter(
        project => project.completed
    ).length;

    document.getElementById("stat-total-projects")
        .textContent = totalProjects;

    document.getElementById("stat-total-budget")
        .textContent = formatRupiah(totalBudget);

    document.getElementById("stat-completed-projects")
        .textContent = completedProjects;
}

// Menampilkan pesan pada form
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

// Render kartu proyek
function renderProjects(data) {
    if (data.length === 0) {
        projectList.innerHTML = `
            <p class="empty-message">
                Tidak ada proyek yang cocok dengan pencarian.
            </p>
        `;
    } else {
        projectList.innerHTML = data.map(project => {
            const statusClass = project.completed
                ? "badge-success"
                : "badge-pending";

            const statusText = project.completed
                ? "Selesai"
                : "Dalam Pengerjaan";

            const toggleText = project.completed
                ? "Ubah ke Dalam Pengerjaan"
                : "Ubah Status";

            return `
                <article class="project-card">
                    <div class="project-info">
                        <span class="project-category">
                            ${escapeHTML(project.category)}
                        </span>

                        <h4>${escapeHTML(project.title)}</h4>

                        <p class="project-budget">
                            Anggaran: ${formatRupiah(project.budget)}
                        </p>

                        <span class="badge ${statusClass}">
                            ${statusText}
                        </span>

                        <div class="project-actions">
                            <button
                                type="button"
                                class="btn btn-toggle"
                                data-action="toggle"
                                data-id="${project.id}"
                            >
                                ${toggleText}
                            </button>

                            <button
                                type="button"
                                class="btn btn-delete"
                                data-action="delete"
                                data-id="${project.id}"
                            >
                                Hapus Proyek
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    }

    projectCount.textContent =
        `Menampilkan ${data.length} dari ${projects.length} proyek.`;

    updateStats();
}

// Pencarian real-time dan filter kategori
function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedCategory = filterInput.value;

    const filteredProjects = projects.filter(project => {
        const matchesName = project.title
            .toLowerCase()
            .includes(keyword);

        const matchesCategory =
            selectedCategory === "Semua" ||
            project.category === selectedCategory;

        return matchesName && matchesCategory;
    });

    renderProjects(filteredProjects);
}

// Fitur 1: menangani submit form
projectForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const budget = Number(budgetInput.value);
    const completed = completedInput.checked;

    // Validasi judul
    if (title === "") {
        showMessage("Judul proyek tidak boleh kosong.", "error");
        titleInput.focus();
        return;
    }

    // Validasi anggaran
    if (
        budgetInput.value.trim() === "" ||
        !Number.isFinite(budget) ||
        budget <= 0 ||
        !Number.isInteger(budget)
    ) {
        showMessage(
            "Anggaran harus berupa bilangan bulat lebih besar dari 0.",
            "error"
        );
        budgetInput.focus();
        return;
    }

    // Membuat ID unik berdasarkan Date.now()
    let newId = Date.now();

    // Mengantisipasi ID yang sama
    while (projects.some(project => project.id === newId)) {
        newId++;
    }

    // Membuat objek proyek baru
    const newProject = {
        id: newId,
        title: title,
        category: category,
        budget: budget,
        completed: completed
    };

    // Menambahkan proyek menggunakan spread operator
    projects = [...projects, newProject];

    // Mengosongkan form
    projectForm.reset();

    // Menampilkan proyek baru melalui filter aktif
    applyFilters();

    showMessage("Proyek berhasil ditambahkan!", "success");

    // Mengarahkan tampilan ke daftar proyek
    projectList.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Fitur 2: pencarian saat pengguna mengetik
searchInput.addEventListener("input", applyFilters);

// Filter kategori
filterInput.addEventListener("change", applyFilters);

// Fitur 3: aksi ubah status dan hapus proyek
projectList.addEventListener("click", function (e) {
    const button = e.target.closest("button[data-action]");

    if (!button) return;

    const projectId = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "toggle") {
        projects = projects.map(project => {
            if (project.id === projectId) {
                return {
                    ...project,
                    completed: !project.completed
                };
            }

            return project;
        });
    }

    if (action === "delete") {
        const confirmed = confirm(
            "Apakah kamu yakin ingin menghapus proyek ini?"
        );

        if (!confirmed) return;

        projects = projects.filter(
            project => project.id !== projectId
        );
    }

    // Render ulang berdasarkan pencarian dan kategori aktif
    applyFilters();
});

// Tampilan awal aplikasi
applyFilters();
