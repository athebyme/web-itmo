document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productIDsInput = document.getElementById('productIDs');
    const productImagesList = document.getElementById('product-images');
    const preloader = document.getElementById('preloader');
    const errorMessage = document.getElementById('error-message');

    // скрыть прелоадер и сообщения об ошибках изначально
    preloader.style.display = 'none';
    errorMessage.style.display = 'none';

    // функция для отправки запроса и отображения изображений
    const fetchProductImages = async (productIDs) => {
        try {
            // Показать preloader
            preloader.style.display = 'block';
            productImagesList.innerHTML = ''; // очистить список
            errorMessage.style.display = 'none';

            const response = await fetch('http://176.108.252.147:8081/api/media', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productIDs }), // используем массив чисел
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            //проверяем, что data объект с ключами и массивами
            if (typeof data !== 'object' || Object.keys(data).length === 0) {
                throw new Error('Нет данных для отображения.');
            }

            //создание таблицы
            const table = document.createElement('table');
            table.classList.add('product-table');
            const thead = document.createElement('thead');
            thead.innerHTML = `
            <tr>
                <th>ID товара</th>
                <th>Изображения</th>
            </tr>
        `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            Object.entries(data).forEach(([id, images]) => {
                const row = document.createElement('tr');
                const idCell = document.createElement('td');
                idCell.textContent = id;

                const imagesCell = document.createElement('td');
                if (Array.isArray(images) && images.length > 0) {
                    images.forEach(imageUrl => {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = `Товар ${id}`;
                        img.classList.add('product-image');
                        imagesCell.appendChild(img);
                    });
                } else {
                    imagesCell.textContent = 'Нет изображений';
                }

                row.appendChild(idCell);
                row.appendChild(imagesCell);
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            productImagesList.appendChild(table);
        } catch (error) {
            errorMessage.textContent = `Произошла ошибка: ${error.message}`;
            errorMessage.style.display = 'block';
        } finally {
            // Скрыть preloader
            preloader.style.display = 'none';
        }
    };


//обработчик формы
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const productIDsInputValue = productIDsInput.value.trim();
        if (productIDsInputValue === "") {
            fetchProductImages(null); //если пусто, получить все фотографии
            return;
        }

        const productIDs = productIDsInputValue
            .split(',')
            .map(id => parseInt(id.trim(), 10)) //преобразуем в числа
            .filter(id => !isNaN(id)); //убираем некорректные значения

        const allNumbers = productIDsInputValue.split(',')
            .map(id => id.trim())
            .every(id => /^[0-9]+$/.test(id)); //проверяем, что все ID - числа

        if (!allNumbers) {
            errorMessage.textContent = 'Пожалуйста, введите корректные ID товаров (только числа).';
            errorMessage.style.display = 'block';
            return;
        }

        fetchProductImages(productIDs);
    });
});
