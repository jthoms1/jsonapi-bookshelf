/*eslint-disable new-cap, no-unused-vars */
'use strict';

var RESERVED_PARAMS = ['sort', 'include', 'limit', 'itemId'];

exports.checkResourceType = function() {
};

/*
 * Relationship URLS
 *
 * GET /api/user/1/links/organization
 * GET /api/user/1/links/posts
 */
exports.convertRelationshipUrl = function() {
};

/*
 * Filtering Resources
 *
 * GET /api/comments?post=1
 * GET /api/comments?post=1&author=12
 * GET /api/comments?post.type=blog
 *
 * Extend Filtering
 *
 * GET /api/user?createdAt=gt:10
 * GET /api/user?createdAt=lt:10
 * GET /api/user?firstName=like:Joh*
 */
exports.parseFilters = function(parameters) {

  function isNotReserved(value) {
    return RESERVED_PARAMS.indexOf(value) === -1;
  }

  return Object.keys(parameters)
    .filter(isNotReserved)
    .reduce(function(obj, key) {
      obj[key] = parameters[key];
      return obj;
    }, {});
};

/*
 * Inclusion of Linked Resources
 *
 * GET /api/posts/1?include=comments
 * GET /api/posts/1?include=comments.author
 * GET /api/posts/1?include=author,comments,comments.author
 * GET /api/posts?include=author,comments,comments.author
 */
exports.parseLinks = function(parameters) {
  if (parameters.hasOwnProperty('include')) {
    return {
      withRelated: parameters.include.split(',')
    };
  }
};
//.fetchAll({columns: ['symbol', 'name']})

/*
 * Sort Resources
 *
 * GET /api/posts?sort=-created,title
 * GET /api/posts?include=author&sort[posts]=-created,title&sort[people]=name
 *
 * Bookshelf:
 *   .orderBy(column, [direction])
 */
exports.parseSorting = function(parameters) {
  var direction, column;

  // If there is no sort param then sort on id ascending
  if (!parameters.hasOwnProperty('sort')) {
    direction = 'asc';
    column = 'id';

  // If there is a sort param and it starts with a '-' then use descending order
  } else if (parameters.sort.charAt(0) === '-') {
    direction = 'desc';
    column = parameters.sort.substr(1);

  // Otherwise assume ascending order on the sort param
  } else {
    direction = 'asc';
    column = parameters.sort;
  }

  return {
    column: column,
    direction: direction
  };
};

/*
 * Limit Resource Length with Cursor
 *
 * /api/user?limit=10
 * /api/user?limit=20,10
 *
 * Bookshelf:
 *   .limit(value)
 *   .offset(value)
 */
exports.parseLimits = function(parameters) {
  var resourcelimit = 10;

  if (parameters.limit) {
    resourcelimit = parseInt(parameters.limit, 10);
  }

  return {
    limit: resourcelimit
  };
};