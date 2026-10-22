const supabaseUrl = "https://akzpihtzueixlgxyufxg.supabase.co";

const supabaseKey = "sb_publishable_IEPVSflHVWoBW37amWYfWw_1uhd21hY";

const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseKey
);

console.log("Supabase підключено:", supabaseClient);
// ========================================
// РЕЄСТРАЦІЯ КОРИСТУВАЧА
// ========================================

// ========================================
// ПОКАЗ / СХОВАТИ ПАРОЛЬ ПРИ РЕЄСТРАЦІЇ
// ========================================

function setupRegisterPasswordToggle(
    inputId
) {

    const passwordInput =
        document.getElementById(
            inputId
        );


    if (!passwordInput) {
        return;
    }


    // Щоб випадково не створити
    // кнопку повторно
    if (
        passwordInput.closest(
            ".password-input-wrapper"
        )
    ) {
        return;
    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "password-input-wrapper";


    passwordInput.parentNode.insertBefore(
        wrapper,
        passwordInput
    );


    wrapper.appendChild(
        passwordInput
    );


    const toggleButton =
        document.createElement(
            "button"
        );


    toggleButton.type =
        "button";

    toggleButton.className =
        "toggle-password-button";

    toggleButton.textContent =
        "Показати";

    toggleButton.setAttribute(
        "aria-label",
        "Показати пароль"
    );


    toggleButton.addEventListener(
        "click",
        function () {

            const passwordIsHidden =
                passwordInput.type ===
                "password";


            passwordInput.type =
                passwordIsHidden
                    ? "text"
                    : "password";


            toggleButton.textContent =
                passwordIsHidden
                    ? "Сховати"
                    : "Показати";


            toggleButton.setAttribute(
                "aria-label",
                passwordIsHidden
                    ? "Сховати пароль"
                    : "Показати пароль"
            );

        }
    );


    wrapper.appendChild(
        toggleButton
    );

}


setupRegisterPasswordToggle(
    "password"
);

setupRegisterPasswordToggle(
    "password-confirm"
);

setupRegisterPasswordToggle(
    "reset-password"
);

setupRegisterPasswordToggle(
    "reset-password-confirm"
);

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        // Не дозволяємо браузеру перезавантажити сторінку
        event.preventDefault();


        // Отримуємо дані з форми
        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const passwordConfirm =
            document.getElementById("password-confirm").value;


        // Перевіряємо, чи однакові паролі
        if (password !== passwordConfirm) {

            alert("Паролі не співпадають.");

            return;
        }


        // Відправляємо реєстрацію в Supabase
        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

    emailRedirectTo:
        new URL(
            "garage.html",
            window.location.href
        ).href,

    data: {
        name: name
    }

}

            });


        // Якщо сталася помилка
        if (error) {

            alert(
                "Помилка реєстрації: " + error.message
            );

            console.error(error);

            return;
        }


        // Якщо все добре
        console.log(
            "Користувача зареєстровано:",
            data
        );

        alert(
            "Акаунт створено! Перевірте вашу електронну пошту для підтвердження."
        );

    });

}
// ========================================
// ВХІД КОРИСТУВАЧА
// ========================================

const loginPasswordInput =
    document.getElementById(
        "login-password"
    );

const toggleLoginPasswordButton =
    document.getElementById(
        "toggle-login-password"
    );


if (
    loginPasswordInput &&
    toggleLoginPasswordButton
) {

    toggleLoginPasswordButton.addEventListener(
        "click",
        function () {

            const passwordIsHidden =
                loginPasswordInput.type ===
                "password";


            loginPasswordInput.type =
                passwordIsHidden
                    ? "text"
                    : "password";


            toggleLoginPasswordButton.textContent =
                passwordIsHidden
                    ? "Сховати"
                    : "Показати";


            toggleLoginPasswordButton.setAttribute(
                "aria-label",
                passwordIsHidden
                    ? "Сховати пароль"
                    : "Показати пароль"
            );

        }
    );

}

// ========================================
// ВІДНОВЛЕННЯ ПАРОЛЯ
// ========================================

const forgotPasswordLink =
    document.getElementById(
        "forgot-password-link"
    );


if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "login-email"
                );


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            if (!email) {

                alert(
                    "Спочатку введіть вашу електронну пошту у поле Email."
                );

                if (emailInput) {
                    emailInput.focus();
                }

                return;
            }


            const redirectUrl =
                window.location.origin +
                "/reset-password.html";


            const {
                error
            } =
                await supabaseClient
                    .auth
                    .resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                redirectUrl
                        }
                    );


            if (error) {

                console.error(
                    "Помилка відновлення пароля:",
                    error
                );

                alert(
                    "Не вдалося надіслати лист для відновлення пароля."
                );

                return;
            }


            alert(
                "Лист для відновлення пароля надіслано.\n\n" +
                "Перевірте вашу електронну пошту та перейдіть за посиланням у листі."
            );

        }
    );

}

// ========================================
// ВХІД ЧЕРЕЗ GOOGLE
// ========================================

const googleLoginButton =
    document.getElementById("google-login-button");

if (googleLoginButton) {

    googleLoginButton.addEventListener(
        "click",
        async function () {

            googleLoginButton.disabled = true;

            const { error } =
                await supabaseClient.auth.signInWithOAuth({

                    provider: "google",

options: {
    redirectTo:
        new URL(
            "garage.html",
            window.location.href
        ).href
}

                });

            if (error) {

                console.error(
                    "Помилка входу через Google:",
                    error
                );

                alert(
                    "Не вдалося увійти через Google: " +
                    error.message
                );

                googleLoginButton.disabled = false;
            }

        }
    );

}

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("login-email").value.trim();

        const password =
            document.getElementById("login-password").value;


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,
                password: password

            });


        if (error) {

            alert(
                "Помилка входу: " + error.message
            );

            console.error(error);

            return;
        }


        console.log(
            "Вхід успішний:",
            data
        );


        alert("Вхід виконано успішно!");


        // Пізніше тут відкриватиметься гараж
       window.location.href = "garage.html";

    });

}

// ========================================
// ЗБЕРЕЖЕННЯ НОВОГО ПАРОЛЯ
// ========================================

const resetPasswordForm =
    document.getElementById(
        "reset-password-form"
    );


if (resetPasswordForm) {

    resetPasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const password =
                document.getElementById(
                    "reset-password"
                ).value;


            const passwordConfirm =
                document.getElementById(
                    "reset-password-confirm"
                ).value;


            if (
                password !==
                passwordConfirm
            ) {

                alert(
                    "Паролі не співпадають."
                );

                return;
            }


if (password.length < 8) {

    alert(
        "Пароль повинен містити щонайменше 8 символів."
    );

    return;
}


            const {
                data: {
                    session
                }
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (!session) {

                alert(
                    "Посилання для відновлення пароля недійсне або його термін дії завершився.\n\n" +
                    "Запросіть нове посилання на сторінці входу."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const {
                error
            } =
                await supabaseClient
                    .auth
                    .updateUser({
                        password:
                            password
                    });


            if (error) {

                console.error(
                    "Помилка зміни пароля:",
                    error
                );

                alert(
                    "Не вдалося змінити пароль."
                );

                return;
            }


            alert(
                "Пароль успішно змінено!"
            );


            await supabaseClient
                .auth
                .signOut();


            window.location.href =
                "login.html";

        }
    );

}

// ========================================
// ЗАХИСТ СТОРІНКИ "МІЙ ГАРАЖ"
// ========================================

async function checkGarageAccess() {

    // Цей код запускаємо тільки на garage.html
    if (!document.body.classList.contains("garage-page")) {
        return;
    }

    // Перевіряємо поточного користувача
    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    // Якщо користувач не увійшов
    if (error || !user) {

        window.location.href = "login.html";

        return;
    }

    // Якщо користувач увійшов —
    // показуємо його ім'я
    const userName = document.getElementById("user-name");

    if (userName) {

        userName.textContent =
            user.user_metadata.name || user.email;

    }

}

checkGarageAccess();
// ========================================
// ЗАВАНТАЖЕННЯ АВТОМОБІЛІВ КОРИСТУВАЧА
// ========================================

async function loadCars() {

    // Працюємо тільки на сторінці гаража
    if (!document.body.classList.contains("garage-page")) {
        return;
    }


    const carsList =
        document.getElementById("cars-list");

    const emptyGarage =
        document.getElementById("empty-garage");


    // Отримуємо автомобілі з Supabase
    const { data: cars, error } = await supabaseClient
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });


    // Якщо сталася помилка
    if (error) {

        console.error(
            "Помилка завантаження автомобілів:",
            error
        );

        return;
    }

    // ========================================
// ПОТОЧНИЙ ВИБРАНИЙ АВТОМОБІЛЬ
// ========================================

const {
    data: {
        user: garageUser
    }
} =
    await supabaseClient
        .auth
        .getUser();


let activeCarId = null;


if (garageUser) {

    const activeCarStorageKey =
        "activeCarId:" +
        garageUser.id;


    activeCarId =
        localStorage.getItem(
            activeCarStorageKey
        );

}


    console.log(
        "Автомобілі користувача:",
        cars
    );


    // Якщо автомобілів немає
    if (!cars || cars.length === 0) {

        if (emptyGarage) {
            emptyGarage.hidden = false;
        }

        if (carsList) {
            carsList.innerHTML = "";
        }

        return;
    }


    // Якщо автомобілі є —
    // ховаємо блок "У вас ще немає автомобілів"
    if (emptyGarage) {
        emptyGarage.hidden = true;
    }

// ========================================
// ФОТО АВТОМОБІЛІВ У ГАРАЖІ
// ========================================

const carsWithPhotoUrls =
    await Promise.all(
        cars.map(
            async function (car) {

                let photoUrl =
                    null;


                if (car.photo_path) {

                    const {
                        data: signedPhotoData,
                        error: signedPhotoError
                    } =
                        await supabaseClient
                            .storage
                            .from("car-photos")
                            .createSignedUrl(
                                car.photo_path,
                                60 * 60
                            );


                    if (
                        !signedPhotoError &&
                        signedPhotoData?.signedUrl
                    ) {

                        photoUrl =
                            signedPhotoData
                                .signedUrl;

                    }

                }


                return {
                    ...car,
                    photo_url: photoUrl
                };

            }
        )
    );
    
    // Створюємо картки автомобілів
    if (carsList) {

        carsList.innerHTML = 
        carsWithPhotoUrls.map(function (car) {

            const isActiveCar =
    activeCarId === car.id;

            return `
                <div class="car-card ${isActiveCar ? "active-car-card" : ""}">

                   <div class="car-card-icon">

    ${
        car.photo_url
            ? `
                <img
                    src="${car.photo_url}"
                    alt="Фото ${car.name}"
                >
              `
            : "🚙"
    }

</div>

                    <div class="car-card-info">

                    ${isActiveCar
    ? `
        <div class="active-car-badge">
            ✓ Поточний автомобіль
        </div>
      `
    : ""
}

                        <h2>
                            ${car.name}
                        </h2>

                        <p>
                            ${car.make} ${car.model}
                        </p>

                        <p>
                            ${car.year ? car.year + " рік" : ""}
                            ${car.engine ? " • " + car.engine : ""}
                        </p>

                        <p>
                            ${
                                car.mileage
                                    ? "Пробіг: " +
                                      car.mileage.toLocaleString("uk-UA") +
                                      " км"
                                    : ""
                            }
                        </p>
                            <div class="garage-car-actions">

    <button
        type="button"
        class="open-car-button"
        data-car-id="${car.id}"
    >
        Відкрити автомобіль
    </button>

    <button
        type="button"
        class="edit-garage-car-button"
        data-car-id="${car.id}"
    >
        ✏️ Редагувати
    </button>

    <button
        type="button"
        class="delete-car-button"
        data-car-id="${car.id}"
        data-car-name="${car.name}"
    >
        🗑 Видалити
    </button>

</div>
                    </div>

                </div>
            `;

        }).join("");

    }

}

loadCars();
// ========================================
// ВІДКРИТТЯ СТОРІНКИ АВТОМОБІЛЯ
// ========================================

document.addEventListener("click", function (event) {

    const openCarButton =
        event.target.closest(".open-car-button");

    if (!openCarButton) {
        return;
    }

    // Отримуємо ID автомобіля
    const carId =
        openCarButton.dataset.carId;

    if (!carId) {
        return;
    }

    // Відкриваємо сторінку саме цього автомобіля
    window.location.href =
        "car.html?id=" + encodeURIComponent(carId);

});

// ========================================
// РЕДАГУВАННЯ АВТОМОБІЛЯ З ГАРАЖА
// ========================================

document.addEventListener(
    "click",
    function (event) {

        const editCarButton =
            event.target.closest(
                ".edit-garage-car-button"
            );


        if (!editCarButton) {
            return;
        }


        const carId =
            editCarButton.dataset.carId;


        if (!carId) {
            return;
        }


        window.location.href =
            "car.html?id=" +
            encodeURIComponent(carId) +
            "&edit=1";

    }
);
// ========================================
// ВИДАЛЕННЯ АВТОМОБІЛЯ З ГАРАЖА
// ========================================

document.addEventListener(
    "click",
    async function (event) {

        const deleteCarButton =
            event.target.closest(
                ".delete-car-button"
            );


        if (!deleteCarButton) {
            return;
        }


        const carId =
            deleteCarButton.dataset.carId;

        const carName =
            deleteCarButton.dataset.carName ||
            "цей автомобіль";


        if (!carId) {
            return;
        }


        const confirmed =
            confirm(
                `Видалити автомобіль "${carName}"?\n\n` +
                "Разом з автомобілем буде назавжди видалено " +
                "всю історію обслуговування, ремонтів, " +
                "заправок, заряджань та інших витрат.\n\n" +
                "Цю дію неможливо скасувати."
            );


        if (!confirmed) {
            return;
        }


        deleteCarButton.disabled = true;

        deleteCarButton.textContent =
            "Видалення...";


        const {
            error
        } =
            await supabaseClient
                .rpc(
                    "delete_car_and_data",
                    {
                        p_car_id: carId
                    }
                );


        if (error) {

            console.error(
                "Помилка видалення автомобіля:",
                error
            );

            alert(
                "Не вдалося видалити автомобіль."
            );


            deleteCarButton.disabled = false;

            deleteCarButton.textContent =
                "🗑 Видалити";

            return;

        }


        // Якщо саме цей автомобіль був активним —
        // прибираємо його з пам'яті
        const {
            data: sessionData
        } =
            await supabaseClient
                .auth
                .getSession();


        const currentUser =
            sessionData?.session?.user;


        if (currentUser) {

            const activeCarStorageKey =
                "activeCarId:" +
                currentUser.id;


            const activeCarId =
                localStorage.getItem(
                    activeCarStorageKey
                );


            if (activeCarId === carId) {

                localStorage.removeItem(
                    activeCarStorageKey
                );

            }

        }


        alert(
            "Автомобіль успішно видалено!"
        );


        // Одразу оновлюємо гараж без F5
        await loadCars();

    }
);
// ========================================
// ВИХІД З АКАУНТА
// ========================================

const logoutButton =
    document.getElementById("logout-button");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            const { error } =
                await supabaseClient.auth.signOut();

            if (error) {

                alert(
                    "Не вдалося вийти з акаунта."
                );

                console.error(error);

                return;
            }

            window.location.href = "index.html";

        }
    );

}
// ========================================
// ФОРМА ДОДАВАННЯ АВТОМОБІЛЯ
// ========================================

const addCarButton = document.getElementById("add-car-button");
const emptyAddButton = document.querySelector(".empty-add-button");
const carFormContainer = document.getElementById("car-form-container");
const cancelCarButton = document.getElementById("cancel-car-button");


// Відкрити форму
function openCarForm() {

    if (carFormContainer) {

        // Показуємо форму
        carFormContainer.hidden = false;

        // Плавно прокручуємо сторінку до форми
        carFormContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// Закрити форму
function closeCarForm() {

    if (carFormContainer) {
        carFormContainer.hidden = true;
    }

}


// Верхня кнопка "+ Додати автомобіль"
if (addCarButton) {

    addCarButton.addEventListener("click", openCarForm);

}


// Кнопка "+ Додати перший автомобіль"
if (emptyAddButton) {

    emptyAddButton.addEventListener("click", openCarForm);

}


// Кнопка "Скасувати"
if (cancelCarButton) {

    cancelCarButton.addEventListener("click", closeCarForm);

}
// ========================================
// ЗБЕРЕЖЕННЯ АВТОМОБІЛЯ В SUPABASE
// ========================================

const carForm = document.getElementById("car-form");

// ========================================
// ПОЛЯ БАКА / БАТАРЕЇ ПРИ СТВОРЕННІ АВТО
// ========================================

const carFuelSelect =
    document.getElementById(
        "car-fuel"
    );

const carTankCapacityInput =
    document.getElementById(
        "car-tank-capacity"
    );

const carLpgTankCapacityInput =
    document.getElementById(
        "car-lpg-tank-capacity"
    );    

const carBatteryCapacityInput =
    document.getElementById(
        "car-battery-capacity"
    );


function setNewCarEnergyFieldVisible(
    input,
    visible
) {

    if (!input) {
        return;
    }


    const label =
        document.querySelector(
            `label[for="${input.id}"]`
        );


    input.style.display =
        visible ? "" : "none";


    if (label) {

        label.style.display =
            visible ? "" : "none";

    }


    // Якщо поле більше не потрібне —
    // очищаємо його
    if (!visible) {

        input.value = "";

    }

}


function updateNewCarEnergyFields() {

    if (!carFuelSelect) {
        return;
    }


    const fuelType =
        carFuelSelect.value;


    // Спочатку визначаємо,
    // які поля потрібні
    const showFuelTank =
        fuelType === "petrol" ||
        fuelType === "diesel" ||
        fuelType === "petrol_lpg" ||
        fuelType === "hybrid" ||
        fuelType === "phev";


    const showLpgTank =
        fuelType === "lpg" ||
        fuelType === "petrol_lpg";


    const showBattery =
        fuelType === "electric" ||
        fuelType === "phev";


    // Якщо тип пального ще не вибраний —
    // поки не показуємо спеціальні поля
    if (!fuelType) {

        setNewCarEnergyFieldVisible(
            carTankCapacityInput,
            false
        );

        setNewCarEnergyFieldVisible(
            carLpgTankCapacityInput,
            false
        );

        setNewCarEnergyFieldVisible(
            carBatteryCapacityInput,
            false
        );

        return;
    }


    setNewCarEnergyFieldVisible(
        carTankCapacityInput,
        showFuelTank
    );

    setNewCarEnergyFieldVisible(
        carLpgTankCapacityInput,
        showLpgTank
    );

    setNewCarEnergyFieldVisible(
        carBatteryCapacityInput,
        showBattery
    );

}


if (carFuelSelect) {

    carFuelSelect.addEventListener(
        "change",
        updateNewCarEnergyFields
    );

    updateNewCarEnergyFields();

}

if (carForm) {

    carForm.addEventListener("submit", async function (event) {

        // Не даємо браузеру перезавантажити сторінку
        event.preventDefault();


        // Перевіряємо, хто зараз увійшов
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();


        if (userError || !user) {

            alert("Потрібно увійти в акаунт.");

            window.location.href = "login.html";

            return;
        }


        // Забираємо дані з форми
        const name =
            document.getElementById("car-name").value.trim();

        const make =
            document.getElementById("car-make").value.trim();

        const model =
            document.getElementById("car-model").value.trim();

        const year =
            document.getElementById("car-year").value;

        const engine =
            document.getElementById("car-engine").value.trim();

        const tankCapacity =
    document 
    .getElementById("car-tank-capacity") 
    .value; 
    
const lpgTankCapacity =
    document
        .getElementById(
            "car-lpg-tank-capacity"
        )
        .value;    
    
    const batteryCapacity =
    document
        .getElementById(
            "car-battery-capacity"
        )
        .value;

        const mileage =
            document.getElementById("car-mileage").value;

        const fuelType =
            document.getElementById("car-fuel").value;

            

        const transmission =
            document.getElementById("car-transmission").value;

        const licensePlate =
            document.getElementById("car-license-plate").value.trim();

        const vin =
            document.getElementById("car-vin").value.trim();


        // Записуємо автомобіль у таблицю cars
        const { data, error } = await supabaseClient
            .from("cars")
            .insert([
                {
                    user_id: user.id,
                    name: name,
                    make: make,
                    model: model,

                    year: year ? Number(year) : null,

                    engine: engine || null,

                    tank_capacity:
    tankCapacity
        ? Number(tankCapacity)
        : null,

lpg_tank_capacity:
    lpgTankCapacity
        ? Number(lpgTankCapacity)
        : null,        

        battery_capacity:
    batteryCapacity
        ? Number(batteryCapacity)
        : null,

                    mileage:
                        mileage ? Number(mileage) : null,

                    fuel_type: fuelType || null,

                    transmission:
                        transmission || null,

                    license_plate:
                        licensePlate || null,

                    vin: vin || null
                }
            ])
            .select();


        // Якщо Supabase повернув помилку
        if (error) {

            console.error(
                "Помилка збереження автомобіля:",
                error
            );

            alert(
                "Не вдалося зберегти автомобіль. " +
                "Відкрийте консоль браузера для перевірки."
            );

            return;
        }


        console.log(
            "Автомобіль успішно збережено:",
            data
        );

        alert("Автомобіль успішно додано!");

        // Очищаємо форму
        carForm.reset();

        // Ховаємо форму
        closeCarForm();

        // Одразу оновлюємо список автомобілів
// без перезавантаження сторінки
await loadCars();

    });

}
// ========================================
// СТОРІНКА КОНКРЕТНОГО АВТОМОБІЛЯ
// ========================================

async function loadCarDetails() {

    // Працюємо тільки на car.html
    if (!document.body.classList.contains("car-page")) {
        return;
    }

// ========================================
// ПЕРЕВІРКА АВТОРИЗАЦІЇ
// ========================================

const {
    data: { user },
    error: userError
} =
    await supabaseClient
        .auth
        .getUser();


if (
    userError ||
    !user
) {

    window.location.href =
        "login.html";

    return;

}    


    // Отримуємо ID автомобіля з адреси
    const params =
        new URLSearchParams(window.location.search);

    const carId =
        params.get("id");


    // Якщо ID в адресі немає
    if (!carId) {

        window.location.href = "garage.html";

        return;
    }


    // Отримуємо автомобіль із Supabase
    const { data: car, error } = await supabaseClient
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();

// ========================================
// ПЕРЕВІРКА ДОСТУПУ ДО АВТОМОБІЛЯ
// ========================================

if (
    error ||
    !car
) {

    console.error(
        "Автомобіль не знайдений або немає доступу:",
        error
    );


    window.location.href =
        "garage.html";

    return;

}        


// ========================================
// ФОТО АВТОМОБІЛЯ
// ========================================

let carPhotoUrl =
    null;


if (car.photo_path) {

    const {
        data: signedPhotoData,
        error: signedPhotoError
    } =
        await supabaseClient
            .storage
            .from("car-photos")
            .createSignedUrl(
                car.photo_path,
                60 * 60
            );


    if (
        !signedPhotoError &&
        signedPhotoData?.signedUrl
    ) {

        carPhotoUrl =
            signedPhotoData.signedUrl;

    } else {

        console.error(
            "Не вдалося отримати фото автомобіля:",
            signedPhotoError
        );

    }

}    

        const carDetails =
        document.getElementById("car-details");

    const carSections =
        document.getElementById("car-sections");


    

// ========================================
// ЄМНОСТІ ПАЛЬНОГО / LPG / БАТАРЕЇ
// ========================================

function formatCarCapacity(
    value,
    unit
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "Не вказано";
    }

    return (
        Number(value)
            .toLocaleString("uk-UA") +
        " " +
        unit
    );

}


let energyCapacityHtml = "";


if (car.fuel_type === "lpg") {

    // Для старих LPG-авто залишаємо
    // запасний варіант зі старого tank_capacity
    const lpgCapacity =
        car.lpg_tank_capacity ??
        car.tank_capacity;

    energyCapacityHtml = `
        <p>
            <strong>
                Об’єм газового балона:
            </strong>

            ${formatCarCapacity(
                lpgCapacity,
                "л"
            )}
        </p>
    `;

} else if (
    car.fuel_type === "petrol_lpg"
) {

    energyCapacityHtml = `
        <p>
            <strong>
                Об’єм паливного бака:
            </strong>

            ${formatCarCapacity(
                car.tank_capacity,
                "л"
            )}
        </p>

        <p>
            <strong>
                Об’єм газового балона:
            </strong>

            ${formatCarCapacity(
                car.lpg_tank_capacity,
                "л"
            )}
        </p>
    `;

} else if (
    car.fuel_type === "electric"
) {

    energyCapacityHtml = `
        <p>
            <strong>
                Ємність батареї:
            </strong>

            ${formatCarCapacity(
                car.battery_capacity,
                "кВт·год"
            )}
        </p>
    `;

} else if (
    car.fuel_type === "phev"
) {

    energyCapacityHtml = `
        <p>
            <strong>
                Об’єм паливного бака:
            </strong>

            ${formatCarCapacity(
                car.tank_capacity,
                "л"
            )}
        </p>

        <p>
            <strong>
                Ємність батареї:
            </strong>

            ${formatCarCapacity(
                car.battery_capacity,
                "кВт·год"
            )}
        </p>
    `;

} else {

    energyCapacityHtml = `
        <p>
            <strong>
                Об’єм паливного бака:
            </strong>

            ${formatCarCapacity(
                car.tank_capacity,
                "л"
            )}
        </p>
    `;

}
    
    // Показуємо дані автомобіля
    if (carDetails) {

        carDetails.innerHTML = `
            <div class="car-details-header">

                <div class="car-details-icon">

    ${
        carPhotoUrl
            ? `
                <img
                    src="${carPhotoUrl}"
                    alt="Фото ${car.name}"
                    class="car-details-photo"
                >
              `
            : "🚙"
    }

</div>

                <div>

                    <p class="garage-label">
                        МІЙ АВТОМОБІЛЬ
                    </p>

                    <h1>
                        ${car.name}
                    </h1>

                    <p>
                        ${car.make} ${car.model}
                    </p>

                </div>

            </div>


            <div class="car-details-info">

                <p>
                    <strong>Рік:</strong>
                    ${car.year || "Не вказано"}
                </p>

                <p>
                    <strong>Двигун:</strong>
                    ${car.engine || "Не вказано"}
                </p>

                <div class="car-mileage-row">

${energyCapacityHtml}

    <p>
        <strong>Пробіг:</strong>

        <span id="current-car-mileage">
            ${
                car.mileage !== null
                    ? Number(car.mileage).toLocaleString("uk-UA") + " км"
                    : "Не вказано"
            }
        </span>
    </p>

    <button
        type="button"
        id="update-mileage-button"
        class="update-mileage-button"
    >
        Оновити пробіг
    </button>
    <div
    class="update-mileage-form"
    id="update-mileage-form"
    hidden
>

    <label for="new-mileage-input">
        Новий пробіг
    </label>

    <input
        type="number"
        id="new-mileage-input"
        min="0"
        placeholder="Введіть пробіг"
    >

    <div class="update-mileage-actions">

        <button
            type="button"
            id="cancel-mileage-button"
        >
            Скасувати
        </button>

        <button
            type="button"
            id="save-mileage-button"
        >
            Зберегти
        </button>

    </div>

</div>

</div>

                <p>
                    <strong>Державний номер:</strong>
                    ${car.license_plate || "Не вказано"}
                </p>

                <p>
                    <strong>VIN:</strong>
                    ${car.vin || "Не вказано"}
                </p>

                <div class="car-details-actions">

    <button
        type="button"
        class="edit-car-details-button"
        id="edit-car-details-button"
    >
        ✏️ Редагувати дані
    </button>

</div>

            </div>
        `;

    }

// ========================================
// РУЧНЕ ОНОВЛЕННЯ ПРОБІГУ АВТОМОБІЛЯ
// ========================================

const updateMileageButton =
    document.getElementById("update-mileage-button");


if (updateMileageButton) {

    const updateMileageForm =
        document.getElementById("update-mileage-form");

    const newMileageInput =
        document.getElementById("new-mileage-input");

    const cancelMileageButton =
        document.getElementById("cancel-mileage-button");

    const saveMileageButton =
        document.getElementById("save-mileage-button");


    // Відкрити форму
    updateMileageButton.addEventListener(
        "click",
        function () {

            if (!updateMileageForm) {
                return;
            }

            updateMileageForm.hidden = false;

            if (newMileageInput) {

                newMileageInput.value =
                    car.mileage !== null
                        ? Number(car.mileage)
                        : "";

                newMileageInput.focus();
            }

        }
    );


    // Скасувати
    if (cancelMileageButton) {

        cancelMileageButton.addEventListener(
            "click",
            function () {

                if (updateMileageForm) {
                    updateMileageForm.hidden = true;
                }

            }
        );

    }


    // Зберегти новий пробіг
    if (saveMileageButton) {

        saveMileageButton.addEventListener(
            "click",
            async function () {

                if (!newMileageInput) {
                    return;
                }

                const currentMileage =
                    car.mileage !== null
                        ? Number(car.mileage)
                        : 0;

                const newMileage =
                    Number(newMileageInput.value);


                if (
                    !Number.isInteger(newMileage) ||
                    newMileage < 0
                ) {

                    alert(
                        "Введіть правильний пробіг у кілометрах."
                    );

                    return;
                }


                if (
                    car.mileage !== null &&
                    newMileage < currentMileage
                ) {

                    alert(
                        "Новий пробіг не може бути меншим за останній відомий пробіг."
                    );

                    return;
                }


                const { error: mileageUpdateError } =
                    await supabaseClient
                        .from("cars")
                        .update({
                            mileage: newMileage
                        })
                        .eq("id", carId);


                if (mileageUpdateError) {

                    console.error(
                        "Помилка оновлення пробігу:",
                        mileageUpdateError
                    );

                    alert(
                        "Не вдалося оновити пробіг."
                    );

                    return;
                }


                car.mileage = newMileage;


                const currentMileageElement =
                    document.getElementById(
                        "current-car-mileage"
                    );

                if (currentMileageElement) {

                    currentMileageElement.textContent =
                        newMileage.toLocaleString("uk-UA") +
                        " км";

                }


                if (updateMileageForm) {
                    updateMileageForm.hidden = true;
                }


                await loadMaintenance();


                alert(
                    "Пробіг успішно оновлено!"
                );

            }
        );

    }
}



    // Показуємо розділи автомобіля
    if (carSections) {
        carSections.hidden = false;
    }

    // Якщо прийшли сюди після натискання
// "Редагувати дані" з іншої сторінки
if (params.get("edit") === "1") {

    setTimeout(
        function () {

            const editButton =
                document.getElementById(
                    "edit-car-details-button"
                );


            if (editButton) {

                editButton.click();

            }

        },
        0
    );

}

}


loadCarDetails();
// ========================================
// ФОРМА ДОДАВАННЯ ОБСЛУГОВУВАННЯ
// ========================================

const addMaintenanceButton =
    document.getElementById("add-maintenance-button");

const maintenanceFormContainer =
    document.getElementById("maintenance-form-container");

const cancelMaintenanceButton =
    document.getElementById("cancel-maintenance-button");


// Відкрити форму обслуговування
function openMaintenanceForm() {

    if (maintenanceFormContainer) {

        maintenanceFormContainer.hidden = false;

        maintenanceFormContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// Закрити форму обслуговування
function closeMaintenanceForm() {

    if (maintenanceFormContainer) {
        maintenanceFormContainer.hidden = true;
    }

}


// Кнопка "+ Додати обслуговування"
if (addMaintenanceButton) {

    addMaintenanceButton.addEventListener(
        "click",
        function () {

            // Це нове обслуговування,
            // тому режим редагування вимикаємо
            editingMaintenanceId = null;
            completedReminderSourceId = null;

            // Очищаємо форму
            document
                .getElementById("maintenance-form")
                ?.reset();

            // Показуємо режим додавання
const formTitle =
    document.getElementById("maintenance-form-title");

const saveButton =
    document.getElementById("save-maintenance-button");

if (formTitle) {
    formTitle.textContent = "Нове обслуговування";
}

if (saveButton) {
    saveButton.textContent = "Зберегти";
}
                // Відкриваємо чисту форму
            openMaintenanceForm();

        }
    );

}


// Кнопка "Скасувати"
if (cancelMaintenanceButton) {

    cancelMaintenanceButton.addEventListener(
        "click",
        function () {

            // Виходимо з режиму редагування
            editingMaintenanceId = null;
            completedReminderSourceId = null;

            // Очищаємо форму
            document
                .getElementById("maintenance-form")
                ?.reset();

            // Закриваємо форму
            closeMaintenanceForm();

        }
    );

}
// ========================================
// ЗБЕРЕЖЕННЯ ОБСЛУГОВУВАННЯ В SUPABASE
// ========================================

// ID запису, який зараз редагуємо.
// null означає, що створюємо новий запис.
let editingMaintenanceId = null;
// ID старого обслуговування,
// нагадування якого зараз виконуємо
let completedReminderSourceId = null;

const maintenanceForm =
    document.getElementById("maintenance-form");

if (maintenanceForm) {

    maintenanceForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Отримуємо ID автомобіля з адреси
            const params =
                new URLSearchParams(window.location.search);

            const carId =
                params.get("id");


            if (!carId) {

                alert("Не вдалося визначити автомобіль.");

                return;
            }


            // Отримуємо дані з форми
            const title =
                document
                    .getElementById("maintenance-title")
                    .value
                    .trim();

            const serviceDate =
                document
                    .getElementById("maintenance-date")
                    .value;

            const mileage =
                document
                    .getElementById("maintenance-mileage")
                    .value;

            const cost =
                document
                    .getElementById("maintenance-cost")
                    .value;

            const servicePlace =
                document
                    .getElementById("maintenance-place")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("maintenance-description")
                    .value
                    .trim();


            // Готуємо дані для Supabase
            const maintenanceData = {

    car_id: carId,

    title: title,

    service_date: serviceDate,

    mileage:
        mileage
            ? Number(mileage)
            : null,

    cost:
        cost
            ? Number(cost)
            : null,

    service_place:
        servicePlace || null,

    description:
        description || null,


    // ========================================
    // НАГАДУВАННЯ
    // ========================================

    reminder_enabled:
        document
            .getElementById("reminder-enabled")
            ?.checked || false,

    reminder_mileage_interval:
        document
            .getElementById("reminder-mileage")
            ?.value
            ? Number(
                document
                    .getElementById("reminder-mileage")
                    .value
            )
            : null,

    reminder_months_interval:
        document
            .getElementById("reminder-months")
            ?.value
            ? Number(
                document
                    .getElementById("reminder-months")
                    .value
            )
            : null

};


            let result;


            // Якщо редагуємо існуючий запис
            if (editingMaintenanceId) {

                result = await supabaseClient
                    .from("maintenance")
                    .update(maintenanceData)
                    .eq("id", editingMaintenanceId)
                    .select();

            }

            // Якщо додаємо новий запис
            else {

                result = await supabaseClient
                    .from("maintenance")
                    .insert([
                        maintenanceData
                    ])
                    .select();

            }


            const { data, error } = result;


            // Якщо сталася помилка
            if (error) {

                console.error(
                    "Помилка збереження обслуговування:",
                    error
                );

                alert(
                    "Не вдалося зберегти обслуговування."
                );

                return;
            }


            console.log(
                "Обслуговування збережено:",
                data
            );

            // ========================================
// АВТОМАТИЧНО ОНОВЛЮЄМО ПРОБІГ АВТОМОБІЛЯ
// ========================================

if (mileage) {

    const newMileage = Number(mileage);


    // Отримуємо поточний пробіг автомобіля
    const {
        data: carMileageData,
        error: carMileageError
    } = await supabaseClient
        .from("cars")
        .select("mileage")
        .eq("id", carId)
        .single();




    if (carMileageError) {

        console.error(
            "Не вдалося отримати пробіг автомобіля:",
            carMileageError
        );

    } else {

        const currentCarMileage =
            carMileageData?.mileage !== null
                ? Number(carMileageData.mileage)
                : null;


        // Оновлюємо тільки якщо:
        // 1. у автомобіля пробіг ще не вказаний
        // або
        // 2. новий пробіг більший
        if (
            currentCarMileage === null ||
            newMileage > currentCarMileage
        ) {

            const {
                error: updateMileageError
            } = await supabaseClient
                .from("cars")
                .update({
                    mileage: newMileage
                })
                .eq("id", carId);


            if (updateMileageError) {

                console.error(
                    "Не вдалося оновити пробіг автомобіля:",
                    updateMileageError
                );

            } else {

                console.log(
                    "Пробіг автомобіля оновлено:",
                    newMileage
                );

            }

        }

    }

}
             // ========================================
// ЗАКРИВАЄМО СТАРЕ НАГАДУВАННЯ
// ========================================

if (completedReminderSourceId) {

    const {
        error: completeReminderError
    } = await supabaseClient
        .from("maintenance")
        .update({
            reminder_enabled: false
        })
        .eq(
            "id",
            completedReminderSourceId
        );


    if (completeReminderError) {

        console.error(
            "Не вдалося закрити старе нагадування:",
            completeReminderError
        );

    } else {

        console.log(
            "Старе нагадування закрито:",
            completedReminderSourceId
        );

    }


    // Завершили цей цикл
    completedReminderSourceId = null;

}

            // Показуємо правильне повідомлення
            if (editingMaintenanceId) {

                alert(
                    "Обслуговування успішно оновлено!"
                );

            } else {

                alert(
                    "Обслуговування успішно додано!"
                );

            }


            // Редагування завершено
            editingMaintenanceId = null;

        

            // Очищаємо форму
            maintenanceForm.reset();


            // Закриваємо форму
            closeMaintenanceForm();


            // Оновлюємо історію без перезавантаження
            await loadMaintenance();

        }
    );

}
// ========================================
// ЗАВАНТАЖЕННЯ ІСТОРІЇ ОБСЛУГОВУВАННЯ
// ========================================

async function loadMaintenance() {

    // Цей код потрібен тільки на сторінці car.html
    const maintenanceList =
        document.getElementById("maintenance-list");

    if (!maintenanceList) {
        return;
    }


    // Беремо ID автомобіля з адреси:
    // car.html?id=...
    const params =
        new URLSearchParams(window.location.search);

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }

// ========================================
// ОТРИМУЄМО ОСТАННІЙ ВІДОМИЙ ПРОБІГ АВТОМОБІЛЯ
// ========================================

const {
    data: carData,
    error: carError
} = await supabaseClient
    .from("cars")
    .select("mileage")
    .eq("id", carId)
    .single();


if (carError) {

    console.error(
        "Не вдалося отримати пробіг автомобіля:",
        carError
    );

}


const currentCarMileage =
    carData?.mileage !== null &&
    carData?.mileage !== undefined
        ? Number(carData.mileage)
        : null;

    // Завантажуємо обслуговування саме цього автомобіля
    const { data, error } = await supabaseClient
        .from("maintenance")
        .select("*")
        .eq("car_id", carId)
        .order("service_date", {
            ascending: false
        });


    if (error) {

        console.error(
            "Помилка завантаження обслуговування:",
            error
        );

        return;
    }


    console.log(
        "Історія обслуговування:",
        data
    );


    // Очищаємо список
    maintenanceList.innerHTML = "";
// ========================================
// СПИСОК НАЙБЛИЖЧИХ НАГАДУВАНЬ
// ========================================

const reminders = [];

const carReminders =
    document.getElementById("car-reminders");

const carRemindersList =
    document.getElementById("car-reminders-list");


if (carRemindersList) {
    carRemindersList.innerHTML = "";
}

if (carReminders) {
    carReminders.hidden = true;
}

    // Якщо записів ще немає
    if (data.length === 0) {

        maintenanceList.innerHTML = `
            <div class="maintenance-empty">
                <p>
                    Історія обслуговування поки порожня.
                </p>
            </div>
        `;

        return;
    }


    // Створюємо картку для кожного запису
    data.forEach(function (item) {

        const card =
            document.createElement("div");

        card.className = "maintenance-card";


        // Форматуємо дату
        let formattedDate = "Дата не вказана";

        if (item.service_date) {

            const dateParts =
                item.service_date.split("-");

            formattedDate =
                `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        }


        // Форматуємо пробіг
        let mileageText = "";

        if (item.mileage !== null) {

            mileageText =
                Number(item.mileage)
                    .toLocaleString("uk-UA") +
                " км";

        }


        // Форматуємо вартість
        let costText = "";

        if (item.cost !== null) {

            costText =
                Number(item.cost)
                    .toLocaleString("uk-UA") +
                " грн";

        }

        // ========================================
// РОЗРАХОВУЄМО НАСТУПНЕ ОБСЛУГОВУВАННЯ
// ДЛЯ КАРТКИ
// ========================================

let nextMileageText = "";
let nextDateText = "";

let mileageStatusText = "";
let dateStatusText = "";
let reminderStatus = "ok";
let reminderStatusText = "";

// Наступний пробіг
if (
    item.reminder_enabled &&
    item.mileage !== null &&
    item.reminder_mileage_interval !== null
) {

    const nextMileage =
        Number(item.mileage) +
        Number(item.reminder_mileage_interval);

    nextMileageText =
        nextMileage.toLocaleString("uk-UA") +
        " км";
        // Порівнюємо з останнім відомим пробігом
if (currentCarMileage !== null) {

    const mileageDifference =
        nextMileage - currentCarMileage;

        // Визначаємо стан нагадування за пробігом
if (mileageDifference <= 0) {

    reminderStatus = "overdue";

} else if (mileageDifference <= 1000) {

    reminderStatus = "soon";

}


    if (mileageDifference > 0) {

        mileageStatusText =
            "Залишилося: " +
            mileageDifference.toLocaleString("uk-UA") +
            " км";

    } else if (mileageDifference === 0) {

        mileageStatusText =
            "Час виконати обслуговування";

    } else {

        mileageStatusText =
            "Прострочено на " +
            Math.abs(mileageDifference)
                .toLocaleString("uk-UA") +
            " км";

    }

}

}


// ========================================
// НАСТУПНА ДАТА ТА СТАТУС ЗА ЧАСОМ
// ========================================

if (
    item.reminder_enabled &&
    item.service_date &&
    item.reminder_months_interval !== null
) {

    const nextDate =
        new Date(item.service_date + "T00:00:00");

    nextDate.setMonth(
        nextDate.getMonth() +
        Number(item.reminder_months_interval)
    );


    nextDateText =
        nextDate.toLocaleDateString("uk-UA");


    // Поточна дата
    const today = new Date();

    // Прибираємо години, хвилини та секунди,
    // щоб порівнювати саме календарні дні
    today.setHours(0, 0, 0, 0);

    nextDate.setHours(0, 0, 0, 0);


    const differenceMilliseconds =
        nextDate.getTime() - today.getTime();


    const differenceDays =
        Math.ceil(
            differenceMilliseconds /
            (1000 * 60 * 60 * 24)
        );

        // ========================================
// ВИЗНАЧАЄМО СТАН НАГАДУВАННЯ ЗА ДАТОЮ
// ========================================

// Дата вже настала або минула
if (differenceDays <= 0) {

    reminderStatus = "overdue";

}

// До обслуговування залишилося 30 днів або менше
else if (
    differenceDays <= 30 &&
    reminderStatus !== "overdue"
) {

    reminderStatus = "soon";

}


    // Майбутня дата
    if (differenceDays > 0) {

        if (differenceDays >= 60) {

            const approximateMonths =
                Math.round(
                    differenceDays / 30.44
                );

            dateStatusText =
                "До дати залишилося приблизно: " +
                approximateMonths +
                " міс.";

        } else {

            dateStatusText =
                "До дати залишилося: " +
                differenceDays +
                " дн.";

        }

    }

    // ТО потрібно зробити сьогодні
    else if (differenceDays === 0) {

        dateStatusText =
            "Дата обслуговування настала сьогодні";

    }

    // Дата вже минула
    else {

        dateStatusText =
            "Прострочено за датою на " +
            Math.abs(differenceDays) +
            " дн.";

    }

}
// ========================================
// ТЕКСТ ЗАГАЛЬНОГО СТАТУСУ НАГАДУВАННЯ
// ========================================

if (item.reminder_enabled) {

    if (reminderStatus === "overdue") {

        reminderStatusText =
            "🔴 Потрібне обслуговування";

    } else if (reminderStatus === "soon") {

        reminderStatusText =
            "🟡 Скоро обслуговування";

    } else {

        reminderStatusText =
            "🟢 Все добре";

    }

}
// Додаємо активне нагадування
// до загального списку автомобіля
if (item.reminder_enabled) {

   reminders.push({

    // ID старого обслуговування
    id: item.id,

    title: item.title,

    status: reminderStatus,

    statusText: reminderStatusText,

    nextMileageText: nextMileageText,

    nextDateText: nextDateText,

    mileageStatusText: mileageStatusText,

    dateStatusText: dateStatusText,


    // Зберігаємо інтервали,
    // щоб перенести їх у наступне обслуговування
    reminderMileageInterval:
        item.reminder_mileage_interval,

    reminderMonthsInterval:
        item.reminder_months_interval

});

}

        card.innerHTML = `
    <div class="maintenance-card-summary">

        <div class="maintenance-card-top">

            <div>
                <h3>${item.title}</h3>

                <p class="maintenance-date">
                    📅 ${formattedDate}
                </p>
            </div>

            ${
                costText
                    ? `<strong class="maintenance-cost">
                           ${costText}
                       </strong>`
                    : ""
            }

        </div>

        <div class="maintenance-info">

            ${
                mileageText
                    ? `<span>🛣 ${mileageText}</span>`
                    : ""
            }

            <span class="maintenance-open-text">
                Детальніше ↓
            </span>

        </div>

    </div>


    <div class="maintenance-details" hidden>

        <div class="maintenance-detail-row">
            <strong>Дата:</strong>
            <span>${formattedDate}</span>
        </div>

        ${
            mileageText
                ? `
                    <div class="maintenance-detail-row">
                        <strong>Пробіг:</strong>
                        <span>${mileageText}</span>
                    </div>
                `
                : ""
        }

        ${
            costText
                ? `
                    <div class="maintenance-detail-row">
                        <strong>Вартість:</strong>
                        <span>${costText}</span>
                    </div>
                `
                : ""
        }

        ${
            item.service_place
                ? `
                    <div class="maintenance-detail-row">
                        <strong>Місце:</strong>
                        <span>${item.service_place}</span>
                    </div>
                `
                : ""
        }

        ${
            item.description
                ? `
                    <div class="maintenance-detail-description">
                        <strong>Опис:</strong>
                        <p>${item.description}</p>
                    </div>
                `
                : ""
        }
        ${
    item.reminder_enabled
        ? `
            <div class="maintenance-reminder-info">

                <strong>
                    🔔 Наступне обслуговування
                </strong>
                ${
    reminderStatusText
        ? `
            <div class="maintenance-reminder-status">
                ${reminderStatusText}
            </div>
        `
        : ""
}

                ${
                    nextMileageText
                        ? `
                            <div class="maintenance-detail-row">
                                <span>Пробіг:</span>
                                <span>${nextMileageText}</span>
                            </div>
                        `
                        : ""
                }
                ${
    mileageStatusText
        ? `
            <div class="maintenance-mileage-status">
                ${mileageStatusText}
            </div>
        `
        : ""
}

                ${
                    nextDateText
                        ? `
                            <div class="maintenance-detail-row">
                                <span>Дата:</span>
                                <span>${nextDateText}</span>
                            </div>
                        `
                        : ""
                }
                ${
    dateStatusText
        ? `
            <div class="maintenance-date-status">
                ${dateStatusText}
            </div>
        `
        : ""
}

                ${
                    nextMileageText && nextDateText
                        ? `
                            <p>
                                Що настане раніше
                            </p>
                        `
                        : ""
                }

            </div>
        `
        : ""
}

        <div class="maintenance-actions">

            <button
                type="button"
                class="edit-maintenance-button"
            >
                ✏️ Редагувати
            </button>

            <button
                type="button"
                class="delete-maintenance-button"
            >
                🗑 Видалити
            </button>

        </div>

    </div>
`;

const summary =
    card.querySelector(".maintenance-card-summary");

const details =
    card.querySelector(".maintenance-details");

const openText =
    card.querySelector(".maintenance-open-text");

    const editButton =
    card.querySelector(".edit-maintenance-button");

const deleteButton =
    card.querySelector(".delete-maintenance-button");

summary.addEventListener("click", function () {

    const isClosed = details.hidden;

    details.hidden = !isClosed;

    openText.textContent =
        isClosed
            ? "Згорнути ↑"
            : "Детальніше ↓";

});
// ========================================
// РЕДАГУВАННЯ ОБСЛУГОВУВАННЯ
// ========================================

editButton.addEventListener("click", function (event) {

    // Щоб клік по кнопці не згортав картку
    event.stopPropagation();
    editingMaintenanceId = item.id;
    // Показуємо режим редагування
const formTitle =
    document.getElementById("maintenance-form-title");

const saveButton =
    document.getElementById("save-maintenance-button");

if (formTitle) {
    formTitle.textContent =
        "Редагувати обслуговування";
}

if (saveButton) {
    saveButton.textContent =
        "Зберегти зміни";
}
    // Відкриваємо форму
    openMaintenanceForm();


    // Заповнюємо форму даними цього запису
    document.getElementById("maintenance-title").value =
        item.title || "";

    document.getElementById("maintenance-date").value =
        item.service_date || "";

    document.getElementById("maintenance-mileage").value =
        item.mileage ?? "";

    document.getElementById("maintenance-cost").value =
        item.cost ?? "";

    document.getElementById("maintenance-place").value =
        item.service_place || "";

    document.getElementById("maintenance-description").value =
        item.description || "";

       // ========================================
// ЗАВАНТАЖУЄМО НАГАДУВАННЯ У ФОРМУ
// ========================================

const reminderEnabledInput =
    document.getElementById("reminder-enabled");

const reminderMileageInput =
    document.getElementById("reminder-mileage");

const reminderMonthsInput =
    document.getElementById("reminder-months");

const reminderSettingsBlock =
    document.getElementById("reminder-settings");


if (reminderEnabledInput) {

    reminderEnabledInput.checked =
        item.reminder_enabled === true;

}


if (reminderMileageInput) {

    reminderMileageInput.value =
        item.reminder_mileage_interval ?? "";

}


if (reminderMonthsInput) {

    reminderMonthsInput.value =
        item.reminder_months_interval ?? "";

}


// Якщо нагадування увімкнене —
// показуємо його налаштування
if (reminderSettingsBlock) {

    reminderSettingsBlock.hidden =
        !item.reminder_enabled;

}


// Перераховуємо текст:
// "257 000 км або 01.10.2027"
updateReminderPreview();

    console.log(
        "Редагуємо запис:",
        item.id
    );

});
// ========================================
// ВИДАЛЕННЯ ОБСЛУГОВУВАННЯ
// ========================================

deleteButton.addEventListener(
    "click",
    async function (event) {

        // Щоб картка не згорталася
        event.stopPropagation();


        // Запитуємо підтвердження
        const confirmed = confirm(
            `Видалити запис "${item.title}"?`
        );


        // Якщо користувач натиснув "Скасувати"
        if (!confirmed) {
            return;
        }


        // Видаляємо запис із Supabase
        const { error } = await supabaseClient
            .from("maintenance")
            .delete()
            .eq("id", item.id);


        // Якщо сталася помилка
        if (error) {

            console.error(
                "Помилка видалення обслуговування:",
                error
            );

            alert(
                "Не вдалося видалити запис."
            );

            return;
        }


        alert(
            "Запис успішно видалено!"
        );


        // Оновлюємо список без перезавантаження
        await loadMaintenance();

    }
);
        maintenanceList.appendChild(card);

    });


    // ========================================
    // ПОКАЗУЄМО ЗАГАЛЬНИЙ СПИСОК НАГАДУВАНЬ
    // ========================================

    if (
        carReminders &&
        carRemindersList &&
        reminders.length > 0
    ) {

        // Важливість статусів:
        // overdue -> soon -> ok
        const statusPriority = {
            overdue: 1,
            soon: 2,
            ok: 3
        };


        // Сортуємо нагадування
        reminders.sort(function (a, b) {

            return (
                statusPriority[a.status] -
                statusPriority[b.status]
            );

        });


        // Очищаємо список перед виведенням
        carRemindersList.innerHTML = "";


        // Створюємо картку кожного нагадування
        reminders.forEach(function (reminder) {

            const reminderCard =
                document.createElement("div");

            reminderCard.className =
    "car-reminder-card " +
    "car-reminder-" +
    reminder.status;


          reminderCard.innerHTML = `

    <h3>
        ${reminder.title}
    </h3>

    <div class="car-reminder-status">
        ${reminder.statusText}
    </div>


    <div class="reminder-data-grid">

        ${
            reminder.nextMileageText
                ? `
                    <div class="reminder-data-box">

                        <span class="reminder-data-label">
                            Наступний пробіг
                        </span>

                        <strong>
                            ${reminder.nextMileageText}
                        </strong>

                        ${
                            reminder.mileageStatusText
                                ? `
                                    <small>
                                        ${reminder.mileageStatusText}
                                    </small>
                                `
                                : ""
                        }

                    </div>
                `
                : ""
        }


        ${
            reminder.nextDateText
                ? `
                    <div class="reminder-data-box">

                        <span class="reminder-data-label">
                            Наступна дата
                        </span>

                        <strong>
                            ${reminder.nextDateText}
                        </strong>

                        ${
                            reminder.dateStatusText
                                ? `
                                    <small>
                                        ${reminder.dateStatusText}
                                    </small>
                                `
                                : ""
                        }

                    </div>
                `
                : ""
        }

    </div>


    ${
        reminder.nextMileageText &&
        reminder.nextDateText
            ? `
                <p>
                    <strong>
                        Що настане раніше
                    </strong>
                </p>
            `
            : ""
    }


    <div class="car-reminder-actions">

        <button
            type="button"
            class="complete-reminder-button"
        >
            ✓ Виконано
        </button>

    </div>

`;

            // ========================================
// КНОПКА "ВИКОНАНО"
// ========================================

const completeButton =
    reminderCard.querySelector(
        ".complete-reminder-button"
    );


if (completeButton) {

    completeButton.addEventListener(
        "click",
        function () {

            // Це НЕ редагування старого запису.
            // Ми створюватимемо нове обслуговування.
            editingMaintenanceId = null;
            
            // Запам'ятовуємо ID старого обслуговування,
// нагадування якого зараз виконуємо
completedReminderSourceId =
    reminder.id;

            // Відкриваємо форму
            openMaintenanceForm();


            // Заголовок форми
            const formTitle =
                document.getElementById(
                    "maintenance-form-title"
                );

            if (formTitle) {

                formTitle.textContent =
                    "Виконане обслуговування";

            }


            // Кнопка збереження
            const saveButton =
                document.getElementById(
                    "save-maintenance-button"
                );

            if (saveButton) {

                saveButton.textContent =
                    "Зберегти";

            }


            // Назва роботи
            const titleInput =
                document.getElementById(
                    "maintenance-title"
                );

            if (titleInput) {

                titleInput.value =
                    reminder.title || "";

            }


            // Поточна дата
            const dateInput =
                document.getElementById(
                    "maintenance-date"
                );

            if (dateInput) {

                const today =
                    new Date();

                const year =
                    today.getFullYear();

                const month =
                    String(
                        today.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        today.getDate()
                    ).padStart(2, "0");

                dateInput.value =
                    `${year}-${month}-${day}`;

            }


            // Поточний пробіг автомобіля
            const mileageInput =
                document.getElementById(
                    "maintenance-mileage"
                );

            if (mileageInput) {

                mileageInput.value =
                    currentCarMileage ?? "";

            }


            // Увімкнене наступне нагадування
            const reminderEnabledInput =
                document.getElementById(
                    "reminder-enabled"
                );

            if (reminderEnabledInput) {

                reminderEnabledInput.checked =
                    true;

            }


            // Через скільки км нагадати знову
            const reminderMileageInput =
                document.getElementById(
                    "reminder-mileage"
                );

            if (reminderMileageInput) {

                reminderMileageInput.value =
                    reminder.reminderMileageInterval
                    ?? "";

            }


            // Через скільки місяців нагадати знову
            const reminderMonthsInput =
                document.getElementById(
                    "reminder-months"
                );

            if (reminderMonthsInput) {

                reminderMonthsInput.value =
                    reminder.reminderMonthsInterval
                    ?? "";

            }


            // Показуємо налаштування нагадування
            const reminderSettingsBlock =
                document.getElementById(
                    "reminder-settings"
                );

            if (reminderSettingsBlock) {

                reminderSettingsBlock.hidden =
                    false;

            }


            // Перераховуємо майбутній пробіг і дату
            updateReminderPreview();


            // Прокручуємо сторінку до форми
            const formContainer =
                document.getElementById(
                    "maintenance-form-container"
                );

            if (formContainer) {

                formContainer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}
            carRemindersList.appendChild(
                reminderCard
            );

        });


        // Показуємо весь блок нагадувань
        carReminders.hidden = false;

    }

}


// Завантажуємо історію при відкритті car.html
loadMaintenance();
// ========================================
// ПОКАЗ НАЛАШТУВАНЬ НАГАДУВАННЯ
// ========================================

const reminderEnabled =
    document.getElementById("reminder-enabled");

const reminderSettings =
    document.getElementById("reminder-settings");

if (reminderEnabled && reminderSettings) {

    reminderEnabled.addEventListener(
        "change",
        function () {

            if (reminderEnabled.checked) {

                // Галочка встановлена —
                // показуємо налаштування
                reminderSettings.hidden = false;

            } else {

                // Галочка знята —
                // ховаємо налаштування
                reminderSettings.hidden = true;

            }

        }
    );

}
// ========================================
// РОЗРАХУНОК НАСТУПНОГО ОБСЛУГОВУВАННЯ
// ========================================

const reminderMileage =
    document.getElementById("reminder-mileage");

const reminderMonths =
    document.getElementById("reminder-months");

const maintenanceMileage =
    document.getElementById("maintenance-mileage");

const maintenanceDate =
    document.getElementById("maintenance-date");

const reminderPreview =
    document.getElementById("reminder-preview");


function updateReminderPreview() {

    if (!reminderPreview) {
        return;
    }


    // Якщо нагадування вимкнене
    if (!reminderEnabled?.checked) {

        reminderPreview.textContent = "";

        return;
    }


    const currentMileage =
        Number(maintenanceMileage?.value);

    const mileageInterval =
        Number(reminderMileage?.value);

    const monthsInterval =
        Number(reminderMonths?.value);


    const serviceDate =
        maintenanceDate?.value;


    let nextMileage = null;
    let nextDateText = null;


    // Розраховуємо наступний пробіг
    if (currentMileage && mileageInterval) {

        nextMileage =
            currentMileage + mileageInterval;

    }


    // Розраховуємо наступну дату
    if (serviceDate && monthsInterval) {

        const nextDate =
            new Date(serviceDate + "T00:00:00");

        nextDate.setMonth(
            nextDate.getMonth() + monthsInterval
        );


        nextDateText =
            nextDate.toLocaleDateString("uk-UA");

    }


    // Якщо задано і пробіг, і дату
    if (nextMileage && nextDateText) {

        reminderPreview.textContent =
            "Наступне обслуговування: " +
            nextMileage.toLocaleString("uk-UA") +
            " км або " +
            nextDateText +
            " — що настане раніше.";

    }

    // Тільки пробіг
    else if (nextMileage) {

        reminderPreview.textContent =
            "Наступне обслуговування: " +
            nextMileage.toLocaleString("uk-UA") +
            " км.";

    }

    // Тільки дата
    else if (nextDateText) {

        reminderPreview.textContent =
            "Наступне обслуговування: " +
            nextDateText +
            ".";

    }

    // Недостатньо даних
    else {

        reminderPreview.textContent = "";

    }

}


// Перераховуємо при зміні будь-якого поля
[
    reminderMileage,
    reminderMonths,
    maintenanceMileage,
    maintenanceDate
].forEach(function (element) {

    if (element) {

        element.addEventListener(
            "input",
            updateReminderPreview
        );

        element.addEventListener(
            "change",
            updateReminderPreview
        );

    }

});


// Перераховуємо також при вмиканні нагадування
if (reminderEnabled) {

    reminderEnabled.addEventListener(
        "change",
        updateReminderPreview
    );

}

// ========================================
// ЗВОРОТНИЙ ЗВ'ЯЗОК
// ========================================

const feedbackForm =
    document.getElementById("feedback-form");


if (feedbackForm) {

    feedbackForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("feedback-name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("feedback-email")
                    .value
                    .trim();

            const subject =
                document
                    .getElementById("feedback-subject")
                    .value
                    .trim();

            const message =
                document
                    .getElementById("feedback-message")
                    .value
                    .trim();


            // Перевіряємо, чи всі поля заповнені
            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                alert(
                    "Будь ласка, заповніть усі поля."
                );

                return;

            }


            const submitButton =
                feedbackForm.querySelector(
                    ".feedback-submit-button"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Надсилання...";

            }

// Отримуємо поточного користувача
const { data: userData, error: userError } =
    await supabaseClient.auth.getUser();

if (userError || !userData.user) {

    alert("Щоб надіслати повідомлення, увійдіть в акаунт.");

    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Надіслати повідомлення";
    }

    return;
}

const feedbackUserId = userData.user.id;
            
            // Зберігаємо повідомлення в Supabase
            const { error } =
                await supabaseClient
                    .from("feedback")
                    .insert([
{
    user_id: feedbackUserId,
    name: name,
    email: email,
    subject: subject,
    message: message
}
                    ]);


            if (error) {

                console.error(
                    "Помилка надсилання повідомлення:",
                    error
                );


                alert(
                    "Не вдалося надіслати повідомлення."
                );


                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Надіслати повідомлення";

                }

                return;

            }


            alert(
                "Повідомлення успішно надіслано!"
            );


            feedbackForm.reset();


            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Надіслати повідомлення";

            }

        }
    );

}

// ========================================
// ФОРМА ДОДАВАННЯ РЕМОНТУ
// ========================================

const addRepairButton =
    document.getElementById("add-repair-button");

const repairFormContainer =
    document.getElementById("repair-form-container");

const repairForm =
    document.getElementById("repair-form");

const cancelRepairButton =
    document.getElementById("cancel-repair-button");
    // ID ремонту, який зараз редагуємо.
// null = створюємо новий ремонт.
let editingRepairId = null;


// ========================================
// ВІДКРИТИ ФОРМУ РЕМОНТУ
// ========================================

if (
    addRepairButton &&
    repairFormContainer
) {

    addRepairButton.addEventListener(
        "click",
        function () {

            // Це новий ремонт, а не редагування
editingRepairId = null;


const repairFormTitle =
    document.getElementById(
        "repair-form-title"
    );

const saveRepairButton =
    document.getElementById(
        "save-repair-button"
    );


if (repairFormTitle) {
    repairFormTitle.textContent =
        "Новий ремонт";
}

if (saveRepairButton) {
    saveRepairButton.textContent =
        "Зберегти ремонт";
}
            // Очищаємо старі введені дані
            if (repairForm) {
                repairForm.reset();
            }


            // Ставимо сьогоднішню дату
            const repairDate =
                document.getElementById(
                    "repair-date"
                );

            if (repairDate) {

                const today =
                    new Date();

                const year =
                    today.getFullYear();

                const month =
                    String(
                        today.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        today.getDate()
                    ).padStart(2, "0");

                repairDate.value =
                    `${year}-${month}-${day}`;

            }


            // Показуємо форму
            repairFormContainer.hidden = false;


            // Плавно прокручуємо до неї
            repairFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


// ========================================
// ЗАКРИТИ ФОРМУ РЕМОНТУ
// ========================================

if (
    cancelRepairButton &&
    repairFormContainer
) {

    cancelRepairButton.addEventListener(
        "click",
        function () {
            editingRepairId = null;

            repairFormContainer.hidden = true;

            if (repairForm) {
                repairForm.reset();
            }

        }
    );

}

// ========================================
// ЗБЕРЕЖЕННЯ РЕМОНТУ В SUPABASE
// ========================================

if (repairForm) {

    repairForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Отримуємо ID автомобіля з адреси
            const params =
                new URLSearchParams(
                    window.location.search
                );

            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            // Отримуємо дані з форми
            const title =
                document
                    .getElementById("repair-title")
                    .value
                    .trim();

            const repairDate =
                document
                    .getElementById("repair-date")
                    .value;

            const mileage =
                document
                    .getElementById("repair-mileage")
                    .value;

            const cost =
                document
                    .getElementById("repair-cost")
                    .value;

            const repairPlace =
                document
                    .getElementById("repair-place")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("repair-description")
                    .value
                    .trim();


            // Перевіряємо обов'язкові поля
            if (
                !title ||
                !repairDate
            ) {

                alert(
                    "Вкажіть назву ремонту та дату."
                );

                return;

            }


            const saveRepairButton =
                document.getElementById(
                    "save-repair-button"
                );


            if (saveRepairButton) {

                saveRepairButton.disabled = true;

                saveRepairButton.textContent =
                    "Збереження...";

            }


            const repairData = {

    car_id: carId,

    title: title,

    repair_date:
        repairDate,

    mileage:
        mileage
            ? Number(mileage)
            : null,

    cost:
        cost
            ? Number(cost)
            : null,

    repair_place:
        repairPlace || null,

    description:
        description || null

};


let result;


// Якщо редагуємо існуючий ремонт
if (editingRepairId) {

    result =
        await supabaseClient
            .from("repairs")
            .update(repairData)
            .eq(
                "id",
                editingRepairId
            );


// Якщо створюємо новий ремонт
} else {

    result =
        await supabaseClient
            .from("repairs")
            .insert([
                repairData
            ]);

}


const { error } = result;


            if (error) {

                console.error(
                    "Помилка збереження ремонту:",
                    error
                );

                alert(
                    "Не вдалося зберегти ремонт."
                );


                if (saveRepairButton) {

                    saveRepairButton.disabled = false;

                    saveRepairButton.textContent =
                        "Зберегти ремонт";

                }

                return;

            }

            // ========================================
// ОНОВЛЕННЯ ПРОБІГУ АВТОМОБІЛЯ
// ========================================

if (mileage) {

    const repairMileage =
        Number(mileage);


    const {
        data: carMileageData,
        error: carMileageError
    } =
        await supabaseClient
            .from("cars")
            .select("mileage")
            .eq("id", carId)
            .single();


    if (!carMileageError && carMileageData) {

        const currentCarMileage =
            Number(carMileageData.mileage || 0);


        // Пробіг автомобіля ніколи не зменшуємо
        if (repairMileage > currentCarMileage) {

            const {
                error: updateMileageError
            } =
                await supabaseClient
                    .from("cars")
                    .update({
                        mileage: repairMileage
                    })
                    .eq("id", carId);


            if (updateMileageError) {

                console.error(
                    "Не вдалося оновити пробіг автомобіля:",
                    updateMileageError
                );

            }

        }

    }

}

await loadCarDetails();


            if (editingRepairId) {

    alert(
        "Ремонт успішно оновлено!"
    );

} else {

    alert(
        "Ремонт успішно збережено!"
    );

}


// Режим редагування завершено
editingRepairId = null;


            repairForm.reset();


            if (repairFormContainer) {
                repairFormContainer.hidden = true;
            }
            await loadRepairs();


            if (saveRepairButton) {

                saveRepairButton.disabled = false;

                saveRepairButton.textContent =
                    "Зберегти ремонт";

            }

        }
    );

}

// ========================================
// ЗАВАНТАЖЕННЯ ІСТОРІЇ РЕМОНТІВ
// ========================================

async function loadRepairs() {

    const repairsList =
        document.getElementById(
            "repairs-list"
        );


    // Якщо ми не на сторінці ремонтів
    if (!repairsList) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("repairs")
        .select("*")
        .eq("car_id", carId)
        .order(
            "repair_date",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Помилка завантаження ремонтів:",
            error
        );

        return;

    }


    repairsList.innerHTML = "";


    // Якщо ремонтів ще немає
    if (data.length === 0) {

        repairsList.innerHTML = `

            <div class="maintenance-empty">

                <p>
                    Історія ремонтів поки порожня.
                </p>

            </div>

        `;

        return;

    }


    // Створюємо картку кожного ремонту
    data.forEach(function (repair) {

        const card =
            document.createElement("div");


        card.className =
            "repair-history-card";


        let formattedDate =
            "Дата не вказана";


        if (repair.repair_date) {

            const dateParts =
                repair.repair_date.split("-");

            formattedDate =
                `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        }


        card.innerHTML = `

            <div class="repair-history-header">

                <div>

                    <h3>
                        ${repair.title}
                    </h3>

                    <span>
                        ${formattedDate}
                    </span>

                </div>

                ${
                    repair.cost !== null
                        ? `
                            <strong>
                                ${Number(repair.cost)
                                    .toLocaleString("uk-UA")} грн
                            </strong>
                        `
                        : ""
                }

            </div>


            <div class="repair-history-info">

                ${
                    repair.mileage !== null
                        ? `
                            <p>
                                <strong>Пробіг:</strong>
                                ${Number(repair.mileage)
                                    .toLocaleString("uk-UA")} км
                            </p>
                        `
                        : ""
                }

                ${
                    repair.repair_place
                        ? `
                            <p>
                                <strong>Місце:</strong>
                                ${repair.repair_place}
                            </p>
                        `
                        : ""
                }

                ${
                    repair.description
                        ? `
                            <p>
                                <strong>Опис:</strong>
                                ${repair.description}
                            </p>
                        `
                        : ""
                }

            </div>

        `;


       // ========================================
// КНОПКА ВИДАЛЕННЯ РЕМОНТУ
// ========================================

const repairActions =
    document.createElement("div");

repairActions.className =
    "repair-history-actions";


// ========================================
// КНОПКА РЕДАГУВАННЯ РЕМОНТУ
// ========================================

const editRepairButton =
    document.createElement("button");

editRepairButton.type =
    "button";

editRepairButton.className =
    "edit-repair-button";

editRepairButton.textContent =
    "Редагувати";


editRepairButton.addEventListener(
    "click",
    function () {

        editingRepairId =
            repair.id;


        // Заголовок форми
        const repairFormTitle =
            document.getElementById(
                "repair-form-title"
            );

        if (repairFormTitle) {

            repairFormTitle.textContent =
                "Редагування ремонту";

        }


        // Кнопка збереження
        const saveRepairButton =
            document.getElementById(
                "save-repair-button"
            );

        if (saveRepairButton) {

            saveRepairButton.textContent =
                "Зберегти зміни";

        }


        // Заповнюємо форму
        document
            .getElementById("repair-title")
            .value =
            repair.title || "";

        document
            .getElementById("repair-date")
            .value =
            repair.repair_date || "";

        document
            .getElementById("repair-mileage")
            .value =
            repair.mileage ?? "";

        document
            .getElementById("repair-cost")
            .value =
            repair.cost ?? "";

        document
            .getElementById("repair-place")
            .value =
            repair.repair_place || "";

        document
            .getElementById("repair-description")
            .value =
            repair.description || "";


        // Показуємо форму
        if (repairFormContainer) {

            repairFormContainer.hidden =
                false;

            repairFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);
    const deleteRepairButton =
    document.createElement("button");

deleteRepairButton.type =
    "button";

deleteRepairButton.className =
    "delete-repair-button";

deleteRepairButton.textContent =
    "Видалити";


deleteRepairButton.addEventListener(
    "click",
    async function () {

        const confirmed =
            confirm(
                `Видалити ремонт "${repair.title}"?`
            );


        if (!confirmed) {
            return;
        }


        const { error: deleteRepairError } =
            await supabaseClient
                .from("repairs")
                .delete()
                .eq("id", repair.id);


        if (deleteRepairError) {

            console.error(
                "Помилка видалення ремонту:",
                deleteRepairError
            );

            alert(
                "Не вдалося видалити ремонт."
            );

            return;

        }


        alert(
            "Ремонт успішно видалено!"
        );


        await loadRepairs();

    }
);


repairActions.appendChild(
    editRepairButton
);
repairActions.appendChild(
    deleteRepairButton
);

card.appendChild(
    repairActions
);
        repairsList.appendChild(card);

    });

}


// Завантажуємо ремонти при відкритті сторінки
loadRepairs();

// ========================================
// ПЕРЕХОДИ З ОГЛЯДОВОЇ СТОРІНКИ АВТОМОБІЛЯ
// ========================================

const openMaintenancePageButton =
    document.getElementById(
        "open-maintenance-page"
    );

const openRepairsPageButton =
    document.getElementById(
        "open-repairs-page"
    );


const carPageParams =
    new URLSearchParams(
        window.location.search
    );

const currentCarId =
    carPageParams.get("id");


// Обслуговування
if (
    openMaintenancePageButton &&
    currentCarId
) {

    openMaintenancePageButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "maintenance.html?id=" +
                encodeURIComponent(
                    currentCarId
                );

        }
    );

}


// Ремонти
if (
    openRepairsPageButton &&
    currentCarId
) {

    openRepairsPageButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "repairs.html?id=" +
                encodeURIComponent(
                    currentCarId
                );

        }
    );

}

// ========================================
// ПЕРЕХІД НА СТОРІНКУ ЗАПРАВОК
// ========================================

const openFuelPageButton =
    document.getElementById(
        "open-fuel-page"
    );


if (
    openFuelPageButton &&
    currentCarId
) {

    openFuelPageButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "fuel.html?id=" +
                encodeURIComponent(
                    currentCarId
                );

        }
    );

}

// ========================================
// ФОРМА ДОДАВАННЯ ЗАПРАВКИ
// ========================================

const addRefuelButton =
    document.getElementById(
        "add-refuel-button"
    );

const refuelFormContainer =
    document.getElementById(
        "refuel-form-container"
    );

const refuelForm =
    document.getElementById(
        "refuel-form"
    );

const cancelRefuelButton =
    document.getElementById(
        "cancel-refuel-button"
    );

    // ID заправки, яку зараз редагуємо.
// null = створюємо нову заправку.
let editingRefuelId = null;

// ========================================
// ДОСТУПНІ ВИДИ ПАЛЬНОГО
// ДЛЯ КОНКРЕТНОГО АВТОМОБІЛЯ
// ========================================

async function configureRefuelFuelOptions(
    selectedFuelType = ""
) {

    const refuelFuelSelect =
        document.getElementById(
            "refuel-fuel-type"
        );


    if (!refuelFuelSelect) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }


    const {
        data: carData,
        error: carError
    } =
        await supabaseClient
            .from("cars")
            .select("fuel_type")
            .eq("id", carId)
            .single();


    if (
        carError ||
        !carData
    ) {

        console.error(
            "Не вдалося визначити тип пального автомобіля:",
            carError
        );

        return;
    }


    let allowedFuelTypes = [];


    if (
        carData.fuel_type ===
        "petrol"
    ) {

        allowedFuelTypes = [
            {
                value: "petrol",
                label: "Бензин"
            }
        ];

    }


    if (
        carData.fuel_type ===
        "diesel"
    ) {

        allowedFuelTypes = [
            {
                value: "diesel",
                label: "Дизель"
            }
        ];

    }


    if (
        carData.fuel_type ===
        "lpg"
    ) {

        allowedFuelTypes = [
            {
                value: "lpg",
                label: "Газ"
            }
        ];

    }


    if (
        carData.fuel_type ===
        "petrol_lpg"
    ) {

        allowedFuelTypes = [
            {
                value: "petrol",
                label: "Бензин"
            },
            {
                value: "lpg",
                label: "Газ"
            }
        ];

    }


    // Для звичайного HEV
    // поки використовуємо бензин
    if (
        carData.fuel_type ===
        "hybrid"
    ) {

        allowedFuelTypes = [
            {
                value: "petrol",
                label: "Бензин"
            }
        ];

    }


    // Для PHEV:
    // паливна заправка + окремо заряджання
    if (
        carData.fuel_type ===
        "phev"
    ) {

        allowedFuelTypes = [
            {
                value: "petrol",
                label: "Бензин"
            }
        ];

    }


    // Електромобілю паливна
    // заправка не потрібна
    if (
        carData.fuel_type ===
        "electric"
    ) {

        allowedFuelTypes = [];

    }


    refuelFuelSelect.innerHTML = `
        <option value="">
            Оберіть вид пального
        </option>
    `;


    allowedFuelTypes.forEach(
        function (fuel) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                fuel.value;

            option.textContent =
                fuel.label;

            refuelFuelSelect.appendChild(
                option
            );

        }
    );


    // Якщо вид пального один —
    // вибираємо його автоматично
    if (
        allowedFuelTypes.length === 1
    ) {

        refuelFuelSelect.value =
            allowedFuelTypes[0].value;

    }


    // При редагуванні старої заправки
    // повертаємо її значення,
    // якщо воно дозволене для цього авто
    if (
        selectedFuelType &&
        allowedFuelTypes.some(
            function (fuel) {

                return (
                    fuel.value ===
                    selectedFuelType
                );

            }
        )
    ) {

        refuelFuelSelect.value =
            selectedFuelType;

    }

}


// Відкрити форму заправки
if (
    addRefuelButton &&
    refuelFormContainer
) {

    addRefuelButton.addEventListener(
        "click",
        function () {
            editingRefuelId = null;


const refuelFormTitle =
    document.getElementById(
        "refuel-form-title"
    );

const saveRefuelButton =
    document.getElementById(
        "save-refuel-button"
    );


if (refuelFormTitle) {
    refuelFormTitle.textContent =
        "Нова заправка";
}

if (saveRefuelButton) {
    saveRefuelButton.textContent =
        "Зберегти заправку";
}

            if (refuelForm) {
                refuelForm.reset();
                configureRefuelFuelOptions();                
            }


            // Автоматично ставимо сьогоднішню дату
            const refuelDate =
                document.getElementById(
                    "refuel-date"
                );

            if (refuelDate) {

                const today =
                    new Date();

                const year =
                    today.getFullYear();

                const month =
                    String(
                        today.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        today.getDate()
                    ).padStart(2, "0");


                refuelDate.value =
                    `${year}-${month}-${day}`;

            }


            refuelFormContainer.hidden =
                false;


            refuelFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}


// Закрити форму заправки
if (
    cancelRefuelButton &&
    refuelFormContainer
) {

    cancelRefuelButton.addEventListener(
        "click",
        function () {
            editingRefuelId = null;

            refuelFormContainer.hidden =
                true;

            if (refuelForm) {
                refuelForm.reset();
            }

        }
    );

}

// ========================================
// ЗБЕРЕЖЕННЯ ЗАПРАВКИ В SUPABASE
// ========================================

if (refuelForm) {

    refuelForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ID автомобіля з адреси
            const params =
                new URLSearchParams(
                    window.location.search
                );

            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            // Дані форми
            const refuelDate =
                document
                    .getElementById("refuel-date")
                    .value;

            const mileage =
                document
                    .getElementById("refuel-mileage")
                    .value;

            const liters =
                document
                    .getElementById("refuel-liters")
                    .value;

            const pricePerLiter =
                document
                    .getElementById("refuel-price")
                    .value;

            const totalCost =
                document
                    .getElementById("refuel-cost")
                    .value;

            const station =
                document
                    .getElementById("refuel-station")
                    .value
                    .trim();

            const fuelType =
                document
                    .getElementById("refuel-fuel-type")
                    .value;
            const fullTank =
    document
        .getElementById("refuel-full-tank")
        .checked;        


// ========================================
// ПЕРЕВІРКА ДАНИХ ЗАПРАВКИ
// ========================================

const litersNumber =
    Number(liters);


// Основні обов'язкові поля
if (
    !refuelDate ||
    !fuelType ||
    !Number.isFinite(litersNumber) ||
    litersNumber <= 0
) {

    alert(
        "Вкажіть дату, вид пального " +
        "та правильну кількість літрів."
    );

    return;

}


// Отримуємо тип автомобіля
// та місткість його баків
const {
    data: refuelCarData,
    error: refuelCarError
} =
    await supabaseClient
        .from("cars")
        .select(
            "fuel_type, tank_capacity, lpg_tank_capacity"
        )
        .eq("id", carId)
        .single();


if (
    refuelCarError ||
    !refuelCarData
) {

    console.error(
        "Не вдалося перевірити дані автомобіля:",
        refuelCarError
    );

    alert(
        "Не вдалося перевірити дані автомобіля."
    );

    return;

}


// ========================================
// ПЕРЕВІРКА ДОЗВОЛЕНОГО ПАЛЬНОГО
// ========================================

const allowedFuelTypesByCar = {

    petrol: [
        "petrol"
    ],

    diesel: [
        "diesel"
    ],

    lpg: [
        "lpg"
    ],

    petrol_lpg: [
        "petrol",
        "lpg"
    ],

    hybrid: [
        "petrol"
    ],

    phev: [
        "petrol"
    ],

    electric: []

};


const allowedFuelTypes =
    allowedFuelTypesByCar[
        refuelCarData.fuel_type
    ] || [];


if (
    !allowedFuelTypes.includes(
        fuelType
    )
) {

    alert(
        "Цей вид пального не підходить " +
        "для вибраного автомобіля."
    );

    return;

}


// ========================================
// ПЕРЕВІРКА МАКСИМАЛЬНОЇ ЄМНОСТІ
// ========================================

let maximumCapacity =
    null;

let capacityName =
    "бака";


if (fuelType === "lpg") {

    maximumCapacity =
        refuelCarData
            .lpg_tank_capacity !== null
            ? Number(
                refuelCarData
                    .lpg_tank_capacity
            )
            : null;

    capacityName =
        "газового балона";

} else {

    maximumCapacity =
        refuelCarData
            .tank_capacity !== null
            ? Number(
                refuelCarData
                    .tank_capacity
            )
            : null;

}


if (
    maximumCapacity !== null &&
    maximumCapacity > 0 &&
    litersNumber > maximumCapacity
) {

    alert(
        `Неможливо додати ${litersNumber} л.\n\n` +
        `Об’єм ${capacityName}: ` +
        `${maximumCapacity} л.`
    );

    return;

}            


            const saveRefuelButton =
                document.getElementById(
                    "save-refuel-button"
                );


            if (saveRefuelButton) {

                saveRefuelButton.disabled =
                    true;

                saveRefuelButton.textContent =
                    "Збереження...";

            }


           const refuelData = {

    car_id:
        carId,

    refuel_date:
        refuelDate,

    mileage:
        mileage
            ? Number(mileage)
            : null,

    liters:
        Number(liters),

    price_per_liter:
        pricePerLiter
            ? Number(pricePerLiter)
            : null,

    total_cost:
        totalCost
            ? Number(totalCost)
            : null,

    station:
        station || null,

    fuel_type:
    fuelType || null,

    full_tank:
    fullTank,

updated_at:
    new Date().toISOString()

};


let result;


// Якщо редагуємо існуючу заправку
if (editingRefuelId) {

    result =
        await supabaseClient
            .from("refuels")
            .update(refuelData)
            .eq(
                "id",
                editingRefuelId
            );


// Якщо додаємо нову заправку
} else {

    result =
        await supabaseClient
            .from("refuels")
            .insert([
                refuelData
            ]);

}


const { error } = result;


            if (error) {

                console.error(
                    "Помилка збереження заправки:",
                    error
                );

                alert(
                    "Не вдалося зберегти заправку."
                );


                if (saveRefuelButton) {

                    saveRefuelButton.disabled =
                        false;

                    saveRefuelButton.textContent =
                        "Зберегти заправку";

                }

                return;

            }


            // ========================================
// ОНОВЛЕННЯ ПРОБІГУ ПІСЛЯ ЗАПРАВКИ
// ========================================

if (mileage) {

    const refuelMileage =
        Number(mileage);


    const {
        data: carMileageData,
        error: carMileageError
    } =
        await supabaseClient
            .from("cars")
            .select("mileage")
            .eq("id", carId)
            .single();


    if (!carMileageError && carMileageData) {

        const currentCarMileage =
            Number(
                carMileageData.mileage || 0
            );


        // Пробіг автомобіля не зменшуємо
        if (
            refuelMileage >
            currentCarMileage
        ) {

            const {
                error: updateMileageError
            } =
                await supabaseClient
                    .from("cars")
                    .update({
                        mileage: refuelMileage
                    })
                    .eq("id", carId);


            if (updateMileageError) {

                console.error(
                    "Не вдалося оновити пробіг автомобіля:",
                    updateMileageError
                );

            }

        }

    }

}


// Оновлюємо картку автомобіля на сторінці
await loadCarDetails();
            if (editingRefuelId) {

    alert(
        "Заправку успішно оновлено!"
    );

} else {

    alert(
        "Заправку успішно збережено!"
    );

}


// Режим редагування завершено
editingRefuelId = null;


            refuelForm.reset();


            if (refuelFormContainer) {

                refuelFormContainer.hidden =
                    true;

            }
            await loadRefuels();


            if (saveRefuelButton) {

                saveRefuelButton.disabled =
                    false;

                saveRefuelButton.textContent =
                    "Зберегти заправку";

            }

        }
    );

}
// ========================================
// ЗАВАНТАЖЕННЯ ІСТОРІЇ ЗАПРАВОК
// ========================================

async function loadRefuels() {

    const refuelsList =
        document.getElementById(
            "refuels-list"
        );


    // Працюємо тільки на сторінці заправок
    if (!refuelsList) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }

    const {
    data: carFuelData,
    error: carFuelError
} =
    await supabaseClient
        .from("cars")
        .select(
    "tank_capacity, lpg_tank_capacity, fuel_type"
)
        .eq("id", carId)
        .single();


const tankCapacity =
    !carFuelError &&
    carFuelData &&
    carFuelData.tank_capacity
        ? Number(
            carFuelData.tank_capacity
        )
        : null;

const lpgTankCapacity =
    !carFuelError &&
    carFuelData &&
    carFuelData.lpg_tank_capacity
        ? Number(
            carFuelData.lpg_tank_capacity
        )
        : null;


const carFuelType =
    !carFuelError &&
    carFuelData
        ? carFuelData.fuel_type
        : null;        


    const {
        data,
        error
    } =
        await supabaseClient
            .from("refuels")
            .select("*")
            .eq("car_id", carId)
            .order(
    "updated_at",
    {
        ascending: false
    }
);


    if (error) {

        console.error(
            "Помилка завантаження заправок:",
            error
        );

        return;

    }


    refuelsList.innerHTML = "";


    // Якщо заправок ще немає
    if (data.length === 0) {

        refuelsList.innerHTML = `

            <div class="maintenance-empty">

                <p>
                    Історія заправок поки порожня.
                </p>

            </div>

        `;

        return;

    }


    // ========================================
// РОЗРАХУНОК ВИТРАТИ ПАЛЬНО
// ВІД ПОВНОГО БАКА ДО ПОВНОГО БАКА
// ========================================

const consumptionByRefuelId =
    new Map();


const refuelsForConsumption =
    [...data]
        .filter(function (item) {

            return (
                item.mileage !== null &&
                item.liters !== null &&
                item.fuel_type
            );

        })
        .sort(function (a, b) {

            return (
                Number(a.mileage) -
                Number(b.mileage)
            );

        });


// Окремий стан для кожного
// виду пального
const consumptionStateByFuel =
    new Map();


refuelsForConsumption.forEach(
    function (item) {

        const fuelKey =
            item.fuel_type;


        // Якщо це перша заправка
        // такого виду пального
        if (
            !consumptionStateByFuel.has(
                fuelKey
            )
        ) {

            consumptionStateByFuel.set(
                fuelKey,
                {
                    previousFullTank:
                        null,

                    litersSinceFullTank:
                        0
                }
            );

        }


        const fuelState =
            consumptionStateByFuel.get(
                fuelKey
            );


        // Поки для цього пального
        // немає першого повного бака
        if (
            !fuelState.previousFullTank
        ) {

            if (
                item.full_tank === true
            ) {

                fuelState.previousFullTank =
                    item;

                fuelState.litersSinceFullTank =
                    0;

            }

            return;
        }


        // Додаємо тільки пальне
        // такого самого типу
        fuelState.litersSinceFullTank +=
            Number(
                item.liters || 0
            );


        // Наступний повний бак
        // саме цього виду пального
        if (
            item.full_tank === true
        ) {

            const distance =
                Number(item.mileage) -
                Number(
                    fuelState
                        .previousFullTank
                        .mileage
                );


            if (
                distance > 0 &&
                fuelState
                    .litersSinceFullTank > 0
            ) {

                const consumption =
                    (
                        fuelState
                            .litersSinceFullTank /
                        distance
                    ) * 100;


                consumptionByRefuelId.set(
                    item.id,
                    {
                        consumption:
                            consumption,

                        distance:
                            distance,

                        liters:
                            fuelState
                                .litersSinceFullTank,

                        fuelType:
                            fuelKey
                    }
                );

            }


            fuelState.previousFullTank =
                item;

            fuelState.litersSinceFullTank =
                0;

        }

    }
);
   
// ========================================
// ЗАГАЛЬНА СТАТИСТИКА ЗАПРАВОК
// ========================================

const fuelAverageConsumption =
    document.getElementById(
        "fuel-average-consumption"
    );

const fuelTotalCost =
    document.getElementById(
        "fuel-total-cost"
    );

const fuelTotalLiters =
    document.getElementById(
        "fuel-total-liters"
    );

const fuelRefuelsCount =
    document.getElementById(
        "fuel-refuels-count"
    );


// Загальна кількість заправлених літрів
const totalLiters =
    data.reduce(
        function (sum, item) {

            return sum +
                Number(item.liters || 0);

        },
        0
    );


// Загальна сума витрат на пальне
const totalFuelCost =
    data.reduce(
        function (sum, item) {

            return sum +
                Number(item.total_cost || 0);

        },
        0
    );

// ========================================
// СТАТИСТИКА ОКРЕМО ЗА ВИДОМ ПАЛЬНОГО
// ========================================

function sumFuelValue(
    fuelType,
    fieldName
) {

    return data
        .filter(
            function (item) {

                return (
                    item.fuel_type ===
                    fuelType
                );

            }
        )
        .reduce(
            function (sum, item) {

                return (
                    sum +
                    Number(
                        item[fieldName] || 0
                    )
                );

            },
            0
        );

}


const petrolLiters =
    sumFuelValue(
        "petrol",
        "liters"
    );

const lpgLiters =
    sumFuelValue(
        "lpg",
        "liters"
    );


const petrolCost =
    sumFuelValue(
        "petrol",
        "total_cost"
    );

const lpgCost =
    sumFuelValue(
        "lpg",
        "total_cost"
    );


const otherFuelLiters =
    data
        .filter(
            function (item) {

                return (
                    item.fuel_type !==
                        "petrol" &&
                    item.fuel_type !==
                        "lpg"
                );

            }
        )
        .reduce(
            function (sum, item) {

                return (
                    sum +
                    Number(
                        item.liters || 0
                    )
                );

            },
            0
        );


const otherFuelCost =
    data
        .filter(
            function (item) {

                return (
                    item.fuel_type !==
                        "petrol" &&
                    item.fuel_type !==
                        "lpg"
                );

            }
        )
        .reduce(
            function (sum, item) {

                return (
                    sum +
                    Number(
                        item.total_cost || 0
                    )
                );

            },
            0
        );


function formatFuelStatNumber(
    value
) {

    return Number(value)
        .toLocaleString(
            "uk-UA",
            {
                maximumFractionDigits: 2
            }
        );

}    


// Періоди, для яких вдалося
// розрахувати витрату
const consumptionPeriods =
    Array.from(
        consumptionByRefuelId.values()
    );


// ========================================
// СЕРЕДНЯ ВИТРАТА ОКРЕМО
// ЗА КОЖНИМ ВИДОМ ПАЛЬНОГО
// ========================================

function getAverageConsumptionForFuel(
    fuelType
) {

    const fuelPeriods =
        consumptionPeriods.filter(
            function (item) {

                return (
                    item.fuelType ===
                    fuelType
                );

            }
        );


    const distance =
        fuelPeriods.reduce(
            function (sum, item) {

                return (
                    sum +
                    Number(
                        item.distance || 0
                    )
                );

            },
            0
        );


    const liters =
        fuelPeriods.reduce(
            function (sum, item) {

                return (
                    sum +
                    Number(
                        item.liters || 0
                    )
                );

            },
            0
        );


    if (
        distance <= 0 ||
        liters <= 0
    ) {
        return null;
    }


    return (
        liters /
        distance *
        100
    );

}


function formatAverageConsumption(
    value
) {

    if (value === null) {
        return "недостатньо даних";
    }


    return (
        value.toLocaleString(
            "uk-UA",
            {
                minimumFractionDigits: 1,
                maximumFractionDigits: 2
            }
        ) +
        " л/100 км"
    );

}


// Виводимо середню витрату
if (fuelAverageConsumption) {

    // Бензин + газ:
    // показуємо два окремі значення
    if (
        carFuelType ===
        "petrol_lpg"
    ) {

        const petrolAverage =
            getAverageConsumptionForFuel(
                "petrol"
            );

        const lpgAverage =
            getAverageConsumptionForFuel(
                "lpg"
            );


        fuelAverageConsumption.innerHTML =
            `
                Бензин:
                ${formatAverageConsumption(
                    petrolAverage
                )}
                <br>
                Газ:
                ${formatAverageConsumption(
                    lpgAverage
                )}
            `;

    } else if (
        carFuelType === "petrol"
    ) {

        fuelAverageConsumption.textContent =
            formatAverageConsumption(
                getAverageConsumptionForFuel(
                    "petrol"
                )
            );

    } else if (
        carFuelType === "diesel"
    ) {

        fuelAverageConsumption.textContent =
            formatAverageConsumption(
                getAverageConsumptionForFuel(
                    "diesel"
                )
            );

    } else if (
        carFuelType === "lpg"
    ) {

        fuelAverageConsumption.textContent =
            formatAverageConsumption(
                getAverageConsumptionForFuel(
                    "lpg"
                )
            );

    } else {

        // Для HEV / PHEV або старих записів
        // показуємо всі види пального,
        // для яких є розрахунок

        const fuelLabels = {
            petrol: "Бензин",
            diesel: "Дизель",
            lpg: "Газ"
        };


        const fuelTypes =
            [
                ...new Set(
                    consumptionPeriods
                        .map(
                            function (item) {
                                return item.fuelType;
                            }
                        )
                        .filter(Boolean)
                )
            ];


        if (fuelTypes.length === 0) {

            fuelAverageConsumption.textContent =
                "Ще недостатньо даних";

        } else {

            fuelAverageConsumption.innerHTML =
                fuelTypes
                    .map(
                        function (fuelType) {

                            const label =
                                fuelLabels[
                                    fuelType
                                ] ||
                                fuelType;

                            return (
                                label +
                                ": " +
                                formatAverageConsumption(
                                    getAverageConsumptionForFuel(
                                        fuelType
                                    )
                                )
                            );

                        }
                    )
                    .join("<br>");

        }

    }

}


if (fuelTotalCost) {

    if (
        carFuelType ===
        "petrol_lpg"
    ) {

        fuelTotalCost.innerHTML =
            `
                Бензин:
                ${formatFuelStatNumber(
                    petrolCost
                )} грн
                <br>

                Газ:
                ${formatFuelStatNumber(
                    lpgCost
                )} грн

                ${
                    otherFuelCost > 0
                        ? `
                            <br>
                            Інше:
                            ${formatFuelStatNumber(
                                otherFuelCost
                            )} грн
                          `
                        : ""
                }
            `;

    } else {

        fuelTotalCost.textContent =
            formatFuelStatNumber(
                totalFuelCost
            ) +
            " грн";

    }

}


if (fuelTotalLiters) {

    if (
        carFuelType ===
        "petrol_lpg"
    ) {

        fuelTotalLiters.innerHTML =
            `
                Бензин:
                ${formatFuelStatNumber(
                    petrolLiters
                )} л
                <br>

                Газ:
                ${formatFuelStatNumber(
                    lpgLiters
                )} л

                ${
                    otherFuelLiters > 0
                        ? `
                            <br>
                            Інше:
                            ${formatFuelStatNumber(
                                otherFuelLiters
                            )} л
                          `
                        : ""
                }
            `;

    } else {

        fuelTotalLiters.textContent =
            formatFuelStatNumber(
                totalLiters
            ) +
            " л";

    }

}


if (fuelRefuelsCount) {

    if (
        carFuelType ===
        "petrol_lpg"
    ) {

        const petrolRefuelsCount =
            data.filter(
                function (item) {

                    return (
                        item.fuel_type ===
                        "petrol"
                    );

                }
            ).length;


        const lpgRefuelsCount =
            data.filter(
                function (item) {

                    return (
                        item.fuel_type ===
                        "lpg"
                    );

                }
            ).length;


        const otherRefuelsCount =
            data.filter(
                function (item) {

                    return (
                        item.fuel_type !==
                            "petrol" &&
                        item.fuel_type !==
                            "lpg"
                    );

                }
            ).length;


        fuelRefuelsCount.innerHTML =
            `
                Бензин:
                ${petrolRefuelsCount}
                <br>

                Газ:
                ${lpgRefuelsCount}

                ${
                    otherRefuelsCount > 0
                        ? `
                            <br>
                            Інше:
                            ${otherRefuelsCount}
                          `
                        : ""
                }
            `;

    } else {

        fuelRefuelsCount.textContent =
            data.length.toLocaleString(
                "uk-UA"
            );

    }

}
data.forEach(function (refuel) {

        const card =
            document.createElement("div");


        card.className =
            "refuel-history-card";


        // Форматуємо дату
        let formattedDate =
            "Дата не вказана";


        if (refuel.refuel_date) {

            const dateParts =
                refuel.refuel_date.split("-");

            formattedDate =
                `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        }


        // Назва виду пального
        let fuelTypeText =
            "Не вказано";


        if (refuel.fuel_type === "petrol") {
            fuelTypeText = "Бензин";
        }

        if (refuel.fuel_type === "diesel") {
            fuelTypeText = "Дизель";
        }

        if (refuel.fuel_type === "lpg") {
            fuelTypeText = "Газ";
        }

// Визначаємо правильну ємність
// для конкретного виду пального
let refuelCapacity =
    tankCapacity;

let refuelCapacityName =
    "бака";


if (refuel.fuel_type === "lpg") {

    refuelCapacity =
        lpgTankCapacity;

    refuelCapacityName =
        "газового балона";

}        


        card.innerHTML = `

            <div class="refuel-history-header">

                <div>

                    <h3>
                        ⛽ ${Number(refuel.liters)
                            .toLocaleString("uk-UA")} л
                    </h3>

                    <span>
                        ${formattedDate}
                    </span>

                </div>


                ${
                    refuel.total_cost !== null
                        ? `
                            <strong>
                                ${Number(refuel.total_cost)
                                    .toLocaleString("uk-UA")} грн
                            </strong>
                        `
                        : ""
                }

            </div>


            <div class="refuel-history-info">

                ${
                    refuel.mileage !== null
                        ? `
                            <p>
                                <strong>Пробіг:</strong>
                                ${Number(refuel.mileage)
                                    .toLocaleString("uk-UA")} км
                            </p>
                        `
                        : ""
                }


                ${
                    refuel.price_per_liter !== null
                        ? `
                            <p>
                                <strong>Ціна за літр:</strong>
                                ${Number(refuel.price_per_liter)
                                    .toLocaleString("uk-UA")} грн
                            </p>
                        `
                        : ""
                }


                <p>
                    <strong>Пальне:</strong>
                    ${fuelTypeText}
                </p>
                ${
    refuel.full_tank === true
        ? `
            <p class="refuel-full-tank-badge">
                ✅ Повний бак
            </p>
        `
        : ""
}

${
    refuelCapacity &&
    Number(refuel.liters) > 0
        ? `
            <div class="refuel-tank-percent">

                <strong>
                    🛢 Частка ${refuelCapacityName}:
                </strong>

                ${(
                    Number(refuel.liters) /
refuelCapacity *
100
                ).toLocaleString(
                    "uk-UA",
                    {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 1
                    }
                )}%

                <small>
                    ${Number(refuel.liters)
                        .toLocaleString("uk-UA")} л
                    із ${refuelCapacity
                        .toLocaleString("uk-UA")} л
                </small>

            </div>
        `
        : ""
}

${
    refuelCapacity &&
    refuel.price_per_liter !== null &&
    Number(refuel.price_per_liter) > 0
        ? `
            <div class="refuel-full-tank-cost">

                <strong>
                    💳 Повна ємність за цією ціною:
                </strong>

                ${(
                    refuelCapacity *
Number(refuel.price_per_liter)
                ).toLocaleString(
                    "uk-UA",
                    {
                        maximumFractionDigits: 2
                    }
                )} грн

                <small>
                    ${refuelCapacity.toLocaleString("uk-UA")} л
                    ×
                    ${Number(refuel.price_per_liter)
                        .toLocaleString(
                            "uk-UA",
                            {
                                maximumFractionDigits: 2
                            }
                        )
                    } грн
                </small>

            </div>
        `
        : ""
}

${
    consumptionByRefuelId.has(refuel.id)
        ? `
            <div class="refuel-consumption">

                <strong>
                    ⛽ Середня витрата:
                </strong>

                ${consumptionByRefuelId
                    .get(refuel.id)
                    .consumption
                    .toLocaleString(
                        "uk-UA",
                        {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 2
                        }
                    )
                } л/100 км

                <small>
                    ${consumptionByRefuelId
                        .get(refuel.id)
                        .liters
                        .toLocaleString(
                            "uk-UA",
                            {
                                maximumFractionDigits: 2
                            }
                        )
                    } л за
                    ${consumptionByRefuelId
                        .get(refuel.id)
                        .distance
                        .toLocaleString("uk-UA")
                    } км
                </small>

            </div>
        `
        : ""
}


                ${
                    refuel.station
                        ? `
                            <p>
                                <strong>АЗС:</strong>
                                ${refuel.station}
                            </p>
                        `
                        : ""
                }

            </div>

        `;


       // ========================================
// КНОПКА ВИДАЛЕННЯ ЗАПРАВКИ
// ========================================

const refuelActions =
    document.createElement("div");

refuelActions.className =
    "refuel-history-actions";


// ========================================
// КНОПКА РЕДАГУВАННЯ ЗАПРАВКИ
// ========================================

const editRefuelButton =
    document.createElement("button");

editRefuelButton.type =
    "button";

editRefuelButton.className =
    "edit-refuel-button";

editRefuelButton.textContent =
    "Редагувати";


editRefuelButton.addEventListener(
    "click",
    async function () {

        editingRefuelId =
            refuel.id;


        const refuelFormTitle =
            document.getElementById(
                "refuel-form-title"
            );

        const saveRefuelButton =
            document.getElementById(
                "save-refuel-button"
            );


        if (refuelFormTitle) {
            refuelFormTitle.textContent =
                "Редагування заправки";
        }

        if (saveRefuelButton) {
            saveRefuelButton.textContent =
                "Зберегти зміни";
        }


        document
            .getElementById("refuel-date")
            .value =
            refuel.refuel_date || "";

        document
            .getElementById("refuel-mileage")
            .value =
            refuel.mileage ?? "";

        document
            .getElementById("refuel-liters")
            .value =
            refuel.liters ?? "";

        document
            .getElementById("refuel-price")
            .value =
            refuel.price_per_liter ?? "";

        document
            .getElementById("refuel-cost")
            .value =
            refuel.total_cost ?? "";

        document
            .getElementById("refuel-station")
            .value =
            refuel.station || "";

        await configureRefuelFuelOptions(
    refuel.fuel_type || ""
);

            document
    .getElementById("refuel-full-tank")
    .checked =
    refuel.full_tank === true;


        if (refuelFormContainer) {

            refuelFormContainer.hidden =
                false;

            refuelFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);
    const deleteRefuelButton =
    document.createElement("button");

deleteRefuelButton.type =
    "button";

deleteRefuelButton.className =
    "delete-refuel-button";

deleteRefuelButton.textContent =
    "Видалити";


deleteRefuelButton.addEventListener(
    "click",
    async function () {

        const confirmed =
            confirm(
                `Видалити заправку ${Number(refuel.liters)
                    .toLocaleString("uk-UA")} л?`
            );


        if (!confirmed) {
            return;
        }


        const { error: deleteRefuelError } =
            await supabaseClient
                .from("refuels")
                .delete()
                .eq("id", refuel.id);


        if (deleteRefuelError) {

            console.error(
                "Помилка видалення заправки:",
                deleteRefuelError
            );

            alert(
                "Не вдалося видалити заправку."
            );

            return;

        }


        alert(
            "Заправку успішно видалено!"
        );


        await loadRefuels();

    }
);


refuelActions.appendChild(
    editRefuelButton
);
refuelActions.appendChild(
    deleteRefuelButton
);

card.appendChild(
    refuelActions
);
        refuelsList.appendChild(card);

    });

}


// Завантажуємо заправки при відкритті сторінки
loadRefuels();

// ========================================
// ПЕРЕХІД НА СТОРІНКУ ВИТРАТ
// ========================================

const openExpensesPageButton =
    document.getElementById(
        "open-expenses-page"
    );


if (
    openExpensesPageButton &&
    currentCarId
) {

    openExpensesPageButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "expenses.html?id=" +
                encodeURIComponent(
                    currentCarId
                );

        }
    );

}

// ========================================
// ФОРМА ДОДАВАННЯ ВИТРАТИ
// ========================================

const addExpenseButton =
    document.getElementById(
        "add-expense-button"
    );

const expenseFormContainer =
    document.getElementById(
        "expense-form-container"
    );

const expenseForm =
    document.getElementById(
        "expense-form"
    );

const cancelExpenseButton =
    document.getElementById(
        "cancel-expense-button"
    );

const expenseCategorySelect =
    document.getElementById(
        "expense-category"
    );

const insuranceNextDateField =
    document.getElementById(
        "insurance-next-date-field"
    );

const expenseNextInsuranceDate =
    document.getElementById(
        "expense-next-insurance-date"
    );


function updateInsuranceNextDateField() {

    if (
        !expenseCategorySelect ||
        !insuranceNextDateField
    ) {
        return;
    }


    const isInsurance =
        expenseCategorySelect.value ===
        "insurance";


    insuranceNextDateField.hidden =
        !isInsurance;


    if (
        !isInsurance &&
        expenseNextInsuranceDate
    ) {

        expenseNextInsuranceDate.value =
            "";

    }

}


if (expenseCategorySelect) {

    expenseCategorySelect.addEventListener(
        "change",
        updateInsuranceNextDateField
    );

    updateInsuranceNextDateField();

}

    // ID витрати, яку зараз редагуємо.
// null = створюємо нову витрату.
let editingExpenseId = null;


// Відкрити форму витрати
if (
    addExpenseButton &&
    expenseFormContainer
) {

    addExpenseButton.addEventListener(
        "click",
        function () {
            editingExpenseId = null;


const expenseFormTitle =
    document.getElementById(
        "expense-form-title"
    );

const saveExpenseButton =
    document.getElementById(
        "save-expense-button"
    );


if (expenseFormTitle) {

    expenseFormTitle.textContent =
        "Нова витрата";

}

if (saveExpenseButton) {

    saveExpenseButton.textContent =
        "Зберегти витрату";

}

            if (expenseForm) {
                expenseForm.reset();
            }

updateInsuranceNextDateField();            


            // Автоматично ставимо сьогоднішню дату
            const expenseDate =
                document.getElementById(
                    "expense-date"
                );

            if (expenseDate) {

                const today =
                    new Date();

                const year =
                    today.getFullYear();

                const month =
                    String(
                        today.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        today.getDate()
                    ).padStart(2, "0");


                expenseDate.value =
                    `${year}-${month}-${day}`;

            }


            expenseFormContainer.hidden =
                false;


            expenseFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );
    

}


// Закрити форму витрати
if (
    cancelExpenseButton &&
    expenseFormContainer
) {

    cancelExpenseButton.addEventListener(
        "click",
        function () {
            editingExpenseId = null;

            expenseFormContainer.hidden =
                true;

            if (expenseForm) {
                expenseForm.reset();
            }

        }
    );

}

// ========================================
// ЗБЕРЕЖЕННЯ ВИТРАТИ В SUPABASE
// ========================================

if (expenseForm) {

    expenseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ID автомобіля з адреси
            const params =
                new URLSearchParams(
                    window.location.search
                );

            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            // Дані форми
            const title =
                document
                    .getElementById("expense-title")
                    .value
                    .trim();

            const expenseDate =
                document
                    .getElementById("expense-date")
                    .value;

            const amount =
                document
                    .getElementById("expense-amount")
                    .value;

            const category =
                document
                    .getElementById("expense-category")
                    .value;

const nextInsuranceDate =
    document
        .getElementById(
            "expense-next-insurance-date"
        )
        ?.value || "";                    

            const mileage =
                document
                    .getElementById("expense-mileage")
                    .value;

            const place =
                document
                    .getElementById("expense-place")
                    .value
                    .trim();

            const description =
                document
                    .getElementById("expense-description")
                    .value
                    .trim();


            // Перевіряємо обов'язкові поля
            if (
                !title ||
                !expenseDate ||
                !amount
            ) {

                alert(
                    "Вкажіть назву, дату та суму витрати."
                );

                return;

            }

if (
    category === "insurance" &&
    !nextInsuranceDate
) {

    alert(
        "Вкажіть дату наступного страхування."
    );

    return;
}            


            const saveExpenseButton =
                document.getElementById(
                    "save-expense-button"
                );


            if (saveExpenseButton) {

                saveExpenseButton.disabled =
                    true;

                saveExpenseButton.textContent =
                    "Збереження...";

            }


            const expenseData = {

    car_id:
        carId,

    title:
        title,

    expense_date:
        expenseDate,

    amount:
        Number(amount),

    category:
        category || null,

next_insurance_date:
        category === "insurance" &&
        nextInsuranceDate
            ? nextInsuranceDate
            : null,        

    mileage:
        mileage
            ? Number(mileage)
            : null,

    place:
        place || null,

    description:
        description || null,

    updated_at:
        new Date().toISOString()

};


let result;


// Якщо редагуємо існуючу витрату
if (editingExpenseId) {

    result =
        await supabaseClient
            .from("expenses")
            .update(expenseData)
            .eq(
                "id",
                editingExpenseId
            );


// Якщо створюємо нову витрату
} else {

    result =
        await supabaseClient
            .from("expenses")
            .insert([
                expenseData
            ]);

}


const { error } = result;


            if (error) {

                console.error(
                    "Помилка збереження витрати:",
                    error
                );

                alert(
                    "Не вдалося зберегти витрату."
                );


                if (saveExpenseButton) {

                    saveExpenseButton.disabled =
                        false;

                    saveExpenseButton.textContent =
                        "Зберегти витрату";

                }

                return;

            }


           if (editingExpenseId) {

    alert(
        "Витрату успішно оновлено!"
    );

} else {

    alert(
        "Витрату успішно збережено!"
    );

}


// Режим редагування завершено
editingExpenseId = null;


            expenseForm.reset();


            if (expenseFormContainer) {

                expenseFormContainer.hidden =
                    true;

            }
            await loadExpenses();


            if (saveExpenseButton) {

                saveExpenseButton.disabled =
                    false;

                saveExpenseButton.textContent =
                    "Зберегти витрату";

            }

        }
    );

}

// ========================================
// ЗАВАНТАЖЕННЯ ІСТОРІЇ ВИТРАТ
// ========================================

async function loadExpenses() {

    const expensesList =
        document.getElementById(
            "expenses-list"
        );


    // Працюємо тільки на сторінці витрат
    if (!expensesList) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("expenses")
            .select("*")
            .eq("car_id", carId)
            .order(
                "updated_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Помилка завантаження витрат:",
            error
        );

        return;

    }


    expensesList.innerHTML = "";


    // Якщо витрат ще немає
    if (data.length === 0) {

        expensesList.innerHTML = `

            <div class="maintenance-empty">

                <p>
                    Інших витрат поки немає.
                </p>

            </div>

        `;

        return;

    }


    data.forEach(function (expense) {

        const card =
            document.createElement("div");


        card.className =
            "expense-history-card";


        // Форматуємо дату
        let formattedDate =
            "Дата не вказана";


        if (expense.expense_date) {

            const dateParts =
                expense.expense_date.split("-");

            formattedDate =
                `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        }


        // Назва категорії
        let categoryText =
            "Не вказано";


        if (expense.category === "insurance") {
            categoryText = "Страхування";
        }

        if (expense.category === "parking") {
            categoryText = "Паркування";
        }

        if (expense.category === "wash") {
            categoryText = "Мийка";
        }

        if (expense.category === "parts") {
            categoryText = "Запчастини";
        }

        if (expense.category === "accessories") {
            categoryText = "Аксесуари";
        }

        if (expense.category === "fine") {
            categoryText = "Штраф";
        }

        if (expense.category === "other") {
            categoryText = "Інше";
        }


        card.innerHTML = `

            <div class="expense-history-header">

                <div>

                    <h3>
                        ${expense.title}
                    </h3>

                    <span>
                        ${formattedDate}
                    </span>

                </div>


                <strong>
                    ${Number(expense.amount)
                        .toLocaleString("uk-UA")} грн
                </strong>

            </div>


            <div class="expense-history-info">

                <p>
                    <strong>Категорія:</strong>
                    ${categoryText}
                </p>


                ${
                    expense.mileage !== null
                        ? `
                            <p>
                                <strong>Пробіг:</strong>
                                ${Number(expense.mileage)
                                    .toLocaleString("uk-UA")} км
                            </p>
                        `
                        : ""
                }


                ${
                    expense.place
                        ? `
                            <p>
                                <strong>Місце:</strong>
                                ${expense.place}
                            </p>
                        `
                        : ""
                }


                ${
                    expense.description
                        ? `
                            <p>
                                <strong>Опис:</strong>
                                ${expense.description}
                            </p>
                        `
                        : ""
                }

            </div>

        `;


       // ========================================
// КНОПКА ВИДАЛЕННЯ ВИТРАТИ
// ========================================

const expenseActions =
    document.createElement("div");

expenseActions.className =
    "expense-history-actions";


// ========================================
// КНОПКА РЕДАГУВАННЯ ВИТРАТИ
// ========================================

const editExpenseButton =
    document.createElement("button");

editExpenseButton.type =
    "button";

editExpenseButton.className =
    "edit-expense-button";

editExpenseButton.textContent =
    "Редагувати";


editExpenseButton.addEventListener(
    "click",
    function () {

        editingExpenseId =
            expense.id;


        const expenseFormTitle =
            document.getElementById(
                "expense-form-title"
            );

        const saveExpenseButton =
            document.getElementById(
                "save-expense-button"
            );


        if (expenseFormTitle) {

            expenseFormTitle.textContent =
                "Редагування витрати";

        }


        if (saveExpenseButton) {

            saveExpenseButton.textContent =
                "Зберегти зміни";

        }


        document
            .getElementById("expense-title")
            .value =
            expense.title || "";

        document
            .getElementById("expense-date")
            .value =
            expense.expense_date || "";

        document
            .getElementById("expense-amount")
            .value =
            expense.amount ?? "";

        document
            .getElementById("expense-category")
            .value =
            expense.category || "";

if (expenseNextInsuranceDate) {

    expenseNextInsuranceDate.value =
        expense.next_insurance_date || "";

}

updateInsuranceNextDateField();            

        document
            .getElementById("expense-mileage")
            .value =
            expense.mileage ?? "";

        document
            .getElementById("expense-place")
            .value =
            expense.place || "";

        document
            .getElementById("expense-description")
            .value =
            expense.description || "";


        if (expenseFormContainer) {

            expenseFormContainer.hidden =
                false;

            expenseFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);

    const deleteExpenseButton =
    document.createElement("button");

deleteExpenseButton.type =
    "button";

deleteExpenseButton.className =
    "delete-expense-button";

deleteExpenseButton.textContent =
    "Видалити";


deleteExpenseButton.addEventListener(
    "click",
    async function () {

        const confirmed =
            confirm(
                `Видалити витрату "${expense.title}"?`
            );


        if (!confirmed) {
            return;
        }


        const { error: deleteExpenseError } =
            await supabaseClient
                .from("expenses")
                .delete()
                .eq("id", expense.id);


        if (deleteExpenseError) {

            console.error(
                "Помилка видалення витрати:",
                deleteExpenseError
            );

            alert(
                "Не вдалося видалити витрату."
            );

            return;

        }


        alert(
            "Витрату успішно видалено!"
        );


        await loadExpenses();

    }
);


expenseActions.appendChild(
    editExpenseButton
);
expenseActions.appendChild(
    deleteExpenseButton
);

card.appendChild(
    expenseActions
);
        expensesList.appendChild(card);

    });

}


// Завантажуємо витрати при відкритті сторінки
loadExpenses();

// ========================================
// ПЕРЕХІД НА СТОРІНКУ ІСТОРІЇ
// ========================================

const openHistoryPageButton =
    document.getElementById(
        "open-history-page"
    );


if (
    openHistoryPageButton &&
    currentCarId
) {

    openHistoryPageButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "history.html?id=" +
                encodeURIComponent(
                    currentCarId
                );

        }
    );

}

// ========================================
// ПОВНА ІСТОРІЯ АВТОМОБІЛЯ
// ========================================

async function loadFullHistory() {

    const historyList =
        document.getElementById(
            "history-list"
        );


    // Працюємо тільки на history.html
    if (!historyList) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }


    // Одночасно завантажуємо всі 4 типи записів
    const [
    maintenanceResult,
    repairsResult,
    refuelsResult,
    expensesResult,
    chargesResult
] =
    await Promise.all([

        supabaseClient
            .from("maintenance")
            .select("*")
            .eq("car_id", carId),

        supabaseClient
            .from("repairs")
            .select("*")
            .eq("car_id", carId),

        supabaseClient
            .from("refuels")
            .select("*")
            .eq("car_id", carId),

        supabaseClient
            .from("expenses")
            .select("*")
            .eq("car_id", carId),

        supabaseClient
            .from("charges")
            .select("*")
            .eq("car_id", carId)

    ]);


    // Перевіряємо помилки
    if (
    maintenanceResult.error ||
    repairsResult.error ||
    refuelsResult.error ||
    expensesResult.error ||
    chargesResult.error
) {

        console.error(
            "Помилка завантаження повної історії:",
            {
                maintenance:
                    maintenanceResult.error,

                repairs:
                    repairsResult.error,

                refuels:
                    refuelsResult.error,

                expenses:
    expensesResult.error,

charges:
    chargesResult.error
            }
        );


        historyList.innerHTML = `

            <div class="maintenance-empty">

                <p>
                    Не вдалося завантажити історію.
                </p>

            </div>

        `;

        return;

    }


    const historyItems = [];
    // ========================================
// СТАТИСТИКА ВИТРАТ
// ========================================

const maintenanceTotal =
    maintenanceResult.data.reduce(
        function (sum, item) {

            return sum +
                Number(item.cost || 0);

        },
        0
    );


const repairsTotal =
    repairsResult.data.reduce(
        function (sum, item) {

            return sum +
                Number(item.cost || 0);

        },
        0
    );


const refuelsTotal =
    refuelsResult.data.reduce(
        function (sum, item) {

            return sum +
                Number(item.total_cost || 0);

        },
        0
    );


const expensesTotal =
    expensesResult.data.reduce(
        function (sum, item) {

            return sum +
                Number(item.amount || 0);

        },
        0
    );

    const chargesTotal =
    chargesResult.data.reduce(
        function (sum, item) {

            return sum +
                Number(
                    item.total_cost || 0
                );

        },
        0
    );


const totalCost =
    maintenanceTotal +
    repairsTotal +
    refuelsTotal +
    expensesTotal +
    chargesTotal;


function setHistoryCost(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );

    if (element) {

        element.textContent =
            Number(value)
                .toLocaleString(
                    "uk-UA",
                    {
                        maximumFractionDigits: 2
                    }
                ) +
            " грн";

    }

}


setHistoryCost(
    "history-total-cost",
    totalCost
);

setHistoryCost(
    "history-maintenance-cost",
    maintenanceTotal
);

setHistoryCost(
    "history-repairs-cost",
    repairsTotal
);

setHistoryCost(
    "history-refuels-cost",
    refuelsTotal
);

setHistoryCost(
    "history-expenses-cost",
    expensesTotal
);

setHistoryCost(
    "history-charges-cost",
    chargesTotal
);


    // ========================================
    // ОБСЛУГОВУВАННЯ
    // ========================================

    maintenanceResult.data.forEach(
        function (item) {

            historyItems.push({

                type: "maintenance",

                icon: "🔧",

                typeText:
                    "Обслуговування",

                date:
                    item.service_date,

                title:
                    item.title,

                amount:
                    item.cost,

                mileage:
                    item.mileage,

                description:
                    item.description,

                place:
                    item.service_place,

                createdAt:
                    item.created_at

            });

        }
    );


    // ========================================
    // РЕМОНТИ
    // ========================================

    repairsResult.data.forEach(
        function (item) {

            historyItems.push({

                type: "repair",

                icon: "🛠️",

                typeText:
                    "Ремонт",

                date:
                    item.repair_date,

                title:
                    item.title,

                amount:
                    item.cost,

                mileage:
                    item.mileage,

                description:
                    item.description,

                place:
                    item.repair_place,

                createdAt:
                    item.created_at

            });

        }
    );


    // ========================================
    // ЗАПРАВКИ
    // ========================================

    refuelsResult.data.forEach(
        function (item) {

            historyItems.push({

                type: "refuel",

                icon: "⛽",

                typeText:
                    "Заправка",

                date:
                    item.refuel_date,

                title:
                    `${Number(item.liters)
                        .toLocaleString("uk-UA")} л пального`,

                amount:
                    item.total_cost,

                mileage:
                    item.mileage,

                description:
                    item.station
                        ? `АЗС: ${item.station}`
                        : null,

                place:
                    null,

                createdAt:
                    item.created_at

            });

        }
    );


    // ========================================
    // ІНШІ ВИТРАТИ
    // ========================================

    // ========================================
// ЗАРЯДЖАННЯ
// ========================================

chargesResult.data?.forEach(
    function (item) {

        historyItems.push({

            type:
                "charge",

            icon:
                "⚡",

            typeText:
                "Заряджання",

            date:
                item.charge_date,

            title:
                `${Number(
                    item.energy_kwh || 0
                ).toLocaleString(
                    "uk-UA"
                )} кВт·год`,

            amount:
                item.total_cost,

            mileage:
                item.mileage,

            description:
                item.description,

            place:
                item.place,

            createdAt:
                item.created_at

        });

    }
);
    expensesResult.data.forEach(
        function (item) {

            historyItems.push({

                type: "expense",

                icon: "💰",

                typeText:
    "Інша витрата",

                date:
                    item.expense_date,

                title:
                    item.title,

                amount:
                    item.amount,

                mileage:
                    item.mileage,

                description:
                    item.description,

                place:
                    item.place,

                createdAt:
                    item.created_at

            });

        }
    );


    // ========================================
    // СОРТУВАННЯ
    // ========================================

    historyItems.sort(
        function (a, b) {

            const dateA =
                new Date(
                    a.date ||
                    a.createdAt ||
                    0
                );

            const dateB =
                new Date(
                    b.date ||
                    b.createdAt ||
                    0
                );


            return dateB - dateA;

        }
    );


    historyList.innerHTML = "";


    // Якщо історія порожня
    if (historyItems.length === 0) {

        historyList.innerHTML = `

            <div class="maintenance-empty">

                <p>
                    Історія автомобіля поки порожня.
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // СТВОРЕННЯ КАРТОК
    // ========================================

    historyItems.forEach(
        function (item) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "full-history-card";

                card.dataset.historyType =
    item.type;


            let formattedDate =
                "Дата не вказана";


            if (item.date) {

                const parts =
                    item.date.split("-");

                formattedDate =
                    `${parts[2]}.${parts[1]}.${parts[0]}`;

            }


            card.innerHTML = `

                <div class="full-history-header">

                    <div class="full-history-title">

                        <div class="full-history-icon">
                            ${item.icon}
                        </div>

                        <div>

                            <span class="full-history-type">
                                ${item.typeText}
                            </span>

                            <h3>
                                ${item.title}
                            </h3>

                            <p>
                                ${formattedDate}
                            </p>

                        </div>

                    </div>


                    ${
                        item.amount !== null &&
                        item.amount !== undefined
                            ? `
                                <strong>
                                    ${Number(item.amount)
                                        .toLocaleString("uk-UA")} грн
                                </strong>
                            `
                            : ""
                    }

                </div>


                <div class="full-history-info">

                    ${
                        item.mileage !== null &&
                        item.mileage !== undefined
                            ? `
                                <p>
                                    <strong>Пробіг:</strong>
                                    ${Number(item.mileage)
                                        .toLocaleString("uk-UA")} км
                                </p>
                            `
                            : ""
                    }


                    ${
                        item.place
                            ? `
                                <p>
                                    <strong>Місце:</strong>
                                    ${item.place}
                                </p>
                            `
                            : ""
                    }


                    ${
                        item.description
                            ? `
                                <p>
                                    ${item.description}
                                </p>
                            `
                            : ""
                    }

                </div>

            `;


            historyList.appendChild(
                card
            );

        }
    );

}


// Завантажуємо повну історію
loadFullHistory().then(
    function () {

        if (
            window.location.hash ===
            "#history-export"
        ) {

            const historyExport =
                document.getElementById(
                    "history-export"
                );


            if (historyExport) {

                setTimeout(
                    function () {

                        historyExport.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    },
                    100
                );

            }

        }

    }
);

// ========================================
// ВИБІР ПЕРІОДУ ДЛЯ ЕКСПОРТУ
// ========================================

const exportPeriodMode =
    document.getElementById(
        "export-period-mode"
    );

const exportDateRange =
    document.getElementById(
        "export-date-range"
    );


function updateExportPeriodFields() {

    if (
        !exportPeriodMode ||
        !exportDateRange
    ) {
        return;
    }


    if (
        exportPeriodMode.value ===
        "custom"
    ) {

        exportDateRange.hidden =
            false;

    } else {

        exportDateRange.hidden =
            true;

    }

}


if (
    exportPeriodMode &&
    exportDateRange
) {

    exportPeriodMode.addEventListener(
        "change",
        updateExportPeriodFields
    );


    updateExportPeriodFields();

}

// ========================================
// ЕКСПОРТ ІСТОРІЇ У CSV
// ========================================

const exportHistoryCsvButton =
    document.getElementById(
        "export-history-csv"
    );


function csvFuelTypeText(
    fuelType
) {

    const fuelNames = {
        petrol: "Бензин",
        diesel: "Дизель",
        lpg: "Газ",
        petrol_lpg: "Бензин + газ",
        hybrid: "Гібрид",
        phev: "Plug-in гібрид",
        electric: "Електро"
    };


    return (
        fuelNames[fuelType] ||
        fuelType ||
        ""
    );

}


function csvNumber(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }


    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return value;
    }


    return number.toLocaleString(
        "uk-UA",
        {
            useGrouping: false,
            maximumFractionDigits: 6
        }
    );

}


function csvEscape(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {
        return "\"\"";
    }


    const text =
        String(value)
            .replace(
                /\r?\n/g,
                " "
            )
            .replace(
                /"/g,
                "\"\""
            );


    return `"${text}"`;

}


function csvDateIsAllowed(
    date,
    dateFrom,
    dateTo
) {

    if (
        !dateFrom &&
        !dateTo
    ) {
        return true;
    }


    if (!date) {
        return false;
    }


    if (
        dateFrom &&
        date < dateFrom
    ) {
        return false;
    }


    if (
        dateTo &&
        date > dateTo
    ) {
        return false;
    }


    return true;

}


if (exportHistoryCsvButton) {

    exportHistoryCsvButton.addEventListener(
        "click",
        async function () {

            const params =
                new URLSearchParams(
                    window.location.search
                );


            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            // ========================================
            // ЯКІ ДАНІ ОБРАНІ
            // ========================================

            const exportCarData =
                document.getElementById(
                    "export-car-data"
                )?.checked;

            const exportMaintenance =
                document.getElementById(
                    "export-maintenance"
                )?.checked;

            const exportRepairs =
                document.getElementById(
                    "export-repairs"
                )?.checked;

            const exportRefuels =
                document.getElementById(
                    "export-refuels"
                )?.checked;

            const exportCharges =
                document.getElementById(
                    "export-charges"
                )?.checked;

            const exportExpenses =
                document.getElementById(
                    "export-expenses"
                )?.checked;


            if (
                !exportCarData &&
                !exportMaintenance &&
                !exportRepairs &&
                !exportRefuels &&
                !exportCharges &&
                !exportExpenses
            ) {

                alert(
                    "Оберіть хоча б один тип даних для експорту."
                );

                return;

            }


            // ========================================
            // ПЕРІОД
            // ========================================

            let dateFrom =
                "";

            let dateTo =
                "";


            if (
                exportPeriodMode?.value ===
                "custom"
            ) {

                dateFrom =
                    document.getElementById(
                        "export-date-from"
                    )?.value || "";

                dateTo =
                    document.getElementById(
                        "export-date-to"
                    )?.value || "";


                if (
                    !dateFrom ||
                    !dateTo
                ) {

                    alert(
                        "Вкажіть дату «Від» і дату «До»."
                    );

                    return;

                }


                if (
                    dateFrom >
                    dateTo
                ) {

                    alert(
                        "Дата «Від» не може бути пізнішою за дату «До»."
                    );

                    return;

                }

            }


            exportHistoryCsvButton.disabled =
                true;

            exportHistoryCsvButton.textContent =
                "Підготовка CSV...";


            try {

                // ========================================
                // ЗАВАНТАЖЕННЯ ДАНИХ
                // ========================================

                const carPromise =
                    supabaseClient
                        .from("cars")
                        .select("*")
                        .eq(
                            "id",
                            carId
                        )
                        .single();


                const maintenancePromise =
                    exportMaintenance
                        ? supabaseClient
                            .from("maintenance")
                            .select("*")
                            .eq(
                                "car_id",
                                carId
                            )
                        : Promise.resolve({
                            data: [],
                            error: null
                        });


                const repairsPromise =
                    exportRepairs
                        ? supabaseClient
                            .from("repairs")
                            .select("*")
                            .eq(
                                "car_id",
                                carId
                            )
                        : Promise.resolve({
                            data: [],
                            error: null
                        });


                const refuelsPromise =
                    exportRefuels
                        ? supabaseClient
                            .from("refuels")
                            .select("*")
                            .eq(
                                "car_id",
                                carId
                            )
                        : Promise.resolve({
                            data: [],
                            error: null
                        });


                const chargesPromise =
                    exportCharges
                        ? supabaseClient
                            .from("charges")
                            .select("*")
                            .eq(
                                "car_id",
                                carId
                            )
                        : Promise.resolve({
                            data: [],
                            error: null
                        });


                const expensesPromise =
                    exportExpenses
                        ? supabaseClient
                            .from("expenses")
                            .select("*")
                            .eq(
                                "car_id",
                                carId
                            )
                        : Promise.resolve({
                            data: [],
                            error: null
                        });


                const [
                    carResult,
                    maintenanceResult,
                    repairsResult,
                    refuelsResult,
                    chargesResult,
                    expensesResult
                ] =
                    await Promise.all([
                        carPromise,
                        maintenancePromise,
                        repairsPromise,
                        refuelsPromise,
                        chargesPromise,
                        expensesPromise
                    ]);


                if (
                    carResult.error ||
                    maintenanceResult.error ||
                    repairsResult.error ||
                    refuelsResult.error ||
                    chargesResult.error ||
                    expensesResult.error
                ) {

                    console.error(
                        "Помилка експорту:",
                        {
                            car:
                                carResult.error,

                            maintenance:
                                maintenanceResult.error,

                            repairs:
                                repairsResult.error,

                            refuels:
                                refuelsResult.error,

                            charges:
                                chargesResult.error,

                            expenses:
                                expensesResult.error
                        }
                    );


                    alert(
                        "Не вдалося отримати дані для експорту."
                    );

                    return;

                }


                const car =
                    carResult.data;


                if (!car) {

                    alert(
                        "Автомобіль не знайдено."
                    );

                    return;

                }


                // ========================================
                // РЯДКИ CSV
                // ========================================

                const csvRows =
                    [];


                if (exportCarData) {

                    csvRows.push({

                        type:
                            "Автомобіль",

                        date:
                            "",

                        title:
                            car.name || "",

                        make:
                            car.make || "",

                        model:
                            car.model || "",

                        year:
                            car.year ?? "",

                        engine:
                            car.engine || "",

                        mileage:
                            car.mileage ?? "",

                        fuelType:
                            csvFuelTypeText(
                                car.fuel_type
                            ),

                        liters:
                            "",

                        energy:
                            "",

                        pricePerLiter:
                            "",

                        pricePerKwh:
                            "",

                        amount:
                            "",

                        place:
                            "",

                        expenseCategory:
                            "",

                        description:
                            "",

                        fullTank:
                            "",

                        chargeSource:
                            "",

                        startPercent:
                            "",

                        endPercent:
                            "",

                        reminder:
                            "",

                        reminderMileage:
                            "",

                        reminderMonths:
                            "",

                        licensePlate:
                            car.license_plate || "",

                        vin:
                            car.vin || "",

                        tankCapacity:
                            car.tank_capacity ?? "",

                        lpgCapacity:
                            car.lpg_tank_capacity ?? "",

                        batteryCapacity:
                            car.battery_capacity ?? "",

                        transmission:
                            car.transmission || ""

                    });

                }


                maintenanceResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.service_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            csvRows.push({

                                type:
                                    "Обслуговування",

                                date:
                                    item.service_date || "",

                                title:
                                    item.title || "",

                                mileage:
                                    item.mileage ?? "",

                                amount:
                                    item.cost ?? "",

                                place:
                                    item.service_place || "",

                                description:
                                    item.description || "",

                                reminder:
                                    item.reminder_enabled
                                        ? "Так"
                                        : "Ні",

                                reminderMileage:
                                    item.reminder_mileage_interval ?? "",

                                reminderMonths:
                                    item.reminder_months_interval ?? ""

                            });

                        }
                    );


                repairsResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.repair_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            csvRows.push({

                                type:
                                    "Ремонт",

                                date:
                                    item.repair_date || "",

                                title:
                                    item.title || "",

                                mileage:
                                    item.mileage ?? "",

                                amount:
                                    item.cost ?? "",

                                place:
                                    item.repair_place || "",

                                description:
                                    item.description || ""

                            });

                        }
                    );


                refuelsResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.refuel_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            csvRows.push({

                                type:
                                    "Заправка",

                                date:
                                    item.refuel_date || "",

                                title:
                                    "Заправка",

                                mileage:
                                    item.mileage ?? "",

                                fuelType:
                                    csvFuelTypeText(
                                        item.fuel_type
                                    ),

                                liters:
                                    item.liters ?? "",

                                pricePerLiter:
                                    item.price_per_liter ?? "",

                                amount:
                                    item.total_cost ?? "",

                                place:
                                    item.station || "",

                                fullTank:
                                    item.full_tank
                                        ? "Так"
                                        : "Ні"

                            });

                        }
                    );


                chargesResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.charge_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            csvRows.push({

                                type:
                                    "Заряджання",

                                date:
                                    item.charge_date || "",

                                title:
                                    "Заряджання",

                                mileage:
                                    item.mileage ?? "",

                                energy:
                                    item.energy_kwh ?? "",

                                pricePerKwh:
                                    item.price_per_kwh ?? "",

                                amount:
                                    item.total_cost ?? "",

                                place:
                                    item.place || "",

                                description:
                                    item.description || "",

                                chargeSource:
                                    item.charge_source || "",

                                startPercent:
                                    item.start_percent ?? "",

                                endPercent:
                                    item.end_percent ?? ""

                            });

                        }
                    );


                expensesResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.expense_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            csvRows.push({

                                type:
                                    "Інша витрата",

                                date:
                                    item.expense_date || "",

                                title:
                                    item.title || "",

                                mileage:
                                    item.mileage ?? "",

                                amount:
                                    item.amount ?? "",

                                place:
                                    item.place || "",

                                expenseCategory:
                                    item.category || "",

                                description:
                                    item.description || ""

                            });

                        }
                    );


                if (
                    csvRows.length === 0
                ) {

                    alert(
                        "За вибраний період немає даних для експорту."
                    );

                    return;

                }


                // Сортуємо записи за датою.
                // Дані автомобіля залишаємо зверху.
                csvRows.sort(
                    function (a, b) {

                        if (
                            a.type ===
                            "Автомобіль"
                        ) {
                            return -1;
                        }


                        if (
                            b.type ===
                            "Автомобіль"
                        ) {
                            return 1;
                        }


                        return String(
                            b.date || ""
                        ).localeCompare(
                            String(
                                a.date || ""
                            )
                        );

                    }
                );


                // ========================================
                // ЗАГОЛОВКИ CSV
                // ========================================

                const csvHeaders = [

                    ["type", "Тип запису"],
                    ["date", "Дата"],
                    ["title", "Назва"],

                    ["make", "Марка"],
                    ["model", "Модель"],
                    ["year", "Рік"],
                    ["engine", "Двигун"],

                    ["mileage", "Пробіг, км"],

                    ["fuelType", "Тип пального"],
                    ["liters", "Літри"],
                    ["energy", "Енергія, кВт·год"],

                    [
                        "pricePerLiter",
                        "Ціна за літр, грн"
                    ],

                    [
                        "pricePerKwh",
                        "Ціна за кВт·год, грн"
                    ],

                    ["amount", "Сума, грн"],

                    [
                        "place",
                        "Місце / АЗС"
                    ],

                    [
                        "expenseCategory",
                        "Категорія витрати"
                    ],

                    ["description", "Опис"],

                    ["fullTank", "Повний бак"],

                    [
                        "chargeSource",
                        "Джерело заряджання"
                    ],

                    [
                        "startPercent",
                        "Заряд на початку, %"
                    ],

                    [
                        "endPercent",
                        "Заряд в кінці, %"
                    ],

                    ["reminder", "Нагадування"],

                    [
                        "reminderMileage",
                        "Інтервал пробігу, км"
                    ],

                    [
                        "reminderMonths",
                        "Інтервал, міс."
                    ],

                    [
                        "licensePlate",
                        "Держномер"
                    ],

                    ["vin", "VIN"],

                    [
                        "tankCapacity",
                        "Паливний бак, л"
                    ],

                    [
                        "lpgCapacity",
                        "Газовий балон, л"
                    ],

                    [
                        "batteryCapacity",
                        "Батарея, кВт·год"
                    ],

                    [
                        "transmission",
                        "Коробка передач"
                    ]

                ];


                const numericFields =
                    new Set([
                        "year",
                        "mileage",
                        "liters",
                        "energy",
                        "pricePerLiter",
                        "pricePerKwh",
                        "amount",
                        "startPercent",
                        "endPercent",
                        "reminderMileage",
                        "reminderMonths",
                        "tankCapacity",
                        "lpgCapacity",
                        "batteryCapacity"
                    ]);


                const csvLines =
                    [];


                csvLines.push(
                    csvHeaders
                        .map(
                            function (header) {

                                return csvEscape(
                                    header[1]
                                );

                            }
                        )
                        .join(";")
                );


                csvRows.forEach(
                    function (row) {

                        const line =
                            csvHeaders.map(
                                function (header) {

                                    const key =
                                        header[0];


                                    const value =
                                        numericFields.has(
                                            key
                                        )
                                            ? csvNumber(
                                                row[key]
                                            )
                                            : (
                                                row[key] ??
                                                ""
                                            );


                                    return csvEscape(
                                        value
                                    );

                                }
                            )
                            .join(";");


                        csvLines.push(
                            line
                        );

                    }
                );


                const csvContent =
                    "\uFEFF" +
                    csvLines.join(
                        "\r\n"
                    );


                const blob =
                    new Blob(
                        [
                            csvContent
                        ],
                        {
                            type:
                                "text/csv;charset=utf-8;"
                        }
                    );


                const downloadUrl =
                    URL.createObjectURL(
                        blob
                    );


                const downloadLink =
                    document.createElement(
                        "a"
                    );


                const safeCarName =
                    String(
                        car.name ||
                        `${car.make || ""}_${car.model || ""}` ||
                        "avto"
                    )
                        .trim()
                        .replace(
                            /[\\/:*?"<>|]/g,
                            "-"
                        )
                        .replace(
                            /\s+/g,
                            "_"
                        );


                const periodName =
                    dateFrom && dateTo
                        ? `${dateFrom}_${dateTo}`
                        : "ves_chas";


                downloadLink.href =
                    downloadUrl;

                downloadLink.download =
                    `AvtoPomichnyk_${safeCarName}_${periodName}.csv`;


                document.body.appendChild(
                    downloadLink
                );


                downloadLink.click();


                downloadLink.remove();


                URL.revokeObjectURL(
                    downloadUrl
                );

            } catch (error) {

                console.error(
                    "Помилка створення CSV:",
                    error
                );

                alert(
                    "Не вдалося створити CSV-файл."
                );

            } finally {

                exportHistoryCsvButton.disabled =
                    false;

                exportHistoryCsvButton.textContent =
                    "📊 Експорт CSV";

            }

        }
    );

}

// ========================================
// ЕКСПОРТ ІСТОРІЇ У EXCEL
// ========================================

const exportHistoryExcelButton =
    document.getElementById(
        "export-history-excel"
    );


function formatExcelExportDate(
    value
) {

    if (!value) {
        return "";
    }


    const parts =
        String(value).split("-");


    if (parts.length === 3) {

        return (
            parts[2] +
            "." +
            parts[1] +
            "." +
            parts[0]
        );

    }


    return value;

}


if (exportHistoryExcelButton) {

    exportHistoryExcelButton.addEventListener(
        "click",
        async function () {

            if (
                typeof XLSX ===
                "undefined"
            ) {

                alert(
                    "Не вдалося завантажити модуль Excel."
                );

                return;

            }


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            // ========================================
            // ЯКІ ДАНІ ОБРАНІ
            // ========================================

            const exportCarData =
                document.getElementById(
                    "export-car-data"
                )?.checked;

            const exportMaintenance =
                document.getElementById(
                    "export-maintenance"
                )?.checked;

            const exportRepairs =
                document.getElementById(
                    "export-repairs"
                )?.checked;

            const exportRefuels =
                document.getElementById(
                    "export-refuels"
                )?.checked;

            const exportCharges =
                document.getElementById(
                    "export-charges"
                )?.checked;

            const exportExpenses =
                document.getElementById(
                    "export-expenses"
                )?.checked;


            if (
                !exportCarData &&
                !exportMaintenance &&
                !exportRepairs &&
                !exportRefuels &&
                !exportCharges &&
                !exportExpenses
            ) {

                alert(
                    "Оберіть хоча б один тип даних для експорту."
                );

                return;

            }


            // ========================================
            // ПЕРІОД
            // ========================================

            let dateFrom =
                "";

            let dateTo =
                "";


            if (
                exportPeriodMode?.value ===
                "custom"
            ) {

                dateFrom =
                    document.getElementById(
                        "export-date-from"
                    )?.value || "";

                dateTo =
                    document.getElementById(
                        "export-date-to"
                    )?.value || "";


                if (
                    !dateFrom ||
                    !dateTo
                ) {

                    alert(
                        "Вкажіть дату «Від» і дату «До»."
                    );

                    return;

                }


                if (
                    dateFrom >
                    dateTo
                ) {

                    alert(
                        "Дата «Від» не може бути пізнішою за дату «До»."
                    );

                    return;

                }

            }


            exportHistoryExcelButton.disabled =
                true;

            exportHistoryExcelButton.textContent =
                "Підготовка Excel...";


            try {

                // ========================================
                // ЗАВАНТАЖЕННЯ ДАНИХ
                // ========================================

                const [
                    carResult,
                    maintenanceResult,
                    repairsResult,
                    refuelsResult,
                    chargesResult,
                    expensesResult
                ] =
                    await Promise.all([

                        supabaseClient
                            .from("cars")
                            .select("*")
                            .eq(
                                "id",
                                carId
                            )
                            .single(),

                        exportMaintenance
                            ? supabaseClient
                                .from("maintenance")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            }),

                        exportRepairs
                            ? supabaseClient
                                .from("repairs")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            }),

                        exportRefuels
                            ? supabaseClient
                                .from("refuels")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            }),

                        exportCharges
                            ? supabaseClient
                                .from("charges")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            }),

                        exportExpenses
                            ? supabaseClient
                                .from("expenses")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            })

                    ]);


                if (
                    carResult.error ||
                    maintenanceResult.error ||
                    repairsResult.error ||
                    refuelsResult.error ||
                    chargesResult.error ||
                    expensesResult.error
                ) {

                    console.error(
                        "Помилка Excel-експорту:",
                        {
                            car:
                                carResult.error,

                            maintenance:
                                maintenanceResult.error,

                            repairs:
                                repairsResult.error,

                            refuels:
                                refuelsResult.error,

                            charges:
                                chargesResult.error,

                            expenses:
                                expensesResult.error
                        }
                    );


                    alert(
                        "Не вдалося отримати дані для Excel."
                    );

                    return;

                }


                const car =
                    carResult.data;


                const excelRows =
                    [];


                // ========================================
                // ДАНІ АВТОМОБІЛЯ
                // ========================================

                if (exportCarData) {

                    excelRows.push({

                        "Тип запису":
                            "Автомобіль",

                        "Дата":
                            "",

                        "Назва":
                            car.name || "",

                        "Марка":
                            car.make || "",

                        "Модель":
                            car.model || "",

                        "Рік":
                            car.year ?? "",

                        "Двигун":
                            car.engine || "",

                        "Пробіг, км":
                            car.mileage ?? "",

                        "Тип пального":
                            csvFuelTypeText(
                                car.fuel_type
                            ),

                        "Літри":
                            "",

                        "Енергія, кВт·год":
                            "",

                        "Ціна за літр, грн":
                            "",

                        "Ціна за кВт·год, грн":
                            "",

                        "Сума, грн":
                            "",

                        "Місце / АЗС":
                            "",

                        "Категорія":
                            "",

                        "Опис":
                            "",

                        "Повний бак":
                            "",

                        "Джерело заряджання":
                            "",

                        "Заряд на початку, %":
                            "",

                        "Заряд в кінці, %":
                            "",

                        "Нагадування":
                            "",

                        "Інтервал пробігу, км":
                            "",

                        "Інтервал, міс.":
                            "",

                        "Держномер":
                            car.license_plate || "",

                        "VIN":
                            car.vin || "",

                        "Паливний бак, л":
                            car.tank_capacity ?? "",

                        "Газовий балон, л":
                            car.lpg_tank_capacity ?? "",

                        "Батарея, кВт·год":
                            car.battery_capacity ?? "",

                        "Коробка передач":
                            car.transmission || ""

                    });

                }


                // ========================================
                // ОБСЛУГОВУВАННЯ
                // ========================================

                maintenanceResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.service_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            excelRows.push({

                                "Тип запису":
                                    "Обслуговування",

                                "Дата":
                                    formatExcelExportDate(
                                        item.service_date
                                    ),

                                "Назва":
                                    item.title || "",

                                "Пробіг, км":
                                    item.mileage ?? "",

                                "Сума, грн":
                                    item.cost ?? "",

                                "Місце / АЗС":
                                    item.service_place || "",

                                "Опис":
                                    item.description || "",

                                "Нагадування":
                                    item.reminder_enabled
                                        ? "Так"
                                        : "Ні",

                                "Інтервал пробігу, км":
                                    item.reminder_mileage_interval ?? "",

                                "Інтервал, міс.":
                                    item.reminder_months_interval ?? ""

                            });

                        }
                    );


                // ========================================
                // РЕМОНТИ
                // ========================================

                repairsResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.repair_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            excelRows.push({

                                "Тип запису":
                                    "Ремонт",

                                "Дата":
                                    formatExcelExportDate(
                                        item.repair_date
                                    ),

                                "Назва":
                                    item.title || "",

                                "Пробіг, км":
                                    item.mileage ?? "",

                                "Сума, грн":
                                    item.cost ?? "",

                                "Місце / АЗС":
                                    item.repair_place || "",

                                "Опис":
                                    item.description || ""

                            });

                        }
                    );


                // ========================================
                // ЗАПРАВКИ
                // ========================================

                refuelsResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.refuel_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            excelRows.push({

                                "Тип запису":
                                    "Заправка",

                                "Дата":
                                    formatExcelExportDate(
                                        item.refuel_date
                                    ),

                                "Назва":
                                    "Заправка",

                                "Пробіг, км":
                                    item.mileage ?? "",

                                "Тип пального":
                                    csvFuelTypeText(
                                        item.fuel_type
                                    ),

                                "Літри":
                                    item.liters ?? "",

                                "Ціна за літр, грн":
                                    item.price_per_liter ?? "",

                                "Сума, грн":
                                    item.total_cost ?? "",

                                "Місце / АЗС":
                                    item.station || "",

                                "Повний бак":
                                    item.full_tank
                                        ? "Так"
                                        : "Ні"

                            });

                        }
                    );


                // ========================================
                // ЗАРЯДЖАННЯ
                // ========================================

                chargesResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.charge_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            excelRows.push({

                                "Тип запису":
                                    "Заряджання",

                                "Дата":
                                    formatExcelExportDate(
                                        item.charge_date
                                    ),

                                "Назва":
                                    "Заряджання",

                                "Пробіг, км":
                                    item.mileage ?? "",

                                "Енергія, кВт·год":
                                    item.energy_kwh ?? "",

                                "Ціна за кВт·год, грн":
                                    item.price_per_kwh ?? "",

                                "Сума, грн":
                                    item.total_cost ?? "",

                                "Місце / АЗС":
                                    item.place || "",

                                "Опис":
                                    item.description || "",

                                "Джерело заряджання":
                                    item.charge_source || "",

                                "Заряд на початку, %":
                                    item.start_percent ?? "",

                                "Заряд в кінці, %":
                                    item.end_percent ?? ""

                            });

                        }
                    );


                // ========================================
                // ІНШІ ВИТРАТИ
                // ========================================

                expensesResult.data
                    .filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.expense_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    )
                    .forEach(
                        function (item) {

                            excelRows.push({

                                "Тип запису":
                                    "Інша витрата",

                                "Дата":
                                    formatExcelExportDate(
                                        item.expense_date
                                    ),

                                "Назва":
                                    item.title || "",

                                "Пробіг, км":
                                    item.mileage ?? "",

                                "Сума, грн":
                                    item.amount ?? "",

                                "Місце / АЗС":
                                    item.place || "",

                                "Категорія":
                                    item.category || "",

                                "Опис":
                                    item.description || ""

                            });

                        }
                    );


                if (
                    excelRows.length === 0
                ) {

                    alert(
                        "За вибраний період немає даних для експорту."
                    );

                    return;

                }


                // ========================================
                // СТВОРЕННЯ EXCEL
                // ========================================

                const excelHeaders = [

                    "Тип запису",
                    "Дата",
                    "Назва",
                    "Марка",
                    "Модель",
                    "Рік",
                    "Двигун",
                    "Пробіг, км",
                    "Тип пального",
                    "Літри",
                    "Енергія, кВт·год",
                    "Ціна за літр, грн",
                    "Ціна за кВт·год, грн",
                    "Сума, грн",
                    "Місце / АЗС",
                    "Категорія",
                    "Опис",
                    "Повний бак",
                    "Джерело заряджання",
                    "Заряд на початку, %",
                    "Заряд в кінці, %",
                    "Нагадування",
                    "Інтервал пробігу, км",
                    "Інтервал, міс.",
                    "Держномер",
                    "VIN",
                    "Паливний бак, л",
                    "Газовий балон, л",
                    "Батарея, кВт·год",
                    "Коробка передач"

                ];


                const worksheet =
                    XLSX.utils.json_to_sheet(
                        excelRows,
                        {
                            header:
                                excelHeaders
                        }
                    );


                // Нормальна ширина колонок
                worksheet["!cols"] = [

                    { wch: 18 },
                    { wch: 13 },
                    { wch: 28 },
                    { wch: 16 },
                    { wch: 18 },
                    { wch: 10 },
                    { wch: 12 },
                    { wch: 15 },
                    { wch: 18 },
                    { wch: 12 },
                    { wch: 18 },
                    { wch: 18 },
                    { wch: 22 },
                    { wch: 14 },
                    { wch: 24 },
                    { wch: 18 },
                    { wch: 35 },
                    { wch: 14 },
                    { wch: 22 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 16 },
                    { wch: 22 },
                    { wch: 18 },
                    { wch: 16 },
                    { wch: 24 },
                    { wch: 18 },
                    { wch: 20 },
                    { wch: 20 },
                    { wch: 20 }

                ];


                const workbook =
                    XLSX.utils.book_new();


                XLSX.utils.book_append_sheet(
                    workbook,
                    worksheet,
                    "Історія авто"
                );


                const safeCarName =
                    String(
                        car.name ||
                        "avto"
                    )
                        .trim()
                        .replace(
                            /[\\/:*?"<>|]/g,
                            "-"
                        )
                        .replace(
                            /\s+/g,
                            "_"
                        );


                const periodName =
                    dateFrom && dateTo
                        ? `${dateFrom}_${dateTo}`
                        : "ves_chas";


                XLSX.writeFile(
                    workbook,
                    `AvtoPomichnyk_${safeCarName}_${periodName}.xlsx`
                );

            } catch (error) {

                console.error(
                    "Помилка створення Excel:",
                    error
                );

                alert(
                    "Не вдалося створити Excel-файл."
                );

            } finally {

                exportHistoryExcelButton.disabled =
                    false;

                exportHistoryExcelButton.textContent =
                    "📗 Експорт Excel";

            }

        }
    );

}

// ========================================
// ЕКСПОРТ ІСТОРІЇ У PDF
// ========================================

const exportHistoryPdfButton =
    document.getElementById(
        "export-history-pdf"
    );


if (exportHistoryPdfButton) {

    exportHistoryPdfButton.addEventListener(
        "click",
        async function () {

            if (
                typeof pdfMake ===
                "undefined"
            ) {

                alert(
                    "Не вдалося завантажити модуль PDF."
                );

                return;

            }


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            // ========================================
            // ЯКІ ДАНІ ОБРАНІ
            // ========================================

            const exportCarData =
                document.getElementById(
                    "export-car-data"
                )?.checked;

            const exportMaintenance =
                document.getElementById(
                    "export-maintenance"
                )?.checked;

            const exportRepairs =
                document.getElementById(
                    "export-repairs"
                )?.checked;

            const exportRefuels =
                document.getElementById(
                    "export-refuels"
                )?.checked;

            const exportCharges =
                document.getElementById(
                    "export-charges"
                )?.checked;

            const exportExpenses =
                document.getElementById(
                    "export-expenses"
                )?.checked;


            if (
                !exportCarData &&
                !exportMaintenance &&
                !exportRepairs &&
                !exportRefuels &&
                !exportCharges &&
                !exportExpenses
            ) {

                alert(
                    "Оберіть хоча б один тип даних для експорту."
                );

                return;

            }


            // ========================================
            // ПЕРІОД
            // ========================================

            let dateFrom =
                "";

            let dateTo =
                "";


            if (
                exportPeriodMode?.value ===
                "custom"
            ) {

                dateFrom =
                    document.getElementById(
                        "export-date-from"
                    )?.value || "";

                dateTo =
                    document.getElementById(
                        "export-date-to"
                    )?.value || "";


                if (
                    !dateFrom ||
                    !dateTo
                ) {

                    alert(
                        "Вкажіть дату «Від» і дату «До»."
                    );

                    return;

                }


                if (
                    dateFrom >
                    dateTo
                ) {

                    alert(
                        "Дата «Від» не може бути пізнішою за дату «До»."
                    );

                    return;

                }

            }


            exportHistoryPdfButton.disabled =
                true;

            exportHistoryPdfButton.textContent =
                "Підготовка PDF...";


            try {

                // ========================================
                // ЗАВАНТАЖЕННЯ ДАНИХ
                // ========================================

                const [
                    carResult,
                    maintenanceResult,
                    repairsResult,
                    refuelsResult,
                    chargesResult,
                    expensesResult
                ] =
                    await Promise.all([

                        supabaseClient
                            .from("cars")
                            .select("*")
                            .eq(
                                "id",
                                carId
                            )
                            .single(),

                        exportMaintenance
                            ? supabaseClient
                                .from("maintenance")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            }),

                        exportRepairs
                            ? supabaseClient
                                .from("repairs")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            }),

                        exportRefuels
                            ? supabaseClient
                                .from("refuels")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            }),

                        exportCharges
                            ? supabaseClient
                                .from("charges")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            }),

                        exportExpenses
                            ? supabaseClient
                                .from("expenses")
                                .select("*")
                                .eq(
                                    "car_id",
                                    carId
                                )
                            : Promise.resolve({
                                data: [],
                                error: null
                            })

                    ]);


                if (
                    carResult.error ||
                    maintenanceResult.error ||
                    repairsResult.error ||
                    refuelsResult.error ||
                    chargesResult.error ||
                    expensesResult.error
                ) {

                    console.error(
                        "Помилка PDF-експорту:",
                        {
                            car:
                                carResult.error,

                            maintenance:
                                maintenanceResult.error,

                            repairs:
                                repairsResult.error,

                            refuels:
                                refuelsResult.error,

                            charges:
                                chargesResult.error,

                            expenses:
                                expensesResult.error
                        }
                    );


                    alert(
                        "Не вдалося отримати дані для PDF."
                    );

                    return;

                }


                const car =
                    carResult.data;


                // ========================================
                // ФІЛЬТРУЄМО ЗА ПЕРІОДОМ
                // ========================================

                const maintenanceData =
                    maintenanceResult.data.filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.service_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    );


                const repairsData =
                    repairsResult.data.filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.repair_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    );


                const refuelsData =
                    refuelsResult.data.filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.refuel_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    );


                const chargesData =
                    chargesResult.data.filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.charge_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    );


                const expensesData =
                    expensesResult.data.filter(
                        function (item) {

                            return csvDateIsAllowed(
                                item.expense_date,
                                dateFrom,
                                dateTo
                            );

                        }
                    );


                

// ========================================
// ВМІСТ PDF
// ========================================

const content =
    [];


// ========================================
// ДОПОМІЖНІ ФУНКЦІЇ PDF
// ========================================

function pdfMoney(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }


    return (
        Number(value)
            .toLocaleString(
                "uk-UA",
                {
                    maximumFractionDigits: 2
                }
            ) +
        " грн"
    );

}


function pdfMileage(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }


    return (
        Number(value)
            .toLocaleString(
                "uk-UA"
            ) +
        " км"
    );

}


function pdfQuantity(
    value,
    unit
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }


    return (
        Number(value)
            .toLocaleString(
                "uk-UA",
                {
                    maximumFractionDigits: 2
                }
            ) +
        " " +
        unit
    );

}


function pdfExpenseCategoryText(
    category
) {

    const categoryNames = {

        insurance:
            "Страхування",

        parking:
            "Паркування",

        wash:
            "Мийка",

        parts:
            "Запчастини",

        accessories:
            "Аксесуари",

        fine:
            "Штраф",

        other:
            "Інше"

    };


    return (
        categoryNames[category] ||
        category ||
        "Не вказано"
    );

}

function pdfWorkCell(
    title,
    details = []
) {

    const stack =
        [
            {
                text:
                    title || "—",

                bold:
                    true,

                fontSize:
                    8
            }
        ];


    details
        .filter(Boolean)
        .forEach(
            function (detail) {

                stack.push({

                    text:
                        detail,

                    fontSize:
                        7,

                    color:
                        "#475569",

                    margin:
                        [0, 2, 0, 0]

                });

            }
        );


    return {
        stack:
            stack
    };

}


// ========================================
// ШАПКА PDF
// ========================================

content.push({

    text:
        "АвтоПомічник",

    style:
        "brand"

});


content.push({

    text:
        "Історія обслуговування автомобіля",

    style:
        "title"

});


content.push({

    text:
        car.name ||
        (
            (car.make || "") +
            " " +
            (car.model || "")
        ),

    style:
        "carName"

});


content.push({

    text:
        dateFrom && dateTo
            ? (
                "Період: " +
                formatExcelExportDate(
                    dateFrom
                ) +
                " — " +
                formatExcelExportDate(
                    dateTo
                )
              )
            : "Період: за весь час",

    style:
        "period"

});


// ========================================
// ДАНІ АВТОМОБІЛЯ
// ========================================

if (exportCarData) {

    const carInfoBody =
        [

            [
                {
                    text:
                        "Марка / модель",
                    bold:
                        true
                },

                (
                    (car.make || "—") +
                    " " +
                    (car.model || "")
                ).trim()
            ],

            [
                {
                    text:
                        "Рік",
                    bold:
                        true
                },

                car.year ?? "—"
            ],

            [
                {
                    text:
                        "Двигун",
                    bold:
                        true
                },

                car.engine || "—"
            ],

            [
                {
                    text:
                        "Пробіг",
                    bold:
                        true
                },

                pdfMileage(
                    car.mileage
                )
            ],

            [
                {
                    text:
                        "Пальне",
                    bold:
                        true
                },

                csvFuelTypeText(
                    car.fuel_type
                ) || "—"
            ],

            [
                {
                    text:
                        "Держномер",
                    bold:
                        true
                },

                car.license_plate || "—"
            ],

            [
                {
                    text:
                        "VIN",
                    bold:
                        true
                },

                car.vin || "—"
            ]

        ];


    content.push({

        table: {

            widths:
                [
                    110,
                    "*"
                ],

            body:
                carInfoBody

        },

        layout: {

            hLineWidth:
                function () {
                    return 0.5;
                },

            vLineWidth:
                function () {
                    return 0.5;
                },

            hLineColor:
                function () {
                    return "#94a3b8";
                },

            vLineColor:
                function () {
                    return "#94a3b8";
                },

            paddingLeft:
                function () {
                    return 5;
                },

            paddingRight:
                function () {
                    return 5;
                },

            paddingTop:
                function () {
                    return 4;
                },

            paddingBottom:
                function () {
                    return 4;
                }

        },

        fontSize:
            8,

        margin:
            [0, 0, 0, 14]

    });

}


// ========================================
// ПІДСУМКИ ПО КАТЕГОРІЯХ
// ========================================

const maintenanceTotal =
    maintenanceData.reduce(
        function (sum, item) {

            return (
                sum +
                Number(
                    item.cost || 0
                )
            );

        },
        0
    );


const repairsTotal =
    repairsData.reduce(
        function (sum, item) {

            return (
                sum +
                Number(
                    item.cost || 0
                )
            );

        },
        0
    );


const refuelsTotal =
    refuelsData.reduce(
        function (sum, item) {

            return (
                sum +
                Number(
                    item.total_cost || 0
                )
            );

        },
        0
    );


const chargesTotal =
    chargesData.reduce(
        function (sum, item) {

            return (
                sum +
                Number(
                    item.total_cost || 0
                )
            );

        },
        0
    );


const expensesTotal =
    expensesData.reduce(
        function (sum, item) {

            return (
                sum +
                Number(
                    item.amount || 0
                )
            );

        },
        0
    );


// ========================================
// ГОЛОВНА ТАБЛИЦЯ
// ========================================

const historyTableBody =
    [

        [
            {
                text:
                    "№",
                bold:
                    true,
                alignment:
                    "center",
                fillColor:
                    "#e5e7eb"
            },

            {
                text:
                    "Дата",
                bold:
                    true,
                alignment:
                    "center",
                fillColor:
                    "#e5e7eb"
            },

            {
                text:
                    "Найменування робіт / операція",
                bold:
                    true,
                alignment:
                    "center",
                fillColor:
                    "#e5e7eb"
            },

            {
                text:
                    "Пробіг",
                bold:
                    true,
                alignment:
                    "center",
                fillColor:
                    "#e5e7eb"
            },

            {
                text:
                    "К-сть",
                bold:
                    true,
                alignment:
                    "center",
                fillColor:
                    "#e5e7eb"
            },

            {
                text:
                    "Сума",
                bold:
                    true,
                alignment:
                    "center",
                fillColor:
                    "#e5e7eb"
            }

        ]

    ];


let pdfRowNumber =
    1;


// ========================================
// ДОДАВАННЯ СЕКЦІЇ
// ========================================

function addPdfSection(
    title,
    items,
    total,
    buildRow
) {

    // Якщо в розділі немає записів —
    // взагалі не показуємо його у PDF
    if (
        items.length === 0
    ) {
        return;
    }    

    historyTableBody.push(

        [

            {
                text:
                    title,

                colSpan:
                    6,

                bold:
                    true,

                alignment:
                    "center",

                fillColor:
                    "#f3f4f6",

                fontSize:
                    8.5,

                margin:
                    [0, 3, 0, 3]
            },

            {},
            {},
            {},
            {},
            {}

        ]

    );


    if (
        items.length === 0
    ) {

        historyTableBody.push(

            [

                {
                    text:
                        "За вибраний період записів немає.",

                    colSpan:
                        6,

                    alignment:
                        "center",

                    color:
                        "#64748b",

                    italics:
                        true
                },

                {},
                {},
                {},
                {},
                {}

            ]

        );

    } else {

        items.forEach(
            function (item) {

                historyTableBody.push(
                    buildRow(
                        item,
                        pdfRowNumber
                    )
                );


                pdfRowNumber +=
                    1;

            }
        );

    }


    historyTableBody.push(

        [

            {
                text:
                    "Разом",

                colSpan:
                    5,

                bold:
                    true,

                alignment:
                    "right"
            },

            {},
            {},
            {},
            {},

            {
                text:
                    pdfMoney(
                        total
                    ),

                bold:
                    true,

                alignment:
                    "right"
            }

        ]

    );

}


// ========================================
// ОБСЛУГОВУВАННЯ
// ========================================

if (exportMaintenance) {

    maintenanceData.sort(
        function (a, b) {

            return String(
                a.service_date || ""
            ).localeCompare(
                String(
                    b.service_date || ""
                )
            );

        }
    );


    addPdfSection(

        "ОБСЛУГОВУВАННЯ",

        maintenanceData,

        maintenanceTotal,

        function (
            item,
            number
        ) {

            return [

                {
                    text:
                        number,
                    alignment:
                        "center"
                },

                {
                    text:
                        formatExcelExportDate(
                            item.service_date
                        ),
                    alignment:
                        "center"
                },

                pdfWorkCell(

                    item.title ||
                    "Обслуговування",

                    [

                        item.service_place
                            ? (
                                "Місце: " +
                                item.service_place
                              )
                            : "",

                        item.description
                            ? (
                                "Опис: " +
                                item.description
                              )
                            : ""

                    ]

                ),

                {
                    text:
                        pdfMileage(
                            item.mileage
                        ),
                    alignment:
                        "right"
                },

                {
                    text:
                        "—",
                    alignment:
                        "center"
                },

                {
                    text:
                        pdfMoney(
                            item.cost
                        ),
                    alignment:
                        "right"
                }

            ];

        }

    );

}


// ========================================
// РЕМОНТИ
// ========================================

if (exportRepairs) {

    repairsData.sort(
        function (a, b) {

            return String(
                a.repair_date || ""
            ).localeCompare(
                String(
                    b.repair_date || ""
                )
            );

        }
    );


    addPdfSection(

        "РЕМОНТИ",

        repairsData,

        repairsTotal,

        function (
            item,
            number
        ) {

            return [

                {
                    text:
                        number,
                    alignment:
                        "center"
                },

                {
                    text:
                        formatExcelExportDate(
                            item.repair_date
                        ),
                    alignment:
                        "center"
                },

                pdfWorkCell(

                    item.title ||
                    "Ремонт",

                    [

                        item.repair_place
                            ? (
                                "Місце: " +
                                item.repair_place
                              )
                            : "",

                        item.description
                            ? (
                                "Опис: " +
                                item.description
                              )
                            : ""

                    ]

                ),

                {
                    text:
                        pdfMileage(
                            item.mileage
                        ),
                    alignment:
                        "right"
                },

                {
                    text:
                        "—",
                    alignment:
                        "center"
                },

                {
                    text:
                        pdfMoney(
                            item.cost
                        ),
                    alignment:
                        "right"
                }

            ];

        }

    );

}


// ========================================
// ЗАПРАВКИ
// ========================================

if (exportRefuels) {

    refuelsData.sort(
        function (a, b) {

            return String(
                a.refuel_date || ""
            ).localeCompare(
                String(
                    b.refuel_date || ""
                )
            );

        }
    );


    addPdfSection(

        "ЗАПРАВКИ",

        refuelsData,

        refuelsTotal,

        function (
            item,
            number
        ) {

            const details =
                [];


            if (item.station) {

                details.push(
                    "АЗС: " +
                    item.station
                );

            }


            if (
                item.price_per_liter !== null &&
                item.price_per_liter !== undefined
            ) {

                details.push(
                    "Ціна: " +
                    Number(
                        item.price_per_liter
                    ).toLocaleString(
                        "uk-UA"
                    ) +
                    " грн/л"
                );

            }


            if (item.full_tank) {

                details.push(
                    "Повний бак"
                );

            }


            return [

                {
                    text:
                        number,
                    alignment:
                        "center"
                },

                {
                    text:
                        formatExcelExportDate(
                            item.refuel_date
                        ),
                    alignment:
                        "center"
                },

                pdfWorkCell(

                    "Заправка — " +
                    (
                        csvFuelTypeText(
                            item.fuel_type
                        ) ||
                        "Пальне"
                    ),

                    details

                ),

                {
                    text:
                        pdfMileage(
                            item.mileage
                        ),
                    alignment:
                        "right"
                },

                {
                    text:
                        pdfQuantity(
                            item.liters,
                            "л"
                        ),
                    alignment:
                        "right"
                },

                {
                    text:
                        pdfMoney(
                            item.total_cost
                        ),
                    alignment:
                        "right"
                }

            ];

        }

    );

}


// ========================================
// ЗАРЯДЖАННЯ
// ========================================

if (exportCharges) {

    chargesData.sort(
        function (a, b) {

            return String(
                a.charge_date || ""
            ).localeCompare(
                String(
                    b.charge_date || ""
                )
            );

        }
    );


    addPdfSection(

        "ЗАРЯДЖАННЯ",

        chargesData,

        chargesTotal,

        function (
            item,
            number
        ) {

            const details =
                [];


            if (item.place) {

                details.push(
                    "Місце: " +
                    item.place
                );

            }


            if (item.charge_source) {

                details.push(
                    "Джерело: " +
                    item.charge_source
                );

            }


            if (
                item.start_percent !== null &&
                item.end_percent !== null
            ) {

                details.push(
                    "Заряд: " +
                    item.start_percent +
                    "% → " +
                    item.end_percent +
                    "%"
                );

            }


            if (item.description) {

                details.push(
                    "Опис: " +
                    item.description
                );

            }


            return [

                {
                    text:
                        number,
                    alignment:
                        "center"
                },

                {
                    text:
                        formatExcelExportDate(
                            item.charge_date
                        ),
                    alignment:
                        "center"
                },

                pdfWorkCell(
                    "Заряджання",
                    details
                ),

                {
                    text:
                        pdfMileage(
                            item.mileage
                        ),
                    alignment:
                        "right"
                },

                {
                    text:
                        pdfQuantity(
                            item.energy_kwh,
                            "кВт·год"
                        ),
                    alignment:
                        "right"
                },

                {
                    text:
                        pdfMoney(
                            item.total_cost
                        ),
                    alignment:
                        "right"
                }

            ];

        }

    );

}


// ========================================
// ІНШІ ВИТРАТИ
// ========================================

if (exportExpenses) {

    expensesData.sort(
        function (a, b) {

            return String(
                a.expense_date || ""
            ).localeCompare(
                String(
                    b.expense_date || ""
                )
            );

        }
    );


    addPdfSection(

        "ІНШІ ВИТРАТИ",

        expensesData,

        expensesTotal,

        function (
            item,
            number
        ) {

            const details =
                [];


            if (item.category) {

    details.push(
        "Категорія: " +
        pdfExpenseCategoryText(
            item.category
        )
    );

}


            if (item.place) {

                details.push(
                    "Місце: " +
                    item.place
                );

            }


            if (item.description) {

                details.push(
                    "Опис: " +
                    item.description
                );

            }


            return [

                {
                    text:
                        number,
                    alignment:
                        "center"
                },

                {
                    text:
                        formatExcelExportDate(
                            item.expense_date
                        ),
                    alignment:
                        "center"
                },

                pdfWorkCell(
                    item.title ||
                    "Інша витрата",
                    details
                ),

                {
                    text:
                        pdfMileage(
                            item.mileage
                        ),
                    alignment:
                        "right"
                },

                {
                    text:
                        "—",
                    alignment:
                        "center"
                },

                {
                    text:
                        pdfMoney(
                            item.amount
                        ),
                    alignment:
                        "right"
                }

            ];

        }

    );

}


// ========================================
// ЗАГАЛЬНА СУМА
// ========================================

const totalCost =
    (
        exportMaintenance
            ? maintenanceTotal
            : 0
    ) +
    (
        exportRepairs
            ? repairsTotal
            : 0
    ) +
    (
        exportRefuels
            ? refuelsTotal
            : 0
    ) +
    (
        exportCharges
            ? chargesTotal
            : 0
    ) +
    (
        exportExpenses
            ? expensesTotal
            : 0
    );


const hasHistoryData =
    exportMaintenance ||
    exportRepairs ||
    exportRefuels ||
    exportCharges ||
    exportExpenses;


if (hasHistoryData) {

    historyTableBody.push(

        [

            {
                text:
                    "ЗАГАЛОМ",

                colSpan:
                    5,

                bold:
                    true,

                alignment:
                    "right",

                fillColor:
                    "#e5e7eb"
            },

            {},
            {},
            {},
            {},

            {
                text:
                    pdfMoney(
                        totalCost
                    ),

                bold:
                    true,

                alignment:
                    "right",

                fillColor:
                    "#e5e7eb"
            }

        ]

    );


    content.push({

        table: {

            headerRows:
                1,

            widths:
                [
                    18,
                    48,
                    "*",
                    58,
                    56,
                    58
                ],

            body:
                historyTableBody

        },

        layout: {

            hLineWidth:
                function () {
                    return 0.5;
                },

            vLineWidth:
                function () {
                    return 0.5;
                },

            hLineColor:
                function () {
                    return "#94a3b8";
                },

            vLineColor:
                function () {
                    return "#94a3b8";
                },

            paddingLeft:
                function () {
                    return 3;
                },

            paddingRight:
                function () {
                    return 3;
                },

            paddingTop:
                function () {
                    return 3;
                },

            paddingBottom:
                function () {
                    return 3;
                }

        },

        fontSize:
            7.5

    });

}


// ========================================
// ДОКУМЕНТ PDF
// ========================================
                

                const docDefinition = {

                    pageSize:
                        "A4",

                    pageMargins:
                        [
                            40,
                            45,
                            40,
                            45
                        ],

                    defaultStyle: {
                        font:
                            "Roboto",
                        fontSize:
                            10,
                        lineHeight:
                            1.25
                    },

                    content:
                        content,

                    styles: {

                        brand: {
                            fontSize:
                                11,
                            bold:
                                true,
                            color:
                                "#2563eb",
                            margin:
                                [0, 0, 0, 6]
                        },

                        title: {
                            fontSize:
                                22,
                            bold:
                                true,
                            margin:
                                [0, 0, 0, 6]
                        },

                        carName: {
                            fontSize:
                                14,
                            bold:
                                true,
                            margin:
                                [0, 0, 0, 4]
                        },

                        period: {
                            fontSize:
                                10,
                            color:
                                "#64748b",
                            margin:
                                [0, 0, 0, 20]
                        },

                        sectionTitle: {
                            fontSize:
                                14,
                            bold:
                                true,
                            color:
                                "#0f172a",
                            margin:
                                [0, 16, 0, 10]
                        },

                        empty: {
                            color:
                                "#64748b",
                            italics:
                                true,
                            margin:
                                [0, 0, 0, 10]
                        }

                    },

                    footer:
                        function (
                            currentPage,
                            pageCount
                        ) {

                            return {

                                text:
                                    "АвтоПомічник • сторінка " +
                                    currentPage +
                                    " з " +
                                    pageCount,

                                alignment:
                                    "center",

                                fontSize:
                                    8,

                                color:
                                    "#94a3b8",

                                margin:
                                    [0, 15, 0, 0]

                            };

                        }

                };


                const safeCarName =
                    String(
                        car.name ||
                        "avto"
                    )
                        .trim()
                        .replace(
                            /[\\/:*?"<>|]/g,
                            "-"
                        )
                        .replace(
                            /\s+/g,
                            "_"
                        );


                const periodName =
                    dateFrom && dateTo
                        ? `${dateFrom}_${dateTo}`
                        : "ves_chas";


                pdfMake
                    .createPdf(
                        docDefinition
                    )
                    .download(
                        `AvtoPomichnyk_${safeCarName}_${periodName}.pdf`
                    );

            } catch (error) {

                console.error(
                    "Помилка створення PDF:",
                    error
                );

                alert(
                    "Не вдалося створити PDF-файл."
                );

            } finally {

                exportHistoryPdfButton.disabled =
                    false;

                exportHistoryPdfButton.textContent =
                    "📄 Експорт PDF";

            }

        }
    );

}

// ========================================
// ФІЛЬТР ПОВНОЇ ІСТОРІЇ
// ========================================

const historyFilterButtons =
    document.querySelectorAll(
        ".history-filter-button"
    );


historyFilterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const selectedFilter =
                    button.dataset.filter;


                // Активна кнопка
                historyFilterButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );

                button.classList.add(
                    "active"
                );


                // Фільтруємо картки
                const historyCards =
                    document.querySelectorAll(
                        ".full-history-card"
                    );


                historyCards.forEach(
                    function (card) {

                        if (
                            selectedFilter === "all" ||
                            card.dataset.historyType ===
                                selectedFilter
                        ) {

                            card.hidden = false;

                        } else {

                            card.hidden = true;

                        }

                    }
                );

            }
        );

    }
);

// ========================================
// КОРОТКИЙ ОГЛЯД АВТОМОБІЛЯ
// ========================================

async function loadCarOverviewSummary() {

    const nextServiceElement =
        document.getElementById(
            "overview-next-service"
        );

    const lastEventElement =
        document.getElementById(
            "overview-last-event"
        );

    const totalCostElement =
        document.getElementById(
            "overview-total-cost"
        );

    const historyCountElement =
        document.getElementById(
            "overview-history-count"
        );

const nextInsuranceElement =
    document.getElementById(
        "overview-next-insurance"
    );        


    // Цей код працює тільки на car.html
    if (
    !nextServiceElement ||
    !lastEventElement ||
    !totalCostElement ||
    !historyCountElement ||
    !nextInsuranceElement
) {
    return;
}


    const params =
        new URLSearchParams(
            window.location.search
        );

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }


    // Завантажуємо автомобіль та всі записи
    const [
    carResult,
    maintenanceResult,
    repairsResult,
    refuelsResult,
    expensesResult,
    chargesResult
] = await Promise.all([

    supabaseClient
        .from("cars")
        .select("mileage")
        .eq("id", carId)
        .single(),

    supabaseClient
        .from("maintenance")
        .select("*")
        .eq("car_id", carId),

    supabaseClient
        .from("repairs")
        .select("*")
        .eq("car_id", carId),

    supabaseClient
        .from("refuels")
        .select("*")
        .eq("car_id", carId),

    supabaseClient
        .from("expenses")
        .select("*")
        .eq("car_id", carId),

    supabaseClient
        .from("charges")
        .select("*")
        .eq("car_id", carId)

]);


    if (
    carResult.error ||
    maintenanceResult.error ||
    repairsResult.error ||
    refuelsResult.error ||
    expensesResult.error ||
    chargesResult.error
) {

        console.error(
            "Помилка завантаження короткого огляду:",
            {
                car: carResult.error,
                maintenance: maintenanceResult.error,
                repairs: repairsResult.error,
                refuels: refuelsResult.error,
                expenses: expensesResult.error,
                charges: chargesResult.error
            }
        );

        nextServiceElement.textContent =
            "Не вдалося завантажити";

        lastEventElement.textContent =
            "Не вдалося завантажити";

        totalCostElement.textContent =
            "Не вдалося завантажити";

        historyCountElement.textContent =
            "Не вдалося завантажити";

        return;
    }


    const maintenance =
        maintenanceResult.data || [];

    const repairs =
        repairsResult.data || [];

    const refuels =
        refuelsResult.data || [];

    const expenses =
        expensesResult.data || [];

        const charges =
    chargesResult.data || [];

// ========================================
// НАСТУПНЕ СТРАХУВАННЯ
// ========================================

const insuranceExpenses =
    expenses
        .filter(
            function (item) {

                return (
                    item.category ===
                        "insurance" &&
                    item.next_insurance_date
                );

            }
        )
        .sort(
            function (a, b) {

                return (
                    new Date(
                        a.next_insurance_date +
                        "T00:00:00"
                    ) -
                    new Date(
                        b.next_insurance_date +
                        "T00:00:00"
                    )
                );

            }
        );


const insuranceToday =
    new Date();

insuranceToday.setHours(
    0,
    0,
    0,
    0
);


let nearestInsurance =
    insuranceExpenses.find(
        function (item) {

            const date =
                new Date(
                    item.next_insurance_date +
                    "T00:00:00"
                );

            return date >=
                insuranceToday;

        }
    );


if (
    !nearestInsurance &&
    insuranceExpenses.length > 0
) {

    nearestInsurance =
        insuranceExpenses[
            insuranceExpenses.length - 1
        ];

}


if (!nearestInsurance) {

    nextInsuranceElement.textContent =
        "Не вказано";

} else {

    const insuranceDate =
        new Date(
            nearestInsurance
                .next_insurance_date +
            "T00:00:00"
        );


    const remainingInsuranceDays =
        Math.round(
            (
                insuranceDate -
                insuranceToday
            ) /
            86400000
        );


    function insuranceDayWord(
        days
    ) {

        const number =
            Math.abs(days);

        const lastTwo =
            number % 100;

        const lastOne =
            number % 10;


        if (
            lastTwo >= 11 &&
            lastTwo <= 14
        ) {
            return "днів";
        }


        if (lastOne === 1) {
            return "день";
        }


        if (
            lastOne >= 2 &&
            lastOne <= 4
        ) {
            return "дні";
        }


        return "днів";

    }


    if (
        remainingInsuranceDays > 0
    ) {

        nextInsuranceElement.textContent =
            "через " +
            remainingInsuranceDays
                .toLocaleString("uk-UA") +
            " " +
            insuranceDayWord(
                remainingInsuranceDays
            );

    } else if (
        remainingInsuranceDays === 0
    ) {

        nextInsuranceElement.textContent =
            "Потрібно оновити сьогодні";

    } else {

        const overdueDays =
            Math.abs(
                remainingInsuranceDays
            );


        nextInsuranceElement.textContent =
            "прострочено на " +
            overdueDays
                .toLocaleString("uk-UA") +
            " " +
            insuranceDayWord(
                overdueDays
            );

    }

}    


    // ========================================
    // ЗАГАЛЬНІ ВИТРАТИ
    // ========================================

    const maintenanceTotal =
        maintenance.reduce(
            function (sum, item) {

                return sum +
                    Number(item.cost || 0);

            },
            0
        );


    const repairsTotal =
        repairs.reduce(
            function (sum, item) {

                return sum +
                    Number(item.cost || 0);

            },
            0
        );


    const refuelsTotal =
        refuels.reduce(
            function (sum, item) {

                return sum +
                    Number(item.total_cost || 0);

            },
            0
        );


    const expensesTotal =
        expenses.reduce(
            function (sum, item) {

                return sum +
                    Number(item.amount || 0);

            },
            0
        );

        const chargesTotal =
    charges.reduce(
        function (sum, item) {

            return sum +
                Number(
                    item.total_cost || 0
                );

        },
        0
    );


    const totalCost =
    maintenanceTotal +
    repairsTotal +
    refuelsTotal +
    expensesTotal +
    chargesTotal;


    totalCostElement.textContent =
        totalCost.toLocaleString(
            "uk-UA",
            {
                maximumFractionDigits: 2
            }
        ) +
        " грн";


    // ========================================
    // КІЛЬКІСТЬ ЗАПИСІВ
    // ========================================

    const historyCount =
    maintenance.length +
    repairs.length +
    refuels.length +
    expenses.length +
    charges.length;


    historyCountElement.textContent =
        historyCount.toLocaleString("uk-UA");


    // ========================================
    // ОСТАННЯ ПОДІЯ
    // ========================================

    const events = [];


    maintenance.forEach(
        function (item) {

            events.push({
                title: item.title,
                date: item.service_date,
                createdAt: item.created_at
            });

        }
    );


    repairs.forEach(
        function (item) {

            events.push({
                title: item.title,
                date: item.repair_date,
                createdAt: item.created_at
            });

        }
    );


    refuels.forEach(
        function (item) {

            events.push({
                title:
                    "Заправка " +
                    Number(item.liters || 0)
                        .toLocaleString("uk-UA") +
                    " л",

                date: item.refuel_date,
                createdAt: item.created_at
            });

        }
    );


    charges.forEach(
    function (item) {

        events.push({

            title:
                "Заряджання " +
                Number(
                    item.energy_kwh || 0
                ).toLocaleString(
                    "uk-UA"
                ) +
                " кВт·год",

            date:
                item.charge_date,

            createdAt:
                item.created_at

        });

    }
);

    expenses.forEach(
        function (item) {

            events.push({
                title: item.title,
                date: item.expense_date,
                createdAt: item.created_at
            });

        }
    );


    events.sort(
        function (a, b) {

            const dateA =
                new Date(
                    a.date ||
                    a.createdAt ||
                    0
                );

            const dateB =
                new Date(
                    b.date ||
                    b.createdAt ||
                    0
                );


            return dateB - dateA;

        }
    );


    if (events.length > 0) {

        lastEventElement.textContent =
            events[0].title;

    } else {

        lastEventElement.textContent =
            "Подій ще немає";

    }


    // ========================================
    // НАЙБЛИЖЧЕ ОБСЛУГОВУВАННЯ
    // ========================================

    const currentMileage =
        Number(
            carResult.data?.mileage || 0
        );


    const activeReminders =
        maintenance.filter(
            function (item) {

                return item.reminder_enabled;

            }
        );


    if (activeReminders.length === 0) {

        nextServiceElement.textContent =
            "Нагадувань немає";

        return;
    }


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const reminderCandidates =
        activeReminders.map(
            function (item) {

                let remainingKm = null;
                let remainingDays = null;


                // Через пробіг
                if (
                    item.mileage !== null &&
                    item.reminder_mileage_interval
                ) {

                    const targetMileage =
                        Number(item.mileage) +
                        Number(
                            item.reminder_mileage_interval
                        );

                    remainingKm =
                        targetMileage -
                        currentMileage;

                }


                // Через час
                if (
                    item.service_date &&
                    item.reminder_months_interval
                ) {

                    const serviceDate =
                        new Date(
                            item.service_date +
                            "T00:00:00"
                        );

                    const targetDate =
                        new Date(serviceDate);

                    targetDate.setMonth(
                        targetDate.getMonth() +
                        Number(
                            item.reminder_months_interval
                        )
                    );


                    remainingDays =
                        Math.ceil(
                            (
                                targetDate -
                                today
                            ) /
                            86400000
                        );

                }


                // Менше число = нагадування терміновіше
                let priority =
                    Number.POSITIVE_INFINITY;


                if (remainingKm !== null) {

                    priority =
                        Math.min(
                            priority,
                            remainingKm / 1000
                        );

                }


                if (remainingDays !== null) {

                    priority =
                        Math.min(
                            priority,
                            remainingDays / 30
                        );

                }


                return {
                    item,
                    remainingKm,
                    remainingDays,
                    priority
                };

            }
        );


    reminderCandidates.sort(
        function (a, b) {

            return a.priority -
                b.priority;

        }
    );


    const nearest =
        reminderCandidates[0];


    if (!nearest) {

        nextServiceElement.textContent =
            "Нагадувань немає";

        return;
    }


    let reminderText =
        nearest.item.title;


    // Якщо вже прострочено
    if (
        (
            nearest.remainingKm !== null &&
            nearest.remainingKm <= 0
        ) ||
        (
            nearest.remainingDays !== null &&
            nearest.remainingDays <= 0
        )
    ) {

        reminderText +=
            " — прострочено";

    }

    // Якщо першим наближається пробіг
    else if (
        nearest.remainingKm !== null &&
        (
            nearest.remainingDays === null ||
            nearest.remainingKm / 1000 <=
            nearest.remainingDays / 30
        )
    ) {

        reminderText +=
            " — через " +
            nearest.remainingKm
                .toLocaleString("uk-UA") +
            " км";

    }

    // Якщо першою наближається дата
    else if (
        nearest.remainingDays !== null
    ) {

        reminderText +=
            " — через " +
            nearest.remainingDays
                .toLocaleString("uk-UA") +
            " дн.";

    }


    nextServiceElement.textContent =
        reminderText;

}


// Завантажуємо огляд автомобіля
loadCarOverviewSummary();

// ========================================
// ВІДКРИТТЯ ФОРМИ РЕДАГУВАННЯ АВТОМОБІЛЯ
// ========================================

const editCarFormContainer =
    document.getElementById(
        "edit-car-form-container"
    );

const editCarForm =
    document.getElementById(
        "edit-car-form"
    );

const cancelEditCarButton =
    document.getElementById(
        "cancel-edit-car-button"
    );

const editCarPhotoInput =
    document.getElementById(
        "edit-car-photo"
    );

const editCarPhotoPreview =
    document.getElementById(
        "edit-car-photo-preview"
    );

const deleteCarPhotoButton =
    document.getElementById(
        "delete-car-photo-button"
    );

if (
    editCarPhotoInput &&
    editCarPhotoPreview
) {

    editCarPhotoInput.addEventListener(
        "change",
        function () {

            const selectedFile =
                editCarPhotoInput.files[0];


            if (!selectedFile) {

                editCarPhotoPreview.innerHTML =
                    "🚙";

                return;

            }


            // Перевірка формату
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];


            if (
                !allowedTypes.includes(
                    selectedFile.type
                )
            ) {

                alert(
                    "Оберіть фото у форматі JPG, PNG або WEBP."
                );

                editCarPhotoInput.value =
                    "";

                editCarPhotoPreview.innerHTML =
                    "🚙";

                return;

            }


            // Перевірка розміру — максимум 5 МБ
            const maxFileSize =
                5 * 1024 * 1024;


            if (
                selectedFile.size >
                maxFileSize
            ) {

                alert(
                    "Фото завелике. Максимальний розмір — 5 МБ."
                );

                editCarPhotoInput.value =
                    "";

                editCarPhotoPreview.innerHTML =
                    "🚙";

                return;

            }


            const previewUrl =
                URL.createObjectURL(
                    selectedFile
                );


            editCarPhotoPreview.innerHTML =
                `
                    <img
                        src="${previewUrl}"
                        alt="Фото автомобіля"
                    >
                `;

        }
    );

}    

// ========================================
// КНОПКА ВИДАЛЕННЯ АВТОМОБІЛЯ
// У ФОРМІ РЕДАГУВАННЯ
// ========================================

if (
    editCarForm &&
    !document.getElementById(
        "delete-current-car-button"
    )
) {

    const deleteCurrentCarButton =
        document.createElement(
            "button"
        );


    deleteCurrentCarButton.type =
        "button";

    deleteCurrentCarButton.id =
        "delete-current-car-button";

    deleteCurrentCarButton.className =
        "delete-current-car-button";

    deleteCurrentCarButton.textContent =
        "🗑 Видалити автомобіль";


    editCarForm.appendChild(
        deleteCurrentCarButton
    );


    deleteCurrentCarButton.addEventListener(
        "click",
        async function () {

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            const carNameInput =
                document.getElementById(
                    "edit-car-name"
                );

            const carName =
                carNameInput?.value
                    ?.trim() ||
                "цей автомобіль";


            const confirmed =
                confirm(
                    `Видалити автомобіль "${carName}"?\n\n` +
                    "Разом з автомобілем буде назавжди видалено " +
                    "всю історію обслуговування, ремонтів, " +
                    "заправок, заряджань та інших витрат.\n\n" +
                    "Цю дію неможливо скасувати."
                );


            if (!confirmed) {
                return;
            }


            deleteCurrentCarButton.disabled =
                true;

            deleteCurrentCarButton.textContent =
                "Видалення...";


            const {
                error
            } =
                await supabaseClient
                    .rpc(
                        "delete_car_and_data",
                        {
                            p_car_id:
                                carId
                        }
                    );


            if (error) {

                console.error(
                    "Помилка видалення автомобіля:",
                    error
                );

                alert(
                    "Не вдалося видалити автомобіль."
                );


                deleteCurrentCarButton.disabled =
                    false;

                deleteCurrentCarButton.textContent =
                    "🗑 Видалити автомобіль";

                return;

            }


            // Прибираємо видалене авто
            // з пам'яті активного автомобіля
            const {
                data: sessionData
            } =
                await supabaseClient
                    .auth
                    .getSession();


            const currentUser =
                sessionData?.session?.user;


            if (currentUser) {

                const activeCarStorageKey =
                    "activeCarId:" +
                    currentUser.id;


                const activeCarId =
                    localStorage.getItem(
                        activeCarStorageKey
                    );


                if (
                    activeCarId ===
                    carId
                ) {

                    localStorage.removeItem(
                        activeCarStorageKey
                    );

                }

            }


            alert(
                "Автомобіль успішно видалено!"
            );


            window.location.href =
                "garage.html";

        }
    );

}    

// ========================================
// ВИДАЛЕННЯ ФОТО АВТОМОБІЛЯ
// ========================================

if (deleteCarPhotoButton) {

    deleteCarPhotoButton.addEventListener(
        "click",
        async function () {

            const params =
                new URLSearchParams(
                    window.location.search
                );

            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            const confirmed =
                confirm(
                    "Видалити фото автомобіля?"
                );


            if (!confirmed) {
                return;
            }


            deleteCarPhotoButton.disabled =
                true;

            deleteCarPhotoButton.textContent =
                "Видалення...";


            // Отримуємо шлях до фото
            const {
                data: carPhotoData,
                error: carPhotoDataError
            } =
                await supabaseClient
                    .from("cars")
                    .select("photo_path")
                    .eq("id", carId)
                    .single();


            if (
                carPhotoDataError ||
                !carPhotoData
            ) {

                console.error(
                    "Не вдалося отримати дані фото:",
                    carPhotoDataError
                );

                alert(
                    "Не вдалося видалити фото."
                );

                deleteCarPhotoButton.disabled =
                    false;

                deleteCarPhotoButton.textContent =
                    "🗑 Видалити фото";

                return;

            }


            const photoPath =
                carPhotoData.photo_path;


            if (!photoPath) {

                deleteCarPhotoButton.hidden =
                    true;

                deleteCarPhotoButton.disabled =
                    false;

                deleteCarPhotoButton.textContent =
                    "🗑 Видалити фото";

                return;

            }


            // Видаляємо файл зі Storage
            const {
                error: deletePhotoError
            } =
                await supabaseClient
                    .storage
                    .from("car-photos")
                    .remove([
                        photoPath
                    ]);


            if (deletePhotoError) {

                console.error(
                    "Помилка видалення фото зі Storage:",
                    deletePhotoError
                );

                alert(
                    "Не вдалося видалити фото."
                );

                deleteCarPhotoButton.disabled =
                    false;

                deleteCarPhotoButton.textContent =
                    "🗑 Видалити фото";

                return;

            }


            // Очищаємо шлях у cars
            const {
                error: clearPhotoError
            } =
                await supabaseClient
                    .from("cars")
                    .update({
                        photo_path: null
                    })
                    .eq("id", carId);


            if (clearPhotoError) {

                console.error(
                    "Не вдалося очистити photo_path:",
                    clearPhotoError
                );

                alert(
                    "Фото видалено зі сховища, " +
                    "але не вдалося оновити дані автомобіля."
                );

                return;

            }


            // Очищаємо форму
            if (editCarPhotoInput) {

                editCarPhotoInput.value =
                    "";

            }


            if (editCarPhotoPreview) {

                editCarPhotoPreview.innerHTML =
                    "🚙";

            }


            deleteCarPhotoButton.hidden =
                true;

            deleteCarPhotoButton.disabled =
                false;

            deleteCarPhotoButton.textContent =
                "🗑 Видалити фото";


            alert(
                "Фото автомобіля видалено."
            );


            // Одразу оновлюємо сторінку автомобіля
            await loadCarDetails();

        }
    );

}

// Кнопка "Редагувати дані" створюється динамічно,
// тому слухаємо клік через document
document.addEventListener(
    "click",
    async function (event) {

        const editCarButton =
            event.target.closest(
                "#edit-car-details-button"
            );


        if (!editCarButton) {
            return;
        }


        const params =
            new URLSearchParams(
                window.location.search
            );

        const carId =
            params.get("id");


        if (!carId) {

            alert(
                "Не вдалося визначити автомобіль."
            );

            return;

        }

        // Якщо форма редагування відсутня на цій сторінці,
// переходимо на сторінку автомобіля
if (!editCarFormContainer) {

    window.location.href =
        "car.html?id=" +
        encodeURIComponent(carId) +
        "&edit=1";

    return;
}


        const {
            data: car,
            error
        } =
            await supabaseClient
                .from("cars")
                .select("*")
                .eq("id", carId)
                .single();


        if (error || !car) {

            console.error(
                "Помилка завантаження автомобіля для редагування:",
                error
            );

            alert(
                "Не вдалося завантажити дані автомобіля."
            );

            return;

        }


// ========================================
// ПОКАЗ ЗБЕРЕЖЕНОГО ФОТО
// У ФОРМІ РЕДАГУВАННЯ
// ========================================

if (editCarPhotoInput) {

    editCarPhotoInput.value =
        "";

}

if (deleteCarPhotoButton) {

    deleteCarPhotoButton.hidden =
        !car.photo_path;

}

if (editCarPhotoPreview) {

    // За замовчуванням показуємо іконку
    editCarPhotoPreview.innerHTML =
        "🚙";


    if (car.photo_path) {

        const {
            data: editPhotoData,
            error: editPhotoError
        } =
            await supabaseClient
                .storage
                .from("car-photos")
                .createSignedUrl(
                    car.photo_path,
                    60 * 60
                );


        if (
            !editPhotoError &&
            editPhotoData?.signedUrl
        ) {

            editCarPhotoPreview.innerHTML =
                `
                    <img
                        src="${editPhotoData.signedUrl}"
                        alt="Фото ${car.name}"
                    >
                `;

        } else {

            console.error(
                "Не вдалося показати фото у формі редагування:",
                editPhotoError
            );

        }

    }

}

        // Підставляємо поточні дані
        document.getElementById(
            "edit-car-name"
        ).value =
            car.name || "";

        document.getElementById(
            "edit-car-make"
        ).value =
            car.make || "";

        document.getElementById(
            "edit-car-model"
        ).value =
            car.model || "";

        document.getElementById(
            "edit-car-year"
        ).value =
            car.year ?? "";

        document.getElementById(
            "edit-car-engine"
        ).value =
            car.engine || "";

            document.getElementById(
    "edit-car-tank-capacity"
).value =
    car.tank_capacity ?? "";

document.getElementById(
    "edit-car-lpg-tank-capacity"
).value =
    car.lpg_tank_capacity ??
    (
        car.fuel_type === "lpg"
            ? car.tank_capacity ?? ""
            : ""
    );    

    document.getElementById(
    "edit-car-battery-capacity"
).value =
    car.battery_capacity ?? "";

        document.getElementById(
            "edit-car-fuel"
        ).value =
            car.fuel_type || "";

updateEditCarEnergyFields();            

        document.getElementById(
            "edit-car-transmission"
        ).value =
            car.transmission || "";

        document.getElementById(
            "edit-car-license-plate"
        ).value =
            car.license_plate || "";

        document.getElementById(
            "edit-car-vin"
        ).value =
            car.vin || "";


        if (editCarFormContainer) {

            editCarFormContainer.hidden =
                false;

            editCarFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);


// Скасувати редагування
if (
    cancelEditCarButton &&
    editCarFormContainer
) {

    cancelEditCarButton.addEventListener(
        "click",
        function () {

            editCarFormContainer.hidden =
                true;

            if (editCarForm) {
                editCarForm.reset();
            }

        }
    );

}

// ========================================
// ЗБЕРЕЖЕННЯ ЗМІН АВТОМОБІЛЯ
// ========================================

if (editCarForm) {

    editCarForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const params =
                new URLSearchParams(
                    window.location.search
                );

            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            // Отримуємо дані форми
            const name =
                document
                    .getElementById("edit-car-name")
                    .value
                    .trim();

            const make =
                document
                    .getElementById("edit-car-make")
                    .value
                    .trim();

            const model =
                document
                    .getElementById("edit-car-model")
                    .value
                    .trim();

            const year =
                document
                    .getElementById("edit-car-year")
                    .value;

            const engine =
                document
                    .getElementById("edit-car-engine")
                    .value
                    .trim();
                    const tankCapacity =
    document
        .getElementById(
            "edit-car-tank-capacity"
        )
        .value;

const lpgTankCapacity =
    document
        .getElementById(
            "edit-car-lpg-tank-capacity"
        )
        .value;        

        const batteryCapacity =
    document
        .getElementById(
            "edit-car-battery-capacity"
        )
        .value;

            const fuelType =
                document
                    .getElementById("edit-car-fuel")
                    .value;

            const transmission =
                document
                    .getElementById("edit-car-transmission")
                    .value;

            const licensePlate =
                document
                    .getElementById("edit-car-license-plate")
                    .value
                    .trim();

            const vin =
                document
                    .getElementById("edit-car-vin")
                    .value
                    .trim();


            


            const saveEditCarButton =
                document.getElementById(
                    "save-edit-car-button"
                );


            if (saveEditCarButton) {

                saveEditCarButton.disabled =
                    true;

                saveEditCarButton.textContent =
                    "Збереження...";

            }

// ========================================
// ЗАВАНТАЖЕННЯ ФОТО АВТОМОБІЛЯ
// ========================================

let uploadedPhotoPath =
    null;


const selectedPhoto =
    editCarPhotoInput?.files?.[0];


if (selectedPhoto) {

    const {
        data: {
            user: photoUser
        },
        error: photoUserError
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        photoUserError ||
        !photoUser
    ) {

        alert(
            "Не вдалося визначити користувача."
        );

        if (saveEditCarButton) {

            saveEditCarButton.disabled =
                false;

            saveEditCarButton.textContent =
                "Зберегти зміни";

        }

        return;

    }


    // Один постійний файл для кожного авто.
    // При новому фото старе буде замінене.
    const photoPath =
        photoUser.id +
        "/" +
        carId +
        "/main";


    const {
        error: photoUploadError
    } =
        await supabaseClient
            .storage
            .from("car-photos")
            .upload(
                photoPath,
                selectedPhoto,
                {
                    upsert: true,
                    contentType:
                        selectedPhoto.type
                }
            );


    if (photoUploadError) {

        console.error(
            "Помилка завантаження фото:",
            photoUploadError
        );

        alert(
            "Не вдалося завантажити фото автомобіля."
        );


        if (saveEditCarButton) {

            saveEditCarButton.disabled =
                false;

            saveEditCarButton.textContent =
                "Зберегти зміни";

        }

        return;

    }


    uploadedPhotoPath =
        photoPath;

}            


            const {
                error
            } =
                await supabaseClient
                    .from("cars")
                    .update({
...(uploadedPhotoPath
    ? {
        photo_path:
            uploadedPhotoPath
      }
    : {}
),                        

                        name:
                            name,

                        make:
                            make,

                        model:
                            model,

                        year:
                            year
                                ? Number(year)
                                : null,

                        engine:
                            engine || null,
                            tank_capacity:
    tankCapacity
        ? Number(tankCapacity)
        : null,

lpg_tank_capacity:
    lpgTankCapacity
        ? Number(lpgTankCapacity)
        : null,        

        battery_capacity:
    batteryCapacity
        ? Number(batteryCapacity)
        : null,

                        fuel_type:
                            fuelType || null,

                        transmission:
                            transmission || null,

                        license_plate:
                            licensePlate || null,

                        vin:
                            vin || null

                    })
                    .eq(
                        "id",
                        carId
                    );


            if (error) {

                console.error(
                    "Помилка редагування автомобіля:",
                    error
                );

                alert(
                    "Не вдалося зберегти зміни."
                );


                if (saveEditCarButton) {

                    saveEditCarButton.disabled =
                        false;

                    saveEditCarButton.textContent =
                        "Зберегти зміни";

                }

                return;

            }


            alert(
                "Дані автомобіля успішно оновлено!"
            );


            // Закриваємо форму
            if (editCarFormContainer) {

                editCarFormContainer.hidden =
                    true;

            }


            editCarForm.reset();


            // Оновлюємо картку автомобіля
            await loadCarDetails();


            if (saveEditCarButton) {

                saveEditCarButton.disabled =
                    false;

                saveEditCarButton.textContent =
                    "Зберегти зміни";

            }

        }
    );

}

// ========================================
// АВТОМАТИЧНИЙ РОЗРАХУНОК СУМИ ЗАПРАВКИ
// ========================================

const refuelLitersInput =
    document.getElementById(
        "refuel-liters"
    );

const refuelPriceInput =
    document.getElementById(
        "refuel-price"
    );

const refuelCostInput =
    document.getElementById(
        "refuel-cost"
    );


function calculateRefuelCost() {

    if (
        !refuelLitersInput ||
        !refuelPriceInput ||
        !refuelCostInput
    ) {
        return;
    }


    const liters =
        Number(
            String(
                refuelLitersInput.value
            ).replace(",", ".")
        );

    const price =
        Number(
            String(
                refuelPriceInput.value
            ).replace(",", ".")
        );


    if (
        liters > 0 &&
        price > 0
    ) {

        const total =
            Math.round(
                (
                    liters *
                    price +
                    Number.EPSILON
                ) *
                100
            ) / 100;


        refuelCostInput.value =
            total.toFixed(2);

    } else {

        refuelCostInput.value =
            "";

    }

}


// Загальну суму вручну не вводимо
if (refuelCostInput) {

    refuelCostInput.readOnly =
        true;

}


// Перерахунок при зміні літрів
if (refuelLitersInput) {

    refuelLitersInput.addEventListener(
        "input",
        calculateRefuelCost
    );

}


// Перерахунок при зміні ціни
if (refuelPriceInput) {

    refuelPriceInput.addEventListener(
        "input",
        calculateRefuelCost
    );

}

// ========================================
// БАК / БАТАРЕЯ У ФОРМІ РЕДАГУВАННЯ АВТО
// ========================================

const editCarFuelSelect =
    document.getElementById(
        "edit-car-fuel"
    );

const editCarTankCapacityInput =
    document.getElementById(
        "edit-car-tank-capacity"
    );

const editCarLpgTankCapacityInput =
    document.getElementById(
        "edit-car-lpg-tank-capacity"
    );    

const editCarBatteryCapacityInput =
    document.getElementById(
        "edit-car-battery-capacity"
    );

const editCarFormForEnergy =
    document.getElementById(
        "edit-car-form"
    );


function setEditCarEnergyFieldVisible(
    input,
    visible
) {

    if (!input) {
        return;
    }


    const field =
        input.closest(
            ".edit-car-field"
        );


    if (field) {

        field.style.display =
            visible ? "" : "none";

    }

}


function updateEditCarEnergyFields() {

    if (!editCarFuelSelect) {
        return;
    }


    const fuelType =
        editCarFuelSelect.value;


    // Якщо тип пального ще не вказаний —
    // показуємо всі поля
    if (!fuelType) {

        setEditCarEnergyFieldVisible(
            editCarTankCapacityInput,
            true
        );

        setEditCarEnergyFieldVisible(
            editCarLpgTankCapacityInput,
            true
        );

        setEditCarEnergyFieldVisible(
            editCarBatteryCapacityInput,
            true
        );

        return;
    }


    const showFuelTank =
        fuelType === "petrol" ||
        fuelType === "diesel" ||
        fuelType === "petrol_lpg" ||
        fuelType === "hybrid" ||
        fuelType === "phev";


    const showLpgTank =
        fuelType === "lpg" ||
        fuelType === "petrol_lpg";


    const showBattery =
        fuelType === "electric" ||
        fuelType === "phev";


    setEditCarEnergyFieldVisible(
        editCarTankCapacityInput,
        showFuelTank
    );

    setEditCarEnergyFieldVisible(
        editCarLpgTankCapacityInput,
        showLpgTank
    );

    setEditCarEnergyFieldVisible(
        editCarBatteryCapacityInput,
        showBattery
    );

}


// Зміна типу автомобіля вручну
if (editCarFuelSelect) {

    editCarFuelSelect.addEventListener(
        "change",
        updateEditCarEnergyFields
    );

}


// Коли відкриваємо форму редагування,
// спочатку заповнюються дані автомобіля,
// а потім ми визначаємо потрібні поля
document.addEventListener(
    "click",
    function (event) {

        const editButton =
            event.target.closest(
                "#edit-car-details-button"
            );


        if (!editButton) {
            return;
        }


        setTimeout(
            updateEditCarEnergyFields,
            0
        );

    }
);


// Перед збереженням очищаємо
// непотрібні дані
if (editCarFormForEnergy) {

    editCarFormForEnergy.addEventListener(
        "submit",
        function () {

            if (!editCarFuelSelect) {
                return;
            }


            const fuelType =
                editCarFuelSelect.value;


            // Паливний бак не потрібен
            // для електро та чистого LPG
            if (
                (
                    fuelType === "electric" ||
                    fuelType === "lpg"
                ) &&
                editCarTankCapacityInput
            ) {

                editCarTankCapacityInput.value =
                    "";

            }


            // Газовий балон потрібен тільки
            // для LPG та бензин + газ
            if (
                fuelType &&
                fuelType !== "lpg" &&
                fuelType !== "petrol_lpg" &&
                editCarLpgTankCapacityInput
            ) {

                editCarLpgTankCapacityInput.value =
                    "";

            }


            // Батарея потрібна тільки
            // для електро та PHEV
            if (
                fuelType &&
                fuelType !== "electric" &&
                fuelType !== "phev" &&
                editCarBatteryCapacityInput
            ) {

                editCarBatteryCapacityInput.value =
                    "";

            }

        },
        true
    );

}

// ========================================
// ВІДКРИТТЯ / ЗАКРИТТЯ ФОРМИ ЗАРЯДЖАННЯ
// ========================================

const addChargeButton =
    document.getElementById(
        "add-charge-button"
    );

const chargeFormContainer =
    document.getElementById(
        "charge-form-container"
    );

const chargeForm =
    document.getElementById(
        "charge-form"
    );

const cancelChargeButton =
    document.getElementById(
        "cancel-charge-button"
    );

    // ID заряджання, яке зараз редагуємо.
// null = додаємо нове заряджання.
let editingChargeId = null;


// Відкрити форму заряджання
if (
    addChargeButton &&
    chargeFormContainer
) {

    addChargeButton.addEventListener(
        "click",
        function () {
            editingChargeId = null;

            const chargeFormTitle =
    document.getElementById(
        "charge-form-title"
    );

if (chargeFormTitle) {

    chargeFormTitle.textContent =
        "Нове заряджання";

}


const saveChargeButton =
    document.getElementById(
        "save-charge-button"
    );

if (saveChargeButton) {

    saveChargeButton.textContent =
        "Зберегти заряджання";

}

            // Очищаємо старі дані
            if (chargeForm) {
                chargeForm.reset();
            }


            // Ставимо сьогоднішню дату
            const chargeDate =
                document.getElementById(
                    "charge-date"
                );

            if (chargeDate) {

                const today =
                    new Date();

                const year =
                    today.getFullYear();

                const month =
                    String(
                        today.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        today.getDate()
                    ).padStart(2, "0");


                chargeDate.value =
                    `${year}-${month}-${day}`;

            }


            // Показуємо форму
            chargeFormContainer.hidden =
                false;


            // Прокручуємо до неї
            chargeFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}

// ========================================
// АВТОМАТИЧНИЙ РОЗРАХУНОК ВАРТОСТІ ЗАРЯДКИ
// ========================================

const chargeEnergyInput =
    document.getElementById(
        "charge-energy"
    );

const chargePriceInput =
    document.getElementById(
        "charge-price"
    );

const chargeCostInput =
    document.getElementById(
        "charge-cost"
    );


function calculateChargeCost() {

    if (
        !chargeEnergyInput ||
        !chargePriceInput ||
        !chargeCostInput
    ) {
        return;
    }


    const energy =
        Number(
            chargeEnergyInput.value
        );

    const price =
        Number(
            chargePriceInput.value
        );


    if (
        energy > 0 &&
        price >= 0
    ) {

        const total =
            energy * price;


        chargeCostInput.value =
            total.toFixed(2);

    } else {

        chargeCostInput.value =
            "";

    }

}


if (chargeEnergyInput) {

    chargeEnergyInput.addEventListener(
        "input",
        calculateChargeCost
    );

}


if (chargePriceInput) {

    chargePriceInput.addEventListener(
        "input",
        calculateChargeCost
    );

}


// Закрити форму кнопкою "Скасувати"
if (
    cancelChargeButton &&
    chargeFormContainer
) {

    cancelChargeButton.addEventListener(
        "click",
        function () {
            editingChargeId = null;

            chargeFormContainer.hidden =
                true;


            if (chargeForm) {
                chargeForm.reset();
            }

        }
    );

}

// ========================================
// ЗБЕРЕЖЕННЯ ЗАРЯДЖАННЯ В SUPABASE
// ========================================

if (chargeForm) {

    chargeForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ID автомобіля з адреси
            const params =
                new URLSearchParams(
                    window.location.search
                );

            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;
            }


            // ========================================
            // ДАНІ ФОРМИ
            // ========================================

            const chargeDate =
                document
                    .getElementById(
                        "charge-date"
                    )
                    .value;

            const mileage =
                document
                    .getElementById(
                        "charge-mileage"
                    )
                    .value;

            const energyKwh =
                document
                    .getElementById(
                        "charge-energy"
                    )
                    .value;

            const pricePerKwh =
                document
                    .getElementById(
                        "charge-price"
                    )
                    .value;

            const totalCost =
                document
                    .getElementById(
                        "charge-cost"
                    )
                    .value;

            const chargeSource =
                document
                    .getElementById(
                        "charge-source"
                    )
                    .value;

            const place =
                document
                    .getElementById(
                        "charge-place"
                    )
                    .value
                    .trim();

            const startPercent =
                document
                    .getElementById(
                        "charge-start-percent"
                    )
                    .value;

            const endPercent =
                document
                    .getElementById(
                        "charge-end-percent"
                    )
                    .value;

            const description =
                document
                    .getElementById(
                        "charge-description"
                    )
                    .value
                    .trim();


            // ========================================
            // ПЕРЕВІРКА
            // ========================================

            if (
                !chargeDate ||
                !energyKwh
            ) {

                alert(
                    "Вкажіть дату та кількість зарядженої електроенергії."
                );

                return;
            }


            if (
                Number(energyKwh) <= 0
            ) {

                alert(
                    "Кількість кВт·год повинна бути більшою за 0."
                );

                return;
            }


            if (
                startPercent &&
                endPercent &&
                Number(endPercent) <
                    Number(startPercent)
            ) {

                alert(
                    "Заряд після заряджання не може бути меншим за заряд до початку."
                );

                return;
            }


            const saveChargeButton =
                document.getElementById(
                    "save-charge-button"
                );


            if (saveChargeButton) {

                saveChargeButton.disabled =
                    true;

                saveChargeButton.textContent =
                    "Збереження...";

            }


            // ========================================
            // ДАНІ ДЛЯ SUPABASE
            // ========================================

            const chargeData = {

                car_id:
                    carId,

                charge_date:
                    chargeDate,

                mileage:
                    mileage
                        ? Number(mileage)
                        : null,

                energy_kwh:
                    Number(energyKwh),

                price_per_kwh:
                    pricePerKwh
                        ? Number(pricePerKwh)
                        : null,

                total_cost:
                    pricePerKwh && totalCost
                        ? Number(totalCost)
                        : null,

                charge_source:
                    chargeSource || null,

                place:
                    place || null,

                start_percent:
                    startPercent
                        ? Number(startPercent)
                        : null,

                end_percent:
                    endPercent
                        ? Number(endPercent)
                        : null,

                description:
                    description || null,

                updated_at:
                    new Date().toISOString()

            };


            // ========================================
            // ЗБЕРІГАЄМО
            // ========================================

            let result;


// Якщо редагуємо існуюче заряджання
if (editingChargeId) {

    result =
        await supabaseClient
            .from("charges")
            .update(chargeData)
            .eq(
                "id",
                editingChargeId
            );


// Якщо додаємо нове заряджання
} else {

    result =
        await supabaseClient
            .from("charges")
            .insert([
                chargeData
            ]);

}


const {
    error
} = result;


            if (error) {

                console.error(
                    "Помилка збереження заряджання:",
                    error
                );

                alert(
                    "Не вдалося зберегти заряджання."
                );


                if (saveChargeButton) {

                    saveChargeButton.disabled =
                        false;

                    saveChargeButton.textContent =
                        "Зберегти заряджання";

                }

                return;
            }

            // ========================================
// ОНОВЛЕННЯ ПРОБІГУ ПІСЛЯ ЗАРЯДЖАННЯ
// ========================================

if (mileage) {

    const chargeMileage =
        Number(mileage);


    const {
        data: carMileageData,
        error: carMileageError
    } =
        await supabaseClient
            .from("cars")
            .select("mileage")
            .eq(
                "id",
                carId
            )
            .single();


    if (carMileageError) {

        console.error(
            "Не вдалося отримати пробіг автомобіля:",
            carMileageError
        );

    } else {

        const currentCarMileage =
            carMileageData?.mileage !== null &&
            carMileageData?.mileage !== undefined
                ? Number(
                      carMileageData.mileage
                  )
                : null;


        // Пробіг автомобіля
        // ніколи не зменшуємо
        if (
            currentCarMileage === null ||
            chargeMileage >
                currentCarMileage
        ) {

            const {
                error: updateMileageError
            } =
                await supabaseClient
                    .from("cars")
                    .update({
                        mileage:
                            chargeMileage
                    })
                    .eq(
                        "id",
                        carId
                    );


            if (updateMileageError) {

                console.error(
                    "Не вдалося оновити пробіг автомобіля:",
                    updateMileageError
                );

            }

        }

    }

}


            alert(
                "Заряджання успішно збережено!"
            );

            // Виходимо з режиму редагування
editingChargeId = null;


            // Очищаємо форму
            chargeForm.reset();


            // Закриваємо форму
            if (chargeFormContainer) {

                chargeFormContainer.hidden =
                    true;

            }

            // Оновлюємо історію заряджань
// без перезавантаження сторінки
await loadCharges();


            if (saveChargeButton) {

                saveChargeButton.disabled =
                    false;

                saveChargeButton.textContent =
                    "Зберегти заряджання";

            }

        }
    );

}

// ========================================
// ЗАВАНТАЖЕННЯ ІСТОРІЇ ЗАРЯДЖАНЬ
// ========================================

async function loadCharges() {

    const chargesList =
        document.getElementById(
            "charges-list"
        );


    // Працюємо тільки там,
    // де є список заряджань
    if (!chargesList) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("charges")
            .select("*")
            .eq("car_id", carId)
            .order(
    "created_at",
    {
        ascending: false
    }
);


    if (error) {

        console.error(
            "Помилка завантаження заряджань:",
            error
        );

        return;
    }


    chargesList.innerHTML = "";

    // ========================================
// СТАТИСТИКА ЗАРЯДЖАНЬ
// ========================================

const chargeTotalEnergy =
    document.getElementById(
        "charge-total-energy"
    );

const chargeTotalCost =
    document.getElementById(
        "charge-total-cost"
    );

const chargeCount =
    document.getElementById(
        "charge-count"
    );

const chargeAveragePrice =
    document.getElementById(
        "charge-average-price"
    );


// Загальна кількість зарядженої енергії
const totalEnergy =
    data.reduce(
        function (sum, charge) {

            return (
                sum +
                Number(
                    charge.energy_kwh || 0
                )
            );

        },
        0
    );


// Загальна сума витрат
const totalCost =
    data.reduce(
        function (sum, charge) {

            return (
                sum +
                Number(
                    charge.total_cost || 0
                )
            );

        },
        0
    );


// Енергія тільки тих заряджань,
// для яких відома вартість
const energyWithKnownCost =
    data.reduce(
        function (sum, charge) {

            if (
                charge.total_cost !== null &&
                charge.energy_kwh !== null
            ) {

                return (
                    sum +
                    Number(
                        charge.energy_kwh
                    )
                );

            }

            return sum;

        },
        0
    );


// Середня фактична ціна 1 кВт·год
const averagePrice =
    energyWithKnownCost > 0
        ? totalCost /
          energyWithKnownCost
        : null;


// Показуємо статистику
if (chargeTotalEnergy) {

    chargeTotalEnergy.textContent =
        totalEnergy.toLocaleString(
            "uk-UA",
            {
                maximumFractionDigits: 2
            }
        ) +
        " кВт·год";

}


if (chargeTotalCost) {

    chargeTotalCost.textContent =
        totalCost.toLocaleString(
            "uk-UA",
            {
                maximumFractionDigits: 2
            }
        ) +
        " грн";

}


if (chargeCount) {

    chargeCount.textContent =
        data.length.toLocaleString(
            "uk-UA"
        );

}


if (chargeAveragePrice) {

    chargeAveragePrice.textContent =
        averagePrice !== null
            ? averagePrice.toLocaleString(
                  "uk-UA",
                  {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                  }
              ) +
              " грн/кВт·год"
            : "— грн/кВт·год";

}


    // Якщо заряджань ще немає
    if (!data || data.length === 0) {

        chargesList.innerHTML = `
            <div class="maintenance-empty">
                <p>
                    Історія заряджань поки порожня.
                </p>
            </div>
        `;

        return;
    }


    data.forEach(
        function (charge) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "refuel-history-card";


            // ------------------------
            // Дата
            // ------------------------

            let formattedDate =
                "Дата не вказана";


            if (charge.charge_date) {

                const parts =
                    charge.charge_date
                        .split("-");

                formattedDate =
                    `${parts[2]}.${parts[1]}.${parts[0]}`;

            }


            // ------------------------
            // Джерело заряджання
            // ------------------------

            let sourceText =
                "Не вказано";


            if (
                charge.charge_source ===
                "home"
            ) {
                sourceText =
                    "🏠 Домашня зарядка / розетка";
            }


            if (
                charge.charge_source ===
                "public"
            ) {
                sourceText =
                    "⚡ Публічна зарядна станція";
            }


            if (
                charge.charge_source ===
                "work"
            ) {
                sourceText =
                    "🏢 Заряджання на роботі";
            }


            if (
                charge.charge_source ===
                "other"
            ) {
                sourceText =
                    "📍 Інше";
            }


            card.innerHTML = `

                <div class="refuel-history-header">

                    <div>

                        <h3>
                            ⚡ ${Number(
                                charge.energy_kwh
                            ).toLocaleString(
                                "uk-UA"
                            )} кВт·год
                        </h3>

                        <span>
                            ${formattedDate}
                        </span>

                    </div>


                    ${
                        charge.total_cost !== null
                            ? `
                                <strong>
                                    ${Number(
                                        charge.total_cost
                                    ).toLocaleString(
                                        "uk-UA",
                                        {
                                            maximumFractionDigits: 2
                                        }
                                    )} грн
                                </strong>
                            `
                            : ""
                    }

                </div>


                <div class="refuel-history-info">

                    ${
                        charge.mileage !== null
                            ? `
                                <p>
                                    <strong>
                                        Пробіг:
                                    </strong>

                                    ${Number(
                                        charge.mileage
                                    ).toLocaleString(
                                        "uk-UA"
                                    )} км
                                </p>
                            `
                            : ""
                    }


                    ${
                        charge.price_per_kwh !== null
                            ? `
                                <p>
                                    <strong>
                                        Ціна за 1 кВт·год:
                                    </strong>

                                    ${Number(
                                        charge.price_per_kwh
                                    ).toLocaleString(
                                        "uk-UA",
                                        {
                                            maximumFractionDigits: 2
                                        }
                                    )} грн
                                </p>
                            `
                            : ""
                    }


                    <p>
                        <strong>
                            Джерело:
                        </strong>

                        ${sourceText}
                    </p>


                    ${
                        charge.start_percent !== null
                            ? `
                                <p>
                                    <strong>
                                        Заряд до:
                                    </strong>

                                    ${charge.start_percent}%
                                </p>
                            `
                            : ""
                    }


                    ${
                        charge.end_percent !== null
                            ? `
                                <p>
                                    <strong>
                                        Заряд після:
                                    </strong>

                                    ${charge.end_percent}%
                                </p>
                            `
                            : ""
                    }


                    ${
                        charge.place
                            ? `
                                <p>
                                    <strong>
                                        Місце:
                                    </strong>

                                    ${charge.place}
                                </p>
                            `
                            : ""
                    }


                    ${
                        charge.description
                            ? `
                                <p>
                                    <strong>
                                        Примітка:
                                    </strong>

                                    ${charge.description}
                                </p>
                            `
                            : ""
                    }

                </div>

            `;


           // ========================================
// КНОПКА ВИДАЛЕННЯ ЗАРЯДЖАННЯ
// ========================================

const chargeActions =
    document.createElement(
        "div"
    );

chargeActions.className =
    "refuel-history-actions";

    // ========================================
// КНОПКА РЕДАГУВАННЯ ЗАРЯДЖАННЯ
// ========================================

const editChargeButton =
    document.createElement(
        "button"
    );

editChargeButton.type =
    "button";

editChargeButton.className =
    "edit-refuel-button";

editChargeButton.textContent =
    "Редагувати";


editChargeButton.addEventListener(
    "click",
    function () {

        // Запам'ятовуємо,
        // яке заряджання редагуємо
        editingChargeId =
            charge.id;


        // Заголовок форми
        const chargeFormTitle =
            document.getElementById(
                "charge-form-title"
            );

        if (chargeFormTitle) {

            chargeFormTitle.textContent =
                "Редагування заряджання";

        }


        // Текст кнопки збереження
        const saveChargeButton =
            document.getElementById(
                "save-charge-button"
            );

        if (saveChargeButton) {

            saveChargeButton.textContent =
                "Зберегти зміни";

        }


        // Заповнюємо форму
        document.getElementById(
            "charge-date"
        ).value =
            charge.charge_date || "";


        document.getElementById(
            "charge-mileage"
        ).value =
            charge.mileage ?? "";


        document.getElementById(
            "charge-energy"
        ).value =
            charge.energy_kwh ?? "";


        document.getElementById(
            "charge-price"
        ).value =
            charge.price_per_kwh ?? "";


        document.getElementById(
            "charge-cost"
        ).value =
            charge.total_cost ?? "";


        document.getElementById(
            "charge-source"
        ).value =
            charge.charge_source || "";


        document.getElementById(
            "charge-start-percent"
        ).value =
            charge.start_percent ?? "";


        document.getElementById(
            "charge-end-percent"
        ).value =
            charge.end_percent ?? "";


        document.getElementById(
            "charge-place"
        ).value =
            charge.place || "";


        document.getElementById(
            "charge-description"
        ).value =
            charge.description || "";


        // Відкриваємо форму
        if (chargeFormContainer) {

            chargeFormContainer.hidden =
                false;

            chargeFormContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);


const deleteChargeButton =
    document.createElement(
        "button"
    );

deleteChargeButton.type =
    "button";

deleteChargeButton.className =
    "delete-refuel-button";

deleteChargeButton.textContent =
    "Видалити";


deleteChargeButton.addEventListener(
    "click",
    async function () {

        const confirmed =
            confirm(
                `Видалити заряджання ${Number(
                    charge.energy_kwh
                ).toLocaleString(
                    "uk-UA"
                )} кВт·год?`
            );


        if (!confirmed) {
            return;
        }


        const {
            error: deleteChargeError
        } =
            await supabaseClient
                .from("charges")
                .delete()
                .eq(
                    "id",
                    charge.id
                );


        if (deleteChargeError) {

            console.error(
                "Помилка видалення заряджання:",
                deleteChargeError
            );

            alert(
                "Не вдалося видалити заряджання."
            );

            return;
        }


        alert(
            "Заряджання успішно видалено!"
        );


        await loadCharges();

    }
);

chargeActions.appendChild(
    editChargeButton
);

chargeActions.appendChild(
    deleteChargeButton
);


card.appendChild(
    chargeActions
);
            chargesList.appendChild(
                card
            );

        }
    );

}


// Завантажуємо заряджання
// при відкритті сторінки
loadCharges();

// ========================================
// КНОПКИ ЗАПРАВКИ / ЗАРЯДЖАННЯ
// ЗАЛЕЖНО ВІД ТИПУ АВТОМОБІЛЯ
// ========================================

async function updateFuelPageButtons() {

    const refuelButton =
        document.getElementById(
            "add-refuel-button"
        );

    const chargeButton =
        document.getElementById(
            "add-charge-button"
        );


    // Якщо ми не на fuel.html
    if (
        !refuelButton &&
        !chargeButton
    ) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );

    const carId =
        params.get("id");


    if (!carId) {
        return;
    }


    const {
        data: car,
        error
    } =
        await supabaseClient
            .from("cars")
            .select("fuel_type")
            .eq("id", carId)
            .single();


    if (error) {

        console.error(
            "Не вдалося визначити тип автомобіля:",
            error
        );

        return;
    }


    const fuelType =
        car?.fuel_type || "";


    // ------------------------
    // ЕЛЕКТРОМОБІЛЬ
    // ------------------------

    if (fuelType === "electric") {

        if (refuelButton) {
            refuelButton.style.display =
                "none";
        }

        if (chargeButton) {
            chargeButton.style.display =
                "";
        }

        return;
    }


    // ------------------------
    // PLUG-IN HYBRID
    // ------------------------

    if (fuelType === "phev") {

        if (refuelButton) {
            refuelButton.style.display =
                "";
        }

        if (chargeButton) {
            chargeButton.style.display =
                "";
        }

        return;
    }


    // ------------------------
    // ЗВИЧАЙНІ ПАЛИВНІ АВТО
    // + HEV
    // ------------------------

    if (
        fuelType === "petrol" ||
        fuelType === "diesel" ||
        fuelType === "lpg" ||
        fuelType === "petrol_lpg" ||
        fuelType === "hybrid"
    ) {

        if (refuelButton) {
            refuelButton.style.display =
                "";
        }

        if (chargeButton) {
            chargeButton.style.display =
                "none";
        }

        return;
    }


    // Якщо тип ще не вказаний —
    // залишаємо обидві кнопки
    if (refuelButton) {
        refuelButton.style.display =
            "";
    }

    if (chargeButton) {
        chargeButton.style.display =
            "";
    }

}


updateFuelPageButtons();

// ========================================
// ПЕРЕВІРКА ДОСТУПУ ДО IMPORT.HTML
// ========================================



async function checkImportAccess() {

    if (
        !document.body.classList.contains(
            "import-page"
        )
    ) {
        return;
    }


    // ========================================
    // ПЕРЕВІРЯЄМО АВТОРИЗАЦІЮ
    // ========================================

    const {
        data: { user },
        error: userError
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        userError ||
        !user
    ) {

        window.location.href =
            "login.html";

        return;

    }


    // ========================================
    // ОТРИМУЄМО ID АВТО З АДРЕСИ
    // ========================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const carId =
        params.get("id");


    if (!carId) {

        window.location.href =
            "garage.html";

        return;

    }


    // ========================================
    // ПЕРЕВІРЯЄМО,
    // ЧИ ЦЕ АВТО НАЛЕЖИТЬ КОРИСТУВАЧУ
    // ========================================

    const {
        data: carAccess,
        error: carAccessError
    } =
        await supabaseClient
            .from("cars")
            .select("id")
            .eq(
                "id",
                carId
            )
            .maybeSingle();


    if (
        carAccessError ||
        !carAccess
    ) {

        window.location.href =
            "garage.html";

        return;

    }

}


checkImportAccess();


// ========================================
// ІМПОРТ — ВИБІР ФАЙЛУ
// ========================================

const importFileInput =
    document.getElementById(
        "import-file"
    );

const importFileInfo =
    document.getElementById(
        "import-file-info"
    );

const importFileName =
    document.getElementById(
        "import-file-name"
    );

const importFileSize =
    document.getElementById(
        "import-file-size"
    );

const readImportFileButton =
    document.getElementById(
        "read-import-file"
    );

const importPreviewSection =
    document.getElementById(
        "import-preview-section"
    );


function formatImportFileSize(
    bytes
) {

    if (
        bytes === null ||
        bytes === undefined
    ) {
        return "";
    }


    if (bytes < 1024) {

        return (
            bytes +
            " Б"
        );

    }


    if (
        bytes <
        1024 * 1024
    ) {

        return (
            (
                bytes /
                1024
            ).toFixed(1) +
            " КБ"
        );

    }


    return (
        (
            bytes /
            (
                1024 *
                1024
            )
        ).toFixed(2) +
        " МБ"
    );

}


if (
    importFileInput &&
    readImportFileButton
) {

    importFileInput.addEventListener(
        "change",
        function () {

            const file =
                importFileInput.files[0];


            // Якщо файл не вибраний
            if (!file) {

                readImportFileButton.disabled =
                    true;


                if (importFileInfo) {

                    importFileInfo.hidden =
                        true;

                }


                if (importPreviewSection) {

                    importPreviewSection.hidden =
                        true;

                }


                return;

            }


            // ========================================
            // ПЕРЕВІРКА ФОРМАТУ
            // ========================================

            const fileNameLower =
                file.name
                    .toLowerCase();


            const supportedFile =
                fileNameLower.endsWith(
                    ".xlsx"
                ) ||
                fileNameLower.endsWith(
                    ".xls"
                ) ||
                fileNameLower.endsWith(
                    ".csv"
                ) ||
                fileNameLower.endsWith(
                    ".pdf"
                );


            if (!supportedFile) {

                alert(
                    "Підтримуються тільки XLSX, XLS, CSV та PDF."
                );


                importFileInput.value =
                    "";

                readImportFileButton.disabled =
                    true;


                if (importFileInfo) {

                    importFileInfo.hidden =
                        true;

                }


                return;

            }


            // ========================================
            // ПОКАЗУЄМО ІНФОРМАЦІЮ ПРО ФАЙЛ
            // ========================================

            if (importFileName) {

                importFileName.textContent =
                    file.name;

            }


            if (importFileSize) {

                importFileSize.textContent =
                    formatImportFileSize(
                        file.size
                    );

            }


            if (importFileInfo) {

                importFileInfo.hidden =
                    false;

            }


            readImportFileButton.disabled =
                false;


            // Якщо вибрали інший файл —
            // старий попередній перегляд ховаємо
            if (importPreviewSection) {

                importPreviewSection.hidden =
                    true;

            }

        }
    );

}

// ========================================
// ІМПОРТ — ЧИТАННЯ EXCEL ТА CSV
// ========================================

const importPreview =
    document.getElementById(
        "import-preview"
    );

const saveImportButton =
    document.getElementById(
        "save-import"
    );


// Тут тимчасово зберігатимемо
// прочитані рядки документа
let importedDocumentRows =
    [];

let parsedImportRecords =
    [];    


// ========================================
// ІМПОРТ — РОЗБІР РЯДКІВ ДОКУМЕНТА
// ========================================

function normalizeImportHeader(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );

}


function findImportColumn(
    headers,
    variants
) {

    for (
        let index = 0;
        index < headers.length;
        index++
    ) {

        const header =
            normalizeImportHeader(
                headers[index]
            );


        if (
            variants.some(
                function (variant) {

                    return (
                        header ===
                        normalizeImportHeader(
                            variant
                        )
                    );

                }
            )
        ) {

            return index;

        }

    }


    return -1;

}


function normalizeImportDate(
    value
) {

    const text =
        String(
            value || ""
        ).trim();


    if (!text) {
        return "";
    }


    // Уже формат YYYY-MM-DD
    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {

        return text;

    }


    // Формат DD.MM.YYYY
    const dotMatch =
        text.match(
            /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/
        );


    if (dotMatch) {

        const day =
            dotMatch[1]
                .padStart(
                    2,
                    "0"
                );

        const month =
            dotMatch[2]
                .padStart(
                    2,
                    "0"
                );

        const year =
            dotMatch[3];


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    return text;

}


function detectImportRecordType(
    typeText,
    title
) {

    const type =
        normalizeImportHeader(
            typeText
        );

    const workTitle =
        normalizeImportHeader(
            title
        );


    if (
        type.includes(
            "автомоб"
        )
    ) {

        return "car";

    }


    if (
        type.includes(
            "обслугов"
        ) ||
        type === "то"
    ) {

        return "maintenance";

    }


    if (
        type.includes(
            "ремонт"
        )
    ) {

        return "repair";

    }


    if (
        type.includes(
            "заправ"
        )
    ) {

        return "refuel";

    }


    if (
        type.includes(
            "заряд"
        )
    ) {

        return "charge";

    }


    if (
        type.includes(
            "витрат"
        )
    ) {

        return "expense";

    }


    // Якщо в документі СТО немає
    // окремої колонки "Тип",
    // пробуємо визначити за назвою роботи

    if (
        workTitle.includes(
            "олив"
        ) ||
        workTitle.includes(
            "масл"
        ) ||
        workTitle.includes(
            "фільтр"
        ) ||
        workTitle.includes(
            "технічне обслугов"
        ) ||
        workTitle.includes(
            "то "
        )
    ) {

        return "maintenance";

    }


    // Для звичайної роботи СТО
    // за замовчуванням ставимо ремонт.
    // Перед імпортом користувач зможе це змінити.
    return "repair";

}


function parseImportRows(
    rows
) {

    if (
        !rows ||
        rows.length < 2
    ) {

        return [];

    }


    const headers =
        rows[0];


    const typeIndex =
        findImportColumn(
            headers,
            [
                "Тип запису",
                "Тип"
            ]
        );


    const dateIndex =
        findImportColumn(
            headers,
            [
                "Дата",
                "Дата робіт",
                "Дата виконання"
            ]
        );


    const titleIndex =
        findImportColumn(
            headers,
            [
                "Назва",
                "Найменування робіт",
                "Найменування робіт / операція",
                "Найменування",
                "Робота",
                "Послуга"
            ]
        );


    const mileageIndex =
        findImportColumn(
            headers,
            [
                "Пробіг",
                "Пробіг, км",
                "Пробіг км"
            ]
        );


    const amountIndex =
        findImportColumn(
            headers,
            [
                "Сума",
                "Сума, грн",
                "Вартість",
                "Вартість, грн"
            ]
        );


    const placeIndex =
        findImportColumn(
            headers,
            [
                "Місце",
                "Місце / АЗС",
                "СТО",
                "Сервіс"
            ]
        );


    const descriptionIndex =
        findImportColumn(
            headers,
            [
                "Опис",
                "Примітка",
                "Коментар"
            ]
        );


    const quantityIndex =
        findImportColumn(
            headers,
            [
                "Кількість",
                "К-сть",
                "Літри"
            ]
        );


    const parsedRecords =
        [];


    rows
        .slice(1)
        .forEach(
            function (
                row,
                rowIndex
            ) {

                const title =
                    titleIndex >= 0
                        ? String(
                            row[
                                titleIndex
                            ] || ""
                        ).trim()
                        : "";


                const typeText =
                    typeIndex >= 0
                        ? String(
                            row[
                                typeIndex
                            ] || ""
                        ).trim()
                        : "";


                // Пропускаємо рядки самого автомобіля
                const recordType =
                    detectImportRecordType(
                        typeText,
                        title
                    );


                if (
                    recordType ===
                    "car"
                ) {
                    return;
                }


                // Порожній рядок не імпортуємо
                if (
                    !title &&
                    !typeText
                ) {
                    return;
                }


                parsedRecords.push({

                    sourceRow:
                        rowIndex + 2,

                    selected:
                        true,

                    type:
                        recordType,

                    date:
                        dateIndex >= 0
                            ? normalizeImportDate(
                                row[
                                    dateIndex
                                ]
                            )
                            : "",

                    title:
                        title ||
                        typeText ||
                        "Робота СТО",

                    mileage:
                        mileageIndex >= 0
                            ? String(
                                row[
                                    mileageIndex
                                ] || ""
                            )
                                .replace(
                                    /\s/g,
                                    ""
                                )
                            : "",

                    amount:
                        amountIndex >= 0
                            ? String(
                                row[
                                    amountIndex
                                ] || ""
                            )
                                .replace(
                                    /\s/g,
                                    ""
                                )
                                .replace(
                                    ",",
                                    "."
                                )
                            : "",

                    quantity:
                        quantityIndex >= 0
                            ? String(
                                row[
                                    quantityIndex
                                ] || ""
                            )
                            : "",

                    place:
                        placeIndex >= 0
                            ? String(
                                row[
                                    placeIndex
                                ] || ""
                            ).trim()
                            : "",

                    description:
                        descriptionIndex >= 0
                            ? String(
                                row[
                                    descriptionIndex
                                ] || ""
                            ).trim()
                            : ""

                });

            }
        );


    return parsedRecords;

}


// ========================================
// ПОКАЗ РОЗІБРАНИХ ЗАПИСІВ
// ========================================

// ========================================
// ІМПОРТ — РОЗБІР ТЕКСТОВОГО PDF
// ========================================

function parsePdfPagesToRecords(
    pdfPagesText
) {

    const lines =
        pdfPagesText
            .flatMap(
                function (page) {

                    return page.lines;

                }
            )
            .map(
                function (line) {

                    return String(
                        line || ""
                    ).trim();

                }
            )
            .filter(Boolean);


    const records =
        [];

// ========================================
// ВИЗНАЧАЄМО НАЗВУ СТО З ШАПКИ PDF
// ========================================

let detectedStoName =
    "";


for (
    const pdfLine of lines
) {

    const stoMatch =
        pdfLine.match(
            /^СТО\s*[«"“„]?(.+?)[»"”]?\s*$/i
        );


    if (stoMatch) {

        detectedStoName =
            stoMatch[1]
                .trim()
                .replace(
                    /^[«"“„]+/,
                    ""
                )
                .replace(
                    /[»"”]+$/,
                    ""
                )
                .trim();

        break;

    }

}        


    let currentType =
        null;

    let currentRecord =
        null;


    function finishCurrentRecord() {

        if (
            currentRecord &&
            currentRecord.title
        ) {

            records.push(
                currentRecord
            );

        }


        currentRecord =
            null;

    }


    function readNumbersFromPdfLine(
        line,
        record
    ) {

        const mileageMatch =
            line.match(
                /(\d[\d\s]*)\s*км/i
            );


        if (mileageMatch) {

            record.mileage =
                mileageMatch[1]
                    .replace(
                        /\s/g,
                        ""
                    );

        }


        const amountMatch =
            line.match(
                /(\d[\d\s]*(?:[.,]\d+)?)\s*грн/i
            );


        if (amountMatch) {

            record.amount =
                amountMatch[1]
                    .replace(
                        /\s/g,
                        ""
                    )
                    .replace(
                        ",",
                        "."
                    );

        }

    }


    lines.forEach(
        function (line) {

            const upperLine =
    line
        .toUpperCase()
        .replace(
            /\s+/g,
            " "
        )
        .trim();

            // ========================================
            // ВИЗНАЧАЄМО РОЗДІЛ
            // ========================================

            if (
                upperLine ===
                "ОБСЛУГОВУВАННЯ"
            ) {

                finishCurrentRecord();

                currentType =
                    "maintenance";

                return;

            }


            if (
                upperLine ===
                "РЕМОНТИ"
            ) {

                finishCurrentRecord();

                currentType =
                    "repair";

                return;

            }


            if (
    upperLine.includes(
        "ІНШІ ВИТРАТИ"
    )
) {

    finishCurrentRecord();

    currentType =
        "expense";

    return;

}


            // Заправки й заряджання
            // окремо доробимо далі
            if (
                upperLine ===
                "ЗАПРАВКИ" ||
                upperLine ===
                "ЗАРЯДЖАННЯ"
            ) {

                finishCurrentRecord();

                currentType =
                    null;

                return;

            }


            // ========================================
            // СЛУЖБОВІ РЯДКИ — ПРОПУСКАЄМО
            // ========================================

            if (
    upperLine.includes(
        "РАЗОМ"
    ) ||
    upperLine.includes(
        "ЗАГАЛОМ"
    )
) {

    finishCurrentRecord();

    return;

}


            if (
                /^АвтоПомічник\s*•/i.test(
                    line
                )
            ) {

                return;

            }

// ========================================
// ЗВИЧАЙНА ТАБЛИЦЯ СТО
// № | Дата | Робота | Пробіг |
// К-сть | Ціна | Сума
// ========================================

const stoTableRowMatch =
    line.match(
        /^\s*\d+\s+(\d{1,2}\.\d{1,2}\.\d{4})\s+(.+?)\s+(\d+)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)\s*$/
    );


if (stoTableRowMatch) {

    finishCurrentRecord();


    const stoDate =
        stoTableRowMatch[1];


    const stoTitle =
        stoTableRowMatch[2]
            .trim();


    const stoMileage =
        stoTableRowMatch[3];


    const stoQuantity =
        stoTableRowMatch[4];


    const stoAmount =
        stoTableRowMatch[6]
            .replace(
                ",",
                "."
            );


    currentRecord = {

        selected:
            true,

        type:
            detectImportRecordType(
                "",
                stoTitle
            ),

        date:
            normalizeImportDate(
                stoDate
            ),

        title:
            stoTitle,

        mileage:
            stoMileage,

        amount:
            stoAmount,

        quantity:
            stoQuantity,

        place:
    detectedStoName,

        description:
            ""

    };


    finishCurrentRecord();


    return;

}
            
            if (!currentType) {
                return;
            }


            // ========================================
            // НОВИЙ ЗАПИС
            // Наприклад:
            // 4 12.10.2026 Заміна підшипника
            // ========================================

            const recordMatch =
                line.match(
                    /^\s*\d+\s+(\d{1,2}\.\d{1,2}\.\d{4})\s+(.+)$/
                );


            if (recordMatch) {

                finishCurrentRecord();


                const date =
                    recordMatch[1];

                const rest =
                    recordMatch[2]
                        .trim();


                currentRecord = {

                    selected:
                        true,

                    type:
                        currentType,

                    date:
                        normalizeImportDate(
                            date
                        ),

                    title:
                        "",

                    mileage:
                        "",

                    amount:
                        "",

                    quantity:
                        "",

                    place:
    detectedStoName,

                    description:
                        ""

                };


                readNumbersFromPdfLine(
                    rest,
                    currentRecord
                );


                const mileagePosition =
                    rest.search(
                        /\d[\d\s]*\s*км/i
                    );


                const amountPosition =
                    rest.search(
                        /\d[\d\s]*(?:[.,]\d+)?\s*грн/i
                    );


                const positions =
                    [
                        mileagePosition,
                        amountPosition
                    ]
                        .filter(
                            function (position) {

                                return (
                                    position >= 0
                                );

                            }
                        );


                let titleEnd =
                    rest.length;


                if (
                    positions.length >
                    0
                ) {

                    titleEnd =
                        Math.min(
                            ...positions
                        );

                }


                currentRecord.title =
                    rest
                        .slice(
                            0,
                            titleEnd
                        )
                        .replace(
                            /[—–-]+\s*$/,
                            ""
                        )
                        .trim();


                return;

            }


            if (!currentRecord) {
                return;
            }


            // ========================================
            // МІСЦЕ
            // ========================================

            const placeMatch =
                line.match(
                    /^Місце:\s*(.+)$/i
                );


            if (placeMatch) {

                currentRecord.place =
                    placeMatch[1]
                        .trim();

                return;

            }


            // ========================================
            // ОПИС
            // ========================================

            const descriptionMatch =
    line.match(
        /^Опис:\s*(.+)$/i
    );
            
            if (descriptionMatch) {

    const descriptionText =
        descriptionMatch[1]
            .trim();


    currentRecord.description =
        currentRecord.description
            ? (
                currentRecord.description +
                ". " +
                descriptionText
              )
            : descriptionText;

    return;

}


            // ========================================
            // КАТЕГОРІЯ ВИТРАТИ
            // ========================================

            const categoryMatch =
                line.match(
                    /^Категорія:\s*(.+)$/i
                );


            if (categoryMatch) {

                const categoryText =
                    "Категорія: " +
                    categoryMatch[1]
                        .trim();


                currentRecord.description =
                    currentRecord.description
                        ? (
                            categoryText +
                            ". " +
                            currentRecord.description
                          )
                        : categoryText;


                return;

            }


            // ========================================
            // ОКРЕМИЙ РЯДОК ПРОБІГУ / СУМИ
            // ========================================

            if (
                /\d[\d\s]*\s*км/i.test(
                    line
                ) ||
                /\d[\d\s]*(?:[.,]\d+)?\s*грн/i.test(
                    line
                )
            ) {

                readNumbersFromPdfLine(
                    line,
                    currentRecord
                );

            }

        }
    );


    finishCurrentRecord();


    return records;

}

function showParsedImportRecords(
    records
) {

    if (
        !importPreview ||
        !importPreviewSection
    ) {
        return;
    }


    importPreview.innerHTML =
        "";


    if (
        records.length === 0
    ) {

        importPreview.innerHTML =
            `
                <p>
                    Не вдалося знайти записи
                    для імпорту.
                </p>
            `;


        importPreviewSection.hidden =
            false;

        return;

    }


    records.forEach(
        function (
            record,
            index
        ) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "import-record-card";


            card.innerHTML =
                `
                    <label class="import-record-select">

                        <input
                            type="checkbox"
                            class="import-record-checkbox"
                            data-import-index="${index}"
                            checked
                        >

                        <strong>
                            Запис ${index + 1}
                        </strong>

                    </label>


                    <div class="import-record-grid">

                        <div>

                            <label>
                                Тип
                            </label>

                            <select
                                class="import-record-type"
                                data-import-index="${index}"
                            >

                                <option
                                    value="maintenance"
                                    ${
                                        record.type ===
                                        "maintenance"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Обслуговування
                                </option>

                                <option
                                    value="repair"
                                    ${
                                        record.type ===
                                        "repair"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Ремонт
                                </option>

                                <option
                                    value="expense"
                                    ${
                                        record.type ===
                                        "expense"
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    Інша витрата
                                </option>

                            </select>

                        </div>


                        <div>

                            <label>
                                Дата
                            </label>

                            <input
                                type="date"
                                class="import-record-date"
                                data-import-index="${index}"
                                value="${record.date}"
                            >

                        </div>


                        <div class="import-record-wide">

                            <label>
                                Робота / назва
                            </label>

                            <input
                                type="text"
                                class="import-record-title"
                                data-import-index="${index}"
                                value="${record.title}"
                            >

                        </div>


                        <div>

                            <label>
                                Пробіг, км
                            </label>

                            <input
                                type="number"
                                class="import-record-mileage"
                                data-import-index="${index}"
                                value="${record.mileage}"
                            >

                        </div>


                        <div>

                            <label>
                                Сума, грн
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                class="import-record-amount"
                                data-import-index="${index}"
                                value="${record.amount}"
                            >

                        </div>


                        <div class="import-record-wide">

                            <label>
                                Місце / СТО
                            </label>

                            <input
                                type="text"
                                class="import-record-place"
                                data-import-index="${index}"
                                value="${record.place}"
                            >

                        </div>


                        <div class="import-record-wide">

                            <label>
                                Опис / примітка
                            </label>

                            <textarea
                                class="import-record-description"
                                data-import-index="${index}"
                                rows="2"
                            >${record.description}</textarea>

                        </div>

                    </div>
                `;


            importPreview.appendChild(
                card
            );

        }
    );


    importPreviewSection.hidden =
        false;


    // Записи розібрані —
// дозволяємо користувачу імпорт
if (saveImportButton) {

    saveImportButton.disabled =
        false;

}


    importPreviewSection.scrollIntoView({
        behavior:
            "smooth",
        block:
            "start"
    });

}

    function showImportTable(
    rows
) {

    if (
        !importPreview ||
        !importPreviewSection
    ) {
        return;
    }


    importPreview.innerHTML =
        "";


    if (
        !rows ||
        rows.length === 0
    ) {

        const emptyMessage =
            document.createElement(
                "p"
            );


        emptyMessage.textContent =
            "У документі не знайдено даних.";


        importPreview.appendChild(
            emptyMessage
        );


        importPreviewSection.hidden =
            false;


        if (saveImportButton) {

            saveImportButton.disabled =
                true;

        }


        return;

    }


    const tableWrapper =
        document.createElement(
            "div"
        );


    tableWrapper.className =
        "import-table-wrapper";


    const table =
        document.createElement(
            "table"
        );


    table.className =
        "import-table";


    // Максимальна кількість колонок
    const columnCount =
        Math.max(
            ...rows.map(
                function (row) {

                    return row.length;

                }
            )
        );


    // Показуємо максимум 50 рядків
    // у попередньому перегляді
    const previewRows =
        rows.slice(
            0,
            50
        );


    previewRows.forEach(
        function (
            row,
            rowIndex
        ) {

            const tr =
                document.createElement(
                    "tr"
                );


            for (
                let columnIndex = 0;
                columnIndex < columnCount;
                columnIndex++
            ) {

                const cell =
                    rowIndex === 0
                        ? document.createElement(
                            "th"
                        )
                        : document.createElement(
                            "td"
                        );


                const value =
                    row[
                        columnIndex
                    ];


                cell.textContent =
                    value !== null &&
                    value !== undefined
                        ? String(value)
                        : "";


                tr.appendChild(
                    cell
                );

            }


            table.appendChild(
                tr
            );

        }
    );


    tableWrapper.appendChild(
        table
    );


    importPreview.appendChild(
        tableWrapper
    );


    // Якщо документ більший —
    // повідомляємо про це
    if (
        rows.length >
        50
    ) {

        const moreInfo =
            document.createElement(
                "p"
            );


        moreInfo.className =
            "import-preview-note";


        moreInfo.textContent =
            "Для попереднього перегляду показано перші 50 рядків із " +
            rows.length +
            ".";


        importPreview.appendChild(
            moreInfo
        );

    }


    importPreviewSection.hidden =
        false;


    // Поки імпорт у базу ще не підключений
    if (saveImportButton) {

        saveImportButton.disabled =
            true;

    }


    importPreviewSection.scrollIntoView({
        behavior:
            "smooth",
        block:
            "start"
    });

}


if (
    readImportFileButton &&
    importFileInput
) {

    readImportFileButton.addEventListener(
        "click",
        async function () {

            const file =
                importFileInput.files[0];


            if (!file) {

                alert(
                    "Спочатку виберіть файл."
                );

                return;

            }


            const fileNameLower =
                file.name
                    .toLowerCase();


            // ========================================
// PDF
// ========================================

if (
    fileNameLower.endsWith(
        ".pdf"
    )
) {

    if (
        typeof pdfjsLib ===
        "undefined"
    ) {

        alert(
            "Не вдалося завантажити модуль PDF."
        );

        return;

    }


    readImportFileButton.disabled =
        true;

    readImportFileButton.textContent =
        "Читання PDF...";


    try {

        // Вказуємо PDF.js,
        // де знаходиться worker
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";


        const arrayBuffer =
            await file.arrayBuffer();


        const pdf =
            await pdfjsLib
                .getDocument({
                    data:
                        arrayBuffer
                })
                .promise;


        const pdfPagesText =
            [];


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(
                    pageNumber
                );


            const textContent =
                await page.getTextContent();


            const pageLines =
                [];


            let currentLine =
                [];

            let previousY =
                null;


            textContent.items.forEach(
                function (item) {

                    const currentY =
                        Math.round(
                            item.transform[5]
                        );


                    if (
                        previousY !== null &&
                        Math.abs(
                            currentY -
                            previousY
                        ) > 3
                    ) {

                        if (
                            currentLine.length >
                            0
                        ) {

                            pageLines.push(
                                currentLine.join(
                                    " "
                                )
                            );

                        }


                        currentLine =
                            [];

                    }


                    currentLine.push(
                        item.str
                    );


                    previousY =
                        currentY;

                }
            );


            if (
                currentLine.length >
                0
            ) {

                pageLines.push(
                    currentLine.join(
                        " "
                    )
                );

            }


            pdfPagesText.push({

                pageNumber:
                    pageNumber,

                lines:
                    pageLines.filter(
                        function (line) {

                            return (
                                String(line)
                                    .trim() !==
                                ""
                            );

                        }
                    )

            });

        }


        const totalPdfLines =
            pdfPagesText.reduce(
                function (
                    sum,
                    page
                ) {

                    return (
                        sum +
                        page.lines.length
                    );

                },
                0
            );


        if (
            totalPdfLines === 0
        ) {

            alert(
                "У PDF не знайдено тексту.\n\n" +
                "Ймовірно, це скан або фотографія. " +
                "Розпізнавання таких документів додамо у версії 1.1."
            );

            return;

        }


        // ========================================
// ПЕРЕТВОРЮЄМО PDF У ЗАПИСИ
// ========================================

parsedImportRecords =
    parsePdfPagesToRecords(
        pdfPagesText
    );


if (
    parsedImportRecords.length ===
    0
) {

    alert(
        "Текст із PDF прочитано, але автоматично визначити роботи не вдалося."
    );

    return;

}


showParsedImportRecords(
    parsedImportRecords
);


    } catch (error) {

        console.error(
            "Помилка читання PDF:",
            error
        );


        alert(
            "Не вдалося прочитати цей PDF-файл."
        );

    } finally {

        readImportFileButton.disabled =
            false;

        readImportFileButton.textContent =
            "📄 Прочитати документ";

    }


    return;

}

            const isExcelOrCsv =
                fileNameLower.endsWith(
                    ".xlsx"
                ) ||
                fileNameLower.endsWith(
                    ".xls"
                ) ||
                fileNameLower.endsWith(
                    ".csv"
                );


            if (!isExcelOrCsv) {

                alert(
                    "Цей формат поки не підтримується."
                );

                return;

            }


            if (
                typeof XLSX ===
                "undefined"
            ) {

                alert(
                    "Не вдалося завантажити модуль Excel."
                );

                return;

            }


            readImportFileButton.disabled =
                true;

            readImportFileButton.textContent =
                "Читання документа...";


            try {

                let workbook;


                // ========================================
                // CSV
                // ========================================

                if (
                    fileNameLower.endsWith(
                        ".csv"
                    )
                ) {

                    const text =
                        await file.text();


                    workbook =
                        XLSX.read(
                            text,
                            {
                                type:
                                    "string"
                            }
                        );

                }


                // ========================================
                // XLSX / XLS
                // ========================================

                else {

                    const arrayBuffer =
                        await file.arrayBuffer();


                    workbook =
                        XLSX.read(
                            arrayBuffer,
                            {
                                type:
                                    "array"
                            }
                        );

                }


                if (
                    !workbook.SheetNames ||
                    workbook.SheetNames.length === 0
                ) {

                    alert(
                        "У файлі не знайдено таблиць."
                    );

                    return;

                }


                // Для v1.0 читаємо перший аркуш
                const firstSheetName =
                    workbook.SheetNames[0];


                const firstSheet =
                    workbook.Sheets[
                        firstSheetName
                    ];


                const rows =
                    XLSX.utils.sheet_to_json(
                        firstSheet,
                        {
                            header:
                                1,

                            defval:
                                "",

                            raw:
                                false
                        }
                    );


                // Прибираємо повністю порожні рядки
                importedDocumentRows =
                    rows.filter(
                        function (row) {

                            return row.some(
                                function (cell) {

                                    return String(
                                        cell
                                    ).trim() !== "";

                                }
                            );

                        }
                    );


                parsedImportRecords =
    parseImportRows(
        importedDocumentRows
    );


showParsedImportRecords(
    parsedImportRecords
);


            } catch (error) {

                console.error(
                    "Помилка читання документа:",
                    error
                );


                alert(
                    "Не вдалося прочитати цей файл."
                );

            } finally {

                readImportFileButton.disabled =
                    false;

                readImportFileButton.textContent =
                    "📄 Прочитати документ";

            }

        }
    );

}

// ========================================
// ІМПОРТ — ЗБЕРЕЖЕННЯ В SUPABASE
// ========================================

function importNumberOrNull(
    value
) {

    const text =
        String(
            value ?? ""
        )
            .trim()
            .replace(
                /\s/g,
                ""
            )
            .replace(
                ",",
                "."
            );


    if (!text) {
        return null;
    }


    const number =
        Number(text);


    return Number.isFinite(
        number
    )
        ? number
        : null;

}


function importTextKey(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /\u00A0/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim()
        .toLowerCase();

}


function detectImportedExpenseCategory(
    title,
    description
) {

    const text =
        (
            String(title || "") +
            " " +
            String(description || "")
        )
            .toLowerCase();


    if (
        text.includes("мийк") ||
        text.includes("мойк")
    ) {
        return "wash";
    }


    if (
        text.includes("страх")
    ) {
        return "insurance";
    }


    if (
        text.includes("парку") ||
        text.includes("парков")
    ) {
        return "parking";
    }


    if (
        text.includes("запчаст")
    ) {
        return "parts";
    }


    if (
        text.includes("аксесуар")
    ) {
        return "accessories";
    }


    if (
        text.includes("штраф")
    ) {
        return "fine";
    }


    return "other";

}


if (saveImportButton) {

    saveImportButton.addEventListener(
        "click",
        async function () {

            const params =
                new URLSearchParams(
                    window.location.search
                );


            const carId =
                params.get("id");


            if (!carId) {

                alert(
                    "Не вдалося визначити автомобіль."
                );

                return;

            }


            const recordCards =
                document.querySelectorAll(
                    ".import-record-card"
                );


            const recordsToImport =
                [];


            recordCards.forEach(
                function (card) {

                    const checkbox =
                        card.querySelector(
                            ".import-record-checkbox"
                        );


                    if (
                        !checkbox ||
                        !checkbox.checked
                    ) {
                        return;
                    }


                    const type =
                        card.querySelector(
                            ".import-record-type"
                        )?.value || "";


                    const date =
                        card.querySelector(
                            ".import-record-date"
                        )?.value || "";


                    const title =
                        card.querySelector(
                            ".import-record-title"
                        )?.value.trim() || "";


                    const mileage =
                        importNumberOrNull(
                            card.querySelector(
                                ".import-record-mileage"
                            )?.value
                        );


                    const amount =
                        importNumberOrNull(
                            card.querySelector(
                                ".import-record-amount"
                            )?.value
                        );


                    const place =
                        card.querySelector(
                            ".import-record-place"
                        )?.value.trim() || "";


                    const description =
                        card.querySelector(
                            ".import-record-description"
                        )?.value.trim() || "";


                    recordsToImport.push({

                        type:
                            type,

                        date:
                            date,

                        title:
                            title,

                        mileage:
                            mileage,

                        amount:
                            amount,

                        place:
                            place,

                        description:
                            description

                    });

                }
            );


            if (
                recordsToImport.length ===
                0
            ) {

                alert(
                    "Оберіть хоча б один запис для імпорту."
                );

                return;

            }


            // ========================================
            // ПЕРЕВІРКА ОБОВ'ЯЗКОВИХ ДАНИХ
            // ========================================

            const invalidRecord =
                recordsToImport.find(
                    function (record) {

                        return (
                            !record.type ||
                            !record.date ||
                            !record.title
                        );

                    }
                );


            if (invalidRecord) {

                alert(
                    "У кожному вибраному записі повинні бути тип, дата та назва."
                );

                return;

            }


            saveImportButton.disabled =
                true;

            saveImportButton.textContent =
                "Імпорт даних...";


            try {

                // ========================================
                // ІСНУЮЧІ ЗАПИСИ —
                // ДЛЯ ЗАХИСТУ ВІД ДУБЛІКАТІВ
                // ========================================

                const [
                    existingMaintenanceResult,
                    existingRepairsResult,
                    existingExpensesResult
                ] =
                    await Promise.all([

                        supabaseClient
                            .from("maintenance")
                            .select(
                                "title, service_date, mileage, cost"
                            )
                            .eq(
                                "car_id",
                                carId
                            ),

                        supabaseClient
                            .from("repairs")
                            .select(
                                "title, repair_date, mileage, cost"
                            )
                            .eq(
                                "car_id",
                                carId
                            ),

                        supabaseClient
                            .from("expenses")
                            .select(
                                "title, expense_date, mileage, amount"
                            )
                            .eq(
                                "car_id",
                                carId
                            )

                    ]);


                if (
                    existingMaintenanceResult.error ||
                    existingRepairsResult.error ||
                    existingExpensesResult.error
                ) {

                    console.error(
                        "Помилка перевірки дублікатів:",
                        {
                            maintenance:
                                existingMaintenanceResult.error,

                            repairs:
                                existingRepairsResult.error,

                            expenses:
                                existingExpensesResult.error
                        }
                    );


                    alert(
                        "Не вдалося перевірити існуючі записи."
                    );

                    return;

                }


                function sameImportedRecord(
                    record,
                    existing,
                    existingDate,
                    existingAmount
                ) {

                    return (
                        importTextKey(
                            record.title
                        ) ===
                        importTextKey(
                            existing.title
                        ) &&

                        record.date ===
                        existing[
                            existingDate
                        ] &&

                        (
                            record.mileage ??
                            null
                        ) ===
                        (
                            existing.mileage ??
                            null
                        ) &&

                        (
                            record.amount ??
                            null
                        ) ===
                        (
                            existing[
                                existingAmount
                            ] ??
                            null
                        )
                    );

                }


                const maintenanceRows =
                    [];

                const repairRows =
                    [];

                const expenseRows =
                    [];


                let skippedDuplicates =
                    0;


                recordsToImport.forEach(
                    function (record) {

                        // ========================================
                        // ОБСЛУГОВУВАННЯ
                        // ========================================

                        if (
                            record.type ===
                            "maintenance"
                        ) {

                            const duplicate =
                                existingMaintenanceResult.data
                                    .some(
                                        function (existing) {

                                            return sameImportedRecord(
                                                record,
                                                existing,
                                                "service_date",
                                                "cost"
                                            );

                                        }
                                    );


                            if (duplicate) {

                                skippedDuplicates +=
                                    1;

                                return;

                            }


                            maintenanceRows.push({

                                car_id:
                                    carId,

                                title:
                                    record.title,

                                service_date:
                                    record.date,

                                mileage:
                                    record.mileage,

                                cost:
                                    record.amount,

                                service_place:
                                    record.place ||
                                    null,

                                description:
                                    record.description ||
                                    null,

                                reminder_enabled:
                                    false

                            });


                            return;

                        }


                        // ========================================
                        // РЕМОНТ
                        // ========================================

                        if (
                            record.type ===
                            "repair"
                        ) {

                            const duplicate =
                                existingRepairsResult.data
                                    .some(
                                        function (existing) {

                                            return sameImportedRecord(
                                                record,
                                                existing,
                                                "repair_date",
                                                "cost"
                                            );

                                        }
                                    );


                            if (duplicate) {

                                skippedDuplicates +=
                                    1;

                                return;

                            }


                            repairRows.push({

                                car_id:
                                    carId,

                                title:
                                    record.title,

                                repair_date:
                                    record.date,

                                mileage:
                                    record.mileage,

                                cost:
                                    record.amount,

                                repair_place:
                                    record.place ||
                                    null,

                                description:
                                    record.description ||
                                    null

                            });


                            return;

                        }


                        // ========================================
                        // ІНША ВИТРАТА
                        // ========================================

                        if (
                            record.type ===
                            "expense"
                        ) {

                            const duplicate =
                                existingExpensesResult.data
                                    .some(
                                        function (existing) {

                                            return sameImportedRecord(
                                                record,
                                                existing,
                                                "expense_date",
                                                "amount"
                                            );

                                        }
                                    );


                            if (duplicate) {

                                skippedDuplicates +=
                                    1;

                                return;

                            }


                            expenseRows.push({

                                car_id:
                                    carId,

                                title:
                                    record.title,

                                expense_date:
                                    record.date,

                                amount:
                                    record.amount ||
                                    0,

                                category:
                                    detectImportedExpenseCategory(
                                        record.title,
                                        record.description
                                    ),

                                mileage:
                                    record.mileage,

                                place:
                                    record.place ||
                                    null,

                                description:
                                    record.description ||
                                    null,

                                updated_at:
                                    new Date()
                                        .toISOString()

                            });

                        }

                    }
                );


                // ========================================
                // ЗАПИС У SUPABASE
                // ========================================

                let importedCount =
                    0;


                if (
                    maintenanceRows.length >
                    0
                ) {

                    const {
                        error:
                            maintenanceImportError
                    } =
                        await supabaseClient
                            .from(
                                "maintenance"
                            )
                            .insert(
                                maintenanceRows
                            );


                    if (
                        maintenanceImportError
                    ) {

                        throw (
                            maintenanceImportError
                        );

                    }


                    importedCount +=
                        maintenanceRows.length;

                }


                if (
                    repairRows.length >
                    0
                ) {

                    const {
                        error:
                            repairImportError
                    } =
                        await supabaseClient
                            .from(
                                "repairs"
                            )
                            .insert(
                                repairRows
                            );


                    if (
                        repairImportError
                    ) {

                        throw (
                            repairImportError
                        );

                    }


                    importedCount +=
                        repairRows.length;

                }


                if (
                    expenseRows.length >
                    0
                ) {

                    const {
                        error:
                            expenseImportError
                    } =
                        await supabaseClient
                            .from(
                                "expenses"
                            )
                            .insert(
                                expenseRows
                            );


                    if (
                        expenseImportError
                    ) {

                        throw (
                            expenseImportError
                        );

                    }


                    importedCount +=
                        expenseRows.length;

                }


                // ========================================
                // ОНОВЛЕННЯ ПРОБІГУ АВТО
                // ========================================

                const importedMileages =
                    recordsToImport
                        .map(
                            function (record) {

                                return (
                                    record.mileage
                                );

                            }
                        )
                        .filter(
                            function (mileage) {

                                return (
                                    mileage !==
                                    null
                                );

                            }
                        );


                if (
                    importedMileages.length >
                    0
                ) {

                    const maxImportedMileage =
                        Math.max(
                            ...importedMileages
                        );


                    const {
                        data:
                            currentCarData,
                        error:
                            currentCarError
                    } =
                        await supabaseClient
                            .from("cars")
                            .select(
                                "mileage"
                            )
                            .eq(
                                "id",
                                carId
                            )
                            .single();


                    if (
                        !currentCarError &&
                        currentCarData
                    ) {

                        const currentMileage =
                            Number(
                                currentCarData
                                    .mileage ||
                                0
                            );


                        if (
                            maxImportedMileage >
                            currentMileage
                        ) {

                            await supabaseClient
                                .from("cars")
                                .update({
                                    mileage:
                                        maxImportedMileage
                                })
                                .eq(
                                    "id",
                                    carId
                                );

                        }

                    }

                }


                // ========================================
                // РЕЗУЛЬТАТ
                // ========================================

                let message =
                    "Імпорт завершено.\n\n" +
                    "Додано записів: " +
                    importedCount;


                if (
                    skippedDuplicates >
                    0
                ) {

                    message +=
                        "\nПропущено дублікатів: " +
                        skippedDuplicates;

                }


                alert(
                    message
                );


                // Переходимо до повної історії
                window.location.href =
                    "history.html?id=" +
                    encodeURIComponent(
                        carId
                    );

            } catch (error) {

                console.error(
                    "Помилка імпорту:",
                    error
                );


                alert(
                    "Під час імпорту сталася помилка. Перевірте консоль."
                );

            } finally {

                saveImportButton.disabled =
                    false;

                saveImportButton.textContent =
                    "✅ Імпортувати вибрані записи";

            }

        }
    );

}

// ========================================
// ІМПОРТ — КНОПКА "СКАСУВАТИ"
// ========================================

const cancelImportButton =
    document.getElementById(
        "cancel-import"
    );


if (cancelImportButton) {

    cancelImportButton.addEventListener(
        "click",
        function () {

            // Очищаємо вибраний файл
            if (importFileInput) {

                importFileInput.value =
                    "";

            }


            // Ховаємо інформацію про файл
            if (importFileInfo) {

                importFileInfo.hidden =
                    true;

            }


            // Очищаємо назву та розмір
            if (importFileName) {

                importFileName.textContent =
                    "—";

            }


            if (importFileSize) {

                importFileSize.textContent =
                    "—";

            }


            // Очищаємо попередній перегляд
            if (importPreview) {

                importPreview.innerHTML =
                    "";

            }


            if (importPreviewSection) {

                importPreviewSection.hidden =
                    true;

            }


            // Очищаємо тимчасові дані
            importedDocumentRows =
                [];

            parsedImportRecords =
                [];


            // Кнопки знову неактивні
            if (readImportFileButton) {

                readImportFileButton.disabled =
                    true;

            }


            if (saveImportButton) {

                saveImportButton.disabled =
                    true;

            }


            // Повертаємося догори
            window.scrollTo({
                top:
                    0,

                behavior:
                    "smooth"
            });

        }
    );

}

// ========================================
// PWA — SERVICE WORKER
// ========================================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        async function () {

            try {

                const registration =
                    await navigator
                        .serviceWorker
                        .register(
                            "./sw.js"
                        );


                console.log(
                    "Service Worker зареєстровано:",
                    registration.scope
                );

            } catch (error) {

                console.error(
                    "Помилка Service Worker:",
                    error
                );

            }

        }
    );

}

// ========================================
// PWA — КНОПКА ВСТАНОВЛЕННЯ
// ========================================

let deferredInstallPrompt = null;


const installPwaButton =
    document.getElementById(
        "install-pwa-button"
    );


function isPwaInstalled() {

    return (
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches ||
        window.navigator.standalone === true
    );

}


if (installPwaButton) {

    if (isPwaInstalled()) {

        installPwaButton.hidden =
            true;

    } else {

        installPwaButton.hidden =
            false;

    }

}


window.addEventListener(
    "beforeinstallprompt",
    function (event) {

        event.preventDefault();

        deferredInstallPrompt =
            event;


        if (
            installPwaButton &&
            !isPwaInstalled()
        ) {

            installPwaButton.hidden =
                false;

        }

    }
);


if (installPwaButton) {

    installPwaButton.addEventListener(
        "click",
        async function () {

            if (isPwaInstalled()) {

                installPwaButton.hidden =
                    true;

                return;
            }


            if (deferredInstallPrompt) {

                deferredInstallPrompt.prompt();


                const {
                    outcome
                } =
                    await deferredInstallPrompt
                        .userChoice;


                deferredInstallPrompt =
                    null;


                if (
                    outcome === "accepted"
                ) {

                    installPwaButton.hidden =
                        true;

                }

                return;
            }


            const isAppleDevice =
                /iphone|ipad|ipod/i.test(
                    navigator.userAgent
                );


            if (isAppleDevice) {

                alert(
                    "Щоб встановити АвтоПомічник на iPhone або iPad:\n\n" +
                    "1. Відкрийте сайт у Safari.\n" +
                    "2. Натисніть «Поділитися».\n" +
                    "3. Оберіть «Додати на початковий екран»."
                );

                return;
            }


            alert(
                "Якщо вікно встановлення не з'явилося автоматично:\n\n" +
                "Відкрийте меню браузера ⋮ і виберіть " +
                "«Встановити застосунок» або «Додати на головний екран»."
            );

        }
    );

}


window.addEventListener(
    "appinstalled",
    function () {

        deferredInstallPrompt =
            null;


        if (installPwaButton) {

            installPwaButton.hidden =
                true;

        }

    }
);


// ========================================
// ГАЛЕРЕЯ — ПОВНИЙ ПЕРЕГЛЯД СКРІНШОТІВ
// ========================================

const previewImages =
    document.querySelectorAll(
        ".app-preview-card img"
    );


previewImages.forEach(
    function (previewImage) {

        previewImage.addEventListener(
            "click",
            function () {

                const lightbox =
                    document.createElement(
                        "div"
                    );


                lightbox.className =
                    "preview-lightbox";


                const fullImage =
                    document.createElement(
                        "img"
                    );


                fullImage.src =
                    previewImage.src;

                fullImage.alt =
                    previewImage.alt;


                const closeButton =
                    document.createElement(
                        "button"
                    );


                closeButton.type =
                    "button";

                closeButton.className =
                    "preview-lightbox-close";

                closeButton.textContent =
                    "×";


                lightbox.appendChild(
                    fullImage
                );

                lightbox.appendChild(
                    closeButton
                );


                document.body.appendChild(
                    lightbox
                );


                document.body.style.overflow =
                    "hidden";


                function closeLightbox() {

                    lightbox.remove();

                    document.body.style.overflow =
                        "";

                }


                closeButton.addEventListener(
                    "click",
                    closeLightbox
                );


                lightbox.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target ===
                            lightbox
                        ) {

                            closeLightbox();

                        }

                    }
                );

            }
        );

    }
);