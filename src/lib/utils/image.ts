import { ImageMagick, MagickGeometry, Gravity, MagickFormat } from '@imagemagick/magick-wasm';

export const processAvatar = async (avatarBuffer: Uint8Array) => {
	return ImageMagick.read(avatarBuffer, (image) => {
		image.resize(new MagickGeometry('100x100^'));
		image.crop(new MagickGeometry(100), Gravity.Center);
		image.thumbnail(new MagickGeometry(100));
		return image.write(MagickFormat.WebP, (data) => data);
	});
};
