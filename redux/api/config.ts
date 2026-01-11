export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL ? process.env.NEXT_PUBLIC_IMAGE_URL : 'http://localhost:8080';
export const BASE_URL = `${IMAGE_URL}/api/v1`;
export const REVALIDATE_TIME = 30;

export function getImageUrl(imagePath: string) {
    return `${IMAGE_URL}/${imagePath}`;
}