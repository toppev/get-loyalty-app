// Roles and permissions
// * (a wildcard) works
const roles = {
  admin: {
    perms: { '*': true },
  },
  business: {
    perms: {
      'business:*': true,
      'campaign:*': true,
      'product:*': true,
      'purchase:*': true,
      'page:create': true,
      'page:save': true,
      'page:load': true,
      'page:upload': true,
      'customer:update': true,
      'customer:get': true,
      'customer:list': true,
      'reward:*': true,
      'scan:get': true,
      'scan:use': true,
      'notification:*': true,
      'user:*': _ownUserOnly,
    },
  },
  user: {
    perms: {
      'campaign:list': true,
      'product:list': true,
      'user:*': _ownUserOnly
    }
  }
}

/**
 * Checks whether the params.userId equals params.reqParams.userId or reqParams.userId does not exist
 * @param options {{userId, reqParams: {userId}}}
 */
async function _ownUserOnly(options) {
  const reqParams = options.reqParams
  return options.userId && (options.userId === reqParams.userId || !reqParams.userId)
}

/**
 *
 * @param roleName {string}
 * @param operation {string}
 * @param options {{userId, reqParams}}
 * @return {Promise<boolean>}
 */
async function hasPermission(roleName, operation, options) {
  if (!roles[roleName]) {
    return false
  }
  const role = roles[roleName]
  const permits = role.perms
  if (_canOperation(permits, '*', options) || _canOperation(permits, operation, options)) {
    return true
  }
  // e.g product:create and product:remove operations will accept product:*
  const operationWildcard = operation.substring(0, operation.indexOf(':')) + ':*'
  return !!_canOperation(permits, operationWildcard, options)
}

function _canOperation(permits, operation, params) {
  if (permits[operation] === undefined) {
    return false
  }
  if (typeof permits[operation] !== 'function') {
    return permits[operation]
  }
  return permits[operation](params)
}

export default {
  roles,
  hasPermission,
}
