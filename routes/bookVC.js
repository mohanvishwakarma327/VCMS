app.post("/bookVC", async (req, res) => {
    try {
        const newBooking = new VCBooking(req.body);
        await newBooking.save();
        res.status(200).send("Success");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});
