var RestClient = require('rest-facade').Client;
var ArgumentError = require('./exceptions').ArgumentError;


/**
 * @class
 * Abstracts interaction with the users endpoint.
 * @constructor
 */
var UsersManager = function (options){
  if (options === null || typeof options !== 'object') {
    throw new ArgumentError('Must provide manager options');
  }

  if (options.baseUrl === null || options.baseUrl === undefined) {
    throw new ArgumentError('Must provide a base URL for the API');
  }

  if ('string' !== typeof options.baseUrl || options.baseUrl.length === 0) {
    throw new ArgumentError('The provided base URL is invalid');
  }

  var clientOptions = {
    headers: options.headers,
    query: { repeatParams: false }
  };

  this.users = new RestClient(options.baseUrl + '/users/:id', clientOptions);

  /**
   * Provides an abstraction layer for consuming the
   * [Multifactor Provider endpoint]{@link https://auth0.com/docs/api/v2#!/Users/delete_multifactor_by_provider}.
   *
   * @type {external:RestClient}
   */
  this.multifactor = new RestClient(options.baseUrl + '/users/:id/multifactor/:provider', clientOptions);

  /**
   * Provides a simple abstraction layer for linking user accounts.
   *
   * @type {external:RestClient}
   */
  this.identities = new RestClient(options.baseUrl + '/users/:id/identities/:provider/:user_id', clientOptions);
};


/**
 * Create a new user.
 *
 * @method
 * @param   {Object}    data    User data.
 * @param   {Function}  [cb]    Callback function.
 * @return  {Promise}           User creation promise.
 */
UsersManager.prototype.create = function (data, cb) {
  if (cb && cb instanceof Function) {
    return this.users.create(data, cb);
  }

  return this.users.create(data);
};


/**
 * Get all users.
 *
 * @method
 * @param   {Function}  [cb]  Callback function.
 * @return  {Promise}         UsersManager retrieval promise.
 */
UsersManager.prototype.getAll = function () {
  return this.users.getAll.apply(this.users, arguments);
};


/**
 * Get a user by its id.
 *
 * @method
 * @param   {any}       id    The user id.
 * @param   {Function}  [cb]  Callback function.
 * @return  {Promise}         User retrieval promise.
 */
UsersManager.prototype.get = function () {
  return this.users.get.apply(this.users, arguments);
};


/**
 * Update a user by its id.
 *
 * @method
 * @param   {any}       params  The user id.
 * @param   {Object}    data    New user data.
 * @param   {Function}  [cb]    Callback function
 * @return  {Promise}           User update promise.
 */
UsersManager.prototype.update = function () {
  return this.users.patch.apply(this.users, arguments);
};


/**
 * Update the user metadata.
 *
 * @method
 * @param   {any}       params  The user id.
 * @param   {Object}    data    New user metadata.
 * @param   {Function}  [cb]    Callback function
 * @return  {Promise}
 */
UsersManager.prototype.updateUserMetadata = function (params, metadata, cb) {
  var data = {
    user_metadata: metadata
  };

  if (cb && cb instanceof Function) {
    return this.users.patch(params, metadata, cb);
  }

  return this.users.patch(params, metadata);
};


/**
 * Update the user metadata.
 *
 * @method
 * @param   {any}       params  The user id.
 * @param   {Object}    data    New user metadata.
 * @param   {Function}  [cb]    Callback function
 * @return  {Promise}
 */
UsersManager.prototype.updateAppMetadata = function (params, metadata, cb) {
  var data = {
    app_metadata: metadata
  };

  if (cb && cb instanceof Function) {
    return this.users.patch(params, data, cb);
  }

  return this.users.patch(params, data);
};


/**
 * Delete a user by its id.
 *
 * @method
 * @return  {Promise}           User delete promise.
 */
UsersManager.prototype.delete = function (params) {
  if (typeof params !== 'object' || Number.isNaN(params.id)) {
    throw new ArgumentError('You must provide an id for the delete method');
  }

  return this.users.delete.apply(this.users, arguments);
};


/**
 * Delete all users.
 *
 * @method
 * @return  {Promise}
 */
UsersManager.prototype.deleteAll = function (cb) {
  if (typeof cb !== 'function') {
    var errorMsg = 'The deleteAll method only accepts a callback as argument';

    throw new ArgumentError(errorMsg);
  }

  return this.users.delete.apply(this.users, arguments);
};


/**
 * Delete a multifactor provider.
 *
 * @method
 * @return  {Promise}
 */
UsersManager.prototype.deleteMultifactorProvider = function (params, cb) {
  params = params || {};

  if (!params.id || typeof params.id !== 'string') {
    throw new ArgumentError('The id parameter must be a valid user id');
  }

  if (!params.provider || typeof params.provider !== 'string') {
    throw new ArgumentError('Must specify a provider');
  }

  if (cb && cb instanceof Function) {
    return this.multifactor.delete(params, cb);
  }

  return this.multifactor.delete(params);
};


/**
 * Link the user with another account.
 *
 * @method
 * @return  {Promise}
 */
UsersManager.prototype.link = function (userId, params, cb) {
  var query = { id: userId };
  params = params || {};

  // Require a user ID.
  if (!userId || typeof userId !== 'string') {
    throw new ArgumentError('The userId cannot be null or undefined');
  }

  if (cb && cb instanceof Function) {
    return this.identities.create(query, params, cb);
  }

  return this.identities.create(query, params);
};


/**
 * Unlink the given accounts.
 *
 * @method
 * @return {Promise}
 */
UsersManager.prototype.unlink = function (params, cb) {
  params = params || {};

  if (!params.id || typeof params.id !== 'string') {
    throw new ArgumentError('id field is required');
  }

  if (!params.user_id || typeof params.user_id !== 'string') {
    throw new ArgumentError('user_id field is required');
  }

  if (!params.provider || typeof params.provider !== 'string') {
    throw new ArgumentError('provider field is required');
  }

  if (cb && cb instanceof Function) {
    return this.identities.delete(params, cb);
  }

  return this.identities.delete(params);
};


module.exports = UsersManager;