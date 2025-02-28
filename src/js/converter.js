
document.addEventListener('DOMContentLoaded', function() {
    const amountInput = document.getElementById('amountInput');
    const cryptoSelect = document.getElementById('cryptoSelect');
    const convertBtn = document.getElementById('convertBtn');
    const resultContainer = document.getElementById('resultContainer');
    const cryptoAmount = document.getElementById('cryptoAmount');
    const cryptoSymbol = document.getElementById('cryptoSymbol');
    const usdAmount = document.getElementById('usdAmount');
    const updateTime = document.getElementById('updateTime');
    const errorMessage = document.getElementById('errorMessage');
    const historyTable = document.getElementById('historyTable').querySelector('tbody');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    const cryptoMap = {
        'BTCUSDT': 'bitcoin',
        'ETHUSDT': 'ethereum',
        'BNBUSDT': 'binancecoin',
        'XRPUSDT': 'ripple',
        'ADAUSDT': 'cardano',
        'DOGEUSDT': 'dogecoin',
        'SOLUSDT': 'solana'
    };

    loadHistory();

    convertBtn.addEventListener('click', function() {
        const amount = parseFloat(amountInput.value);
        const symbol = cryptoSelect.value;
        const cryptoName = cryptoSelect.options[cryptoSelect.selectedIndex].text;

        if (isNaN(amount) || amount <= 0) {
            showError('Пожалуйста, введите корректное число');
            return;
        }

        fetchCryptoPrice(symbol, amount, cryptoName);
    });

    clearHistoryBtn.addEventListener('click', function() {
        localStorage.removeItem('conversionHistory');
        historyTable.innerHTML = '';
        toastr.success('История конвертаций очищена');
    });

    function fetchCryptoPrice(symbol, amount, cryptoName) {
        resultContainer.classList.add('d-none');
        errorMessage.classList.add('d-none');

        toastr.info('Получение данных о курсе...');

        const coinId = cryptoMap[symbol];
        if (!coinId) {
            showError('Неподдерживаемая криптовалюта');
            return;
        }

        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data[coinId] || !data[coinId].usd) {
                    throw new Error('Некорректный ответ от API');
                }

                const price = parseFloat(data[coinId].usd);
                const totalUsd = (amount * price).toFixed(2);
                const shortSymbol = symbol.replace('USDT', '');

                cryptoAmount.textContent = amount;
                cryptoSymbol.textContent = shortSymbol;
                usdAmount.textContent = totalUsd;

                const date = new Date();
                updateTime.textContent = date.toLocaleString();

                resultContainer.classList.remove('d-none');

                addToHistory({
                    date: date.toLocaleString(),
                    crypto: shortSymbol,
                    cryptoName: cryptoName.split(' ')[0],
                    amount: amount,
                    usdValue: totalUsd,
                    rate: price
                });

                toastr.success('Конвертация выполнена успешно');
            })
            .catch(error => {
                console.error('Ошибка:', error);
                showError('Произошла ошибка при получении данных о курсе');
            });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
        toastr.error(message);
    }

    function addToHistory(entry) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.cryptoName}</td>
            <td>${entry.amount}</td>
            <td>$${entry.usdValue}</td>
            <td>$${parseFloat(entry.rate).toFixed(2)}</td>
        `;

        historyTable.insertBefore(row, historyTable.firstChild);

        saveToHistory(entry);
    }

    function saveToHistory(entry) {
        let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        history.unshift(entry);

        if (history.length > 10) {
            history = history.slice(0, 10);
        }

        localStorage.setItem('conversionHistory', JSON.stringify(history));
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');

        history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.cryptoName}</td>
                <td>${entry.amount}</td>
                <td>$${entry.usdValue}</td>
                <td>$${parseFloat(entry.rate).toFixed(2)}</td>
            `;
            historyTable.appendChild(row);
        });
    }
});