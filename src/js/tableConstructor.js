document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("table-form");
    const rowsContainer = document.getElementById("rows-container");
    const tableContainer = document.getElementById("table-container");
    const addRowButton = document.getElementById("add-row");

    let table;

    function saveDataToLocalStorage(data) {
        localStorage.setItem("tableData", JSON.stringify(data));
    }

    function loadDataFromLocalStorage() {
        const data = localStorage.getItem("tableData");
        return data ? JSON.parse(data) : [];
    }

    function createRowInput(index) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row-input");

        const articleInput = document.createElement("input");
        articleInput.type = "text";
        articleInput.name = `article_${index}`;
        articleInput.placeholder = `Введите артикул (${index + 1})`;
        articleInput.required = true;

        const noteTypeSelect = document.createElement("select");
        noteTypeSelect.name = `noteType_${index}`;
        ["Ошибка", "Редактирование", "Улучшение"].forEach((type) => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            noteTypeSelect.appendChild(option);
        });

        const commentInput = document.createElement("textarea");
        commentInput.name = `comment_${index}`;
        commentInput.placeholder = "Введите комментарий";
        commentInput.rows = 2;
        commentInput.required = true;

        rowDiv.appendChild(articleInput);
        rowDiv.appendChild(noteTypeSelect);
        rowDiv.appendChild(commentInput);

        rowsContainer.appendChild(rowDiv);
    }

    function initializeRows() {
        rowsContainer.innerHTML = "";
        const rowCount = parseInt(document.getElementById("rows").value, 10);
        for (let i = 0; i < rowCount; i++) {
            createRowInput(i);
        }
    }

    function generateOrUpdateTable(data) {
        if (!table) {
            table = document.createElement("table");
            table.classList.add("generated-table");

            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            ["№", "Артикул", "Вид заметки", "Комментарий", "Действие"].forEach((header) => {
                const th = document.createElement("th");
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement("tbody");
            table.appendChild(tbody);

            tableContainer.appendChild(table);
        }

        const tbody = table.querySelector("tbody");
        tbody.innerHTML = ""; // Clear the existing rows
        data.forEach((rowData, index) => {
            const row = document.createElement("tr");

            // номер строки
            const numberCell = document.createElement("td");
            numberCell.textContent = index + 1; // Auto-numbering
            row.appendChild(numberCell);

            // артикул
            const articleCell = document.createElement("td");
            articleCell.textContent = rowData.article;
            row.appendChild(articleCell);

            // вид заметки
            const noteTypeCell = document.createElement("td");
            noteTypeCell.textContent = rowData.noteType;
            row.appendChild(noteTypeCell);

            // комментарии
            const commentCell = document.createElement("td");
            commentCell.textContent = rowData.comment;
            row.appendChild(commentCell);

            // удалить
            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Удалить";
            deleteButton.addEventListener("click", () => {
                data.splice(index, 1);
                saveDataToLocalStorage(data);
                generateOrUpdateTable(data);
            });
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            tbody.appendChild(row);
        });
    }

    // обработчик
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const rowCount = parseInt(document.getElementById("rows").value, 10);
        const rowData = [];
        for (let i = 0; i < rowCount; i++) {
            const article = form[`article_${i}`].value;
            const noteType = form[`noteType_${i}`].value;
            const comment = form[`comment_${i}`].value;

            const existingRow = rowData.find(row => row.article === article);
            if (existingRow) {
                existingRow.noteType = noteType;
                existingRow.comment = comment;
            } else {
                rowData.push({ article, noteType, comment });
            }
        }

        saveDataToLocalStorage(rowData);
        generateOrUpdateTable(rowData);
    });

    // новая строка
    addRowButton.addEventListener("click", () => {
        const rowCount = parseInt(document.getElementById("rows").value, 10) + 1;
        document.getElementById("rows").value = rowCount;
        createRowInput(rowCount - 1);
    });

    const savedData = loadDataFromLocalStorage();
    generateOrUpdateTable(savedData);
    initializeRows();
});
