import { useEffect, useState, useReducer } from 'react';
import {
  Card,
  Select,
  DatePicker,
  List,
  Button,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Alert,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import { listEventTypes, listSlots, createAppointment } from '../api/endpoints';
import type { EventType, Slot } from '../api/types';

const { Title } = Typography;

type SlotsState = { status: 'idle' } | { status: 'loading' } | { status: 'loaded'; data: Slot[] };

type SlotsAction = { type: 'RESET' } | { type: 'LOAD' } | { type: 'DONE'; data: Slot[] };

function slotsReducer(_state: SlotsState, action: SlotsAction): SlotsState {
  switch (action.type) {
    case 'RESET':
      return { status: 'idle' };
    case 'LOAD':
      return { status: 'loading' };
    case 'DONE':
      return { status: 'loaded', data: action.data };
  }
}

export default function GuestBookingPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotsState, dispatch] = useReducer(slotsReducer, { status: 'idle' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    listEventTypes().then(setEventTypes);
  }, []);

  useEffect(() => {
    if (!selectedType || !selectedDate) {
      dispatch({ type: 'RESET' });
      return;
    }
    dispatch({ type: 'LOAD' });
    listSlots(selectedType, selectedDate).then((data) => dispatch({ type: 'DONE', data }));
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
      <Title level={2} style={{ textAlign: 'center' }}>
        Забронировать время
      </Title>

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
        ) : slotsState.status === 'loading' ? (
          <Spin />
        ) : slotsState.status === 'idle' ? (
          <Alert message="Нет доступных слотов на выбранную дату" type="warning" />
        ) : slotsState.data.length === 0 ? (
          <Alert message="Нет доступных слотов на выбранную дату" type="warning" />
        ) : (
          <List
            dataSource={slotsState.data}
            renderItem={(slot) => (
              <List.Item
                actions={[
                  <Button key="book" type="primary" onClick={() => handleBook(slot)}>
                    Забронировать
                  </Button>,
                ]}
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
