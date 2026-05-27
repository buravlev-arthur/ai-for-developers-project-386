import { Typography, Button, Card, Row, Col, List } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined, CalendarOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const features = [
  { icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />, text: 'Бронирование за пару кликов' },
  { icon: <CalendarOutlined style={{ color: '#1890ff' }} />, text: 'Выбор удобного времени из свободных слотов' },
  { icon: <BellOutlined style={{ color: '#faad14' }} />, text: 'Напоминания о предстоящих встречах' },
  { icon: <SettingOutlined style={{ color: '#722ed1' }} />, text: 'Управление типами событий в личном кабинете' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Row
      style={{ minHeight: 'calc(100vh - 64px)', padding: '80px 48px 0' }}
    >
      <Col xs={24} md={14} xl={16}>
        <Title style={{ fontSize: 48, marginBottom: 16 }}>
          Календарь Cal.me
        </Title>
        <Paragraph
          style={{
            fontSize: 18,
            color: '#595959',
            maxWidth: 480,
            marginBottom: 32,
          }}
        >
          Выберите тип события и забронируйте встречу в пару шагов удобное время
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/booking')}
        >
          Записаться <ArrowRightOutlined />
        </Button>
      </Col>
      <Col xs={24} md={10} xl={8}>
        <Card title="Возможности" style={{ borderRadius: 12 }}>
          <List
            dataSource={features}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta avatar={item.icon} title={item.text} />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
