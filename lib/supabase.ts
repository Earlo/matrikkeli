import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const client = createClient(supabaseUrl, supabasePublicKey);

export const handleUpload = async (
  file: File,
  path: string,
  bucketName: string,
) => {
  try {
    const { error } = await client.storage.from(bucketName).upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });
    if (error) {
      throw error;
    }
    const publicUrl = await getImageUrl(path, bucketName);
    return publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

export const handleUploadFromUrl = async (
  imageUrl: string,
  path: string,
  bucketName: string,
) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], path.split('/').pop() || 'file.jpg', {
      type: blob.type,
    });
    const { data, error } = await client.storage
      .from(bucketName)
      .upload(path, file);
    if (error) {
      throw error;
    }
    return data.fullPath;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

export const getImageUrl = async (path: string, bucketName: string) => {
  try {
    const { data } = await client.storage.from(bucketName).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('Get image URL failed:', error);
  }
};
