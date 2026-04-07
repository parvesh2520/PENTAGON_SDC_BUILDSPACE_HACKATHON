/*
  Notifications.jsx
  -----------------
  Futuristic notification inbox page.
*/

import PageWrapper from "../components/layout/PageWrapper";
import NotificationList from "../components/notifications/NotificationList";

export default function Notifications() {
  return (
    <PageWrapper className="max-w-2xl">
      <NotificationList />
    </PageWrapper>
  );
}
