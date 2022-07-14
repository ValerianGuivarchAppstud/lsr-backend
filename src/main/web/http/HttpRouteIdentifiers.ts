export enum HttpRouteIdentifiers {
  /**
   * AUTH
   */
  AUTH_POST_LOGIN = 'AUTH_POST_LOGIN',
  AUTH_POST_REFRESH = 'AUTH_POST_REFRESH',
  AUTH_POST_REGISTER = 'AUTH_POST_REGISTER',

  /**
   * ADMIN
   */
  ADMIN_AUTH_POST_LOGIN = 'ADMIN_AUTH_POST_LOGIN',
  ADMIN_AUTH_POST_REFRESH = 'ADMIN_AUTH_POST_REFRESH',
  ADMIN_AUTH_POST_REGISTER = 'ADMIN_AUTH_POST_REGISTER',

  ADMIN_ACCOUNT_POST = 'ADMIN_ACCOUNT_POST',
  ADMIN_ACCOUNT_PUT = 'ADMIN_ACCOUNT_PUT',
  ADMIN_ACCOUNT_GET = 'ADMIN_ACCOUNT_GET',
  ADMIN_ACCOUNT_GET_ALL = 'ADMIN_ACCOUNT_GET_ALL',
  ADMIN_ACCOUNT_GET_MANY = 'ADMIN_ACCOUNT_GET_MANY',
  ADMIN_GET_ENUM = 'ADMIN_GET_ENUM',

  /**
   * PROFILE
   */
  PROFILE_GET = 'PROFILE_GET',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  PROFILE_DELETE = 'PROFILE_DELETE',
  /**
   * CHARACTER
   */
  CHARACTER_GET = 'CHARACTER_GET',
  CHARACTER_GET_SSE = 'CHARACTER_GET_SSE',
  CHARACTER_CREATE_OR_UPDATE = 'CHARACTER_CREATE_OR_UPDATE',
  CHARACTER_DELETE = 'CHARACTER_DELETE',
  /**
   * HEAL
   */
  HEAL_GET = 'HEAL_GET',

  /**
   * MJ
   */
  MJ_GET = 'MJ_GET',
  MJ_ADD_CHARACTER = 'MJ_ADD_CHARACTER',
  MJ_REMOVE_CHARACTER = 'MJ_REMOVE_CHARACTER',

  /**
   * SETTINGS
   */
  SETTINGS_GET = 'SETTINGS_GET',

  /**
   * ROLL
   */
  ROLL_POST = 'ROLL_POST',
  ROLL_GET_LAST = 'ROLL_GET_LAST',

  /**
   * UTILS
   */
  GET_STATUS = 'GET_STATUS',
  GET_ROOT = 'GET_ROOT'
}
