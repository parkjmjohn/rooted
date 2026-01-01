import { supabase } from './supabase';

const AVATAR_BUCKET = 'avatars';

export const downloadAvatarDataUrl = async (path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .download(path);

  if (error || !data) {
    throw error ?? new Error('Failed to download avatar');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unexpected avatar payload'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read avatar data'));
    };

    reader.readAsDataURL(data);
  });
};
