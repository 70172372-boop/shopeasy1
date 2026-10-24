$(document).ready(function () {
    if ($("#productGrid").length) {
        $("#productGrid").html("<p id='loading'>Loading products...</p>");
        
        $.getJSON("products.json")
            .done(function (data) {
                $("#loading").remove();
                products = data;
                displayProducts(products);
                $(".product-card").hide().fadeIn(800);
            })
            .fail(function () {
                $("#productGrid").html("<p style='color:red;'>Error loading JSON file!</p>");
            });
    }

    function handleFilters() {
        let result = products;
        const search = $("#searchBox").val();
        const category = $("#categoryFilter").val();
        const sort = $("#sortFilter").val();

        if (search) result = searchProducts(result, search);
        if (category) result = filterByCategory(result, category);
        if (sort) result = sortProducts(result, sort);

        displayProducts(result);
    }

    $("#searchBox").on("keyup", handleFilters);
    $("#categoryFilter, #sortFilter").on("change", handleFilters);

    $("#productGrid").on("click", ".add-btn", function () {
        const id = Number($(this).data("id"));
        addToCart(id);

        $("<div class='toast'>Added to cart!</div>")
            .appendTo("body")
            .css({ position: "fixed", top: "20px", right: "20px", background: "#27ae60", color: "#fff", padding: "10px 15px", borderRadius: "5px" })
            .fadeIn()
            .delay(1000)
            .fadeOut(function () { $(this).remove(); });
    });

    $(".faq-title").click(function () {
        $(this).next(".faq-answer").slideToggle();
    });

    function renderCart() {
        const tbody = $("#cartTable tbody");
        if (!tbody.length) return;
        tbody.empty();

        cart.forEach(item => {
            tbody.append(`
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                    <td>
                        <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
                        ${item.quantity}
                        <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
                    </td>
                    <td>$${item.price * item.quantity}</td>
                    <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
                </tr>
            `);
        });

        const total = getCartTotal(cart);
        $("#grandTotal").text("$" + total.toFixed(2));
    }

    renderCart();

    $("#cartTable").on("click", ".qty-btn", function () {
        const id = Number($(this).data("id"));
        const change = Number($(this).data("change"));
        updateQuantity(id, change);
        renderCart();
    });

    $("#cartTable").on("click", ".remove-btn", function () {
        const id = Number($(this).data("id"));
        removeFromCart(id);
        renderCart();
    });

    $("#checkoutForm").on("submit", function (e) {
        e.preventDefault();
        if (validateCheckout()) {
            alert("Order Placed Successfully!");
            cart = [];
            localStorage.removeItem('cart');
            renderCart();
            this.reset();
        }
    });
});