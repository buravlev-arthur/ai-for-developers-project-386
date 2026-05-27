import { Typography, Button, Card, Row, Col, List } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const features = [
  { text: 'Бронирование за пару кликов' },
  { text: 'Выбор удобного времени из свободных слотов' },
  { text: 'Напоминания о предстоящих встречах' },
  { text: 'Управление типами событий в личном кабинете' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Row>
      <Col xs={24} md={14} xl={16}>
        <Title style={{ fontSize: 48, marginBottom: 16 }}>Календарь Cal.me</Title>
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
        <Button type="primary" size="large" onClick={() => navigate('/booking')}>
          Записаться <ArrowRightOutlined />
        </Button>
      </Col>
      <Col xs={24} md={10} xl={8}>
        <Card
          title="Возможности"
          style={{ borderRadius: 12 }}
          styles={{
            header: { borderBottom: 'none' },
            body: { paddingTop: 12 },
          }}
        >
          <List
            dataSource={features}
            renderItem={(item) => (
              <List.Item style={{ border: 'none' }}>
                <List.Item.Meta
                  avatar={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  title={item.text}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
