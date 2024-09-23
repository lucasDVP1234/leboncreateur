app.get('/creators', async (req, res) => {
    try {
        const creators = await Creator.find();
        const categories = ['Tech', 'Fashion', 'Food', 'Gaming', 'Music']; // Liste statique de catégories
        const videoTypes = ['Tutorial', 'Vlog', 'Review'];

        res.render('creators', { creators, categories, videoTypes });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});
