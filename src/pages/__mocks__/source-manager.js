const mock = jest.fn().mockImplementation(() => {
    return {
        addSource: jest.fn(),
        getSource: jest.fn()
    };
});

export default mock;
