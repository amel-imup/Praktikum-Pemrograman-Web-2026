
// File: script.js

document.addEventListener("DOMContentLoaded", () => {

    // 1. Mengambil elemen HTML
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");


    // 2. Membaca data di LocalStorage
    const getTasks = () => {
        try {
            return JSON.parse(
                localStorage.getItem("todo_tasks")
            ) || [];
        } catch (error) {
            console.error("Gagal membaca data tugas:", error);
            return [];
        }
    };


    // 3. Menyimpan data ke LocalStorage
    const saveTasks = (tasks) => {
        localStorage.setItem(
            "todo_tasks",
            JSON.stringify(tasks)
        );
    };


    // 4. Fitur 1: Menghitung jumlah tugas
    const updateTaskCounter = (tasks) => {
        const total = tasks.length;

        const selesai = tasks.filter(
            (task) => task.completed === true
        ).length;

        const belumSelesai = total - selesai;

        taskCounter.textContent =
            `Total: ${total} Tugas | ` +
            `Selesai: ${selesai} | ` +
            `Belum Selesai: ${belumSelesai}`;

        // Nonaktifkan tombol jika tidak ada tugas selesai
        clearCompletedBtn.disabled = selesai === 0;
    };


    // 5. Menampilkan daftar tugas
    const renderTasks = () => {
        const tasks = getTasks();

        // Kosongkan tampilan daftar sebelumnya
        todoList.innerHTML = "";

        // Perbarui counter setiap kali daftar ditampilkan
        updateTaskCounter(tasks);

        // Jika belum ada tugas
        if (tasks.length === 0) {
            const emptyMessage = document.createElement("li");

            emptyMessage.className = "empty-message";
            emptyMessage.textContent =
                "Belum ada tugas tersimpan.";

            todoList.appendChild(emptyMessage);
            return;
        }

        // Tampilkan setiap tugas
        tasks.forEach((task, index) => {
            const li = document.createElement("li");

            li.className = "todo-item";

            if (task.completed) {
                li.classList.add("completed");
            }

            // Teks tugas
            const taskText = document.createElement("span");

            taskText.className = "todo-text";
            taskText.textContent = task.text;

            // Wadah tombol aksi
            const actions = document.createElement("div");

            actions.className = "todo-actions";

            // Tombol selesai atau batal
            const completeButton =
                document.createElement("button");

            completeButton.type = "button";
            completeButton.className =
                "action-btn complete-btn";

            completeButton.dataset.index = index;

            completeButton.textContent =
                task.completed ? "Batal" : "Selesai";

            // Tombol hapus
            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className =
                "action-btn delete-btn";

            deleteButton.dataset.index = index;
            deleteButton.textContent = "Hapus";

            // Masukkan tombol ke dalam wadah
            actions.appendChild(completeButton);
            actions.appendChild(deleteButton);

            // Masukkan teks dan tombol ke item
            li.appendChild(taskText);
            li.appendChild(actions);

            // Masukkan item ke daftar
            todoList.appendChild(li);
        });
    };


    // 6. Menambahkan tugas baru
    todoForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const taskText = taskInput.value.trim();

        // Validasi input minimal 3 karakter
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            taskInput.focus();
            return;
        }

        // Hilangkan pesan error jika input valid
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Ambil data tugas sebelumnya
        const tasks = getTasks();

        // Tambahkan tugas baru dengan status belum selesai
        tasks.push({
            text: taskText,
            completed: false
        });

        // Simpan data dan perbarui tampilan
        saveTasks(tasks);

        taskInput.value = "";

        renderTasks();

        taskInput.focus();
    });


    // 7. Menghilangkan pesan error saat mengetik
    taskInput.addEventListener("input", () => {
        if (taskInput.value.trim().length >= 3) {
            taskInput.classList.remove("error");
            inputError.style.display = "none";
        }
    });


    // 8. Menangani tombol Selesai, Batal, dan Hapus
    todoList.addEventListener("click", (event) => {
        const button = event.target.closest("button");

        // Pastikan yang diklik adalah tombol tugas
        if (!button || button.dataset.index === undefined) {
            return;
        }

        const index = Number(button.dataset.index);
        const tasks = getTasks();

        if (index < 0 || index >= tasks.length) {
            return;
        }

        // Mengubah status tugas
        if (button.classList.contains("complete-btn")) {
            tasks[index].completed =
                !tasks[index].completed;

            saveTasks(tasks);
            renderTasks();
        }

        // Fitur 3: Konfirmasi sebelum menghapus tugas
        else if (button.classList.contains("delete-btn")) {

            const yakin = confirm(
                "Apakah Anda yakin ingin menghapus tugas ini?"
            );

            // Hapus hanya jika pengguna memilih OK
            if (yakin) {
                tasks.splice(index, 1);

                saveTasks(tasks);
                renderTasks();
            }

            // Jika Cancel, tugas tetap tersimpan
        }
    });


    // 9. Fitur 2: Bersihkan semua tugas yang selesai
    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();

        // Hitung jumlah tugas selesai
        const jumlahSelesai = tasks.filter(
            (task) => task.completed === true
        ).length;

        // Hentikan proses jika tidak ada tugas selesai
        if (jumlahSelesai === 0) {
            return;
        }

        // Pertahankan tugas yang belum selesai
        const tasksBelumSelesai = tasks.filter(
            (task) => task.completed !== true
        );

        // Simpan kembali tugas yang belum selesai
        saveTasks(tasksBelumSelesai);

        // Perbarui daftar dan counter
        renderTasks();
    });


    // 10. Menampilkan data saat halaman dibuka
    renderTasks();

});
