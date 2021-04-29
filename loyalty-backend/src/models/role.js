// Roles and permissions
// * (a wildcard) works
const roles = {
  admin: {
    can: { '*': true },
  },
  business: {
    can: {
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
      'user:*': _ownUserOnly
    },
  },
  user: {
    can: {
      'campaign:list': true,
      'product:list': true,
      'user:*': _ownUserOnly
    }
  }
}

/**
 * Checks whether the params.userId equals params.reqParams.userId
 */
async function _ownUserOnly(params) {
  const reqParams = params.reqParams
  return params.userId && (params.userId === reqParams.userId || !reqParams.userId)
}

async function can(roleName, operation, params) {
  if (!this.roles[roleName]) {
    return false
  }
  const role = this.roles[roleName]
  const permits = role.can
  if (await _canOperation(permits, '*', params)) {
    return true
  }
  if (await _canOperation(permits, operation, params)) {
    return true
  }
  // e.g product:create and product:remove operations will accept product:*
  const operationWildcard = operation.substring(0, operation.indexOf(':')) + ':*'
  if (await _canOperation(permits, operationWildcard, params)) {
    return true
  }
  return role.inherits && role.inherits.some(childRole => this.can(childRole, operation, params))
}

async function _canOperation(permits, operation, params) {
  if (permits[operation] === undefined) {
    return false
  }
  if (typeof permits[operation] !== 'function') {
    return permits[operation]
  }
  return permits[operation](params)
}

module.exports = {
  roles,
  can,
}
