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
    const reqParams = params.reqParams;
    return params.userId && (params.userId === reqParams.userId || !reqParams.userId);
}

async function can(role, operation, params) {
    if (!this.roles[role]) {
        return false;
    }
    const $role = this.roles[role];
    const can = $role.can;
    if (await _canOperation(can, '*', params)) {
        return true;
    }
    if (await _canOperation(can, operation, params)) {
        return true;
    }
    // e.g product:create and product:remove operations will accept product:*
    const operationWildcard = operation.substring(0, operation.indexOf(':')) + ':*';
    if (await _canOperation(can, operationWildcard, params)) {
        return true;
    }
    return $role.inherits && $role.inherits.some(childRole => this.can(childRole, operation, params));
}

async function _canOperation(can, operation, params) {
    if (can[operation] === undefined) {
        return false;
    }
    if (typeof can[operation] !== 'function') {
        return can[operation];
    }
    return can[operation](params);
}

module.exports = {
    roles,
    can,
}