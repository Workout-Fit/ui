import { ImageMagick, MagickGeometry, Gravity, MagickFormat } from '@imagemagick/magick-wasm';

export const processAvatar = async (avatarBuffer: Uint8Array) => {
	const image = ImageMagick.read(avatarBuffer, (data) => data);

	image.resize(new MagickGeometry('100x100^'));
	image.crop(new MagickGeometry(100), Gravity.Center);

	return image.write(MagickFormat.WebP, (data) => data);
};
