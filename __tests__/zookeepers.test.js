const fs = require('fs');
const {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper
} = require('../lib/zookeepers.js');
const { zookeepers } = require('../data/zookeepers');

// prevent data from being written to zookeepers.json file
jest.mock('fs');

test('creates a zookeeper object', () => {
    const zookeeper = createNewZookeeper(
        { name: 'Darlene', id: 'jhgdja3ng2' },
        zookeepers
    );

    expect(zookeeper.name).toBe("Darlene");
    expect(zookeeper.id).toBe('jhgdja3ng2');
});

test('filters by query', () => {
    const startingZookeepers = [
        {
            "id": "0",
            "name": "Kim",
            "age": 28,
            "favoriteAnimal": "dolphin"
        },
        {
            "id": "1",
            "name": "Raksha",
            "age": 31,
            "favoriteAnimal": "penguin"
        }
    ];

    const updatedZookeepers = filterByQuery({ favoriteAnimal: "dolphin" }, startingZookeepers);

    expect(updatedZookeepers.length).toEqual(1);
});

test("finds by id", () => {
    const startingZookeepers = [
        {
            "id": "0",
            "name": "Kim",
            "age": 28,
            "favoriteAnimal": "dolphin"
        },
        {
            "id": "1",
            "name": "Raksha",
            "age": 31,
            "favoriteAnimal": "penguin"
        }
    ];

    const result = findById("1", startingZookeepers);

    expect(result.name).toBe("Raksha");
});

test("validates age", () => {
    const zookeeper = {
        "id": "1",
        "name": "Raksha",
        "age": 31,
        "favoriteAnimal": "penguin"
    };

    const invalidZookeeper = {
        "id": "0",
        "name": "Kim",
        "age": "28",
        "favoriteAnimal": "dolphin"
    }

    const result = validateZookeeper(zookeeper);
    const result2 = validateZookeeper(invalidZookeeper);

    expect(result).toBe(true);
    expect(result2).toBe(false);
})