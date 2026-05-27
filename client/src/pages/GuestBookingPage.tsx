import { useEffect, useState } from 'react';
import { Card, Select, DatePicker, List, Button, Modal, Form, Input, message, Typography, Alert, Spin } from 'antd';
import dayjs from 'dayjs';
import { listEventTypes, listSlots, createAppointment } from '../api/endpoints';
import type { EventType, Slot } from '../api/types';

const { Title } = Typography;

export default function GuestBookingPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    listEventTypes().then(setEventTypes);
  }, []);

  useEffect(() => {
    if (!selectedType || !selectedDate) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    listSlots(selectedType, selectedDate)
      .then(setSlots)
      .finally(() => setSlotsLoading(false));
  }, [selectedType, selectedDate]);

  const handleBook = (slot: Slot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleSubmit = async (values: { email: string; username: string; comment?: string }) => {
    if (!selectedSlot || !selectedType) return;

    try {
      await createAppointment({
        eventTypeId: selectedType,
        timeSlotId: selectedSlot.id,
        guest: { email: values.email, username: values.username, comment: values.comment ?? null },
      });
      message.success('Бронь подтверждена!');
      setModalOpen(false);
      form.resetFields();
    } catch {
      message.error('Ошибка при бронировании');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 16 }}>
      <Title level={2} style={{ textAlign: 'center' }}>Забронировать время</Title>

      <Card>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Select
            placeholder="Выберите тип события"
            style={{ flex: 1 }}
            value={selectedType}
            onChange={setSelectedType}
            options={eventTypes.map((et) => ({ label: et.name, value: et.id }))}
          />
          <DatePicker
            placeholder="Выберите дату"
            value={selectedDate ? dayjs(selectedDate) : null}
            onChange={(date) => setSelectedDate(date?.toISOString() ?? null)}
          />
        </div>

        {!selectedType || !selectedDate ? (
          <Alert message="Выберите тип события и дату для просмотра доступных слотов" type="info" />
        ) : slotsLoading ? (
          <Spin />
        ) : slots.length === 0 ? (
          <Alert message="Нет доступных слотов на выбранную дату" type="warning" />
        ) : (
          <List
            dataSource={slots}
            renderItem={(slot) => (
              <List.Item
                actions={[<Button type="primary" onClick={() => handleBook(slot)}>Забронировать</Button>]}
              >
                <List.Item.Meta
                  title={`${dayjs(slot.timeStart).format('HH:mm')} — ${dayjs(slot.timeEnd).format('HH:mm')}`}
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Modal
        title="Подтверждение брони"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="username" label="Имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="comment" label="Комментарий">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
