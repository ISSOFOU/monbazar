// Resizes and compresses a photo client-side before it's uploaded, so a real
// phone camera photo (often 3-8 MB) doesn't blow past the upload size limit.
export function compressImage(file: File, maxDimension = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas unsupported'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Compresses then uploads a photo via /api/upload, returning its served URL.
export async function uploadImage(file: File, authToken: string): Promise<string> {
  const dataUrl = await compressImage(file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ dataUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'upload failed');
  return data.url as string;
}
