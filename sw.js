const CACHE_NAME =
    "avtopomichnyk-v1";


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

self.addEventListener(
    "fetch",
    function (event) {

        const request =
            event.request;


        if (
            request.method !== "GET"
        ) {
            return;
        }


        const requestUrl =
            new URL(
                request.url
            );


        // Supabase, Google, CDN тощо
        // service worker не кешуємо
        if (
            requestUrl.origin !==
            self.location.origin
        ) {
            return;
        }


        event.respondWith(

            fetch(request)
                .then(
                    function (response) {

                        const responseCopy =
                            response.clone();


                        caches
                            .open(CACHE_NAME)
                            .then(
                                function (cache) {

                                    cache.put(
                                        request,
                                        responseCopy
                                    );

                                }
                            );


                        return response;

                    }
                )
                .catch(
                    function () {

                        return caches.match(
                            request
                        );

                    }
                )

        );

    }
);