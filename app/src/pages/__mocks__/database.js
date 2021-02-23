const mock = jest.fn().mockImplementation(() => {
    return {
        createSource: jest.fn(),
        loadSource: jest.fn()
    };
});

export default mock;
