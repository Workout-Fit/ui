import sharp from 'sharp';

export const processAvatar = async (avatarBuffer: Uint8Array) =>
	sharp(avatarBuffer).resize(100, 100, { fit: 'cover' }).toFormat('webp').toBuffer();
