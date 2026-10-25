// ========================================
// ГЛОБАЛЬНЕ МЕНЮ САЙТУ
// ========================================


// Отримуємо користувача,
// який зараз увійшов у акаунт
async function updateGlobalMenu() {

    const userLinks =
        document.getElementById(
            "global-menu-user-links"
        );

    const headerAuthButtons =
        document.getElementById(
            "header-auth-buttons"
        );

    const garageUserMenu =
        document.querySelector(
            ".garage-user-menu"
        );


    // ========================================
    // СТАН ДЛЯ ГОСТЯ
    // ========================================

    if (userLinks) {

        userLinks.innerHTML = `

            <a href="login.html">
                🔐 Увійти
            </a>

            <a href="register.html">
                📝 Реєстрація
            </a>

        `;

    }


    if (headerAuthButtons) {

        headerAuthButtons.innerHTML = `

            <a
                href="login.html"
                class="login-button"
            >
                Увійти
            </a>

            <a
                href="register.html"
                class="register-button"
            >
                Реєстрація
            </a>

        `;

    }


    if (garageUserMenu) {

        garageUserMenu.innerHTML = `

            <a
                href="login.html"
                class="login-button"
            >
                Увійти
            </a>

            <a
                href="register.html"
                class="register-button"
            >
                Реєстрація
            </a>

        `;

    }


    // Якщо Supabase недоступний —
    // залишаємо режим гостя
    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        return;

    }


    // ========================================
    // ПЕРЕВІРЯЄМО АКТИВНУ СЕСІЮ
    // ========================================

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            "Не вдалося перевірити сесію:",
            error
        );

        return;

    }


    const user =
        data?.session?.user;


    // Користувач не увійшов
    if (!user) {
        return;
    }


    // ========================================
    // КОРИСТУВАЧ УВІЙШОВ
    // ========================================

   if (userLinks) {

    userLinks.innerHTML = `

        <a href="garage.html">
            🚗 Мій гараж
        </a>

        <a
            href="#"
            data-auth-logout
        >
            🚪 Вийти
        </a>

        <a
            href="garage.html#delete-account"
            class="global-menu-delete-account-link"
        >
            🗑️ Видалити акаунт
        </a>

    `;

}


    if (headerAuthButtons) {

        headerAuthButtons.innerHTML = `

            <a
                href="garage.html"
                class="register-button"
            >
                Мій гараж
            </a>

            <a
                href="#"
                class="login-button header-logout-link"
                data-auth-logout
            >
                Вийти
            </a>

        `;

    }


    if (garageUserMenu) {

        garageUserMenu.innerHTML = `

            <span id="user-name">
            </span>

            <button
                type="button"
                class="logout-button"
                data-auth-logout
            >
                Вийти
            </button>

        `;


        const userName =
            garageUserMenu.querySelector(
                "#user-name"
            );


        if (userName) {

            userName.textContent =
                user.user_metadata?.name ||
                user.email ||
                "Користувач";

        }

    }


    // ========================================
    // МЕНЮ КОНКРЕТНОГО АВТОМОБІЛЯ
    // ========================================

    const carLinks =
        document.getElementById(
            "global-menu-car-links"
        );


    const params =
    new URLSearchParams(
        window.location.search
    );


// ID автомобіля, який є
// у поточній адресі сторінки
const carIdFromUrl =
    params.get("id");


// Для кожного користувача
// зберігаємо свій активний автомобіль
const activeCarStorageKey =
    "activeCarId:" +
    user.id;


// ========================================
// ВИЗНАЧАЄМО АКТИВНИЙ АВТОМОБІЛЬ
// ========================================

// Автомобіль, який був вибраний раніше
const savedCarId =
    localStorage.getItem(
        activeCarStorageKey
    );


// Спочатку пробуємо автомобіль з URL.
// Якщо його немає — беремо збережений.
let currentCarId =
    carIdFromUrl ||
    savedCarId;


// Дані поточного автомобіля
let currentCarMenuData =
    null;

let currentCarMenuError =
    null;


// ========================================
// ПЕРЕВІРЯЄМО,
// ЧИ АВТОМОБІЛЬ НАЛЕЖИТЬ КОРИСТУВАЧУ
// ========================================

if (currentCarId) {

    const currentCarMenuResult =
        await supabaseClient
            .from("cars")
            .select(
                "id, name, make, model"
            )
            .eq(
                "id",
                currentCarId
            )
            .maybeSingle();


    currentCarMenuData =
        currentCarMenuResult.data;

    currentCarMenuError =
        currentCarMenuResult.error;

}


// Якщо автомобіль з URL справді
// належить користувачу —
// тільки тепер запам'ятовуємо його
if (
    carIdFromUrl &&
    currentCarMenuData
) {

    localStorage.setItem(
        activeCarStorageKey,
        currentCarMenuData.id
    );

}


// Якщо збережений ID уже недійсний,
// прибираємо його
if (
    currentCarId &&
    !currentCarMenuData
) {

    localStorage.removeItem(
        activeCarStorageKey
    );

    currentCarId =
        null;

}


// ========================================
// ФОРМУЄМО АВТОМОБІЛЬНУ ЧАСТИНУ МЕНЮ
// ========================================

if (carLinks) {

    // ========================================
    // Є ВИБРАНИЙ АВТОМОБІЛЬ
    // ========================================

    if (
        currentCarMenuData &&
        !currentCarMenuError
    ) {

        const encodedCarId =
            encodeURIComponent(
                currentCarMenuData.id
            );


        const currentCarMenuName =
            currentCarMenuData.name ||
            "Поточний автомобіль";


        const currentCarMenuDetails =
            [
                currentCarMenuData.make,
                currentCarMenuData.model
            ]
                .filter(Boolean)
                .join(" ");


        carLinks.innerHTML = `

            <div class="global-menu-current-car">

                <span>
                    ПОТОЧНИЙ АВТОМОБІЛЬ
                </span>

                <strong>
                    🚙 ${currentCarMenuName}
                </strong>

                ${
                    currentCarMenuDetails
                        ? `
                            <small>
                                ${currentCarMenuDetails}
                            </small>
                          `
                        : ""
                }

            </div>

            <div class="global-menu-divider"></div>


            <a
                href="car.html?id=${encodedCarId}"
            >
                🚙 Мій автомобіль
            </a>

            <a
                href="maintenance.html?id=${encodedCarId}"
            >
                🔧 Обслуговування
            </a>

            <a
                href="repairs.html?id=${encodedCarId}"
            >
                🛠 Ремонти
            </a>

            <a
                href="fuel.html?id=${encodedCarId}"
            >
                ⛽ Заправки / заряджання
            </a>

            <a
                href="expenses.html?id=${encodedCarId}"
            >
                💰 Інші витрати
            </a>

            <a
                href="history.html?id=${encodedCarId}"
            >
                📋 Історія
            </a>

            <a
                href="history.html?id=${encodedCarId}#history-export"
            >
                📤 Експорт
            </a>

            <a
                href="import.html?id=${encodedCarId}"
            >
                📥 Імпорт
            </a>

        `;


        // ========================================
        // ПІДСВІЧУЄМО ПОТОЧНИЙ РОЗДІЛ
        // ========================================

        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        const currentHash =
            window.location.hash;


        const carMenuLinks =
            carLinks.querySelectorAll(
                "a"
            );


        carMenuLinks.forEach(
            function (link) {

                const linkUrl =
                    new URL(
                        link.getAttribute(
                            "href"
                        ),
                        window.location.href
                    );


                const linkPage =
                    linkUrl.pathname
                        .split("/")
                        .pop();


                const linkHash =
                    linkUrl.hash;


                const exportIsOpen =
                    currentPage ===
                        "history.html" &&
                    currentHash ===
                        "#history-export";


                let shouldBeActive =
                    false;


                if (
                    linkHash ===
                        "#history-export"
                ) {

                    shouldBeActive =
                        exportIsOpen;

                } else {

                    shouldBeActive =
                        linkPage ===
                        currentPage;


                    if (
                        linkPage ===
                            "history.html" &&
                        exportIsOpen
                    ) {

                        shouldBeActive =
                            false;

                    }

                }


                if (shouldBeActive) {

                    link.classList.add(
                        "active"
                    );

                } else {

                    link.classList.remove(
                        "active"
                    );

                }

            }
        );

    } else {

        // ========================================
        // АВТОМОБІЛЬ ЩЕ НЕ ВИБРАНИЙ
        // АБО КОРИСТУВАЧ ЙОГО НЕ МАЄ
        // ========================================

        const {
            data: userCars,
            error: userCarsError
        } =
            await supabaseClient
                .from("cars")
                .select("id")
                .limit(1);


        let noCarMessage =
            "Спочатку оберіть або додайте автомобіль у гаражі.";


        if (
            !userCarsError &&
            (
                !userCars ||
                userCars.length === 0
            )
        ) {

            noCarMessage =
                "Ви ще не додали автомобіль. " +
                "Спочатку додайте автомобіль у свій гараж.";

        } else if (
            !userCarsError &&
            userCars &&
            userCars.length > 0
        ) {

            noCarMessage =
                "Спочатку оберіть автомобіль у гаражі.";

        }


        // Зеленого блока
        // "ПОТОЧНИЙ АВТОМОБІЛЬ" тут немає
        carLinks.innerHTML = `

            <div class="global-menu-divider"></div>

            <a
                href="garage.html"
                data-menu-needs-car
            >
                🚙 Мій автомобіль
            </a>

            <a
                href="garage.html"
                data-menu-needs-car
            >
                🔧 Обслуговування
            </a>

            <a
                href="garage.html"
                data-menu-needs-car
            >
                🛠 Ремонти
            </a>

            <a
                href="garage.html"
                data-menu-needs-car
            >
                ⛽ Заправки / заряджання
            </a>

            <a
                href="garage.html"
                data-menu-needs-car
            >
                💰 Інші витрати
            </a>

            <a
                href="garage.html"
                data-menu-needs-car
            >
                📋 Історія
            </a>

            <a
                href="garage.html"
                data-menu-needs-car
            >
                📤 Експорт
            </a>

            <a
                href="garage.html"
                data-menu-needs-car
            >
                📥 Імпорт
            </a>

        `;


        const noCarMenuLinks =
            carLinks.querySelectorAll(
                "[data-menu-needs-car]"
            );


        noCarMenuLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        alert(
                            noCarMessage
                        );


                        window.location.href =
                            "garage.html";

                    }
                );

            }
        );

    }

}


    // ========================================
    // ВИХІД З АКАУНТА
    // ========================================

    const logoutControls =
        document.querySelectorAll(
            "[data-auth-logout]"
        );


    logoutControls.forEach(
        function (control) {

            control.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();


                    const { error } =
                        await supabaseClient
                            .auth
                            .signOut();


                    if (error) {

                        console.error(
                            "Помилка виходу:",
                            error
                        );

                        alert(
                            "Не вдалося вийти з акаунта."
                        );

                        return;

                    }


                    window.location.href =
                        "index.html";

                }
            );

        }
    );

}




// ========================================
// СТВОРЕННЯ МЕНЮ
// ========================================

function createGlobalMenu() {

        // ========================================
    // ЛОГОТИП ЗАВЖДИ ВЕДЕ НА ГОЛОВНУ
    // ========================================

    const siteLogos =
        document.querySelectorAll(
            "a.logo"
        );


    siteLogos.forEach(
        function (logo) {

            logo.href =
                "index.html";

        }
    );

    // Не створюємо меню двічі
    if (
        document.getElementById(
            "global-menu-button"
        )
    ) {

        return;

    }


    const menuHtml = `

        <button
            type="button"
            id="global-menu-button"
            class="global-menu-button"
            aria-label="Відкрити меню"
        >
            ☰ Меню
        </button>


        <div
            id="global-menu-overlay"
            class="global-menu-overlay"
            hidden
        >

            <div
                id="global-menu-panel"
                class="global-menu-panel"
            >

                <div class="global-menu-header">

                    <strong>
                        АвтоПомічник
                    </strong>

                    <button
                        type="button"
                        id="global-menu-close"
                        class="global-menu-close"
                        aria-label="Закрити меню"
                    >
                        ✕
                    </button>

                </div>


                <nav class="global-menu-nav">

                    <a href="index.html">
                        🏠 Головна
                    </a>


                    <div
                    id="global-menu-user-links">
                    </div>
                    <div
                    id="global-menu-car-links">
                    </div>
                    <div class="global-menu-divider"></div>

<div class="global-menu-secondary">

    <a href="help.html" id="menu-help-link">
        ❓ Допомога
    </a>

    <a href="feedback.html" id="menu-feedback-link">
        💬 Зворотний зв'язок
    </a>

    <a href="privacy.html" id="menu-privacy-link">
        🔒 Конфіденційність
    </a>

    <a href="terms.html" id="menu-terms-link">
        📄 Умови використання
    </a>

    <a href="about.html" id="menu-about-link">
        ℹ️ Про сервіс
    </a>

</div>

                </nav>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        "afterbegin",
        menuHtml
    );


    const menuButton =
        document.getElementById(
            "global-menu-button"
        );

    const menuOverlay =
        document.getElementById(
            "global-menu-overlay"
        );

    const menuPanel =
        document.getElementById(
            "global-menu-panel"
        );

    const menuClose =
        document.getElementById(
            "global-menu-close"
        );



    // ========================================
    // ВІДКРИТИ МЕНЮ
    // ========================================

    if (
        menuButton &&
        menuOverlay
    ) {

        menuButton.addEventListener(
            "click",
            function () {

                menuOverlay.hidden = false;
                document.body.classList.add(
    "global-menu-open"
);

            }
        );

    }



    // ========================================
    // ЗАКРИТИ КНОПКОЮ ✕
    // ========================================

    if (
        menuClose &&
        menuOverlay
    ) {

        menuClose.addEventListener(
            "click",
            function () {

                menuOverlay.hidden = true;
                document.body.classList.remove(
    "global-menu-open"
);

            }
        );

    }



    // ========================================
    // ЗАКРИТИ КЛІКОМ ПО ФОНУ
    // ========================================

    if (
        menuOverlay &&
        menuPanel
    ) {

        menuOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    menuOverlay
                ) {

                    menuOverlay.hidden = true;
                    document.body.classList.remove(
    "global-menu-open"
);

                }

            }
        );

    }



    // ========================================
    // ЗАКРИТИ КЛАВІШЕЮ ESC
    // ========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                menuOverlay &&
                !menuOverlay.hidden
            ) {

                menuOverlay.hidden = true;

                document.body.classList.remove(
    "global-menu-open"
);

            }

        }
    );


    // Після створення меню
    // перевіряємо авторизацію
    updateGlobalMenu();

}



// ========================================
// ЗАПУСК МЕНЮ
// ========================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        createGlobalMenu
    );

} else {

    createGlobalMenu();

}

// ========================================
// PWA — MANIFEST І THEME COLOR
// ========================================

function setupPwaHead() {

    // Manifest
    if (
        !document.querySelector(
            'link[rel="manifest"]'
        )
    ) {

        const manifestLink =
            document.createElement(
                "link"
            );

        manifestLink.rel =
            "manifest";

        manifestLink.href =
            "manifest.json";

        document.head.appendChild(
            manifestLink
        );

    }


    // Колір верхньої панелі PWA
    if (
        !document.querySelector(
            'meta[name="theme-color"]'
        )
    ) {

        const themeMeta =
            document.createElement(
                "meta"
            );

        themeMeta.name =
            "theme-color";

        themeMeta.content =
            "#2563eb";

        document.head.appendChild(
            themeMeta
        );

    }

}


setupPwaHead();