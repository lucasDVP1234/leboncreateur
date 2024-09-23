const newCreator = new Creator({
    name: 'Jane Smith',
    age: 30,
    category: 'Lifestyle',
    videoTypes: ['Vlogs', 'Travel'],
    profileImage: '/images/jane_smith.jpg',
    description: 'Lifestyle vlogger sharing travel experiences.'
});

newCreator.save((err) => {
    if (err) {
        console.error('Error saving new creator:', err);
    } else {
        console.log('New creator saved successfully.');
    }
});