export const RIZZ_CLUB_MODULE_ADDRESSES = {
  PROFILE: '',
}

export const RIZZ_CLUB_MODULE_FUNCTIONS = {
  PROFILE: {
    CREATE_PROFILE: `${RIZZ_CLUB_MODULE_ADDRESSES.PROFILE}::profile::create_profile`,
    UPDATE_USERNAME: `${RIZZ_CLUB_MODULE_ADDRESSES.PROFILE}::profile::update_username`,
    GET_PROFILE: `${RIZZ_CLUB_MODULE_ADDRESSES.PROFILE}::profile::get_profile`,
    FOLLOW: `${RIZZ_CLUB_MODULE_ADDRESSES.PROFILE}::profile::follow`,
    UNFOLLOW: `${RIZZ_CLUB_MODULE_ADDRESSES.PROFILE}::profile::unfollow`,
  },
}
