var RestClient = require('rest-facade').Client;
var ArgumentError = require('../exceptions').ArgumentError;
var utils = require('../utils');


/**
 * Simple facade for consuming a REST API endpoint.
 * @external RestClient
 * @see https://github.com/ngonzalvez/rest-facade
 */


/**
 * @class UserBlocksManager
 * The rule class provides a simple abstraction for performing CRUD operations
 * on Auth0 UserBlocksManager.
 * @constructor
 * @memberOf module:management
 *
 * @param {Object} options            The client options.
 * @param {String} options.baseUrl    The URL of the API.
 * @param {Object} [options.headers]  Headers to be included in all requests.
 */
var UserBlocksManager = function (options) {
  if (options === null || typeof options !== 'object') {
    throw new ArgumentError('Must provide manager options');
  }

  if (options.baseUrl === null || options.baseUrl === undefined) {
    throw new ArgumentError('Must provide a base URL for the API');
  }

  if ('string' !== typeof options.baseUrl || options.baseUrl.length === 0) {
    throw new ArgumentError('The provided base URL is invalid');
  }

  /**
   * Options object for the Rest Client instance.
   *
   * @type {Object}
   */
  var apiOptions = {
    headers: options.headers,
    query: { repeatParams: false }
  };

  /**
   * Provides an abstraction layer for performing CRUD operations on
   * {@link https://auth0.com/docs/api/v2#!/UserBlocksManager Auth0 UserBlocksManager}.
   *
   * @type {external:RestClient}
   */
  this.resource = new RestClient(options.baseUrl + '/user-blocks/:id ', apiOptions);
};


/**
 * Get an Auth0 user-block.
 *
 * @method    get
 * @memberOf  module:management.UserBlocksManager.prototype
 *
 * @example
 * management.userBlocks.get({ id: USER_ID }, function (err, userBlocks) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(userBlocks);
 * });
 *
 * @param   {Object}    params        Rule parameters.
 * @param   {String}    params.id     User ID.
 * @param   {Function}  [cb]          Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(UserBlocksManager, 'get', 'resource.get');

/**
 * Delete an existing user-block.
 *
 * @method    delete
 * @memberOf  module:management.UserBlocksManager.prototype
 *
 * @example
 * management.userBlocks.delete({ id: USER_ID }, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Rule deleted.
 * });
 *
 * @param   {Object}    params        user block parameters.
 * @param   {String}    params.id     User ID.
 * @param   {Function}  [cb]          Callback function.
 *
 * @return  {Promise|undefined}
 */
utils.wrapPropertyMethod(UserBlocksManager, 'delete', 'resource.delete');


module.exports = UserBlocksManager;
