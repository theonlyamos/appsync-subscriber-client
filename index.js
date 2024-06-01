// @ts-check

class AWSAppSyncSubscriberClient{
  static url;
  static verbose = false;

  constructor(){
    this.query = ""
    this.variables = {}
    this.params = ""
    this.onmessage = null
    this.onerror = null
    this.stream = null
  }

  /**
   * Creates an AWSAppSyncSubscriber instance.
   *
   * @param {Object} configuration - Configuration for the subscription.
   * @param {string} configuration.url - The url for the backend
   * @param {Boolean} configuration.verbose - Set verbosity
   */
  static configure(configuration){
    AWSAppSyncSubscriberClient.url = configuration?.url
    AWSAppSyncSubscriberClient.verbose = configuration?.verbose
  }

  /**
   * Creates an AWSAppSyncSubscriber instance.
   *
   * @param {Object} subscriptionConfig - Configuration for the subscription.
   * @param {string} subscriptionConfig.query - The GraphQL subscription query string.
   * @param {Object} [subscriptionConfig.variables] - Variables for the subscription query.
   */
  static graphql(subscriptionConfig){
    const subscriber = new AWSAppSyncSubscriberClient()
    subscriber.query = subscriptionConfig?.query
    subscriber.variables = JSON.stringify(subscriptionConfig?.variables || {})
    // @ts-ignore
    subscriber.params = new URLSearchParams({query: subscriber?.query, variables: subscriber?.variables}).toString()
    
    return subscriber
  }

  /**
   * Subscribes to the AppSync subscription.
   *
   * @param {Object} callbacks - Callback functions for handling subscription events.
   * @param {function(data: Object)} [callbacks.next] - Callback for subscription data.
   * @param {function(error: string)} [callbacks.error] - Callback for subscription errors.
   * @returns {AWSAppSyncSubscriberClient} The current instance for method chaining.
   */
  subscribe(callbacks) {
    this.onmessage = callbacks.next || (() => {});
    this.onerror = callbacks.error || (console.error);

    this.stream = new EventSource(`${AWSAppSyncSubscriberClient.url}${this.params}`);

    this.stream.onmessage = (event)=>{
      this.onmessage(JSON.parse(event?.data))
    }

    this.stream.onerror = (error)=>{
      // console.log(error)
      // @ts-ignore
      if (error?.data) this.onerror(JSON.parse(error?.data))
    }

    return this;
  }

  /**
   * Disconnects from the AppSync subscription.
   */
  unsubscribe() {
    if (this.stream) {
      this.stream.close()
    }
  }
}

/**
 * @typedef {Object} SubscriptionError
 * @property {Array<{message: string}>} errors - Array of errors.
 */
export default AWSAppSyncSubscriberClient
