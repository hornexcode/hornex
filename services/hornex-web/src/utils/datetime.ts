import moment from 'moment';

type DateTimeOptions = {
  time?: boolean;
};
export const datetime = (date: string | Date, options?: DateTimeOptions) => {
  const format = options?.time ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
  if (!date) return 'N/A';
  if (typeof date === 'string') {
    return moment(new Date(date)).format(format);
  }
  return moment(date).format(format);
};
