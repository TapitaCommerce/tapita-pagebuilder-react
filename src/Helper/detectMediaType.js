export const MEDIA_TYPE = {
	UNDETERMINED: 0,
	VIDEO: 1,
	IMAGE: 2,
};

export const detectMediaType = (url) => {
	const urlObj = new URL(url);
	const pathname = urlObj.pathname;
	const split = pathname.split('.');
	const ext = split.length > 0 ? split[split.length - 1] : '';

	switch (ext) {
		case 'mp4':
		case 'mov': {
			return MEDIA_TYPE.VIDEO;
		}
		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'bmp':
		case 'gif': {
			return MEDIA_TYPE.IMAGE;
		}
		default: {
			return MEDIA_TYPE.UNDETERMINED;
		}
	}
};
