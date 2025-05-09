import { GetNotificationsResponse } from '@/lib/models/types/rest/get-notifications';
import { dataLoader } from '@/lib/request';

const { useData: useGetNotifications } =
  dataLoader<GetNotificationsResponse>('getNotifications');

export const NotificationMenuItem = () => {
  const { data: notifications } = useGetNotifications({
    activity: 'team_invitation',
  });

  return (
    <button
      id="dropdownNotificationButton"
      data-dropdown-toggle="dropdownNotification"
      className="inline-flex items-center text-center text-sm font-medium text-gray-500 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-white"
      type="button"
    >
      <svg
        className="h-5 w-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 14 20"
      >
        <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
      </svg>
      <div className="relative flex">
        {notifications &&
          notifications.find(
            (notification) => notification.read_at === null
          ) && (
            <div className="relative -top-2 right-3 inline-flex h-3 w-3 rounded-full border-2 border-white bg-red-500 dark:border-gray-900"></div>
          )}
      </div>
    </button>
  );
};
