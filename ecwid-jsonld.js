document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() { 
        let productElement = document.querySelector('.ec-store__product-page');

        if (!productElement) {
            console.warn("⚠ No es una página de producto. JSON-LD no se generará.");
            return; // No ejecutar el código si no es una página de producto
        }

        // Capturar SKU
        let skuElement = document.querySelector('.ec-store__product-page [itemprop="sku"]');
        let productSku = skuElement ? skuElement.getAttribute('content') || "No SKU" : "No SKU";

        // Capturar Precio
        let priceElement = document.querySelector('.ec-store__product-page [itemprop="price"]');
        let productPrice = priceElement ? priceElement.getAttribute('content') || "0.0" : "0.0";

        // Capturar Moneda
        let currencyElement = document.querySelector('.ec-store__product-page [itemprop="priceCurrency"]');
        let productCurrency = currencyElement ? currencyElement.getAttribute('content') || "USD" : "USD";

        // Capturar Nombre del Producto
        let nameElement = document.querySelector('.ec-store__product-page .product-title');
        let productName = nameElement ? nameElement.textContent.trim() || "Producto sin nombre" : "Producto sin nombre";

        // Capturar URL COMPLETA del Producto
        let productUrl = window.location.href;

        // Capturar Imágenes
        let productImages = Array.from(document.querySelectorAll('.ec-store__product-page .ec-image-popup img'))
            .map(img => img.src)
            .filter(src => src);

        if (productImages.length === 0) {
            console.warn("⚠ No se encontraron imágenes para el producto.");
            productImages.push("https://deshopty.com/default-image.jpg"); // Imagen por defecto
        }

        // Capturar Descripción
        let descriptionElement = document.querySelector('.ec-store__product-page [itemprop="description"]');
        let productDescription = descriptionElement ? descriptionElement.textContent.trim() || "Descripción no disponible." : "Descripción no disponible.";

        // Construcción del JSON-LD con "shippingDetails"
        let jsonLd = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productName,
            "image": productImages,
            "description": productDescription,
            "sku": productSku,
            "offers": {
                "@type": "Offer",
                "priceCurrency": productCurrency,
                "price": productPrice,
                "url": productUrl,
                "itemCondition": "https://schema.org/NewCondition",
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "Organization",
                    "name": "Deshopty"
                },
                "shippingDetails": {  // ✅ Agregado para evitar errores en Google
                    "@type": "OfferShippingDetails",
                    "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": "0.00",
                        "currency": "USD"
                    },
                    "shippingDestination": {
                        "@type": "DefinedRegion",
                        "addressCountry": "US"
                    },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 1,
                            "maxValue": 2,
                            "unitCode": "day"
                        },
                        "transitTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 3,
                            "maxValue": 7,
                            "unitCode": "day"
                        }
                    }
                }
            }
        };

        // Insertar el JSON-LD en el <head> de la página
        let script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
        console.log("✅ JSON-LD agregado con éxito:", jsonLd);

    }, 2000); // Retraso de 2 segundos para garantizar que Ecwid haya cargado el producto
});
