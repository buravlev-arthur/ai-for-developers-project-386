import { useEffect, useState } from 'react';
import { Calendar, Badge, Card, Spin } from 'antd';
import type { Dayjs } from 'dayjs';
import { listAppointments } from '../api/endpoints';
import type { Appointment } from '../api/types';

export default function OwnerCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const dateCellRender = (value: Dayjs) => {
    const dayAppointments = appointments.filter((a) => value.isSame(a.timeSlot.timeStart, 'day'));

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayAppointments.map((a) => (
          <li key={a.id}>
            <Badge
              status="success"
              text={`${a.timeSlot.timeStart.slice(11, 16)} — ${a.guest.username}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  return (
    <Card title="Брони">
      <Calendar cellRender={(value) => dateCellRender(value as Dayjs)} />
    </Card>
  );
}
