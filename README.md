# AppSync Subscriber Client

[![npm version](https://img.shields.io/npm/v/appsync-subscriber.svg)](https://www.npmjs.com/package/@theonlyamos/appsync-subscriber-client)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)


A lightweight and flexible client for subscribing to AWS AppSync GraphQL subscriptions using EventSource.

It works with `@theonlyamos/appsync-subscriber` from the backend to enable subscription to AWS AppSync GraphQL from a nodejs server.

## Installation

You can install `@theonlyamos/appsync-subscriber-client` using npm:

```
npm install @theonlyamos/appsync-subscriber-client
```

## Usage

### Configuration

Before using the `AWSAppSyncSubscriberClient`, you need to configure the backend URL:

```javascript
import AWSAppSyncSubscriberClient from '@theonlyamos/appsync-subscriber-client';

AWSAppSyncSubscriberClient.configure({
  url: 'https://your-backend.com/graphql',
  verbose: false // Set to true for logging
});
```

### Creating a Subscription

To create a subscription instance, use the `graphql` method and provide your GraphQL subscription query and variables:

```javascript
const subscriber = AWSAppSyncSubscriberClient.graphql({
  query: `
    subscription MySubscription($id: ID!) {
      someSubscription(id: $id) {
        id
        value
      }
    }
  `,
  variables: {
    id: '123'
  }
});
```

### Subscribing to Events

Once you have a subscription instance, you can subscribe to events by calling the `subscribe` method and providing callbacks for handling subscription data and errors:

```javascript
subscriber.subscribe({
  next: (data) => {
    console.log('Received data:', data);
    // Handle subscription data
  },
  error: (error) => {
    console.error('Subscription error:', error);
    // Handle subscription errors
  }
});
```

The `next` callback will be called whenever new data is received from the subscription, and the `error` callback will be called if an error occurs during the subscription.

### Unsubscribing

To stop receiving events from the subscription, call the `unsubscribe` method:

```javascript
subscriber.unsubscribe();
```

## API

### `AWSAppSyncSubscriberClient`

#### `configure(configuration)`

Configures the `AWSAppSyncSubscriberClient` with the provided options.

- `configuration.url` (string): The URL of the backend GraphQL API.
- `configuration.verbose` (boolean): Whether to enable verbose logging (default: `false`).

#### `graphql(subscriptionConfig)`

Creates a new `AWSAppSyncSubscriberClient` instance with the provided subscription configuration.

- `subscriptionConfig.query` (string): The GraphQL subscription query.
- `subscriptionConfig.variables` (object, optional): Variables for the subscription query.

#### `subscribe(callbacks)`

Subscribes to the AppSync subscription and sets up event handlers.

- `callbacks.next` (function, optional): Callback function for handling subscription data.
- `callbacks.error` (function, optional): Callback function for handling subscription errors.

Returns the current instance for method chaining.

#### `unsubscribe()`

Disconnects from the AppSync subscription.

## Example

```javascript
import AWSAppSyncSubscriberClient from '@theonlyamos/appsync-subscriber-client';

// Configure the client
AWSAppSyncSubscriberClient.configure({
  url: 'https://your-backend.com/graphql',
  verbose: true
});

// Create a subscription instance
const subscriber = AWSAppSyncSubscriberClient.graphql({
  query: `
    subscription MySubscription($id: ID!) {
      someSubscription(id: $id) {
        id
        value
      }
    }
  `,
  variables: {
    id: '123'
  }
}).subscribe({
  next: (data) => {
    console.log('Received data:', data);
  },
  error: (error) => {
    console.error('Subscription error:', error);
  }
});

// Unsubscribe when needed
setTimeout(() => {
  subscriber.unsubscribe();
}, 60000); // Unsubscribe after 1 minute
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [Apache-2.0 License](LICENSE).
