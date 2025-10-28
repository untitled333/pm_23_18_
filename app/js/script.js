// Чекаємо, поки весь DOM завантажиться
document.addEventListener('DOMContentLoaded', () => {
    // Завантажуємо дані з JSON файлу
    fetch('data-base/data.json')
        .then(response => response.json()) // Перетворюємо відповідь в об'єкт
        .then(data => {
            // Знаходимо елементи для імені та прізвища
            const nameElement = document.getElementById("personName");
            const lastNameElement = document.getElementById("lastName");

            // Вставляємо ім'я та прізвище з JSON у HTML
            if (nameElement) nameElement.textContent = data.firstName;
            if (lastNameElement) lastNameElement.textContent = data.lastName;

            // Функція для відображення прогресу скілів
            function renderProgressItems(items, containerId, color = "#ffca05") {
                const container = document.getElementById(containerId);
                if (!container) return; // Якщо контейнер не знайдено, виходимо
                container.innerHTML = ""; // Очищаємо контейнер перед заповненням

                // Проходимо по кожному скілу
                items.forEach(item => {
                    const div = document.createElement("div");
                    div.classList.add("EXPERTISE"); // Додаємо клас для стилів

                    // Створюємо HTML для скілу: назва + слайдер
                    div.innerHTML = `
                        <label>${item.name}</label>
                        <input type="range" class="slider" value="${item.value}">
                    `;

                    // Знаходимо слайдер і встановлюємо його стиль
                    const slider = div.querySelector(".slider");
                    slider.disabled = true; // Слайдер лише для показу
                    slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${item.value}%, #5d5d6a ${item.value}%, #5d5d6a 100%)`;

                    // Додаємо скіл в контейнер
                    container.appendChild(div);
                });
            }

            // Відображаємо експертизу (скіли) у відповідному контейнері
            renderProgressItems(data.expertise, "EXPERTISE", "#ffca05");

            // Робота з розділами досвіду
            const sections = document.querySelectorAll('.experience-section');

            sections.forEach(function (section) {
                const title = section.querySelector('.text-5'); // Заголовок розділу
                const arrow = section.querySelector('.arrow'); // Стрілка для анімації

                // Вибираємо всі блоки контенту всередині section
                const contentBlocks = section.querySelectorAll('.content-block');

                // Спочатку приховуємо всі блоки
                contentBlocks.forEach(function (block) {
                    block.classList.remove('show');
                });

                // Додаємо обробник кліку на заголовок і стрілку
                title.addEventListener('click', toggleSection);
                if (arrow) arrow.addEventListener('click', toggleSection);

                // Функція для відкривання/закривання блоків
                function toggleSection() {
                    contentBlocks.forEach(function (block) {
                        block.classList.toggle('show'); // Показуємо або ховаємо
                    });
                    if (arrow) arrow.classList.toggle('rotated'); // Повертаємо стрілку
                }
            });
        })
        .catch(error => console.error('Error loading JSON:', error)); // Якщо щось пішло не так, виводимо помилку
});
