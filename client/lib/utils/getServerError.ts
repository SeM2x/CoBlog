import { AxiosError } from 'axios';

const getServerError = (error: unknown) => {
  const serverError = (error as AxiosError).response?.data as unknown as
    | { message: string }
    | undefined;

  console.log(serverError?.message);

  return new Error(serverError?.message || 'Failed to publish blog');
};

export default getServerError;
