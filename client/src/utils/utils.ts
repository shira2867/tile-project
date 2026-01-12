import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

export const getAvatarUri = () => {
  const avatar = createAvatar(lorelei, {
  });
  return avatar.toDataUri();
};