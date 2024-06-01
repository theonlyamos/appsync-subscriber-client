const AWSAppSyncSubscriberClient  = require('../index.js');

describe('AWSAppSyncSubscriberClient', () => {
  const backendUrl = 'https://example.com/graphql';
  const query = 'subscription { someSubscription { id, value } }';
  const variables = { id: 1 };

  beforeEach(() => {
    AWSAppSyncSubscriberClient.configure({ url: backendUrl, verbose: false });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create a new instance with graphql method', () => {
    const subscriber = AWSAppSyncSubscriberClient.graphql({ query, variables });
    expect(subscriber).toBeInstanceOf(AWSAppSyncSubscriberClient);
    expect(subscriber.query).toBe(query);
    expect(subscriber.variables).toEqual(JSON.stringify(variables));
  });

  test('should subscribe to the AppSync subscription', () => {
    const onMessageMock = jest.fn();
    const onErrorMock = jest.fn();
    const eventSourceMock = {
      close: jest.fn(),
      onmessage: null,
      onerror: null,
    };
    
    jest.spyOn(global, 'EventSource').mockImplementation(() => eventSourceMock);

    const subscriber = AWSAppSyncSubscriberClient.graphql({ query, variables });
    subscriber.subscribe({ next: onMessageMock, error: onErrorMock });

    expect(subscriber.stream.onmessage).toBeDefined();
    expect(subscriber.stream.onerror).toBeDefined();

    const messageEvent = { data: JSON.stringify({ someData: 'value' }) };
    const errorEvent = { data: JSON.stringify({ errors: [{ message: 'Error occurred' }] }) };

    eventSourceMock.onmessage(messageEvent);
    expect(onMessageMock).toHaveBeenCalledWith({ someData: 'value' });

    eventSourceMock.onerror(errorEvent);
    expect(onErrorMock).toHaveBeenCalledWith({ errors: [{ message: 'Error occurred' }] });
  });

  test('should unsubscribe from the AppSync subscription', () => {
    const closeMock = jest.fn();
    const eventSourceMock = {
      close: closeMock,
      onmessage: null,
      onerror: null,
    };
    jest.spyOn(global, 'EventSource').mockImplementation(() => eventSourceMock);

    const subscriber = AWSAppSyncSubscriberClient.graphql({ query, variables });
    subscriber.subscribe({});
    subscriber.unsubscribe();

    expect(closeMock).toHaveBeenCalled();
  });
});