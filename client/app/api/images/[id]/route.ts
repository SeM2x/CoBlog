// /app/api/proxy-image/route.js
import { auth } from '@/auth';
import apiRequest from '@/lib/utils/apiRequest';
import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new NextResponse('Image ID is required', { status: 400 });
  }

  const accessToken = (await auth())?.user?.accessToken;
  try {
    const response = await apiRequest.get(
      'https://storage.techerudites.tech/images/' + id,
      {
        responseType: 'arraybuffer', // Get binary data
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add your API key
        },
      }
    );

    // Return the image data with appropriate content type
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': 'image/jpeg', // Adjust if needed (e.g., image/png)
        'Content-Length': response.data.length.toString(),
      },
    });
  } catch (error) {
    console.error(
      'Error fetching image:',
      (error as AxiosError).response?.data
    );
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
