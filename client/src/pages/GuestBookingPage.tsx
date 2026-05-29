import { useEffect, useState, useReducer } from 'react';
import { Card, Calendar, List, Button, Modal, Form, Input, Spin, Avatar, Tag } from 'antd';
import { LeftOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getOwner, listEventTypes, listSlots, createAppointment } from '../api/endpoints';
import type { Owner, EventType, Slot } from '../api/types';

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
  const [owner, setOwner] = useState<Owner | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slotsState, dispatch] = useReducer(slotsReducer, { status: 'idle' });
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getOwner().then(setOwner);
  }, []);

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

  const canContinue = !!selectedType && !!selectedDate && !!selectedSlot?.isAvailable;

  const handleSubmit = async (values: { email: string; username: string; comment?: string }) => {
    if (!selectedSlot || !selectedType) return;
    try {
      await createAppointment({
        eventTypeId: selectedType,
        timeSlotId: selectedSlot.id,
        guest: {
          email: values.email,
          username: values.username,
          comment: values.comment ?? null,
        },
      });
      setModalOpen(false);
      form.resetFields();
    } catch {
      // silent — no notifications per requirements
    }
  };

  return (
    <Card style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: 0,
          minHeight: 520,
        }}
      >
        {/* ========== LEFT: Owner + Event Types ========== */}
        <div
          style={{
            width: '30%',
            paddingRight: 24,
            borderRight: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar size={64} icon={<UserOutlined />} />
            {owner && (
              <div
                style={{
                  marginTop: 8,
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: 1.4,
                }}
              >
                {owner.username}
              </div>
            )}
          </div>

          <div
            style={{
              fontWeight: 500,
              marginBottom: 12,
              color: '#8c8c8c',
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Типы встреч
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <List
              dataSource={eventTypes}
              renderItem={(item) => {
                const active = selectedType === item.id;
                return (
                  <List.Item
                    onClick={() => {
                      setSelectedType(item.id);
                      setSelectedSlot(null);
                    }}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 12px',
                      borderRadius: 6,
                      background: active ? '#e6f4ff' : '#fafafa',
                      border: active ? '1px solid #91caff' : '1px solid #e8e8e8',
                      marginBottom: 4,
                      transition: 'all 0.15s',
                    }}
                  >
                    <List.Item.Meta
                      title={<span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>}
                      description={
                        item.description ? (
                          <span style={{ fontSize: 12, color: '#8c8c8c' }}>{item.description}</span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#bfbfbf' }}>
                            Описание отсутствует
                          </span>
                        )
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        </div>

        {/* ========== CENTER: Calendar ========== */}
        <div
          style={{
            width: '40%',
            padding: '0 24px',
            borderRight: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Calendar
            fullscreen={false}
            defaultValue={dayjs()}
            onSelect={(date) => {
              setSelectedDate(date.format('YYYY-MM-DD'));
              setSelectedSlot(null);
            }}
            headerRender={({ value, onChange }) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 0 8px',
                }}
              >
                <Button
                  type="text"
                  icon={<LeftOutlined />}
                  onClick={() => onChange(dayjs(value).subtract(1, 'month'))}
                />
                <span style={{ fontWeight: 500, fontSize: 14 }}>
                  {dayjs(value).format('MMMM YYYY')}
                </span>
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  onClick={() => onChange(dayjs(value).add(1, 'month'))}
                />
              </div>
            )}
            disabledDate={(current) => {
              const today = dayjs().startOf('day');
              const maxDate = today.add(13, 'day');
              return current.isBefore(today, 'day') || current.isAfter(maxDate, 'day');
            }}
          />
        </div>

        {/* ========== RIGHT: Slots + Button ========== */}
        <div
          style={{
            width: '30%',
            paddingLeft: 24,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontWeight: 500,
              marginBottom: 12,
              color: '#8c8c8c',
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Доступное время
          </div>

          {!selectedType || !selectedDate ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#bfbfbf',
              }}
            >
              Выберите тип встречи и дату
            </div>
          ) : slotsState.status === 'loading' ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spin />
            </div>
          ) : slotsState.status !== 'loaded' ? null : slotsState.data.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8c8c8c',
              }}
            >
              Нет доступного времени на выбранную дату
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
              <List
                dataSource={slotsState.data}
                renderItem={(slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <List.Item
                      onClick={() => {
                        if (slot.isAvailable) setSelectedSlot(slot);
                      }}
                      style={{
                        cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                        padding: '10px 12px',
                        borderRadius: 6,
                        background: isSelected ? '#e6f4ff' : 'transparent',
                        border: isSelected ? '1px solid #91caff' : '1px solid transparent',
                        marginBottom: 4,
                        opacity: slot.isAvailable ? 1 : 0.5,
                        transition: 'all 0.15s',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          {dayjs(slot.timeStart).format('HH:mm')} —{' '}
                          {dayjs(slot.timeEnd).format('HH:mm')}
                        </span>
                        <Tag color={slot.isAvailable ? 'green' : 'default'}>
                          {slot.isAvailable ? 'свободно' : 'занято'}
                        </Tag>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
          )}

          <Button
            type="primary"
            size="large"
            disabled={!canContinue}
            onClick={() => setModalOpen(true)}
            style={{ width: '100%' }}
          >
            Продолжить
          </Button>
        </div>
      </div>

      <Modal
        title="Подтверждение брони"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Записаться"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="comment" label="Комментарий">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
