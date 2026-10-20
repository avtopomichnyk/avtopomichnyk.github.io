const CACHE_NAME =
    "avtopomichnyk-v3";


const STATIC_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./menu.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


// ========================================
// ВСТАНОВЛЕННЯ SERVICE WORKER
// ========================================

self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(
            caches
                .open(CACHE_NAME)
                .then(
                    function (cache) {

                        return cache.addAll(
                            STATIC_FILES
                        );

                    }
                )
        );


        self.skipWaiting();

    }
);


// ========================================
// АКТИВАЦІЯ
// ========================================

self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(
            caches
                .keys()
                .then(
                    function (cacheNames) {

                        return Promise.all(
                            cacheNames
                                .filter(
                                    function (cacheName) {

                                        return (
                                            cacheName !==
                                            CACHE_NAME
                                        );

                                    }
                                )
                                .map(
                                    function (cacheName) {

                                        return caches.delete(
                                            cacheName
                                        );

                                    }
                                )
                        );

                    }
                )
        );


        self.clients.claim();

    }
);


// ========================================
// ЗАПИТИ САЙТУ
// ========================================

self.addEventListener("fetch", function (event) {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const requestUrl = new URL(request.url);

    // Зовнішні запити не перехоплюємо
    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    // Сторінки авторизації не кешуємо
    const authPages = [
        "/login.html",
        "/register.html",
        "/reset-password.html",
        "/garage.html"
    ];

    if (authPages.includes(requestUrl.pathname)) {
        return;
    }

    event.respondWith(

        fetch(request)
            .then(async function (response) {

                if (response.ok) {

                    const cache = await caches.open(CACHE_NAME);

                    await cache.put(
                        request,
                        response.clone()
                    );

                }

                return response;

            })
            .catch(async function () {

                const cachedResponse =
                    await caches.match(request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                return Response.error();

            })

    );

});