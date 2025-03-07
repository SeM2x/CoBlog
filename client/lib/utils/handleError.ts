import { AxiosError } from 'axios';

const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    throw Error(error.response?.data.message || 'Something went wrong');
  }
  throw Error('Something went wrong');
};

export default handleError;
