document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("bookingForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const storeName = document.getElementById("storeName").value;
        const storeEmail = document.getElementById("storeEmail").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        const response = await fetch("/book-vc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storeName, storeEmail, date, time })
        });

        const result = await response.json();
        alert(result.message);
    });
});
