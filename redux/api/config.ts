export const IMAGE_URL = 'https://instagram-copyright-check-backend.onrender.com';
export const BASE_URL = `${IMAGE_URL}/api/v1`;

export function getImageUrl(imagePath: string) {
    return `${IMAGE_URL}/${imagePath}`;
}

